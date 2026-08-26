const express = require('express');
const { listActivePromotions } = require('../controllers/promotion.controller');

const router = express.Router();

router.get('/active', listActivePromotions);

module.exports = router;
