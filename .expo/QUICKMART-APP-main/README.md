# QuickMart App

A grocery delivery application built with React Native and Expo.

## Features

- Multi-role application (Customer, Employee, Store Owner)
- Product browsing and ordering
- Cart management
- Order tracking
- Store management
- Employee delivery management

## Getting Started

### Prerequisites

- Node.js (v18 or newer)
- npm or yarn
- Expo CLI

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/quickmart-app.git
```

2. Navigate to the project directory
```bash
cd quickmart-app
```

3. Install dependencies
```bash
npm install
# or
yarn install
```

4. Start the development server
```bash
npm start
# or
yarn start
```

5. Open the app on your device using Expo Go app by scanning the QR code, or run on a simulator/emulator:
```bash
npm run ios
# or
npm run android
```

## Project Structure

- `/app` - Contains all the screens and navigation
  - `/(auth)` - Authentication screens
  - `/(customer)` - Customer-facing screens
  - `/(employee)` - Employee-facing screens
  - `/(store)` - Store owner screens
- `/components` - Reusable UI components
- `/constants` - App constants like colors, layout
- `/mocks` - Mock data for development
- `/store` - State management with Zustand
- `/types` - TypeScript type definitions

## Login Information

For testing purposes, you can use the following credentials:

### Customer
- Email: customer@example.com
- Password: password

### Employee
- Email: employee@example.com
- Password: password

### Store Owner
- Email: store@example.com
- Password: password

## Troubleshooting

If you encounter any issues:

1. Make sure you're in the correct directory (the one containing package.json)
2. Try deleting node_modules and reinstalling dependencies:
```bash
rm -rf node_modules
npm install
```
3. Clear Expo cache:
```bash
expo start -c
```

## License

This project is licensed under the MIT License.