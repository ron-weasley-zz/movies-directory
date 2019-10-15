const express = require('express');
const viewsController = require('../controllers/viewsController');

const router = express.Router();

router.route('/').get(viewsController.getOverview);
router.route('/find').get(viewsController.getMovieSearchResults);

router.route('/api-docs').get(viewsController.getOverview); // - To be implemented

module.exports = router;