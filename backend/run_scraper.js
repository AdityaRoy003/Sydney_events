const mongoose = require("mongoose");
require("dotenv").config();
const { scrapeAll } = require("./scraper");

mongoose.connect(process.env.MONGO_URI.replace("localhost", "127.0.0.1"))
    .then(async () => {
        console.log("Starting manual scrape...");
        try {
            await scrapeAll();
            console.log("Scrape completed successfully.");
        } catch (err) {
            console.error("Scrape failed:", err);
        }
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
