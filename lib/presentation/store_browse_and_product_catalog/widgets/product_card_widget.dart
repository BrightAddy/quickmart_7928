import 'package:flutter/material.dart';
import 'package:sizer/sizer.dart';

import '../../../core/app_export.dart';

class ProductCardWidget extends StatefulWidget {
  final Map<String, dynamic> product;
  final VoidCallback onTap;
  final VoidCallback onAddToCart;
  final VoidCallback onAddToWishlist;
  final VoidCallback onShare;

  const ProductCardWidget({
    Key? key,
    required this.product,
    required this.onTap,
    required this.onAddToCart,
    required this.onAddToWishlist,
    required this.onShare,
  }) : super(key: key);

  @override
  State<ProductCardWidget> createState() => _ProductCardWidgetState();
}

class _ProductCardWidgetState extends State<ProductCardWidget>
    with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _scaleAnimation;
  bool _isPressed = false;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 150),
      vsync: this,
    );
    _scaleAnimation = Tween<double>(
      begin: 1.0,
      end: 0.95,
    ).animate(CurvedAnimation(
      parent: _animationController,
      curve: Curves.easeInOut,
    ));
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  void _onTapDown(TapDownDetails details) {
    setState(() => _isPressed = true);
    _animationController.forward();
  }

  void _onTapUp(TapUpDetails details) {
    setState(() => _isPressed = false);
    _animationController.reverse();
  }

  void _onTapCancel() {
    setState(() => _isPressed = false);
    _animationController.reverse();
  }

  void _showQuickActions() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (context) => Container(
        decoration: BoxDecoration(
          color: AppTheme.lightTheme.colorScheme.surface,
          borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
        ),
        padding: EdgeInsets.all(4.w),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 12.w,
              height: 0.5.h,
              decoration: BoxDecoration(
                color: AppTheme.lightTheme.dividerColor,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            SizedBox(height: 2.h),
            ListTile(
              leading: CustomIconWidget(
                iconName: 'favorite_border',
                color: AppTheme.lightTheme.primaryColor,
                size: 24,
              ),
              title: Text(
                'Add to Wishlist',
                style: AppTheme.lightTheme.textTheme.bodyMedium,
              ),
              onTap: () {
                Navigator.pop(context);
                widget.onAddToWishlist();
              },
            ),
            ListTile(
              leading: CustomIconWidget(
                iconName: 'share',
                color: AppTheme.lightTheme.primaryColor,
                size: 24,
              ),
              title: Text(
                'Share Product',
                style: AppTheme.lightTheme.textTheme.bodyMedium,
              ),
              onTap: () {
                Navigator.pop(context);
                widget.onShare();
              },
            ),
            ListTile(
              leading: CustomIconWidget(
                iconName: 'visibility',
                color: AppTheme.lightTheme.primaryColor,
                size: 24,
              ),
              title: Text(
                'View Similar',
                style: AppTheme.lightTheme.textTheme.bodyMedium,
              ),
              onTap: () {
                Navigator.pop(context);
                // Handle view similar
              },
            ),
            SizedBox(height: 2.h),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final String name = widget.product['name'] ?? 'Product';
    final String price = widget.product['price'] ?? 'GHS 0.00';
    final String imageUrl = widget.product['imageUrl'] ?? '';
    final bool isInStock = widget.product['inStock'] ?? true;
    final double rating = (widget.product['rating'] ?? 0.0).toDouble();

    return AnimatedBuilder(
      animation: _scaleAnimation,
      builder: (context, child) {
        return Transform.scale(
          scale: _scaleAnimation.value,
          child: GestureDetector(
            onTap: widget.onTap,
            onTapDown: _onTapDown,
            onTapUp: _onTapUp,
            onTapCancel: _onTapCancel,
            onLongPress: _showQuickActions,
            child: Container(
              decoration: BoxDecoration(
                color: AppTheme.lightTheme.colorScheme.surface,
                borderRadius: BorderRadius.circular(12),
                boxShadow: [
                  BoxShadow(
                    color: AppTheme.lightTheme.shadowColor,
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Product Image
                  Expanded(
                    flex: 3,
                    child: Container(
                      width: double.infinity,
                      decoration: const BoxDecoration(
                        borderRadius: BorderRadius.vertical(
                          top: Radius.circular(12),
                        ),
                      ),
                      child: ClipRRect(
                        borderRadius: const BorderRadius.vertical(
                          top: Radius.circular(12),
                        ),
                        child: Stack(
                          children: [
                            CustomImageWidget(
                              imageUrl: imageUrl,
                              width: double.infinity,
                              height: double.infinity,
                              fit: BoxFit.cover,
                            ),
                            if (!isInStock)
                              Container(
                                width: double.infinity,
                                height: double.infinity,
                                color: Colors.black.withValues(alpha: 0.5),
                                child: Center(
                                  child: Container(
                                    padding: EdgeInsets.symmetric(
                                      horizontal: 3.w,
                                      vertical: 1.h,
                                    ),
                                    decoration: BoxDecoration(
                                      color:
                                          AppTheme.lightTheme.colorScheme.error,
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    child: Text(
                                      'Out of Stock',
                                      style: AppTheme
                                          .lightTheme.textTheme.labelSmall
                                          ?.copyWith(
                                        color: AppTheme
                                            .lightTheme.colorScheme.onError,
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                            if (rating > 0)
                              Positioned(
                                top: 1.h,
                                right: 2.w,
                                child: Container(
                                  padding: EdgeInsets.symmetric(
                                    horizontal: 2.w,
                                    vertical: 0.5.h,
                                  ),
                                  decoration: BoxDecoration(
                                    color: Colors.black.withValues(alpha: 0.7),
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  child: Row(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      CustomIconWidget(
                                        iconName: 'star',
                                        color: Colors.amber,
                                        size: 12,
                                      ),
                                      SizedBox(width: 1.w),
                                      Text(
                                        rating.toStringAsFixed(1),
                                        style: AppTheme
                                            .lightTheme.textTheme.labelSmall
                                            ?.copyWith(
                                          color: Colors.white,
                                          fontSize: 10.sp,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                          ],
                        ),
                      ),
                    ),
                  ),
                  // Product Details
                  Expanded(
                    flex: 2,
                    child: Padding(
                      padding: EdgeInsets.all(3.w),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Product Name
                          Expanded(
                            child: Text(
                              name,
                              style: AppTheme.lightTheme.textTheme.bodyMedium
                                  ?.copyWith(
                                fontWeight: FontWeight.w500,
                              ),
                              maxLines: 2,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                          SizedBox(height: 1.h),
                          // Price and Add to Cart
                          Row(
                            children: [
                              Expanded(
                                child: Text(
                                  price,
                                  style: AppTheme
                                      .lightTheme.textTheme.titleSmall
                                      ?.copyWith(
                                    color: AppTheme.lightTheme.primaryColor,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ),
                              GestureDetector(
                                onTap: isInStock ? widget.onAddToCart : null,
                                child: Container(
                                  padding: EdgeInsets.all(2.w),
                                  decoration: BoxDecoration(
                                    color: isInStock
                                        ? AppTheme.lightTheme.primaryColor
                                        : AppTheme.lightTheme.dividerColor,
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: CustomIconWidget(
                                    iconName: 'add_shopping_cart',
                                    color: isInStock
                                        ? AppTheme
                                            .lightTheme.colorScheme.onPrimary
                                        : AppTheme
                                            .lightTheme.colorScheme.onSurface
                                            .withValues(alpha: 0.5),
                                    size: 16,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}
