import 'package:flutter/material.dart';
import 'package:sizer/sizer.dart';

import '../../../core/app_export.dart';

class StoreHeaderWidget extends StatelessWidget {
  final Map<String, dynamic> storeData;
  final VoidCallback onBackPressed;

  const StoreHeaderWidget({
    Key? key,
    required this.storeData,
    required this.onBackPressed,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final String storeName = storeData['name'] ?? 'Store';
    final double rating = (storeData['rating'] ?? 0.0).toDouble();
    final String deliveryTime = storeData['deliveryTime'] ?? '30-45 min';
    final String storeImage = storeData['imageUrl'] ?? '';

    return Container(
      padding: EdgeInsets.symmetric(horizontal: 4.w, vertical: 2.h),
      decoration: BoxDecoration(
        color: AppTheme.lightTheme.colorScheme.surface,
        boxShadow: [
          BoxShadow(
            color: AppTheme.lightTheme.shadowColor,
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          // Back Button
          GestureDetector(
            onTap: onBackPressed,
            child: Container(
              padding: EdgeInsets.all(2.w),
              decoration: BoxDecoration(
                color: AppTheme.lightTheme.colorScheme.surface,
                borderRadius: BorderRadius.circular(8),
                border: Border.all(
                  color: AppTheme.lightTheme.dividerColor,
                  width: 1,
                ),
              ),
              child: CustomIconWidget(
                iconName: 'arrow_back',
                color: AppTheme.lightTheme.colorScheme.onSurface,
                size: 20,
              ),
            ),
          ),
          SizedBox(width: 3.w),
          // Store Image
          Container(
            width: 12.w,
            height: 6.h,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(8),
              border: Border.all(
                color: AppTheme.lightTheme.dividerColor,
                width: 1,
              ),
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(7),
              child: CustomImageWidget(
                imageUrl: storeImage,
                width: 12.w,
                height: 6.h,
                fit: BoxFit.cover,
              ),
            ),
          ),
          SizedBox(width: 3.w),
          // Store Details
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  storeName,
                  style: AppTheme.lightTheme.textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.w600,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                SizedBox(height: 0.5.h),
                Row(
                  children: [
                    CustomIconWidget(
                      iconName: 'star',
                      color: Colors.amber,
                      size: 14,
                    ),
                    SizedBox(width: 1.w),
                    Text(
                      rating.toStringAsFixed(1),
                      style: AppTheme.lightTheme.textTheme.bodySmall?.copyWith(
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    SizedBox(width: 3.w),
                    CustomIconWidget(
                      iconName: 'access_time',
                      color: AppTheme.lightTheme.colorScheme.onSurface
                          .withValues(alpha: 0.6),
                      size: 14,
                    ),
                    SizedBox(width: 1.w),
                    Text(
                      deliveryTime,
                      style: AppTheme.lightTheme.textTheme.bodySmall?.copyWith(
                        color: AppTheme.lightTheme.colorScheme.onSurface
                            .withValues(alpha: 0.6),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          // Favorite Button
          GestureDetector(
            onTap: () {
              // Handle favorite toggle
            },
            child: Container(
              padding: EdgeInsets.all(2.w),
              decoration: BoxDecoration(
                color: AppTheme.lightTheme.colorScheme.surface,
                borderRadius: BorderRadius.circular(8),
                border: Border.all(
                  color: AppTheme.lightTheme.dividerColor,
                  width: 1,
                ),
              ),
              child: CustomIconWidget(
                iconName: 'favorite_border',
                color: AppTheme.lightTheme.primaryColor,
                size: 20,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
