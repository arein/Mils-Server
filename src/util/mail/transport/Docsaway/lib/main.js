/* Copyright 2014 Alexander-Derek Rein, see LICENSE */

var SENDMAIL_ERROR_MESSAGES = {
  '001': {
	  key: 'errStringEmpty',
	  value: 'Submitting an empty value for a mandatory field.'
  },
  '002': {
	  key: 'errUserAuthentication',
	  value: 'User authentication information is incorrect.'
  },
  '003': {
	  key: 'errAccountDeactivated ',
	  value: 'User account has been deactivated.'
  },
  '004': {
	  key: 'errCharsetNotRecognized',
	  value: ' Entered character set has not been recognized. '
  },
  '005': {
	  key: 'errCharsetNotSet',
	  value: 'Character set was not specified.'
  },
  '006': {
	  key: 'errSetOrderIncorrect',
	  value: 'Set methods declared in incorrect order.'
  },
  '007': {
	  key: 'errCharsetConversion',
	  value: 'Character set used for SET methods has failed to convert to system character set.'
  },
  '008': {
	  key: 'errStringLength',
	  value: 'Submitted a string length larger than allowed.'
  },
  '009': {
	  key: 'errStringFormat ISO-3166-1 ',
	  value: 'Country code not recognized.'
  },
  '010': {
	  key: 'errModeNotRecognized',
	  value: 'API mode not recognized.'
  },
  '011': {
	  key: 'errBase64BinaryEmpty',
	  value: 'File method empty, PDF not set.'
  },
  '012': {
	  key: 'errPasswordDenied',
	  value: 'PDF password does not match the account password.'
  },
  '013': {
	  key: 'errFileOpeningFailure',
	  value: 'API class failed to open uploaded PDF'
  },
  '014': {
	  key: 'errFileNotSaved',
	  value: 'API class failed to save uploaded PDF'
  },
  '015': {
	  key: 'errFileSize0kb',
	  value: 'The uploaded PDF document was empty'
  },
  '016': {
	  key: 'errFileNotFound',
	  value: 'PDF document not located by the API class.'
  },
  '017': {
	  key: 'errFileTypeIncorrect',
	  value: 'Document uploaded was not a PDF.'
  },
  '018': {
	  key: 'errPageCountSystemFailure',
	  value: 'API page count class failed.'
  },
  '019': {
	  key: 'errMaxCountExceeded',
	  value: 'PDF document exceeded maximum allowed pages.'
  },
  '020': {
	  key: 'errValueNotRecognized',
	  value: 'A value specified within the setPrintingStation() method was not recognized.'
  },
  '021': {
	  key: 'errStationNotFound',
	  value: 'Specified printing station was not found.'
  },
  '022': {
	  key: 'errCourierNotAvailable',
	  value: 'Specified courier is not available.'
  },
  '023': {
	  key: 'errInkUnsupported',
	  value: 'Specified ink setting for a selected station is not available.'
  },
  '024': {
	  key: 'errRecipientCountryUnsupported',
	  value: 'Specified printing station does not support the recipients country'
  },
  '025': {
	  key: 'errStationNotRecognized',
	  value: 'Specified printing station was not recognized.'
  },
  '026': {
	  key: 'errPropertySetting',
	  value: 'Mandatory properties needed to locate the printing station are incorrect.'
  },
  '027': {
	  key: 'errSystemError',
	  value: 'An internal script error has occurred and was captured.'
  },
  '028': {
	  key: 'errPDFGenerationFailure',
	  value: 'An internal script error occurred while accessing the coversheet class.'
  },
  '029': {
	  key: 'errCalculationFailure',
	  value: 'An internal script error occurred while accessing the pricing class.'
  },
  '030': {
	  key: 'errStorageFailure',
	  value: 'An internal script error occurred while accessing the database.'
  },
  '031': {
	  key: 'errCombineDocsFailure',
	  value: 'An internal script error occurred while merging coversheet and PDF document.'
  },
  '032': {
	  key: 'errInsufficientFunds',
	  value: 'Your account has insufficient funds for your document transaction.'
  },
  '033': {
	  key: 'errStatusUpdateFailure',
	  value: 'An internal error occurred while changing the status of your transaction.'
  },
  '034': {
	  key: 'errStationBlockPresent',
	  value: 'Your selected station can not be used as you have selected the stations country as blocked in your account.'
  },
  '035': {
	  key: 'errMaxFileSizeExceeded',
	  value: 'Your PDF document exceeds the maximum file size allowed, currently set at 2Mb.'
  },
  '036': {
	  key: 'errLockTimeoutExceeded',
	  value: 'The server is extremely busy to the point access for account update couldn\'t be given.'
  },
  '037': {
	  key: 'errSessionFailure',
	  value: 'The SOAP API uses sessions while interacting with client and server, a problem occurred when generating a session.'
  },
  '038': {
	  key: 'errCourierNotFound',
	  value: 'Specified courier was not found.'
  },
  '039': {
	  key: 'errPaperUnsupported',
	  value: 'Specified paper setting for a selected station is not available.'
  }
};

