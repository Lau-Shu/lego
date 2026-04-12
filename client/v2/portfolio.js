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
const sectionDeals= document.querySelector('#deals');
const spanNbDeals = document.querySelector('#nbDeals');
const selectFilterDiscount = document.querySelector('#filter-discount');
const selectFilterCommented = document.querySelector('#filter-commented');
const selectFilterHotDeals = document.querySelector('#filter-hot-deals');
const selectShowFavorite = document.querySelector('#show-favorite');
const dealSearchInput = document.querySelector('#deal-search');
const btnSortPriceAsc = document.querySelector('#sort-price-asc-btn');
const btnSortPriceDesc = document.querySelector('#sort-price-desc-btn');
const btnSortDateAsc = document.querySelector('#sort-date-asc-btn');
const btnSortDateDesc = document.querySelector('#sort-date-desc-btn');
const btnResetFilters = document.querySelector('#reset-filters-btn');

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
 * Save filter state to localStorage
 */
const saveFiltersToStorage = () => {
  const filters = {
    discount: selectFilterDiscount.checked,
    commented: selectFilterCommented.checked,
    hotDeals: selectFilterHotDeals.checked,
    favoritesOnly: selectShowFavorite.checked,
    sort: currentSort
  };
  localStorage.setItem('dealFilters', JSON.stringify(filters));
};

/**
 * Load filter state from localStorage and apply to UI
 */
const loadFiltersFromStorage = () => {
  const stored = localStorage.getItem('dealFilters');
  if (stored) {
    const filters = JSON.parse(stored);
    selectFilterDiscount.checked = filters.discount || false;
    selectFilterCommented.checked = filters.commented || false;
    selectFilterHotDeals.checked = filters.hotDeals || false;
    selectShowFavorite.checked = filters.favoritesOnly || false;
    currentSort = filters.sort || 'date-desc';
  }
};

/**
 * Reset all filters to default state
 */
const resetFilters = async () => {
  selectFilterDiscount.checked = false;
  selectFilterCommented.checked = false;
  selectFilterHotDeals.checked = false;
  selectShowFavorite.checked = false;
  selectShow.value = '6';
  currentSort = 'date-desc';
  
  saveFiltersToStorage();
  
  const deals = await fetchDeals(1, 6);
  setCurrentDeals({result: deals.result, meta: deals.meta});
  render(currentDeals, currentPagination);
  updateSortButtonStates(currentSort);
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
      //`https://lego-vercel-myapi.vercel.app/deals/search?page=${page}&size=${size}`
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
      //`https://lego-vercel-myapi.vercel.app/deals/search?page=${page}&size=${size}`
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
  // Function removed - Set ID filter no longer used
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
};

/**
 * Declaration of all Listeners
 */

/**
 * Select the number of deals to display
 */
selectShow.addEventListener('change', async (event) => {
  const size = parseInt(event.target.value);
  const deals = await fetchDeals(1, size);

  setCurrentDeals({result: deals.result, meta: deals.meta});
  const deals_filtered = applyAllFilters(deals.result);
  if (isAnyFilterActive()) {
    setCurrentDeals({result: deals_filtered, meta: deals.meta});
  }
  render(currentDeals, currentPagination);
  updateSortButtonStates(currentSort);
  saveFiltersToStorage();
});

selectPage.addEventListener('change', async (event) => {
  const page = parseInt(event.target.value);
  const deals = await fetchDeals(page, currentPagination.pageSize);

  setCurrentDeals({result: deals.result, meta: deals.meta});
  const deals_filtered = applyAllFilters(deals.result);
  if (isAnyFilterActive()) {
    setCurrentDeals({result: deals_filtered, meta: deals.meta});
  }
  render(currentDeals, currentPagination);
  updateSortButtonStates(currentSort);
  saveFiltersToStorage();
});

/**
 * Apply all active filters to deals
 * @param {Array} deals - deals to filter
 * @returns {Array} - filtered deals
 */
const isAnyFilterActive = () => {
  return selectFilterDiscount.checked || selectFilterCommented.checked || selectFilterHotDeals.checked || selectShowFavorite.checked;
};

/**
 * Apply all active filters to deals
 * @param {Array} deals - deals to filter
 * @returns {Array} - filtered deals
 */
const applyAllFilters = (deals) => {
  let filtered = [...deals];

  // Filter by discount
  if (selectFilterDiscount.checked) {
    filtered = filtered.filter(deal => deal.discount > 20);
  }

  // Filter by comments
  if (selectFilterCommented.checked) {
    filtered = filtered.filter(deal => deal.comments > 5);
  }

  // Filter by hot deals
  if (selectFilterHotDeals.checked) {
    filtered = filtered.filter(deal => deal.temperature > 100);
  }

  // Filter by favorites
  if (selectShowFavorite.checked) {
    const favorites = getFavorites();
    filtered = filtered.filter(deal => favorites.includes(deal.uuid));
  }

  return filtered;
};

