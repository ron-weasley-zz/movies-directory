//  Other way of writing ratings
//  Now - [A, B, C, D, E]
//  The Other Way - [X, n] 
//  X = A + B + C + D + E    n = now.length()
//  X_new - (X + R)/(n + 1)

const fs = require('fs');
const mongoose = require('mongoose');
const csv = require('fast-csv');
const dotenv = require('dotenv');

const schema = require('./schema');

dotenv.config({
    path: "./config.env"
});

//Database Connection
mongoose
    .connect(process.env.DATABASE_LOCAL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    })
    .then(() => {
        console.log('DB connection successful!');
        (async () => {
            await movieWrite();
            await tagsWrite();
            await ratingsWrite();
            await linksWrite();
        })().catch(err => {
            console.error(err);
        });
    });

// Collection and model defined here (name of the collection- Actors)
const Movies = mongoose.model('Movies', schema, 'Movies');


// Data loggers
const createDOC = async (data) => {
    await Movies.create(data, (err, createdDoc) => {
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
const updatetagsDOC = async (data) => {
    await Movies.updateOne({
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
const updateratingDOC = async (data) => {
    await Movies.updateOne({
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
const updateimdbidDOC = async (data) => {
    await Movies.updateOne({
        movieID: data.movieId
    }, {
        otherDB: {
            imdbID: data.imdbId,
            tmdbID: data.tmdbId
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
let year = " ";
const movieWrite = async () => {
    csv.fromPath("./createDB/dataset/movies.csv", {
            headers: true
        })
        .on("data", async (data) => {
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
            await createDOC(writeObj);
        })
        .on("end", function () {
            console.log("----Movies ID, Movies Name, Movies Year and Movies Genre written!----");
        });
};

const tagsWrite = async () => {
    csv.fromPath("./createDB/dataset/tags.csv", {
            headers: true
        })
        .on("data", async (data) => {
            await updatetagsDOC(data);
        })
        .on("end", () => {
            console.log("----Movies Tag written!----");
        })
};

const ratingsWrite = async () => {
    csv.fromPath("./createDB/dataset/ratings.csv", {
            headers: true
        })
        .on("data", async (data) => {
            // console.log(`${data.userId} - ${data.movieId}`);
            data.rating = data.rating * 1;
            await updateratingDOC(data);
        })
        .on("end", () => {
            console.log("----Movies Rating written!----");
        })
};

const linksWrite = async () => {
    csv.fromPath("./createDB/dataset/links.csv", {
            headers: true
        })
        .on("data", async (data) => {
            await updateimdbidDOC(data);
        })
        .on("end", () => {
            console.log("----Movies imdbID written!----");
        })
};