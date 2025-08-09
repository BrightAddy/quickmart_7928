import 'package:flutter/material.dart';
import 'package:sizer/sizer.dart';

import '../../../../core/app_export.dart';

class SearchBarWidget extends StatefulWidget {
  const SearchBarWidget({Key? key}) : super(key: key);

  @override
  State<SearchBarWidget> createState() => _SearchBarWidgetState();
}

class _SearchBarWidgetState extends State<SearchBarWidget> {
  final TextEditingController _searchController = TextEditingController();
  bool _isListening = false;

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _startVoiceSearch() {
    setState(() {
      _isListening = true;
    });

    // Simulate voice input processing
    Future.delayed(const Duration(seconds: 2), () {
      if (mounted) {
        setState(() {
          _isListening = false;
          _searchController.text = "Fresh yam and plantain";
        });
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: EdgeInsets.symmetric(horizontal: 4.w, vertical: 1.h),
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
      child: TextField(
        controller: _searchController,
        decoration: InputDecoration(
          hintText: "Search for groceries, stores...",
          hintStyle: AppTheme.lightTheme.textTheme.bodyMedium?.copyWith(
            color: AppTheme.lightTheme.colorScheme.onSurface
                .withValues(alpha: 0.6),
          ),
          prefixIcon: Padding(
            padding: EdgeInsets.all(3.w),
            child: CustomIconWidget(
              iconName: 'search',
              color: AppTheme.lightTheme.colorScheme.onSurface
                  .withValues(alpha: 0.6),
              size: 24,
            ),
          ),
          suffixIcon: GestureDetector(
            onTap: _startVoiceSearch,
            child: Container(
              margin: EdgeInsets.all(2.w),
              padding: EdgeInsets.all(2.w),
              decoration: BoxDecoration(
                color: _isListening
                    ? AppTheme.lightTheme.primaryColor.withValues(alpha: 0.1)
                    : Colors.transparent,
                borderRadius: BorderRadius.circular(12),
              ),
              child: AnimatedSwitcher(
                duration: const Duration(milliseconds: 300),
                child: _isListening
                    ? SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          valueColor: AlwaysStoppedAnimation<Color>(
                            AppTheme.lightTheme.primaryColor,
                          ),
                        ),
                      )
                    : CustomIconWidget(
                        iconName: 'mic',
                        color: AppTheme.lightTheme.primaryColor,
                        size: 24,
                      ),
              ),
            ),
          ),
          border: InputBorder.none,
          contentPadding: EdgeInsets.symmetric(
            horizontal: 4.w,
            vertical: 2.h,
          ),
        ),
        style: AppTheme.lightTheme.textTheme.bodyMedium?.copyWith(
          color: AppTheme.lightTheme.colorScheme.onSurface,
        ),
        onSubmitted: (value) {
          if (value.isNotEmpty) {
            Navigator.pushNamed(context, '/store-browse-and-product-catalog');
          }
        },
      ),
    );
  }
}
