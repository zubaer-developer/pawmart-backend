const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

// app initialize
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

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

    // Testing route
    app.get("/", (req, res) => {
      res.send("PawMart Server is Running and connected to MongoDB");
    });
  } catch (err) {
    console.error(err);
  }
}
run().catch(console.dir);

// Start server for local testing
if (require.main === module) {
  app.listen(port, () => {
    console.log(`PawMart Server is running on port ${port}`);
  });
}
