import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:sizer/sizer.dart';

import '../../../core/app_export.dart';

class LoginFormWidget extends StatefulWidget {
  final bool isPhoneLogin;
  final Function(bool) onLoginTypeChanged;
  final Function(String, String) onLogin;
  final VoidCallback onForgotPassword;

  const LoginFormWidget({
    Key? key,
    required this.isPhoneLogin,
    required this.onLoginTypeChanged,
    required this.onLogin,
    required this.onForgotPassword,
  }) : super(key: key);

  @override
  State<LoginFormWidget> createState() => _LoginFormWidgetState();
}

class _LoginFormWidgetState extends State<LoginFormWidget> {
  final TextEditingController _phoneController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final FocusNode _phoneFocus = FocusNode();
  final FocusNode _emailFocus = FocusNode();
  final FocusNode _passwordFocus = FocusNode();

  bool _isPasswordVisible = false;
  bool _isLoading = false;
  String _phoneError = '';
  String _emailError = '';
  String _passwordError = '';
  int _passwordStrength = 0;

  @override
  void dispose() {
    _phoneController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _phoneFocus.dispose();
    _emailFocus.dispose();
    _passwordFocus.dispose();
    super.dispose();
  }

  void _validatePhone(String value) {
    setState(() {
      if (value.isEmpty) {
        _phoneError = 'Phone number is required';
      } else if (value.length < 9) {
        _phoneError = 'Please enter a valid phone number';
      } else {
        _phoneError = '';
      }
    });
  }

  void _validateEmail(String value) {
    setState(() {
      if (value.isEmpty) {
        _emailError = 'Email is required';
      } else if (!RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(value)) {
        _emailError = 'Please enter a valid email address';
      } else {
        _emailError = '';
      }
    });
  }

  void _validatePassword(String value) {
    setState(() {
      if (value.isEmpty) {
        _passwordError = 'Password is required';
        _passwordStrength = 0;
      } else if (value.length < 6) {
        _passwordError = 'Password must be at least 6 characters';
        _passwordStrength = 1;
      } else {
        _passwordError = '';
        // Calculate password strength
        int strength = 1;
        if (value.length >= 8) strength++;
        if (RegExp(r'[A-Z]').hasMatch(value)) strength++;
        if (RegExp(r'[0-9]').hasMatch(value)) strength++;
        if (RegExp(r'[!@#$%^&*(),.?":{}|<>]').hasMatch(value)) strength++;
        _passwordStrength = strength > 4 ? 4 : strength;
      }
    });
  }

  bool _isFormValid() {
    if (widget.isPhoneLogin) {
      return _phoneController.text.isNotEmpty &&
          _passwordController.text.isNotEmpty &&
          _phoneError.isEmpty &&
          _passwordError.isEmpty;
    } else {
      return _emailController.text.isNotEmpty &&
          _passwordController.text.isNotEmpty &&
          _emailError.isEmpty &&
          _passwordError.isEmpty;
    }
  }

