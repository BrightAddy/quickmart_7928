import 'package:flutter/material.dart';
import 'package:sizer/sizer.dart';

import '../../../core/app_export.dart';

class CartItemCard extends StatefulWidget {
  final Map<String, dynamic> item;
  final VoidCallback onDelete;
  final Function(int) onQuantityChanged;
  final Function(String) onNoteChanged;

  const CartItemCard({
    Key? key,
    required this.item,
    required this.onDelete,
    required this.onQuantityChanged,
    required this.onNoteChanged,
  }) : super(key: key);

  @override
  State<CartItemCard> createState() => _CartItemCardState();
}

class _CartItemCardState extends State<CartItemCard>
    with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<Offset> _slideAnimation;
  bool _isSwipedLeft = false;
  int _quantity = 1;
  final TextEditingController _noteController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _quantity = widget.item['quantity'] ?? 1;
    _noteController.text = widget.item['note'] ?? '';

    _animationController = AnimationController(
      duration: const Duration(milliseconds: 300),
      vsync: this,
    );

    _slideAnimation = Tween<Offset>(
      begin: Offset.zero,
      end: const Offset(-0.3, 0),
    ).animate(CurvedAnimation(
      parent: _animationController,
      curve: Curves.easeInOut,
    ));
  }

  @override
  void dispose() {
    _animationController.dispose();
    _noteController.dispose();
    super.dispose();
  }

  void _handleSwipe() {
    if (_isSwipedLeft) {
      _animationController.reverse();
      setState(() => _isSwipedLeft = false);
    } else {
      _animationController.forward();
      setState(() => _isSwipedLeft = true);
    }
  }

  void _updateQuantity(int newQuantity) {
    if (newQuantity > 0) {
      setState(() => _quantity = newQuantity);
      widget.onQuantityChanged(newQuantity);
    }
  }

  void _showDeleteConfirmation() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text(
            'Remove Item',
            style: AppTheme.lightTheme.textTheme.titleMedium,
          ),
          content: Text(
            'Are you sure you want to remove this item from your cart?',
            style: AppTheme.lightTheme.textTheme.bodyMedium,
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: Text(
                'Cancel',
                style:
                    TextStyle(color: AppTheme.lightTheme.colorScheme.onSurface),
              ),
            ),
            ElevatedButton(
              onPressed: () {
                Navigator.of(context).pop();
                widget.onDelete();
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.lightTheme.colorScheme.error,
              ),
              child: Text(
                'Remove',
                style:
                    TextStyle(color: AppTheme.lightTheme.colorScheme.onError),
              ),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final double itemPrice = (widget.item['price'] as double?) ?? 0.0;
    final double totalPrice = itemPrice * _quantity;

    return Container(
      margin: EdgeInsets.symmetric(horizontal: 4.w, vertical: 1.h),
      child: Stack(
        children: [
          // Delete button background
          if (_isSwipedLeft)
            Positioned.fill(
              child: Container(
                decoration: BoxDecoration(
                  color: AppTheme.lightTheme.colorScheme.error,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Align(
                  alignment: Alignment.centerRight,
                  child: Padding(
                    padding: EdgeInsets.only(right: 4.w),
                    child: GestureDetector(
                      onTap: _showDeleteConfirmation,
                      child: Container(
                        padding: EdgeInsets.all(2.w),
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            CustomIconWidget(
                              iconName: 'delete',
                              color: AppTheme.lightTheme.colorScheme.onError,
                              size: 24,
                            ),
                            SizedBox(height: 0.5.h),
                            Text(
                              'Delete',
                              style: TextStyle(
                                color: AppTheme.lightTheme.colorScheme.onError,
                                fontSize: 10.sp,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ),

          // Main card content
          SlideTransition(
            position: _slideAnimation,
            child: GestureDetector(
              onHorizontalDragEnd: (details) {
                if (details.primaryVelocity! < -500) {
                  _handleSwipe();
                } else if (details.primaryVelocity! > 500 && _isSwipedLeft) {
                  _handleSwipe();
                }
              },
              child: Container(
                decoration: BoxDecoration(
                  color: AppTheme.lightTheme.colorScheme.surface,
                  borderRadius: BorderRadius.circular(12),
                  boxShadow: [
                    BoxShadow(
                      color: AppTheme.lightTheme.colorScheme.shadow,
                      blurRadius: 8,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                child: Padding(
                  padding: EdgeInsets.all(4.w),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Product info row
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Product image
                          ClipRRect(
                            borderRadius: BorderRadius.circular(8),
                            child: CustomImageWidget(
                              imageUrl: widget.item['image'] ?? '',
                              width: 20.w,
                              height: 20.w,
                              fit: BoxFit.cover,
                            ),
                          ),
                          SizedBox(width: 3.w),

                          // Product details
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  widget.item['name'] ?? 'Product Name',
                                  style:
                                      AppTheme.lightTheme.textTheme.titleMedium,
                                  maxLines: 2,
                                  overflow: TextOverflow.ellipsis,
                                ),
                                SizedBox(height: 0.5.h),
                                Text(
                                  widget.item['category'] ?? 'Category',
                                  style:
                                      AppTheme.lightTheme.textTheme.bodySmall,
                                ),
                                SizedBox(height: 1.h),
                                Text(
                                  'GHS ${itemPrice.toStringAsFixed(2)}',
                                  style: AppTheme
                                      .lightTheme.textTheme.titleMedium
                                      ?.copyWith(
                                    color:
                                        AppTheme.lightTheme.colorScheme.primary,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ],
                            ),
                          ),

                          // Quantity controls
                          Container(
                            decoration: BoxDecoration(
                              border: Border.all(
                                color: AppTheme.lightTheme.colorScheme.outline,
                              ),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                GestureDetector(
                                  onTap: () => _updateQuantity(_quantity - 1),
                                  child: Container(
                                    padding: EdgeInsets.all(2.w),
                                    child: CustomIconWidget(
                                      iconName: 'remove',
                                      color: _quantity > 1
                                          ? AppTheme
                                              .lightTheme.colorScheme.primary
                                          : AppTheme
                                              .lightTheme.colorScheme.onSurface
                                              .withValues(alpha: 0.5),
                                      size: 18,
                                    ),
                                  ),
                                ),
                                Container(
                                  padding:
                                      EdgeInsets.symmetric(horizontal: 3.w),
                                  child: Text(
                                    _quantity.toString(),
                                    style: AppTheme
                                        .lightTheme.textTheme.titleMedium,
                                  ),
                                ),
                                GestureDetector(
                                  onTap: () => _updateQuantity(_quantity + 1),
                                  child: Container(
                                    padding: EdgeInsets.all(2.w),
                                    child: CustomIconWidget(
                                      iconName: 'add',
                                      color: AppTheme
                                          .lightTheme.colorScheme.primary,
                                      size: 18,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),

                      SizedBox(height: 2.h),

                      // Total price
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'Total:',
                            style: AppTheme.lightTheme.textTheme.bodyMedium,
                          ),
                          Text(
                            'GHS ${totalPrice.toStringAsFixed(2)}',
                            style: AppTheme.lightTheme.textTheme.titleMedium
                                ?.copyWith(
                              color: AppTheme.lightTheme.colorScheme.primary,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ],
                      ),

                      SizedBox(height: 2.h),

                      // Add note section
                      Container(
                        decoration: BoxDecoration(
                          color: AppTheme.lightTheme.colorScheme.surface,
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(
                            color: AppTheme.lightTheme.colorScheme.outline,
                          ),
                        ),
                        child: TextField(
                          controller: _noteController,
                          onChanged: widget.onNoteChanged,
                          decoration: InputDecoration(
                            hintText:
                                'Add note (substitutions, preferences...)',
                            hintStyle: AppTheme.lightTheme.textTheme.bodySmall,
                            border: InputBorder.none,
                            contentPadding: EdgeInsets.all(3.w),
                            prefixIcon: Padding(
                              padding: EdgeInsets.all(3.w),
                              child: CustomIconWidget(
                                iconName: 'note_add',
                                color: AppTheme.lightTheme.colorScheme.onSurface
                                    .withValues(alpha: 0.6),
                                size: 20,
                              ),
                            ),
                          ),
                          maxLines: 2,
                          style: AppTheme.lightTheme.textTheme.bodyMedium,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
