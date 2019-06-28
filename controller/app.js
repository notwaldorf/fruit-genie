// You will probably have to change this with whatever your usb device is
// called. When you run `npm start`, this will first print all your serial
// port devices, so you can pick the name from there.
const PORT_NAME = '/dev/tty.usbmodem58887701';

// If you want to control more or fewer buttons, make sure to update the masks.
const NUM_BUTTONS                     = 8;
const FIRST_BUTTON_PRESSED_MASK       = 0b00000001;
const SECOND_BUTTON_PRESSED_MASK      = 0b00000010
const THIRD_BUTTON_PRESSED_MASK       = 0b00000100
const FOURTH_BUTTON_PRESSED_MASK      = 0b00001000
const FIFTH_BUTTON_PRESSED_MASK       = 0b00010000
const SIXTH_BUTTON_PRESSED_MASK       = 0b00100000
const SEVENTH_BUTTON_PRESSED_MASK     = 0b01000000
const EIGHTH_BUTTON_PRESSED_MASK      = 0b10000000

const SerialPort                      = require('serialport')
const easymidi                        = require('easymidi');
const ARDUINO_CONTROLLER_BAUD         = 9600;
const pressedMap                      = new Map()

// Start a fake MIDI input device, so that the fruit sends MIDI events
// which piano-genie the app can intercept.
const fakeMidiDevice = new easymidi.Output('Teensy MIDI', true);

SerialPort.list((err, devices) => {
  console.log(devices);
})

const arduino = new SerialPort(PORT_NAME, {
  baudRate: ARDUINO_CONTROLLER_BAUD
})

// Setup the arduino port to listen for key presses.
let Readline = SerialPort.parsers.Readline
let parser = new Readline()
arduino.pipe(parser);

parser.on('data', (data) => {
  let dataByte = parseInt(data.split('b')[1]);

  // If you change the number of devices, you'll also have to update this.
  let firstButton = !(FIRST_BUTTON_PRESSED_MASK & dataByte);
  let secondButton = !(SECOND_BUTTON_PRESSED_MASK & dataByte);
  let thirdButton = !(THIRD_BUTTON_PRESSED_MASK & dataByte);
  let fourthButton = !(FOURTH_BUTTON_PRESSED_MASK & dataByte);
  let fifthButton = !(FIFTH_BUTTON_PRESSED_MASK & dataByte);
  let sixthButton = !(SIXTH_BUTTON_PRESSED_MASK & dataByte);
  let seventhButton = !(SEVENTH_BUTTON_PRESSED_MASK & dataByte);
  let eighthButton = !(EIGHTH_BUTTON_PRESSED_MASK & dataByte);

  handleButtonValue(0, firstButton);
  handleButtonValue(1, secondButton);
  handleButtonValue(2, thirdButton);
  handleButtonValue(3, fourthButton);
  handleButtonValue(4, fifthButton);
  handleButtonValue(5, sixthButton);
  handleButtonValue(6, seventhButton);
  handleButtonValue(7, eighthButton);
})

function noteOn(button) {
  fakeMidiDevice.send('noteon', {
    note: button,
    velocity: 100
  });
}

function noteOff(button) {
  fakeMidiDevice.send('noteoff', {
    note: button,
    velocity: 100
  });
}

handleButtonValue = function(button, value) {
  if (pressedMap.has(button)) {
    if (pressedMap.get(button) != value) {
      if (!value) {
        console.log('⬇️ ', button, value);
        noteOn(button);
      } else {
        console.log('⬆️ ', button, value);
        noteOff(button);
      }
    }
  }
  pressedMap.set(button, value);
}

process.on('exit', function(code) {
  fakeMidiDevice.close();

  // Turn off any stray notes
  for (let i = 0 ; i < NUM_BUTTONS; i++) {
    noteOff(i)
  }

  return console.log(`About to exit with code ${code}`);
});
