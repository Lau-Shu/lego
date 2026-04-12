import express from 'express';
import cors from 'cors';

// import * as vinted from './websites/vinted.js';
// import * as dealabs from './websites/dealabs.js';
import VINTED from './sources/myVinted.json' with { type: 'json' };
import DEALS from './sources/deals.json' with { type: 'json' };

const app = express();
const PORT = 3000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(express.json());

/* =========================================================
   ROOT
========================================================= */
app.get('/', (request, response) => {
  response.send({'ack': true});
});

/* =========================================================
   HEALTH CHECK
========================================================= */
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

/* =========================================================
   SALES (VINTED ONLY)
   GET /sales/search?legoSetId=10348
========================================================= */

app.get('/sales/search', (req, res) => {
  try {
    const { legoSetId } = req.query;

    if (!legoSetId) {
      return res.status(400).json({
        success: false,
        error: 'legoSetId is required'
      });
    }

    console.log(`🔎 Vinted search for LEGO ${legoSetId}`);

    const sales = VINTED[legoSetId] || [];

    return res.json({
      success: true,
      data: {
        result: sales
      },
      updatedAt: new Date().toISOString()
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

/* =========================================================
   DEALS SEARCH (DEALABS LIST)
   GET /deals/search
========================================================= */
app.get('/deals/search', (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const size = Number(req.query.size) || 6;

    const count = DEALS.length;
    const pageCount = Math.ceil(count / size);

    const start = (page - 1) * size;
    const end = start + size;

    const result = DEALS.slice(start, end);

    return res.json({
      success: true,
      data: {
        result,
        meta: {
          currentPage: page,
          pageSize: size,
          pageCount,
          count
        }
      }
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

/* =========================================================
   DEAL BY ID
   GET /deals/:id
========================================================= */
app.get('/deals/:id', (req, res) => {
  try {
    const { id } = req.params;

    console.log(`🔎 Searching deal ${id}`);

    const deal = DEALS.find(d => d.id === id);

    if (!deal) {
      return res.status(404).json({
        error: 'Deal not found'
      });
    }

    return res.json(deal);

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: 'Internal server error',
      message: err.message
    });
  }
});

/* =========================================================
   START SERVER
========================================================= */
app.listen(PORT, () => {
  console.log(`🚀 API running on http://localhost:${PORT}`);
});