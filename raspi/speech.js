/**
 * Module that controls the Raspberry Pi speech recording and recognition
 *
 * @module node-rpi-feeder/raspi/speech
 * @requires config
 * @requires google-cloud/speech
 * @requires node-record-lpcm16
 * @requires node-rpi-feeder/logger
 */

/**
 * config module
 * @const
 */
const config = require("config");

/**
 * google-cloud/speech module
 * @const
 */
const speech = require("@google-cloud/speech");

/**
 * node-record-lpcm16 module
 * @const
 */
const recorder = require("node-record-lpcm16");

/**
 * node-rpi-feeder/logger module
 * @const
 * @see module:node-rpi-feeder/logger
 */
const logger = require("../logger");

module.exports = (emitter) => {
  let recording;
  const request = {
    config: {
      encoding: "LINEAR16",
      languageCode: "pt-PT",
      sampleRateHertz: 16000
    },
    interimResults: false
  };
  let timer;
  const Timeout = setTimeout(() => {}, 0).constructor;

  // Create a client
  const client = new speech.SpeechClient({
    keyFilename: config.get("raspi.speech.google.credentials"),
    projectId: config.get("raspi.speech.google.projectId")
  });

  /**
   * Check if recording is in progress
   *
   * @name isRecording
   * @function
   * @memberof module:node-rpi-feeder/raspi/speech
   * @returns {boolean} Whether or not recording is in progess
   */
  const isRecording = () => {
    return timer instanceof Timeout;
  };

  /**
   * If recording is in progress, stops recording and emits a speechRecordingStopped event
   *
   * @name stopSpeechRecording
   * @function
   * @memberof module:node-rpi-feeder/raspi/speech
   * @fires module:node-rpi-feeder/raspi#speechRecordingStopped
   */
  const stopSpeechRecording = () => {
    if (isRecording()) {
      recording.stop();

      // Clear timer
      clearTimeout(timer);
      timer = null;

      logger.info("Speech recording stopped");

      emitter.emit("speechRecordingStopped", {
        message: "Speech recording stopped",
        status: "success"
      });
    }
  };

  /**
   * Starts recording and emits a speechRecordingStarted event. Can also emit a speechRecordingRecognized event if the hotword is detected
   *
   * @name startSpeechRecording
   * @function
   * @memberof module:node-rpi-feeder/raspi/speech
   * @fires module:node-rpi-feeder/raspi#speechRecordingRecognize
   * @fires module:node-rpi-feeder/raspi#speechRecordingStopped
   */
  const startSpeechRecording = () => {
    // Create a recognize stream
    const recognizeStream = client
      .streamingRecognize(request)
      .on("error", (err) => {
        logger.error(`Speech recording error: ${err}`);
      })
      .on("data", (data) => {
        if (data.results[0] && data.results[0].alternatives[0]) {
          const transcription = data.results[0].alternatives[0].transcript.trim().toLowerCase();
          logger.info(`Speech recording transcription: ${transcription}`);

          if (config.get("raspi.speech.hotwords").includes(transcription)) {
            emitter.emit("speechRecordingRecognized", {
              message: "Speech recording recognized",
              status: "success"
            });
          }
        } else {
          logger.error("Speech recording error: Reached transcription time limit");
        }
      });

    recording = recorder.record({
      device: config.get("raspi.speech.device"),
      recorder: "sox",
      sampleRate: request.config.sampleRateHertz
    });

    recording
      .stream()
      .on("error", (err) => {
        logger.error(`Speech recording error: ${err}`);
      })
      .pipe(recognizeStream);

    // Start timer
    timer = setTimeout(() => {
      stopSpeechRecording();
    }, config.get("raspi.speech.timer"));

    logger.info("Speech recording started");

    emitter.emit("speechRecordingStarted", {
      message: "Speech recording started",
      status: "success"
    });
  };

  return {
    isRecording,
    startSpeechRecording
  };
};
