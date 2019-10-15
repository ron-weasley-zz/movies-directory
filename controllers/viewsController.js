const fs = require('fs');

const Movies = require('../models/movieModel');

const moviesOverviewPage = JSON.parse(fs.readFileSync(`${__dirname}/../public/overview.json`));

// Main Page
exports.getOverview = (req, res, next) => {
    res.status(200).render('overview', {
        title: 'Movies Directory',
        movies: moviesOverviewPage
    });
};

// Search Results
exports.getMovieSearchResults = async (req, res, next) => {
    // console.log(req.query, req.params);

    // Illegal query
    if(!req.query.q || req.query.q.length <= 1){
        return res.status(404).render('not_found',{
            title:'Movies Directory - 404',
            message1: '404',
            message: 'No results for this query!'
        }).json({
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
    },{ movieName:1,movieYear:1,otherDB:1,movieGenre:1,tags: 1});
    
    res.status(200).render('results', {
        title: 'Movies Directory - Results',
        searchedFor: `${query}`,
        totalResults: movies.length,
        movies
    });
};

//API
// exports.apiDocs = (req, res, next) => {
//     res.status(200).render('api', {
//         title: 'Movies Directory - API'
//     });
// }