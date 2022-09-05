const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
global.__basedir = __dirname + '/';

const {
    routes: controllerRoutes,
} = require('./controller/routes');


app.use(cors());
app.use(bodyParser.json());
app.use('/', controllerRoutes);

module.exports = app;