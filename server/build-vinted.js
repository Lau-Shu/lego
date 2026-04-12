import fs from "fs";
import DEALS from "./sources/deals.json" with { type: "json" };
import { scrape as scrapeVinted } from "./websites/vinted.js";

/* =========================================================
   CONFIG
========================================================= */

const MAX_IDS = 500;
const DELAY_MS = 800;

/* =========================================================
   HELPERS
========================================================= */

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/* =========================================================
   1. GET LEGO IDS FROM DEALS JSON
========================================================= */

const getLegoIdsFromDeals = () => {
  console.log("🔎 Extracting LEGO IDs from deals.json...");

  const ids = DEALS
    .map((deal) => deal.id)
    .filter(Boolean);

  const uniqueIds = [...new Set(ids)].slice(0, MAX_IDS);

  console.log(`📦 Found ${uniqueIds.length} LEGO IDs`);

  return uniqueIds;
};

/* =========================================================
   2. BUILD VINTED DATASET
========================================================= */

const buildVintedDataset = async () => {
  console.log("🚀 Starting Vinted build...");

  const legoSetIds = getLegoIdsFromDeals();

  const output = {};

  for (let i = 0; i < legoSetIds.length; i++) {
    const id = legoSetIds[i];

    console.log(`🔎 [${i + 1}/${legoSetIds.length}] Vinted scrape for LEGO ${id}`);

    try {
      const results = await scrapeVinted(id);

      output[id] = (results || []).map((item) => ({
        id: item.uuid || `${id}_${Math.random().toString(36).slice(2, 8)}`,
        title: item.title,
        price: item.price,
        link: item.link,
        photo: item.photo || null,
        published: item.published || null,
      }));
    } catch (err) {
      console.log(`❌ Error for ${id}:`, err.message);
      output[id] = [];
    }

    // anti-ban / rate limit
    await sleep(DELAY_MS);
  }

  /* =========================================================
     3. SAVE FILE
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

buildVintedDataset();