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
      const photoTagsArray = photos[index].tags || [];
      const photoTags = photoTagsArray.reduce((tagObj, tag) => {
        tagObj[tag] = true;
        return tagObj;
      }, {});

      const photoObj = {
        link: link,
        likeCount: 0,
        description: photos[index].description || '',
        author: uid,
        tags: photoTags,
        contentlink: contentlink,
        timestamp: Firebase.database.ServerValue.TIMESTAMP
      };

      const photoKey = FitlyFirebase.database().ref('photos').push().key;
      FitlyFirebase.database().ref(`userPhotos/${uid}/${photoKey}`).set({link: link, timestamp: Firebase.database.ServerValue.TIMESTAMP})
      return Promise.resolve(FitlyFirebase.database().ref(`photos/${photoKey}`).set(photoObj).then(snap => { return {key: photoKey, link: link}; }));
    });
  }).then(refPromises => {
    return Promise.all(refPromises);
  }).then(photoRefs => {
    console.log('photoRefs', photoRefs);
    return photoRefs;
  });
};

export const saveUpdateToDB = (update, uid, type = {minor: false}) => {
  if (type.minor) {
    FitlyFirebase.database().ref('/userUpdatesAll/' + uid).push(update);
  } else {
    FitlyFirebase.database().ref('/userUpdatesMajor/' + uid).push(update);
    FitlyFirebase.database().ref('/userUpdatesAll/' + uid).push(update);
  }
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

export const turnOnfeedService = (uid, options, initialCallback, subsequentCallback) => {
  let notificationSource = (options.self === true)
    ? FitlyFirebase.database().ref('followingNotifications/' + uid)
    : notificationSource = FitlyFirebase.database().ref('userUpdatesAll/' + uid)

  const appendToFeed = (feedEntry) => {
    let feedObject = feedEntry.val();
    let feedPictures = [];
    feedEntry.child('photos').forEach(photo => {
      let photoObj = photo.val();
      photoObj.key = photo.key;
      feedPictures.push(photoObj);
    });
    feedObject.photos = feedPictures;
    subsequentCallback(feedObject);
  };

  notificationSource.orderByChild('timestamp').limitToLast(10).once('value')
  .then(feeds => {
    //the forEach below is from Firebase API not native JS firebase data come back as objects,
    //which needs to convert back to array for interating in the correct order
    let feedsArray = [];
    feeds.forEach(feed => {
      let feedObject = feed.val();
      let feedPictures = [];
      feed.child('photos').forEach(photo => {
        let photoObj = photo.val();
        photoObj.key = photo.key;
        feedPictures.push(photoObj);
      });
      feedObject.photos = feedPictures;
      feedsArray.push(feedObject);
    });
    initialCallback(feedsArray);
  }).catch(error => console.log(error));

  notificationSource.orderByChild('timestamp').startAt(Date.now()).on('child_added', appendToFeed);
};

export const turnOffeedService = (uid, options) => {
  let notificationSource;
  if (options.self === true) {
    notificationSource = FitlyFirebase.database().ref('followingNotifications/' + uid);
  } else {
    notificationSource = FitlyFirebase.database().ref('userUpdatesAll/' + uid);
  }
  notificationSource.off('child_added');
};

export const convertFBObjToArray = (collectionObj) => {
  let array = [];
  collectionObj.forEach(item => {
    let itemObj = item.val();
    itemObj.key = item.key;
    array.push(itemObj);
  })
  return array;
};

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
