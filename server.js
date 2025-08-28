const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const enforce = require("express-sslify");
const compression = require("compression");

if (process.env.NODE_ENV !== "production") require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express();
const port = process.env.PORT || 7777;

// Add some debugging for Railway deployment
console.log(`Environment: ${process.env.NODE_ENV}`);
console.log(`Port: ${port}`);
console.log(`Current directory: ${__dirname}`);
console.log(`All environment variables:`, Object.keys(process.env).filter(key => key.includes('PORT') || key.includes('RAILWAY')).map(key => `${key}=${process.env[key]}`));

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(enforce.HTTPS({ trustProtoHeader: true }));

app.use(cors());

// Health check route - MUST come FIRST, before any catch-all routes
app.get("/health", (req, res) => {
  console.log("Health check request received");
  res.status(200).json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    port: port
  });
});

// Simple test endpoint
app.get("/test", (req, res) => {
  console.log("Test endpoint hit");
  console.log("Request headers:", req.headers);
  console.log("Request URL:", req.url);
  res.status(200).json({ message: "Server is responding!", timestamp: new Date().toISOString() });
});

// Payment route - also before catch-all
app.post("/payment", (req, res) => {
  const body = {
    source: req.body.token.id,
    amount: req.body.amount,
    currency: "usd"
  };

  stripe.charges.create(body, (stripeErr, stripeRes) => {
    if (stripeErr) {
      res.status(500).send({ error: stripeErr });
    } else {
      res.status(200).send({ success: stripeRes });
    }
  });
});

// Service worker route
app.get("/service-worker.js", (req, res) => {
  res.sendFile(path.resolve(__dirname, "..", "build", "service-worker.js"));
});

// Static files and catch-all route - MUST come LAST
if (process.env.NODE_ENV === "production") {
  const buildPath = path.join(__dirname, "client/build");
  console.log(`Serving static files from: ${buildPath}`);
  
  app.use(express.static(buildPath));

  app.get("*", function(req, res) {
    console.log(`Catch-all route hit: ${req.method} ${req.url}`);
    res.sendFile(path.join(buildPath, "index.html"));
  });
}

app.listen(port, error => {
  if (error) throw error;
  console.log("Server running on port " + port);
  console.log("Server bound to all interfaces");
});
