const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const busboy = require("connect-busboy");
const fs = require("fs");

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions));
app.use(helmet({
    contentSecurityPolicy: false,
    frameguard: false,
    crossOriginEmbedderPolicy: false,
}));

const bodyParser = require("body-parser");
app.use(bodyParser.json({ limit: "1mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "1mb" }));

app.use(busboy());

// Rate limiting
const rateLimit = require("express-limit").limit;
app.use(rateLimit({
    max: 100,
    resetInterval: 1000 * 60 * 60,
    message: "Too many requests, please try again later.",
}));

if (process.argv.includes("--prod")) {
    // Catch errors in Express
    app.use(function (err, req, res, next) {
        if (!err) return next();
        
        console.error(err.stack);
        res.status(500).json({ error: "Something went wrong" });
    });

    // Catch errors everywhere else
    process.on("uncaughtException", (err) => {
        console.error(err);
    });
}

// Register all routes
const versions = fs.readdirSync("./routes");
for (const version of versions) {
    const routeFiles = fs.readdirSync("./routes/" + version);
    for (const file of routeFiles) {
        if (file.endsWith(".js")) {
            const route = require("./routes/" + version + "/" + file);
            app.use("/" + version, route);
        }
    }
}

app.use(function (req, res) {
    res.status(404).json({ error: "Not found" });
});

module.exports = app;