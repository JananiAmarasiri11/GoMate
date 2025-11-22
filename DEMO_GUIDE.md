# GoMate App - Quick Demo Guide 🚀

## How to Test the App

### 1. Start the App
The app should already be running. If not:
```bash
npm start
```

### 2. Open the App
- **Mobile Device**: Install Expo Go app and scan the QR code
- **Web Browser**: Press 'w' in terminal or go to http://localhost:8081
- **Android Emulator**: Press 'a' in terminal
- **iOS Simulator**: Press 'i' in terminal

### 3. Demo Flow

#### Authentication
1. **Register**: Create a new account
   - Fill in First Name, Last Name, Username, Email, Password
   - All fields have validation (try entering invalid data to see errors)
   - Password must be 6+ characters, email must be valid format

2. **Login**: Sign in with your credentials
   - Username: minimum 3 characters
   - Password: minimum 6 characters
   - For quick demo: username "demo123", password "password123"

#### Main App Features

#### Home Screen
- Browse travel destinations and transport options
- Use search bar to find specific items
- Filter by categories: All, Destinations, Transport
- Tap any card to view details
- Pull down to refresh the list

#### Explore Screen
- Scroll through categorized sections
- Quick action buttons for various services
- Horizontal scrolling lists of destinations
- Travel tips at the bottom

#### Favorites
- On any destination card, tap the heart icon to add to favorites
- Visit Favorites tab to see saved items
- Remove items by tapping the trash icon
- Empty state when no favorites exist

#### Profile
- View user information
- **Toggle Dark Mode (fully functional!)** - works instantly and persists
- Toggle notification settings
- Access different menu options
- Sign out functionality

#### Details Screen
- Tap any destination card from Home or Explore
- View full details with images
- Add/remove from favorites using heart icon
- Share functionality
- Book Now button (demo alert)
- Back navigation

### 4. Key Features to Test

✅ **Form Validation**: Try submitting empty forms or invalid data  
✅ **Navigation**: Navigate between tabs and screens  
✅ **Search**: Search for destinations like "Tokyo" or "Bus"  
✅ **Favorites**: Add/remove favorites and see persistence  
✅ **Dark Mode**: Toggle in Profile tab - works instantly and persists!  
✅ **Responsive UI**: Try different screen orientations  
✅ **State Management**: Data persists across screen changes  
✅ **Pull to Refresh**: Pull down on home screen to refresh  
✅ **Error Handling**: See loading states and error messages  

### 5. Demo Data

The app includes these sample destinations:
- **Destinations**: Tokyo, Paris, Bali, Santorini, Dubai
- **Transport**: NYC Bus Tours, London Underground, Swiss Rail Pass

### 6. Technical Notes

- **Authentication**: Uses mock authentication for demo
- **Data Persistence**: Favorites and user data persist using Expo SecureStore
- **API Simulation**: Mock data simulates real API calls with loading states
- **State Management**: Redux Toolkit manages app state
- **Navigation**: Expo Router with file-based routing

### 7. Assignment Requirements Checklist

✅ User Authentication with validation  
✅ Navigation structure (tabs + stack)  
✅ Dynamic item list from API  
✅ Item interaction and details screen  
✅ State management with Redux  
✅ Favorites functionality with persistence  
✅ Clean UI with Feather Icons  
✅ Responsive design  
✅ Form validations with Yup  
✅ Best practices and modular code  

## 🎯 Ready for Submission!

Your GoMate travel app is fully functional and meets all assignment requirements. The app demonstrates:

- Professional UI/UX design
- Robust state management
- Secure data persistence
- Form validation
- Navigation flow
- API simulation
- Error handling
- Responsive layout

## 📱 Next Steps for Demo Video

1. **Record the authentication flow** (register → login)
2. **Show the main features** (home, explore, favorites, profile)
3. **Demonstrate the details screen** and favorites functionality
4. **Highlight the search and filtering** capabilities
5. **Show the responsive design** and smooth navigation

Good luck with your submission! 🎉