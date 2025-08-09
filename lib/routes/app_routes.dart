import 'package:flutter/material.dart';
import '../presentation/splash_screen/splash_screen.dart';
import '../presentation/user_role_selection/user_role_selection.dart';
import '../presentation/customer_home_dashboard/customer_home_dashboard.dart';
import '../presentation/login_screen/login_screen.dart';
import '../presentation/shopping_cart_and_checkout/shopping_cart_and_checkout.dart';
import '../presentation/store_browse_and_product_catalog/store_browse_and_product_catalog.dart';

class AppRoutes {
  // TODO: Add your routes here
  static const String initial = '/';
  static const String splash = '/splash-screen';
  static const String userRoleSelection = '/user-role-selection';
  static const String customerHomeDashboard = '/customer-home-dashboard';
  static const String login = '/login-screen';
  static const String shoppingCartAndCheckout = '/shopping-cart-and-checkout';
  static const String storeBrowseAndProductCatalog =
      '/store-browse-and-product-catalog';

  static Map<String, WidgetBuilder> routes = {
    initial: (context) => const SplashScreen(),
    splash: (context) => const SplashScreen(),
    userRoleSelection: (context) => const UserRoleSelection(),
    customerHomeDashboard: (context) => const CustomerHomeDashboard(),
    login: (context) => const LoginScreen(),
    shoppingCartAndCheckout: (context) => const ShoppingCartAndCheckout(),
    storeBrowseAndProductCatalog: (context) =>
        const StoreBrowseAndProductCatalog(),
    // TODO: Add your other routes here
  };
}
