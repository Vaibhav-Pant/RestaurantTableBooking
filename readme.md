# 🍽️ **Restaurant Table Booking Backend**

A scalable backend system for managing restaurant table reservations, built with Node.js, Express, MongoDB, and Redis (BullMQ). It supports secure user authentication, seat availability checks, and async email notifications for confirmed bookings.

## 🚀 **Tech Stack**

- **Backend:** Node.js, Express
- **Database:** MongoDB (with Mongoose)
- **Authentication:** JWT (Access + Refresh Tokens), bcrypt
- **Queueing:** BullMQ with Redis (Upstash)
- **Email Service:** Resend
- **Deployment:** Vercel (API route handling)

## 🔐 **Environment Variables**

Create a `.env` file with the following:

```env
PORT=3000
CORS_ORIGIN=<origin>
DB_NAME=<name of database>
MONGODB_URI=<your_mongodb_connection_string>
REDIS_URL=<your_upstash_redis_url>
RESEND_API_KEY=<your_resend_api_key>
ACCESS_TOKEN_SECRET=<your_access_token_secret>
ACCESS_TOKEN_EXPIRY=<your_access_token_secret_expiry>
REFRESH_TOKEN_SECRET=<your_refresh_token_secret>
REFRESH_TOKEN_EXPIRY=<your_refresh_token_secret_expiry>
```

## 📁 **Project Structure**

```plaintext
├── api/
│   └── index.js               # Express entry point for Vercel
├── config/
│   ├── db.js
│   └── redis.js
├── controllers/
│   ├── user.controller.js
│   ├── restaurant.controller.js
│   └── reservation.controller.js
├── models/
│   ├── User.js
│   ├── Restaurant.js
│   └── Reservation.js
├── queue/
│   └── notificationQueue.js
├── routes/
│   ├── user.routes.js
│   ├── restaurant.routes.js
│   └── reservation.routes.js
├── middlewares/
│   └── auth.middleware.js
├── utils/
│   └── resendClient.js
├── workers/
│   └── notificationWorker.js            # BullMQ worker (to be hosted separately)
├── app.js
├── .env
└── README.md
```

## 🔑 **Authentication API**

### **Register**

```http
POST /api/v1/user/register
```

**Request Body:**

```json
{
  "username": "testing",
  "email": "testing@example.com",
  "password": "securePassword"
}
```

### **Login**

```http
POST /api/v1/user/login
```

**Request Body:**

```json
{
  "email": "testing@example.com",
  "password": "securePassword"
}
```

**Returns**: Access and refresh tokens.

## 🍴 **Restaurant APIs**

### **Add Restaurant**

```http
POST /api/v1/restaurant
```

**Request Body:**

```json
{
  "name": "Saffron Lounge",
  "location": "Delhi",
  "cuisine": "North Indian",
  "totalCapacity": 100
}
```

### **Get All Restaurants**

```http
GET /api/v1/restaurant
```

## 📅 **Reservation APIs**

All reservation routes require an access token in the Authorization header.

### **Create Reservation**

```http
POST /api/v1/reservations
```

**Request Body:**

```json
{
  "restaurantId": "restaurant_id_here",   // Get id from /getAllRestaurant API call
  "bookingDate": "2025-04-15",
  "bookingTime": "19:30",
  "numberOfGuests": 4
}
```

**Sends confirmation email on success.**

### **Get User Reservations**

```http
GET /api/v1/reservations?userId=user_id_here
```

### **Cancel Reservation**

```http
DELETE /api/v1/reservations/:reservationId
```

## 📦 **Queue & Email Notifications**

- Reservation confirmation emails are sent using the **Resend API**.
- Originally used **BullMQ with Redis (Upstash)** for queueing.
- Queue worker (`worker.js`) is separated and must be run on a long-running service like **Render**, **Railway**, or **EC2**.
- For now, email sending is done directly in the controller.

## 🌐 **Deployment Notes**

- Hosted on **Vercel**.
- Express `index.js` moved to `/api` to work as a Vercel serverless function.
- Redis via **Upstash** used for queueing.
- Worker (`worker.js`) not running on Vercel – it must be hosted separately.
- Email is sent directly for now until the async worker is deployed.

## 🤝 **Contributing**

Contributions are welcome! Feel free to:

- Fork this repo
- Make your changes
- Submit a pull request

## ⭐ **Support**

If you like this project, please consider giving it a ⭐ on GitHub. It really helps and keeps the motivation going!
```

You can now paste this into your GitHub `README.md`. This version includes copy-friendly code blocks, proper indentation, and clear section headings for readability.