import 'package:flutter/material.dart';
import 'package:sizer/sizer.dart';

import '../../../core/app_export.dart';
import '../../../theme/app_theme.dart';

class FilterBottomSheetWidget extends StatefulWidget {
  final Map<String, dynamic> currentFilters;
  final Function(Map<String, dynamic>) onFiltersApplied;

  const FilterBottomSheetWidget({
    Key? key,
    required this.currentFilters,
    required this.onFiltersApplied,
  }) : super(key: key);

  @override
  State<FilterBottomSheetWidget> createState() =>
      _FilterBottomSheetWidgetState();
}

class _FilterBottomSheetWidgetState extends State<FilterBottomSheetWidget> {
  late Map<String, dynamic> _filters;
  RangeValues _priceRange = const RangeValues(0, 500);

  final List<String> _categories = [
    'Fruits & Vegetables',
    'Dairy & Eggs',
    'Meat & Seafood',
    'Bakery',
    'Beverages',
    'Snacks',
    'Household',
    'Personal Care',
  ];

  final List<String> _availability = [
    'In Stock',
    'Out of Stock',
  ];

  final List<String> _dietary = [
    'Organic',
    'Gluten Free',
    'Vegan',
    'Vegetarian',
    'Sugar Free',
  ];

  @override
  void initState() {
    super.initState();
    _filters = Map<String, dynamic>.from(widget.currentFilters);
    _priceRange = RangeValues(
      (_filters['minPrice'] ?? 0).toDouble(),
      (_filters['maxPrice'] ?? 500).toDouble(),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: 1.h),
      child: Text(
        title,
        style: AppTheme.lightTheme.textTheme.titleSmall?.copyWith(
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }

  Widget _buildCheckboxList(String filterKey, List<String> options) {
    final List<String> selectedOptions =
        (_filters[filterKey] as List<String>?) ?? [];

    return Column(
      children: options.map((option) {
        final bool isSelected = selectedOptions.contains(option);
        return CheckboxListTile(
          title: Text(
            option,
            style: AppTheme.lightTheme.textTheme.bodyMedium,
          ),
          value: isSelected,
          onChanged: (bool? value) {
            setState(() {
              if (value == true) {
                if (!selectedOptions.contains(option)) {
                  selectedOptions.add(option);
                }
              } else {
                selectedOptions.remove(option);
              }
              _filters[filterKey] = selectedOptions;
            });
          },
          controlAffinity: ListTileControlAffinity.leading,
          contentPadding: EdgeInsets.zero,
        );
      }).toList(),
    );
  }

  Widget _buildPriceRangeSlider() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'GHS ${_priceRange.start.round()}',
              style: AppTheme.lightTheme.textTheme.bodyMedium?.copyWith(
                fontWeight: FontWeight.w500,
              ),
            ),
            Text(
              'GHS ${_priceRange.end.round()}',
              style: AppTheme.lightTheme.textTheme.bodyMedium?.copyWith(
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
        SizedBox(height: 1.h),
        RangeSlider(
          values: _priceRange,
          min: 0,
          max: 500,
          divisions: 50,
          labels: RangeLabels(
            'GHS ${_priceRange.start.round()}',
            'GHS ${_priceRange.end.round()}',
          ),
          onChanged: (RangeValues values) {
            setState(() {
              _priceRange = values;
              _filters['minPrice'] = values.start.round();
              _filters['maxPrice'] = values.end.round();
            });
          },
        ),
      ],
    );
  }

  void _clearAllFilters() {
    setState(() {
      _filters.clear();
      _priceRange = const RangeValues(0, 500);
    });
  }

  void _applyFilters() {
    widget.onFiltersApplied(_filters);
    Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 80.h,
      decoration: BoxDecoration(
        color: AppTheme.lightTheme.colorScheme.surface,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
      ),
      child: Column(
        children: [
          // Handle Bar
          Container(
            margin: EdgeInsets.only(top: 1.h),
            width: 12.w,
            height: 0.5.h,
            decoration: BoxDecoration(
              color: AppTheme.lightTheme.dividerColor,
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          // Header
          Padding(
            padding: EdgeInsets.all(4.w),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Filters',
                  style: AppTheme.lightTheme.textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.w600,
                  ),
                ),
                TextButton(
                  onPressed: _clearAllFilters,
                  child: Text(
                    'Clear All',
                    style: AppTheme.lightTheme.textTheme.bodyMedium?.copyWith(
                      color: AppTheme.lightTheme.primaryColor,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
              ],
            ),
          ),
          Divider(color: AppTheme.lightTheme.dividerColor),
          // Filter Content
          Expanded(
            child: SingleChildScrollView(
              padding: EdgeInsets.all(4.w),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Categories
                  _buildSectionHeader('Categories'),
                  _buildCheckboxList('categories', _categories),
                  SizedBox(height: 2.h),

                  // Price Range
                  _buildSectionHeader('Price Range'),
                  _buildPriceRangeSlider(),
                  SizedBox(height: 2.h),

                  // Availability
                  _buildSectionHeader('Availability'),
                  _buildCheckboxList('availability', _availability),
                  SizedBox(height: 2.h),

                  // Dietary Preferences
                  _buildSectionHeader('Dietary Preferences'),
                  _buildCheckboxList('dietary', _dietary),
                  SizedBox(height: 4.h),
                ],
              ),
            ),
          ),
          // Apply Button
          Container(
            padding: EdgeInsets.all(4.w),
            decoration: BoxDecoration(
              color: AppTheme.lightTheme.colorScheme.surface,
              boxShadow: [
                BoxShadow(
                  color: AppTheme.lightTheme.shadowColor,
                  blurRadius: 4,
                  offset: const Offset(0, -2),
                ),
              ],
            ),
            child: SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: _applyFilters,
                style: ElevatedButton.styleFrom(
                  padding: EdgeInsets.symmetric(vertical: 2.h),
                ),
                child: Text(
                  'Apply Filters',
                  style: AppTheme.lightTheme.textTheme.titleSmall?.copyWith(
                    color: AppTheme.lightTheme.colorScheme.onPrimary,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
