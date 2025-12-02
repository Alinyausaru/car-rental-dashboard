# AutoRent - Car Rental Platform Setup Guide

## 🚗 Overview

This is a comprehensive car rental platform with:
- **Customer-Facing Website**: Public browsing, booking system, customer accounts
- **Admin CRM**: Complete management system for bookings, fleet, customers, payments, etc.
- **Shared Supabase Database**: Real-time sync between customer bookings and admin system

## 📋 Features

### Customer Website
- **Homepage** with search widget and featured cars
- **Browse Cars** with advanced filters (price, type, transmission, etc.)
- **Vehicle Details** with image gallery, specs, reviews, and pricing
- **5-Step Booking Flow**:
  1. Select dates & location
  2. Add-ons & extras
  3. Customer information
  4. Review & payment
  5. Confirmation
- **Customer Accounts**:
  - Dashboard with stats
  - My Bookings (view, download invoices)
  - Profile management
  - Saved favorites
- **Static Pages**: About, Contact, FAQ, Terms, Privacy

### Admin CRM (Existing)
- Dashboard with analytics
- Booking Calendar
- Fleet Management
- Customer Database
- Invoices & Payments
- Reports & Analytics
- Maintenance Tracking
- Contracts & Documents
- Communication Center
- Settings

## 🎯 Quick Start

### 1. Initial Setup

The app automatically seeds demo data on first load with:
- **8 vehicles** (sedans, SUVs, pickup trucks, luxury cars, electric vehicles)
- **3 customers** with booking history
- **6 reviews** across different vehicles

### 2. Customer View (Default)

When you open the app, you'll see the **customer-facing website**:

```
Homepage → Browse Cars → Vehicle Details → Book Now
```

### 3. Admin View

If you're logged in as an admin, you'll see a toggle button at the top:

```
[Switch to Admin CRM]
```

This switches to your existing CRM dashboard.

## 👥 User Accounts

### Create Customer Account

1. Click "Sign Up" in the header
2. Fill in:
   - Full Name
   - Email
   - Phone
   - Date of Birth
   - Password
3. Accept terms & confirm age (21+)
4. Click "Create Account"

### Create Admin Account

Use the `/auth/signup` endpoint with role:

```javascript
// In the backend, modify the signup to create admin:
user_metadata: {
  role: "admin",
  full_name: "Admin User"
}
```

Or manually update a user's metadata in Supabase dashboard.

## 🔄 How It Works

### Customer Books a Car

1. Customer browses vehicles
2. Selects a car and dates
3. Chooses add-ons (GPS, insurance, etc.)
4. Enters personal & driver information
5. Reviews booking and confirms
6. Booking is created with status: "Pending"
7. Invoice is automatically generated

### Admin Receives Booking

1. New booking appears in admin CRM instantly
2. Admin can see all details in "Booking Management"
3. Admin confirms booking (status → "Confirmed")
4. Customer receives confirmation (would be via email/SMS in production)
5. Admin manages payment, vehicle assignment, etc.

## 💾 Database Structure

All data is stored in the Supabase KV store with these prefixes:

```
vehicle:{id}       - Vehicle data
customer:{id}      - Customer profiles
customer:user:{userId} - User ID to customer mapping
booking:{id}       - Booking records
invoice:{id}       - Invoices
invoice:booking:{bookingId} - Booking to invoice mapping
review:{id}        - Vehicle reviews
contact:{id}       - Contact form submissions
```

## 🔐 Authentication Flow

### Customer Signup
```
POST /auth/signup
→ Creates Supabase auth user
→ Creates customer profile
→ Auto-confirms email (since email server not configured)
→ Returns user + customer data
```

### Customer Login
```
Supabase signInWithPassword
→ Returns session with access_token
→ Token used for authenticated API calls
```

### Admin Access
```
User with user_metadata.role = "admin"
→ Can access admin CRM
→ Can view all customers and bookings
→ Can manage entire system
```

## 📡 API Endpoints

### Vehicles
- `GET /vehicles` - List all vehicles
- `GET /vehicles/:id` - Get vehicle details
- `POST /vehicles` - Create vehicle (admin only)
- `PUT /vehicles/:id` - Update vehicle (admin only)

### Customers
- `GET /customers/me` - Get current user's profile
- `GET /customers` - List all customers (admin only)
- `POST /customers` - Create/update customer profile

