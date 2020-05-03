/**
 * Module that handles the communication with Raspberry Pi GPIO
 *
 * @module node-rpi-feeder/raspi/gpio
 * @requires config
 * @requires johnny-five
 * @requires node-rpi-feeder/logger
 * @requires raspi-io
 */

/**
 * config module
 * @const
 */
const config = require("config");

/**
 * johnny-five module
 * @const
 */
const five = require("johnny-five");

/**
 * raspi-io module
 * @const
 */
const Raspi = require("raspi-io").RaspiIO;

/**
 * node-rpi-feeder/logger module
 * @const
 * @see module:node-rpi-feeder/logger
 */
const logger = require("../logger");

module.exports = (emitter) => {
  const board = new five.Board({
    io: new Raspi()
  });
  const Timeout = setTimeout(() => {}, 0).constructor;
  let servo;
  let timer;

  /**
   * Check if feeding is in progress
   *
   * @name isFeeding
   * @function
   * @memberof module:node-rpi-feeder/raspi/gpio
   * @returns {boolean} Whether or not feeding is in progess
   */
  const isFeeding = () => {
    return timer instanceof Timeout;
  };

  /**
   * If feeding is in progress, stops feeding and emits a feedingStopped event
   *
   * @name stopFeeder
   * @function
   * @memberof module:node-rpi-feeder/raspi/gpio
   * @fires module:node-rpi-feeder/raspi#feedingStopped
   */
  const stopFeeder = () => {
    if (isFeeding()) {
      servo.min();

      // Clear timer
      clearTimeout(timer);
      timer = null;
      logger.info("Feeding stopped");

      emitter.emit("feedingStopped", {
        message: "Feeding stopped",
        status: "success"
      });
    }
  };

  /**
   * If feeding is not in progress, starts feeding and emits a feedingStarted event
   *
   * @name startFeeder
   * @function
   * @memberof module:node-rpi-feeder/raspi/gpio
   * @fires module:node-rpi-feeder/raspi#feedingStarted
   */
  const startFeeder = () => {
    if (!isFeeding()) {
      servo.max();

      // Start timer
      timer = setTimeout(() => {
        stopFeeder();
      }, config.get("raspi.feeder.timer"));

      logger.info("Feeding started");

      emitter.emit("feedingStarted", {
        message: "Feeding started",
        status: "success"
      });
    }
  };

  /**
   * Board ready event
   *
   * @event module:node-rpi-feeder/raspi/gpio#ready
   */
  board.on("ready", () => {
    servo = new five.Servo({ pin: "GPIO12", startAt: 0 });

    logger.info("Raspi GPIO support detected");
  });

  return {
    isFeeding,
    startFeeder
  };
};
