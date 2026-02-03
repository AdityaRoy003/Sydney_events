const axios = require("axios");
const cheerio = require("cheerio");
const Event = require("./models/Event");

// --- Scraper for Eventbrite ---
async function scrapeEventbrite() {
  const url = "https://www.eventbrite.com.au/d/australia--sydney/events/";
  try {
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      }
    });
    const $ = cheerio.load(data);

    const events = [];
    $(".discover-vertical-event-card").each((i, el) => {
      const linkElement = $(el).find("a.event-card-link");
      const title = linkElement.find("h3").text().trim();
      const link = linkElement.attr("href");
      const image = $(el).find("img.event-card-image").attr("src");

      // Date and Venue seem to be in p tags within .event-card-details
      // The first p is usually date, second is venue
      const date = $(el).find(".event-card-details p").first().text().trim();
      const venue = $(el).find(".event-card-details p").eq(1).text().trim();

      if (title && link) {
        events.push({
          title,
          date,
          venue: venue || "Sydney",
          city: "Sydney",
          description: "",
          category: "General",
          image: image || "",
          source: "Eventbrite",
          url: link.startsWith("http") ? link : `https://www.eventbrite.com.au${link}`,
          lastScraped: new Date()
        });
      }
    });

    console.log(`Eventbrite: Found ${events.length} events`);
    await upsertEvents(events);
  } catch (err) {
    console.error("Eventbrite scrape failed:", err.message);
  }
}

// --- Scraper for Meetup ---
async function scrapeMeetup() {
  const url = "https://www.meetup.com/find/events/?allMeetups=false&radius=5&userFreeform=sydney";
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const events = [];

    // Look for JSON-LD script
    $('script[type="application/ld+json"]').each((i, el) => {
      try {
        const json = JSON.parse($(el).html());
        // JSON-LD can be an array or object. We expect an array of events.
        const items = Array.isArray(json) ? json : [json];

        items.forEach(item => {
          if (item["@type"] === "Event") {
            const startDate = new Date(item.startDate);
            // Format date nicely: "Fri, Feb 6, 7:00 PM"
            const dateStr = startDate.toLocaleDateString('en-US', {
              weekday: 'short', month: 'short', day: 'numeric',
              hour: 'numeric', minute: '2-digit'
            });

            events.push({
              title: item.name,
              date: dateStr,
              venue: item.location?.address?.name || item.location?.name || "Sydney",
              city: "Sydney",
              description: item.description?.substring(0, 200) + "..." || "",
              category: "Meetup",
              image: item.image || "",
              source: "Meetup",
              url: item.url,
              lastScraped: new Date()
            });
          }
        });
      } catch (e) {
        // Ignore parse errors for non-event scripts
      }
    });

    console.log(`Meetup: Found ${events.length} events (via JSON-LD)`);
    await upsertEvents(events);
  } catch (err) {
    console.error("Meetup scrape failed:", err.message);
  }
}

// --- Upsert Logic (detect new/updated/inactive) ---
async function upsertEvents(events) {
  for (let ev of events) {
    const existing = await Event.findOne({ url: ev.url });
    if (!existing) {
      ev.status = "new";
      await Event.create(ev);
    } else {
      // Compare fields for updates
      let changed = false;
      ["title", "date", "venue", "description"].forEach(field => {
        if (ev[field] && ev[field] !== existing[field]) {
          existing[field] = ev[field];
          changed = true;
        }
      });
      existing.lastScraped = new Date();
      if (changed) existing.status = "updated";
      await existing.save();
    }
  }

  // Mark inactive events (not scraped this round)
  const urls = events.map(e => e.url);
  await Event.updateMany(
    { url: { $nin: urls }, city: "Sydney" },
    { status: "inactive" }
  );
}

async function scrapeAll() {
  await scrapeEventbrite();
  await scrapeMeetup();
}

module.exports = { scrapeAll };
