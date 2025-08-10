import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  Alert,
  ActivityIndicator,
  useWindowDimensions
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { 
  CreditCard, 
  MapPin, 
  ChevronRight, 
  Check, 
  ArrowLeft,
  ShoppingBag
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import Button from '@/components/Button';
import { useCartStore } from '@/store/cart-store';
import { useAuthStore } from '@/store/auth-store';
import { useOrderStore } from '@/store/order-store';
import { Customer, Address, PaymentMethod } from '@/types';

export default function CheckoutScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { cart, getCartTotal, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const { createOrder } = useOrderStore();
  const { width } = useWindowDimensions();
  
  // Responsive breakpoints
  const isSmallScreen = width < 380;
  const isMediumScreen = width >= 380 && width < 768;
  const isLargeScreen = width >= 768;
  
  const customer = user as Customer;
  
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  
  const steps = [
    { title: 'Review Order', icon: ShoppingBag },
    { title: 'Delivery Address', icon: MapPin },
    { title: 'Payment Method', icon: CreditCard },
    { title: 'Confirmation', icon: Check }
  ];
  
  useEffect(() => {
    // Set default address and payment method
    if (customer?.addresses?.length > 0) {
      const defaultAddr = customer.addresses.find(addr => addr.isDefault) || customer.addresses[0];
      setSelectedAddress(defaultAddr);
    }
    
    if (customer?.paymentMethods?.length > 0) {
      const defaultPayment = customer.paymentMethods.find(pm => pm.isDefault) || customer.paymentMethods[0];
      setSelectedPayment(defaultPayment);
    }
  }, [customer]);
  
  // Redirect if no cart or user
  useEffect(() => {
    if (!cart || cart.items.length === 0) {
      router.replace('/(customer)/cart');
    }
    
    if (!user || user.role !== 'customer') {
      router.replace('/(auth)');
    }
  }, [cart, user]);
  
  const handlePlaceOrder = async () => {
    if (!cart || !customer || !selectedAddress || !selectedPayment) {
      Alert.alert('Error', 'Please complete all required information');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Create order
      const order = await createOrder(
        customer.id,
        cart.storeId,
        cart.items,
        selectedAddress,
        selectedPayment
      );
      
      // Set order placed state
      setOrderPlaced(true);
      setOrderId(order.id);
      
      // Clear cart after successful order
      clearCart();
      
      // Move to confirmation step
      setCurrentStep(3);
    } catch (error) {
      console.error("Checkout error:", error);
      Alert.alert(
        "Checkout Failed",
        "There was an error processing your order. Please try again.",
        [{ text: "OK" }]
      );
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleViewOrder = () => {
    if (orderId) {
      router.push({
        pathname: '/order/[id]',
        params: { id: orderId }
      });
    }
  };
  
  const handleContinueShopping = () => {
    router.replace('/(customer)');
  };
  
  const renderStepIndicator = () => (
    <View style={[
      styles.stepIndicator,
      isLargeScreen && styles.stepIndicatorLarge
    ]}>
      {steps.map((step, index) => (
        <View key={index} style={styles.stepItem}>
          <View 
            style={[
              styles.stepCircle, 
              currentStep >= index ? styles.activeStep : styles.inactiveStep,
              isLargeScreen && styles.stepCircleLarge
            ]}
          >
            {currentStep > index ? (
              <Check size={isLargeScreen ? 20 : 16} color={Colors.white} />
            ) : (
              <step.icon size={isLargeScreen ? 20 : 16} color={currentStep >= index ? Colors.white : Colors.subtext} />
            )}
          </View>
          
          <Text 
            style={[
              styles.stepText, 
              currentStep >= index ? styles.activeStepText : styles.inactiveStepText,
              isLargeScreen && styles.stepTextLarge
            ]}
          >
            {step.title}
          </Text>
          
          {index < steps.length - 1 && (
            <View 
              style={[
                styles.stepLine, 
                currentStep > index ? styles.activeStepLine : styles.inactiveStepLine,
                isLargeScreen && styles.stepLineLarge
              ]} 
            />
          )}
        </View>
      ))}
    </View>
  );
  
  const renderOrderReview = () => (
    <View style={[
      styles.stepContent,
      isLargeScreen && styles.stepContentLarge
    ]}>
      <Text style={[
        styles.sectionTitle,
        isLargeScreen && styles.sectionTitleLarge
      ]}>Order Summary</Text>
      
      <View style={styles.storeInfo}>
        <Text style={styles.storeLabel}>Shopping from:</Text>
        <Text style={[
          styles.storeName,
          isLargeScreen && styles.storeNameLarge
        ]}>{cart?.storeName}</Text>
      </View>
      
      <View style={styles.itemsContainer}>
        {cart?.items.map((item) => (
          <View key={item.product.id} style={[
            styles.cartItem,
            isLargeScreen && styles.cartItemLarge
          ]}>
            <Image 
              source={{ uri: item.product.image }} 
              style={[
                styles.productImage,
                isLargeScreen && styles.productImageLarge
              ]}
              resizeMode="cover"
            />
            
            <View style={styles.productInfo}>
              <Text style={[
                styles.productName,
                isLargeScreen && styles.productNameLarge
              ]}>{item.product.name}</Text>
              <Text style={styles.productQuantity}>Qty: {item.quantity}</Text>
            </View>
            
            <Text style={[
              styles.productPrice,
              isLargeScreen && styles.productPriceLarge
            ]}>
              ₵{((item.product.discountPrice || item.product.price) * item.quantity).toFixed(2)}
            </Text>
          </View>
        ))}
      </View>
      
      <View style={styles.summaryContainer}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>₵{getCartTotal().toFixed(2)}</Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Delivery Fee</Text>
          <Text style={styles.summaryValue}>₵10.00</Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.summaryRow}>
          <Text style={[
            styles.totalLabel,
            isLargeScreen && styles.totalLabelLarge
          ]}>Total</Text>
          <Text style={[
            styles.totalValue,
            isLargeScreen && styles.totalValueLarge
          ]}>₵{(getCartTotal() + 10).toFixed(2)}</Text>
        </View>
      </View>
      
      <Button
        title="Continue to Delivery"
        onPress={() => setCurrentStep(1)}
        style={styles.actionButton}
      />
    </View>
  );
  
  const renderDeliveryAddress = () => (
    <View style={[
      styles.stepContent,
      isLargeScreen && styles.stepContentLarge
    ]}>
      <Text style={[
        styles.sectionTitle,
        isLargeScreen && styles.sectionTitleLarge
      ]}>Delivery Address</Text>
      
      {customer?.addresses && customer.addresses.length > 0 ? (
        <View style={[
          styles.addressesContainer,
          isLargeScreen && styles.addressesContainerLarge
        ]}>
          {customer.addresses.map((address) => (
            <TouchableOpacity
              key={address.id}
              style={[
                styles.addressCard,
                selectedAddress?.id === address.id && styles.selectedCard,
                isLargeScreen && styles.addressCardLarge
              ]}
              onPress={() => setSelectedAddress(address)}
            >
              <View style={styles.addressCardContent}>
                <MapPin 
                  size={isLargeScreen ? 24 : 20} 
                  color={selectedAddress?.id === address.id ? Colors.primary : Colors.subtext} 
                />
                
                <View style={styles.addressInfo}>
                  <Text style={[
                    styles.addressName,
                    isLargeScreen && styles.addressNameLarge
                  ]}>{address.name}</Text>
                  <Text style={styles.addressText}>{address.address}</Text>
                  {address.details && (
                    <Text style={styles.addressDetails}>{address.details}</Text>
                  )}
                </View>
              </View>
              
              {selectedAddress?.id === address.id && (
                <View style={styles.selectedIndicator}>
                  <Check size={16} color={Colors.white} />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No addresses found</Text>
          <Button
            title="Add New Address"
            variant="outline"
            onPress={() => router.push('/(customer)/profile')}
            style={styles.emptyStateButton}
          />
        </View>
      )}
      
      <View style={[
        styles.buttonGroup,
        isLargeScreen && styles.buttonGroupLarge
      ]}>
        <Button
          title="Back to Review"
          variant="outline"
          onPress={() => setCurrentStep(0)}
          style={styles.secondaryButton}
        />
        
        <Button
          title="Continue to Payment"
          onPress={() => {
            if (!selectedAddress) {
              Alert.alert('Error', 'Please select a delivery address');
              return;
            }
            setCurrentStep(2);
          }}
          style={styles.primaryButton}
        />
      </View>
    </View>
  );
  
  const renderPaymentMethod = () => (
    <View style={[
      styles.stepContent,
      isLargeScreen && styles.stepContentLarge
    ]}>
      <Text style={[
        styles.sectionTitle,
        isLargeScreen && styles.sectionTitleLarge
      ]}>Payment Method</Text>
      
      {customer?.paymentMethods && customer.paymentMethods.length > 0 ? (
        <View style={[
          styles.paymentMethodsContainer,
          isLargeScreen && styles.paymentMethodsContainerLarge
        ]}>
          {customer.paymentMethods.map((payment) => (
            <TouchableOpacity
              key={payment.id}
              style={[
                styles.paymentCard,
                selectedPayment?.id === payment.id && styles.selectedCard,
                isLargeScreen && styles.paymentCardLarge
              ]}
              onPress={() => setSelectedPayment(payment)}
            >
              <View style={styles.paymentCardContent}>
                <CreditCard 
                  size={isLargeScreen ? 24 : 20} 
                  color={selectedPayment?.id === payment.id ? Colors.primary : Colors.subtext} 
                />
                
                <View style={styles.paymentInfo}>
                  <Text style={[
                    styles.paymentName,
                    isLargeScreen && styles.paymentNameLarge
                  ]}>{payment.name}</Text>
                  <Text style={styles.paymentDetails}>{payment.details}</Text>
                  <Text style={styles.paymentType}>
                    {payment.type === 'momo' ? 'Mobile Money' : 'Card'}
                  </Text>
                </View>
              </View>
              
              {selectedPayment?.id === payment.id && (
                <View style={styles.selectedIndicator}>
                  <Check size={16} color={Colors.white} />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No payment methods found</Text>
          <Button
            title="Add Payment Method"
            variant="outline"
            onPress={() => router.push('/(customer)/profile')}
            style={styles.emptyStateButton}
          />
        </View>
      )}
      
      <View style={[
        styles.orderSummary,
        isLargeScreen && styles.orderSummaryLarge
      ]}>
        <Text style={styles.orderSummaryTitle}>Order Total</Text>
        <Text style={[
          styles.orderSummaryAmount,
          isLargeScreen && styles.orderSummaryAmountLarge
        ]}>₵{(getCartTotal() + 10).toFixed(2)}</Text>
      </View>
      
      <View style={[
        styles.buttonGroup,
        isLargeScreen && styles.buttonGroupLarge
      ]}>
        <Button
          title="Back to Delivery"
          variant="outline"
          onPress={() => setCurrentStep(1)}
          style={styles.secondaryButton}
        />
        
        <Button
          title="Place Order"
          onPress={handlePlaceOrder}
          isLoading={isProcessing}
          style={styles.primaryButton}
        />
      </View>
    </View>
  );
  
  const renderConfirmation = () => (
    <View style={[
      styles.confirmationContainer,
      isLargeScreen && styles.confirmationContainerLarge
    ]}>
      <View style={[
        styles.successIcon,
        isLargeScreen && styles.successIconLarge
      ]}>
        <Check size={isLargeScreen ? 50 : 40} color={Colors.white} />
      </View>
      
      <Text style={[
        styles.confirmationTitle,
        isLargeScreen && styles.confirmationTitleLarge
      ]}>Order Placed Successfully!</Text>
      <Text style={[
        styles.confirmationMessage,
        isLargeScreen && styles.confirmationMessageLarge
      ]}>
        Your order has been placed and is being processed. You can track your order status in the Orders section.
      </Text>
      
      <View style={styles.orderInfo}>
        <Text style={styles.orderInfoLabel}>Order ID:</Text>
        <Text style={[
          styles.orderInfoValue,
          isLargeScreen && styles.orderInfoValueLarge
        ]}>{orderId}</Text>
      </View>
      
      <View style={styles.orderInfo}>
        <Text style={styles.orderInfoLabel}>Total Amount:</Text>
        <Text style={[
          styles.orderInfoValue,
          isLargeScreen && styles.orderInfoValueLarge
        ]}>₵{(getCartTotal() + 10).toFixed(2)}</Text>
      </View>
      
      <View style={[
        styles.confirmationButtons,
        isLargeScreen && styles.confirmationButtonsLarge
      ]}>
        <Button
          title="View Order"
          onPress={handleViewOrder}
          style={styles.confirmationButton}
        />
        
        <Button
          title="Continue Shopping"
          variant="outline"
          onPress={handleContinueShopping}
          style={styles.confirmationButton}
        />
      </View>
    </View>
  );
  
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return renderOrderReview();
      case 1:
        return renderDeliveryAddress();
      case 2:
        return renderPaymentMethod();
      case 3:
        return renderConfirmation();
      default:
        return renderOrderReview();
    }
  };
  
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <Stack.Screen 
        options={{
          title: "Checkout",
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => {
                if (currentStep === 0 || currentStep === 3) {
                  router.back();
                } else {
                  setCurrentStep(currentStep - 1);
                }
              }}
              style={styles.headerButton}
            >
              <ArrowLeft size={24} color={Colors.white} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView 
        contentContainerStyle={[
          styles.scrollContent,
          isLargeScreen && styles.scrollContentLarge
        ]}
        showsVerticalScrollIndicator={false}
      >
        {currentStep < 3 && renderStepIndicator()}
        {renderCurrentStep()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  scrollContentLarge: {
    paddingHorizontal: 40,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  headerButton: {
    padding: 8,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    marginBottom: 8,
  },
  stepIndicatorLarge: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderRadius: 8,
    marginTop: 16,
  },
  stepItem: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  stepCircleLarge: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  activeStep: {
    backgroundColor: Colors.primary,
  },
  inactiveStep: {
    backgroundColor: Colors.border,
  },
  stepText: {
    fontSize: 12,
    textAlign: 'center',
  },
  stepTextLarge: {
    fontSize: 14,
  },
  activeStepText: {
    color: Colors.primary,
    fontWeight: '500',
  },
  inactiveStepText: {
    color: Colors.subtext,
  },
  stepLine: {
    position: 'absolute',
    top: 16,
    right: -50,
    width: 100,
    height: 1,
  },
  stepLineLarge: {
    top: 20,
    right: -50,
    width: 100,
  },
  activeStepLine: {
    backgroundColor: Colors.primary,
  },
  inactiveStepLine: {
    backgroundColor: Colors.border,
  },
  stepContent: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    margin: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  stepContentLarge: {
    padding: 24,
    margin: 16,
    maxWidth: 800,
    alignSelf: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: Colors.text,
  },
  sectionTitleLarge: {
    fontSize: 22,
    marginBottom: 20,
  },
  storeInfo: {
    marginBottom: 16,
  },
  storeLabel: {
    fontSize: 14,
    color: Colors.subtext,
  },
  storeName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  storeNameLarge: {
    fontSize: 18,
  },
  itemsContainer: {
    marginBottom: 16,
  },
  cartItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  cartItemLarge: {
    padding: 16,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 6,
  },
  productImageLarge: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 4,
  },
  productNameLarge: {
    fontSize: 18,
  },
  productQuantity: {
    fontSize: 14,
    color: Colors.subtext,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    alignSelf: 'center',
  },
  productPriceLarge: {
    fontSize: 18,
  },
  summaryContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.subtext,
  },
  summaryValue: {
    fontSize: 14,
    color: Colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  totalLabelLarge: {
    fontSize: 18,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  totalValueLarge: {
    fontSize: 22,
  },
  actionButton: {
    marginTop: 24,
  },
  addressesContainer: {
    marginBottom: 24,
  },
  addressesContainerLarge: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  addressCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.card,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  addressCardLarge: {
    width: '48%',
  },
  selectedCard: {
    borderColor: Colors.primary,
    backgroundColor: Colors.lightPrimary,
  },
  addressCardContent: {
    flexDirection: 'row',
    flex: 1,
  },
  addressInfo: {
    marginLeft: 12,
    flex: 1,
  },
  addressName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 4,
  },
  addressNameLarge: {
    fontSize: 18,
  },
  addressText: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 2,
  },
  addressDetails: {
    fontSize: 14,
    color: Colors.subtext,
  },
  selectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    padding: 24,
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.subtext,
    marginBottom: 16,
  },
  emptyStateButton: {
    minWidth: 200,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  buttonGroupLarge: {
    maxWidth: 500,
    alignSelf: 'center',
  },
  primaryButton: {
    flex: 1,
    marginLeft: 8,
  },
  secondaryButton: {
    flex: 1,
    marginRight: 8,
  },
  paymentMethodsContainer: {
    marginBottom: 24,
  },
  paymentMethodsContainerLarge: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  paymentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.card,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  paymentCardLarge: {
    width: '48%',
  },
  paymentCardContent: {
    flexDirection: 'row',
    flex: 1,
  },
  paymentInfo: {
    marginLeft: 12,
    flex: 1,
  },
  paymentName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 4,
  },
  paymentNameLarge: {
    fontSize: 18,
  },
  paymentDetails: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 2,
  },
  paymentType: {
    fontSize: 14,
    color: Colors.subtext,
  },
  orderSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.lightPrimary,
    borderRadius: 8,
    marginBottom: 24,
  },
  orderSummaryLarge: {
    padding: 20,
  },
  orderSummaryTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  orderSummaryAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  orderSummaryAmountLarge: {
    fontSize: 22,
  },
  confirmationContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: Colors.white,
    margin: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  confirmationContainerLarge: {
    padding: 40,
    maxWidth: 700,
    alignSelf: 'center',
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  successIconLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  confirmationTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  confirmationTitleLarge: {
    fontSize: 28,
  },
  confirmationMessage: {
    fontSize: 16,
    color: Colors.subtext,
    textAlign: 'center',
    marginBottom: 24,
  },
  confirmationMessageLarge: {
    fontSize: 18,
    maxWidth: 500,
  },
  orderInfo: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 8,
  },
  orderInfoLabel: {
    fontSize: 16,
    color: Colors.subtext,
    width: '40%',
  },
  orderInfoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    width: '60%',
  },
  orderInfoValueLarge: {
    fontSize: 18,
  },
  confirmationButtons: {
    width: '100%',
    marginTop: 32,
  },
  confirmationButtonsLarge: {
    maxWidth: 400,
  },
  confirmationButton: {
    marginBottom: 12,
  },
});