var FINDSTATION_ERROR_MESSAGES = {
  '001': {
	  key: 'errStringEmpty',
	  value: 'Submitting an empty value for a mandatory field.'
  },
  '002': {
	  key: 'errUserAuthentication',
	  value: 'User authentication information is incorrect.'
  },
  '003': {
	  key: 'errAccountDeactivated ',
	  value: 'User account has been deactivated.'
  },
  '004': {
	  key: 'errAPIConnectionNotFound',
	  value: ' API connection has not been found.'
  },
  '005': {
	  key: 'errFileNotFound',
	  value: 'File containing the data was not found, check method properties being submitted are correct.'
  },
  '006': {
	  key: 'errStringLength',
	  value: 'Submitted a string length larger than allowed.'
  },
  '007': {
	  key: 'errValueNotRecognized',
	  value: 'A value specified within a set method was not recognized.'
  },
  '008': {
	  key: 'errStringFormat ISO-3166-1 ',
	  value: 'Country code not recognized.'
  }
};

var PRICING_ERROR_MESSAGES = {
  '001': {
	  key: 'errStringEmpty',
	  value: 'Submitting an empty value for a mandatory field.'
  },
  '002': {
	  key: 'errUserAuthentication',
	  value: 'User authentication information is incorrect.'
  },
  '003': {
	  key: 'errAccountDeactivated ',
	  value: 'User account has been deactivated.'
  },
  '004': {
	  key: 'errAPIConnectionNotFound',
	  value: ' API connection has not been found.'
  },
  '005': {
	  key: 'errSetMethodEmpty',
	  value: 'A mandatory set method has not been set.'
  },
  '006': {
	  key: 'errStringLength',
	  value: 'Unable to calculate priceInAud.'
  },
  '007': {
	  key: 'errStringLength',
	  value: 'Submitted a string length larger than allowed.'
  },
  '008': {
	  key: 'errValueNotRecognized',
	  value: 'A value specified within a set method was not recognized.'
  },
  '009': {
	  key: 'errMaxCountExceeded',
	  value: 'PDF document page count exceeded maximum allowed pages.'
  }
};

var STATIONS = {
  'AU1': {
	  city: 'Terrigal',
	  country: 'Australia'
  },
  'BR1': {
	  city: 'Sorocaba',
	  country: 'Brazil'
  },
  'CA1': {
	  city: 'British Columbia',
	  country: 'Canada'
  },
  'CZ1': {
	  city: 'Neratovice',
	  country: 'Czech Republic'
  },
  'FR1': {
	  city: 'St. Claud',
	  country: 'France'
  },
  'DE1': {
	  city: 'Überlingen',
	  country: 'Germany'
  },
  'IN2': {
	  city: 'Girgaum',
	  country: 'India'
  },
  'NL1': {
	  city: 'Groningen',
	  country: 'Netherlands'
  },
  'NZ1': {
	  city: 'Te Awamutu',
	  country: 'New Zealand'
  },
  'PH1': {
	  city: 'Batangas',
	  country: 'Philippines'
  },
  'PT1': {
	  city: 'Lisbon',
	  country: 'Portugal'
  },
  'SG1': {
	  city: 'Singapore',
	  country: 'Singapore'
  },
  'ZA1': {
	  city: 'Cape Town',
	  country: 'South Africa'
  },
  'ES1': {
	  city: 'Guardamar Del Segura',
	  country: 'Spain'
  },
  'UA1': {
	  city: 'Odessa',
	  country: 'Ukraine'
  },
  'GB1': {
	  city: 'Northhampton',
	  country: 'United Kingdom'
  },
  'US1': {
	  city: 'Denver',
	  country: 'United States'
  }
};

