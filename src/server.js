const express = require('express');
const app = express();
const helmet = require('helmet');

// Default helmet settings do a lot of configuration for us
// Further options can be found at:
// https://www.npmjs.com/package/helmet
app.use(helmet());

// CORS settings to help limit what front ends can access our API!
const cors = require('cors');
let corsOptions = {
    origin: [
        "http://localhost:3000",
        "https://deployedReactApp.com"
    ],
    optionSuccessStatus: 200
};

app.use(cors(corsOptions));

// Receive JSON data on requests

app.use(express.json());
app.use(express.urlencoded({extended: true}))

// Check it's working with basic get request
app.get('/', (request, response) => {
    response.json({
        message: "Helloooooooooooooo there"
    });
});


// 404 handler if no previously mounted route has activated
// this route will activate and send a resposne to the client
app.all(/.*/, (request, response) => {
    response.status(404).json({
        message: "No route found at this path!",
        targetUrl: request.path
    });
});

module.exports = {
    app
}