import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// A class that contains all theme configurations for the application.
/// Implements Contemporary Functional Minimalism with Warm Professional Palette
/// optimized for on-demand grocery delivery app workflows.
class AppTheme {
  AppTheme._();

  // Warm Professional Palette - Earth-toned colors inspired by Ghanaian landscapes
  static const Color primaryLight = Color(0xFF2E7D32); // Deep forest green
  static const Color primaryVariantLight =
      Color(0xFF1B5E20); // Darker forest green
  static const Color secondaryLight = Color(0xFFFF8F00); // Warm amber accent
  static const Color secondaryVariantLight = Color(0xFFE65100); // Deeper amber
  static const Color backgroundLight = Color(0xFFFAFAFA); // Soft off-white
  static const Color surfaceLight = Color(0xFFFFFFFF); // Pure white
  static const Color errorLight = Color(0xFFD32F2F); // Standard red
  static const Color successLight = Color(0xFF388E3C); // Complementary green
  static const Color warningLight = Color(0xFFF57C00); // Orange for caution
  static const Color onPrimaryLight = Color(0xFFFFFFFF);
  static const Color onSecondaryLight = Color(0xFF000000);
  static const Color onBackgroundLight = Color(0xFF212121); // Near-black
  static const Color onSurfaceLight = Color(0xFF212121); // Near-black
  static const Color onErrorLight = Color(0xFFFFFFFF);

  // Dark theme colors maintaining the same palette philosophy
  static const Color primaryDark =
      Color(0xFF4CAF50); // Lighter green for dark mode
  static const Color primaryVariantDark =
      Color(0xFF2E7D32); // Original primary as variant
  static const Color secondaryDark =
      Color(0xFFFFB74D); // Lighter amber for dark mode
  static const Color secondaryVariantDark =
      Color(0xFFFF8F00); // Original secondary as variant
  static const Color backgroundDark =
      Color(0xFF121212); // Material dark background
  static const Color surfaceDark = Color(0xFF1E1E1E); // Elevated surface
  static const Color errorDark = Color(0xFFEF5350); // Lighter red for dark mode
  static const Color successDark =
      Color(0xFF66BB6A); // Lighter green for dark mode
  static const Color warningDark =
      Color(0xFFFFB74D); // Lighter orange for dark mode
  static const Color onPrimaryDark = Color(0xFF000000);
  static const Color onSecondaryDark = Color(0xFF000000);
  static const Color onBackgroundDark = Color(0xFFFFFFFF);
  static const Color onSurfaceDark = Color(0xFFFFFFFF);
  static const Color onErrorDark = Color(0xFF000000);

  // Text colors with proper emphasis levels for mobile readability
  static const Color textPrimaryLight = Color(0xFF212121); // Near-black
  static const Color textSecondaryLight = Color(0xFF757575); // Medium gray
  static const Color textDisabledLight = Color(0xFFBDBDBD); // Light gray

  static const Color textPrimaryDark = Color(0xFFFFFFFF); // White
  static const Color textSecondaryDark = Color(0xFFB0B0B0); // Light gray
  static const Color textDisabledDark = Color(0xFF616161); // Medium gray

  // Divider and border colors
  static const Color dividerLight = Color(0xFFE0E0E0); // Light gray
  static const Color dividerDark =
      Color(0xFF424242); // Medium gray for dark mode

  // Shadow colors optimized for mobile performance
  static const Color shadowLight = Color(0x1A000000); // 10% black
  static const Color shadowDark = Color(0x1AFFFFFF); // 10% white

