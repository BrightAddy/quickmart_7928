import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:sizer/sizer.dart';

import '../../../core/app_export.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({Key? key}) : super(key: key);

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with TickerProviderStateMixin {
  late AnimationController _logoAnimationController;
  late AnimationController _loadingAnimationController;
  late AnimationController _backgroundAnimationController;

  late Animation<double> _logoScaleAnimation;
  late Animation<double> _logoFadeAnimation;
  late Animation<double> _loadingRotationAnimation;
  late Animation<Color?> _backgroundColorAnimation;

  bool _isInitialized = false;
  bool _hasError = false;
  int _retryCount = 0;
  static const int _maxRetries = 3;

  @override
  void initState() {
    super.initState();
    _setupAnimations();
    _initializeApp();
  }

  void _setupAnimations() {
    // Logo animation controller
    _logoAnimationController = AnimationController(
      duration: const Duration(milliseconds: 1500),
      vsync: this,
    );

    // Loading animation controller
    _loadingAnimationController = AnimationController(
      duration: const Duration(milliseconds: 2000),
      vsync: this,
    );

    // Background animation controller
    _backgroundAnimationController = AnimationController(
      duration: const Duration(milliseconds: 3000),
      vsync: this,
    );

    // Logo scale animation with bounce effect
    _logoScaleAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _logoAnimationController,
      curve: Curves.elasticOut,
    ));

    // Logo fade animation
    _logoFadeAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _logoAnimationController,
      curve: const Interval(0.0, 0.8, curve: Curves.easeInOut),
    ));

    // Loading rotation animation
    _loadingRotationAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _loadingAnimationController,
      curve: Curves.linear,
    ));

    // Background color animation
    _backgroundColorAnimation = ColorTween(
      begin: AppTheme.lightTheme.colorScheme.primary,
      end: AppTheme.lightTheme.colorScheme.secondary,
    ).animate(CurvedAnimation(
      parent: _backgroundAnimationController,
      curve: Curves.easeInOut,
    ));

    // Start animations
    _logoAnimationController.forward();
    _loadingAnimationController.repeat();
    _backgroundAnimationController.repeat(reverse: true);
  }

  Future<void> _initializeApp() async {
    try {
      // Simulate app initialization tasks
      await Future.wait([
        _checkAuthenticationStatus(),
        _loadUserPreferences(),
        _fetchEssentialConfig(),
        _prepareCachedData(),
      ]);

      if (mounted) {
        setState(() {
          _isInitialized = true;
          _hasError = false;
        });

        // Wait for minimum splash duration
        await Future.delayed(const Duration(milliseconds: 500));

        if (mounted) {
          _navigateToNextScreen();
        }
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _hasError = true;
        });

        if (_retryCount < _maxRetries) {
          _retryCount++;
          await Future.delayed(const Duration(seconds: 2));
          if (mounted) {
            _initializeApp();
          }
        } else {
          // Show retry option after max retries
          await Future.delayed(const Duration(seconds: 3));
          if (mounted) {
            _showRetryOption();
          }
        }
      }
    }
  }

  Future<void> _checkAuthenticationStatus() async {
    // Simulate checking authentication
    await Future.delayed(const Duration(milliseconds: 800));
  }

  Future<void> _loadUserPreferences() async {
    // Simulate loading user preferences and role
    await Future.delayed(const Duration(milliseconds: 600));
  }

  Future<void> _fetchEssentialConfig() async {
    // Simulate fetching essential configuration
    await Future.delayed(const Duration(milliseconds: 700));
  }

  Future<void> _prepareCachedData() async {
    // Simulate preparing multilingual cached data
    await Future.delayed(const Duration(milliseconds: 500));
  }

  void _navigateToNextScreen() {
    // Simulate navigation logic based on user state
    final bool isAuthenticated =
        false; // This would be determined from actual auth check
    final bool isFirstTime = true; // This would be determined from preferences

    String nextRoute;
    if (isAuthenticated) {
      // Navigate to role-specific dashboard
      nextRoute =
          '/customer-home-dashboard'; // This would be determined by user role
    } else if (isFirstTime) {
      nextRoute = '/user-role-selection';
    } else {
      nextRoute = '/login-screen';
    }

    Navigator.pushReplacementNamed(context, nextRoute);
  }

  void _showRetryOption() {
    if (!mounted) return;

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) {
        return AlertDialog(
          backgroundColor: AppTheme.lightTheme.colorScheme.surface,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16.0),
          ),
          title: Text(
            'Connection Error',
            style: AppTheme.lightTheme.textTheme.titleLarge?.copyWith(
              color: AppTheme.lightTheme.colorScheme.onSurface,
            ),
          ),
          content: Text(
            'Unable to initialize the app. Please check your internet connection and try again.',
            style: AppTheme.lightTheme.textTheme.bodyMedium?.copyWith(
              color: AppTheme.lightTheme.colorScheme.onSurface,
            ),
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
                _retryCount = 0;
                setState(() {
                  _hasError = false;
                });
                _initializeApp();
              },
              child: Text(
                'Retry',
                style: TextStyle(
                  color: AppTheme.lightTheme.colorScheme.primary,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ],
        );
      },
    );
  }

  @override
  void dispose() {
    _logoAnimationController.dispose();
    _loadingAnimationController.dispose();
    _backgroundAnimationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    // Hide status bar on Android, match brand color on iOS
    SystemChrome.setSystemUIOverlayStyle(
      SystemUiOverlayStyle(
        statusBarColor: Colors.transparent,
        statusBarIconBrightness: Brightness.light,
        statusBarBrightness: Brightness.dark,
      ),
    );

    return Scaffold(
      body: AnimatedBuilder(
        animation: Listenable.merge([
          _backgroundAnimationController,
          _logoAnimationController,
          _loadingAnimationController,
        ]),
        builder: (context, child) {
          return Container(
            width: double.infinity,
            height: double.infinity,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  _backgroundColorAnimation.value ??
                      AppTheme.lightTheme.colorScheme.primary,
                  AppTheme.lightTheme.colorScheme.primary
                      .withValues(alpha: 0.8),
                  AppTheme.lightTheme.colorScheme.secondary
                      .withValues(alpha: 0.6),
                ],
                stops: const [0.0, 0.5, 1.0],
              ),
            ),
            child: SafeArea(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  // Spacer to push content to center
                  const Spacer(flex: 2),

                  // Logo section with animation
                  AnimatedBuilder(
                    animation: _logoAnimationController,
                    builder: (context, child) {
                      return Transform.scale(
                        scale: _logoScaleAnimation.value,
                        child: Opacity(
                          opacity: _logoFadeAnimation.value,
                          child: _buildLogoSection(),
                        ),
                      );
                    },
                  ),

                  SizedBox(height: 8.h),

                  // App name
                  AnimatedBuilder(
                    animation: _logoAnimationController,
                    builder: (context, child) {
                      return Opacity(
                        opacity: _logoFadeAnimation.value,
                        child: Text(
                          'QuickMart',
                          style: AppTheme.lightTheme.textTheme.headlineLarge
                              ?.copyWith(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 1.2,
                          ),
                        ),
                      );
                    },
                  ),

                  SizedBox(height: 2.h),

                  // Tagline
                  AnimatedBuilder(
                    animation: _logoAnimationController,
                    builder: (context, child) {
                      return Opacity(
                        opacity: _logoFadeAnimation.value * 0.8,
                        child: Text(
                          'Your Grocery, Delivered Fast',
                          style:
                              AppTheme.lightTheme.textTheme.bodyLarge?.copyWith(
                            color: Colors.white.withValues(alpha: 0.9),
                            letterSpacing: 0.5,
                          ),
                        ),
                      );
                    },
                  ),

                  const Spacer(flex: 1),

                  // Loading section
                  _buildLoadingSection(),

                  SizedBox(height: 6.h),

                  // Error retry section
                  if (_hasError) _buildErrorSection(),

                  const Spacer(flex: 1),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildLogoSection() {
    return Container(
      width: 25.w,
      height: 25.w,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20.0),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.2),
            blurRadius: 20.0,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: Stack(
        alignment: Alignment.center,
        children: [
          // Adinkra symbol motif background
          Container(
            width: 20.w,
            height: 20.w,
            decoration: BoxDecoration(
              color: AppTheme.lightTheme.colorScheme.primary
                  .withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(16.0),
            ),
          ),

          // Main logo icon
          CustomIconWidget(
            iconName: 'shopping_cart',
            color: AppTheme.lightTheme.colorScheme.primary,
            size: 12.w,
          ),

          // Decorative elements inspired by Kente patterns
          Positioned(
            top: 2.w,
            right: 2.w,
            child: Container(
              width: 1.5.w,
              height: 1.5.w,
              decoration: BoxDecoration(
                color: AppTheme.lightTheme.colorScheme.secondary,
                shape: BoxShape.circle,
              ),
            ),
          ),
          Positioned(
            bottom: 2.w,
            left: 2.w,
            child: Container(
              width: 1.w,
              height: 1.w,
              decoration: BoxDecoration(
                color: AppTheme.lightTheme.colorScheme.secondary
                    .withValues(alpha: 0.7),
                shape: BoxShape.circle,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLoadingSection() {
    return Column(
      children: [
        // Spinning Adinkra symbol loading animation
        AnimatedBuilder(
          animation: _loadingAnimationController,
          builder: (context, child) {
            return Transform.rotate(
              angle: _loadingRotationAnimation.value * 2 * 3.14159,
              child: Container(
                width: 8.w,
                height: 8.w,
                decoration: BoxDecoration(
                  border: Border.all(
                    color: Colors.white.withValues(alpha: 0.3),
                    width: 2.0,
                  ),
                  borderRadius: BorderRadius.circular(8.w),
                ),
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    CustomIconWidget(
                      iconName: 'refresh',
                      color: Colors.white,
                      size: 4.w,
                    ),
                  ],
                ),
              ),
            );
          },
        ),

        SizedBox(height: 3.h),

        // Progress indicator
        Container(
          width: 60.w,
          height: 0.5.h,
          decoration: BoxDecoration(
            color: Colors.white.withValues(alpha: 0.2),
            borderRadius: BorderRadius.circular(2.0),
          ),
          child: AnimatedBuilder(
            animation: _loadingAnimationController,
            builder: (context, child) {
              return FractionallySizedBox(
                alignment: Alignment.centerLeft,
                widthFactor: (_loadingAnimationController.value * 0.8) + 0.2,
                child: Container(
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(2.0),
                  ),
                ),
              );
            },
          ),
        ),

        SizedBox(height: 2.h),

        // Loading text
        AnimatedBuilder(
          animation: _loadingAnimationController,
          builder: (context, child) {
            final loadingTexts = [
              'Initializing...',
              'Loading preferences...',
              'Preparing your experience...',
              'Almost ready...',
            ];
            final textIndex =
                (_loadingAnimationController.value * loadingTexts.length)
                        .floor() %
                    loadingTexts.length;

            return Text(
              _hasError
                  ? 'Connection failed. Retrying...'
                  : loadingTexts[textIndex],
              style: AppTheme.lightTheme.textTheme.bodyMedium?.copyWith(
                color: Colors.white.withValues(alpha: 0.8),
                letterSpacing: 0.3,
              ),
            );
          },
        ),
      ],
    );
  }

  Widget _buildErrorSection() {
    return Container(
      margin: EdgeInsets.symmetric(horizontal: 8.w),
      padding: EdgeInsets.all(4.w),
      decoration: BoxDecoration(
        color: Colors.red.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(12.0),
        border: Border.all(
          color: Colors.red.withValues(alpha: 0.3),
          width: 1.0,
        ),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          CustomIconWidget(
            iconName: 'error_outline',
            color: Colors.red.shade300,
            size: 5.w,
          ),
          SizedBox(width: 3.w),
          Expanded(
            child: Text(
              'Having trouble connecting. Retrying automatically...',
              style: AppTheme.lightTheme.textTheme.bodySmall?.copyWith(
                color: Colors.red.shade300,
              ),
              textAlign: TextAlign.center,
            ),
          ),
        ],
      ),
    );
  }
}
