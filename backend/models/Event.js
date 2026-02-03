const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: String,
  date: String,
  time: String,
  venue: String,
  address: String,
  city: { type: String, default: "Sydney" },
  description: String,
  category: String,
  image: String,
  source: String,
  url: { type: String, unique: true },
  lastScraped: Date,
  status: { type: String, enum: ["new", "updated", "inactive", "imported"], default: "new" },
  importedAt: Date,
  importedBy: String,
  importNotes: String
});

module.exports = mongoose.model("Event", eventSchema);
