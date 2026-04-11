
// current sales on the page
let currentSales = [];

// instantiate the selectors
const selectShowSales = document.querySelector('#show-select-sales');
// const selectPageSales = document.querySelector('#page-select-sales');
// const selectLegoSetIds = document.querySelector('#lego-set-id-select');
const sectionSales= document.querySelector('#sales');
const spanNbSales = document.querySelector('#nbSales');
const spanAverageSalePrice = document.querySelector('#averageSalePrice');
const spanP5Value = document.querySelector('#p5value');
const spanP25Value = document.querySelector('#p25value');
const spanP50Value = document.querySelector('#p50value');
const spanLifetimeValue = document.querySelector('#lifetimeValue');

/**
 * Set global value
 * @param {Array} 
 */

const setCurrentSales = (salesArray) => {
  currentSales = salesArray;
};

/**
 * Fetch sales from api
 * @return {Object}
 */
const fetchSales = async () => {
  try {
    const response = await fetch(
      `https://lego-api-blue.vercel.app/sales?id=${selectLegoSetId.value}`
    );
    const body = await response.json();
    if (body.success !== true) {
      console.error(body);
      return {currentSales};
    }

    return body.data;
  } catch (error) {
    console.error(error);
    return {currentSales};
  }
};

/**
 * Render list of sales
 * @param  {Array} sales
 */
const renderSales = sales => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  const template = sales
    .map(sale => {
      return `
      <div class="deal" id=${sale.uuid}>
        <a href="${sale.link}" target="_blank">${sale.title}</a>
        <span>${sale.price.amount}</span>
      </div>
    `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionSales.innerHTML = '<h2>Sales</h2>';
  sectionSales.appendChild(fragment);
};

/**
 * Render lego set ids selector
 * @param  {Array} lego set ids
 */
const renderLegoSetIdsSales = sales => {
  const ids = getIdsFromSales(sales);
  const options =
   ids.map(id => 
    `<option value="${id}">${id}</option>`
  ).join('');

  selectLegoSetIds.innerHTML = options;
};


/**
 * Declaration of all Listeners (sales)
 */

selectLegoSetId.addEventListener('change', async (event) => {
  if (event.target.value === "All") {
    return;
  }

  const sales = await fetchSales();

  // Number of sales
  // reset nb of sales
  spanNbSales.innerHTML = "0";
  let prices = [];
  let timestamps = [];

  for (const sale of sales.result) {
      spanNbSales.innerHTML = (parseInt(spanNbSales.innerHTML) + 1).toString();
      prices.push(parseInt(sale.price.amount));
      timestamps.push(sale.published);
  };

  // Sort the prices for the price values
  prices = prices.sort((a, b) => a - b);

  // Compute Average sale price
  const averagePrice = prices.reduce((acc, price) => acc + price, 0) / prices.length;
  spanAverageSalePrice.innerHTML = averagePrice.toFixed(2).toString();

  // P5
  const p5Value = prices[Math.floor(prices.length * 0.05)]; // floor gives the index of the biggest value up from 0th to the 5%-th value
  spanP5Value.innerHTML = p5Value.toString();

  // P25
  const p25Value = prices[Math.floor(prices.length * 0.25)];
  spanP25Value.innerHTML = p25Value.toString();

  // P50
  const p50Value = prices[Math.floor(prices.length * 0.5)];
  spanP50Value.innerHTML = p50Value.toString();


  // Lifetime value
  const oldest_sale_timestamp = Math.min(...timestamps);
  const lifetimeValue = Math.floor((Date.now() - oldest_sale_timestamp) / (1000 * 60 * 60 * 24)); // convert from ms to days
  spanLifetimeValue.innerHTML = lifetimeValue.toString() + " days";

  setCurrentSales(sales);
  renderSales(sales.result);
});

// Let's make : nb of sales, average, p5, p25, p50
// Also Lifetime value, link of sold items
