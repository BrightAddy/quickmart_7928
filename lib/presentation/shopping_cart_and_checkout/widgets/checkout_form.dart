import 'dart:io' if (dart.library.io) 'dart:io';

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:sizer/sizer.dart';
import 'package:universal_html/html.dart' as html;

import '../../../core/app_export.dart';
import '../../../theme/app_theme.dart';
import '../../../widgets/custom_icon_widget.dart';

class CheckoutForm extends StatefulWidget {
  final Function(Map<String, dynamic>) onCheckoutComplete;

  const CheckoutForm({
    Key? key,
    required this.onCheckoutComplete,
  }) : super(key: key);

  @override
  State<CheckoutForm> createState() => _CheckoutFormState();
}

class _CheckoutFormState extends State<CheckoutForm> {
  final _formKey = GlobalKey<FormState>();
  final _addressController = TextEditingController();
  final _instructionsController = TextEditingController();

  String _selectedPaymentMethod = 'mtn_momo';
  String _selectedTimeSlot = 'asap';
  bool _isGpsEnabled = false;
  String? _uploadedImagePath;

  final List<Map<String, dynamic>> _paymentMethods = [
    {
      'id': 'mtn_momo',
      'name': 'MTN Mobile Money',
      'icon': 'phone_android',
      'description': 'Pay with MTN MoMo',
    },
    {
      'id': 'vodafone_cash',
      'name': 'Vodafone Cash',
      'icon': 'phone_android',
      'description': 'Pay with Vodafone Cash',
    },
    {
      'id': 'card',
      'name': 'Credit/Debit Card',
      'icon': 'credit_card',
      'description': 'Visa, Mastercard accepted',
    },
    {
      'id': 'cash',
      'name': 'Cash on Delivery',
      'icon': 'money',
      'description': 'Pay when order arrives',
    },
  ];

  final List<Map<String, dynamic>> _timeSlots = [
    {'id': 'asap', 'name': 'ASAP (30-45 mins)', 'fee': 0.0},
    {'id': 'morning', 'name': 'Morning (8AM - 12PM)', 'fee': 0.0},
    {'id': 'afternoon', 'name': 'Afternoon (12PM - 5PM)', 'fee': 0.0},
    {'id': 'evening', 'name': 'Evening (5PM - 8PM)', 'fee': 2.0},
  ];

  @override
  void initState() {
    super.initState();
    _addressController.text = 'East Legon, Accra, Ghana';
    _checkGpsPermission();
  }

  @override
  void dispose() {
    _addressController.dispose();
    _instructionsController.dispose();
    super.dispose();
  }

  Future<void> _checkGpsPermission() async {
    // Simulate GPS permission check
    setState(() => _isGpsEnabled = true);
  }

  Future<void> _selectImage() async {
    try {
      if (kIsWeb) {
        final html.FileUploadInputElement uploadInput =
            html.FileUploadInputElement();
        uploadInput.accept = 'image/*';
        uploadInput.click();

        uploadInput.onChange.listen((e) {
          final files = uploadInput.files;
          if (files?.isNotEmpty == true) {
            final file = files!.first;
            setState(() => _uploadedImagePath = file.name);
          }
        });
      } else {
        // For mobile, simulate image selection
        setState(() => _uploadedImagePath = 'product_specification.jpg');
      }
    } catch (e) {
      // Handle error silently
    }
  }

