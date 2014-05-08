var installationKey = 'HzPSxZHdY49xIeylq7S5iC7ceqB3i7sxEfmGz82zbN9euyuArzMWJ5CRqo0kapOY';
var email = 'test-docsaway-api@ceseros.de';
var docsaway = require('../lib/main');
var nock = require('nock');


var client = new docsaway.Client(email, installationKey, "TEST");