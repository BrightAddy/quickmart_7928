import 'package:flutter/material.dart';
import 'package:sizer/sizer.dart';

import '../../../core/app_export.dart';

class SearchBarWidget extends StatefulWidget {
  final String hintText;
  final Function(String) onSearchChanged;
  final VoidCallback onFilterPressed;
  final VoidCallback onVoicePressed;

  const SearchBarWidget({
    Key? key,
    required this.hintText,
    required this.onSearchChanged,
    required this.onFilterPressed,
    required this.onVoicePressed,
  }) : super(key: key);

  @override
  State<SearchBarWidget> createState() => _SearchBarWidgetState();
}

class _SearchBarWidgetState extends State<SearchBarWidget> {
  final TextEditingController _searchController = TextEditingController();
  final FocusNode _focusNode = FocusNode();

  @override
  void dispose() {
    _searchController.dispose();
    _focusNode.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 4.w, vertical: 1.h),
      decoration: BoxDecoration(
        color: AppTheme.lightTheme.colorScheme.surface,
        boxShadow: [
          BoxShadow(
            color: AppTheme.lightTheme.shadowColor,
            blurRadius: 2,
            offset: const Offset(0, 1),
          ),
        ],
      ),
      child: Row(
        children: [
          // Search Input Field
          Expanded(
            child: Container(
              height: 6.h,
              decoration: BoxDecoration(
                color: AppTheme.lightTheme.colorScheme.surface,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: _focusNode.hasFocus
                      ? AppTheme.lightTheme.primaryColor
                      : AppTheme.lightTheme.dividerColor,
                  width: _focusNode.hasFocus ? 2 : 1,
                ),
              ),
              child: TextField(
                controller: _searchController,
                focusNode: _focusNode,
                onChanged: widget.onSearchChanged,
                decoration: InputDecoration(
                  hintText: widget.hintText,
                  hintStyle: AppTheme.lightTheme.textTheme.bodyMedium?.copyWith(
                    color: AppTheme.lightTheme.colorScheme.onSurface
                        .withValues(alpha: 0.5),
                  ),
                  prefixIcon: Padding(
                    padding: EdgeInsets.all(3.w),
                    child: CustomIconWidget(
                      iconName: 'search',
                      color: AppTheme.lightTheme.colorScheme.onSurface
                          .withValues(alpha: 0.5),
                      size: 20,
                    ),
                  ),
                  suffixIcon: _searchController.text.isNotEmpty
                      ? GestureDetector(
                          onTap: () {
                            _searchController.clear();
                            widget.onSearchChanged('');
                          },
                          child: Padding(
                            padding: EdgeInsets.all(3.w),
                            child: CustomIconWidget(
                              iconName: 'clear',
                              color: AppTheme.lightTheme.colorScheme.onSurface
                                  .withValues(alpha: 0.5),
                              size: 20,
                            ),
                          ),
                        )
                      : GestureDetector(
                          onTap: widget.onVoicePressed,
                          child: Padding(
                            padding: EdgeInsets.all(3.w),
                            child: CustomIconWidget(
                              iconName: 'mic',
                              color: AppTheme.lightTheme.primaryColor,
                              size: 20,
                            ),
                          ),
                        ),
                  border: InputBorder.none,
                  contentPadding: EdgeInsets.symmetric(
                    horizontal: 4.w,
                    vertical: 2.h,
                  ),
                ),
                style: AppTheme.lightTheme.textTheme.bodyMedium,
              ),
            ),
          ),
          SizedBox(width: 3.w),
          // Filter Button
          GestureDetector(
            onTap: widget.onFilterPressed,
            child: Container(
              height: 6.h,
              width: 6.h,
              decoration: BoxDecoration(
                color: AppTheme.lightTheme.primaryColor,
                borderRadius: BorderRadius.circular(12),
                boxShadow: [
                  BoxShadow(
                    color:
                        AppTheme.lightTheme.primaryColor.withValues(alpha: 0.3),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Center(
                child: CustomIconWidget(
                  iconName: 'tune',
                  color: AppTheme.lightTheme.colorScheme.onPrimary,
                  size: 24,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
