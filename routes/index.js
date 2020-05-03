/**
 * Module that holds the express router
 *
 * @module node-rpi-feeder/router
 * @requires express
 */

/**
 * express module
 * @const
 */
const express = require("express");

/**
 * Express router
 *
 * @type {object}
 * @const
 */
const router = express.Router();

/**
 * Route that responds to "/"
 *
 * @name get/
 * @function
 * @memberof module:node-rpi-feeder/router
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware
 */
router.get("/", (req, res) => {
  res.render("index");
});

module.exports = router;
