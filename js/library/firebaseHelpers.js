import Firebase from 'firebase';
import firebaseConfig from '../../credentials/firebaseConfig.js'
export const FitlyFirebase = Firebase.initializeApp(firebaseConfig);
import { getCurrentPlace } from './asyncGeolocation.js';


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

export const uploadPhoto = (location, data) => {
  console.log('location', location);
  const storageRef = FitlyFirebase.storage().ref(location + guid() + '.jpg');
  return storageRef.putString(data, 'base64').then(snapshot => {
    console.log('snapshot', snapshot);
    return snapshot.downloadURL;
  });
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
