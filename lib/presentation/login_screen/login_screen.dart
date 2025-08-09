import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:sizer/sizer.dart';

import '../../core/app_export.dart';
import './widgets/language_selector_widget.dart';
import './widgets/login_form_widget.dart';
import './widgets/social_login_widget.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({Key? key}) : super(key: key);

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen>
    with TickerProviderStateMixin {
  String _selectedLanguage = 'en';
  bool _isPhoneLogin = true;
  late AnimationController _logoAnimationController;
  late AnimationController _formAnimationController;
  late Animation<double> _logoAnimation;
  late Animation<Offset> _formSlideAnimation;
  late Animation<double> _formFadeAnimation;

  // Mock credentials for testing
  final Map<String, Map<String, String>> _mockCredentials = {
    'customer': {
      'phone': '+233241234567',
      'email': 'customer@quickmart.gh',
      'password': 'customer123',
    },
    'shopper': {
      'phone': '+233207654321',
      'email': 'shopper@quickmart.gh',
      'password': 'shopper123',
    },
    'store_owner': {
      'phone': '+233501234567',
      'email': 'store@quickmart.gh',
      'password': 'store123',
    },
  };

  @override
  void initState() {
    super.initState();
    _initializeAnimations();
    _startAnimations();
  }

  void _initializeAnimations() {
    _logoAnimationController = AnimationController(
      duration: const Duration(milliseconds: 1200),
      vsync: this,
    );

    _formAnimationController = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );

    _logoAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _logoAnimationController,
      curve: Curves.elasticOut,
    ));

    _formSlideAnimation = Tween<Offset>(
      begin: const Offset(0, 0.3),
      end: Offset.zero,
    ).animate(CurvedAnimation(
      parent: _formAnimationController,
      curve: Curves.easeOutCubic,
    ));

    _formFadeAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _formAnimationController,
      curve: Curves.easeOut,
    ));
  }

  void _startAnimations() {
    _logoAnimationController.forward();
    Future.delayed(const Duration(milliseconds: 400), () {
      if (mounted) {
        _formAnimationController.forward();
      }
    });
  }

  @override
  void dispose() {
    _logoAnimationController.dispose();
    _formAnimationController.dispose();
    super.dispose();
  }

  void _onLanguageChanged(String languageCode) {
    setState(() {
      _selectedLanguage = languageCode;
    });
  }

  void _onLoginTypeChanged(bool isPhoneLogin) {
    setState(() {
      _isPhoneLogin = isPhoneLogin;
    });
  }

  Future<void> _handleLogin(String identifier, String password) async {
    // Simulate network delay
    await Future.delayed(const Duration(seconds: 2));

    // Check mock credentials
    bool isValidCredential = false;
    String userType = '';

    for (String type in _mockCredentials.keys) {
      final credentials = _mockCredentials[type]!;
      if ((identifier == credentials['phone'] ||
              identifier == credentials['email']) &&
          password == credentials['password']) {
        isValidCredential = true;
        userType = type;
        break;
      }
    }

    if (!mounted) return;

    if (isValidCredential) {
      // Provide haptic feedback
      HapticFeedback.lightImpact();

      // Navigate based on user type
      String route = '/customer-home-dashboard';
      switch (userType) {
        case 'customer':
          route = '/customer-home-dashboard';
          break;
        case 'shopper':
          route =
              '/customer-home-dashboard'; // Using same route as per available routes
          break;
        case 'store_owner':
          route =
              '/customer-home-dashboard'; // Using same route as per available routes
          break;
      }

      Navigator.pushReplacementNamed(context, route);
    } else {
      // Show error message
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            'Invalid credentials. Please check your login details.',
            style: AppTheme.lightTheme.textTheme.bodyMedium?.copyWith(
              color: Colors.white,
            ),
          ),
          backgroundColor: AppTheme.lightTheme.colorScheme.error,
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          margin: EdgeInsets.all(4.w),
        ),
      );
    }
  }

  void _handleForgotPassword() {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppTheme.lightTheme.colorScheme.surface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => Container(
        padding: EdgeInsets.symmetric(horizontal: 4.w, vertical: 3.h),
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
            CustomIconWidget(
              iconName: 'lock_reset',
              color: AppTheme.lightTheme.colorScheme.primary,
              size: 48,
            ),
            SizedBox(height: 2.h),
            Text(
              'Reset Password',
              style: AppTheme.lightTheme.textTheme.titleLarge,
            ),
            SizedBox(height: 1.h),
            Text(
              'We\'ll send you a verification code to reset your password',
              style: AppTheme.lightTheme.textTheme.bodyMedium?.copyWith(
                color: AppTheme.lightTheme.colorScheme.onSurfaceVariant,
              ),
              textAlign: TextAlign.center,
            ),
            SizedBox(height: 3.h),
            SizedBox(
              width: double.infinity,
              height: 6.h,
              child: ElevatedButton(
                onPressed: () {
                  Navigator.pop(context);
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text(
                        'Password reset link sent to your ${_isPhoneLogin ? 'phone' : 'email'}',
                        style:
                            AppTheme.lightTheme.textTheme.bodyMedium?.copyWith(
                          color: Colors.white,
                        ),
                      ),
                      backgroundColor: AppTheme.lightTheme.colorScheme.primary,
                      behavior: SnackBarBehavior.floating,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      margin: EdgeInsets.all(4.w),
                    ),
                  );
                },
                child: Text('Send Reset Code'),
              ),
            ),
            SizedBox(height: 2.h),
          ],
        ),
      ),
    );
  }

  void _handleSocialLogin(String provider) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          '$provider login will be available soon',
          style: AppTheme.lightTheme.textTheme.bodyMedium?.copyWith(
            color: Colors.white,
          ),
        ),
        backgroundColor: AppTheme.lightTheme.colorScheme.primary,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        margin: EdgeInsets.all(4.w),
      ),
    );
  }

  void _navigateToSignUp() {
    Navigator.pushNamed(context, '/user-role-selection');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.lightTheme.scaffoldBackgroundColor,
      body: SafeArea(
        child: GestureDetector(
          onTap: () => FocusScope.of(context).unfocus(),
          child: SingleChildScrollView(
            padding: EdgeInsets.symmetric(horizontal: 6.w),
            child: ConstrainedBox(
              constraints: BoxConstraints(
                minHeight: MediaQuery.of(context).size.height -
                    MediaQuery.of(context).padding.top -
                    MediaQuery.of(context).padding.bottom,
              ),
              child: Column(
                children: [
                  SizedBox(height: 2.h),

                  // Header with language selector
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const SizedBox(width: 80), // Spacer for centering
                      Expanded(
                        child: Center(
                          child: Text(
                            'Welcome Back',
                            style: AppTheme.lightTheme.textTheme.headlineSmall
                                ?.copyWith(
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ),
                      ),
                      LanguageSelectorWidget(
                        selectedLanguage: _selectedLanguage,
                        onLanguageChanged: _onLanguageChanged,
                      ),
                    ],
                  ),

                  SizedBox(height: 4.h),

                  // Animated Logo
                  AnimatedBuilder(
                    animation: _logoAnimation,
                    builder: (context, child) {
                      return Transform.scale(
                        scale: _logoAnimation.value,
                        child: Container(
                          width: 25.w,
                          height: 25.w,
                          decoration: BoxDecoration(
                            color: AppTheme.lightTheme.colorScheme.primary,
                            borderRadius: BorderRadius.circular(20),
                            boxShadow: [
                              BoxShadow(
                                color: AppTheme.lightTheme.colorScheme.primary
                                    .withValues(alpha: 0.3),
                                blurRadius: 20,
                                offset: const Offset(0, 10),
                              ),
                            ],
                          ),
                          child: Center(
                            child: Text(
                              'QM',
                              style: AppTheme
                                  .lightTheme.textTheme.headlineMedium
                                  ?.copyWith(
                                color:
                                    AppTheme.lightTheme.colorScheme.onPrimary,
                                fontWeight: FontWeight.w800,
                              ),
                            ),
                          ),
                        ),
                      );
                    },
                  ),

                  SizedBox(height: 2.h),

                  Text(
                    'QuickMart',
                    style:
                        AppTheme.lightTheme.textTheme.headlineMedium?.copyWith(
                      fontWeight: FontWeight.w700,
                      color: AppTheme.lightTheme.colorScheme.primary,
                    ),
                  ),

                  SizedBox(height: 1.h),

                  Text(
                    'Your favorite groceries, delivered fast',
                    style: AppTheme.lightTheme.textTheme.bodyLarge?.copyWith(
                      color: AppTheme.lightTheme.colorScheme.onSurfaceVariant,
                    ),
                    textAlign: TextAlign.center,
                  ),

                  SizedBox(height: 5.h),

                  // Animated Form
                  SlideTransition(
                    position: _formSlideAnimation,
                    child: FadeTransition(
                      opacity: _formFadeAnimation,
                      child: Column(
                        children: [
                          // Login Form
                          LoginFormWidget(
                            isPhoneLogin: _isPhoneLogin,
                            onLoginTypeChanged: _onLoginTypeChanged,
                            onLogin: _handleLogin,
                            onForgotPassword: _handleForgotPassword,
                          ),

                          SizedBox(height: 4.h),

                          // Social Login
                          SocialLoginWidget(
                            onGoogleLogin: () => _handleSocialLogin('Google'),
                            onAppleLogin: () => _handleSocialLogin('Apple'),
                          ),

                          SizedBox(height: 4.h),

                          // Sign up link
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text(
                                'New user? ',
                                style: AppTheme.lightTheme.textTheme.bodyMedium
                                    ?.copyWith(
                                  color: AppTheme
                                      .lightTheme.colorScheme.onSurfaceVariant,
                                ),
                              ),
                              GestureDetector(
                                onTap: _navigateToSignUp,
                                child: Text(
                                  'Sign Up',
                                  style: AppTheme
                                      .lightTheme.textTheme.bodyMedium
                                      ?.copyWith(
                                    color:
                                        AppTheme.lightTheme.colorScheme.primary,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ),
                            ],
                          ),

                          SizedBox(height: 3.h),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
