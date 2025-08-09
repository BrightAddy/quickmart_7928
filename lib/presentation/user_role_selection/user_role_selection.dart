import 'package:flutter/material.dart';
import 'package:sizer/sizer.dart';

import '../../core/app_export.dart';
import '../../theme/app_theme.dart';
import './widgets/header_widget.dart';
import './widgets/language_selector_widget.dart';
import './widgets/role_card_widget.dart';

class UserRoleSelection extends StatefulWidget {
  const UserRoleSelection({Key? key}) : super(key: key);

  @override
  State<UserRoleSelection> createState() => _UserRoleSelectionState();
}

class _UserRoleSelectionState extends State<UserRoleSelection>
    with TickerProviderStateMixin {
  String _selectedLanguage = 'en';
  late AnimationController _slideController;
  late Animation<Offset> _slideAnimation;

  final List<Map<String, dynamic>> _roleData = [
    {
      'title': 'Customer',
      'description': 'Shop groceries conveniently',
      'iconName': 'shopping_cart',
      'benefits': [
        'Browse local stores',
        'Fast delivery service',
        'Secure payments',
        'Track your orders'
      ],
      'setupTime': '2 min setup',
      'accentColor': AppTheme.primaryLight,
      'route': '/customer-home-dashboard',
    },
    {
      'title': 'Shopper',
      'description': 'Earn money delivering orders',
      'iconName': 'delivery_dining',
      'benefits': [
        'Flexible working hours',
        'Earn competitive rates',
        'Weekly payouts',
        'GPS navigation support'
      ],
      'setupTime': '5 min setup',
      'accentColor': AppTheme.secondaryLight,
      'route': '/store-browse-and-product-catalog',
    },
    {
      'title': 'Store Owner',
      'description': 'Manage your business digitally',
      'iconName': 'storefront',
      'benefits': [
        'Digital inventory management',
        'Reach more customers',
        'Analytics dashboard',
        'Automated order processing'
      ],
      'setupTime': '10 min setup',
      'accentColor': AppTheme.successLight,
      'route': '/shopping-cart-and-checkout',
    },
  ];

  @override
  void initState() {
    super.initState();
    _slideController = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );
    _slideAnimation = Tween<Offset>(
      begin: const Offset(0, 1),
      end: Offset.zero,
    ).animate(CurvedAnimation(
      parent: _slideController,
      curve: Curves.easeOutCubic,
    ));
    _slideController.forward();
  }

  @override
  void dispose() {
    _slideController.dispose();
    super.dispose();
  }

  void _handleRoleSelection(String route) {
    Navigator.pushNamed(context, route);
  }

  void _handleLanguageChange(String languageCode) {
    setState(() {
      _selectedLanguage = languageCode;
    });
  }

  void _navigateToLogin() {
    Navigator.pushNamed(context, '/login-screen');
  }

  String _getLocalizedRoleTitle(String role, String languageCode) {
    final Map<String, Map<String, String>> translations = {
      'Customer': {
        'tw': 'Adetɔni',
        'ga': 'Manɔmɔ',
        'ee': 'Nuƒlela',
        'en': 'Customer',
      },
      'Shopper': {
        'tw': 'Adetɔnni',
        'ga': 'Manɔmɔ Tɔɔ',
        'ee': 'Nuƒlela Tɔɔ',
        'en': 'Shopper',
      },
      'Store Owner': {
        'tw': 'Sotɔɔ Wura',
        'ga': 'Duka Wɔnɔ',
        'ee': 'Fiasã Tɔ',
        'en': 'Store Owner',
      },
    };
    return translations[role]?[languageCode] ?? role;
  }

  String _getLocalizedRoleDescription(String role, String languageCode) {
    final Map<String, Map<String, String>> translations = {
      'Customer': {
        'tw': 'Aduane tɔ ntɛmntɛm',
        'ga': 'Numo tɔ kɛ ntɛmntɛm',
        'ee': 'Ƒle nuɖuɖu kaba',
        'en': 'Shop groceries conveniently',
      },
      'Shopper': {
        'tw': 'Sika nya fi nneɛma de kɔ',
        'ga': 'Sika nya fi nɛɛma de kɔ',
        'ee': 'Ga xɔ tso nu tsɔtsɔ me',
        'en': 'Earn money delivering orders',
      },
      'Store Owner': {
        'tw': 'Wo adwuma hwɛ wɔ dijital so',
        'ga': 'Wo adwuma hwɛ dijital kɛ',
        'ee': 'Kpɔ wò dɔwɔwɔ ɖe dijital nu',
        'en': 'Manage your business digitally',
      },
    };
    return translations[role]?[languageCode] ?? 'Shop groceries conveniently';
  }

  String _getLocalizedLoginText(String languageCode) {
    switch (languageCode) {
      case 'tw':
        return 'Wowɔ account dada? Kɔ mu';
      case 'ga':
        return 'Wɔ account lɛ? Kɔ mu';
      case 'ee':
        return 'Akɔnta le asiwòa? Ge ɖe eme';
      default:
        return 'Already have account? Login';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.backgroundLight,
      body: SafeArea(
        child: SlideTransition(
          position: _slideAnimation,
          child: Column(
            children: [
              HeaderWidget(selectedLanguage: _selectedLanguage),
              SizedBox(height: 2.h),
              Expanded(
                child: SingleChildScrollView(
                  physics: const BouncingScrollPhysics(),
                  child: Column(
                    children: [
                      ..._roleData.map((role) {
                        return RoleCardWidget(
                          title: _getLocalizedRoleTitle(
                            role['title'] as String,
                            _selectedLanguage,
                          ),
                          description: _getLocalizedRoleDescription(
                            role['title'] as String,
                            _selectedLanguage,
                          ),
                          iconName: role['iconName'] as String,
                          benefits: (role['benefits'] as List<String>),
                          setupTime: role['setupTime'] as String,
                          accentColor: role['accentColor'] as Color,
                          onTap: () =>
                              _handleRoleSelection(role['route'] as String),
                        );
                      }).toList(),
                      SizedBox(height: 3.h),
                    ],
                  ),
                ),
              ),
              Container(
                padding: EdgeInsets.all(4.w),
                child: Column(
                  children: [
                    LanguageSelectorWidget(
                      selectedLanguage: _selectedLanguage,
                      onLanguageChanged: _handleLanguageChange,
                    ),
                    SizedBox(height: 2.h),
                    GestureDetector(
                      onTap: _navigateToLogin,
                      child: Container(
                        padding: EdgeInsets.symmetric(vertical: 1.5.h),
                        child: Text(
                          _getLocalizedLoginText(_selectedLanguage),
                          style: AppTheme.lightTheme.textTheme.bodyMedium
                              ?.copyWith(
                            color: AppTheme.primaryLight,
                            fontWeight: FontWeight.w600,
                            decoration: TextDecoration.underline,
                            decorationColor: AppTheme.primaryLight,
                          ),
                          textAlign: TextAlign.center,
                        ),
                      ),
                    ),
                    SizedBox(height: 1.h),
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
