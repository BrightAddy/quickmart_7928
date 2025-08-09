import 'package:flutter/material.dart';
import 'package:sizer/sizer.dart';

import '../../../core/app_export.dart';

class LanguageSelectorWidget extends StatefulWidget {
  final String selectedLanguage;
  final Function(String) onLanguageChanged;

  const LanguageSelectorWidget({
    Key? key,
    required this.selectedLanguage,
    required this.onLanguageChanged,
  }) : super(key: key);

  @override
  State<LanguageSelectorWidget> createState() => _LanguageSelectorWidgetState();
}

class _LanguageSelectorWidgetState extends State<LanguageSelectorWidget> {
  final List<Map<String, String>> languages = [
    {'code': 'en', 'name': 'English'},
    {'code': 'tw', 'name': 'Twi'},
    {'code': 'ga', 'name': 'Ga'},
    {'code': 'ee', 'name': 'Ewe'},
  ];

  void _showLanguageSelector() {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppTheme.lightTheme.colorScheme.surface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => Container(
        padding: EdgeInsets.symmetric(horizontal: 4.w, vertical: 2.h),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 12.w,
              height: 0.5.h,
              decoration: BoxDecoration(
                color: AppTheme.lightTheme.colorScheme.outline,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            SizedBox(height: 2.h),
            Text(
              'Select Language',
              style: AppTheme.lightTheme.textTheme.titleMedium,
            ),
            SizedBox(height: 2.h),
            ...languages.map((language) => ListTile(
                  leading: CustomIconWidget(
                    iconName: widget.selectedLanguage == language['code']
                        ? 'radio_button_checked'
                        : 'radio_button_unchecked',
                    color: widget.selectedLanguage == language['code']
                        ? AppTheme.lightTheme.colorScheme.primary
                        : AppTheme.lightTheme.colorScheme.outline,
                    size: 24,
                  ),
                  title: Text(
                    language['name']!,
                    style: AppTheme.lightTheme.textTheme.bodyLarge,
                  ),
                  onTap: () {
                    widget.onLanguageChanged(language['code']!);
                    Navigator.pop(context);
                  },
                )),
            SizedBox(height: 2.h),
          ],
        ),
      ),
    );
  }

  String _getLanguageName(String code) {
    return languages.firstWhere((lang) => lang['code'] == code)['name'] ??
        'English';
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: _showLanguageSelector,
      child: Container(
        padding: EdgeInsets.symmetric(horizontal: 3.w, vertical: 1.h),
        decoration: BoxDecoration(
          color: AppTheme.lightTheme.colorScheme.surface,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: AppTheme.lightTheme.colorScheme.outline,
            width: 1,
          ),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            CustomIconWidget(
              iconName: 'language',
              color: AppTheme.lightTheme.colorScheme.primary,
              size: 16,
            ),
            SizedBox(width: 1.w),
            Text(
              _getLanguageName(widget.selectedLanguage),
              style: AppTheme.lightTheme.textTheme.bodySmall?.copyWith(
                fontWeight: FontWeight.w500,
              ),
            ),
            SizedBox(width: 1.w),
            CustomIconWidget(
              iconName: 'keyboard_arrow_down',
              color: AppTheme.lightTheme.colorScheme.primary,
              size: 16,
            ),
          ],
        ),
      ),
    );
  }
}
