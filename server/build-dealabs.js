import { scrape } from './websites/dealabs.js';
import fs from 'fs';

const build = async () => {
  const deals = await scrape("https://www.dealabs.com/groupe/lego");

  fs.writeFileSync(
    './sources/deals.json',
    JSON.stringify(deals, null, 2)
  );
};

build();