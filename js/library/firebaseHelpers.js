import Firebase from 'firebase';
//Firestack and Firebase have feature missing from each other
import Firestack from 'react-native-firestack'
import firebaseConfig from '../../credentials/firebaseConfig.js'
export const FitlyFirebase = Firebase.initializeApp(firebaseConfig);
import { getCurrentPlace } from './asyncGeolocation.js';

export const firestack = new Firestack({
  debug: __DEV__ && !!window.navigator.userAgent,
  ...firebaseConfig
});



export const createUpdateObj = (ref: string, data) => {
  let updateObj = {};
  for (key in data) {
    updateObj[ref + '/' + key + '/'] = data[key];
  }
  console.log(updateObj);
  return updateObj;
};


export const firebaseGetCurrentUser = () => {
  return new Promise(function(resolve, reject) {
    let observer = (user) => {
      unsubscribe();
      if (user) {
        resolve(user);
      } else {
        reject(user);
      }
    };
    let unsubscribe = FitlyFirebase.auth().onAuthStateChanged(observer);
  });
};

export const updateCurrentLocationInDB = (uid) => {
  return getCurrentPlace().then(place => {
    return {
      place: `${place.locality}, ${place.adminArea}`,
      lat: place.position.lat,
      lon: place.position.lng,
      zip: place.postalCode
    };
  }).then(placeObj => {
    return FitlyFirebase.database().ref('users/' + uid + '/public/currentLocation/').set(placeObj);
  });
};

export const uploadPhoto = (location, data, options) => {
  location = (options.profile) ? location + 'profile.jpg' : location + guid() + '.jpg';
  return firestack.storage.uploadFile(location, data, {
    contentType: 'image/jpeg',
    contentEncoding: 'base64',
  })
  .then(snapshot => {
    return snapshot.downloadUrl;
  })
};

//generate random id for photos
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}