  void _submitCheckout() {
    if (_formKey.currentState?.validate() ?? false) {
      final checkoutData = {
        'address': _addressController.text,
        'paymentMethod': _selectedPaymentMethod,
        'timeSlot': _selectedTimeSlot,
        'specialInstructions': _instructionsController.text,
        'uploadedImage': _uploadedImagePath,
        'timestamp': DateTime.now().toIso8601String(),
      };

      widget.onCheckoutComplete(checkoutData);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppTheme.lightTheme.colorScheme.surface,
        borderRadius: const BorderRadius.only(
          topLeft: Radius.circular(20),
          topRight: Radius.circular(20),
        ),
      ),
      child: Form(
        key: _formKey,
        child: SingleChildScrollView(
          padding: EdgeInsets.all(4.w),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Handle bar
              Center(
                child: Container(
                  width: 12.w,
                  height: 0.5.h,
                  decoration: BoxDecoration(
                    color: AppTheme.lightTheme.colorScheme.onSurface
                        .withValues(alpha: 0.3),
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),

              SizedBox(height: 2.h),

              // Checkout title
              Row(
                children: [
                  CustomIconWidget(
                    iconName: 'local_shipping',
                    color: AppTheme.lightTheme.colorScheme.primary,
                    size: 24,
                  ),
                  SizedBox(width: 2.w),
                  Text(
                    'Checkout Details',
                    style: AppTheme.lightTheme.textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),

              SizedBox(height: 3.h),

              // Delivery Address Section
              _buildSectionTitle('Delivery Address', 'location_on'),
              SizedBox(height: 1.h),

              Container(
                decoration: BoxDecoration(
                  border: Border.all(
                    color: AppTheme.lightTheme.colorScheme.outline,
                  ),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: TextFormField(
                  controller: _addressController,
                  decoration: InputDecoration(
                    hintText: 'Enter delivery address',
                    border: InputBorder.none,
                    contentPadding: EdgeInsets.all(4.w),
                    suffixIcon: _isGpsEnabled
                        ? IconButton(
                            onPressed: () {
                              _addressController.text =
                                  'Current Location - East Legon, Accra';
                            },
                            icon: CustomIconWidget(
                              iconName: 'my_location',
                              color: AppTheme.lightTheme.colorScheme.primary,
                              size: 20,
                            ),
                          )
                        : null,
                  ),
                  validator: (value) {
                    if (value?.isEmpty ?? true) {
                      return 'Please enter delivery address';
                    }
                    return null;
                  },
                  maxLines: 2,
                ),
              ),

              SizedBox(height: 3.h),

              // Delivery Time Section
              _buildSectionTitle('Delivery Time', 'schedule'),
              SizedBox(height: 1.h),

              ...(_timeSlots
                  .map((slot) => _buildTimeSlotOption(slot))
                  .toList()),

              SizedBox(height: 3.h),

              // Payment Method Section
              _buildSectionTitle('Payment Method', 'payment'),
              SizedBox(height: 1.h),

              ...(_paymentMethods
                  .map((method) => _buildPaymentOption(method))
                  .toList()),

              SizedBox(height: 3.h),

              // Special Instructions Section
              _buildSectionTitle('Special Instructions', 'note_add'),
              SizedBox(height: 1.h),

              Container(
                decoration: BoxDecoration(
                  border: Border.all(
                    color: AppTheme.lightTheme.colorScheme.outline,
                  ),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: TextFormField(
                  controller: _instructionsController,
                  decoration: InputDecoration(
                    hintText: 'Any special instructions for delivery...',
                    border: InputBorder.none,
                    contentPadding: EdgeInsets.all(4.w),
                  ),
                  maxLines: 3,
                ),
              ),

              SizedBox(height: 2.h),

              // Image Upload Section
              GestureDetector(
                onTap: _selectImage,
                child: Container(
                  width: double.infinity,
                  padding: EdgeInsets.all(4.w),
                  decoration: BoxDecoration(
                    border: Border.all(
                      color: AppTheme.lightTheme.colorScheme.outline,
                      style: BorderStyle.solid,
                    ),
                    borderRadius: BorderRadius.circular(12),
                    color: AppTheme.lightTheme.colorScheme.surface,
                  ),
                  child: Column(
                    children: [
                      CustomIconWidget(
                        iconName: _uploadedImagePath != null
                            ? 'check_circle'
                            : 'cloud_upload',
                        color: _uploadedImagePath != null
                            ? AppTheme.lightTheme.colorScheme.tertiary
                            : AppTheme.lightTheme.colorScheme.primary,
                        size: 32,
                      ),
                      SizedBox(height: 1.h),
                      Text(
                        _uploadedImagePath != null
                            ? 'Image uploaded: $_uploadedImagePath'
                            : 'Upload product specification image',
                        style:
                            AppTheme.lightTheme.textTheme.bodyMedium?.copyWith(
                          color: _uploadedImagePath != null
                              ? AppTheme.lightTheme.colorScheme.tertiary
                              : AppTheme.lightTheme.colorScheme.onSurface,
                        ),
                        textAlign: TextAlign.center,
                      ),
                      if (_uploadedImagePath == null) ...[
                        SizedBox(height: 0.5.h),
                        Text(
                          'Drag and drop or tap to select',
                          style: AppTheme.lightTheme.textTheme.bodySmall,
                          textAlign: TextAlign.center,
                        ),
                      ],
                    ],
                  ),
                ),
              ),

              SizedBox(height: 4.h),

              // Complete Order Button
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _submitCheckout,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.lightTheme.colorScheme.primary,
                    padding: EdgeInsets.symmetric(vertical: 2.5.h),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    elevation: 2,
                  ),
                  child: Text(
                    'Complete Order',
                    style: AppTheme.lightTheme.textTheme.labelLarge?.copyWith(
                      color: AppTheme.lightTheme.colorScheme.onPrimary,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ),

              SizedBox(height: MediaQuery.of(context).padding.bottom),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSectionTitle(String title, String iconName) {
    return Row(
      children: [
        CustomIconWidget(
          iconName: iconName,
          color: AppTheme.lightTheme.colorScheme.primary,
          size: 20,
        ),
        SizedBox(width: 2.w),
        Text(
          title,
          style: AppTheme.lightTheme.textTheme.titleMedium?.copyWith(
            fontWeight: FontWeight.w600,
          ),
        ),
      ],
    );
  }

  Widget _buildTimeSlotOption(Map<String, dynamic> slot) {
    final bool isSelected = _selectedTimeSlot == slot['id'];

    return Container(
      margin: EdgeInsets.only(bottom: 1.h),
      child: GestureDetector(
        onTap: () => setState(() => _selectedTimeSlot = slot['id']),
        child: Container(
          padding: EdgeInsets.all(4.w),
          decoration: BoxDecoration(
            border: Border.all(
              color: isSelected
                  ? AppTheme.lightTheme.colorScheme.primary
                  : AppTheme.lightTheme.colorScheme.outline,
              width: isSelected ? 2 : 1,
            ),
            borderRadius: BorderRadius.circular(12),
            color: isSelected
                ? AppTheme.lightTheme.colorScheme.primary.withValues(alpha: 0.1)
                : AppTheme.lightTheme.colorScheme.surface,
          ),
          child: Row(
            children: [
              CustomIconWidget(
                iconName: isSelected
                    ? 'radio_button_checked'
                    : 'radio_button_unchecked',
                color: isSelected
                    ? AppTheme.lightTheme.colorScheme.primary
                    : AppTheme.lightTheme.colorScheme.onSurface
                        .withValues(alpha: 0.6),
                size: 20,
              ),
              SizedBox(width: 3.w),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      slot['name'],
                      style: AppTheme.lightTheme.textTheme.bodyMedium?.copyWith(
                        fontWeight:
                            isSelected ? FontWeight.w600 : FontWeight.w400,
                      ),
                    ),
                    if ((slot['fee'] as double) > 0) ...[
                      SizedBox(height: 0.5.h),
                      Text(
                        '+GHS ${(slot['fee'] as double).toStringAsFixed(2)} fee',
                        style:
                            AppTheme.lightTheme.textTheme.bodySmall?.copyWith(
                          color: AppTheme.lightTheme.colorScheme.secondary,
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildPaymentOption(Map<String, dynamic> method) {
    final bool isSelected = _selectedPaymentMethod == method['id'];

    return Container(
      margin: EdgeInsets.only(bottom: 1.h),
      child: GestureDetector(
        onTap: () => setState(() => _selectedPaymentMethod = method['id']),
        child: Container(
          padding: EdgeInsets.all(4.w),
          decoration: BoxDecoration(
            border: Border.all(
              color: isSelected
                  ? AppTheme.lightTheme.colorScheme.primary
                  : AppTheme.lightTheme.colorScheme.outline,
              width: isSelected ? 2 : 1,
            ),
            borderRadius: BorderRadius.circular(12),
            color: isSelected
                ? AppTheme.lightTheme.colorScheme.primary.withValues(alpha: 0.1)
                : AppTheme.lightTheme.colorScheme.surface,
          ),
          child: Row(
            children: [
              CustomIconWidget(
                iconName: isSelected
                    ? 'radio_button_checked'
                    : 'radio_button_unchecked',
                color: isSelected
                    ? AppTheme.lightTheme.colorScheme.primary
                    : AppTheme.lightTheme.colorScheme.onSurface
                        .withValues(alpha: 0.6),
                size: 20,
              ),
              SizedBox(width: 3.w),
              CustomIconWidget(
                iconName: method['icon'],
                color: AppTheme.lightTheme.colorScheme.onSurface,
                size: 24,
              ),
              SizedBox(width: 3.w),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      method['name'],
                      style: AppTheme.lightTheme.textTheme.bodyMedium?.copyWith(
                        fontWeight:
                            isSelected ? FontWeight.w600 : FontWeight.w400,
                      ),
                    ),
                    SizedBox(height: 0.5.h),
                    Text(
                      method['description'],
                      style: AppTheme.lightTheme.textTheme.bodySmall,
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}