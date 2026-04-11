import * as cheerio from 'cheerio'; 
//html côté serveur, en client on a querySelector, ici on utilise cheerio pour faire du parsing de html côté serveur
// le client charge des données alors que le serveur prend juste l'url, récupère le html en full string et la librairie va les retourner plus vite une fois scrappé
// Rq : querySelector ne montre que le premier élément correspondant
import { v5 as uuidv5 } from 'uuid';
/**
 * Parse webpage data response
 * @param  {String} data - html response
 * @return {Object} deal
 */
const parse = data => {
  const $ = cheerio.load(data, {'xmlMode': true});

  return $('div.prods a') // c'est des sélecteurs CSS, utilisé retrouver les éléments à mettre
    .map((i, element) => {
      const link = $(element)
        .attr('href'); // c'est des sélecteurs CSS

      const price = parseFloat(
        $(element)
          .find('span.prodl-prix span') // c'est des sélecteurs CSS
          .text()
      );

      const discount = Math.abs(parseInt(
        $(element)
          .find('span.prodl-reduc') // c'est des sélecteurs CSS
          .text()
      ));

      const id = $(element)
        .find('span.prodl-ref')
        .text();

      return {
        id,
        discount,
        link,
        price,
        'photo': $(element)
          .find('span.prodl-img img')
          .attr('src'),
        'title': $(element).attr('title'),
        'uuid': uuidv5(link, uuidv5.URL)
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