# App Code Samples #


## Installation ##
1. Run npm install
2. Add firebase API keys to /credentials/firebaseConfig
3. There is a bug in Firestack npm module that breaks the window object, to fix it refer to here: https://github.com/fullstackreact/react-native-firestack/pull/179/commits/bfa9ed31c8d9145b508d5e093fd90c59211b4500


## iOS Only Components ##
React-Native-FMPicker


## Running the development server ##
Refer to https://facebook.github.io/react-native/docs/running-on-device.html


## Icons ##
Get the icon names at http://ionicframework.com/docs/v2/ionicons/  or http://fontawesome.io/icons/ for the react-native-vector-icons library

## Issues ##
Pod install React throws an error which cause Google maps to have issue installing

## TODOs ##
More TODOs can be found in the code. This list will grow.

- [ ] Local Storage
  - [ ] Persist redux store


- [ ] Profile Tab
  - [ ] show list of followers, followings and sessions when they are clicked
  - [ ] disallow photo duplication for uploads
  - [ ] let user update summary
  - [ ] let user create workouts
    - [ ] invite others for workouts
  - [ ] push notifications
  - [ ] feeds
    - [ ] include feeds for likes, replies
    - [ ] refactor with listView


- [ ] Search Tab
  - [ ] implement server
    - [ ] use elasticsearch and index database
    - [ ] create query API
  - [ ] figure out the interface


- [ ] Activity Tab
  - [ ] create activity
  - [ ] search activity


- [ ] Notification Tab


- [ ] Connect Tab
  - [ ] implement backend service


- [ ] Groups


- [ ] Settings
  - [ ] manage notifications
