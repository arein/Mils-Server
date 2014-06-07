{{{
    "title": "Google Geocoding on Windows 8",
    "tags": ["payments", "credit card"],
    "category": "implementation",
    "date": "3-16-2014"
}}}

The default for geocoding on Windows 8 is Bing Maps. Unfortunately, Bing Maps requires the geocoding query to be in the user's language language. Moreover, mixing languages within a query is not supported.

This did not meet our requirements as a German user might query something like "München, Germany".

Therefore, we created a Google Geocoding Client for Windows 8.

The client is hosted on Github and can be imported via [nuget](https://github.com/arein/GoogleGeocodingAPI).