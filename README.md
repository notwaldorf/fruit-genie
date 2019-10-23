# Teensy Midi

Set up a Teensy controller to act as a MIDI input device. This is
based on the [Fruit Genie](https://github.com/Deeplocal/fruit-genie) code
by Deeplocal (which was used at Google I/O in a performance by the
Flaming Lips!), with all the Piano Genie code stripped out. You can read
more about Fruit Genie in this [Magenta blog post](https://magenta.tensorflow.org/fruitgenie).

## Setup
1. Follow the [Teensy setup code](https://github.com/Deeplocal/fruit-genie#step-2-flash-your-teensy)
from Deeplocal. You don't need to worry about the Raspberry Pi setup since you'll
just be using your computer.

2. Install dependencies:
```
cd controller
npm install
```
I had some problems with this step, namely [this error](https://github.com/Deeplocal/fruit-genie/issues/4). Installing the MacOS headers as mentioned in the issue, whatever they are, fixed it.

## Run
Connect your teensy, stick its wires in some fruits, and then run `npm start` on your computer. You will
most likely have to update `PORT_NAME` in `app.js` to the name of your
serial port. `app.js` prints all the names on start up, so you can pick it up
from there.

This project uses 8 buttons by default. If you want to use more buttons,
there's comments in the code on where you have to update the code.

## Use it with Piano Genie
I used this setup to control [Piano Genie](https://piano-genie.glitch.me/),
which is a demo of a Machine Learning algorithm that summarized the 88 keys
of a piano to 8, and then uses those 8 to play magically sounding piano performances.
If you want to do that, then follow the steps in the `Run` section, and then:

0. Make sure the node app is actually running, so that it's registered itself
as a MIDI device
1. In your browser, go to https://piano-genie.glitch.me/
2. After you dismiss the splash, click on the gear button
3. Check "Use Midi Input", and pick "Teensy MIDI" from the device list
4. Start banging on the connected fruit. It should have the same effect as
pressing the 1-8 buttons in the demo: you should hear music and see notes dripping.

Tons of thanks to [Deeplocal](https://github.com/Deeplocal)
