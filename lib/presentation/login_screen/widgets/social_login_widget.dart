import 'package:flutter/material.dart';
import 'package:sizer/sizer.dart';

import '../../../core/app_export.dart';

class SocialLoginWidget extends StatelessWidget {
  final VoidCallback onGoogleLogin;
  final VoidCallback onAppleLogin;

  const SocialLoginWidget({
    Key? key,
    required this.onGoogleLogin,
    required this.onAppleLogin,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Row(
          children: [
            Expanded(
              child: Container(
                height: 1,
                color: AppTheme.lightTheme.colorScheme.outline,
              ),
            ),
            Padding(
              padding: EdgeInsets.symmetric(horizontal: 4.w),
              child: Text(
                'Or continue with',
                style: AppTheme.lightTheme.textTheme.bodySmall?.copyWith(
                  color: AppTheme.lightTheme.colorScheme.onSurfaceVariant,
                ),
              ),
            ),
            Expanded(
              child: Container(
                height: 1,
                color: AppTheme.lightTheme.colorScheme.outline,
              ),
            ),
          ],
        ),
        SizedBox(height: 3.h),
        Row(
          children: [
            Expanded(
              child: _buildSocialButton(
                onTap: onGoogleLogin,
                icon: 'g_translate',
                label: 'Google',
                backgroundColor: AppTheme.lightTheme.colorScheme.surface,
                borderColor: AppTheme.lightTheme.colorScheme.outline,
                textColor: AppTheme.lightTheme.colorScheme.onSurface,
              ),
            ),
            SizedBox(width: 4.w),
            Expanded(
              child: _buildSocialButton(
                onTap: onAppleLogin,
                icon: 'apple',
                label: 'Apple',
                backgroundColor: Colors.black,
                borderColor: Colors.black,
                textColor: Colors.white,
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildSocialButton({
    required VoidCallback onTap,
    required String icon,
    required String label,
    required Color backgroundColor,
    required Color borderColor,
    required Color textColor,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        height: 6.h,
        decoration: BoxDecoration(
          color: backgroundColor,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: borderColor, width: 1),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            CustomIconWidget(
              iconName: icon,
              color: textColor,
              size: 20,
            ),
            SizedBox(width: 2.w),
            Text(
              label,
              style: TextStyle(
                fontSize: 14.sp,
                fontWeight: FontWeight.w600,
                color: textColor,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
