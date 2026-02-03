const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  email: { type: String, required: true },
  consent: { type: Boolean, default: false },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
  subscribedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Subscription", subscriptionSchema);