// Filter by discount
selectFilterDiscount.addEventListener('change', async () => {
  const deals = await fetchDeals(currentPagination.currentPage, currentPagination.pageSize);
  const deals_filtered = applyAllFilters(deals.result);

  if (deals_filtered.length > 0) {
    setCurrentDeals({result: deals_filtered, meta: deals.meta});
  } else {
    console.log("No deal found with the selected filters");
    setCurrentDeals({result: deals.result, meta: deals.meta});
  }

  render(currentDeals, currentPagination);
  updateSortButtonStates(currentSort);
  saveFiltersToStorage();
});

// Filter by number of comments
selectFilterCommented.addEventListener('change', async () => {
  const deals = await fetchDeals(currentPagination.currentPage, currentPagination.pageSize);
  const deals_filtered = applyAllFilters(deals.result);

  if (deals_filtered.length > 0) {
    setCurrentDeals({result: deals_filtered, meta: deals.meta});
  } else {
    console.log("No deal found with the selected filters");
    setCurrentDeals({result: deals.result, meta: deals.meta});
  }

  render(currentDeals, currentPagination);
  updateSortButtonStates(currentSort);
  saveFiltersToStorage();
});

// Filter by hot deals
selectFilterHotDeals.addEventListener('change', async () => {
  const deals = await fetchDeals(currentPagination.currentPage, currentPagination.pageSize);
  const deals_filtered = applyAllFilters(deals.result);

  if (deals_filtered.length > 0) {
    setCurrentDeals({result: deals_filtered, meta: deals.meta});
  } else {
    console.log("No deal found with the selected filters");
    setCurrentDeals({result: deals.result, meta: deals.meta});
  }

  render(currentDeals, currentPagination);
  updateSortButtonStates(currentSort);
  saveFiltersToStorage();
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
    currentSort = 'price-asc';
    const sortedDeals = [...currentDeals].sort((a, b) => a.price - b.price);
    setCurrentDeals({ result: sortedDeals, meta: currentPagination });
    render(currentDeals, currentPagination);
    updateSortButtonStates(currentSort);
    saveFiltersToStorage();
  });
}

// Sort by price descending
if (btnSortPriceDesc) {
  btnSortPriceDesc.addEventListener('click', () => {
    currentSort = 'price-desc';
    const sortedDeals = [...currentDeals].sort((a, b) => b.price - a.price);
    setCurrentDeals({ result: sortedDeals, meta: currentPagination });
    render(currentDeals, currentPagination);
    updateSortButtonStates(currentSort);
    saveFiltersToStorage();
  });
}

// Sort by date ascending (oldest)
if (btnSortDateAsc) {
  btnSortDateAsc.addEventListener('click', () => {
    currentSort = 'date-asc';
    const sortedDeals = [...currentDeals].sort((a, b) => {
      const aDate = a.published ? new Date(a.published).getTime() : 0;
      const bDate = b.published ? new Date(b.published).getTime() : 0;
      return aDate - bDate;
    });
    setCurrentDeals({ result: sortedDeals, meta: currentPagination });
    render(currentDeals, currentPagination);
    updateSortButtonStates(currentSort);
    saveFiltersToStorage();
  });
}

// Sort by date descending (newest)
if (btnSortDateDesc) {
  btnSortDateDesc.addEventListener('click', () => {
    currentSort = 'date-desc';
    const sortedDeals = [...currentDeals].sort((a, b) => {
      const aDate = a.published ? new Date(a.published).getTime() : 0;
      const bDate = b.published ? new Date(b.published).getTime() : 0;
      return bDate - aDate;
    });
    setCurrentDeals({ result: sortedDeals, meta: currentPagination });
    render(currentDeals, currentPagination);
    updateSortButtonStates(currentSort);
    saveFiltersToStorage();
  });
}

// Show only favorites
selectShowFavorite.addEventListener('change', async () => {
  const deals = await fetchDeals(
    currentPagination.currentPage,
    currentPagination.pageSize
  );

  const deals_filtered = applyAllFilters(deals.result);

  if (deals_filtered.length > 0 || !selectShowFavorite.checked) {
    setCurrentDeals({ result: deals_filtered, meta: deals.meta });
  } else {
    console.log("No favorite deals found");
    setCurrentDeals({ result: deals.result, meta: deals.meta });
  }

  render(currentDeals, currentPagination);
  updateSortButtonStates(currentSort);
  saveFiltersToStorage();
});

document.addEventListener('DOMContentLoaded', async () => {
  loadFiltersFromStorage();
  
  const deals = await fetchDeals();

  setCurrentDeals({result: deals.result, meta: deals.meta});
  
  const deals_filtered = applyAllFilters(deals.result);
  if (isAnyFilterActive()) {
    setCurrentDeals({result: deals_filtered, meta: deals.meta});
  }
  
  render(currentDeals, currentPagination);
  updateSortButtonStates(currentSort);
  
  // Add Reset Filters button listener
  if (btnResetFilters) {
    btnResetFilters.addEventListener('click', resetFilters);
  }
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
