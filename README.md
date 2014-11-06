Mils Server
====

This is the backend of [Mils](https://milsapp.com).

The server is written in TypeScript on top of mongodb and node.js.


Setup
----

Apart from the node modules in package.json this repository requires Ghostscript (http://wiki.scribus.net/canvas/Installation_and_Configuration_of_Ghostscript) to be installed (pdf to image conversion).

On Mac OS X follow these instructions to install Cairo: https://github.com/LearnBoost/node-canvas/wiki/Installation---OSX

Keep In Mind
----

Please keep in mind that quite a few fils that are required to run the service (such as the mail dispatch strategies) are not included in this repository.