// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';


/**
Description of the available api
GET https://lego-api-blue.vercel.app/deals

Search for specific deals

This endpoint accepts the following optional query string parameters:

- `page` - page of deals to return
- `size` - number of deals to return

GET https://lego-api-blue.vercel.app/sales

Search for current Vinted sales for a given lego set id

This endpoint accepts the following optional query string parameters:

- `id` - lego set id to return
*/

// current deals on the page
let currentDeals = [];
let currentPagination = {};

// instantiate the selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const selectLegoSetIds = document.querySelector('#lego-set-id-select');
const sectionDeals= document.querySelector('#deals');
const spanNbDeals = document.querySelector('#nbDeals');
const selectFilterDiscount = document.querySelector('#filter-discount');
const selectFilterCommented = document.querySelector('#filter-commented');
const selectFilterHotDeals = document.querySelector('#filter-hot-deals');
const selectSort = document.querySelector('#sort-select');
const selectLegoSetId = document.querySelector('#lego-set-id-select');
const selectShowFavorite = document.querySelector('#show-favorite');

/**
 * Set global value
 * @param {Array} result - deals to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentDeals = ({result, meta}) => {
  currentDeals = result;
  currentPagination = meta;
};


/**
 * Fetch deals from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @return {Object}
 */
const fetchDeals = async (page = 1, size = 6) => {
  try {
    const response = await fetch(
      `https://lego-api-blue.vercel.app/deals?page=${page}&size=${size}`
    );
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return {currentDeals, currentPagination};
    }

    return body.data;
  } catch (error) {
    console.error(error);
    return {currentDeals, currentPagination};
  }
};

const fetchAllDeals = async (page = 1, size = 100000000) => {
  try {
    const response = await fetch(
      `https://lego-api-blue.vercel.app/deals?page=${page}&size=${size}`
    );
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return {currentDeals, currentPagination};
    }

    return body.data;
  } catch (error) {
    console.error(error);
    return {currentDeals, currentPagination};
  }
};

/**
 * Render list of deals
 * @param  {Array} deals
 */
