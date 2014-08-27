/// <reference path='./../../../vendor/typescript-node-definitions/node.d.ts'/>

import Location = require('./Location')

class Geocoder {
    static geocode(address: string, callback: (error: Error, location?: Location) => void) {
        var geocoderProvider = 'google';
        var httpAdapter = 'https';

        // optionnal
        var extra = {
            apiKey: 'AIzaSyDTVeZO2Oqr_80tLrlPWVFfZOL0KOeCXEo', // for map quest
            formatter: null // 'gpx', 'string', ...
        };

        var geocoder = require('node-geocoder').getGeocoder(geocoderProvider, httpAdapter, extra);

        // Using callback
        geocoder.geocode(address, function(err: any, res) {
            if (err != false) {
                callback(err);
                return;
            }

            if (res.length < 1) {
                callback(new Error("No results were found."))
                return;
            }

            var loc = new Location();
            loc.latitude = parseFloat(res[0].latitude);
            loc.longitude = parseFloat(res[0].longitude);
            loc.country = res[0].country;
            loc.countryCode = res[0].countryCode;
            loc.city = res[0].city;
            loc.zipcode = res[0].zipcode;
            loc.streetName = res[0].streetName;
            loc.streetNumber = res[0].streetNumber;
            loc.state = res[0].state;
            loc.stateCode = res[0].stateCode;

            callback(undefined, loc);
        });
    }
}

export = Geocoder;