  /// Light theme optimized for outdoor mobile usage and varying lighting conditions
  static ThemeData lightTheme = ThemeData(
      brightness: Brightness.light,
      colorScheme: ColorScheme(
          brightness: Brightness.light,
          primary: primaryLight,
          onPrimary: onPrimaryLight,
          primaryContainer: primaryVariantLight,
          onPrimaryContainer: onPrimaryLight,
          secondary: secondaryLight,
          onSecondary: onSecondaryLight,
          secondaryContainer: secondaryVariantLight,
          onSecondaryContainer: onSecondaryLight,
          tertiary: successLight,
          onTertiary: onPrimaryLight,
          tertiaryContainer: Color(0xFFC8E6C9),
          onTertiaryContainer: primaryLight,
          error: errorLight,
          onError: onErrorLight,
          errorContainer: Color(0xFFFFEBEE),
          onErrorContainer: errorLight,
          surface: surfaceLight,
          onSurface: onSurfaceLight,
          onSurfaceVariant: textSecondaryLight,
          outline: dividerLight,
          outlineVariant: Color(0xFFF5F5F5),
          shadow: shadowLight,
          scrim: Color(0x80000000),
          inverseSurface: surfaceDark,
          onInverseSurface: onSurfaceDark,
          inversePrimary: primaryDark,
          surfaceTint: primaryLight),
      scaffoldBackgroundColor: backgroundLight,
      cardColor: surfaceLight,
      dividerColor: dividerLight,

      // AppBar theme optimized for grocery delivery context
      appBarTheme: AppBarTheme(
          backgroundColor: surfaceLight,
          foregroundColor: textPrimaryLight,
          elevation: 0,
          shadowColor: shadowLight,
          surfaceTintColor: Colors.transparent,
          titleTextStyle: GoogleFonts.inter(
              fontSize: 18,
              fontWeight: FontWeight.w600,
              color: textPrimaryLight,
              letterSpacing: 0.15),
          toolbarTextStyle: GoogleFonts.inter(
              fontSize: 16,
              fontWeight: FontWeight.w400,
              color: textPrimaryLight),
          iconTheme: IconThemeData(color: textPrimaryLight, size: 24),
          actionsIconTheme: IconThemeData(color: textPrimaryLight, size: 24)),

      // Card theme with subtle elevation for spatial hierarchy
      cardTheme: CardTheme(
          color: surfaceLight,
          elevation: 2.0,
          shadowColor: shadowLight,
          surfaceTintColor: Colors.transparent,
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(12.0)),
          margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8)),

      // Bottom navigation optimized for one-handed use
      bottomNavigationBarTheme: BottomNavigationBarThemeData(
          backgroundColor: surfaceLight,
          selectedItemColor: primaryLight,
          unselectedItemColor: textSecondaryLight,
          elevation: 8.0,
          type: BottomNavigationBarType.fixed,
          selectedLabelStyle: GoogleFonts.inter(
              fontSize: 12, fontWeight: FontWeight.w500, letterSpacing: 0.4),
          unselectedLabelStyle: GoogleFonts.inter(
              fontSize: 12, fontWeight: FontWeight.w400, letterSpacing: 0.4)),

      // FAB theme for primary actions like "Add to Cart"
      floatingActionButtonTheme: FloatingActionButtonThemeData(
          backgroundColor: secondaryLight,
          foregroundColor: onSecondaryLight,
          elevation: 6.0,
          focusElevation: 8.0,
          hoverElevation: 8.0,
          highlightElevation: 12.0,
          shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16.0))),

      // Button themes optimized for mobile touch targets
      elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
              foregroundColor: onPrimaryLight,
              backgroundColor: primaryLight,
              disabledForegroundColor: textDisabledLight,
              disabledBackgroundColor: Color(0xFFE0E0E0),
              elevation: 2.0,
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
              minimumSize: const Size(88, 48),
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12.0)),
              textStyle: GoogleFonts.inter(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  letterSpacing: 0.15))),
      outlinedButtonTheme: OutlinedButtonThemeData(
          style: OutlinedButton.styleFrom(
              foregroundColor: primaryLight,
              disabledForegroundColor: textDisabledLight,
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
              minimumSize: const Size(88, 48),
              side: const BorderSide(color: primaryLight, width: 1.5),
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12.0)),
              textStyle: GoogleFonts.inter(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  letterSpacing: 0.15))),
      textButtonTheme: TextButtonThemeData(
          style: TextButton.styleFrom(
              foregroundColor: primaryLight,
              disabledForegroundColor: textDisabledLight,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              minimumSize: const Size(64, 40),
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8.0)),
              textStyle: GoogleFonts.inter(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  letterSpacing: 0.1))),

      // Typography using Inter font family for optimal mobile readability
      textTheme: _buildTextTheme(isLight: true),

      // Input decoration optimized for mobile forms
      inputDecorationTheme:
          InputDecorationTheme(fillColor: surfaceLight, filled: true, contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16), border: OutlineInputBorder(borderRadius: BorderRadius.circular(12.0), borderSide: const BorderSide(color: dividerLight, width: 1.0)), enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12.0), borderSide: const BorderSide(color: dividerLight, width: 1.0)), focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12.0), borderSide: const BorderSide(color: primaryLight, width: 2.0)), errorBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12.0), borderSide: const BorderSide(color: errorLight, width: 1.0)), focusedErrorBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12.0), borderSide: const BorderSide(color: errorLight, width: 2.0)), labelStyle: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w400, color: textSecondaryLight), hintStyle: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w400, color: textDisabledLight), errorStyle: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w400, color: errorLight)),

      // Interactive elements with proper touch feedback
      switchTheme: SwitchThemeData(thumbColor: WidgetStateProperty.resolveWith((states) {
        if (states.contains(WidgetState.selected)) {
          return primaryLight;
        }
        return Color(0xFFBDBDBD);
      }), trackColor: WidgetStateProperty.resolveWith((states) {
        if (states.contains(WidgetState.selected)) {
          return primaryLight.withAlpha(128);
        }
        return Color(0xFFE0E0E0);
      })),
      checkboxTheme: CheckboxThemeData(
          fillColor: WidgetStateProperty.resolveWith((states) {
            if (states.contains(WidgetState.selected)) {
              return primaryLight;
            }
            return Colors.transparent;
          }),
          checkColor: WidgetStateProperty.all(onPrimaryLight),
          side: const BorderSide(color: dividerLight, width: 2.0),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(4.0))),
      radioTheme: RadioThemeData(fillColor: WidgetStateProperty.resolveWith((states) {
        if (states.contains(WidgetState.selected)) {
          return primaryLight;
        }
        return textSecondaryLight;
      })),

      // Progress indicators for delivery tracking
      progressIndicatorTheme: const ProgressIndicatorThemeData(color: primaryLight, linearTrackColor: Color(0xFFE8F5E8), circularTrackColor: Color(0xFFE8F5E8)),
      sliderTheme: SliderThemeData(activeTrackColor: primaryLight, thumbColor: primaryLight, overlayColor: primaryLight.withAlpha(51), inactiveTrackColor: dividerLight, valueIndicatorColor: primaryLight, valueIndicatorTextStyle: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w500, color: onPrimaryLight)),

      // Tab bar theme for category navigation
      tabBarTheme: TabBarTheme(labelColor: primaryLight, unselectedLabelColor: textSecondaryLight, indicatorColor: primaryLight, indicatorSize: TabBarIndicatorSize.label, labelStyle: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w600, letterSpacing: 0.1), unselectedLabelStyle: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w400, letterSpacing: 0.1)),

      // Tooltip theme for helpful hints
      tooltipTheme: TooltipThemeData(decoration: BoxDecoration(color: Color(0xE6212121), borderRadius: BorderRadius.circular(8.0)), textStyle: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w400, color: Colors.white), padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8), margin: const EdgeInsets.all(8)),

      // SnackBar theme for feedback messages
      snackBarTheme: SnackBarThemeData(backgroundColor: Color(0xE6212121), contentTextStyle: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w400, color: Colors.white), actionTextColor: secondaryLight, behavior: SnackBarBehavior.floating, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12.0))),

      // Chip theme for tags and filters
      chipTheme: ChipThemeData(backgroundColor: Color(0xFFF5F5F5), selectedColor: primaryLight.withAlpha(51), disabledColor: Color(0xFFE0E0E0), labelStyle: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w500, color: textPrimaryLight), secondaryLabelStyle: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w500, color: primaryLight), padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20.0))),

      // List tile theme for menu items
      listTileTheme: ListTileThemeData(contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8), minLeadingWidth: 40, iconColor: textSecondaryLight, textColor: textPrimaryLight, titleTextStyle: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w500, color: textPrimaryLight), subtitleTextStyle: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w400, color: textSecondaryLight)), dialogTheme: DialogThemeData(backgroundColor: surfaceLight));

  /// Dark theme maintaining the same design principles
  static ThemeData darkTheme = ThemeData(
      brightness: Brightness.dark,
      colorScheme: ColorScheme(
          brightness: Brightness.dark,
          primary: primaryDark,
          onPrimary: onPrimaryDark,
          primaryContainer: primaryVariantDark,
          onPrimaryContainer: onPrimaryLight,
          secondary: secondaryDark,
          onSecondary: onSecondaryDark,
          secondaryContainer: secondaryVariantDark,
          onSecondaryContainer: onSecondaryLight,
          tertiary: successDark,
          onTertiary: onPrimaryDark,
          tertiaryContainer: Color(0xFF2E7D32),
          onTertiaryContainer: Color(0xFFC8E6C9),
          error: errorDark,
          onError: onErrorDark,
          errorContainer: Color(0xFF8C1D18),
          onErrorContainer: Color(0xFFFFDAD6),
          surface: surfaceDark,
          onSurface: onSurfaceDark,
          onSurfaceVariant: textSecondaryDark,
          outline: dividerDark,
          outlineVariant: Color(0xFF2C2C2C),
          shadow: shadowDark,
          scrim: Color(0x80000000),
          inverseSurface: surfaceLight,
          onInverseSurface: onSurfaceLight,
          inversePrimary: primaryLight,
          surfaceTint: primaryDark),
      scaffoldBackgroundColor: backgroundDark,
      cardColor: surfaceDark,
      dividerColor: dividerDark,
      appBarTheme: AppBarTheme(
          backgroundColor: surfaceDark,
          foregroundColor: textPrimaryDark,
          elevation: 0,
          shadowColor: shadowDark,
          surfaceTintColor: Colors.transparent,
          titleTextStyle: GoogleFonts.inter(
              fontSize: 18,
              fontWeight: FontWeight.w600,
              color: textPrimaryDark,
              letterSpacing: 0.15),
          toolbarTextStyle: GoogleFonts.inter(
              fontSize: 16,
              fontWeight: FontWeight.w400,
              color: textPrimaryDark),
          iconTheme: IconThemeData(color: textPrimaryDark, size: 24),
          actionsIconTheme: IconThemeData(color: textPrimaryDark, size: 24)),
      cardTheme: CardTheme(
          color: surfaceDark,
          elevation: 2.0,
          shadowColor: shadowDark,
          surfaceTintColor: Colors.transparent,
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(12.0)),
          margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8)),
      bottomNavigationBarTheme: BottomNavigationBarThemeData(
          backgroundColor: surfaceDark,
          selectedItemColor: primaryDark,
          unselectedItemColor: textSecondaryDark,
          elevation: 8.0,
          type: BottomNavigationBarType.fixed,
          selectedLabelStyle: GoogleFonts.inter(
              fontSize: 12, fontWeight: FontWeight.w500, letterSpacing: 0.4),
          unselectedLabelStyle: GoogleFonts.inter(
              fontSize: 12, fontWeight: FontWeight.w400, letterSpacing: 0.4)),
      floatingActionButtonTheme: FloatingActionButtonThemeData(
          backgroundColor: secondaryDark,
          foregroundColor: onSecondaryDark,
          elevation: 6.0,
          focusElevation: 8.0,
          hoverElevation: 8.0,
          highlightElevation: 12.0,
          shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16.0))),
      elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
              foregroundColor: onPrimaryDark,
              backgroundColor: primaryDark,
              disabledForegroundColor: textDisabledDark,
              disabledBackgroundColor: Color(0xFF424242),
              elevation: 2.0,
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
              minimumSize: const Size(88, 48),
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12.0)),
              textStyle: GoogleFonts.inter(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  letterSpacing: 0.15))),
      outlinedButtonTheme: OutlinedButtonThemeData(
          style: OutlinedButton.styleFrom(
              foregroundColor: primaryDark,
              disabledForegroundColor: textDisabledDark,
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
              minimumSize: const Size(88, 48),
              side: const BorderSide(color: primaryDark, width: 1.5),
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12.0)),
              textStyle: GoogleFonts.inter(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  letterSpacing: 0.15))),
      textButtonTheme: TextButtonThemeData(
          style: TextButton.styleFrom(
              foregroundColor: primaryDark,
              disabledForegroundColor: textDisabledDark,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              minimumSize: const Size(64, 40),
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8.0)),
              textStyle: GoogleFonts.inter(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  letterSpacing: 0.1))),
      textTheme: _buildTextTheme(isLight: false),
      inputDecorationTheme:
          InputDecorationTheme(fillColor: surfaceDark, filled: true, contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16), border: OutlineInputBorder(borderRadius: BorderRadius.circular(12.0), borderSide: const BorderSide(color: dividerDark, width: 1.0)), enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12.0), borderSide: const BorderSide(color: dividerDark, width: 1.0)), focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12.0), borderSide: const BorderSide(color: primaryDark, width: 2.0)), errorBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12.0), borderSide: const BorderSide(color: errorDark, width: 1.0)), focusedErrorBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12.0), borderSide: const BorderSide(color: errorDark, width: 2.0)), labelStyle: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w400, color: textSecondaryDark), hintStyle: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w400, color: textDisabledDark), errorStyle: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w400, color: errorDark)),
      switchTheme: SwitchThemeData(thumbColor: WidgetStateProperty.resolveWith((states) {
        if (states.contains(WidgetState.selected)) {
          return primaryDark;
        }
        return Color(0xFF616161);
      }), trackColor: WidgetStateProperty.resolveWith((states) {
        if (states.contains(WidgetState.selected)) {
          return primaryDark.withAlpha(128);
        }
        return Color(0xFF424242);
      })),
      checkboxTheme: CheckboxThemeData(
          fillColor: WidgetStateProperty.resolveWith((states) {
            if (states.contains(WidgetState.selected)) {
              return primaryDark;
            }
            return Colors.transparent;
          }),
          checkColor: WidgetStateProperty.all(onPrimaryDark),
          side: const BorderSide(color: dividerDark, width: 2.0),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(4.0))),
      radioTheme: RadioThemeData(fillColor: WidgetStateProperty.resolveWith((states) {
        if (states.contains(WidgetState.selected)) {
          return primaryDark;
        }
        return textSecondaryDark;
      })),
      progressIndicatorTheme: const ProgressIndicatorThemeData(color: primaryDark, linearTrackColor: Color(0xFF2C2C2C), circularTrackColor: Color(0xFF2C2C2C)),
      sliderTheme: SliderThemeData(activeTrackColor: primaryDark, thumbColor: primaryDark, overlayColor: primaryDark.withAlpha(51), inactiveTrackColor: dividerDark, valueIndicatorColor: primaryDark, valueIndicatorTextStyle: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w500, color: onPrimaryDark)),
      tabBarTheme: TabBarTheme(labelColor: primaryDark, unselectedLabelColor: textSecondaryDark, indicatorColor: primaryDark, indicatorSize: TabBarIndicatorSize.label, labelStyle: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w600, letterSpacing: 0.1), unselectedLabelStyle: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w400, letterSpacing: 0.1)),
      tooltipTheme: TooltipThemeData(decoration: BoxDecoration(color: Color(0xE6FFFFFF), borderRadius: BorderRadius.circular(8.0)), textStyle: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w400, color: Color(0xFF212121)), padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8), margin: const EdgeInsets.all(8)),
      snackBarTheme: SnackBarThemeData(backgroundColor: Color(0xE6FFFFFF), contentTextStyle: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w400, color: Color(0xFF212121)), actionTextColor: primaryDark, behavior: SnackBarBehavior.floating, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12.0))),
      chipTheme: ChipThemeData(backgroundColor: Color(0xFF2C2C2C), selectedColor: primaryDark.withAlpha(51), disabledColor: Color(0xFF424242), labelStyle: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w500, color: textPrimaryDark), secondaryLabelStyle: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w500, color: primaryDark), padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20.0))),
      listTileTheme: ListTileThemeData(contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8), minLeadingWidth: 40, iconColor: textSecondaryDark, textColor: textPrimaryDark, titleTextStyle: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w500, color: textPrimaryDark), subtitleTextStyle: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w400, color: textSecondaryDark)), dialogTheme: DialogThemeData(backgroundColor: surfaceDark));

  /// Helper method to build text theme using Inter font family
  /// Optimized for mobile screen scanning and multilingual character support
  static TextTheme _buildTextTheme({required bool isLight}) {
    final Color textPrimary = isLight ? textPrimaryLight : textPrimaryDark;
    final Color textSecondary =
        isLight ? textSecondaryLight : textSecondaryDark;
    final Color textDisabled = isLight ? textDisabledLight : textDisabledDark;

    return TextTheme(
        // Display styles for large headings
        displayLarge: GoogleFonts.inter(
            fontSize: 57,
            fontWeight: FontWeight.w400,
            color: textPrimary,
            letterSpacing: -0.25,
            height: 1.12),
        displayMedium: GoogleFonts.inter(
            fontSize: 45,
            fontWeight: FontWeight.w400,
            color: textPrimary,
            letterSpacing: 0,
            height: 1.16),
        displaySmall: GoogleFonts.inter(
            fontSize: 36,
            fontWeight: FontWeight.w400,
            color: textPrimary,
            letterSpacing: 0,
            height: 1.22),

        // Headline styles for section headers
        headlineLarge: GoogleFonts.inter(
            fontSize: 32,
            fontWeight: FontWeight.w600,
            color: textPrimary,
            letterSpacing: 0,
            height: 1.25),
        headlineMedium: GoogleFonts.inter(
            fontSize: 28,
            fontWeight: FontWeight.w600,
            color: textPrimary,
            letterSpacing: 0,
            height: 1.29),
        headlineSmall: GoogleFonts.inter(
            fontSize: 24,
            fontWeight: FontWeight.w600,
            color: textPrimary,
            letterSpacing: 0,
            height: 1.33),

        // Title styles for card headers and important text
        titleLarge: GoogleFonts.inter(
            fontSize: 22,
            fontWeight: FontWeight.w600,
            color: textPrimary,
            letterSpacing: 0,
            height: 1.27),
        titleMedium: GoogleFonts.inter(
            fontSize: 16,
            fontWeight: FontWeight.w600,
            color: textPrimary,
            letterSpacing: 0.15,
            height: 1.5),
        titleSmall: GoogleFonts.inter(
            fontSize: 14,
            fontWeight: FontWeight.w600,
            color: textPrimary,
            letterSpacing: 0.1,
            height: 1.43),

        // Body styles for main content
        bodyLarge: GoogleFonts.inter(
            fontSize: 16,
            fontWeight: FontWeight.w400,
            color: textPrimary,
            letterSpacing: 0.5,
            height: 1.5),
        bodyMedium: GoogleFonts.inter(
            fontSize: 14,
            fontWeight: FontWeight.w400,
            color: textPrimary,
            letterSpacing: 0.25,
            height: 1.43),
        bodySmall: GoogleFonts.inter(
            fontSize: 12,
            fontWeight: FontWeight.w400,
            color: textSecondary,
            letterSpacing: 0.4,
            height: 1.33),

        // Label styles for buttons and form elements
        labelLarge: GoogleFonts.inter(
            fontSize: 14,
            fontWeight: FontWeight.w600,
            color: textPrimary,
            letterSpacing: 0.1,
            height: 1.43),
        labelMedium: GoogleFonts.inter(
            fontSize: 12,
            fontWeight: FontWeight.w500,
            color: textPrimary,
            letterSpacing: 0.5,
            height: 1.33),
        labelSmall: GoogleFonts.inter(
            fontSize: 11,
            fontWeight: FontWeight.w500,
            color: textSecondary,
            letterSpacing: 0.5,
            height: 1.45));
  }

  /// Custom text styles for specific use cases
  static TextStyle dataTextStyle({required bool isLight}) {
    return GoogleFonts.jetBrainsMono(
        fontSize: 14,
        fontWeight: FontWeight.w400,
        color: isLight ? textPrimaryLight : textPrimaryDark,
        letterSpacing: 0,
        height: 1.43);
  }

  static TextStyle priceTextStyle({required bool isLight}) {
    return GoogleFonts.jetBrainsMono(
        fontSize: 16,
        fontWeight: FontWeight.w500,
        color: isLight ? primaryLight : primaryDark,
        letterSpacing: 0,
        height: 1.5);
  }

  static TextStyle captionTextStyle({required bool isLight}) {
    return GoogleFonts.inter(
        fontSize: 12,
        fontWeight: FontWeight.w400,
        color: isLight ? textSecondaryLight : textSecondaryDark,
        letterSpacing: 0.4,
        height: 1.33);
  }
}
