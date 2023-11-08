let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
var cors = require('cors');
let passport = require("passport");
require("dotenv").config();

require("./mvc/models/db.js");

let usersRouter = require('./mvc/routes/users.js');
let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'mvc', 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.options('*',cors());

app.use(function (req, res, next) {
    res.statusJson = function (statusCode, data) {
        let obj = {
            ...data,
            statusCode: statusCode
        }
        res.status(statusCode).json(obj);
    }
    next();
})

app.use(passport.initialize());

app.use('/', (req, res, next) => {
    console.log("hua")
    let url;
    url = "https://network-nook-frontend.vercel.app";
    res.header('Access-Control-Allow-Origin', url);
    res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,Authorization');
    next();
})

app.use('/api', usersRouter);

app.use(function (err, req, res) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
