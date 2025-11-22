# GoMate Travel App - Advanced Assignment Project 🧳

## 🚀 Overview

GoMate is a comprehensive travel planning mobile application built with React Native, TypeScript, and Redux Toolkit. This project goes far beyond the basic assignment requirements, implementing advanced features that showcase modern mobile development practices.

**Assignment**: IN3210 Mobile Applications Development - Assignment 2  
**Index Number**: 224008K  
**App Theme**: Travel & Transport (based on last digit 8)

## 📱 Demo & Testing

- **QR Code**: Use the QR code in terminal to test on mobile device
- **Web Version**: Access at http://localhost:8081 for web testing
- **Mobile Testing**: Use Expo Go app to scan the QR code

## ✨ Core Features (Assignment Requirements)

### 🔐 Authentication System
- ✅ User Registration with form validation (React Hook Form + Yup)
- ✅ Login/Logout functionality with persistent sessions
- ✅ Form validation with real-time error handling
- ✅ Redux state management for authentication

### 🧭 Navigation & Routing
- ✅ Tab navigation with bottom tabs
- ✅ Stack navigation for detailed screens
- ✅ Deep linking support with Expo Router
- ✅ Protected routes requiring authentication

### 🎨 UI/UX Design
- ✅ Dark/Light theme with complete theme system
- ✅ Mobile-first responsive design
- ✅ Consistent theming across all components
- ✅ Custom reusable components

### 🔄 State Management
- ✅ Redux Toolkit with TypeScript
- ✅ Multiple slices for different app domains
- ✅ Async actions with loading states
- ✅ Persistent state management

### 🌐 API Integration
- ✅ Mock API services for backend simulation
- ✅ Data fetching with loading states
- ✅ CRUD operations for destinations and bookings
- ✅ Optimistic updates for better UX

## 🚀 Advanced Features (Beyond Requirements)

### 🗺️ Trip Planning System
- ✅ Create custom trips with dates and descriptions
- ✅ Add/remove destinations to trips
- ✅ Trip sharing and management capabilities
- ✅ Organized itinerary views

### 🔍 Advanced Search & Filters
- ✅ Powerful search with multiple filters
- ✅ Price range filtering
- ✅ Category and rating-based filtering
- ✅ Saved searches and search history
- ✅ Multiple sort options

### 🌤️ Weather & Currency Tools
- ✅ Real-time weather forecasts (5-day)
- ✅ Location-based weather search
- ✅ Currency converter with live rates
- ✅ Multi-currency support (9+ currencies)
- ✅ Exchange rate trends

### 🔔 Smart Notifications System
- ✅ Push notification center
- ✅ Notification categories and preferences
- ✅ Scheduled notifications for trips
- ✅ Read/unread status management

### 📱 Comprehensive Menu System
- ✅ Organized feature access
- ✅ User profile integration
- ✅ Quick access shortcuts
- ✅ App information and feature overview

## 🛠️ Technical Excellence

### 📝 TypeScript Integration
- ✅ 100% TypeScript coverage
- ✅ Custom type definitions
- ✅ Type-safe Redux implementation
- ✅ Proper interface definitions

### 🏗️ Architecture & Patterns
- ✅ Redux Toolkit with modern patterns
- ✅ Reusable component composition
- ✅ Custom hooks for common logic
- ✅ Service layer for API interactions

### 📋 Form Management
- ✅ React Hook Form for efficiency
- ✅ Yup schema validation
- ✅ Real-time validation feedback

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or later)
- Expo CLI
- Expo Go app (for mobile testing)

### Installation

1. Install dependencies
   ```bash
   npm install
   ```

2. Start the development server
   ```bash
   npx expo start
   ```

3. Open the app:
   - **Mobile**: Scan QR code with Expo Go
   - **Web**: Press 'w' to open in browser
   - **Android**: Press 'a' for Android emulator
   - **iOS**: Press 'i' for iOS simulator

## 📚 Technology Stack

- **React Native** - Cross-platform mobile development
- **TypeScript** - Type-safe JavaScript
- **Expo** - Development platform
- **Redux Toolkit** - Modern state management
- **Expo Router** - File-based routing
- **React Hook Form** - Form handling
- **Yup** - Schema validation
- **React Native Feather** - Icons

## 🗂️ Project Structure

```
GoMateApp/
├── app/                    # Main screens & navigation
│   ├── (auth)/            # Authentication screens
│   ├── (tabs)/            # Tab navigation screens
│   ├── advanced-search.tsx # Advanced search
│   ├── trip-planning.tsx   # Trip planner
│   ├── utilities.tsx       # Weather & currency
│   ├── notifications.tsx   # Notification center
│   └── menu.tsx           # Comprehensive menu
├── components/            # Reusable UI components
├── store/                 # Redux store & slices
├── services/              # API services
├── hooks/                 # Custom React hooks
└── constants/             # App constants & themes
```

## 🎯 Key Achievements

### Assignment Requirements ✅
- Complete authentication system
- Navigation implementation
- State management with Redux
- API integration patterns
- UI component development
- Theme system

### Advanced Features ✅
- Trip planning system
- Advanced search & filtering
- Real-time data integration
- Notification management
- Weather & currency tools
- Comprehensive booking system

### Technical Quality ✅
- TypeScript implementation
- Code organization
- Error handling
- Performance optimization
- Mobile responsiveness

## 📱 How to Test

1. **Start the server**: `npx expo start`
2. **Mobile testing**: Scan QR code with Expo Go
3. **Web testing**: Open http://localhost:8081
4. **Try features**:
   - Register/Login with any email
   - Browse destinations
   - Create trips in Trip Planning
   - Use Advanced Search filters
   - Check Weather & Currency tools
   - Manage Notifications
   - Explore the comprehensive Menu

---

**This app demonstrates advanced mobile development beyond basic requirements, showcasing modern React Native practices with TypeScript and Redux Toolkit.**
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
