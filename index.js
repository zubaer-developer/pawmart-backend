const express = require("express");
const cors = require("cors");

// app initialize
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("PawMart Server is Running");
});

// Export the app for Vercel
module.exports = app;

// Start server for local testing
if (require.main === module) {
  app.listen(port, () => {
    console.log(`PawMart Server is running on port ${port}`);
  });
}
