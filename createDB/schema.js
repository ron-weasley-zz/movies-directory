const mongoose = require('mongoose');

const schema = mongoose.Schema({
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
    tags: [String]
});

module.exports = schema;