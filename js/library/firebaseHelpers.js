import Firebase from 'firebase';
//Firestack and Firebase have feature missing from each other, Firestack will be used until Firebase support all features
import Firestack from 'react-native-firestack'
import firebaseConfig from '../../credentials/firebaseConfig.js'
export const FitlyFirebase = Firebase.initializeApp(firebaseConfig);
import { getCurrentPlace } from './asyncGeolocation.js';

export const firestack = new Firestack({
  debug: __DEV__ && !!window.navigator.userAgent,
  ...firebaseConfig
});

const database = FitlyFirebase.database();

export const createUpdateObj = (ref: string, data) => {
  let updateObj = {};
  for (key in data) {
    updateObj[ref + '/' + key + '/'] = data[key];
  }
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
    return database.ref('users/' + uid + '/public/currentLocation/').set(placeObj);
  }).catch(error => {
    console.log('updateCurrentLocationInDB error ', error)
  });
};

export const uploadPhoto = (location, data, options) => {
  location = (options && options.profile)
    ? location + 'profile.jpg'
    : location + randomString() + '.jpg';
  return firestack.storage.uploadFile(location, data, {
    contentType: 'image/jpeg',
    contentEncoding: 'base64',
  })
  .then(snapshot => {
    return snapshot.downloadUrl;
  }).catch(error => {
    console.log('photo upload error', error);
  })
};

//uploads the photos and return a list of firebase database paths
export const savePhotoToDB = (photos, authorInfo, contentlink) => {
  const {author, authorName, authorPicture} = authorInfo;
  let linkPromises = photos.map(photo => Promise.resolve(uploadPhoto('/photos/' + contentlink + '/', photo.path)));

  return Promise.all(linkPromises).then(links => {
    return links.map((link, index) => {
      const photoTagsArray = photos[index].tags || [];
      const photoTags = photoTagsArray.reduce((tagObj, tag) => {
        tagObj[tag] = true;
        return tagObj;
      }, {});

      const photoObj = {
        link: link,
        likeCount: 0,
        shareCount: 0,
        saveCount: 0,
        replyCount: 0,
        description: photos[index].description || '',
        author: author,
        authorName: authorName,
        authorPicture: authorPicture,
        tags: photoTags,
        contentlink: contentlink,
        createdAt: Firebase.database.ServerValue.TIMESTAMP
      };

      const photoKey = database.ref('photos').push().key;
      database.ref(`userPhotos/${author}/${photoKey}`).set({link: link, timestamp: Firebase.database.ServerValue.TIMESTAMP})
      return Promise.resolve(
        database.ref(`photos/${photoKey}`).set(photoObj)
        .then(snap => {
          return {key: photoKey, link: link};
        })
      );
    });
  }).then(refPromises => {
    return Promise.all(refPromises);
  }).then(photoRefs => {
    return photoRefs;
  }).catch(err => {
    console.log('savePhotoToDB error', err);
  });
};

export const saveUpdateToDB = (update, uid, type = {minor: false}) => {
  if (type.minor) {
    database.ref('/userUpdatesAll/' + uid).push(update);
  } else {
    database.ref('/userUpdatesMajor/' + uid).push(update);
    database.ref('/userUpdatesAll/' + uid).push(update);
  }
};

export const turnOnfeedService = (uid, options = {self: false}, initialCallback, subsequentCallback) => {
  let notificationSource = (options.self === true)
    ? database.ref('followingNotifications/' + uid)
    : notificationSource = database.ref('userUpdatesAll/' + uid)

  const handleNewFeed = (feedEntry) => {
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
    //the forEach below belongs to Firebase API not native JS, firebase data come back as objects,
    //which needs to be converted back to array for order iteration, firebase forEach can iterate firebase data in the correct order
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

  notificationSource.orderByChild('timestamp').startAt(Date.now()).on('child_added', handleNewFeed);
};

export const turnOffeedService = (uid, options) => {
  let notificationSource = (options.self === true)
    ? database.ref('followingNotifications/' + uid)
    : database.ref('userUpdatesAll/' + uid);
  notificationSource.off('child_added');
};

export const turnOnCommentListener = (dbRef, initialCallback, subsequentCallback) => {
  dbRef.orderByChild('timestamp').once('value')
  .then(replies => {
    const commentMsgKeys = Object.keys(replies.val() || {});
    initialCallback(commentMsgKeys);
  }).catch(error => console.log(error));

  const handleNewComment = (commentEntry) => {
    let commentMsgKey = commentEntry.key;
    subsequentCallback(commentMsgKey);
  };

  dbRef.orderByChild('timestamp').startAt(Date.now()).on('child_added', handleNewComment);
}

export const turnOffCommentListener = (dbRef) => {
  dbRef.off('child_added');
}

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
export const randomString = () => {
  const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}