var COURIERS = {
    'AU1_1': 'Australia Post',
    'AU1_2': 'Australia Post – Registered Post',
    'BR1_1': 'Correios Brasileiros',
    'CA1_1': 'Canada Post',
    'CZ1_1': 'Czech Post',
    'FR1_1': 'Prioritaire International',
    'DE1_1': 'Deutsche Post',
    'IN2_1': 'Indian Post',
    'NL1_1': 'Post NL',
    'NZ1_1': 'New Zealand Post',
    'PH1_1': 'Philpost',
    'PT1_1': 'CTT',
    'SG1_1': 'Singapore Post',
    'ZA1_1': 'SAPO',
    'ES1_1': 'Spanish Standard Mail',
    'UA1_1': 'Ukrainian Post',
    'GB1_1': 'Royal Mail',
    'US1_1': 'USPS'
};

var ACCOUNT_ERROR_MESSAGES = {
    '001': {
        key: 'errStringEmpty',
        value: 'Submitting an empty value for a mandatory field.'
    },
    '002': {
        key: 'errUserAuthentication',
        value: 'User authentication information is incorrect.'
    },
    '003': {
        key: 'errAccountDeactivated ',
        value: 'User account has been deactivated.'
    },
    '004': {
        key: 'errAPIConnectionNotFound',
        value: ' API connection has not been found.'
    },
    '005': {
        key: 'errReferenceNotFound',
        value: 'setAudit() method reference value not recognized.'
    },
    '006': {
        key: 'errPropertyNotRecognized',
        value: 'setAudit() method action value not recognized.'
    },
    '007': {
        key: 'errReferenceRestrictedAccess',
        value: 'setAudit() method reference specified is not accessible via your account.'
    },
    '008': {
        key: 'errStringLength',
        value: 'Submitted a string length larger than allowed.'
    }
};

/**
 * New node file
 */

// Constructor
function Client(email, installationKey, mode) {
	this.email = email;
	this.installationKey = installationKey;
	this.mode = mode;
}

