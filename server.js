const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0";

// Database
require("./database");

// Routes
const ticketRoutes = require("./routes/tickets");

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static Files
app.use(express.static(path.join(__dirname, "public")));

// API
app.use("/api/tickets", ticketRoutes);

// Admin Page
app.get("/", (req, res) => {

    res.sendFile(path.join(__dirname, "public", "admin.html"));

});

// Ticket Verification
app.get("/ticket/:ticketId", (req, res) => {

    res.sendFile(path.join(__dirname, "public", "ticket.html"));

});

// Official Scanner Page
app.get("/scanner", (req, res) => {

    res.sendFile(path.join(__dirname, "public", "scanner.html"));

});

app.listen(PORT, HOST, () => {

    console.log("==================================");
    console.log("THE BUNKER PUB TICKET SYSTEM");
    console.log("==================================");
    console.log(`Localhost : http://localhost:${PORT}`);
    console.log(`Network   : http://${HOST}:${PORT}`);
    console.log("==================================");

});