import * as cheerio from 'cheerio'; 
import { v5 as uuidv5 } from 'uuid';

// Faire document.querySelector("div.js-threadList article div.js-vue3').getAttribute('data-vue3')

// const extractSetId = title => ...

// const formatImage = image => ...


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
          .attr('data-vue3')
      );

      console.log(JSON.stringify(data, null, 2));

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
const scrape = async url => {
  const response = await fetch(url);

  if (response.ok) {
    const body = await response.text();

    return parse(body);
  }

  console.error(response);

  return null;
};

export {scrape};