const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    movieID: {
        type: Number,
        required: [true, 'Movie ID not present!']
    },
    movieName: {
        type: String,
        required: [true, 'Movie Name not present!']
    },
    movieYear: {
        type: String
    },
    movieGenre: {
        type: [String]
    },
    tags: [String],
    ratings: [Number],
    otherDB: {
        imdbID: String,
        tmdbID: String
    }
});

// name of the collection- Movies
const Movie = mongoose.model('Movie', movieSchema, 'Movies');

module.exports = Movie;