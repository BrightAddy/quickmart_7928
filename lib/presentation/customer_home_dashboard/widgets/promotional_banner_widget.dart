import 'package:flutter/material.dart';
import 'package:sizer/sizer.dart';

import '../../../../core/app_export.dart';

class PromotionalBannerWidget extends StatefulWidget {
  const PromotionalBannerWidget({Key? key}) : super(key: key);

  @override
  State<PromotionalBannerWidget> createState() =>
      _PromotionalBannerWidgetState();
}

class _PromotionalBannerWidgetState extends State<PromotionalBannerWidget> {
  final PageController _pageController = PageController();
  int _currentIndex = 0;

  final List<Map<String, dynamic>> _promotions = [
    {
      "id": 1,
      "title": "Fresh Yam & Plantain",
      "subtitle": "Get 20% off on fresh produce",
      "image":
          "https://images.pexels.com/photos/5966630/pexels-photo-5966630.jpeg?auto=compress&cs=tinysrgb&w=800",
      "backgroundColor": Color(0xFFE8F5E8),
      "discount": "20% OFF"
    },
    {
      "id": 2,
      "title": "Rice & Grains Special",
      "subtitle": "Buy 2 get 1 free on selected rice",
      "image":
          "https://images.pexels.com/photos/4110256/pexels-photo-4110256.jpeg?auto=compress&cs=tinysrgb&w=800",
      "backgroundColor": Color(0xFFFFF3E0),
      "discount": "Buy 2 Get 1"
    },
    {
      "id": 3,
      "title": "Weekend Grocery Deal",
      "subtitle": "Free delivery on orders above GHS 100",
      "image":
          "https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=800",
      "backgroundColor": Color(0xFFF3E5F5),
      "discount": "Free Delivery"
    }
  ];

  @override
  void initState() {
    super.initState();
    _startAutoScroll();
  }

  void _startAutoScroll() {
    Future.delayed(const Duration(seconds: 4), () {
      if (mounted && _pageController.hasClients) {
        final nextIndex = (_currentIndex + 1) % _promotions.length;
        _pageController.animateToPage(
          nextIndex,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeInOut,
        );
        _startAutoScroll();
      }
    });
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 25.h,
      margin: EdgeInsets.symmetric(horizontal: 4.w, vertical: 2.h),
      child: Column(
        children: [
          Expanded(
            child: PageView.builder(
              controller: _pageController,
              onPageChanged: (index) {
                setState(() {
                  _currentIndex = index;
                });
              },
              itemCount: _promotions.length,
              itemBuilder: (context, index) {
                final promotion = _promotions[index];
                return Container(
                  margin: EdgeInsets.symmetric(horizontal: 2.w),
                  decoration: BoxDecoration(
                    color: promotion["backgroundColor"] as Color,
                    borderRadius: BorderRadius.circular(16),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.1),
                        blurRadius: 8,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(16),
                    child: Stack(
                      children: [
                        Row(
                          children: [
                            Expanded(
                              flex: 3,
                              child: Padding(
                                padding: EdgeInsets.all(4.w),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Container(
                                      padding: EdgeInsets.symmetric(
                                        horizontal: 3.w,
                                        vertical: 1.h,
                                      ),
                                      decoration: BoxDecoration(
                                        color: AppTheme.lightTheme.primaryColor,
                                        borderRadius: BorderRadius.circular(20),
                                      ),
                                      child: Text(
                                        promotion["discount"] as String,
                                        style: AppTheme
                                            .lightTheme.textTheme.labelSmall
                                            ?.copyWith(
                                          color: Colors.white,
                                          fontWeight: FontWeight.w600,
                                        ),
                                      ),
                                    ),
                                    SizedBox(height: 1.h),
                                    Text(
                                      promotion["title"] as String,
                                      style: AppTheme
                                          .lightTheme.textTheme.titleMedium
                                          ?.copyWith(
                                        fontWeight: FontWeight.w700,
                                        color: AppTheme
                                            .lightTheme.colorScheme.onSurface,
                                      ),
                                      maxLines: 2,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                    SizedBox(height: 0.5.h),
                                    Text(
                                      promotion["subtitle"] as String,
                                      style: AppTheme
                                          .lightTheme.textTheme.bodySmall
                                          ?.copyWith(
                                        color: AppTheme
                                            .lightTheme.colorScheme.onSurface
                                            .withValues(alpha: 0.7),
                                      ),
                                      maxLines: 2,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                  ],
                                ),
                              ),
                            ),
                            Expanded(
                              flex: 2,
                              child: CustomImageWidget(
                                imageUrl: promotion["image"] as String,
                                width: double.infinity,
                                height: double.infinity,
                                fit: BoxFit.cover,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
          SizedBox(height: 1.h),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: List.generate(
              _promotions.length,
              (index) => AnimatedContainer(
                duration: const Duration(milliseconds: 300),
                margin: EdgeInsets.symmetric(horizontal: 1.w),
                width: _currentIndex == index ? 6.w : 2.w,
                height: 1.h,
                decoration: BoxDecoration(
                  color: _currentIndex == index
                      ? AppTheme.lightTheme.primaryColor
                      : AppTheme.lightTheme.primaryColor.withValues(alpha: 0.3),
                  borderRadius: BorderRadius.circular(4),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
