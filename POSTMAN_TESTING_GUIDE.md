# 🚀 QuickStay API - Complete Postman Testing Guide

This guide will help you test all backend APIs in Postman to verify data flow from backend to frontend.

## 📋 Table of Contents
1. [Initial Setup](#initial-setup)
2. [Authentication Setup](#authentication-setup)
3. [Testing Routes](#testing-routes)
   - [Basic Health Check](#1-basic-health-check)
   - [User Routes](#2-user-routes)
   - [Room Routes (Public)](#3-room-routes-public)
   - [Booking Routes](#4-booking-routes)
   - [Hotel Routes (Admin Only)](#5-hotel-routes-admin-only)
   - [Room Management (Admin Only)](#6-room-management-admin-only)
   - [Admin Routes](#7-admin-routes)

---

## 🔧 Initial Setup

### Step 1: Start Your Backend Server
```bash
cd server
npm run dev
```
Server should run on: `http://localhost:5000`

### Step 2: Create Postman Collection
1. Open Postman
2. Create new Collection: "QuickStay API Tests"
3. Set Collection Variable:
   - `base_url` = `http://localhost:5000`

### Step 3: Get Your Clerk Token
To test protected routes, you need a valid Clerk JWT token:

#### Option A: From Frontend (Easiest)
1. Run your frontend: `npm run dev`
2. Login to your app
3. Open Browser DevTools → Application → Session Storage
4. Find `__session` or look in Cookies
5. Copy the JWT token value

#### Option B: From Clerk Dashboard
1. Go to Clerk Dashboard → Users
2. Select a user → Generate token
3. Copy the token

### Step 4: Setup Authorization in Postman
For ALL protected routes, add this header:
```
Authorization: Bearer YOUR_CLERK_JWT_TOKEN
```

---

## 🔐 Authentication Setup

### Quick Setup for Protected Routes:
1. In Postman Collection → Authorization
2. Select Type: "Bearer Token"
3. Paste your Clerk token
4. All requests in collection will inherit this

---

## 🧪 Testing Routes

## 1. Basic Health Check

### ✅ Test Server Status
**Endpoint:** `GET {{base_url}}/`

**Expected Response:**
```json
"API is running fine"
```

**Status Code:** `200 OK`

---

## 2. User Routes

### ✅ Get User Data
**Endpoint:** `GET {{base_url}}/api/user`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

**Expected Response:**
```json
{
  "success": true,
  "user": {
    "clerkId": "user_xxx",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "recentSearches": []
  }
}
```

**Status Code:** `200 OK`

**What to Check:**
- ✓ User data matches Clerk profile
- ✓ Role is present (user/admin)
- ✓ Email is correct

---

### ✅ Store Recent Searches
**Endpoint:** `POST {{base_url}}/api/user/store-recent-searched`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "search": "Mumbai Hotels"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Search saved successfully"
}
```

**Status Code:** `200 OK`

---

## 3. Room Routes (Public)

### ✅ Get All Rooms
**Endpoint:** `GET {{base_url}}/api/room`

**Query Parameters (Optional):**
```
?destination=Mumbai
&checkIn=2024-12-20
&checkOut=2024-12-25
&guests=2
&minPrice=2000
&maxPrice=10000
&roomType=Deluxe
```

**Expected Response:**
```json
{
  "success": true,
  "rooms": [
    {
      "_id": "room_id",
      "hotelId": {
        "_id": "hotel_id",
        "name": "Taj Palace Hotel",
        "city": "New Delhi",
        "address": "Sardar Patel Marg, Diplomatic Enclave"
      },
      "roomType": "Deluxe",
      "pricePerNight": 8500,
      "maxGuests": 2,
      "description": "Luxurious room with city view",
      "amenities": ["WiFi", "AC", "TV", "Mini Bar"],
      "images": ["url1", "url2"],
      "isAvailable": true
    }
  ],
  "count": 17
}
```

**Status Code:** `200 OK`

**What to Check:**
- ✓ Returns array of rooms
- ✓ Hotel details populated
- ✓ Images are present
- ✓ Price in INR (₹)
- ✓ Filters work (test with different query params)

---

### ✅ Get Single Room by ID
**Endpoint:** `GET {{base_url}}/api/room/:id`

**Example:** `GET {{base_url}}/api/room/6746d1234567890abcdef123`

**Expected Response:**
```json
{
  "success": true,
  "room": {
    "_id": "6746d1234567890abcdef123",
    "hotelId": {
      "_id": "hotel_id",
      "name": "The Oberoi Mumbai",
      "city": "Mumbai",
      "rating": 5,
      "address": "Nariman Point, Mumbai",
      "phoneNumber": "+91-22-66325757"
    },
    "roomType": "Suite",
    "pricePerNight": 12000,
    "maxGuests": 3,
    "description": "Spacious suite with ocean view",
    "amenities": ["WiFi", "AC", "TV", "Mini Bar", "Room Service"],
    "images": ["image1.jpg", "image2.jpg"],
    "isAvailable": true
  }
}
```

**Status Code:** `200 OK`

**What to Check:**
- ✓ Complete room details
- ✓ Hotel info populated
- ✓ All amenities listed
- ✓ Multiple images

---

## 4. Booking Routes

### ✅ Check Room Availability
**Endpoint:** `POST {{base_url}}/api/booking/check-availability`

**Body (JSON):**
```json
{
  "roomId": "6746d1234567890abcdef123",
  "checkIn": "2024-12-20",
  "checkOut": "2024-12-25"
}
```

**Expected Response (Available):**
```json
{
  "success": true,
  "available": true,
  "message": "Room is available for the selected dates"
}
```

**Expected Response (Not Available):**
```json
{
  "success": false,
  "available": false,
  "message": "Room is not available for the selected dates"
}
```

**Status Code:** `200 OK`

---

### ✅ Create Booking
**Endpoint:** `POST {{base_url}}/api/booking/book`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "roomId": "6746d1234567890abcdef123",
  "checkIn": "2024-12-20",
  "checkOut": "2024-12-25",
  "numberOfGuests": 2,
  "totalPrice": 42500,
  "guestName": "John Doe",
  "guestEmail": "john@example.com",
  "guestPhone": "+91-9876543210"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Booking created successfully! Confirmation email sent.",
  "booking": {
    "_id": "booking_id",
    "userId": "user_id",
    "roomId": "room_id",
    "checkIn": "2024-12-20T00:00:00.000Z",
    "checkOut": "2024-12-25T00:00:00.000Z",
    "numberOfGuests": 2,
    "totalPrice": 42500,
    "status": "confirmed",
    "guestName": "John Doe",
    "guestEmail": "john@example.com",
    "guestPhone": "+91-9876543210",
    "createdAt": "2024-11-12T10:30:00.000Z"
  }
}
```

**Status Code:** `201 Created`

**What to Check:**
- ✓ Booking created with correct dates
- ✓ Total price matches
- ✓ Status is "confirmed"
- ✓ Check email for confirmation (if configured)

---

### ✅ Get User's Bookings
**Endpoint:** `GET {{base_url}}/api/booking/user`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

**Expected Response:**
```json
{
  "success": true,
  "bookings": [
    {
      "_id": "booking_id",
      "roomId": {
        "_id": "room_id",
        "roomType": "Deluxe",
        "pricePerNight": 8500,
        "images": ["image1.jpg"],
        "hotelId": {
          "name": "Taj Palace Hotel",
          "city": "New Delhi"
        }
      },
      "checkIn": "2024-12-20T00:00:00.000Z",
      "checkOut": "2024-12-25T00:00:00.000Z",
      "numberOfGuests": 2,
      "totalPrice": 42500,
      "status": "confirmed",
      "guestName": "John Doe",
      "createdAt": "2024-11-12T10:30:00.000Z"
    }
  ],
  "count": 1
}
```

**Status Code:** `200 OK`

**What to Check:**
- ✓ Shows all user's bookings
- ✓ Room and hotel details populated
- ✓ Sorted by date (newest first)

---

### ✅ Cancel Booking
**Endpoint:** `PUT {{base_url}}/api/booking/:id/cancel`

**Example:** `PUT {{base_url}}/api/booking/6746d9876543210abcdef456/cancel`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Booking cancelled successfully. Cancellation email sent.",
  "booking": {
    "_id": "6746d9876543210abcdef456",
    "status": "cancelled",
    "cancelledAt": "2024-11-12T11:00:00.000Z"
  }
}
```

**Status Code:** `200 OK`

**What to Check:**
- ✓ Status changed to "cancelled"
- ✓ Cancellation email received (if configured)

---

## 5. Hotel Routes (Admin Only)

⚠️ **Note:** These routes require `role: "admin"` in your user profile.

### ✅ Create Hotel
**Endpoint:** `POST {{base_url}}/api/hotel`

**Headers:**
```
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "name": "New Luxury Hotel",
  "description": "5-star luxury hotel in the heart of Mumbai",
  "address": "Marine Drive, Mumbai",
  "city": "Mumbai",
  "state": "Maharashtra",
  "country": "India",
  "zipCode": "400020",
  "phoneNumber": "+91-22-12345678",
  "email": "info@newluxury.com",
  "rating": 4.5,
  "amenities": ["Pool", "Gym", "Spa", "Restaurant"],
  "images": ["hotel1.jpg", "hotel2.jpg"]
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Hotel created successfully",
  "hotel": {
    "_id": "new_hotel_id",
    "name": "New Luxury Hotel",
    "city": "Mumbai",
    "ownerId": "your_clerk_id",
    "createdAt": "2024-11-12T12:00:00.000Z"
  }
}
```

**Status Code:** `201 Created`

---

### ✅ Get Owner's Hotels
**Endpoint:** `GET {{base_url}}/api/hotel/owner`

**Headers:**
```
Authorization: Bearer ADMIN_TOKEN
```

**Expected Response:**
```json
{
  "success": true,
  "hotels": [
    {
      "_id": "hotel_id",
      "name": "Taj Palace Hotel",
      "city": "New Delhi",
      "rating": 5,
      "roomCount": 3,
      "createdAt": "2024-11-12T00:00:00.000Z"
    }
  ]
}
```

**Status Code:** `200 OK`

---

### ✅ Update Hotel
**Endpoint:** `PUT {{base_url}}/api/hotel/:id`

**Headers:**
```
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "name": "Updated Hotel Name",
  "rating": 4.8,
  "phoneNumber": "+91-22-99999999"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Hotel updated successfully",
  "hotel": {
    "_id": "hotel_id",
    "name": "Updated Hotel Name",
    "rating": 4.8
  }
}
```

**Status Code:** `200 OK`

---

## 6. Room Management (Admin Only)

### ✅ Create Room
**Endpoint:** `POST {{base_url}}/api/room`

**Headers:**
```
Authorization: Bearer ADMIN_TOKEN
Content-Type: multipart/form-data
```

**Body (form-data):**
```
hotelId: hotel_id_here
roomType: Deluxe
pricePerNight: 9500
maxGuests: 2
description: Beautiful room with modern amenities
amenities[0]: WiFi
amenities[1]: AC
amenities[2]: TV
images: [Select 1-4 image files]
isAvailable: true
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Room created successfully",
  "room": {
    "_id": "new_room_id",
    "hotelId": "hotel_id",
    "roomType": "Deluxe",
    "pricePerNight": 9500,
    "images": ["cloudinary_url1", "cloudinary_url2"]
  }
}
```

**Status Code:** `201 Created`

---

### ✅ Get Owner's Rooms
**Endpoint:** `GET {{base_url}}/api/room/owner`

**Headers:**
```
Authorization: Bearer ADMIN_TOKEN
```

**Expected Response:**
```json
{
  "success": true,
  "rooms": [
    {
      "_id": "room_id",
      "hotelId": {
        "name": "Taj Palace Hotel"
      },
      "roomType": "Deluxe",
      "pricePerNight": 8500,
      "isAvailable": true,
      "bookingsCount": 5
    }
  ]
}
```

**Status Code:** `200 OK`

---

### ✅ Toggle Room Availability
**Endpoint:** `POST {{base_url}}/api/room/toggle-availbility`

**Headers:**
```
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "roomId": "room_id_here"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Room availability updated",
  "isAvailable": false
}
```

**Status Code:** `200 OK`

---

### ✅ Update Room
**Endpoint:** `PUT {{base_url}}/api/room/:id`

**Headers:**
```
Authorization: Bearer ADMIN_TOKEN
Content-Type: multipart/form-data
```

**Body (form-data):**
```
roomType: Suite
pricePerNight: 15000
maxGuests: 4
images: [Optional: new images]
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Room updated successfully",
  "room": {
    "_id": "room_id",
    "roomType": "Suite",
    "pricePerNight": 15000
  }
}
```

**Status Code:** `200 OK`

---

### ✅ Delete Room
**Endpoint:** `DELETE {{base_url}}/api/room/:id`

**Headers:**
```
Authorization: Bearer ADMIN_TOKEN
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Room deleted successfully"
}
```

**Status Code:** `200 OK`

---

## 7. Admin Routes

⚠️ **Super Admin Routes** - Require admin promotion first

### ✅ Promote to Admin (First Time Setup)
**Endpoint:** `POST {{base_url}}/api/admin/promote`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "token": "YOUR_ADMIN_PROMOTE_TOKEN"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "You have been promoted to admin",
  "user": {
    "clerkId": "user_xxx",
    "role": "admin"
  }
}
```

**Status Code:** `200 OK`

**Note:** Get `ADMIN_PROMOTE_TOKEN` from your `.env` file

---

### ✅ Get Dashboard Stats
**Endpoint:** `GET {{base_url}}/api/admin/stats`

**Headers:**
```
Authorization: Bearer ADMIN_TOKEN
```

**Expected Response:**
```json
{
  "success": true,
  "stats": {
    "totalBookings": 45,
    "totalRevenue": 385000,
    "totalUsers": 23,
    "totalHotels": 6,
    "totalRooms": 17,
    "activeBookings": 12,
    "pendingBookings": 3,
    "cancelledBookings": 8
  }
}
```

**Status Code:** `200 OK`

---

### ✅ Get All Bookings
**Endpoint:** `GET {{base_url}}/api/admin/bookings`

**Headers:**
```
Authorization: Bearer ADMIN_TOKEN
```

**Expected Response:**
```json
{
  "success": true,
  "bookings": [
    {
      "_id": "booking_id",
      "userId": {
        "name": "John Doe",
        "email": "john@example.com"
      },
      "roomId": {
        "roomType": "Deluxe",
        "hotelId": {
          "name": "Taj Palace Hotel"
        }
      },
      "checkIn": "2024-12-20",
      "totalPrice": 42500,
      "status": "confirmed"
    }
  ],
  "count": 45
}
```

**Status Code:** `200 OK`

---

### ✅ Get All Users
**Endpoint:** `GET {{base_url}}/api/admin/users`

**Headers:**
```
Authorization: Bearer ADMIN_TOKEN
```

**Expected Response:**
```json
{
  "success": true,
  "users": [
    {
      "_id": "user_id",
      "clerkId": "user_xxx",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user",
      "createdAt": "2024-11-01"
    }
  ],
  "count": 23
}
```

**Status Code:** `200 OK`

---

### ✅ Get All Hotels
**Endpoint:** `GET {{base_url}}/api/admin/hotels`

**Headers:**
```
Authorization: Bearer ADMIN_TOKEN
```

**Expected Response:**
```json
{
  "success": true,
  "hotels": [
    {
      "_id": "hotel_id",
      "name": "Taj Palace Hotel",
      "city": "New Delhi",
      "rating": 5,
      "roomCount": 3,
      "ownerId": {
        "name": "Admin User"
      }
    }
  ],
  "count": 6
}
```

**Status Code:** `200 OK`

---

### ✅ Get All Rooms
**Endpoint:** `GET {{base_url}}/api/admin/rooms`

**Headers:**
```
Authorization: Bearer ADMIN_TOKEN
```

**Expected Response:**
```json
{
  "success": true,
  "rooms": [
    {
      "_id": "room_id",
      "hotelId": {
        "name": "Taj Palace Hotel",
        "city": "New Delhi"
      },
      "roomType": "Deluxe",
      "pricePerNight": 8500,
      "isAvailable": true,
      "bookingsCount": 5
    }
  ],
  "count": 17
}
```

**Status Code:** `200 OK`

---

### ✅ Cancel Any Booking (Admin)
**Endpoint:** `DELETE {{base_url}}/api/admin/bookings/:id`

**Headers:**
```
Authorization: Bearer ADMIN_TOKEN
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Booking cancelled successfully"
}
```

**Status Code:** `200 OK`

---

### ✅ Update Booking Status
**Endpoint:** `PATCH {{base_url}}/api/admin/bookings/:id/status`

**Headers:**
```
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "status": "completed"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Booking status updated",
  "booking": {
    "_id": "booking_id",
    "status": "completed"
  }
}
```

**Status Code:** `200 OK`

---

### ✅ Delete Hotel (Admin)
**Endpoint:** `DELETE {{base_url}}/api/admin/hotels/:id`

**Headers:**
```
Authorization: Bearer ADMIN_TOKEN
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Hotel and all associated rooms deleted"
}
```

**Status Code:** `200 OK`

---

### ✅ Delete Room (Admin)
**Endpoint:** `DELETE {{base_url}}/api/admin/rooms/:id`

**Headers:**
```
Authorization: Bearer ADMIN_TOKEN
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Room deleted successfully"
}
```

**Status Code:** `200 OK`

---

### ✅ Update User Role
**Endpoint:** `PATCH {{base_url}}/api/admin/users/:id/role`

**Headers:**
```
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "role": "admin"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User role updated",
  "user": {
    "_id": "user_id",
    "role": "admin"
  }
}
```

**Status Code:** `200 OK`

---

## 📊 Testing Checklist

### Basic Tests (Must Test First)
- [ ] Server health check (`GET /`)
- [ ] Get all rooms (`GET /api/room`)
- [ ] Get single room (`GET /api/room/:id`)

### User Tests (Need Auth Token)
- [ ] Get user data (`GET /api/user`)
- [ ] Store recent search (`POST /api/user/store-recent-searched`)

### Booking Tests (Need Auth Token)
- [ ] Check availability (`POST /api/booking/check-availability`)
- [ ] Create booking (`POST /api/booking/book`)
- [ ] Get user bookings (`GET /api/booking/user`)
- [ ] Cancel booking (`PUT /api/booking/:id/cancel`)

### Admin Tests (Need Admin Role)
- [ ] Promote to admin (`POST /api/admin/promote`)
- [ ] Get dashboard stats (`GET /api/admin/stats`)
- [ ] Get all bookings (`GET /api/admin/bookings`)
- [ ] Get all users (`GET /api/admin/users`)
- [ ] Get all hotels (`GET /api/admin/hotels`)
- [ ] Get all rooms (`GET /api/admin/rooms`)
- [ ] Create hotel (`POST /api/hotel`)
- [ ] Create room (`POST /api/room`)
- [ ] Delete room (`DELETE /api/room/:id`)

---

## 🐛 Common Issues & Solutions

### Issue: "Unauthorized" Error
**Solution:** 
- Verify your token is valid and not expired
- Check Authorization header format: `Bearer YOUR_TOKEN`
- Login again to get fresh token

### Issue: "Admin access required"
**Solution:**
- Run promote endpoint first: `POST /api/admin/promote`
- Use `ADMIN_PROMOTE_TOKEN` from `.env`
- Verify your user role is "admin" in database

### Issue: Empty Response or No Data
**Solution:**
- Run database seed script: `node addSampleData.js`
- Check MongoDB connection in server logs
- Verify `MONGODB_URI` in `.env`

### Issue: Image Upload Fails
**Solution:**
- Use `multipart/form-data` content type
- Check Cloudinary credentials in `.env`
- File size should be under 10MB

### Issue: Email Not Sent
**Solution:**
- Check Nodemailer config in `.env`
- Verify Brevo API credentials
- Check server logs for email errors

---

## 🎯 Quick Test Workflow

1. **Start Server** → Test health check
2. **Get Token** → Login to frontend, copy token
3. **Test Public APIs** → Get all rooms, single room
4. **Test User APIs** → Get user data, create booking
5. **Promote to Admin** → Use promote endpoint
6. **Test Admin APIs** → Dashboard stats, all data
7. **Test CRUD** → Create, update, delete hotel/room

---

## 📝 Notes

- **Base URL:** `http://localhost:3000`
- **Port:** Default 3000 (check `.env` for custom port)
- **Token Expiry:** Clerk tokens expire after 1 hour
- **Database:** MongoDB with Mongoose
- **Image Storage:** Cloudinary
- **Email:** Nodemailer with Brevo SMTP

---

## 🚀 Export Postman Collection

Save this as a Postman Collection JSON for quick import:
1. Copy all the requests above
2. In Postman: Collection → Import → Paste
3. Update `{{base_url}}` variable
4. Add your token in Collection Authorization

**Happy Testing! 🎉**
