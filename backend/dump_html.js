const axios = require("axios");
const fs = require("fs");
require("dotenv").config();

async function debugScraper() {
    try {
        const url = "https://www.eventbrite.com.au/d/australia--sydney/events/";
        console.log(`Fetching ${url}...`);
        const { data } = await axios.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            }
        });
        fs.writeFileSync("debug_eventbrite.html", data);
        console.log("Dumped HTML to debug_eventbrite.html");
    } catch (err) {
        console.error("Failed to fetch:", err.message);
    }
}

debugScraper();
