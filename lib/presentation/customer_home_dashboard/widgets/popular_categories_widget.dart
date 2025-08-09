import 'package:flutter/material.dart';
import 'package:sizer/sizer.dart';

import '../../../../core/app_export.dart';

class PopularCategoriesWidget extends StatelessWidget {
  const PopularCategoriesWidget({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final List<Map<String, dynamic>> categories = [
      {
        "id": 1,
        "name": "Rice & Grains",
        "icon": "rice_bowl",
        "color": Color(0xFFE8F5E8),
        "iconColor": Color(0xFF2E7D32)
      },
      {
        "id": 2,
        "name": "Yam & Tubers",
        "icon": "eco",
        "color": Color(0xFFFFF3E0),
        "iconColor": Color(0xFFFF8F00)
      },
      {
        "id": 3,
        "name": "Plantain",
        "icon": "local_florist",
        "color": Color(0xFFF3E5F5),
        "iconColor": Color(0xFF7B1FA2)
      },
      {
        "id": 4,
        "name": "Fresh Fish",
        "icon": "set_meal",
        "color": Color(0xFFE3F2FD),
        "iconColor": Color(0xFF1976D2)
      },
      {
        "id": 5,
        "name": "Palm Oil",
        "icon": "opacity",
        "color": Color(0xFFFFF8E1),
        "iconColor": Color(0xFFF57F17)
      },
      {
        "id": 6,
        "name": "Vegetables",
        "icon": "grass",
        "color": Color(0xFFE8F5E8),
        "iconColor": Color(0xFF388E3C)
      },
      {
        "id": 7,
        "name": "Spices",
        "icon": "local_dining",
        "color": Color(0xFFFFEBEE),
        "iconColor": Color(0xFFD32F2F)
      },
      {
        "id": 8,
        "name": "Beverages",
        "icon": "local_cafe",
        "color": Color(0xFFF1F8E9),
        "iconColor": Color(0xFF689F38)
      }
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: EdgeInsets.symmetric(horizontal: 4.w, vertical: 1.h),
          child: Text(
            "Popular Categories",
            style: AppTheme.lightTheme.textTheme.titleLarge?.copyWith(
              fontWeight: FontWeight.w700,
              color: AppTheme.lightTheme.colorScheme.onSurface,
            ),
          ),
        ),
        Padding(
          padding: EdgeInsets.symmetric(horizontal: 4.w),
          child: GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              crossAxisSpacing: 3.w,
              mainAxisSpacing: 2.h,
              childAspectRatio: 2.5,
            ),
            itemCount: categories.length,
            itemBuilder: (context, index) {
              final category = categories[index];
              return GestureDetector(
                onTap: () {
                  Navigator.pushNamed(
                      context, '/store-browse-and-product-catalog');
                },
                child: Container(
                  decoration: BoxDecoration(
                    color: category["color"] as Color,
                    borderRadius: BorderRadius.circular(16),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.05),
                        blurRadius: 4,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: Padding(
                    padding: EdgeInsets.all(3.w),
                    child: Row(
                      children: [
                        Container(
                          padding: EdgeInsets.all(2.5.w),
                          decoration: BoxDecoration(
                            color: Colors.white.withValues(alpha: 0.8),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: CustomIconWidget(
                            iconName: category["icon"] as String,
                            color: category["iconColor"] as Color,
                            size: 24,
                          ),
                        ),
                        SizedBox(width: 3.w),
                        Expanded(
                          child: Text(
                            category["name"] as String,
                            style: AppTheme.lightTheme.textTheme.titleSmall
                                ?.copyWith(
                              fontWeight: FontWeight.w600,
                              color: AppTheme.lightTheme.colorScheme.onSurface,
                            ),
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              );
            },
          ),
        ),
      ],
    );
  }
}
