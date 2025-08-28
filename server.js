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

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(enforce.HTTPS({ trustProtoHeader: true }));

app.use(cors());

// Add this before the catch-all route
app.get("/health", (req, res) => {
  console.log("Health check request received");
  const fs = require('fs');
  const buildPath = path.join(__dirname, "client/build");
  
  try {
    // Check if build directory exists
    const buildExists = fs.existsSync(buildPath);
    
    console.log(`Health check: buildExists=${buildExists}, port=${port}`);
    
    res.status(200).json({ 
      status: "OK", 
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
      buildExists: buildExists,
      port: port
    });
  } catch (error) {
    console.error("Health check error:", error);
    res.status(500).json({ 
      status: "ERROR", 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

if (process.env.NODE_ENV === "production") {
  const buildPath = path.join(__dirname, "client/build");
  console.log(`Serving static files from: ${buildPath}`);
  
  app.use(express.static(buildPath));

  app.get("*", function(req, res) {
    res.sendFile(path.join(buildPath, "index.html"));
  });
}

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

app.listen(port, '0.0.0.0', error => {
  if (error) throw error;
  console.log("Server running on port " + port);
  console.log("Server bound to 0.0.0.0 (all interfaces)");
});

app.get("/service-worker.js", (req, res) => {
  res.sendFile(path.resolve(__dirname, "..", "build", "service-worker.js"));
});
