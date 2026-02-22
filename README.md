# O2Clinic Medical Store

The most trusted B2B pharmaceutical platform for clinics and pharmacies. Direct from manufacturers.

## 🚀 Features

- **Premium UI/UX**: Professional medical theme with smooth animations.
- **Advanced Catalog**: Dynamic product listing from Supabase with deep filtering and search.
- **Wholesale Workflow**: Tiered pricing, GST calculations, and multi-step checkout.
- **PWA Ready**: Installable on mobile/desktop with offline support.
- **Zustand State**: Robust session, cart, and wishlist management.
- **Admin Dashboard**: Manage orders, add products, approve users, and view analytics.
- **User Profiles**: Manage wishlist, order history, and practice details.
- **Secure Auth**: Supabase Authentication with Role-Based Access Control (RBAC).
- **Real-time Database**: Supabase PostgreSQL with Row Level Security (RLS).

## 🛠️ Setup Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Setup**:
   Create a `.env` file in the root directory with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

4. **Build for Production**:
   ```bash
   npm run build
   ```

## 📂 Project Structure

- `/src/components/ui`: Core UI library.
- `/src/components/features`: Specialty components like ProductCards.
- `/src/pages`: Feature-rich page implementations.
- `/src/store`: Zustand state management (Auth, Cart, Wishlist).
- `/src/lib`: Supabase client configuration.
- `/supabase_schema.sql`: Database schema and RLS policies.

## 🔐 Authentication
- **Standard Login**: Email/Password authentication via Supabase.
- **Registration**: Requires medical license number and practice details.
- **Admin Access**: Restricted to users with `admin` role.

---
Produced by Antigravity AI & Dr. Ashish Maurya.
