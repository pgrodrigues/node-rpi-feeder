/**
 * node-rpi-feeder
 * @namespace
 */

/**
 * Module that handles the configuration of the express app
 *
 * @module node-rpi-feeder/app
 * @requires compression
 * @requires config
 * @requires cookie-parser
 * @requires express
 * @requires helmet
 * @requires http-errors
 * @requires morgan
 * @requires node-rpi-feeder/logger
 * @requires path
 */

/**
 * compression module
 * @const
 */
const compression = require("compression");

/**
 * config module
 * @const
 */
const config = require("config");

/**
 * cookie-parser module
 * @const
 */
const cookieParser = require("cookie-parser");

/**
 * express module
 * @const
 */
const express = require("express");

/**
 * helmet module
 * @const
 */
const helmet = require("helmet");

/**
 * http-errors module
 * @const
 */
const httpErrors = require("http-errors");

/**
 * morgan module
 * @const
 */
const morgan = require("morgan");

/**
 * path module
 * @const
 */
const path = require("path");

/**
 * node-rpi-feeder/logger module
 * @const
 * @see module:node-rpi-feeder/logger
 */
const logger = require("./logger");

// App configuration
const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(morgan("short", { stream: logger.stream }));
app.use(compression());
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// Set routes for vendor files
app.use("/vendor", [
  express.static(path.join(__dirname, "/node_modules/jquery/dist/")),
  express.static(path.join(__dirname, "/node_modules/muicss/dist/")),
  express.static(path.join(__dirname, "/node_modules/socket.io-client/dist/"))
]);

// Set appDescription, appName and appVersion locals and forward to next middleware
app.use((req, res, next) => {
  res.locals.appDescription = config.get("app.description");
  res.locals.appName = config.get("app.name");
  res.locals.appVersion = config.get("app.version");
  next();
});

// Set remaining API routes
app.use("/", require("./routes"));

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  next(httpErrors(404));
});

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // Set message and error locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
