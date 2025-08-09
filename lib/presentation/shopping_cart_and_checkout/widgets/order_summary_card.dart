import 'package:flutter/material.dart';
import 'package:sizer/sizer.dart';

import '../../../core/app_export.dart';

class OrderSummaryCard extends StatelessWidget {
  final double subtotal;
  final double deliveryFee;
  final double total;
  final VoidCallback onAddMoreItems;
  final VoidCallback onProceedToCheckout;

  const OrderSummaryCard({
    Key? key,
    required this.subtotal,
    required this.deliveryFee,
    required this.total,
    required this.onAddMoreItems,
    required this.onProceedToCheckout,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppTheme.lightTheme.colorScheme.surface,
        borderRadius: const BorderRadius.only(
          topLeft: Radius.circular(20),
          topRight: Radius.circular(20),
        ),
        boxShadow: [
          BoxShadow(
            color: AppTheme.lightTheme.colorScheme.shadow,
            blurRadius: 12,
            offset: const Offset(0, -4),
          ),
        ],
      ),
      child: Padding(
        padding: EdgeInsets.all(4.w),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Handle bar
            Container(
              width: 12.w,
              height: 0.5.h,
              decoration: BoxDecoration(
                color: AppTheme.lightTheme.colorScheme.onSurface
                    .withValues(alpha: 0.3),
                borderRadius: BorderRadius.circular(2),
              ),
            ),

            SizedBox(height: 2.h),

            // Order Summary Title
            Row(
              children: [
                CustomIconWidget(
                  iconName: 'receipt_long',
                  color: AppTheme.lightTheme.colorScheme.primary,
                  size: 24,
                ),
                SizedBox(width: 2.w),
                Text(
                  'Order Summary',
                  style: AppTheme.lightTheme.textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),

            SizedBox(height: 2.h),

            // Price breakdown
            Container(
              padding: EdgeInsets.all(4.w),
              decoration: BoxDecoration(
                color: AppTheme.lightTheme.colorScheme.surface,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: AppTheme.lightTheme.colorScheme.outline
                      .withValues(alpha: 0.3),
                ),
              ),
              child: Column(
                children: [
                  _buildPriceRow('Subtotal', subtotal, false),
                  SizedBox(height: 1.h),
                  _buildPriceRow('Delivery Fee', deliveryFee, false),
                  SizedBox(height: 1.h),
                  Divider(
                    color: AppTheme.lightTheme.colorScheme.outline
                        .withValues(alpha: 0.5),
                    thickness: 1,
                  ),
                  SizedBox(height: 1.h),
                  _buildPriceRow('Total', total, true),
                ],
              ),
            ),

            SizedBox(height: 2.h),

            // Add more items button
            SizedBox(
              width: double.infinity,
              child: OutlinedButton.icon(
                onPressed: onAddMoreItems,
                icon: CustomIconWidget(
                  iconName: 'add_shopping_cart',
                  color: AppTheme.lightTheme.colorScheme.primary,
                  size: 20,
                ),
                label: Text(
                  'Add More Items',
                  style: AppTheme.lightTheme.textTheme.labelLarge?.copyWith(
                    color: AppTheme.lightTheme.colorScheme.primary,
                  ),
                ),
                style: OutlinedButton.styleFrom(
                  padding: EdgeInsets.symmetric(vertical: 2.h),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  side: BorderSide(
                    color: AppTheme.lightTheme.colorScheme.primary,
                    width: 1.5,
                  ),
                ),
              ),
            ),

            SizedBox(height: 1.h),

            // Proceed to checkout button
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: onProceedToCheckout,
                icon: CustomIconWidget(
                  iconName: 'payment',
                  color: AppTheme.lightTheme.colorScheme.onPrimary,
                  size: 20,
                ),
                label: Text(
                  'Proceed to Checkout',
                  style: AppTheme.lightTheme.textTheme.labelLarge?.copyWith(
                    color: AppTheme.lightTheme.colorScheme.onPrimary,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.lightTheme.colorScheme.primary,
                  padding: EdgeInsets.symmetric(vertical: 2.5.h),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  elevation: 2,
                ),
              ),
            ),

            // Safe area padding for bottom
            SizedBox(height: MediaQuery.of(context).padding.bottom),
          ],
        ),
      ),
    );
  }

  Widget _buildPriceRow(String label, double amount, bool isTotal) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: isTotal
              ? AppTheme.lightTheme.textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.w600,
                )
              : AppTheme.lightTheme.textTheme.bodyMedium,
        ),
        Text(
          'GHS ${amount.toStringAsFixed(2)}',
          style: isTotal
              ? AppTheme.lightTheme.textTheme.titleMedium?.copyWith(
                  color: AppTheme.lightTheme.colorScheme.primary,
                  fontWeight: FontWeight.w700,
                )
              : AppTheme.lightTheme.textTheme.bodyMedium?.copyWith(
                  fontWeight: FontWeight.w500,
                ),
        ),
      ],
    );
  }
}
