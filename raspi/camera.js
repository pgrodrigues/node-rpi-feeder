/**
 * Module that controls the Raspberry Pi camera
 *
 * @module node-rpi-feeder/raspi/camera
 * @requires config
 * @requires fs
 * @requires node-rpi-feeder/logger
 * @requires path
 * @requires raspicam
 */

/**
 * config module
 * @const
 */
const config = require("config");

/**
 * fs module
 * @const
 */
const fs = require("fs");

/**
 * path module
 * @const
 */
const path = require("path");

/**
 * raspicam module
 * @const
 */
const RaspiCam = require("raspicam");

/**
 * node-rpi-feeder/logger module
 * @const
 * @see module:node-rpi-feeder/logger
 */
const logger = require("../logger");

module.exports = (emitter) => {
  /**
   * Camera object
   *
   * @type {object}
   * @const
   */
  const camera = new RaspiCam({
    encoding: "jpg",
    mode: "timelapse",
    nopreview: true,
    output: path.join(config.get("raspi.camera.outputDirectory"), "image_%06d.jpg"),
    timelapse: config.get("raspi.camera.timelapseInterval"),
    timeout: 0
  });

  /**
   * Camera start event
   *
   * @event module:node-rpi-feeder/raspi/camera#start
   */
  camera.on("start", () => {
    logger.info("Raspi camera started");
  });

  /**
   * Camera read event
   *
   * @event module:node-rpi-feeder/raspi/camera#read
   * @fires module:node-rpi-feeder/raspi#frameLoaded
   */
  camera.on("read", (error, timestamp, filename) => {
    const filePath = path.join(config.get("raspi.camera.outputDirectory"), filename);

    fs.readFile(filePath, (errReadFile, data) => {
      if (!errReadFile) {
        const base64data = Buffer.from(data).toString("base64");

        emitter.emit("frameLoaded", {
          cameraImage: base64data,
          message: "New frame received",
          status: "success"
        });

        fs.unlink(filePath, (errUnlink) => {
          if (errUnlink) {
            logger.error(`Unable to delete file ${filePath}`);
          }
        });
      }
    });
  });

  /**
   * Camera exit event
   *
   * @event module:node-rpi-feeder/raspi/camera#exit
   */
  camera.on("exit", () => {
    logger.info("Raspi camera exitted");
  });

  /**
   * Camera stop event
   *
   * @event module:node-rpi-feeder/raspi/camera#stop
   */
  camera.on("stop", () => {
    logger.info("Raspi camera stopped");
  });

  return {
    startTimelapse: () => camera.start(),
    stopTimelapse: () => camera.stop()
  };
};
