# Raspberry Pi Configuration

## Requirements

- Raspberry Pi 3 Model B (Oh really?);
- HDMI television or monitor and cable;
- USB keyboard and mouse;
- MicroSD card (at least 8GB) and card reader;
- Power supply (mine has an output of 5.1V - 2.5A);
- Jumper wires (I used female to female jumper wires).

## Setting up the Raspbian OS

Since it will be used Raspbian OS, the first step is to get the latest image with desktop from the [official website](https://www.raspberrypi.org/downloads/raspbian/) and flash it to a microSD card. This can be achieved by using [Etcher](https://etcher.io/) which simplifies the process of writing an image file to a micro SD card.
The next step is to insert the microSD card into the Raspberry Pi, and once it boots, follow the automatic wizard to make some initial configurations such as the country, language, timezone, keyboard and the user. It will also look for updates and install them automatically if you are connected to a network. If not, run the following commands:

```bash
sudo apt-get update
sudo apt-get dist-upgrade
```

## Installing Node.js:

At the time of this writing, the latest Node.js version was 13.

```bash
curl -sL https://deb.nodesource.com/setup_13.x | sudo -E bash -
sudo apt-get install -y nodejs
```
