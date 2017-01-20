var Accessory = require('../').Accessory;
var Service = require('../').Service;
var Characteristic = require('../').Characteristic;
var uuid = require('../').uuid;
var ble = require('./ble.js');

<<<<<<< HEAD
// here's a fake hardware device that we'll expose to HomeKit
var LightBulb = {
  powerOn: true,
  brightness: 100, // percentage
  hue:360,
  saturation:100,
  setHue: function(value) {
    // console.log("set light Hue:"+value);
    LightBulb.hue = value;
    changeColor();
  },
  setSaturation: function(value) {
    // console.log("set light Saturation:"+value);
    LightBulb.saturation = value;
    changeColor();
  },
  setPowerOn: function(on) {
    // console.log("Turning the light %s!", on ? "on" : "off");
    LightBulb.powerOn = on;
  },
  setBrightness: function(brightness) {
    // console.log("Setting light brightness to %s", brightness);
    LightBulb.brightness = brightness;
    changeColor();
=======
var LightController = {
  name: "Simple Light", //name of accessory
  pincode: "031-45-154",
  username: "FA:3C:ED:5A:1A:1A", // MAC like address used by HomeKit to differentiate accessories. 
  manufacturer: "HAP-NodeJS", //manufacturer (optional)
  model: "v1.0", //model (optional)
  serialNumber: "A12S345KGB", //serial number (optional)

  power: false, //curent power status
  brightness: 100, //current brightness
  hue: 0, //current hue
  saturation: 0, //current saturation

  outputLogs: false, //output logs

  setPower: function(status) { //set power of accessory
    if(this.outputLogs) console.log("Turning the '%s' %s", this.name, status ? "on" : "off");
    this.power = status;
  },

  getPower: function() { //get power of accessory
    if(this.outputLogs) console.log("'%s' is %s.", this.name, this.power ? "on" : "off");
    return this.power ? true : false;
  },

  setBrightness: function(brightness) { //set brightness
    if(this.outputLogs) console.log("Setting '%s' brightness to %s", this.name, brightness);
    this.brightness = brightness;
  },

  getBrightness: function() { //get brightness
    if(this.outputLogs) console.log("'%s' brightness is %s", this.name, this.brightness);
    return this.brightness;
  },

  setSaturation: function(saturation) { //set brightness
    if(this.outputLogs) console.log("Setting '%s' saturation to %s", this.name, saturation);
    this.saturation = saturation;
>>>>>>> 1cbf0352f44d9cca696267ec592478afcac3bd00
  },

  getSaturation: function() { //get brightness
    if(this.outputLogs) console.log("'%s' saturation is %s", this.name, this.saturation);
    return this.saturation;
  },

  setHue: function(hue) { //set brightness
    if(this.outputLogs) console.log("Setting '%s' hue to %s", this.name, hue);
    this.hue = hue;
  },

  getHue: function() { //get hue
    if(this.outputLogs) console.log("'%s' hue is %s", this.name, this.hue);
    return this.hue;
  },

  identify: function() { //identify the accessory
    if(this.outputLogs) console.log("Identify the '%s'", this.name);
  }
}

function changeColor() {
  var color = convertToRGB();
  ble.changeColor(color[0],color[1],color[2],LightBulb.brightness);
}


// Generate a consistent UUID for our light Accessory that will remain the same even when
// restarting our server. We use the `uuid.generate` helper function to create a deterministic
// UUID based on an arbitrary "namespace" and the word "light".
var lightUUID = uuid.generate('hap-nodejs:accessories:light' + LightController.name);

// This is the Accessory that we'll return to HAP-NodeJS that represents our light.
var lightAccessory = exports.accessory = new Accessory(LightController.name, lightUUID);

// Add properties for publishing (in case we're using Core.js and not BridgedCore.js)
<<<<<<< HEAD
light.username = "1A:2B:4C:3D:6E:FF";
light.pincode = "031-45-154";
=======
lightAccessory.username = LightController.username;
lightAccessory.pincode = LightController.pincode;
>>>>>>> 1cbf0352f44d9cca696267ec592478afcac3bd00

console.log("Light Pair PinCode:"+light.pincode);

// set some basic properties (these values are arbitrary and setting them is optional)
lightAccessory
  .getService(Service.AccessoryInformation)
<<<<<<< HEAD
  .setCharacteristic(Characteristic.Manufacturer, "YeeLight")
  .setCharacteristic(Characteristic.Model, "Rev-1")
  .setCharacteristic(Characteristic.SerialNumber, "A1S2NASF88EW");
  // .setCharacteristic('00000013-0000-1000-8000-0026bb765291',"Hue");

// listen for the "identify" event for this Accessory
light.on('identify', function(paired, callback) {
  LightBulb.identify();
  callback(); // success
=======
    .setCharacteristic(Characteristic.Manufacturer, LightController.manufacturer)
    .setCharacteristic(Characteristic.Model, LightController.model)
    .setCharacteristic(Characteristic.SerialNumber, LightController.serialNumber);

// listen for the "identify" event for this Accessory
lightAccessory.on('identify', function(paired, callback) {
  LightController.identify();
  callback();
>>>>>>> 1cbf0352f44d9cca696267ec592478afcac3bd00
});

// Add the actual Lightbulb Service and listen for change events from iOS.
// We can see the complete list of Services and Characteristics in `lib/gen/HomeKitTypes.js`
<<<<<<< HEAD
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
=======
lightAccessory
  .addService(Service.Lightbulb, LightController.name) // services exposed to the user should have "names" like "Light" for this case
  .getCharacteristic(Characteristic.On)
  .on('set', function(value, callback) {
    LightController.setPower(value);
>>>>>>> 1cbf0352f44d9cca696267ec592478afcac3bd00

    // Our light is synchronous - this value has been successfully set
    // Invoke the callback when you finished processing the request
    // If it's going to take more than 1s to finish the request, try to invoke the callback
    // after getting the request instead of after finishing it. This avoids blocking other
    // requests from HomeKit.
    callback();
  })
  // We want to intercept requests for our current power state so we can query the hardware itself instead of
  // allowing HAP-NodeJS to return the cached Characteristic.value.
  .on('get', function(callback) {
<<<<<<< HEAD
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
=======
    callback(null, LightController.getPower());
>>>>>>> 1cbf0352f44d9cca696267ec592478afcac3bd00
  });

// To inform HomeKit about changes occurred outside of HomeKit (like user physically turn on the light)
// Please use Characteristic.updateValue
// 
// lightAccessory
//   .getService(Service.Lightbulb)
//   .getCharacteristic(Characteristic.On)
//   .updateValue(true);

// also add an "optional" Characteristic for Brightness
lightAccessory
  .getService(Service.Lightbulb)
  .addCharacteristic(Characteristic.Brightness)
  .on('set', function(value, callback) {
    LightController.setBrightness(value);
    callback();
  })
  .on('get', function(callback) {
<<<<<<< HEAD
    callback(null, LightBulb.brightness);
=======
    callback(null, LightController.getBrightness());
  });

// also add an "optional" Characteristic for Saturation
lightAccessory
  .getService(Service.Lightbulb)
  .addCharacteristic(Characteristic.Saturation)
  .on('set', function(value, callback) {
    LightController.setSaturation(value);
    callback();
>>>>>>> 1cbf0352f44d9cca696267ec592478afcac3bd00
  })
  .on('get', function(callback) {
    callback(null, LightController.getSaturation());
  });

// also add an "optional" Characteristic for Hue
lightAccessory
  .getService(Service.Lightbulb)
  .addCharacteristic(Characteristic.Hue)
  .on('set', function(value, callback) {
<<<<<<< HEAD
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

    function convertToRGB() {
        return hslToRgb(LightBulb.hue/360,LightBulb.saturation/100,LightBulb.brightness/100);
    }

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
=======
    LightController.setHue(value);
    callback();
  })
  .on('get', function(callback) {
    callback(null, LightController.getHue());
  });
>>>>>>> 1cbf0352f44d9cca696267ec592478afcac3bd00
