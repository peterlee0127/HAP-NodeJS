var noble = require('noble');
var util = require('util');

require('events').EventEmitter.prototype._maxListeners = 100;

var SERVICE_UUID                = 'fff0';  // for yeeLight service

var CONTROL_UUID                = 'fff1';  // for control
var DELAY_UUID                  = 'fff2';  // set delay on/off for LED
var DELAY_STATUS_QUERY_UUID     = 'fff3';  // query the status of delay on/off
var DELAY_STATUS_RESPONSE_UUID  = 'fff4';  // notify the status of delay on/off
var STATUS_QUERY_UUID_UUID      = 'fff5';  // query thhe status of delay on/off
var STATUS_RESPONSE_UUID        = 'fff6';  // notify the status LED
var COLORFLOW_UUID              = 'fff7';  // set the color flow for LED
var LED_NAME_UUID               = 'fff8';  // set the name of LED
var LED_NAME_RESPONSE_UUID      = 'fff9';  // notify the name of LED
var EFFECT_UUID                 = 'fffc';  // set the effect of color change

class YeeLight {
    setAddress(addr){
        this.address = addr;
    };
    setDevice(dev){
        this.device = dev;
    }
    setCharacteristics(chara){
        this.characteristics = chara;
    }
}

var setupTime = 3;
var lock = false;
var devices = [];

var allServices = [ CONTROL_UUID,
    DELAY_UUID,
    DELAY_STATUS_QUERY_UUID,
    DELAY_STATUS_RESPONSE_UUID,
    STATUS_QUERY_UUID_UUID,
    STATUS_RESPONSE_UUID,
    COLORFLOW_UUID,
    LED_NAME_UUID,
    LED_NAME_RESPONSE_UUID,
    EFFECT_UUID             ];

    noble.on('stateChange', function(state) {
        if (state === 'poweredOn'){
	    setTimeout(startDiscover,1000);
	    setTimeout(checkNumOfLight,15000);
            setInterval(checkNumOfLight, 1000*60*10);
        }
        else{
            console.log("ble state:"+state);
            // noble.stopScanning();
        }
    });
    
    function checkNumOfLight() {
	if(devices.length!=3 || Object.keys(noble._peripherals).length != 3) {
  		console.error("not connect to 3, exit");
        	crash 
	}
   }
   
    function startDiscover(){
        console.log("startDiscover..");
        allPeripheral = [];
	noble.startScanning([SERVICE_UUID]);
        noble.on('discover', function(peripheral) {
            var macAddress = peripheral.uuid;// var rss = peripheral.rssi;
            var localName = peripheral.advertisement.localName;
            if(localName!="Yeelight Blue II") {
                return
            }
	    if(macAddress=='544a161fa6cd'){
		return;
	    }
            console.log("discover:"+macAddress);
            var found = false;
			for(var i=0;i<devices.length;i++){
			  if(devices[i].address==peripheral.address){
			 	found = true;
              }
			}
            if(found){
                return;
            }
            
            setTimeout(function(){
            

            peripheral.connect(function(error){
                if(error){console.log(error);}
			
                if(!found){	
                    console.log("connected:"+peripheral.address);
                    var yeelight = new YeeLight();
                    yeelight.setDevice(peripheral);
                    yeelight.setAddress(peripheral.address);
                }

                peripheral.discoverServices([SERVICE_UUID], function(error, services) {
                        var deviceInformationService = services[0];
                        deviceInformationService.discoverCharacteristics(allServices, function(error, characteristics) {
                            var characteristic = [];
                            for (var i in characteristics) {
                                characteristic.push(characteristics[i]);
                            }
                            yeelight.setCharacteristics(characteristic);
                            devices.push(yeelight)
                        });
                    });
                });
            },1500);
            peripheral.on('disconnect', function(){
                    if(lock){
                        return;
                    }
                    lock = true;
                    disConnectAll();
                    setTimeout(function(){
                        lock = false;
                        console.log("restart");  
                        devices = [];
                        noble.stopScanning();
                        exit();
                      //  startDiscover(); // will crash here,for trick rescan,use nodejs forever module
                    }, 4000);
            });
        });
    }

    exports.startDiscover = startDiscover;

    function disConnectAll(){
        for (var index in noble._peripherals){
            noble._peripherals[index].disconnect(function(err){
                if(err){console.log(err); }
            });
        }
        console.log("disConnectAll");
    };
    exports.disConnectAll = disConnectAll


    function findForCharacters(characters,Service_UUID){
        for(index in characters){
            if(characters[index].uuid==Service_UUID){
                return characters[index];
            }
        }
    };


    exports.randomColor = function randomColor(){

    };

    exports.TurnOn = function turnOn(address){
        var dev = getDevice(address);        
        if(dev){
            var character=findForCharacters(dev.characteristics,CONTROL_UUID);
            character.write(new Buffer("CLTMP 6500,100,,,%"), false, function(error) { 
			if(error){console.error(error)};
		});

        }
    };

    exports.changeBrightness = function changeBrightness(address,brightness) {
    var dev = getDevice(address);
     if(dev) {
	     var command = util.format("CLTMP 6500,%d",brightness);
	     for(var i=command.length; i<17; i++) {
		     command+=',';
	     }
	     command+='%';
            var chcharacter=findForCharacters(dev.characteristics,CONTROL_UUID);
            chcharacter.write(new Buffer(command), false, function(error) {
                 if(error){console.log(error);}
            });
            //CLTMP 6500,45,,,,,,%

        }

	}
    function getDevice(address) {
        for(var index in devices){
            var dev = devices[index];
            if(dev.address==address){
                return dev;
            }
        }
    }
    exports.getDevice = getDevice();
    
    exports.TurnOff = function turnOff(address){
        var dev = getDevice(address);
        if(dev){
            var chcharacter=findForCharacters(dev.characteristics,CONTROL_UUID);
            controlLight(chcharacter,null,null,null,0);
	    }
    };

    function hslToRgb(h, s, l){
   //hue,saturation,light;
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



    exports.changeColorRGB = function changeColorRGB(red,green,blue,brightness){
        for(var index in allDevices){
            var chcharacter=findForCharacters(allDevices[index],CONTROL_UUID);
            controlLight(chcharacter,red,green,blue,brightness);
        }
    };

    exports.changeColorHSL = function changeColorHSL(h,s){
        var color = hslToRgb(h/360,s/100,0.5);
        for(var index in allDevices){
            var chcharacter=findForCharacters(allDevices[index],CONTROL_UUID);
            controlLight(chcharacter,color[0],color[1],color[2],100);
        }
    
    }

    function controlLight(characteristics,red,green,blue,brightness){
        var command = util.format('%d,%d,%d,%d', red, green, blue, brightness);
        for (var j = command.length; j < 18; j++) {
            command += ',';
        }
        characteristics.write(new Buffer(command), false, function(error) {
            if(error){console.error(error);}
        });
    }
