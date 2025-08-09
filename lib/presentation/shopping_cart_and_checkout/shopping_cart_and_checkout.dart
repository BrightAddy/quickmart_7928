import 'package:flutter/material.dart';
import 'package:sizer/sizer.dart';

import '../../core/app_export.dart';
import './widgets/cart_item_card.dart';
import './widgets/checkout_form.dart';
import './widgets/order_summary_card.dart';

class ShoppingCartAndCheckout extends StatefulWidget {
  const ShoppingCartAndCheckout({Key? key}) : super(key: key);

  @override
  State<ShoppingCartAndCheckout> createState() =>
      _ShoppingCartAndCheckoutState();
}

class _ShoppingCartAndCheckoutState extends State<ShoppingCartAndCheckout>
    with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _fadeAnimation;

  bool _showCheckoutForm = false;
  List<Map<String, dynamic>> _cartItems = [];
  double _subtotal = 0.0;
  double _deliveryFee = 5.0;
  double _total = 0.0;

  @override
  void initState() {
    super.initState();
    _initializeAnimations();
    _loadCartData();
    _calculateTotals();
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  void _initializeAnimations() {
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 300),
      vsync: this,
    );

    _fadeAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _animationController,
      curve: Curves.easeInOut,
    ));

    _animationController.forward();
  }

  void _loadCartData() {
    _cartItems = [
      {
        "id": 1,
        "name": "Fresh Tomatoes",
        "category": "Vegetables",
        "price": 12.50,
        "quantity": 2,
        "image":
            "https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=500",
        "note": "Please select ripe ones",
      },
      {
        "id": 2,
        "name": "Whole Wheat Bread",
        "category": "Bakery",
        "price": 8.00,
        "quantity": 1,
        "image":
            "https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=500",
        "note": "",
      },
      {
        "id": 3,
        "name": "Fresh Milk - 1L",
        "category": "Dairy",
        "price": 15.00,
        "quantity": 3,
        "image":
            "https://images.pexels.com/photos/236010/pexels-photo-236010.jpeg?auto=compress&cs=tinysrgb&w=500",
        "note": "Check expiry date",
      },
      {
        "id": 4,
        "name": "Bananas",
        "category": "Fruits",
        "price": 6.00,
        "quantity": 1,
        "image":
            "https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg?auto=compress&cs=tinysrgb&w=500",
        "note": "",
      },
      {
        "id": 5,
        "name": "Rice - 5kg",
        "category": "Grains",
        "price": 45.00,
        "quantity": 1,
        "image":
            "https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg?auto=compress&cs=tinysrgb&w=500",
        "note": "Jasmine rice preferred",
      },
    ];
  }

  void _calculateTotals() {
    _subtotal = _cartItems.fold(0.0, (sum, item) {
      return sum + ((item['price'] as double) * (item['quantity'] as int));
    });
    _total = _subtotal + _deliveryFee;
    setState(() {});
  }

  void _removeItem(int index) {
    setState(() {
      _cartItems.removeAt(index);
    });
    _calculateTotals();

    if (_cartItems.isEmpty) {
      Navigator.pushReplacementNamed(
          context, '/store-browse-and-product-catalog');
    }
  }

  void _updateQuantity(int index, int newQuantity) {
    setState(() {
      _cartItems[index]['quantity'] = newQuantity;
    });
    _calculateTotals();
  }

  void _updateNote(int index, String note) {
    setState(() {
      _cartItems[index]['note'] = note;
    });
  }

  void _showCheckout() {
    setState(() {
      _showCheckoutForm = true;
    });
  }

  void _hideCheckout() {
    setState(() {
      _showCheckoutForm = false;
    });
  }

  void _onCheckoutComplete(Map<String, dynamic> checkoutData) {
    // Handle successful checkout
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Row(
            children: [
              CustomIconWidget(
                iconName: 'check_circle',
                color: AppTheme.lightTheme.colorScheme.tertiary,
                size: 28,
              ),
              SizedBox(width: 2.w),
              Text(
                'Order Placed!',
                style: AppTheme.lightTheme.textTheme.titleLarge?.copyWith(
                  color: AppTheme.lightTheme.colorScheme.tertiary,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Your order has been successfully placed and will be delivered to:',
                style: AppTheme.lightTheme.textTheme.bodyMedium,
              ),
              SizedBox(height: 1.h),
              Container(
                padding: EdgeInsets.all(3.w),
                decoration: BoxDecoration(
                  color: AppTheme.lightTheme.colorScheme.surface,
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(
                    color: AppTheme.lightTheme.colorScheme.outline
                        .withValues(alpha: 0.3),
                  ),
                ),
                child: Text(
                  checkoutData['address'] ?? 'Delivery Address',
                  style: AppTheme.lightTheme.textTheme.bodyMedium?.copyWith(
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
              SizedBox(height: 2.h),
              Text(
                'Order Total: GHS ${_total.toStringAsFixed(2)}',
                style: AppTheme.lightTheme.textTheme.titleMedium?.copyWith(
                  color: AppTheme.lightTheme.colorScheme.primary,
                  fontWeight: FontWeight.w600,
                ),
              ),
              SizedBox(height: 1.h),
              Text(
                'Payment Method: ${_getPaymentMethodName(checkoutData['paymentMethod'])}',
                style: AppTheme.lightTheme.textTheme.bodyMedium,
              ),
            ],
          ),
          actions: [
            ElevatedButton(
              onPressed: () {
                Navigator.of(context).pop();
                Navigator.pushReplacementNamed(
                    context, '/customer-home-dashboard');
              },
              child: Text(
                'Track Order',
                style: TextStyle(
                  color: AppTheme.lightTheme.colorScheme.onPrimary,
                ),
              ),
            ),
          ],
        );
      },
    );
  }

  String _getPaymentMethodName(String? methodId) {
    switch (methodId) {
      case 'mtn_momo':
        return 'MTN Mobile Money';
      case 'vodafone_cash':
        return 'Vodafone Cash';
      case 'card':
        return 'Credit/Debit Card';
      case 'cash':
        return 'Cash on Delivery';
      default:
        return 'Unknown';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.lightTheme.scaffoldBackgroundColor,
      appBar: AppBar(
        backgroundColor: AppTheme.lightTheme.appBarTheme.backgroundColor,
        elevation: 0,
        leading: IconButton(
          onPressed: () {
            if (_showCheckoutForm) {
              _hideCheckout();
            } else {
              Navigator.pop(context);
            }
          },
          icon: CustomIconWidget(
            iconName: 'arrow_back',
            color: AppTheme.lightTheme.appBarTheme.foregroundColor!,
            size: 24,
          ),
        ),
        title: Text(
          _showCheckoutForm ? 'Checkout' : 'Cart',
          style: AppTheme.lightTheme.appBarTheme.titleTextStyle,
        ),
        actions: [
          if (!_showCheckoutForm) ...[
            Container(
              margin: EdgeInsets.only(right: 4.w),
              padding: EdgeInsets.symmetric(horizontal: 3.w, vertical: 1.h),
              decoration: BoxDecoration(
                color: AppTheme.lightTheme.colorScheme.primary
                    .withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  CustomIconWidget(
                    iconName: 'shopping_cart',
                    color: AppTheme.lightTheme.colorScheme.primary,
                    size: 16,
                  ),
                  SizedBox(width: 1.w),
                  Text(
                    '${_cartItems.length}',
                    style: AppTheme.lightTheme.textTheme.labelMedium?.copyWith(
                      color: AppTheme.lightTheme.colorScheme.primary,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ],
      ),
      body: FadeTransition(
        opacity: _fadeAnimation,
        child: _cartItems.isEmpty
            ? _buildEmptyCart()
            : _showCheckoutForm
                ? _buildCheckoutView()
                : _buildCartView(),
      ),
    );
  }

  Widget _buildEmptyCart() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          CustomIconWidget(
            iconName: 'shopping_cart_outlined',
            color: AppTheme.lightTheme.colorScheme.onSurface
                .withValues(alpha: 0.5),
            size: 80,
          ),
          SizedBox(height: 2.h),
          Text(
            'Your cart is empty',
            style: AppTheme.lightTheme.textTheme.titleLarge?.copyWith(
              color: AppTheme.lightTheme.colorScheme.onSurface
                  .withValues(alpha: 0.7),
            ),
          ),
          SizedBox(height: 1.h),
          Text(
            'Add some items to get started',
            style: AppTheme.lightTheme.textTheme.bodyMedium?.copyWith(
              color: AppTheme.lightTheme.colorScheme.onSurface
                  .withValues(alpha: 0.5),
            ),
          ),
          SizedBox(height: 4.h),
          ElevatedButton.icon(
            onPressed: () {
              Navigator.pushReplacementNamed(
                  context, '/store-browse-and-product-catalog');
            },
            icon: CustomIconWidget(
              iconName: 'shopping_bag',
              color: AppTheme.lightTheme.colorScheme.onPrimary,
              size: 20,
            ),
            label: Text(
              'Start Shopping',
              style: TextStyle(
                color: AppTheme.lightTheme.colorScheme.onPrimary,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCartView() {
    return Column(
      children: [
        // Cart items list
        Expanded(
          child: ListView.builder(
            padding: EdgeInsets.only(top: 1.h, bottom: 2.h),
            itemCount: _cartItems.length,
            itemBuilder: (context, index) {
              return CartItemCard(
                item: _cartItems[index],
                onDelete: () => _removeItem(index),
                onQuantityChanged: (quantity) =>
                    _updateQuantity(index, quantity),
                onNoteChanged: (note) => _updateNote(index, note),
              );
            },
          ),
        ),

        // Order summary (sticky bottom)
        OrderSummaryCard(
          subtotal: _subtotal,
          deliveryFee: _deliveryFee,
          total: _total,
          onAddMoreItems: () {
            Navigator.pushNamed(context, '/store-browse-and-product-catalog');
          },
          onProceedToCheckout: _showCheckout,
        ),
      ],
    );
  }

  Widget _buildCheckoutView() {
    return CheckoutForm(
      onCheckoutComplete: _onCheckoutComplete,
    );
  }
}