### Bookings
- `GET /bookings` - List bookings (filtered by user role)
- `GET /bookings/:id` - Get booking details
- `POST /bookings` - Create new booking
- `PUT /bookings/:id` - Update booking (admin only)

### Reviews
- `GET /vehicles/:vehicleId/reviews` - Get vehicle reviews
- `POST /reviews` - Create review (authenticated)

### Contact
- `POST /contact` - Submit contact form

### Auth
- `POST /auth/signup` - Create new account

### Utilities
- `POST /seed-data` - Seed demo data
- `DELETE /clear-data` - Clear all data

## 🎨 Customization

### Branding
Edit `/components/customer/CustomerHeader.tsx` and `/components/customer/CustomerFooter.tsx`:
- Logo
- Company name
- Colors
- Contact information

### Pricing
Modify vehicle rates in:
- `daily_rate_weekday`
- `daily_rate_weekend`
- `weekly_rate`
- `monthly_rate`
- `deposit_amount`

### Add-ons Pricing
Edit `/components/customer/BookingFlow.tsx`:
```javascript
if (bookingData.addons?.insurance) addonsPrice += days * 25;
if (bookingData.addons?.gps) addonsPrice += days * 10;
// ... etc
```

### Locations
Edit pickup locations in booking form:
```javascript
<SelectItem value="Main Office">Main Office</SelectItem>
<SelectItem value="Airport">Airport</SelectItem>
<SelectItem value="City Center">City Center</SelectItem>
```

## 🚀 Demo Scenarios

### Scenario 1: Customer Rental
1. Browse cars → Select "Toyota Camry"
2. View details → Click "Book Now"
3. Choose dates: Dec 5-10, 2024
4. Add GPS + Insurance
5. Enter customer info
6. Choose "Pay on Pickup"
7. Confirm booking
8. Receive booking reference: BK-XXXXX

### Scenario 2: Admin Management
1. Switch to Admin view
2. See new booking in calendar
3. Open booking details
4. Change status to "Confirmed"
5. Customer sees updated status
6. Process payment
7. Mark as "Active" on pickup
8. Mark as "Completed" on return

## 📊 Reports & Analytics

In the admin CRM, you can view:
- Total revenue
- Booking trends
- Fleet utilization
- Customer segments
- Popular vehicles
- Payment status

## 🔧 Troubleshooting

### No vehicles showing
Run the seed data endpoint:
```javascript
POST /seed-data
```

### User can't login
Check:
- Email/password correct
- User exists in Supabase auth
- Customer profile created

### Booking not appearing in admin
Check:
- Admin is logged in
- Booking was created successfully
- Refresh the bookings list

### Payment not recording
- Payments are manual in this demo
- Admin marks booking as "Paid" in admin CRM
- Real payment integration would require payment gateway

## 📝 Important Notes

### For Production Use:
1. **Email Configuration**: Set up email service in Supabase for confirmations
2. **Payment Gateway**: Integrate Stripe, PayPal, or local payment provider
3. **SMS Notifications**: Add Twilio or similar for booking reminders
4. **File Upload**: Configure Supabase Storage for customer documents
5. **Security**: Implement rate limiting, CAPTCHA, and stricter validation
6. **Real-time**: Enable Supabase real-time subscriptions for live updates
7. **PII Protection**: This is a demo - don't collect real customer data

### Current Limitations:
- No email sending (auto-confirms accounts)
- No actual payment processing (manual marking)
- No SMS notifications
- No file uploads for licenses/IDs
- Uses KV store instead of proper relational tables
- No advanced search/filtering
- No multi-language support

## 🎓 Learning Resources

### Understanding the Code:
- `/components/CustomerWebsite.tsx` - Main router
- `/components/customer/` - All customer pages
- `/supabase/functions/server/routes.tsx` - API logic
- `/utils/api.tsx` - API client functions

### Key Concepts:
- React state management
- Supabase auth & database
- Multi-step forms
- Real-time data sync
- Role-based access control

## 🆘 Support

For issues or questions:
1. Check browser console for errors
2. Review API response in Network tab
3. Check Supabase logs
4. Review this guide

## 🎉 You're Ready!

Your car rental platform is now set up and ready to use. Start by:
1. Browsing vehicles as a customer
2. Creating a test booking
3. Switching to admin view
4. Managing the booking

Happy renting! 🚗💨
