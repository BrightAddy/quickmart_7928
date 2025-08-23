# 🤖 QuickMart Shopping Chatbot

## Overview
The QuickMart Shopping Chatbot is an intelligent shopping assistant that helps users shop for groceries, supports multiple local languages, and provides personalized deals. It can add products to cart, switch languages, and offer shopping recommendations.

## Features

### 🛒 Shopping Assistance
- **Product Search**: Ask the chatbot to find specific products
- **Add to Cart**: Bot can add products directly to your shopping cart
- **Store Integration**: Works with Melcom and other local stores
- **Product Suggestions**: Shows relevant products with images and prices

### 🌍 Multi-Language Support
- **English** 🇺🇸 - Default language
- **Twi** 🇬🇭 - Ghanaian language
- **Ewe** 🇬🇭 - Ghanaian language  
- **Ga** 🇬🇭 - Ghanaian language
- **Hausa** 🇳🇬 - Nigerian language

### 💡 Smart Features
- **Personalized Deals**: Shows best offers based on shopping history
- **Cart Management**: Real-time cart updates and totals
- **Product Recommendations**: Suggests related items
- **Language Switching**: Seamless language changes during conversation

## How to Use

### 1. Opening the Chatbot
- Tap the floating chatbot button (💬) on the CustomerHome screen (`src/screens/customer/CustomerHome.tsx`)
- The chatbot slides up from the bottom with a smooth animation

### 2. Basic Commands
```
"Shop for vegetables" - Bot will show vegetable products
"Add tomatoes to cart" - Bot adds tomatoes to your cart
"Show me deals" - Bot displays personalized offers
"Switch to Twi" - Changes language to Twi
```

### 3. Language Switching
- Tap the language button in the chatbot header
- Select from available languages (🇺🇸🇬🇭🇳🇬)
- All messages and responses update automatically

### 4. Shopping with the Bot
- Tell the bot what you want: "I need fresh milk and bread"
- Bot will search and show relevant products
- Tap the + button on any product to add to cart
- View your cart summary at the bottom of the chat

### 5. Cart Management
- See all items added by the bot
- View quantities and total prices
- Proceed to checkout when ready

## Technical Implementation

### Components
- **ChatbotContext**: Manages chat state, language, and cart (`src/context/ChatbotContext.tsx`)
- **Chatbot Component**: Main chat interface with animations (`src/components/Chatbot.tsx`)
- **Integration**: Seamlessly integrated into CustomerHome screen (`src/screens/customer/CustomerHome.tsx`)

### State Management
- Chat messages with different types (text, product_suggestion, cart_update)
- Language switching with real-time translations
- Cart management with add/remove/update functionality
- Product suggestions with images and pricing

### Animations
- Smooth slide-up animation when opening
- Spring animations for natural feel
- Auto-scroll to latest messages

## Sample Conversations

### English
```
User: "Can you help me shop for groceries?"
Bot: "I'll help you shop for groceries. What would you like me to add to your cart?"

User: "I need fresh vegetables"
Bot: "I found these products for you:" [shows vegetable products]

User: "Add carrots to cart"
Bot: "Added to cart: Fresh Organic Carrots"
```

### Twi
```
User: "Me pɛ wo ma wo shop groceries ma me"
Bot: "Me bɛkyerɛ wo shop groceries. Deɛn na wo pɛ me ma me fa ka wo cart mu?"

User: "Me pɛ vegetables"
Bot: "Me hu products yi ma wo:" [shows vegetable products]
```

## Future Enhancements
- Voice input/output support
- Payment integration
- Order tracking
- More store integrations
- AI-powered product recommendations
- Shopping list management

## Getting Started
1. The chatbot is automatically available on the CustomerHome screen (`src/screens/customer/CustomerHome.tsx`)
2. Tap the floating chat button to start
3. Try different languages and shopping commands
4. Explore product suggestions and add items to cart

The chatbot makes grocery shopping easier, more accessible, and culturally relevant for users across different language preferences! 🛒✨
