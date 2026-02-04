const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cron = require("node-cron");
const session = require("express-session");
const passport = require("passport");
require("dotenv").config();

const { scrapeAll } = require("./scraper");
const Event = require("./models/Event");
const Subscription = require("./models/Subscription");
require("./auth"); // Google OAuth strategy

const app = express();

// --- Middleware ---
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000", credentials: true }));
app.use(express.json());

// --- Session + Passport ---
app.use(session({
  secret: process.env.SESSION_SECRET || "secret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === "production", // Secure cookies in production
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
  }
}));
app.use(passport.initialize());
app.use(passport.session());

// --- MongoDB connection (Mongoose v7+ syntax) ---
// Use MONGO_URI from env. If strictly localhost, use 127.0.0.1 for Node 17+
const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/sydney_events";
mongoose.connect(mongoUri)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// --- Middleware to protect routes ---
function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ error: "Unauthorized" });
}

// --- Routes ---
// Get all events
app.get("/events", async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Subscribe (email + consent)
app.post("/subscribe", async (req, res) => {
  try {
    const { email, consent, eventId } = req.body;
    const subscription = new Subscription({ email, consent, eventId });
    await subscription.save();
    res.json({ success: true, subscription });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Import event (protected)
app.post("/import", ensureAuth, async (req, res) => {
  try {
    const { eventId, importNotes } = req.body;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ error: "Event not found" });

    event.status = "imported";
    event.importedAt = new Date();
    event.importedBy = req.user.displayName;
    event.importNotes = importNotes || "";
    await event.save();

    res.json({ success: true, event });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Google OAuth ---
app.get("/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get("/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    // Redirect to frontend dashboard
    res.redirect(`${process.env.FRONTEND_URL || "http://localhost:3000"}/dashboard`);
  }
);

app.get("/auth/logout", (req, res) => {
  req.logout(() => {
    res.redirect(`${process.env.FRONTEND_URL || "http://localhost:3000"}/login`);
  });
});

// --- User info route (frontend can check login state) ---
app.get("/me", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ error: "Not logged in" });
  }
});

// --- Auto Scraping Job ---
cron.schedule("0 */6 * * *", async () => {
  console.log("🔄 Running scheduled scrape...");
  await scrapeAll();
});

// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
