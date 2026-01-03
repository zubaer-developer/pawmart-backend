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

async function run() {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Connected to MongoDB successfully!");

    // Database and Collections
    const database = client.db("pawmartDB");
    const usersCollection = database.collection("users");
    const listingsCollection = database.collection("listings");
    const ordersCollection = database.collection("orders");

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

    // Get all listings
    app.get("/listings", async (req, res) => {
      try {
        const listings = await listingsCollection.find().toArray();
        res.json({
          success: true,
          count: listings.length,
          data: listings,
        });

        // Get single listing by ID
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
      } catch (error) {
        res.status(500).json({
          success: false,
          message: "Failed to fetch listings",
          error: error.message,
        });
      }
    });
  } catch (err) {
    console.log("Error connecting to MongoDB:", err);
  }
}
run().catch(console.dir);

// Start server for local testing
if (require.main === module) {
  app.listen(port, () => {
    console.log(`PawMart Server is running on port ${port}`);
  });
}

// Export the app for Vercel
module.exports = app;
