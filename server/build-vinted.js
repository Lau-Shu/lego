import fs from "fs";
import { scrape as scrapeDeals } from "./websites/dealabs.js";
import { scrape as scrapeVinted } from "./websites/vinted.js";

/* =========================================================
   CONFIG
========================================================= */

const DEALS_URL = "https://www.dealabs.com/groupe/lego";
const LIMIT_IDS = 24;

/* =========================================================
   HELPERS
========================================================= */

function extractSetId(value) {
  const match = value?.match(/\b\d{5}\b/);
  return match ? match[0] : null;
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/* =========================================================
   1. GET LEGO IDS FROM DEALS
========================================================= */

const fetchAllDealIds = async () => {
  const deals = await scrapeDeals(DEALS_URL);

  const ids = deals
    .map(deal => extractSetId(deal.title))
    .filter(Boolean);

  // remove duplicates
  return [...new Set(ids)].slice(0, LIMIT_IDS);
};

/* =========================================================
   2. BUILD VINTED DATASET
========================================================= */

const build = async () => {
  console.log("🚀 Starting build...");

  const legoSetIds = await fetchAllDealIds();

  console.log("📦 LEGO IDs:", legoSetIds);

  const output = {};

  for (const id of legoSetIds) {
    console.log(`🔎 Scraping Vinted for ${id}...`);

    try {
      const results = await scrapeVinted(id);

      output[id] = (results || []).map(item => ({
        id: item.uuid || `${id}_${Math.random().toString(36).slice(2)}`,
        title: item.title,
        price: item.price,
        link: item.link,
        photo: item.photo || null,
        published: item.published || null
      }));

    } catch (err) {
      console.log(`❌ Error for ${id}:`, err.message);
      output[id] = [];
    }

    // anti-ban / respect API
    await sleep(800);
  }

  /* =========================================================
     3. WRITE FILE
  ========================================================= */

  fs.writeFileSync(
    "./sources/myVinted.json",
    JSON.stringify(output, null, 2)
  );

  console.log("✅ myVinted.json generated successfully!");
};

/* =========================================================
   RUN
========================================================= */

build();