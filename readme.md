# 🐾 PawMart - Backend API

This is the server-side application for PawMart, a Pet Adoption and E-commerce platform. It is built using Node.js, Express.js, and MongoDB to handle data management, authentication logic support, and API requests.

## 🚀 Live URL

- **Base API URL:** [https://pawmart-backend-beta.vercel.app](https://pawmart-backend-beta.vercel.app)

## 🛠️ Technologies Used

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (NoSQL)
- **Middleware:** CORS, Dotenv

## ✨ Key Features

- **RESTful API Architecture:** Clean and organized endpoints for Listings, Users, and Orders.
- **CRUD Operations:** Full Create, Read, Update, and Delete capabilities for data entities.
- **Database Management:** Efficient integration with MongoDB Atlas using the native MongoDB driver.
- **Search & Filter Logic:** Backend support for filtering data by category, price, and search terms.
- **Role Management:** Logic to distinguish and handle 'User' vs 'Admin' roles.
- **Secure Configuration:** Environment variable management for database credentials.

## 📦 NPM Packages

| Package   | Purpose                                      |
| :-------- | :------------------------------------------- |
| `express` | Web application framework for Node.js        |
| `mongodb` | Official MongoDB driver                      |
| `cors`    | Cross-Origin Resource Sharing middleware     |
| `dotenv`  | Loading environment variables from .env file |
| `nodemon` | Development utility for hot-reloading        |

## 📡 API Endpoints

### 🏠 Listings (Pets & Products)

- `GET /listings` - Retrieve all listings (supports search & filter queries)
- `GET /listings/:id` - Retrieve a specific listing by ID
- `GET /listings-recent` - Retrieve the 6 most recent listings
- `POST /listings` - Create a new listing
- `PUT /listings/:id` - Update an existing listing
- `DELETE /listings/:id` - Delete a listing

### 👤 Users

- `POST /users` - Save or update user information upon login/register
- `GET /users` - Retrieve all users (Admin access)
- `GET /users/:email` - Retrieve a specific user
- `GET /users/admin/:email` - Check if a user has Admin role
- `PUT /users/admin/:id` - Promote a user to Admin
- `DELETE /users/:id` - Delete a user

### 🛒 Orders & Adoptions

- `POST /orders` - Create a new order or adoption request
- `GET /orders` - Retrieve all orders (Admin access)
- `GET /orders/user/:email` - Retrieve orders for a specific user
- `PUT /orders/:id` - Update order status (Pending/Completed/Cancelled)
- `DELETE /orders/:id` - Delete an order

## ⚙️ Installation & Run Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/pawmart-backend.git
   cd pawmart-backend
   ```
