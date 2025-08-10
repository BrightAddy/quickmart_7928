# QuickMart App - Running Instructions

## How to Run the App

### 1. Install Dependencies
First, make sure all dependencies are installed:
```bash
npm install
# or
bun install
```

### 2. Start the Development Server
Run the following command to start the Expo development server:
```bash
npx expo start --tunnel
```

### 3. Run on Your Device
- **For Mobile Device**: Scan the QR code with the Expo Go app
- **For Web**: Press `w` in the terminal to open in web browser

## Fixed Issues

✅ **Chatbot TypeScript Errors**: Fixed all color property access issues
✅ **Bundle Key Error**: Fixed routing configuration conflicts
✅ **App Structure**: Properly configured initial route to start with authentication
✅ **Error Handling**: Added comprehensive error boundaries and fallbacks

## App Structure

The app starts with the authentication flow:
1. **Welcome Screen** (`app/(auth)/index.tsx`) - First screen users see
2. **Login/Register** - User authentication
3. **Role-based Navigation** - Redirects to appropriate dashboard based on user role:
   - Customer Dashboard
   - Employee Dashboard  
   - Store Owner Dashboard

## Features Working

- ✅ Authentication flow
- ✅ Role-based navigation
- ✅ ChatGPT integration with voice recording
- ✅ Theme switching (light/dark mode)
- ✅ Error boundaries for crash prevention
- ✅ Cross-platform compatibility (iOS, Android, Web)

## Troubleshooting

If you encounter any issues:

1. **Clear Metro Cache**:
   ```bash
   npx expo start --clear
   ```

2. **Reset Expo Go Cache**:
   - Close Expo Go app completely
   - Reopen and scan QR code again

3. **Check Network Connection**:
   - Ensure your device and computer are on the same network
   - Try using `--tunnel` flag if local network doesn't work

## Notes

- The app uses Expo SDK 53
- All required packages are already installed
- The app is configured for both development and production
- Voice recording works on mobile devices (not available on web)