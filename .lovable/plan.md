
# skmobiles - Premium Mobile Accessories E-Commerce Platform

## Overview
A modern, dark-themed e-commerce website for selling mobile phones and accessories with a full-featured admin panel, Stripe payments, and Google authentication.

---

## Design Theme
**Dark & Premium aesthetic** featuring:
- Deep dark backgrounds with subtle gradients
- Neon accent colors (electric blue/cyan highlights)
- Smooth animations and micro-interactions throughout
- Glassmorphism effects on cards and modals
- Clean typography with modern fonts

---

## Customer-Facing Features

### 🏠 Homepage
- Hero banner with promotional slides and deals
- Featured products carousel
- Category showcase (Mobiles, Cases, Chargers, Earphones, Earbuds)
- New arrivals section
- Special offers/deals section
- Newsletter signup

### 📱 Product Catalog
- Category-based browsing with filtering
- Search functionality with auto-suggestions
- Sort by price, popularity, newest
- Grid/List view toggle
- Product cards with hover animations showing quick actions

### 📄 Product Detail Page
- Image gallery with zoom capability
- Product specifications and description
- Price and availability status
- Add to Cart / Add to Wishlist buttons
- Customer reviews and ratings
- Related products suggestions

### ❤️ Wishlist
- Save favorite products
- Move items to cart
- Share wishlist functionality

### 🛒 Shopping Cart
- Slide-out cart drawer
- Quantity adjustments
- Remove items with animation
- Order summary with subtotal
- Proceed to checkout button

### 💳 Checkout Flow
- Login/Register prompt (if not authenticated)
- Shipping address form
- Delivery method selection (Standard Shipping / Store Pickup)
- Stripe payment integration
- Order confirmation page

### 👤 Customer Account
- Profile management
- Order history with status tracking
- Wishlist access
- Address book
- Account settings

### 🔐 Authentication
- Email/Password registration and login
- Google Sign-in integration
- Password reset functionality
- Session management

---

## Admin Panel (/admin)

### 🔒 Admin Login
- Separate admin authentication
- Static credentials: Username: Venkat, Password: Subbu@9502
- Secure admin-only routes

### 📊 Sales Dashboard
- Revenue overview (daily, weekly, monthly)
- Order statistics
- Best-selling products chart
- Recent orders list
- Quick stats cards (Total Sales, Orders, Customers, Products)

### 📦 Inventory Management
- **Add/Edit Categories** with icons and descriptions
- **Add/Edit Products** with:
  - Product name, description, price
  - Category assignment
  - Stock quantity
  - Multiple image upload
  - Specifications
  - Featured/Active toggles

### ⚠️ Stock Alerts
- Low stock notifications
- Out-of-stock product list
- Restock reminders
- Configurable alert thresholds

### 📋 Order Management
- View all orders with status
- Update order status (Processing, Shipped, Delivered, Cancelled)
- Order details with customer info
- Filter by status/date

### 👥 Customer Management
- Customer list with search
- Customer profiles with order history
- Contact information
- Customer activity logs

---

## Technical Implementation

### Backend (Lovable Cloud + Supabase)
- Database for products, categories, orders, users, reviews
- User authentication with Google OAuth
- Secure admin authentication
- File storage for product images

### Payment
- Stripe integration for secure payments
- Multiple card support
- Order confirmation emails

### Pages Structure
- `/` - Homepage
- `/products` - All products
- `/category/:slug` - Category page
- `/product/:id` - Product detail
- `/cart` - Shopping cart
- `/checkout` - Checkout flow
- `/wishlist` - Saved items
- `/account` - User dashboard
- `/auth` - Login/Register
- `/admin` - Admin dashboard
- `/admin/products` - Manage products
- `/admin/categories` - Manage categories
- `/admin/orders` - Order management
- `/admin/customers` - Customer management

---

## Key Animations & UX
- Smooth page transitions
- Product card hover effects with scale and shadow
- Cart drawer slide animation
- Button press animations
- Loading skeletons
- Toast notifications for actions
- Scroll reveal animations
- Floating labels on forms

This will create a fully functional, modern e-commerce platform that's ready to start selling your mobile accessories!
