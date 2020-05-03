/**
 * Module that uses the Raspberry Pi features
 *
 * @module node-rpi-feeder/raspi
 * @requires config
 * @requires events
 * @requires fs
 * @requires node-rpi-feeder/logger
 * @requires node-rpi-feeder/raspi/camera
 * @requires node-rpi-feeder/raspi/gpio
 * @requires node-rpi-feeder/raspi/speech
 */

/**
 * events module
 * @const
 */
const EventEmitter = require("events");

class RaspiEmitter extends EventEmitter {}

const emitter = new RaspiEmitter();

/**
 * node-rpi-feeder/raspi/camera module
 * @const
 * @see module:node-rpi-feeder/raspi/camera
 */
const camera = require("./camera")(emitter);

/**
 * node-rpi-feeder/raspi/gpio module
 * @const
 * @see module:node-rpi-feeder/raspi/gpio
 */
const gpio = require("./gpio")(emitter);

/**
 * node-rpi-feeder/raspi/speech module
 * @const
 * @see module:node-rpi-feeder/raspi/speech
 */
const speech = require("./speech")(emitter);

module.exports = () => {
  camera.startTimelapse();

  return {
    emitter,
    isFeeding: gpio.isFeeding,
    isRecording: speech.isRecording,
    startFeeder: gpio.startFeeder,
    startSpeechRecording: speech.startSpeechRecording
  };
};
