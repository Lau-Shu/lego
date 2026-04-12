
// current sales on the page
let currentSales = [];

// instantiate the selectors
const selectShowSales = document.querySelector('#show-select-sales');
const selectLegoSetId = document.querySelector('#sales-id-input');
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
      //`https://lego-api-blue.vercel.app/sales?id=${selectLegoSetId.value}`
      `https://lego-vercel-myapi.vercel.app/sales/search?legoSetId=${selectLegoSetId.value}`
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
      <div class="sale-item" id="${sale.uuid}">
        <div class="sale-info">
          <a href="${sale.link}" target="_blank" class="sale-link">${sale.title}</a>
          <span class="sale-price">${sale.price.amount}€</span>
        </div>
      </div>
    `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionSales.innerHTML = '<h2>Sales Links</h2>';
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

const updateSales = async () => {
  if (!selectLegoSetId || !selectLegoSetId.value.trim()) {
    return;
  }

  const sales = await fetchSales();
  if (!sales || !sales.result || sales.result.length === 0) {
    spanNbSales.innerHTML = '0';
    spanAverageSalePrice.innerHTML = '0€';
    spanP5Value.innerHTML = '0€';
    spanP25Value.innerHTML = '0€';
    spanP50Value.innerHTML = '0€';
    spanLifetimeValue.innerHTML = '0 days';
    sectionSales.innerHTML = '<p>Aucune vente trouvée pour cet identifiant.</p>';
    return;
  }

  let prices = [];
  let timestamps = [];

  for (const sale of sales.result) {
    prices.push(parseInt(sale.price.amount, 10));
    timestamps.push(sale.published);
  }

  // Update number of sales
  spanNbSales.innerHTML = sales.result.length.toString();

  // Calculate and update average price
  const avgPrice = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
  spanAverageSalePrice.innerHTML = `${avgPrice}€`;

  // Calculate and update price percentiles
  prices.sort((a, b) => a - b);
  const p5Value = prices[Math.floor(prices.length * 0.05)] || 0;
  const p25Value = prices[Math.floor(prices.length * 0.25)] || 0;
  const p50Value = prices[Math.floor(prices.length * 0.5)] || 0;
  spanP5Value.innerHTML = `${p5Value}€`;
  spanP25Value.innerHTML = `${p25Value}€`;
  spanP50Value.innerHTML = `${p50Value}€`;

  // Calculate and update lifetime
  const oldest_sale_timestamp = Math.min(...timestamps);
  const lifetimeValue = Math.floor((Date.now() - oldest_sale_timestamp) / (1000 * 60 * 60 * 24));
  spanLifetimeValue.innerHTML = `${lifetimeValue} days`;

  setCurrentSales(sales);
  renderSales(sales.result);
};

document.addEventListener('DOMContentLoaded', () => {
  // Attach event listener after DOM is loaded
  selectLegoSetId.addEventListener('keydown', async event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      await updateSales();
    }
  });

  // Initialize with empty state
  spanNbSales.innerHTML = '0';
  spanAverageSalePrice.innerHTML = '0€';
  spanP5Value.innerHTML = '0€';
  spanP25Value.innerHTML = '0€';
  spanP50Value.innerHTML = '0€';
  spanLifetimeValue.innerHTML = '0 days';
  sectionSales.innerHTML = '';
});