  Future<void> _handleLogin() async {
    if (!_isFormValid()) return;

    setState(() => _isLoading = true);

    try {
      final identifier = widget.isPhoneLogin
          ? '+233${_phoneController.text}'
          : _emailController.text;

      await widget.onLogin(identifier, _passwordController.text);
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  Color _getPasswordStrengthColor() {
    switch (_passwordStrength) {
      case 1:
        return Colors.red;
      case 2:
        return Colors.orange;
      case 3:
        return Colors.yellow;
      case 4:
        return Colors.green;
      default:
        return AppTheme.lightTheme.colorScheme.outline;
    }
  }

  String _getPasswordStrengthText() {
    switch (_passwordStrength) {
      case 1:
        return 'Weak';
      case 2:
        return 'Fair';
      case 3:
        return 'Good';
      case 4:
        return 'Strong';
      default:
        return '';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Login type selector
        Container(
          decoration: BoxDecoration(
            color: AppTheme.lightTheme.colorScheme.surface,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: AppTheme.lightTheme.colorScheme.outline,
              width: 1,
            ),
          ),
          child: Row(
            children: [
              Expanded(
                child: GestureDetector(
                  onTap: () => widget.onLoginTypeChanged(true),
                  child: Container(
                    padding: EdgeInsets.symmetric(vertical: 1.5.h),
                    decoration: BoxDecoration(
                      color: widget.isPhoneLogin
                          ? AppTheme.lightTheme.colorScheme.primary
                          : Colors.transparent,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      'Phone',
                      textAlign: TextAlign.center,
                      style: AppTheme.lightTheme.textTheme.bodyMedium?.copyWith(
                        color: widget.isPhoneLogin
                            ? AppTheme.lightTheme.colorScheme.onPrimary
                            : AppTheme.lightTheme.colorScheme.onSurfaceVariant,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ),
              ),
              Expanded(
                child: GestureDetector(
                  onTap: () => widget.onLoginTypeChanged(false),
                  child: Container(
                    padding: EdgeInsets.symmetric(vertical: 1.5.h),
                    decoration: BoxDecoration(
                      color: !widget.isPhoneLogin
                          ? AppTheme.lightTheme.colorScheme.primary
                          : Colors.transparent,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      'Email',
                      textAlign: TextAlign.center,
                      style: AppTheme.lightTheme.textTheme.bodyMedium?.copyWith(
                        color: !widget.isPhoneLogin
                            ? AppTheme.lightTheme.colorScheme.onPrimary
                            : AppTheme.lightTheme.colorScheme.onSurfaceVariant,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
        SizedBox(height: 3.h),

        // Phone/Email input
        widget.isPhoneLogin ? _buildPhoneField() : _buildEmailField(),
        SizedBox(height: 2.h),

        // Password input
        _buildPasswordField(),
        SizedBox(height: 1.h),

        // Password strength indicator
        if (_passwordController.text.isNotEmpty) ...[
          Row(
            children: [
              Expanded(
                child: Container(
                  height: 4,
                  decoration: BoxDecoration(
                    color: AppTheme.lightTheme.colorScheme.outline
                        .withValues(alpha: 0.3),
                    borderRadius: BorderRadius.circular(2),
                  ),
                  child: FractionallySizedBox(
                    alignment: Alignment.centerLeft,
                    widthFactor: _passwordStrength / 4,
                    child: Container(
                      decoration: BoxDecoration(
                        color: _getPasswordStrengthColor(),
                        borderRadius: BorderRadius.circular(2),
                      ),
                    ),
                  ),
                ),
              ),
              SizedBox(width: 2.w),
              Text(
                _getPasswordStrengthText(),
                style: AppTheme.lightTheme.textTheme.bodySmall?.copyWith(
                  color: _getPasswordStrengthColor(),
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
          SizedBox(height: 2.h),
        ],

        // Forgot password link
        Align(
          alignment: Alignment.centerRight,
          child: GestureDetector(
            onTap: widget.onForgotPassword,
            child: Text(
              'Forgot Password?',
              style: AppTheme.lightTheme.textTheme.bodyMedium?.copyWith(
                color: AppTheme.lightTheme.colorScheme.primary,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ),
        SizedBox(height: 4.h),

        // Login button
        SizedBox(
          width: double.infinity,
          height: 6.h,
          child: ElevatedButton(
            onPressed: _isFormValid() && !_isLoading ? _handleLogin : null,
            child: _isLoading
                ? SizedBox(
                    width: 20,
                    height: 20,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      valueColor: AlwaysStoppedAnimation<Color>(
                        AppTheme.lightTheme.colorScheme.onPrimary,
                      ),
                    ),
                  )
                : Text(
                    'Login',
                    style: AppTheme.lightTheme.textTheme.titleMedium?.copyWith(
                      color: AppTheme.lightTheme.colorScheme.onPrimary,
                    ),
                  ),
          ),
        ),
      ],
    );
  }

  Widget _buildPhoneField() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Phone Number',
          style: AppTheme.lightTheme.textTheme.bodyMedium?.copyWith(
            fontWeight: FontWeight.w600,
          ),
        ),
        SizedBox(height: 1.h),
        TextFormField(
          controller: _phoneController,
          focusNode: _phoneFocus,
          keyboardType: TextInputType.phone,
          inputFormatters: [
            FilteringTextInputFormatter.digitsOnly,
            LengthLimitingTextInputFormatter(10),
          ],
          onChanged: _validatePhone,
          decoration: InputDecoration(
            hintText: '24 123 4567',
            prefixIcon: Container(
              padding: EdgeInsets.symmetric(horizontal: 3.w),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    '+233',
                    style: AppTheme.lightTheme.textTheme.bodyLarge?.copyWith(
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  SizedBox(width: 2.w),
                  Container(
                    width: 1,
                    height: 20,
                    color: AppTheme.lightTheme.colorScheme.outline,
                  ),
                ],
              ),
            ),
            errorText: _phoneError.isNotEmpty ? _phoneError : null,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(
                color: _phoneError.isNotEmpty
                    ? AppTheme.lightTheme.colorScheme.error
                    : AppTheme.lightTheme.colorScheme.outline,
              ),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(
                color: _phoneError.isNotEmpty
                    ? AppTheme.lightTheme.colorScheme.error
                    : AppTheme.lightTheme.colorScheme.primary,
                width: 2,
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildEmailField() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Email Address',
          style: AppTheme.lightTheme.textTheme.bodyMedium?.copyWith(
            fontWeight: FontWeight.w600,
          ),
        ),
        SizedBox(height: 1.h),
        TextFormField(
          controller: _emailController,
          focusNode: _emailFocus,
          keyboardType: TextInputType.emailAddress,
          onChanged: _validateEmail,
          decoration: InputDecoration(
            hintText: 'your.email@example.com',
            prefixIcon: CustomIconWidget(
              iconName: 'email',
              color: AppTheme.lightTheme.colorScheme.onSurfaceVariant,
              size: 20,
            ),
            errorText: _emailError.isNotEmpty ? _emailError : null,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(
                color: _emailError.isNotEmpty
                    ? AppTheme.lightTheme.colorScheme.error
                    : AppTheme.lightTheme.colorScheme.outline,
              ),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(
                color: _emailError.isNotEmpty
                    ? AppTheme.lightTheme.colorScheme.error
                    : AppTheme.lightTheme.colorScheme.primary,
                width: 2,
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildPasswordField() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Password',
          style: AppTheme.lightTheme.textTheme.bodyMedium?.copyWith(
            fontWeight: FontWeight.w600,
          ),
        ),
        SizedBox(height: 1.h),
        TextFormField(
          controller: _passwordController,
          focusNode: _passwordFocus,
          obscureText: !_isPasswordVisible,
          onChanged: _validatePassword,
          decoration: InputDecoration(
            hintText: 'Enter your password',
            prefixIcon: CustomIconWidget(
              iconName: 'lock',
              color: AppTheme.lightTheme.colorScheme.onSurfaceVariant,
              size: 20,
            ),
            suffixIcon: GestureDetector(
              onTap: () =>
                  setState(() => _isPasswordVisible = !_isPasswordVisible),
              child: CustomIconWidget(
                iconName: _isPasswordVisible ? 'visibility' : 'visibility_off',
                color: AppTheme.lightTheme.colorScheme.onSurfaceVariant,
                size: 20,
              ),
            ),
            errorText: _passwordError.isNotEmpty ? _passwordError : null,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(
                color: _passwordError.isNotEmpty
                    ? AppTheme.lightTheme.colorScheme.error
                    : AppTheme.lightTheme.colorScheme.outline,
              ),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(
                color: _passwordError.isNotEmpty
                    ? AppTheme.lightTheme.colorScheme.error
                    : AppTheme.lightTheme.colorScheme.primary,
                width: 2,
              ),
            ),
          ),
        ),
      ],
    );
  }
}
