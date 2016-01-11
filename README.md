<h1>HAP-YeeLight</h1>

This Project is fork from HAP-NodeJS.

Binding with YeeLight Blue 2.



<hr>
<h3>Original README.md</h3>

HAP-NodeJS
==========

HAP-NodeJS is a Node.js implementation of HomeKit Accessory Server.

With this project, you should be able to create your own HomeKit Accessory on Raspberry Pi, Intel Edison or any other platform that can run Node.js :)

The implementation may not 100% follow the HAP MFi Specification since MFi program doesn't allow individual developer to join. 

Remember to run `npm install` before actually running the server.

Users can define their own accessories in: accessories/*name*_accessory.js files, where name is a short description of the accessory. All defined accessories get loaded on server start. You can define accessories using an object literal notation (see [Fan_accessory.js](accessories/Fan_accessory.js) for an example) or you can use the API (see below).

You can use the following command to start the HAP Server in Bridged mode:

```sh
node BridgedCore.js
```

Or if you wish to host each Accessory as an independent HomeKit device:

```sh
node Code.js
```

The HAP-NodeJS library uses the [debug](https://github.com/visionmedia/debug) library for log output. You can print some or all logs by setting the `DEBUG` environment variable. For instance, to see all debug logs while running the server:

```sh
DEBUG=* node BridgedCore.js
```

API
===

HAP-NodeJS provides a set of classes you can use to construct Accessories programatically. For an example implementation, see [Lock_accessory.js](accessories/Lock_accessory.js).

The key classes intended for use by API consumers are:

  * [Accessory](lib/Accessory.js): Represents a HomeKit device that can be published on your local network.
  * [Bridge](lib/Bridge.js): A kind of Accessory that can host other Accessories "behind" it while only publishing a single device.
  * [Service](lib/Service.js): Represents a set of grouped values necessary to provide a logical function. Most of the time, when you think of a supported HomeKit device like "Thermostat" or "Door Lock", you're actualy thinking of a Service. Accessories can expose multiple services.
  * [Characteristic](lib/Characteristic.js): Represents a particular typed variable assigned to a Service, for instance the `LockMechanism` Service contains a `CurrentDoorState` Characteristic describing whether the door is currently locked.

All known built-in Service and Characteristic types that HomeKit supports are exposed as a separate subclass in [HomeKitTypes](lib/gen/HomeKitTypes.js).

See each of the corresponding class files for more explanation and notes.

Notes
=====

Special thanks to [Alex Skalozub](https://twitter.com/pieceofsummer), who reverse engineered the server side HAP. ~~You can find his research at [here](https://gist.github.com/pieceofsummer/13272bf76ac1d6b58a30).~~ (Sadly, on Nov 4, Apple sent the [DMCA](https://github.com/github/dmca/blob/master/2014-11-04-Apple.md) request to Github to remove the research.)

[There](http://instagram.com/p/t4cPlcDksQ/) is a video demo running this project on Intel Edison.

If you are interested in HAP over BTLE, you might want to check [this](https://gist.github.com/KhaosT/6ff09ba71d306d4c1079).