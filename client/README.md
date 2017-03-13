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

## Pusher Starter Code for React Native
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
