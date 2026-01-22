# SouvLucky Mobile App 🌯

### **Overview**
The **SouvLucky Mobile App** is a premium loyalty and digital menu solution designed to enhance the customer experience. Built with a focus on performance and a high-end "Family" aesthetic, the app integrates a digital stamp system, an interactive menu, and secure customer onboarding.

---

### **🚀 Key Features**

#### **1. Customer Authentication & Onboarding**
* **Custom Registration Flow**: A tailored sign-up interface that captures user details and validates sessions.
* **Legal Acceptance**: An integrated **Terms & Conditions** modal that ensures users agree to the loyalty program rules before joining.
* **Welcome Gift Logic**: New users are automatically flagged to receive a **Free Gyro** upon their first successful registration.

#### **2. Digital Loyalty System ("The Evil Eye")**
* **Interactive Card**: A digital 10-stamp loyalty card where users collect "Evil Eyes" instead of traditional paper stamps.
* **Smooth Animations**: Utilizing **Moti** for high-performance scale and fade transitions when stamps are added.
* **Instant Feedback**: Optimistic UI updates ensure that clicking a stamp feels instantaneous while the data syncs in the background.
* **Celebration Module**: Integrated confetti effects that trigger automatically upon card completion.

#### **3. Interactive Digital Menu**
* **Categorized Browsing**: The full menu is organized into logical sections (Gyros, Meze, Platters, etc.).
* **Category Quick-Jump**: A custom slide-up modal that allows users to snap directly to specific menu sections using coordinate-based scrolling.
* **Visual Menu**: Support for high-fidelity images and detailed descriptions for every item.

#### **4. Redemption & Staff Security**
* **Staff-Verified Redemption**: A secure modal system designed for staff members to process free meals in-person.
* **QR Integration**: Generates unique QR codes for seamless scanning at the point of sale.

---

### **🛠️ Technical Architecture**

#### **Frontend (Mobile)**
* **Framework**: **React Native** via **Expo**.
* **Routing**: **Expo Router** (File-based navigation).
* **Animations**: **Moti** and **Reanimated 2**.
* **Storage**: **AsyncStorage** for persistent local sessions and stamp tracking.
* **Typography**: Integrated **GFS Didot** Google Font for an authentic Greek aesthetic.

#### **Backend**
* **Engine**: **Java Spring Boot**.
* **Functionality**: Manages user data, transaction history, and secure reward validation.

---

### **📂 Project Structure & Logic**

* **`app/(tabs)/index.tsx`**: The main entry point handling user authentication, profile management, and the central dashboard.
* **`app/(tabs)/rewards.tsx`**: The core loyalty engine. It uses **memoized components** to efficiently render the stamp grid and manage redemption states.
* **`app/(tabs)/explore.tsx`**: The menu engine. It utilizes `useRef` to track section positions for smooth, programmatic scrolling.
* **`assets/`**: Centralized storage for branding assets, high-resolution food photography, and custom UI textures.

