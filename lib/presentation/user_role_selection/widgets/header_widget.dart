import 'package:flutter/material.dart';
import 'package:sizer/sizer.dart';

import '../../../core/app_export.dart';

class HeaderWidget extends StatelessWidget {
  final String selectedLanguage;

  const HeaderWidget({
    Key? key,
    required this.selectedLanguage,
  }) : super(key: key);

  String _getLocalizedTitle(String languageCode) {
    switch (languageCode) {
      case 'tw':
        return 'Wo Dwuma no Paw';
      case 'ga':
        return 'Tia Wo Adwuma';
      case 'ee':
        return 'Tia Wò Dɔwɔwɔ';
      default:
        return 'Choose Your Role';
    }
  }

  String _getLocalizedSubtitle(String languageCode) {
    switch (languageCode) {
      case 'tw':
        return 'QuickMart mu dwuma biara paw na fi ase';
      case 'ga':
        return 'Tia adwuma kɛ QuickMart mu';
      case 'ee':
        return 'Tia dɔwɔwɔ si QuickMart me';
      default:
        return 'Select how you want to use QuickMart';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: EdgeInsets.symmetric(horizontal: 4.w, vertical: 2.h),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                padding: EdgeInsets.all(2.w),
                decoration: BoxDecoration(
                  color: AppTheme.primaryLight.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: CustomIconWidget(
                  iconName: 'shopping_cart',
                  color: AppTheme.primaryLight,
                  size: 8.w,
                ),
              ),
              SizedBox(width: 3.w),
              Text(
                'QuickMart',
                style: AppTheme.lightTheme.textTheme.headlineMedium?.copyWith(
                  color: AppTheme.primaryLight,
                  fontWeight: FontWeight.w800,
                  letterSpacing: -0.5,
                ),
              ),
            ],
          ),
          SizedBox(height: 3.h),
          Text(
            _getLocalizedTitle(selectedLanguage),
            style: AppTheme.lightTheme.textTheme.headlineSmall?.copyWith(
              color: AppTheme.textPrimaryLight,
              fontWeight: FontWeight.w700,
            ),
            textAlign: TextAlign.center,
          ),
          SizedBox(height: 1.h),
          Text(
            _getLocalizedSubtitle(selectedLanguage),
            style: AppTheme.lightTheme.textTheme.bodyLarge?.copyWith(
              color: AppTheme.textSecondaryLight,
            ),
            textAlign: TextAlign.center,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }
}
