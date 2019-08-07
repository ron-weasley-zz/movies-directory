const fs = require('fs');
const mongoose = require('mongoose');
const csv = require('fast-csv');
const dotenv = require('dotenv');

const schema = require('./schema');

dotenv.config({
    path: "./../config.env"
});

//Database Connection
mongoose.connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => console.log('Database connected!'));


// Collection and model defined here 
const moviedb = mongoose.model('moviedb', schema, 'Actors');


//Function to create Document in Database
var createDOC = async (data) => {
    const dat = await moviedb.create(data, (err, createdDoc) => {
        if (err !== null) {
            console.log(err);
            fs.appendFile('error-log.txt', `${err} \n ${createdDoc}\n\n\n\n`, function (err) {
                console.log('Error Saved!');
            });
        }
    });
};
//Function to update document in database
var updateDoc = async (data) => {
    const dat = await moviedb.updateOne({
        movieID: data.movieId
    }, {
        $push: {
            tags: data.tag
        }
    }, (err, updatedDoc) => {
        console.log(err);
    });
};


// 
// For movies.csv file [setting up database for the first time]
//
// //Reading movies CSV file in Stream
var CSVstream = fs.createReadStream("./dataset/movies.csv");

//Writing data to database
var year = " ";
csv.fromStream(CSVstream, {
        headers: true
    })
    .on("data", function (data) {
        data.movieId = data.movieId * 1;
        if (data.title.substr(-1) === ")" && data.title.substr(-6, 1) === "(") {
            year = data.title.slice(-5, -1);
            data.title = data.title.slice(0, -7);
        } else {
            year = "NA";
        }
        if (data.genres === "(no genres listed)") {
            data.genres = ["NA"];
        } else {
            data.genres = data.genres.split("|");
        }
        var writeObj = new Object({
            movieID: data.movieId,
            movieName: data.title,
            movieYear: year,
            movieGenre: data.genres
        });
        // console.log(data);
        createDOC(writeObj);
    })
    .on("end", function () {
        console.log("----Movies ID, Movies Name, Movies Year and Movies Genre written!----");
    });


// 
// For tags.csv file [updating tags in documents in database]
//
//Reading tags CSV file in Stream
// var CSVstream = fs.createReadStream("./dataset/tags.csv");


// // //Writing data to database
// csv.parseStream(CSVstream, {
//         headers: true
//     })
//     .on("data", function (data) {
//         data.movieId = data.movieId * 1;
//         updateDoc(data);
//     })
//     .on("end", () => {
//         console.log("----Movies Tag written!----")
//     });