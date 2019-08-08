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


// Data loggers
const createDOC = async function (data) {
    await moviedb.create(data, (err, createdDoc) => {
        if (err !== null) {
            console.log(err);
            fs.appendFile('error-log.txt',
                `createDoc Function Error: ${err} \n ${createdDoc}\n\n\n\n`,
                function (err) {
                    console.log('Error Saved!');
                });
        }
    })
};
const updatetagsDOC = async function (data) {
    await moviedb.updateOne({
        movieID: data.movieId
    }, {
        $push: {
            tags: data.tag
        }
    }, (err, updatedDoc) => {
        if (err !== null) {
            console.log(err);
            fs.appendFile('error-log.txt',
                `updateDoc Function Error: ${err} \n ${updatedDoc}\n\n\n\n`,
                function (err) {
                    console.log('Error Saved!');
                });
        }
    });
};
const updateratingDOC = async function (data) {
    await moviedb.updateOne({
        movieID: data.movieId
    }, {
        $push: {
            ratings: data.rating
        }
    }, (err, updatedDoc) => {
        if (err !== null) {
            console.log(err);
            fs.appendFile('error-log.txt',
                `updateDoc Function Error: ${err} \n ${updatedDoc}\n\n\n\n`,
                function (err) {
                    console.log('Error Saved!');
                });
        }
    });
};


// // Database Writer
//
// let year = " ";
// csv.fromPath("./dataset/movies.csv", {
//         headers: true
//     })
//     .on("data", function (data) {
//         data.movieId = data.movieId * 1;
//         if (data.title.substr(-1) === ")" && data.title.substr(-6, 1) === "(") {
//             year = data.title.slice(-5, -1);
//             data.title = data.title.slice(0, -7);
//         } else {
//             year = "NA";
//         }
//         if (data.genres === "(no genres listed)") {
//             data.genres = ["NA"];
//         } else {
//             data.genres = data.genres.split("|");
//         }
//         var writeObj = new Object({
//             movieID: data.movieId,
//             movieName: data.title,
//             movieYear: year,
//             movieGenre: data.genres
//         });
//         createDOC(writeObj);
//     })
//     .on("end", function () {
//         console.log("----Movies ID, Movies Name, Movies Year and Movies Genre written!----");
//     });

// csv.fromPath("./dataset/tags.csv", {
//         headers: true
//     })
//     .on("data", function (data) {
//         data.movieId = data.movieId * 1;
//         updatetagsDOC(data);
//     })
//     .on("end", () => {
//         console.log("----Movies Tag written!----");
//     });

csv.fromPath("./dataset/ratings.csv", {
        headers: true
    })
    .on("data", function (data) {
        console.log(`${data.userId} - ${data.movieId}`);
        updateratingDOC(data);
    })
    .on("end", () => {
        console.log("----Movies Rating written!----");
    });