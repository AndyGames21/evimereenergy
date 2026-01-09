// Import Modules
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const path = require("path")
const routes = require("../src/routes/routes");
const pool = require("../config/db");

// Initialize Express App
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Views And Public Files
app.use(express.static(path.join(__dirname, "..", "..", "frontend", "public")));
app.set("views", path.join(__dirname, "..", ".." , "frontend", "views"));
app.set("view engine", "ejs");

// Routes
app.use("/", routes);
    
// Failback Route
app.get("/", (req, res) => {
  res.render("home", { title: "Home - Evimere Energy" });
});


// Start Server
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});

module.exports = app;