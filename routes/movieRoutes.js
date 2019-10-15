const express = require('express');
const moviesController = require('../controllers/moviesController');

const router = express.Router();

router.route('/find').get(moviesController.getMoviesResults);


module.exports = router;