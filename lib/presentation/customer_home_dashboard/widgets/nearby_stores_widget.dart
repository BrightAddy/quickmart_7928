import 'package:flutter/material.dart';
import 'package:sizer/sizer.dart';

import '../../../../core/app_export.dart';

class NearbyStoresWidget extends StatelessWidget {
  const NearbyStoresWidget({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final List<Map<String, dynamic>> nearbyStores = [
      {
        "id": 1,
        "name": "Kofi's Fresh Market",
        "image":
            "https://images.pexels.com/photos/1005638/pexels-photo-1005638.jpeg?auto=compress&cs=tinysrgb&w=800",
        "rating": 4.8,
        "deliveryTime": "15-25 min",
        "distance": "0.8 km",
        "isFavorite": true,
        "categories": ["Fresh Produce", "Local Items"]
      },
      {
        "id": 2,
        "name": "Ama's Grocery Store",
        "image":
            "https://images.pexels.com/photos/2292837/pexels-photo-2292837.jpeg?auto=compress&cs=tinysrgb&w=800",
        "rating": 4.6,
        "deliveryTime": "20-30 min",
        "distance": "1.2 km",
        "isFavorite": false,
        "categories": ["Groceries", "Household"]
      },
      {
        "id": 3,
        "name": "Accra Central Market",
        "image":
            "https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=800",
        "rating": 4.5,
        "deliveryTime": "25-35 min",
        "distance": "2.1 km",
        "isFavorite": true,
        "categories": ["Traditional", "Bulk Items"]
      },
      {
        "id": 4,
        "name": "Kwame's Supermarket",
        "image":
            "https://images.pexels.com/photos/3985062/pexels-photo-3985062.jpeg?auto=compress&cs=tinysrgb&w=800",
        "rating": 4.7,
        "deliveryTime": "18-28 min",
        "distance": "1.5 km",
        "isFavorite": false,
        "categories": ["Supermarket", "International"]
      }
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: EdgeInsets.symmetric(horizontal: 4.w, vertical: 1.h),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                "Nearby Stores",
                style: AppTheme.lightTheme.textTheme.titleLarge?.copyWith(
                  fontWeight: FontWeight.w700,
                  color: AppTheme.lightTheme.colorScheme.onSurface,
                ),
              ),
              TextButton(
                onPressed: () {
                  Navigator.pushNamed(
                      context, '/store-browse-and-product-catalog');
                },
                child: Text(
                  "View All",
                  style: AppTheme.lightTheme.textTheme.labelMedium?.copyWith(
                    color: AppTheme.lightTheme.primaryColor,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ),
        ),
        SizedBox(
          height: 32.h,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            padding: EdgeInsets.symmetric(horizontal: 2.w),
            itemCount: nearbyStores.length,
            itemBuilder: (context, index) {
              final store = nearbyStores[index];
              return GestureDetector(
                onTap: () {
                  Navigator.pushNamed(
                      context, '/store-browse-and-product-catalog');
                },
                onLongPress: () {
                  _showQuickActions(context, store);
                },
                child: Container(
                  width: 70.w,
                  margin: EdgeInsets.symmetric(horizontal: 2.w),
                  decoration: BoxDecoration(
                    color: AppTheme.lightTheme.colorScheme.surface,
                    borderRadius: BorderRadius.circular(16),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.08),
                        blurRadius: 8,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Stack(
                        children: [
                          ClipRRect(
                            borderRadius: const BorderRadius.vertical(
                                top: Radius.circular(16)),
                            child: CustomImageWidget(
                              imageUrl: store["image"] as String,
                              width: double.infinity,
                              height: 18.h,
                              fit: BoxFit.cover,
                            ),
                          ),
                          Positioned(
                            top: 2.w,
                            right: 2.w,
                            child: GestureDetector(
                              onTap: () {
                                // Toggle favorite functionality
                              },
                              child: Container(
                                padding: EdgeInsets.all(2.w),
                                decoration: BoxDecoration(
                                  color: Colors.white.withValues(alpha: 0.9),
                                  shape: BoxShape.circle,
                                ),
                                child: CustomIconWidget(
                                  iconName: store["isFavorite"] as bool
                                      ? 'favorite'
                                      : 'favorite_border',
                                  color: store["isFavorite"] as bool
                                      ? Colors.red
                                      : AppTheme
                                          .lightTheme.colorScheme.onSurface
                                          .withValues(alpha: 0.6),
                                  size: 20,
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                      Expanded(
                        child: Padding(
                          padding: EdgeInsets.all(3.w),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                store["name"] as String,
                                style: AppTheme.lightTheme.textTheme.titleMedium
                                    ?.copyWith(
                                  fontWeight: FontWeight.w600,
                                  color:
                                      AppTheme.lightTheme.colorScheme.onSurface,
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
                                    size: 16,
                                  ),
                                  SizedBox(width: 1.w),
                                  Text(
                                    "${store["rating"]}",
                                    style: AppTheme
                                        .lightTheme.textTheme.bodySmall
                                        ?.copyWith(
                                      fontWeight: FontWeight.w500,
                                      color: AppTheme
                                          .lightTheme.colorScheme.onSurface,
                                    ),
                                  ),
                                  SizedBox(width: 2.w),
                                  CustomIconWidget(
                                    iconName: 'access_time',
                                    color: AppTheme
                                        .lightTheme.colorScheme.onSurface
                                        .withValues(alpha: 0.6),
                                    size: 14,
                                  ),
                                  SizedBox(width: 1.w),
                                  Expanded(
                                    child: Text(
                                      store["deliveryTime"] as String,
                                      style: AppTheme
                                          .lightTheme.textTheme.bodySmall
                                          ?.copyWith(
                                        color: AppTheme
                                            .lightTheme.colorScheme.onSurface
                                            .withValues(alpha: 0.6),
                                      ),
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                  ),
                                ],
                              ),
                              SizedBox(height: 0.5.h),
                              Row(
                                children: [
                                  CustomIconWidget(
                                    iconName: 'location_on',
                                    color: AppTheme.lightTheme.primaryColor,
                                    size: 14,
                                  ),
                                  SizedBox(width: 1.w),
                                  Text(
                                    store["distance"] as String,
                                    style: AppTheme
                                        .lightTheme.textTheme.bodySmall
                                        ?.copyWith(
                                      color: AppTheme.lightTheme.primaryColor,
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                ],
                              ),
                              SizedBox(height: 1.h),
                              Wrap(
                                spacing: 1.w,
                                children: (store["categories"] as List<String>)
                                    .take(2)
                                    .map((category) {
                                  return Container(
                                    padding: EdgeInsets.symmetric(
                                        horizontal: 2.w, vertical: 0.5.h),
                                    decoration: BoxDecoration(
                                      color: AppTheme.lightTheme.primaryColor
                                          .withValues(alpha: 0.1),
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                    child: Text(
                                      category,
                                      style: AppTheme
                                          .lightTheme.textTheme.labelSmall
                                          ?.copyWith(
                                        color: AppTheme.lightTheme.primaryColor,
                                        fontWeight: FontWeight.w500,
                                      ),
                                    ),
                                  );
                                }).toList(),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  void _showQuickActions(BuildContext context, Map<String, dynamic> store) {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppTheme.lightTheme.colorScheme.surface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        return Container(
          padding: EdgeInsets.all(4.w),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 12.w,
                height: 0.5.h,
                decoration: BoxDecoration(
                  color: AppTheme.lightTheme.colorScheme.onSurface
                      .withValues(alpha: 0.3),
                  borderRadius: BorderRadius.circular(4),
                ),
              ),
              SizedBox(height: 2.h),
              Text(
                store["name"] as String,
                style: AppTheme.lightTheme.textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.w600,
                ),
              ),
              SizedBox(height: 2.h),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  _buildQuickActionButton(
                    context,
                    'favorite',
                    'Favorite',
                    AppTheme.lightTheme.primaryColor,
                    () {
                      Navigator.pop(context);
                    },
                  ),
                  _buildQuickActionButton(
                    context,
                    'share',
                    'Share',
                    AppTheme.lightTheme.colorScheme.secondary,
                    () {
                      Navigator.pop(context);
                    },
                  ),
                  _buildQuickActionButton(
                    context,
                    'star_rate',
                    'Reviews',
                    Colors.amber,
                    () {
                      Navigator.pop(context);
                    },
                  ),
                ],
              ),
              SizedBox(height: 2.h),
            ],
          ),
        );
      },
    );
  }

  Widget _buildQuickActionButton(
    BuildContext context,
    String iconName,
    String label,
    Color color,
    VoidCallback onTap,
  ) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        children: [
          Container(
            padding: EdgeInsets.all(3.w),
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.1),
              shape: BoxShape.circle,
            ),
            child: CustomIconWidget(
              iconName: iconName,
              color: color,
              size: 24,
            ),
          ),
          SizedBox(height: 1.h),
          Text(
            label,
            style: AppTheme.lightTheme.textTheme.labelMedium?.copyWith(
              color: AppTheme.lightTheme.colorScheme.onSurface,
            ),
          ),
        ],
      ),
    );
  }
}
