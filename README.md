# QuickMart - Grocery Delivery App

A modern React Native mobile application for grocery delivery services, built with Expo and TypeScript. QuickMart connects customers with local grocery stores and delivery drivers for a seamless shopping experience.

## 🛒 About QuickMart

QuickMart is a comprehensive grocery delivery platform that serves three main user types:

### 👤 **Customers**
- Browse and order groceries from local stores
- Real-time order tracking
- Loyalty points system
- Profile and address management
- Payment methods management

### 🚚 **Shoppers (Delivery Drivers)**
- Accept and deliver orders
- Earnings tracking and performance metrics
- Route optimization
- Schedule management
- Customer communication

### 🏪 **Store Owners**
- Product and inventory management
- Order processing and fulfillment
- Sales analytics and reporting
- Store settings and preferences

## 🚀 Features

- **Multi-role User System**: Separate interfaces for customers, shoppers, and store owners
- **Real-time Order Tracking**: Live updates on order status and delivery progress
- **Loyalty Program**: Points system for customer retention
- **Payment Integration**: Multiple payment methods support
- **Push Notifications**: Real-time updates and alerts
- **Responsive Design**: Optimized for various screen sizes
- **Dark/Light Theme**: Automatic theme switching based on system preferences

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development) or Android Studio (for Android development)
- Expo Go app (for testing on physical devices)

## 🛠️ Installation & Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd quickmart_7928
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm start
```

4. **Run on your preferred platform**
- **📱 Mobile**: Scan the QR code with Expo Go app
- **🤖 Android**: Press `a` in the terminal
- **🍎 iOS**: Press `i` in the terminal (Mac only)
- **🌐 Web**: Press `w` in the terminal

## 📁 Project Structure

```
quickmart_7928/
├── src/
│   ├── components/          # Reusable UI components
│   │   └── UI.tsx          # Main UI component library
│   ├── context/            # React Context providers
│   │   ├── CartContext.tsx # Shopping cart state management
│   │   ├── OrderContext.tsx # Order state management
│   │   └── ProductsContext.tsx # Product data management
│   ├── navigation/         # Navigation configuration
│   │   ├── CustomerTabs.tsx # Customer tab navigation
│   │   ├── ShopperTabs.tsx # Shopper tab navigation
│   │   ├── StoreOwnerTabs.tsx # Store owner tab navigation
│   │   └── types.ts        # Navigation type definitions
│   ├── screens/           # Application screens
│   │   ├── SplashScreen.tsx # App launch screen
│   │   ├── OnboardingScreen.tsx # User onboarding
│   │   ├── CustomerHome.tsx # Customer main screen
│   │   ├── shopper/       # Shopper-specific screens
│   │   ├── storeOwner/    # Store owner screens
│   │   └── ...           # Other screens
│   └── theme/            # Theme configuration
│       └── theme.tsx     # Color schemes and styling
├── assets/               # Static assets (images, fonts)
├── App.tsx              # Main application component
├── app.json             # Expo configuration
├── package.json         # Dependencies and scripts
└── tsconfig.json        # TypeScript configuration
```

## 🎨 Theming

The app uses a comprehensive theming system with automatic light/dark mode switching:

```typescript
import { useTheme } from './src/theme/theme';

function MyComponent() {
  const { colors } = useTheme();
  
  return (
    <View style={{ backgroundColor: colors.background }}>
      <Text style={{ color: colors.onBackground }}>
        Hello QuickMart!
      </Text>
    </View>
  );
}
```

### Color Palette
- **Primary**: `#2DCCD3` (Teal)
- **Secondary**: `#7C9CF1` (Purple)
- **Background**: `#F5F7FA` (Light) / `#0B0F16` (Dark)
- **Surface**: `#FFFFFF` (Light) / `#121826` (Dark)

## 📱 Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android emulator/device
- `npm run ios` - Run on iOS simulator/device
- `npm run web` - Run in web browser

## 🔧 Development

### Adding New Screens

1. Create a new screen component in `src/screens/`
2. Add the screen to the navigation stack in `App.tsx`
3. Update navigation types in `src/navigation/types.ts`

### State Management

The app uses React Context for state management:
- **CartContext**: Manages shopping cart state
- **OrderContext**: Handles order processing and tracking
- **ProductsContext**: Manages product data and filtering

### Navigation

The app uses React Navigation with separate tab navigators for each user role:
- **CustomerTabs**: Home, Orders, Cart, Profile
- **ShopperTabs**: Dashboard, Orders, Earnings, Profile
- **StoreOwnerTabs**: Dashboard, Orders, Products, Settings

## 🚀 Deployment

### Building for Production

1. **Configure app.json** with your app details
2. **Build the app**:
```bash
# For Android
expo build:android

# For iOS
expo build:ios
```

3. **Submit to stores**:
```bash
# Android
expo upload:android

# iOS
expo upload:ios
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [React Native](https://reactnative.dev/) and [Expo](https://expo.dev/)
- Navigation powered by [React Navigation](https://reactnavigation.org/)
- Styled with modern design principles and accessibility in mind

---

**QuickMart** - Fresh groceries delivered to your door 🛒
