# node-rpi-feeder

Pet feeder with live stream and hotword detection powered by a Raspberry Pi 3 Model B and Node.js.

## Motivation

I have two african grey parrots and one of them knows how to ask for food in my language which is portuguese. However he can get impacient really fast if no one gives him a snack in the meantime. By impacient I mean repeating the same word over and over again and making strange noises until someone actually gives him what he wants. After all he just wants attention and of course his snack!

So the plan was that when he asks for food, detect the hotword and trigger the feeder to drop a snack or treat.

On the other hand, the live stream feature allows to see if everything is going ok with the parrots while not being at home.

The end result was a prototype to explore the possibilities of the Raspberry Pi 3 Model B, with Node.js by making use of small servo motor connected to the GPIO and additional hardware such as the Pi-camera and a microphone. Additionally, the user can access a simple web app, using any modern browser, where it is possible to trigger the feeder manually, watch the live stream and toggle the speech recognition on and off.

## Getting started

⚠️This project was designed to be run on the Raspberry Pi as it will require access to the GPIO interface and will also look for the Pi-camera, therefore it will throw an error if executed on a device other than the Raspberry Pi.

![Overview](https://github.com/pgrodrigues/node-rpi-feeder/blob/master/public/images/overview.jpg?raw=true "Overview of the project")

### Setting up the Raspberry Pi

If you do not have Raspberry Pi with Raspbian OS or Node.js installed you can follow the instructions [here](CONFIGURATION.md).

After setting up the Raspberry Pi, there are other hardware components that need to be connected for the app to work:

- An SG-90 servo motor similar to the one shown [here](https://components101.com/servo-motor-basics-pinout-datasheet). Red wire connected to pin 2 which represents the DC power of +5v, brown wire connected to pin 6 which represents the ground and finally orange wire connected to GPIO12 (pin 32) where the PWM signal will allow to operate the motor;
- Pi-camera connected on the camera port;
- Microphone which is connected to a [USB sound card](https://nedis.com/en-us/product/computer/audio/soundcards/550670257/sound-card-3d-sound-51-usb-20-double-35-mm-connector).

### Configuring the Pi-camera:

```bash
sudo raspi-config
```

Then in the menu choose `Interfacing Options > Camera`, press enter to enable and reboot the system.
To test if the Pi-camera is working run in the console:

```bash
raspistill -v -o test.jpg
```

### Installing SoX:

SoX provides manipulation features for audio files and will be used when recording with the microphone and converting to desired formats. It can be installed by performing:

```bash
sudo apt-get install sox libsox-fmt-all
```

### Configuring Google Cloud Speech API:

The hotword detection process requires the audio stream to be sent to [Google Cloud Speech API](https://cloud.google.com/speech-to-text/) which is where the speech recognition takes place and then the result sent back to the app where feeding may or may not take place. Therefore it is required to perform the steps described in the [Before you begin](https://github.com/googleapis/nodejs-speech#before-you-begin) section of their documentation, such as creating a Cloud Platform project, enabling the Cloud Speech API and setting up the authentication with a service account. After finishing the steps mentioned just replace the content of `google-service-account.json` file and update the `raspi.speech.google.projectId` property in `config/default.json` with the your Google Cloud Platform Project Id.

There are other platforms that offer similar services regarding speech recognition, but for the purpose of this project, the integration was done using Google Cloud Speech API.

## Settings

There are some parameters that can/should be adjusted:

| Parameter                       | Default value                            | Type    | Description                                                                                                                                                                                                 |
| ------------------------------- | ---------------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| server.certificate              | `"./config/ssl/cert.crt"`                | String  | Path to the certificate file (requires `server.secure` to be `true`)                                                                                                                                        |
| server.port                     | 3000                                     | Number  | Port that will be used by the webserver (8443 in production)                                                                                                                                                |
| server.privateKey               | `"./config/ssl/key.key"`                 | String  | Path to the private key file (requires `server.secure` to be `true`)                                                                                                                                        |
| server.secure                   | false                                    | Boolean | Enable HTTPS for the webserver (`NODE_ENV` must be set to `"production"`)                                                                                                                                   |
| raspi.camera.outputDirectory    | `"camera"`                               | String  | Directory where the pictures taken by the Pi-camera will be saved                                                                                                                                           |
| raspi.camera.timelapseInterval  | 1000                                     | Number  | Time interval between taking pictures (ms)                                                                                                                                                                  |
| raspi.feeder.timer              | 100                                      | Number  | Time interval to stop feeding after feeding started (ms). Should be adjusted so that it is enough time for the feeder to open, drop a snack and close                                                       |
| raspi.speech.device             | `"hw:1,0"`                               | String  | Recording device. This value specifies the sound card and recording device to be used                                                                                                                       |
| raspi.speech.google.credentials | `"./config/google-service-account.json"` | String  | Path to the Google service account JSON file                                                                                                                                                                |
| raspi.speech.google.projectId   | `"node-rpi-feeder"`                      | String  | Project Id from Google Cloud Platform                                                                                                                                                                       |
| raspi.speech.hotwords           | `["word1", "word2"]`                     | Array   | Array of words to compare against the speech transcription                                                                                                                                                  |
| raspi.speech.timer              | 2000                                     | Number  | Time interval to stop speech recording after recording started (ms). Useful given the quota limit specified by Google Cloud Speech-to-Text API (at the time of this writing, free for 0 - 60 minutes/month) |

When running in development mode it will be used the config specified in `config/default.json`. When running in production mode it will still be used the same config however overridden by `config/production.json`.

## Running the app

```bash
# Install all the dependencies
npm install
# Run the app in development mode
npm start
# Or run the app in production mode
npm run start-prod
```

## Logs

The logs generated by the app are stored in the `logs` directory inside the project directory.

## Documentation

To generate the documentation run:

```bash
npm run docs
```

A `docs` directory containing the documentation will be created in the project directory.

## Author

Pedro Rodrigues
