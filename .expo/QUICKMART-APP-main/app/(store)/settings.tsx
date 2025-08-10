import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Package, ShoppingBag, Clock, CheckCircle, LogOut } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useAuthStore } from '@/store/auth-store';
import { StoreOwner } from '@/types';
import { mockStores } from '@/mocks/stores';
import { useProductStore } from '@/store/product-store';
import Button from '@/components/Button';
import { router } from 'expo-router';

export default function StoreSettingsScreen() {
  const { user, logout } = useAuthStore();
  const storeOwner = user as StoreOwner;
  const { products, verifyProduct } = useProductStore();
  
  // Get store data
  const store = mockStores.find(s => s.id === storeOwner?.storeId);
  
  // Get pending products
  const pendingProducts = products.filter(p => 
    p.storeId === storeOwner?.storeId && !p.verified
  );
  
  const [isStoreOpen, setIsStoreOpen] = useState(store?.isOpen || false);
  
  const handleToggleStoreOpen = () => {
    setIsStoreOpen(!isStoreOpen);
    // In a real app, this would update the store status in the backend
  };
  
  const handleVerifyProduct = (productId: string) => {
    Alert.alert(
      "Verify Product",
      "Are you sure you want to verify this product? It will be visible to customers after verification.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Verify", 
          onPress: () => verifyProduct(productId)
        }
      ]
    );
  };
  
  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out of your store account?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Logout", 
          style: "destructive",
          onPress: () => {
            logout();
            router.replace('/(auth)');
          }
        }
      ]
    );
  };
  
  return (
    <ScrollView style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Store Settings</Text>
        <Text style={styles.headerSubtitle}>{store?.name || storeOwner?.businessName}</Text>
      </View>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Store Status</Text>
        </View>
        
        <View style={styles.cardContainer}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Store Open</Text>
              <Text style={styles.settingDescription}>
                When turned off, customers will not be able to place orders
              </Text>
            </View>
            <Switch
              value={isStoreOpen}
              onValueChange={handleToggleStoreOpen}
              trackColor={{ false: Colors.border, true: Colors.primary + '70' }}
              thumbColor={isStoreOpen ? Colors.primary : Colors.white}
            />
          </View>
        </View>
      </View>
      
      {pendingProducts.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pending Verification</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{pendingProducts.length}</Text>
            </View>
          </View>
          
          {pendingProducts.map((product) => (
            <View key={product.id} style={styles.cardContainer}>
              <View style={styles.productRow}>
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productCategory}>{product.category}</Text>
                  <Text style={styles.productPrice}>₵{product.price.toFixed(2)}</Text>
                </View>
                
                <TouchableOpacity 
                  style={styles.verifyButton}
                  onPress={() => handleVerifyProduct(product.id)}
                >
                  <CheckCircle size={16} color={Colors.white} />
                  <Text style={styles.verifyButtonText}>Verify</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Business Hours</Text>
        </View>
        
        <View style={styles.cardContainer}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Opening Time</Text>
              <Text style={styles.timeValue}>{store?.openingHours || '08:00'}</Text>
            </View>
            <Clock size={20} color={Colors.subtext} />
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Closing Time</Text>
              <Text style={styles.timeValue}>{store?.closingHours || '20:00'}</Text>
            </View>
            <Clock size={20} color={Colors.subtext} />
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Store Management</Text>
        </View>
        
        <TouchableOpacity style={styles.cardContainer}>
          <View style={styles.menuItem}>
            <View style={[styles.menuIcon, { backgroundColor: Colors.primary + '20' }]}>
              <Package size={20} color={Colors.primary} />
            </View>
            <Text style={styles.menuText}>Inventory Management</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.cardContainer}>
          <View style={styles.menuItem}>
            <View style={[styles.menuIcon, { backgroundColor: Colors.secondary + '20' }]}>
              <ShoppingBag size={20} color={Colors.secondary} />
            </View>
            <Text style={styles.menuText}>Store Categories</Text>
          </View>
        </TouchableOpacity>
      </View>
      
      {/* Logout Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Account</Text>
        </View>
        
        <View style={styles.logoutContainer}>
          <Button
            title="Logout"
            onPress={handleLogout}
            variant="outline"
            style={styles.logoutButton}
            textStyle={styles.logoutText}
            icon={<LogOut size={18} color={Colors.error} />}
            iconPosition="left"
          />
        </View>
      </View>
      
      {/* Add some bottom padding */}
      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 20,
    backgroundColor: Colors.primary,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.white,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.white,
    opacity: 0.8,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  badge: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardContainer: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: Colors.subtext,
  },
  timeValue: {
    fontSize: 16,
    color: Colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuText: {
    fontSize: 16,
    color: Colors.text,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 14,
    color: Colors.subtext,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  verifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.success,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  verifyButtonText: {
    color: Colors.white,
    fontWeight: '500',
    marginLeft: 6,
  },
  logoutContainer: {
    marginBottom: 12,
  },
  logoutButton: {
    borderColor: Colors.error,
    backgroundColor: Colors.white,
  },
  logoutText: {
    color: Colors.error,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 40,
  },
});