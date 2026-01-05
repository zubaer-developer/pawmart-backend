const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// app initialize
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Testing route
app.get("/", (req, res) => {
  res.send({
    message: "Server is working perfectly!",
    timestamp: new Date(),
  });
});

// MongoDB Connection URI
const uri = process.env.MONGODB_URI;

// Create MongoDB Client
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Define collection
let database, usersCollection, listingsCollection, ordersCollection;

async function run() {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Connected to MongoDB successfully!");

    // Database and Collections
    database = client.db("pawmartDB");
    usersCollection = database.collection("users");
    listingsCollection = database.collection("listings");
    ordersCollection = database.collection("orders");
  } catch (err) {
    console.log("Error connecting to MongoDB:", err);
  }
}
run().catch(console.dir);

// Middleware to ensure DB is connected before handling requests
app.use((req, res, next) => {
  if (!listingsCollection && req.path !== "/") {
    return res.status(503).send("Database connection not established yet.");
  }
  next();
});

// ============== LISTINGS API ==============

// Add new listing
app.post("/listings", async (req, res) => {
  try {
    const listing = req.body;

    // Add created timestamp
    listing.createdAt = new Date();

    const result = await listingsCollection.insertOne(listing);
    res.status(201).json({
      success: true,
      message: "Listing created successfully",
      insertedId: result.insertedId,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create listing",
      error: error.message,
    });
  }
});

// Get ALL listings
app.get("/listings", async (req, res) => {
  try {
    const listings = await listingsCollection.find().toArray();
    res.json({
      success: true,
      count: listings.length,
      data: listings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch listings",
      error: error.message,
    });
  }
});

// 2 Get SINGLE listing by ID
app.get("/listings/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const listing = await listingsCollection.findOne(query);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    res.json({
      success: true,
      data: listing,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch listing",
      error: error.message,
    });
  }
});

// Update listing by ID
app.put("/listings/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const updatedData = req.body;
    // Remove _id from update data if present
    delete updatedData._id;
    // Add updated timestamp
    updatedData.updatedAt = new Date();

    const result = await listingsCollection.updateOne(query, {
      $set: updatedData,
    });

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    res.json({
      success: true,
      message: "Listing updated successfully",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update listing",
      error: error.message,
    });
  }
});

// Delete listing by ID
app.delete("/listings/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };

    const result = await listingsCollection.deleteOne(query);

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    res.json({
      success: true,
      message: "Listing deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete listing",
      error: error.message,
    });
  }
});

// Get recent 6 listings (for homepage)
app.get("/listings-recent", async (req, res) => {
  try {
    const listings = await listingsCollection
      .find()
      .sort({ createdAt: -1 })
      .limit(4)
      .toArray();

    res.json({
      success: true,
      count: listings.length,
      data: listings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch recent listings",
      error: error.message,
    });
  }
});

// ============== ORDERS API ==============

// Create new order
app.post("/orders", async (req, res) => {
  try {
    const order = req.body;
    // Add timestamps and default status
    order.status = "pending";
    order.createdAt = new Date();

    const result = await ordersCollection.insertOne(order);
    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      insertedId: result.insertedId,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to place order",
      error: error.message,
    });
  }
});

// Get all orders (Admin)
app.get("/orders", async (req, res) => {
  try {
    const orders = await ordersCollection
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
});

// Get orders by user email
app.get("/orders/user/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const query = { email: email };

    const orders = await ordersCollection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user orders",
      error: error.message,
    });
  }
});

// Update order status
app.put("/orders/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const updatedData = req.body;

    delete updatedData._id;
    updatedData.updatedAt = new Date();

    const result = await ordersCollection.updateOne(query, {
      $set: updatedData,
    });

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      message: "Order updated successfully",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update order",
      error: error.message,
    });
  }
});

// Delete order
app.delete("/orders/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };

    const result = await ordersCollection.deleteOne(query);

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete order",
      error: error.message,
    });
  }
});

// ============== USERS API ==============

// Check if user is admin
app.get("/users/admin/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const query = { email: email };
    const user = await usersCollection.findOne(query);

    const isAdmin = user?.role === "admin";
    res.json({
      admin: isAdmin,
    });
  } catch (error) {
    res.status(500).json({
      admin: false,
      error: error.message,
    });
  }
});

// Save new user to database
app.post("/users", async (req, res) => {
  try {
    const user = req.body;
    const existingUser = await usersCollection.findOne({
      email: user.email,
    });
    if (existingUser) {
      return res.json({
        success: true,
        message: "User already exists",
        insertedId: null,
      });
    }
    // Add default role
    user.role = "user";
    user.createdAt = new Date();

    const result = await usersCollection.insertOne(user);
    res.status(201).json({
      success: true,
      message: "User created successfully",
      insertedId: result.insertedId,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create user",
      error: error.message,
    });
  }
});

// Get all users (Admin only)
app.get("/users", async (req, res) => {
  try {
    const users = await usersCollection.find().toArray();
    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
});

// Get single user by email
app.get("/users/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const query = { email: email };
    const user = await usersCollection.findOne(query);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
      error: error.message,
    });
  }
});

// Make user admin
app.put("/users/admin/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };

    const result = await usersCollection.updateOne(query, {
      $set: { role: "admin" },
    });

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User promoted to admin successfully",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update user role",
      error: error.message,
    });
  }
});

// Delete user
app.delete("/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };

    const result = await usersCollection.deleteOne(query);

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: error.message,
    });
  }
});

// Start server for local testing
if (require.main === module) {
  app.listen(port, () => {
    console.log(`PawMart Server is running on port ${port}`);
  });
}

// Export the app for Vercel
module.exports = app;
