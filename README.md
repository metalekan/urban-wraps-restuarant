# 🌯 Urban Wraps - Full-Stack Restaurant Ordering Platform

A modern, feature-rich food ordering application built with Next.js 15, Firebase, and Stripe. Urban Wraps offers a complete restaurant experience with custom order building, secure payments, table reservations, and comprehensive user management.

![Urban Wraps](https://res.cloudinary.com/djljkfhjx/image/upload/v1764511189/my%20portfolio/61509_dpenfm.jpg)

## ✨ Features

### 🛒 Order Management
- **Custom Order Builder** - Build your perfect wrap with 5 base types, 15+ fresh ingredients, and 11 sauces & spices
- **Real-time Cart** - Shopping cart with localStorage persistence and automatic price calculation (including 8.5% tax)
- **Smart Quantity Controls** - Adjust quantities with validation (1-20 items per order)
- **Order History** - View all past orders with detailed breakdowns and status tracking

### 💳 Payments & Checkout
- **Stripe Integration** - Secure payment processing with Stripe Checkout
- **Delivery Options** - Choose between pickup (free) or delivery (+$5.00)
- **Order Tracking** - Real-time order status updates (Pending, Preparing, Ready, Completed)
- **Payment Confirmation** - Success and cancellation pages with order references

### 📅 Reservation System
- **Interactive Calendar** - Visual date picker with past date blocking
- **Time Slot Selection** - 30-minute intervals from 11 AM to 9 PM
- **Party Size Management** - Support for 1-20 guests
- **Reservation Management** - View, track, and cancel reservations from dashboard

### 👤 User Authentication & Dashboard
- **Firebase Auth** - Secure email/password and Google OAuth authentication
- **Protected Routes** - Automatic redirection for authenticated-only pages
- **User Dashboard** - Centralized hub for orders, reservations, and profile
- **Profile Management** - Update personal information, phone, and delivery addresses

### 🎨 UI/UX
- **Dark/Light Mode** - Theme toggle with system preference detection
- **Mobile-First Design** - Fully responsive with proper touch targets and padding
- **Modern Components** - Built with shadcn/ui and Tailwind CSS
- **Smooth Animations** - Polished transitions and loading states
- **Toast Notifications** - Real-time feedback for user actions

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Forms**: react-hook-form + Zod validation
- **Theme**: next-themes

### Backend & Services
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth (Email/Password + Google OAuth)
- **Payments**: Stripe Checkout
- **Image Hosting**: Cloudinary
- **Real-time Updates**: Firestore onSnapshot listeners

### State Management
- **Auth Context**: User authentication and profile data
- **Cart Context**: Shopping cart with localStorage sync
- **Order Context**: Real-time order updates via Firestore

## 📋 Prerequisites

- Node.js 18+ and npm
- Firebase account (Firestore + Authentication enabled)
- Stripe account (test mode works)
- Cloudinary account (optional, for custom images)

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd urban-wraps-restuarant
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
STRIPE_SECRET_KEY=sk_test_your_secret_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Seed the Database

Populate Firestore with menu items:

```bash
npm run seed
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
urban-wraps-restuarant/
├── app/
│   ├── api/
│   │   └── checkout/           # Stripe checkout session API
│   ├── auth/                   # Authentication pages
│   ├── cart/                   # Shopping cart page
│   ├── checkout/               # Checkout flow
│   │   ├── success/            # Payment success page
│   │   └── cancel/             # Payment cancellation page
│   ├── dashboard/              # User dashboard
│   │   ├── orders/             # Order history
│   │   ├── reservations/       # Reservation management
│   │   └── profile/            # Profile settings
│   ├── order/                  # Custom order builder
│   ├── reservations/           # Reservation booking
│   ├── layout.tsx              # Root layout with providers
│   └── page.tsx                # Homepage
├── components/
│   ├── auth/                   # Auth components (Login, SignUp, Protected)
│   ├── dashboard/              # Dashboard sidebar
│   ├── layout/                 # Header component
│   ├── order-builder/          # Order builder components
│   └── ui/                     # shadcn/ui components
├── lib/
│   ├── contexts/               # React contexts (Auth, Cart, Order)
│   ├── firebase/               # Firebase config, schema, seed data
│   ├── hooks/                  # Custom hooks (useOrderBuilder)
│   └── utils/                  # Utility functions (format, validation)
├── public/                     # Static assets
└── scripts/                    # Database scripts (seed, clear)
```

## 🎨 Brand Colors

```css
--primary: 27 96% 61%        /* Orange #FFA726 */
--secondary: 186 77% 58%     /* Teal #4DD0E1 */
--accent: 0 79% 70%          /* Red-Orange #FF6B6B */
```

## 🚀 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run seed         # Seed Firestore database
npm run clear        # Clear Firestore collections
```

## 📊 Database Schema

### Collections

- **wraps** - Base wrap types (Flour, Whole Wheat, Spinach, etc.)
- **ingredients** - Available ingredients (proteins, veggies, cheese)
- **addOns** - Sauces, spices, and extras
- **orders** - User orders with items, status, and delivery info
- **reservations** - Table reservations with date, time, and party size
- **users** - User profiles with contact and address information

## 🔐 Security

- **Firestore Rules**: Configured for authenticated access
- **Protected Routes**: Client-side route protection with `ProtectedRoute` component
- **Server-side Validation**: API routes validate requests before processing
- **Secure Payments**: Stripe handles all payment processing (PCI compliant)

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Other Platforms

The app can be deployed to any platform supporting Next.js (Netlify, Railway, etc.)

## 📝 Development Checklist

- [x] Project setup and configuration
- [x] Authentication system (Email + Google OAuth)
- [x] Shopping cart with persistence
- [x] Custom order builder
- [x] Stripe checkout integration
- [x] Reservation system
- [x] User dashboard
- [x] Order history
- [x] Profile management
- [x] Dark/Light mode
- [x] Mobile responsiveness
- [ ] Admin panel
- [ ] Email notifications
- [ ] Order status webhooks

## 🤝 Contributing

This is a portfolio/demonstration project. Feel free to fork and customize for your own use!

## 📄 License

MIT License - Feel free to use this project as a template for your own restaurant application.

---

**Built with ❤️ using Next.js, Firebase, and Stripe**

*Urban Wraps - Fresh, Custom Wraps & Rolls Made Just For You* 🌯
