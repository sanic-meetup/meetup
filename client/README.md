# Client

## Setup
#### Run from command line
to run on iOS, must be using a Mac and have Xcode installed.
- Move into MeetUp Directory
- `$ react-native run-ios`

#### Run on device/ run from Xcode
- find `meetUp.xcodeproj` in the `ios` folder
- double click to open in Xcode.
- choose device to build to and hit run.

<!-- ## Pusher Starter Code for React Native
```
import Pusher from 'pusher-js/react-native';

// Enable pusher logging - don't include this in production
Pusher.logToConsole = true;

var pusher = new Pusher('c44a3af2941478d93548', {
  encrypted: true
});

var channel = pusher.subscribe('my-channel');
channel.bind('my-event', function(data) {
  alert(data.message);
});
```

## TODO::
- separate the home tab from `Home.js` and move to `/tabViews/`.
- Make current status, and how to update it, more obvious. (Navbar)
-->
## Debugging
if you encounter an error '<' could not parse or somthing along those lines, or a Network Error, that means the server is down. The server is hosted on cms-weblabs so simply restarting it will fix that error. (the server should not crash on its own though.) The server is hosted at  
`api.sanic.ca`  
we also have an alternate server hosted at  
`sanic.ca:2096`  
if you want to use this server please change the server variable in [constants.js](./MeetUp/app/Constants.js#L1-L4)
