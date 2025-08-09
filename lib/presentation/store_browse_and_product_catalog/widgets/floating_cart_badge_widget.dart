import 'package:flutter/material.dart';
import 'package:sizer/sizer.dart';

import '../../../core/app_export.dart';

class FloatingCartBadgeWidget extends StatefulWidget {
  final int itemCount;
  final VoidCallback onTap;

  const FloatingCartBadgeWidget({
    Key? key,
    required this.itemCount,
    required this.onTap,
  }) : super(key: key);

  @override
  State<FloatingCartBadgeWidget> createState() =>
      _FloatingCartBadgeWidgetState();
}

class _FloatingCartBadgeWidgetState extends State<FloatingCartBadgeWidget>
    with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _bounceAnimation;
  late Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 600),
      vsync: this,
    );

    _bounceAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _animationController,
      curve: Curves.elasticOut,
    ));

    _scaleAnimation = Tween<double>(
      begin: 1.0,
      end: 1.2,
    ).animate(CurvedAnimation(
      parent: _animationController,
      curve: const Interval(0.0, 0.3, curve: Curves.easeOut),
    ));
  }

  @override
  void didUpdateWidget(FloatingCartBadgeWidget oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.itemCount > oldWidget.itemCount) {
      _animationController.forward().then((_) {
        _animationController.reverse();
      });
    }
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (widget.itemCount == 0) {
      return const SizedBox.shrink();
    }

    return Positioned(
      bottom: 10.h,
      right: 4.w,
      child: AnimatedBuilder(
        animation: _animationController,
        builder: (context, child) {
          return Transform.scale(
            scale: _scaleAnimation.value,
            child: GestureDetector(
              onTap: widget.onTap,
              child: Container(
                padding: EdgeInsets.all(3.w),
                decoration: BoxDecoration(
                  color: AppTheme.lightTheme.primaryColor,
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: [
                    BoxShadow(
                      color: AppTheme.lightTheme.primaryColor
                          .withValues(alpha: 0.4),
                      blurRadius: 12,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Stack(
                      children: [
                        CustomIconWidget(
                          iconName: 'shopping_cart',
                          color: AppTheme.lightTheme.colorScheme.onPrimary,
                          size: 24,
                        ),
                        Positioned(
                          right: -2,
                          top: -2,
                          child: Transform.scale(
                            scale: _bounceAnimation.value,
                            child: Container(
                              padding: EdgeInsets.all(1.w),
                              decoration: BoxDecoration(
                                color: AppTheme.lightTheme.colorScheme.error,
                                borderRadius: BorderRadius.circular(10),
                                border: Border.all(
                                  color:
                                      AppTheme.lightTheme.colorScheme.onPrimary,
                                  width: 1,
                                ),
                              ),
                              constraints: BoxConstraints(
                                minWidth: 5.w,
                                minHeight: 2.5.h,
                              ),
                              child: Center(
                                child: Text(
                                  widget.itemCount > 99
                                      ? '99+'
                                      : widget.itemCount.toString(),
                                  style: AppTheme
                                      .lightTheme.textTheme.labelSmall
                                      ?.copyWith(
                                    color:
                                        AppTheme.lightTheme.colorScheme.onError,
                                    fontSize: 9.sp,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                    SizedBox(width: 2.w),
                    Text(
                      'View Cart',
                      style:
                          AppTheme.lightTheme.textTheme.labelMedium?.copyWith(
                        color: AppTheme.lightTheme.colorScheme.onPrimary,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}
