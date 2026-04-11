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
let currentSort = 'date-desc'; // Track current sort state

// instantiate the selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const selectLegoSetIds = document.querySelector('#lego-set-id-select');
const sectionDeals= document.querySelector('#deals');
const spanNbDeals = document.querySelector('#nbDeals');
const selectFilterDiscount = document.querySelector('#filter-discount');
const selectFilterCommented = document.querySelector('#filter-commented');
const selectFilterHotDeals = document.querySelector('#filter-hot-deals');
const selectLegoSetId = document.querySelector('#lego-set-id-select');
const selectShowFavorite = document.querySelector('#show-favorite');
const dealSearchInput = document.querySelector('#deal-search');
const btnSortPriceAsc = document.querySelector('#sort-price-asc-btn');
const btnSortPriceDesc = document.querySelector('#sort-price-desc-btn');
const btnSortDateAsc = document.querySelector('#sort-date-asc-btn');
const btnSortDateDesc = document.querySelector('#sort-date-desc-btn');

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
      <a href="examples-product-detail-page.html?id=${deal.uuid}" class="deal-card" id="${deal.uuid}">
        <img src="https://via.placeholder.com/300x190/FFD700/000000?text=Lego+Set+${deal.id}" alt="Lego Set ${deal.id}" class="deal-image">
        <div class="deal-body">
          <div>
            <h3 class="deal-title">${deal.title}</h3>
            <span class="deal-id">Set ID: ${deal.id}</span>
          </div>
          <span class="deal-price">${deal.price}€</span>
        </div>
        <label class="favorite-label">
          <input
            type="checkbox"
            class="favorite-checkbox"
            data-id="${deal.uuid}"
            ${isFavorite(deal.uuid) ? 'checked' : ''}
          />
          Favori
        </label>
      </a>
    `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionDeals.innerHTML = '<h2>Deals</h2>';
  sectionDeals.appendChild(fragment);

  // Stocker les deals actuels pour la page de détail
  sessionStorage.setItem('currentDeals', JSON.stringify(deals));

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
  updateSortButtonStates(currentSort);
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
  updateSortButtonStates(currentSort);
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
  updateSortButtonStates(currentSort);
});

// Search by title
if (dealSearchInput) {
  dealSearchInput.addEventListener('input', (event) => {
    const searchTerm = event.target.value.toLowerCase().trim();
    
    if (!searchTerm) {
      // If search is empty, reload all deals
      renderDeals(currentDeals);
      return;
    }
    
    // Filter deals by title
    const filteredDeals = currentDeals.filter(deal => 
      deal.title.toLowerCase().includes(searchTerm)
    );
    
    renderDeals(filteredDeals);
  });
}

// Sort by price ascending
if (btnSortPriceAsc) {
  btnSortPriceAsc.addEventListener('click', () => {
    const sortedDeals = [...currentDeals].sort((a, b) => a.price - b.price);
    setCurrentDeals({ result: sortedDeals, meta: currentPagination });
    render(currentDeals, currentPagination);
    updateSortButtonStates('price-asc');
  });
}

// Sort by price descending
if (btnSortPriceDesc) {
  btnSortPriceDesc.addEventListener('click', () => {
    const sortedDeals = [...currentDeals].sort((a, b) => b.price - a.price);
    setCurrentDeals({ result: sortedDeals, meta: currentPagination });
    render(currentDeals, currentPagination);
    updateSortButtonStates('price-desc');
  });
}

// Sort by date ascending (oldest)
if (btnSortDateAsc) {
  btnSortDateAsc.addEventListener('click', () => {
    const sortedDeals = [...currentDeals].sort((a, b) => {
      const aDate = a.published ? new Date(a.published).getTime() : 0;
      const bDate = b.published ? new Date(b.published).getTime() : 0;
      return aDate - bDate;
    });
    setCurrentDeals({ result: sortedDeals, meta: currentPagination });
    render(currentDeals, currentPagination);
    updateSortButtonStates('date-asc');
  });
}

// Sort by date descending (newest)
if (btnSortDateDesc) {
  btnSortDateDesc.addEventListener('click', () => {
    const sortedDeals = [...currentDeals].sort((a, b) => {
      const aDate = a.published ? new Date(a.published).getTime() : 0;
      const bDate = b.published ? new Date(b.published).getTime() : 0;
      return bDate - aDate;
    });
    setCurrentDeals({ result: sortedDeals, meta: currentPagination });
    render(currentDeals, currentPagination);
    updateSortButtonStates('date-desc');
  });
}

selectLegoSetId.addEventListener('change', (event) => {
  if (event.target.value === "All") {
    render(currentDeals, currentPagination);
    renderLegoSetIds(currentDeals);
    document.getElementById("nbDeals").innerHTML = currentDeals.length;
    updateSortButtonStates(currentSort);
    return;
  }

  const deals_filtered = currentDeals.filter(deal =>
    deal.id === parseInt(event.target.value, 10)
  );

  setCurrentDeals({result: deals_filtered, meta: currentPagination});
  render(currentDeals, currentPagination);
  renderLegoSetIds(currentDeals);
  document.getElementById("nbDeals").innerHTML = currentDeals.length;
  updateSortButtonStates(currentSort);
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
  updateSortButtonStates(currentSort);
});

document.addEventListener('DOMContentLoaded', async () => {
  const deals = await fetchDeals();

  setCurrentDeals({result: deals.result, meta: deals.meta});
  render(currentDeals, currentPagination);
});

// Update sort button states
function updateSortButtonStates(activeSort) {
  if (btnSortPriceAsc) {
    btnSortPriceAsc.classList.toggle('active', activeSort === 'price-asc');
  }
  if (btnSortPriceDesc) {
    btnSortPriceDesc.classList.toggle('active', activeSort === 'price-desc');
  }
  if (btnSortDateAsc) {
    btnSortDateAsc.classList.toggle('active', activeSort === 'date-asc');
  }
  if (btnSortDateDesc) {
    btnSortDateDesc.classList.toggle('active', activeSort === 'date-desc');
  }
}

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
