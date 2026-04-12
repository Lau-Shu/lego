import * as cheerio from 'cheerio'; 
import { v5 as uuidv5 } from 'uuid';

// Faire document.querySelector("div.js-threadList article div.js-vue3').getAttribute('data-vue3')


function formatImage (mainImage) {
  const {path, name, slotId} = mainImage;
  return `https://static-pepper.dealabs.com/${path}/${name}/re/300x300/qt/60/${name}.jpg`;
}

function extractSetId(value, regex = /(\d{5})/) {
  const re = new RegExp(regex);
  const matches = value.trim().replace(/\s/g, ' ').match(re);
  
  if (matches) {
    return matches[1];
  }
  return '';
};

/**
 * Parse webpage data response
 * @param  {String} data - html response
 * @return {Object} deal
 */
const parse = data => {
  const $ = cheerio.load(data, {'xmlMode': true});

  return $('div.js-threadList article') // du CSS, on a un JSON dans un attribut data-vue3, on va le parser pour récupérer les infos dont on a besoin
    .map((i, element) => {
      const link = $(element)
        .find('a[data-t="threadLink"]')
        .attr('href'); 

      const data = JSON.parse($(element)
          .find('div.js-vue3') 
          .attr('data-vue3'));

      // console.log(JSON.stringify(data, null, 2));

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

      return {
        id,
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
 * @param {String} url - url to parse and scrape
 * @returns 
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

export {scrape};