const renderDeals = deals => {
  
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  const template = deals
    .map(deal => {
      return `
      <div class="deal" id=${deal.uuid}>
        <span>${deal.id}</span>
        <a href="${deal.link}" target="_blank">${deal.title}</a>
        <span>${deal.price}</span>
        <span
      </div>

      <label>
        <input 
          type="checkbox"
          class="favorite-checkbox"
          data-id="${deal.uuid}"
          ${isFavorite(deal.uuid) ? 'checked' : ''}
        >
        Favori
      </label>

    `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionDeals.innerHTML = '<h2>Deals</h2>';
  sectionDeals.appendChild(fragment);

  // Ajouter les favoris après le rendu des deals
  document.querySelectorAll('.favorite-checkbox').forEach(cb => {
    cb.addEventListener('change', e => {
      toggleFavorite(e.target.dataset.id);
    });
  }); 

};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderPagination = pagination => {
  const {currentPage, pageCount} = pagination;
  const options = Array.from(
    {'length': pageCount},
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');

  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};

/**
 * Render lego set ids selector
 * @param  {Array} lego set ids
 */
const renderLegoSetIds = deals => {
  const ids = getIdsFromDeals(deals);
  const options = `<option value="All">All</option>` + ids.map(id => 
    `<option value="${id}">${id}</option>`
  ).join('');


  selectLegoSetIds.innerHTML = options;
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderIndicators = pagination => {
  const {count} = pagination;

  spanNbDeals.innerHTML = count;
};

const render = (deals, pagination) => {  
  renderDeals(deals);
  renderPagination(pagination);
  renderIndicators(pagination);
  renderLegoSetIds(deals);
};

/**
 * Declaration of all Listeners
 */

/**
 * Select the number of deals to display
 */
selectShow.addEventListener('change', async (event) => {
  const deals = await fetchDeals(currentPagination.currentPage, parseInt(event.target.value));

  setCurrentDeals({result: deals.result, meta: deals.meta});
  render(currentDeals, currentPagination);
});

selectPage.addEventListener('change', async (event) => {
  const deals = await fetchDeals(parseInt(event.target.value), currentPagination.pageSize); 

  setCurrentDeals({result: deals.result, meta: deals.meta});
  render(currentDeals, currentPagination);
});

// Filter by discount
selectFilterDiscount.addEventListener('change', async () => {
  const deals = await fetchDeals(currentPagination.currentPage, currentPagination.pageSize);
  const deals_filtered = [];

  if (selectFilterDiscount.checked === true) {
    for (let deal of deals.result) {
      if (deal.discount > 20) {
        deals_filtered.push(deal);
      }
    }
  }
  if (deals_filtered.length > 0) {
    setCurrentDeals({result: deals_filtered, meta: deals.meta});
    // meta = infos sur la pagination donc je peux réutiliser les mêmes infos que pour les deals non filtrés
  } else {
    console.log("No deal found with the selected discount filters");
    setCurrentDeals({result: deals.result, meta: deals.meta});
  }

  render(currentDeals, currentPagination);
});

// Filter by number of comments
selectFilterCommented.addEventListener('change', async () => {
  const deals = await fetchDeals(currentPagination.currentPage, currentPagination.pageSize);
  const deals_filtered = [];

  if (selectFilterCommented.checked === true) {
    for (let deal of deals.result) {
      if (deal.comments > 5) {
        deals_filtered.push(deal);
      }
    }
  }
  if (deals_filtered.length > 0) {
    setCurrentDeals({result: deals_filtered, meta: deals.meta});
    // meta = infos sur la pagination donc je peux réutiliser les mêmes infos que pour les deals non filtrés
  } else {
    console.log("No deal found with the selected comment filters");
    setCurrentDeals({result: deals.result, meta: deals.meta});
  }

  render(currentDeals, currentPagination);
});

// Filter by hot deals
selectFilterHotDeals.addEventListener('change', async () => {
  const deals = await fetchDeals(currentPagination.currentPage, currentPagination.pageSize);
  const deals_filtered = [];

  if (selectFilterHotDeals.checked === true) {
    for (let deal of deals.result) {
      if (deal.temperature > 100) {
        deals_filtered.push(deal);
      }
    }
  }
  if (deals_filtered.length > 0) {
    setCurrentDeals({result: deals_filtered, meta: deals.meta});
    // meta = infos sur la pagination donc je peux réutiliser les mêmes infos que pour les deals non filtrés
  } else {
    console.log("No deal found with the selected hot deals filters");
    setCurrentDeals({result: deals.result, meta: deals.meta});
  }

  render(currentDeals, currentPagination);
});

// Sort by price or date
selectSort.addEventListener('change', async (event) => {
  const deals = await fetchDeals(currentPagination.currentPage, currentPagination.pageSize);

  if (event.target.value === "price-asc") {
    deals.result.sort((a, b) => a.price - b.price);
  } else if (event.target.value === "price-desc") {
    deals.result.sort((a, b) => b.price - a.price);
  } else if (event.target.value === "date-asc") {
    deals.result.sort((a, b) => a.published - b.published);
  } else if (event.target.value === "date-desc") {
    deals.result.sort((a, b) => b.published - a.published);
  }

  setCurrentDeals({ result: deals.result, meta: deals.meta });
  render(currentDeals, currentPagination);
});

selectLegoSetId.addEventListener('change', (event) => {
  const deals = currentDeals;

  // Cas "All"
  if (event.target.value === "All") {
    setCurrentDeals({result: deals.result, meta: deals.meta});
    render(currentDeals, currentPagination);
    renderLegoSetIds(currentDeals);
    return;
  }

  // Filtrage
  const deals_filtered = deals.filter(deal => 
    deal.id === parseInt(event.target.value)
  );

  // Mise à jour du state
  setCurrentDeals(deals_filtered, currentPagination);

  // Render
  render(currentDeals, currentPagination);
  renderLegoSetIds(currentDeals);

  // Indicateur
  document.getElementById("nbDeals").innerHTML = currentDeals.result.length;
});

// Show only favorites
selectShowFavorite.addEventListener('change', async () => {
  const deals = await fetchDeals(
    currentPagination.currentPage,
    currentPagination.pageSize
  );

  let deals_filtered = deals.result;

  if (selectShowFavorite.checked) {
    const favorites = getFavorites();

    deals_filtered = deals.result.filter(deal =>
      favorites.includes(deal.uuid)
    );
  }

  setCurrentDeals({ result: deals_filtered, meta: deals.meta });
  render(currentDeals, currentPagination);
});

document.addEventListener('DOMContentLoaded', async () => {
  const deals = await fetchDeals();

  setCurrentDeals({result: deals.result, meta: deals.meta});
  render(currentDeals, currentPagination);
});

// Favorites
function getFavorites() {
  return JSON.parse(localStorage.getItem("favorites")) || [];
}

function toggleFavorite(id) {
  let favs = getFavorites();

  if (favs.includes(id)) {
    favs = favs.filter(f => f !== id);
  } else {
    favs.push(id);
  }

  localStorage.setItem("favorites", JSON.stringify(favs));
}

function isFavorite(id) {
  return getFavorites().includes(id);
}