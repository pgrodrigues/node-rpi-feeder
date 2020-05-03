/**
 * Module that handles the configuration of the Socket.IO
 *
 * @module node-rpi-feeder/io
 * @requires node-rpi-feeder/logger
 * @requires node-rpi-feeder/raspi
 * @requires socket.io
 */

/**
 * socket.io module
 * @const
 */
const io = require("socket.io")();

/**
 * node-rpi-feeder/logger module
 * @const
 * @see module:node-rpi-feeder/logger
 */
const logger = require("./logger");

/**
 * node-rpi-feeder/raspi module
 * @const
 * @see module:node-rpi-feeder/raspi
 */
const raspi = require("./raspi")();

/**
 * Triggers Socket.IO to emit the info event to the frontend with the most recent status information
 *
 * @name updateInfo
 * @function
 * @memberof module:node-rpi-feeder/io
 */
const updateInfo = () => {
  io.emit("info", {
    date: Date.now(),
    isFeedingPossible: !raspi.isFeeding(),
    isRecordingPossible: !raspi.isRecording()
  });
};

/**
 * Called after a socket connection is successfully established and sets up additional event handlers
 *
 * @name onSocketConnected
 * @function
 * @memberof module:node-rpi-feeder/io
 * @param {Object} socket - The socket
 */
const onSocketConnected = (socket) => {
  logger.info(`Connection from ${socket.request.connection.remoteAddress}`);
  updateInfo();

  /**
   * Socket.IO startFeeding event that starts the feeding
   *
   * @event module:node-rpi-feeder/io#startFeeding
   */
  socket.on("startFeeding", () => {
    raspi.startFeeder();
  });

  /**
   * Socket.IO startSpeechRecording event that starts the speech recording
   *
   * @event module:node-rpi-feeder/io#startSpeechRecording
   */
  socket.on("startSpeechRecording", () => {
    raspi.startSpeechRecording();
  });

  /**
   * Raspi emitter feedingStarted event that triggers Socket.IO to emit the feedingStarted event to the frontend and updates info
   *
   * @event module:node-rpi-feeder/raspi#feedingStarted
   */
  raspi.emitter.on("feedingStarted", ({ message, status }) => {
    io.emit("feedingStarted", { date: Date.now(), message, status });

    updateInfo();
  });

  /**
   * Raspi emitter feedingStopped event that triggers Socket.IO to emit the feedingStopped event to the frontend and updates info
   *
   * @event module:node-rpi-feeder/raspi#feedingStopped
   */
  raspi.emitter.on("feedingStopped", ({ message, status }) => {
    io.emit("feedingStopped", { date: Date.now(), message, status });

    updateInfo();
  });

  /**
   * Raspi emitter frameLoaded event that triggers Socket.IO to emit the image event to the frontend and updates info
   *
   * @event module:node-rpi-feeder/raspi#frameLoaded
   */
  raspi.emitter.on("frameLoaded", ({ cameraImage, message, status }) => {
    io.emit("image", { date: Date.now(), cameraImage, message, status });

    updateInfo();
  });

  /**
   * Raspi emitter speechRecordingStarted event that triggers Socket.IO to emit the speechRecordingStarted event to the frontend and updates info
   *
   * @event module:node-rpi-feeder/raspi#speechRecordingStarted
   */
  raspi.emitter.on("speechRecordingStarted", ({ message, status }) => {
    io.emit("speechRecordingStarted", { date: Date.now(), message, status });

    updateInfo();
  });

  /**
   * Raspi emitter speechRecordingStopped event that triggers Socket.IO to emit the speechRecordingStopped event to the frontend and updates info
   *
   * @event module:node-rpi-feeder/raspi#speechRecordingStopped
   */
  raspi.emitter.on("speechRecordingStopped", ({ message, status }) => {
    io.emit("speechRecordingStopped", { date: Date.now(), message, status });

    updateInfo();
  });

  /**
   * Raspi emitter speechRecordingRecognized event that starts the feeding
   *
   * @event module:node-rpi-feeder/raspi#speechRecordingRecognized
   */
  raspi.emitter.on("speechRecordingRecognized", () => {
    raspi.startFeeder();
  });
};

// Socket.IO events
io.sockets.on("connection", onSocketConnected);

module.exports = io;
