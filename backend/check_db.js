const mongoose = require("mongoose");
require("dotenv").config();
const Event = require("./models/Event");

mongoose.connect(process.env.MONGO_URI.replace("localhost", "127.0.0.1"))
    .then(async () => {
        const total = await Event.countDocuments();
        const newEvents = await Event.countDocuments({ status: "new" });
        const updated = await Event.countDocuments({ status: "updated" });
        const inactive = await Event.countDocuments({ status: "inactive" });

        console.log("--------------------------------------------------");
        console.log(`Total Events: ${total}`);
        console.log(`New: ${newEvents}`);
        console.log(`Updated: ${updated}`);
        console.log(`Inactive: ${inactive}`);
        console.log("--------------------------------------------------");

        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
