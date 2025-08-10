import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Customer, Employee, StoreOwner, UserRole, Address, PaymentMethod, VerificationRecord } from '@/types';
import { mockCustomers, mockEmployees, mockStoreOwners } from '@/mocks/users';

type User = Customer | Employee | StoreOwner;

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  register: (userData: Partial<User>, role: UserRole) => Promise<void>;
  updateUser: (userData: User) => void;
  verifyEmployee: (selfieImage: string, location?: { latitude: number, longitude: number }) => Promise<boolean>;
  isEmployeeVerifiedForToday: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      login: async (email, password, role) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call delay with timeout
          await Promise.race([
            new Promise(resolve => setTimeout(resolve, 1000)),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Login timeout')), 5000)
            )
          ]);
          
          let user: User | undefined;
          
          // Find user based on role
          if (role === 'customer') {
            user = mockCustomers.find(u => u.email === email);
          } else if (role === 'employee') {
            user = mockEmployees.find(u => u.email === email);
          } else if (role === 'store_owner') {
            user = mockStoreOwners.find(u => u.email === email);
          }
          
          if (user) {
            set({ user, isAuthenticated: true, isLoading: false });
          } else {
            set({ error: 'Invalid credentials', isLoading: false });
          }
        } catch (error) {
          console.log('Login error:', error);
          set({ error: 'Login failed. Please try again.', isLoading: false });
        }
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
      
      register: async (userData, role) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call delay with timeout
          await Promise.race([
            new Promise(resolve => setTimeout(resolve, 1500)),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Registration timeout')), 5000)
            )
          ]);
          
          // Create a new user with mock ID and timestamp
          const newUser = {
            id: `${role[0]}${Date.now()}`,
            createdAt: Date.now(),
            role,
            ...userData,
          } as User;
          
          // If employee, add verification status
          if (role === 'employee') {
            const employeeData = newUser as Employee;
            if (!employeeData.verificationStatus) {
              employeeData.verificationStatus = {
                isVerified: false,
                ghanaCardVerified: !!employeeData.ghanaCardId && !!employeeData.ghanaCardFrontImage && !!employeeData.ghanaCardBackImage,
                selfieVerified: false,
                documentationComplete: !!employeeData.ghanaCardId && !!employeeData.nextOfKin
              };
            }
          }
          
          set({ user: newUser, isAuthenticated: true, isLoading: false });
        } catch (error) {
          console.log('Registration error:', error);
          set({ error: 'Registration failed. Please try again.', isLoading: false });
        }
      },
      
      updateUser: (userData) => {
        set({ user: userData });
      },
      
      verifyEmployee: async (selfieImage, location) => {
        const { user } = get();
        
        if (!user || user.role !== 'employee') {
          return false;
        }
        
        set({ isLoading: true });
        
        try {
          // Simulate API verification delay with timeout
          await Promise.race([
            new Promise(resolve => setTimeout(resolve, 2000)),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Verification timeout')), 5000)
            )
          ]);
          
          const employee = user as Employee;
          const newVerificationRecord: VerificationRecord = {
            timestamp: Date.now(),
            selfieImage,
            status: 'approved',
            location
          };
          
          const updatedEmployee: Employee = {
            ...employee,
            verificationStatus: {
              ...employee.verificationStatus,
              isVerified: true,
              selfieVerified: true
            },
            lastVerifiedAt: Date.now(),
            verificationHistory: [
              ...(employee.verificationHistory || []),
              newVerificationRecord
            ]
          };
          
          set({ 
            user: updatedEmployee,
            isLoading: false
          });
          
          return true;
        } catch (error) {
          set({ isLoading: false });
          return false;
        }
      },
      
      isEmployeeVerifiedForToday: () => {
        const { user } = get();
        
        if (!user || user.role !== 'employee') {
          return false;
        }
        
        const employee = user as Employee;
        
        if (!employee.verificationStatus?.isVerified || !employee.lastVerifiedAt) {
          return false;
        }
        
        // Check if verified within the last 12 hours
        const twelveHoursInMs = 12 * 60 * 60 * 1000;
        return (Date.now() - employee.lastVerifiedAt) < twelveHoursInMs;
      }
    }),
    {
      name: 'quickmart-auth',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);