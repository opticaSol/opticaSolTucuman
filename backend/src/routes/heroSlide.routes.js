const express = require('express');
const { listActiveHeroSlides } = require('../controllers/heroSlide.controller');

const router = express.Router();

router.get('/active', listActiveHeroSlides);

module.exports = router;
