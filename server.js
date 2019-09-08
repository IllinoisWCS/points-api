// Get the packages we need
var express = require("express"),
    router = express.Router(),
    mongoose = require("mongoose"),
    secrets = require("./config/secrets"),
    bodyParser = require("body-parser"),
    cors = require("cors");

var app = express();
app.use(cors());

// Use environment defined port or 3000
var port = process.env.PORT || 3000;

// Connect to a MongoDB
mongoose.connect(
    secrets.mongo_connection, { useMongoClient: true }
);

//Allow CORS so that backend and frontend could be put on different servers
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "http://points.illinoiswcs.org");
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header(
    //     "Access-Control-Allow-Headers",
    //     "Origin, X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
    // );
    // res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    // next();
};
app.use(allowCrossDomain);
// app.use(function(req, res, next) {
//     // Website you wish to allow to connect
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
//     res.setHeader('Access-Control-Allow-Credentials', 'true');

//     // Request methods you wish to allow
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

//     // Request headers you wish to allow
//     res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization');

//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

//     // Pass to next layer of middleware
//     next();
// });
// Use the body-parser package in our application
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);
app.use(bodyParser.json());

// Use routes as a module (see index.js)
require("./routes")(app, router);

// Start the server
app.listen(port);
console.log("Server running on port " + port);