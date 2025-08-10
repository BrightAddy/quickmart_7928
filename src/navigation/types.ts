export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  UserRoleSelection: undefined;
  Login: undefined;
  CustomerHome: undefined;
  StoreBrowse: { store: any } | undefined;
  CartCheckout: undefined;
  UserPreferences: undefined;
  CustomerTabs: { screen?: string } | undefined;
  HelpCenter: undefined;
  Referral: undefined;
  ShopperHome: undefined;
  ShopperTabs: undefined;
  StoreOwnerHome: undefined;
  OrderTracking: { id: string } | undefined;
  PaymentMethods: undefined;
  Notifications: undefined;
  ProductDetails: { product: any } | undefined;
  Checkout: { subtotal?: number; delivery?: number; discount?: number; total?: number } | undefined;
  EditProfile: { profile: any } | undefined;
  ManageAddresses: { addresses: any[] } | undefined;
  FavoriteStores: undefined;
  ShoppingLists: undefined;
  RecentlyViewed: undefined;
  SecuritySettings: undefined;
  ChangePassword: undefined;
  TwoFactorAuth: undefined;
  LoyaltyPoints: undefined;
};


