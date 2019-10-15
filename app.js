const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const helmet = require('helmet');

const viewRouter = require('./routes/viewRoutes');
const movieRouter = require('./routes/movieRoutes');

const app = express();

app.enable('trust proxy');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(cors());
app.options('*', cors());

app.use(helmet());

app.use(express.static(`${__dirname}/public`));

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

const limiter = rateLimit({
    max: 125,
    windowMs: 10 * 60 * 1000,
    message: 'Requests from this IP are blocked. Try again after some time!'
});
app.use('/api', limiter);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(mongoSanitize());
app.use(xss());
app.use(compression());

app.use('/', viewRouter);
app.use('/api/v1/movies', movieRouter);

app.all('*', (req, res, next) => {
    res.status(404).render('not_found', {
        title: 'Movies Directory - 404'
    });
});

module.exports = app;