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
  location = (options && options.profile) ? location + 'profile.jpg' : location + guid() + '.jpg';
  return firestack.storage.uploadFile(location, data, {
    contentType: 'image/jpeg',
    contentEncoding: 'base64',
  })
  .then(snapshot => {
    return snapshot.downloadUrl;
  })
};

//uploads the photos and return a list of firebase database paths
export const savePhotoToDB = (photos, uid, contentlink) => {
  let linkPromises = photos.map(photo => {
    return Promise.resolve(uploadPhoto('/photos/' + contentlink + '/', photo.path));
  });

  return Promise.all(linkPromises).then(links => {
    console.log('links', links);
    return links.map((link, index) => {
      console.log('photos[index].tags', photos[index].tags);
      let photoTagsArray = photos[index].tags || [];
      let photoTags = photoTagsArray.reduce((tagObj, tag) => {
        tagObj[tag] = true;
        return tagObj;
      }, {});

      let photoObj = {
        link: link,
        likeCount: 0,
        description: photos[index].description || '',
        author: uid,
        tags: photoTags,
        contentlink: contentlink,
        timestamp: Firebase.database.ServerValue.TIMESTAMP
      };
      return Promise.resolve(FitlyFirebase.database().ref('photos').push(photoObj).then(snap => snap.key));
    });
  }).then(refPromises => {
    console.log('refPromise', refPromises);
    return Promise.all(refPromises);
  }).then(photoRefs => {
    console.log('photoRefs', photoRefs);
    return photoRefs;
  });
};

//this function is work in progress, the intend is to skip waiting for picture upload and load the local files directly
// export const noWaitSavePhotoToDB = (photos, uid, contentlink) => {
//   //transform the photos objects into the correct format
//   let imagesObjLocal = {};
//   let linkPromises = [];
//   let imagesObjDB = {};
//
//   photos.each(photo => {
//     linkPromises.push(Promise.resolve(uploadPhoto('/photos/' + contentlink + '/', photo.path)));
//     let photoTagsArray = photo.tags || [];
//     let photoTags = photoTagsArray.reduce((tagObj, tag) => {
//       tagObj[tag] = true;
//       return tagObj;
//     }, {});
//
//     let photoObj = {
//       //this temp object uses the local path, this will be changed to the actual URL in the next code block
//       link: photo.path,
//       likeCount: 0,
//       description: photo.description || '',
//       author: uid,
//       tags: photoTags,
//       contentlink: contentlink,
//       timestamp: Firebase.database.ServerValue
//     };
//     imagesObjLocal.push(photoObj);
//   });
//
//   Promise.all(linkPromises).then(links => {
//     console.log('links', links);
//     return links.map((link, index) => {
//       let photoObj = imagesObjLocal[index];
//       photoObj.link = link;
//       return Promise.resolve(FitlyFirebase.database().ref('photos').push(photoObj).then(snap => {
//         imagesObjDB[snap.key] = true;
//         return snap.key;
//       }));
//     });
//   }).then(refPromises => {
//     console.log('refPromise', refPromises);
//     return Promise.all(refPromises);
//   }).then(photoRefs => {
//     console.log('photoRefs', photoRefs);
//     return FitlyFirebase.database().ref('/posts/photos').set(imagesObjDB);
//   });
//
//   return imagesObjLocal;
// };

//generate random id for photos
export const guid = () => {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}
