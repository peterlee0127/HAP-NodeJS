var Accessory = require('../').Accessory;
var Service = require('../').Service;
var Characteristic = require('../').Characteristic;
var uuid = require('../').uuid;
var ble = require('./ble.js');

// here's a fake hardware device that we'll expose to HomeKit
var LightBulb = {
  powerOn: false,
  brightness: 100, // percentage
  hue:0,
  saturation:100,
  setHue: function(value) {
    // console.log("set light Hue:"+value);
    console.log(convertToRGB());
    LightBulb.hue = value;
  },
  setSaturation: function(value) {
    // console.log("set light Saturation:"+value);
    LightBulb.saturation = value;
    console.log(convertToRGB());
  },
  setPowerOn: function(on) {
    // console.log("Turning the light %s!", on ? "on" : "off");
    LightBulb.powerOn = on;
  },
  setBrightness: function(brightness) {
    // console.log("Setting light brightness to %s", brightness);
    LightBulb.brightness = brightness;
  },
  identify: function() {
    console.log("Identify the light!");
  }
}

function convertToRGB() {
  return hslToRgb(LightBulb.hue/360,LightBulb.saturation/100,LightBulb.brightness/100);
}

// Generate a consistent UUID for our light Accessory that will remain the same even when
// restarting our server. We use the `uuid.generate` helper function to create a deterministic
// UUID based on an arbitrary "namespace" and the word "light".
var lightUUID = uuid.generate('hap-nodejs:accessories:light');

// This is the Accessory that we'll return to HAP-NodeJS that represents our fake light.
var light = exports.accessory = new Accessory('Light', lightUUID);

// Add properties for publishing (in case we're using Core.js and not BridgedCore.js)
light.username = "1A:2B:4C:3D:6E:FF";
light.pincode = "031-45-154";

console.log("Light Pair PinCode:"+light.pincode);

// set some basic properties (these values are arbitrary and setting them is optional)
light
  .getService(Service.AccessoryInformation)
  .setCharacteristic(Characteristic.Manufacturer, "YeeLight")
  .setCharacteristic(Characteristic.Model, "Rev-1")
  .setCharacteristic(Characteristic.SerialNumber, "A1S2NASF88EW");
  // .setCharacteristic('00000013-0000-1000-8000-0026bb765291',"Hue");

// listen for the "identify" event for this Accessory
light.on('identify', function(paired, callback) {
  LightBulb.identify();
  callback(); // success
});

// Add the actual Lightbulb Service and listen for change events from iOS.
// We can see the complete list of Services and Characteristics in `lib/gen/HomeKitTypes.js`
light
  .addService(Service.Lightbulb, "YeeLight") // services exposed to the user should have "names" like "Fake Light" for us
  .getCharacteristic(Characteristic.On)
  .on('set', function(value, callback) {
    LightBulb.setPowerOn(value);
    if(value==false) {
      ble.TurnOff();
    }else {
      ble.TurnOn();
    }
    callback(); // Our fake Light is synchronous - this value has been successfully set
  });

// We want to intercept requests for our current power state so we can query the hardware itself instead of
// allowing HAP-NodeJS to return the cached Characteristic.value.
light
  .getService(Service.Lightbulb)
  .getCharacteristic(Characteristic.On)
  .on('get', function(callback) {
    // this event is emitted when you ask Siri directly whether your light is on or not. you might query
    // the light hardware itself to find this out, then call the callback. But if you take longer than a
    // few seconds to respond, Siri will give up.

    var err = null; // in case there were any problems

    if (LightBulb.powerOn) {
      console.log("Are we on? Yes.");
      callback(err, true);
    }
    else {
      console.log("Are we on? No.");
      callback(err, false);
    }
  });

// also add an "optional" Characteristic for Brightness
light
  .getService(Service.Lightbulb)
  .addCharacteristic(Characteristic.Brightness)
  .on('get', function(callback) {
    callback(null, LightBulb.brightness);
  })
  .on('set', function(value, callback) {
    LightBulb.setBrightness(value);
  	ble.changeBrightness(value);
    callback();
  })

  light
    .getService(Service.Lightbulb)
    .addCharacteristic(Characteristic.Hue)
    .on('get', function(callback) {
      callback(null, LightBulb.hue);
    })
    .on('set', function(value, callback) {
      LightBulb.setHue(value);
      callback();
    })

    light
      .getService(Service.Lightbulb)
      .addCharacteristic(Characteristic.Saturation)
      .on('get', function(callback) {
        callback(null, LightBulb.saturation);
      })
      .on('set', function(value, callback) {
        LightBulb.setSaturation(value);
        callback();
      })


      /**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  l       The lightness
 * @return  Array           The RGB representation
 */
function hslToRgb(h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}
