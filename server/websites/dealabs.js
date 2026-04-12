import * as cheerio from 'cheerio';
import { v5 as uuidv5 } from 'uuid';

// Namespace fixe (obligatoire pour uuidv5)
const NAMESPACE = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';

// Faire document.querySelector("div.js-threadList article div.js-vue3').getAttribute('data-vue3')

function formatImage(mainImage) {
  const { path, name, slotId } = mainImage;
  return `https://static-pepper.dealabs.com/${path}/${name}/re/300x300/qt/60/${name}.jpg`;
}

// 🔒 gardé tel quel (comme ton prof)
function extractSetId(value, regex = /(\d{5})/) {
  const re = new RegExp(regex);
  const matches = value.trim().replace(/\s/g, ' ').match(re);

  if (matches) {
    return matches[1];
  }
  return '';
}

/**
 * Parse webpage data response
 */
const parse = data => {
  const $ = cheerio.load(data, { xmlMode: true });

  return $('div.js-threadList article')
    .map((i, element) => {
      const link = $(element)
        .find('a[data-t="threadLink"]')
        .attr('href');

      const data = JSON.parse(
        $(element)
          .find('div.js-vue3')
          .attr('data-vue3')
      );

      const thread = data.props.thread;

      const retail = thread.nextBestPrice;
      const price = thread.price;
      const discount = parseInt((retail - price) / retail * 100);
      const temperature = +thread.temperature;
      const photo = formatImage(thread.mainImage);
      const comments = +thread.commentCount;
      const published = thread.publishedAt;
      const title = thread.title;
      const id = extractSetId(title);
      const uuid = uuidv5(link, NAMESPACE);

      return {
        uuid,        // ✅ ajouté
        id,          // (prof)
        photo,
        title,
        link,
        price,
        retail,
        discount,
        temperature,
        comments,
        published,
      };
    })
    .get();
};

/**
 * Scrape a given url page
 */
const scrape = async (baseUrl) => {
  try {
    let allDeals = [];
    const maxPages = 6;

    for (let page = 1; page <= maxPages; page++) {
      const url = `${baseUrl}?page=${page}`;

      const response = await fetch(url);

      if (!response.ok) {
        console.error(`Page ${page} failed`);
        continue;
      }

      const body = await response.text();
      const deals = parse(body);

      allDeals = allDeals.concat(deals);
    }

    return allDeals;

  } catch (error) {
    console.error(error);
    return [];
  }
};

export { scrape };