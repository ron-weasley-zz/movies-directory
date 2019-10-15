const Movies = require('../models/movieModel');

// Movies Search Results
exports.getMoviesResults = async (req, res, next) => {
    // console.log(req.query, req.params);
    
    // Illegal query
    if(!req.query.q || req.query.q.length <= 1){
        return res.status(404).json({
            status: 404,
            results: 0
        });
    }

    const query = req.query.q.split(' ').map(s => (s.charAt(0).toUpperCase() + s.substring(1))).join(' ');
    const movies = await Movies.find({
        movieName: {
            $regex: query,
            $options: "$i"
        }
    });

    res.status(200).json({
        status: 'success',
        results: movies.length,
        query,
        data: {
            movies
        }
    });
};