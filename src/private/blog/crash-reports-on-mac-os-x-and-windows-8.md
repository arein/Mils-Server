{{{
    "title": "Crash Reports on Mac OS X and Windows 8",
    "tags": ["development", "analytics"],
    "category": "implementation",
    "date": "6-12-2014"
}}}

As already denoted in our post on app analytics for Mac OS X and Windows 8, the ecosystem of 3rd party development tools for Mac OS X and Windows 8 is far from being as rich as for mobile apps.
Unfortunately, we had to find out that this also holds true for Crash Analytics.

## Why Crash Analytics
The ultimate goal of course is to get an extensive report in order to be able to resolve a bug. However, by default there are either no or very weak reports provided by Apple and Microsoft.
Therefore, you need to use 3rd party tools that provide you with more detailed crash information.
BTW: This might seem like a trivial thing to many non-developers. However, gathering and transporting the crash reports is not an easy task. Just think of the fact that the crash report needs to be transported from the user's device to a web service after the crash occurred. And if there is no internet connection it has to be stored on the device and transported at the next launch, etc. 

## 3rd Party Tools
It pretty much came down to [HockeyApp](http://hockeyapp.net) on Mac OS X and [BugSense](https://www.bugsense.com).
Pricing for HockeyApp starts at $10 per month but there is a free track for students. This covers unlimited crash reports and users.
BugSense has a free pricing tier which is limited to 500 errors per month and 30k users.

## Summary
Improve your app, one bug report at a time ;)