// class methods
Client.prototype.sendMail = function(recipient, file, printBlackWhite, callback) {

    // The docsaway library requires NO instead of undefined
    recipient.address2 = (typeof recipient.address2 === 'undefined') ? false : recipient.address2;
    recipient.company = (typeof recipient.company === 'undefined') ? false : recipient.company;
    recipient.state = (typeof recipient.state === 'undefined') ? false : recipient.state;

	var validator = require('validator');
	if (validator.isNull(recipient.name)) {
        callback(new Error("The name may not be empty"), undefined);
        return;
    }

    if (recipient.name.length > 50) {
        callback(new Error("The FaxRecipient Name may not be longer than 50 Characters"), undefined);
        return;
    }

	if (recipient.company == null || typeof recipient.company === "undefined" || validator.isLength(recipient.company.toString(), 0, 0)) recipient.company = false;

	if (recipient.company !== false && validator.isNull(recipient.company)) {
        callback(new Error("The Company may either be false or empty"), undefined);
        return;
    }

    if (recipient.company !== false && recipient.company.length > 50) {
        callback(new Error("The FaxRecipient Company Name may not be longer than 50 Characters"), undefined);
        return;
    }

	if (validator.isNull(recipient.address1)) {
        callback(new Error("The address line 1 may not be empty"), undefined);
        return;
    }

    if (recipient.address1.length > 50) {
        callback(new Error("The FaxRecipient Address Line 1 may not be longer than 50 Characters"), undefined);
        return;
    }

	if (recipient.address2 == null || typeof recipient.address2 === "undefined" || validator.isLength(recipient.address2.toString(), 0, 0)) recipient.address2 = false;

	if (recipient.address2 !== false && validator.isNull(recipient.address2)) {
        callback(new Error("The Address line 2 may either be false or empty"), undefined);
        return;
    }

    if (recipient.address2 !== false && recipient.address2.length > 50) {
        callback(new Error("The FaxRecipient Address Line 2 may not be longer than 50 Characters"), null);
        return;
    }
	if (validator.isNull(recipient.city)) {
        callback(new Error("The City may not be empty"), undefined);
        return;
    }
    if (recipient.city.length > 50) {
        callback(new Error("The FaxRecipient City may not be longer than 50 Characters"), undefined);
        return;
    }
	if (recipient.state == null || typeof recipient.state === "undefined" || validator.isLength(recipient.state.toString(), 0, 0)) recipient.state = false;

	if (recipient.state !== false && validator.isNull(recipient.state)) {
        callback(new Error("The State may either be false or empty"), undefined);
        return;
    }
    if (recipient.state !== false && recipient.state.length > 50) {
        callback(new Error("The FaxRecipient State may not be longer than 50 Characters"), undefined);
        return;
    }
	if (validator.isNull(recipient.zip)) {
        callback(new Error("The Zip may not be empty"), undefined);
        return;
    }
    if (recipient.zip.length > 10) {
        callback(new Error("The FaxRecipient Zip may not be longer than 10 Characters"), undefined);
        return;
    }
	if (validator.isNull(recipient.country)) {
        callback(new Error("The Country may not be empty"), undefined);
        return;
    };
	
	//http://nodejs.org/api.html#_child_processes
	var sys = require('sys');
	var exec = require('child_process').exec;
	var child;
	
	var that = this;
	
	var tmp = require('tmp');
	tmp.tmpName({ template: __dirname + '/../tmp/tmp-XXXXXX.base64' }, function _tempNameGenerated(err, path) {
		if (err) throw err;
		var fs = require('fs');
		fs.writeFile(path, file, function (err) {
		  if (err) throw err;
            var mode = printBlackWhite ? "BW" : "CL";
		    var docsaway = {
				credentials: {
					email: that.email,
					installationKey: that.installationKey,
					mode: that.mode
				},
				recipient: recipient,
				file: path,
                printMode: mode
			};

			var json = JSON.stringify(docsaway);

			// executes `pwd`
			child = exec("php " + __dirname + "/sendMail.php '" + json + "'", function (error, stdout, stderr) {
				fs.unlink(path, function (err) {});// delete file
				if (error) {
					callback(new Error(error.message), undefined);
					return;
				}
				var response = JSON.parse(stdout);
				if (typeof stderr !== 'undefined' && stderr != '') {
					callback(new Error(stderr), undefined);
					return;
				}
				if (typeof response.debug !== 'undefined' && typeof response.debug.errno !== 'undefined' && response.debug.errno != '0') {
					callback(new Error(errorKeyToSendMailErrorMessage(response.debug.errno)), undefined);
					return;
				}
                if (typeof response.error !== 'undefined' && response.error != '') {
                    callback(new Error(response.error), undefined);
                    return;
                }
				callback(undefined, response);
			});
		});
	});
};

