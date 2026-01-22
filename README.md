SouvLucky Mobile App 🌯
A premium loyalty and digital menu application for SouvLucky, designed to provide a seamless "Family" experience for customers. The app features a digital loyalty card system, a categorized menu, and profile management.

🚀 Features
🔐 Customer Registration & Auth
Join the Family: A custom sign-up flow requiring name and email validation.

Terms & Conditions: Integrated legal agreement modal that must be accepted before registration.

Welcome Gift: New users automatically receive a "Welcome Gift" (1 Free Gyro) upon their first login.

🧿 Digital Loyalty Card ("Evil Eyes")
Evil Eye Stamps: A digital 10-stamp card where users collect "Evil Eyes" instead of traditional stamps.

Smooth Animations: Utilizes Moti for high-performance scale and fade animations when stamps are added.

Instant Feedback: Optimistic UI updates ensure that clicking a stamp feels instant and lag-free.

Confetti Celebration: Integrated react-native-confetti-cannon to celebrate when a user completes their card.

📋 Interactive Digital Menu
Categorized Browsing: View the full SouvLucky menu organized by Meze, Gyros, Platters, and more.

Category Picker: A slide-up modal allowing users to jump directly to specific sections of the menu.

Visual Menu: Support for high-quality food imagery and detailed item descriptions.

🎁 Redemption System
Staff-Verified Redemption: A secure modal system with a "Staff Mode" logic to process free meals in-person.

QR Integration: Generates a dynamic QR code for staff to scan during stamp collection or reward redemption.

🛠️ Technical Overview
The app is built using React Native (Expo) with a focus on performance and maintainability.

Key Technologies:
Framework: Expo Router (File-based routing)

Animations: moti (Powered by Reanimated 2)

Storage: AsyncStorage for local session management and stamp tracking.

UI Components: react-native-circular-progress for the profile completion ring.

Typography: Google Fonts integration using GFS Didot for an authentic Greek aesthetic.

📂 Code Structure & Logic
1. app/(tabs)/index.tsx (Home Screen)
Handles the main user state. It manages the registration logic, checks for existing sessions on boot, and displays the user's progress toward their next reward.

2. app/(tabs)/rewards.tsx (Loyalty Screen)
The core of the gamification logic.

Memoized Components: The EvilEye component is memoized to prevent unnecessary re-renders of the 10-stamp grid.

Redemption Logic: Manages the state of the "Welcome Gift" and the completion of the 10-stamp loyalty card.

3. app/(tabs)/explore.tsx (Menu Screen)
Uses a useRef based positioning system. When a user selects a category from the modal, the app calculates the y coordinate of that section and performs a smooth scroll to the target item.

4. assets/
Contains all custom branding, including the SouvLucky logo, background textures (table wood and Greek patterns), and food photography.
