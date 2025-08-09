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
  final List<Map<String, String>> _languages = [
    {'code': 'en', 'name': 'English', 'nativeName': 'English'},
    {'code': 'tw', 'name': 'Twi', 'nativeName': 'Twi'},
    {'code': 'ga', 'name': 'Ga', 'nativeName': 'Ga'},
    {'code': 'ee', 'name': 'Ewe', 'nativeName': 'Eʋegbe'},
  ];

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: EdgeInsets.symmetric(horizontal: 4.w, vertical: 1.h),
      decoration: BoxDecoration(
        color: AppTheme.lightTheme.colorScheme.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: AppTheme.dividerLight,
          width: 1,
        ),
      ),
      child: DropdownButtonHideUnderline(
        child: DropdownButton<String>(
          value: widget.selectedLanguage,
          isExpanded: true,
          icon: CustomIconWidget(
            iconName: 'keyboard_arrow_down',
            color: AppTheme.textSecondaryLight,
            size: 5.w,
          ),
          style: AppTheme.lightTheme.textTheme.bodyMedium?.copyWith(
            color: AppTheme.textPrimaryLight,
          ),
          dropdownColor: AppTheme.lightTheme.colorScheme.surface,
          borderRadius: BorderRadius.circular(12),
          items: _languages.map((language) {
            return DropdownMenuItem<String>(
              value: language['code'],
              child: Row(
                children: [
                  CustomIconWidget(
                    iconName: 'language',
                    color: AppTheme.primaryLight,
                    size: 4.w,
                  ),
                  SizedBox(width: 2.w),
                  Text(
                    language['nativeName'] ?? '',
                    style: AppTheme.lightTheme.textTheme.bodyMedium?.copyWith(
                      color: AppTheme.textPrimaryLight,
                    ),
                  ),
                ],
              ),
            );
          }).toList(),
          onChanged: (String? newValue) {
            if (newValue != null) {
              widget.onLanguageChanged(newValue);
            }
          },
        ),
      ),
    );
  }
}
