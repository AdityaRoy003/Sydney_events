const mongoose = require("mongoose");
require("dotenv").config();
const Event = require("./models/Event");

mongoose.connect(process.env.MONGO_URI.replace("localhost", "127.0.0.1"))
    .then(async () => {
        const sources = await Event.aggregate([
            { $group: { _id: "$source", count: { $sum: 1 } } }
        ]);
        console.log("Event Sources Distribution:", JSON.stringify(sources, null, 2));
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