Client.prototype.calculatePrice = function(countryCodeIso, pages, callback) {

    if (pages > 40) {
        callback(new Error("The Maximum Number of Pages is 40, your document is " + pages), undefined);
        return;
    }

	//http://nodejs.org/api.html#_child_processes
	var sys = require('sys');
	var exec = require('child_process').exec;
	var child;
	
	var that = this;
	
	that.docsaway = {
		credentials: {
			email: that.email,
			installationKey: that.installationKey,
			mode: that.mode
		},
		countryCodeIso: countryCodeIso,
		pages: pages
	};

	var json = JSON.stringify(that.docsaway);

	// executes `pwd`
	child = exec("php " + __dirname + "/stationFinder.php '" + json + "'", function (error, stdout, stderr) {
		if (error) {
			callback(new Error(error.message), undefined);
			return;
		}
		var response = JSON.parse(stdout);
		if (typeof stderr !== 'undefined' && stderr != '') {
			callback(new Error(stderr), undefined);
			return;
		}
		if (typeof response.debug !== 'undefined' && typeof response.debug.errno !== 'undefined' && response.debug.errno != '0') {
			callback(new Error(errorKeyToFindStationErrorMessage(response.debug.errno)), undefined);
			return;
		}
        if (response.error != undefined && response.error != '') {
            callback(new Error(response.error), undefined);
            return;
        }
		
		that.docsaway.station = response.result.station; // Set Station
		json = JSON.stringify(that.docsaway);
		
		// Get Price
		child = exec("php " + __dirname + "/manualPricing.php '" + json + "'", function (error, stdout, stderr) {
			if (error) {
				callback(new Error(error.message), undefined);
				return;
			}
			var response = JSON.parse(stdout);
			if (stderr != undefined && stderr != '') {
				callback(new Error(stderr), undefined);
				return;
			}
			if (typeof response.debug !== 'undefined' && typeof response.debug.errno !== 'undefined' && response.debug.errno != '0') {
				callback(new Error(errorKeyToPricingErrorMessage(response.debug.errno)), undefined);
				return;
			}
            if (typeof response.error !== 'undefined' && response.error != '') {
                callback(new Error(response.error), undefined);
                return;
            }
			
			var stationInfo = stationInfoForStation(that.docsaway.station.station);
            var courier = coutierNameForCourierId(that.docsaway.station.courier);
			var result = {
				price: response.result.price, // Returns the priceInAud in AUD
				city: stationInfo.city,
				country: stationInfo.country,
                courier: courier
			};
			
			callback(undefined, result);
		});
	});
};

function errorKeyToSendMailErrorMessage(number) {
	return SENDMAIL_ERROR_MESSAGES[number.toString()].value;
}

function errorKeyToFindStationErrorMessage(number) {
	return FINDSTATION_ERROR_MESSAGES[number.toString()].value;
}

function errorKeyToPricingErrorMessage(number) {
	return PRICING_ERROR_MESSAGES[number.toString()].value;
}

function errorKeyToAccountErrorMessage(number) {
    return ACCOUNT_ERROR_MESSAGES[number.toString()].value;
}

function stationInfoForStation(station) {
	return STATIONS[station.toString()];
}

function coutierNameForCourierId(courier) {
    return COURIERS[courier.toString()];
}

Client.prototype.getAccountInfo = function(reference, callback) {

    //http://nodejs.org/api.html#_child_processes
    var sys = require('sys');
    var exec = require('child_process').exec;
    var child;

    var that = this;

    that.docsaway = {
        credentials: {
            email: that.email,
            installationKey: that.installationKey,
            mode: that.mode
        },
        reference: reference
    };

    var json = JSON.stringify(that.docsaway);

    // executes `pwd`
    child = exec("php " + __dirname + "/account.php '" + json + "'", function (error, stdout, stderr) {
        if (error) {
            callback(new Error(error.message), undefined);
            return;
        }
        var response = JSON.parse(stdout);
        if (typeof stderr !== 'undefined' && stderr != '') {
            callback(new Error(stderr), undefined);
            return;
        }
        if (typeof response.debug !== 'undefined' && typeof response.debug.errno !== 'undefined' && response.debug.errno != '0') {
            callback(new Error(errorKeyToAccountErrorMessage(response.debug.errno)), undefined);
            return;
        }
        if (response.error != undefined && response.error != '') {
            callback(new Error(response.error), undefined);
            return;
        }

        callback(undefined, Date.parse(response.dispatch));
    });
};

// export the class
exports.Client = Client;

