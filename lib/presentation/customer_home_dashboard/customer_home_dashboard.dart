import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:sizer/sizer.dart';

import '../../core/app_export.dart';
import '../../theme/app_theme.dart';
import '../../widgets/custom_icon_widget.dart';
import './widgets/nearby_stores_widget.dart';
import './widgets/popular_categories_widget.dart';
import './widgets/promotional_banner_widget.dart';
import './widgets/quick_reorder_widget.dart';
import './widgets/search_bar_widget.dart';
import 'widgets/nearby_stores_widget.dart';
import 'widgets/popular_categories_widget.dart';
import 'widgets/promotional_banner_widget.dart';
import 'widgets/quick_reorder_widget.dart';
import 'widgets/search_bar_widget.dart';

class CustomerHomeDashboard extends StatefulWidget {
  const CustomerHomeDashboard({Key? key}) : super(key: key);

  @override
  State<CustomerHomeDashboard> createState() => _CustomerHomeDashboardState();
}

class _CustomerHomeDashboardState extends State<CustomerHomeDashboard>
    with TickerProviderStateMixin {
  int _currentIndex = 0;
  bool _isLocationPermissionGranted = true;
  bool _isNetworkConnected = true;
  String _currentLocation = "East Legon, Accra";
  String _userName = "Kwame";
  late AnimationController _fabAnimationController;
  late Animation<double> _fabAnimation;
  bool _isChatbotVisible = false;

  final GlobalKey<RefreshIndicatorState> _refreshIndicatorKey =
      GlobalKey<RefreshIndicatorState>();

  @override
  void initState() {
    super.initState();
    _initializeAnimations();
    _checkLocationPermission();
    _checkNetworkConnectivity();
  }

  void _initializeAnimations() {
    _fabAnimationController = AnimationController(
      duration: const Duration(milliseconds: 300),
      vsync: this,
    );
    _fabAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _fabAnimationController,
      curve: Curves.elasticOut,
    ));
    _fabAnimationController.forward();
  }

  void _checkLocationPermission() {
    // Simulate location permission check
    Future.delayed(const Duration(milliseconds: 500), () {
      if (mounted) {
        setState(() {
          _isLocationPermissionGranted = true;
        });
      }
    });
  }

  void _checkNetworkConnectivity() {
    // Simulate network connectivity check
    Future.delayed(const Duration(milliseconds: 300), () {
      if (mounted) {
        setState(() {
          _isNetworkConnected = true;
        });
      }
    });
  }

  Future<void> _onRefresh() async {
    HapticFeedback.lightImpact();
    await Future.delayed(const Duration(seconds: 1));
    _checkLocationPermission();
    _checkNetworkConnectivity();
    if (mounted) {
      setState(() {
        // Refresh data
      });
    }
  }

  void _toggleChatbot() {
    setState(() {
      _isChatbotVisible = !_isChatbotVisible;
    });
    if (_isChatbotVisible) {
      _showChatbotDialog();
    }
  }

  void _showChatbotDialog() {
    showDialog(
      context: context,
      barrierDismissible: true,
      builder: (context) {
        return Dialog(
          backgroundColor: Colors.transparent,
          child: Container(
            width: 90.w,
            height: 60.h,
            decoration: BoxDecoration(
              color: AppTheme.lightTheme.colorScheme.surface,
              borderRadius: BorderRadius.circular(20),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.2),
                  blurRadius: 20,
                  offset: const Offset(0, 10),
                ),
              ],
            ),
            child: Column(
              children: [
                Container(
                  padding: EdgeInsets.all(4.w),
                  decoration: BoxDecoration(
                    color: AppTheme.lightTheme.primaryColor,
                    borderRadius: const BorderRadius.vertical(
                      top: Radius.circular(20),
                    ),
                  ),
                  child: Row(
                    children: [
                      Container(
                        padding: EdgeInsets.all(2.w),
                        decoration: const BoxDecoration(
                          color: Colors.white,
                          shape: BoxShape.circle,
                        ),
                        child: CustomIconWidget(
                          iconName: 'smart_toy',
                          color: AppTheme.lightTheme.primaryColor,
                          size: 24,
                        ),
                      ),
                      SizedBox(width: 3.w),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              "QuickMart Assistant",
                              style: AppTheme.lightTheme.textTheme.titleMedium
                                  ?.copyWith(
                                color: Colors.white,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            Text(
                              "English • Twi • Ga • Ewe",
                              style: AppTheme.lightTheme.textTheme.bodySmall
                                  ?.copyWith(
                                color: Colors.white.withValues(alpha: 0.8),
                              ),
                            ),
                          ],
                        ),
                      ),
                      GestureDetector(
                        onTap: () {
                          Navigator.pop(context);
                          setState(() {
                            _isChatbotVisible = false;
                          });
                        },
                        child: Container(
                          padding: EdgeInsets.all(1.w),
                          child: CustomIconWidget(
                            iconName: 'close',
                            color: Colors.white,
                            size: 20,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                Expanded(
                  child: Padding(
                    padding: EdgeInsets.all(4.w),
                    child: Column(
                      children: [
                        Expanded(
                          child: SingleChildScrollView(
                            child: Column(
                              children: [
                                _buildChatMessage(
                                  "Hello $_userName! I'm here to help you find the best groceries. What are you looking for today?",
                                  isBot: true,
                                ),
                                SizedBox(height: 2.h),
                                _buildQuickActions(),
                              ],
                            ),
                          ),
                        ),
                        _buildChatInput(),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    ).then((_) {
      setState(() {
        _isChatbotVisible = false;
      });
    });
  }

  Widget _buildChatMessage(String message, {bool isBot = false}) {
    return Align(
      alignment: isBot ? Alignment.centerLeft : Alignment.centerRight,
      child: Container(
        constraints: BoxConstraints(maxWidth: 70.w),
        padding: EdgeInsets.all(3.w),
        decoration: BoxDecoration(
          color: isBot
              ? AppTheme.lightTheme.primaryColor.withValues(alpha: 0.1)
              : AppTheme.lightTheme.primaryColor,
          borderRadius: BorderRadius.circular(16),
        ),
        child: Text(
          message,
          style: AppTheme.lightTheme.textTheme.bodyMedium?.copyWith(
            color: isBot
                ? AppTheme.lightTheme.colorScheme.onSurface
                : Colors.white,
          ),
        ),
      ),
    );
  }

  Widget _buildQuickActions() {
    final List<Map<String, String>> quickActions = [
      {"text": "Find rice and grains", "action": "search_rice"},
      {"text": "Show nearby stores", "action": "nearby_stores"},
      {"text": "Popular categories", "action": "categories"},
      {"text": "My recent orders", "action": "orders"},
    ];

    return Wrap(
      spacing: 2.w,
      runSpacing: 1.h,
      children: quickActions.map((action) {
        return GestureDetector(
          onTap: () {
            Navigator.pop(context);
            if (action["action"] == "nearby_stores") {
              Navigator.pushNamed(context, '/store-browse-and-product-catalog');
            }
          },
          child: Container(
            padding: EdgeInsets.symmetric(horizontal: 3.w, vertical: 1.h),
            decoration: BoxDecoration(
              border: Border.all(
                color: AppTheme.lightTheme.primaryColor.withValues(alpha: 0.3),
              ),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Text(
              action["text"]!,
              style: AppTheme.lightTheme.textTheme.bodySmall?.copyWith(
                color: AppTheme.lightTheme.primaryColor,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
        );
      }).toList(),
    );
  }

  Widget _buildChatInput() {
    return Container(
      padding: EdgeInsets.all(2.w),
      decoration: BoxDecoration(
        color: AppTheme.lightTheme.colorScheme.surface,
        borderRadius: BorderRadius.circular(25),
        border: Border.all(
          color: AppTheme.lightTheme.primaryColor.withValues(alpha: 0.3),
        ),
      ),
      child: Row(
        children: [
          Expanded(
            child: TextField(
              decoration: InputDecoration(
                hintText: "Type your message...",
                hintStyle: AppTheme.lightTheme.textTheme.bodyMedium?.copyWith(
                  color: AppTheme.lightTheme.colorScheme.onSurface
                      .withValues(alpha: 0.6),
                ),
                border: InputBorder.none,
                contentPadding: EdgeInsets.symmetric(horizontal: 3.w),
              ),
              style: AppTheme.lightTheme.textTheme.bodyMedium,
            ),
          ),
          GestureDetector(
            onTap: () {
              // Handle voice input
            },
            child: Container(
              padding: EdgeInsets.all(2.w),
              decoration: BoxDecoration(
                color: AppTheme.lightTheme.primaryColor.withValues(alpha: 0.1),
                shape: BoxShape.circle,
              ),
              child: CustomIconWidget(
                iconName: 'mic',
                color: AppTheme.lightTheme.primaryColor,
                size: 20,
              ),
            ),
          ),
          SizedBox(width: 2.w),
          GestureDetector(
            onTap: () {
              // Handle send message
            },
            child: Container(
              padding: EdgeInsets.all(2.w),
              decoration: BoxDecoration(
                color: AppTheme.lightTheme.primaryColor,
                shape: BoxShape.circle,
              ),
              child: CustomIconWidget(
                iconName: 'send',
                color: Colors.white,
                size: 20,
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _showLocationSelector() {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppTheme.lightTheme.colorScheme.surface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        final List<String> locations = [
          "East Legon, Accra",
          "Osu, Accra",
          "Tema, Greater Accra",
          "Kumasi, Ashanti",
          "Cape Coast, Central",
        ];

        return Container(
          padding: EdgeInsets.all(4.w),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 12.w,
                height: 0.5.h,
                decoration: BoxDecoration(
                  color: AppTheme.lightTheme.colorScheme.onSurface
                      .withValues(alpha: 0.3),
                  borderRadius: BorderRadius.circular(4),
                ),
              ),
              SizedBox(height: 2.h),
              Text(
                "Select Location",
                style: AppTheme.lightTheme.textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.w600,
                ),
              ),
              SizedBox(height: 2.h),
              ...locations.map((location) {
                return ListTile(
                  leading: CustomIconWidget(
                    iconName: 'location_on',
                    color: location == _currentLocation
                        ? AppTheme.lightTheme.primaryColor
                        : AppTheme.lightTheme.colorScheme.onSurface
                            .withValues(alpha: 0.6),
                    size: 24,
                  ),
                  title: Text(
                    location,
                    style: AppTheme.lightTheme.textTheme.bodyMedium?.copyWith(
                      fontWeight: location == _currentLocation
                          ? FontWeight.w600
                          : FontWeight.w400,
                      color: location == _currentLocation
                          ? AppTheme.lightTheme.primaryColor
                          : AppTheme.lightTheme.colorScheme.onSurface,
                    ),
                  ),
                  trailing: location == _currentLocation
                      ? CustomIconWidget(
                          iconName: 'check_circle',
                          color: AppTheme.lightTheme.primaryColor,
                          size: 20,
                        )
                      : null,
                  onTap: () {
                    setState(() {
                      _currentLocation = location;
                    });
                    Navigator.pop(context);
                  },
                );
              }).toList(),
              SizedBox(height: 2.h),
            ],
          ),
        );
      },
    );
  }

  @override
  void dispose() {
    _fabAnimationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.lightTheme.scaffoldBackgroundColor,
      body: SafeArea(
        child: Column(
          children: [
            _buildStatusBar(),
            _buildHeader(),
            Expanded(
              child: RefreshIndicator(
                key: _refreshIndicatorKey,
                onRefresh: _onRefresh,
                color: AppTheme.lightTheme.primaryColor,
                child: SingleChildScrollView(
                  physics: const AlwaysScrollableScrollPhysics(),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const SearchBarWidget(),
                      const PromotionalBannerWidget(),
                      const NearbyStoresWidget(),
                      SizedBox(height: 2.h),
                      const QuickReorderWidget(),
                      SizedBox(height: 2.h),
                      const PopularCategoriesWidget(),
                      SizedBox(height: 10.h), // Bottom padding for FAB
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: _buildBottomNavigationBar(),
      floatingActionButton: ScaleTransition(
        scale: _fabAnimation,
        child: FloatingActionButton(
          onPressed: _toggleChatbot,
          backgroundColor: AppTheme.lightTheme.colorScheme.secondary,
          child: AnimatedSwitcher(
            duration: const Duration(milliseconds: 300),
            child: _isChatbotVisible
                ? CustomIconWidget(
                    iconName: 'close',
                    color: Colors.white,
                    size: 24,
                  )
                : Stack(
                    children: [
                      CustomIconWidget(
                        iconName: 'smart_toy',
                        color: Colors.white,
                        size: 24,
                      ),
                      Positioned(
                        right: 0,
                        top: 0,
                        child: Container(
                          width: 8,
                          height: 8,
                          decoration: const BoxDecoration(
                            color: Colors.green,
                            shape: BoxShape.circle,
                          ),
                        ),
                      ),
                    ],
                  ),
          ),
        ),
      ),
    );
  }

  Widget _buildStatusBar() {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 4.w, vertical: 1.h),
      child: Row(
        children: [
          Container(
            padding: EdgeInsets.symmetric(horizontal: 2.w, vertical: 0.5.h),
            decoration: BoxDecoration(
              color: _isLocationPermissionGranted
                  ? Colors.green.withValues(alpha: 0.1)
                  : Colors.red.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                CustomIconWidget(
                  iconName: _isLocationPermissionGranted
                      ? 'location_on'
                      : 'location_off',
                  color:
                      _isLocationPermissionGranted ? Colors.green : Colors.red,
                  size: 12,
                ),
                SizedBox(width: 1.w),
                Text(
                  _isLocationPermissionGranted ? "Location" : "No Location",
                  style: AppTheme.lightTheme.textTheme.labelSmall?.copyWith(
                    color: _isLocationPermissionGranted
                        ? Colors.green
                        : Colors.red,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
          SizedBox(width: 2.w),
          Container(
            padding: EdgeInsets.symmetric(horizontal: 2.w, vertical: 0.5.h),
            decoration: BoxDecoration(
              color: _isNetworkConnected
                  ? Colors.green.withValues(alpha: 0.1)
                  : Colors.red.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                CustomIconWidget(
                  iconName: _isNetworkConnected ? 'wifi' : 'wifi_off',
                  color: _isNetworkConnected ? Colors.green : Colors.red,
                  size: 12,
                ),
                SizedBox(width: 1.w),
                Text(
                  _isNetworkConnected ? "Online" : "Offline",
                  style: AppTheme.lightTheme.textTheme.labelSmall?.copyWith(
                    color: _isNetworkConnected ? Colors.green : Colors.red,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHeader() {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 4.w, vertical: 2.h),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: EdgeInsets.all(3.w),
                decoration: BoxDecoration(
                  color:
                      AppTheme.lightTheme.primaryColor.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: CustomIconWidget(
                  iconName: 'shopping_cart',
                  color: AppTheme.lightTheme.primaryColor,
                  size: 28,
                ),
              ),
              SizedBox(width: 3.w),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      "QuickMart",
                      style:
                          AppTheme.lightTheme.textTheme.headlineSmall?.copyWith(
                        fontWeight: FontWeight.w800,
                        color: AppTheme.lightTheme.primaryColor,
                      ),
                    ),
                    Text(
                      "Good ${_getGreeting()}, $_userName!",
                      style: AppTheme.lightTheme.textTheme.bodyMedium?.copyWith(
                        color: AppTheme.lightTheme.colorScheme.onSurface
                            .withValues(alpha: 0.7),
                      ),
                    ),
                  ],
                ),
              ),
              GestureDetector(
                onTap: () {
                  Navigator.pushNamed(context, '/shopping-cart-and-checkout');
                },
                child: Container(
                  padding: EdgeInsets.all(3.w),
                  decoration: BoxDecoration(
                    color: AppTheme.lightTheme.colorScheme.surface,
                    borderRadius: BorderRadius.circular(12),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.1),
                        blurRadius: 4,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: Stack(
                    children: [
                      CustomIconWidget(
                        iconName: 'shopping_bag',
                        color: AppTheme.lightTheme.colorScheme.onSurface,
                        size: 24,
                      ),
                      Positioned(
                        right: 0,
                        top: 0,
                        child: Container(
                          width: 8,
                          height: 8,
                          decoration: BoxDecoration(
                            color: AppTheme.lightTheme.colorScheme.secondary,
                            shape: BoxShape.circle,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
          SizedBox(height: 2.h),
          GestureDetector(
            onTap: _showLocationSelector,
            child: Container(
              padding: EdgeInsets.symmetric(horizontal: 3.w, vertical: 1.h),
              decoration: BoxDecoration(
                color: AppTheme.lightTheme.colorScheme.surface,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color:
                      AppTheme.lightTheme.primaryColor.withValues(alpha: 0.2),
                ),
              ),
              child: Row(
                children: [
                  CustomIconWidget(
                    iconName: 'location_on',
                    color: AppTheme.lightTheme.primaryColor,
                    size: 20,
                  ),
                  SizedBox(width: 2.w),
                  Expanded(
                    child: Text(
                      _currentLocation,
                      style: AppTheme.lightTheme.textTheme.bodyMedium?.copyWith(
                        fontWeight: FontWeight.w500,
                        color: AppTheme.lightTheme.colorScheme.onSurface,
                      ),
                    ),
                  ),
                  CustomIconWidget(
                    iconName: 'keyboard_arrow_down',
                    color: AppTheme.lightTheme.colorScheme.onSurface
                        .withValues(alpha: 0.6),
                    size: 20,
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBottomNavigationBar() {
    return Container(
      decoration: BoxDecoration(
        color: AppTheme.lightTheme.colorScheme.surface,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.1),
            blurRadius: 8,
            offset: const Offset(0, -2),
          ),
        ],
      ),
      child: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) {
          setState(() {
            _currentIndex = index;
          });
          _handleBottomNavigation(index);
        },
        type: BottomNavigationBarType.fixed,
        backgroundColor: AppTheme.lightTheme.colorScheme.surface,
        selectedItemColor: AppTheme.lightTheme.primaryColor,
        unselectedItemColor:
            AppTheme.lightTheme.colorScheme.onSurface.withValues(alpha: 0.6),
        selectedLabelStyle: AppTheme.lightTheme.textTheme.labelSmall?.copyWith(
          fontWeight: FontWeight.w600,
        ),
        unselectedLabelStyle: AppTheme.lightTheme.textTheme.labelSmall,
        items: [
          BottomNavigationBarItem(
            icon: CustomIconWidget(
              iconName: 'home',
              color: _currentIndex == 0
                  ? AppTheme.lightTheme.primaryColor
                  : AppTheme.lightTheme.colorScheme.onSurface
                      .withValues(alpha: 0.6),
              size: 24,
            ),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: CustomIconWidget(
              iconName: 'search',
              color: _currentIndex == 1
                  ? AppTheme.lightTheme.primaryColor
                  : AppTheme.lightTheme.colorScheme.onSurface
                      .withValues(alpha: 0.6),
              size: 24,
            ),
            label: 'Browse',
          ),
          BottomNavigationBarItem(
            icon: CustomIconWidget(
              iconName: 'receipt_long',
              color: _currentIndex == 2
                  ? AppTheme.lightTheme.primaryColor
                  : AppTheme.lightTheme.colorScheme.onSurface
                      .withValues(alpha: 0.6),
              size: 24,
            ),
            label: 'Orders',
          ),
          BottomNavigationBarItem(
            icon: CustomIconWidget(
              iconName: 'person',
              color: _currentIndex == 3
                  ? AppTheme.lightTheme.primaryColor
                  : AppTheme.lightTheme.colorScheme.onSurface
                      .withValues(alpha: 0.6),
              size: 24,
            ),
            label: 'Profile',
          ),
        ],
      ),
    );
  }

  void _handleBottomNavigation(int index) {
    switch (index) {
      case 0:
        // Already on home
        break;
      case 1:
        Navigator.pushNamed(context, '/store-browse-and-product-catalog');
        break;
      case 2:
        Navigator.pushNamed(context, '/shopping-cart-and-checkout');
        break;
      case 3:
        // Navigate to profile (not implemented in this scope)
        break;
    }
  }

  String _getGreeting() {
    final hour = DateTime.now().hour;
    if (hour < 12) {
      return "morning";
    } else if (hour < 17) {
      return "afternoon";
    } else {
      return "evening";
    }
  }
}