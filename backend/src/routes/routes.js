const express = require('express');
const router = express.Router();

const homeRoutes = require('./home');
const aboutRoutes = require('./about');
const contactRoutes = require('./contact');
const servicesRoutes = require('./services');

// Use the individual route files
router.use('/', homeRoutes);
router.use('/about', aboutRoutes);
router.use('/contact', contactRoutes);
router.use('/services', servicesRoutes);

module.exports = router;