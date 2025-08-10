import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Mail, Lock, User, Briefcase } from 'lucide-react-native';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Colors from '@/constants/colors';
import { useAuthStore } from '@/store/auth-store';
import { UserRole } from '@/types';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading, error } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('customer');
  
  const handleLogin = async () => {
    if (!email || !password) {
      return;
    }
    
    try {
      await login(email, password, role);
      
      // Navigate based on role
      if (role === 'customer') {
        router.replace('/(customer)');
      } else if (role === 'employee') {
        router.replace('/(employee)');
      } else if (role === 'store_owner') {
        router.replace('/(store)');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };
  
  // For demo purposes, prefill credentials based on role
  const fillDemoCredentials = (selectedRole: UserRole) => {
    setRole(selectedRole);
    
    if (selectedRole === 'customer') {
      setEmail('kwame@example.com');
      setPassword('password');
    } else if (selectedRole === 'employee') {
      setEmail('kofi@example.com');
      setPassword('password');
    } else if (selectedRole === 'store_owner') {
      setEmail('yaw@example.com');
      setPassword('password');
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Login to your account</Text>
        </View>
        
        <View style={styles.roleSelector}>
          <Text style={styles.roleSelectorLabel}>Select your role:</Text>
          
          <View style={styles.roleButtons}>
            <TouchableOpacity
              style={[
                styles.roleButton,
                role === 'customer' && styles.roleButtonActive
              ]}
              onPress={() => fillDemoCredentials('customer')}
            >
              <User 
                size={24} 
                color={role === 'customer' ? Colors.white : Colors.primary} 
              />
              <Text style={[
                styles.roleButtonText,
                role === 'customer' && styles.roleButtonTextActive
              ]}>
                Customer
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.roleButton,
                role === 'employee' && styles.roleButtonActive
              ]}
              onPress={() => fillDemoCredentials('employee')}
            >
              <User 
                size={24} 
                color={role === 'employee' ? Colors.white : Colors.primary} 
              />
              <Text style={[
                styles.roleButtonText,
                role === 'employee' && styles.roleButtonTextActive
              ]}>
                Employee
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.roleButton,
                role === 'store_owner' && styles.roleButtonActive
              ]}
              onPress={() => fillDemoCredentials('store_owner')}
            >
              <Briefcase 
                size={24} 
                color={role === 'store_owner' ? Colors.white : Colors.primary} 
              />
              <Text style={[
                styles.roleButtonText,
                role === 'store_owner' && styles.roleButtonTextActive
              ]}>
                Store Owner
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.form}>
          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon={<Mail size={20} color={Colors.subtext} />}
          />
          
          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            isPassword
            leftIcon={<Lock size={20} color={Colors.subtext} />}
          />
          
          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}
          
          <Button
            title="Login"
            onPress={handleLogin}
            isLoading={isLoading}
            style={styles.loginButton}
          />
          
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => router.push('/register')}>
              <Text style={styles.registerLink}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.subtext,
  },
  roleSelector: {
    marginBottom: 24,
  },
  roleSelectorLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 12,
  },
  roleButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  roleButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  roleButtonActive: {
    backgroundColor: Colors.primary,
  },
  roleButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.primary,
    marginTop: 4,
  },
  roleButtonTextActive: {
    color: Colors.white,
  },
  form: {
    marginTop: 16,
  },
  errorText: {
    color: Colors.error,
    marginBottom: 16,
  },
  loginButton: {
    marginTop: 16,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  registerText: {
    fontSize: 14,
    color: Colors.subtext,
  },
  registerLink: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary,
    marginLeft: 4,
  },
});