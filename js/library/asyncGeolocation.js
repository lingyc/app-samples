import Geocoder from 'react-native-geocoder';
//fall back to google in case something happens, need google api key
import {GEOCODING_API_KEY} from '../../credentials/GOOGLE_PLACE_API_KEY.js';
Geocoder.fallbackToGoogle(GEOCODING_API_KEY);

export const getCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (location) => {
        resolve(location)
      },
      (error) => reject(error.message),
      {enableHighAccuracy: true, timeout: 2000, maximumAge: 1000}
    );
  })
};

export const getCurrentPlace = () => {
  return getCurrentPosition()
  .then(({coords}) => {
    return Geocoder.geocodePosition({lat: coords.latitude, lng: coords.longitude})
  })
  .then(geocoding => {
    return geocoding[0];
  }).catch(error => {
    console.log('geocoding getCurrentPlace error', error);
  })
};

export const getPlaceByName = (userInput) => {
  return Geocoder.geocodeAddress(userInput)
  .then(geocoding => {
    return geocoding[0];
  }).catch(error => {
    console.log('geocoding getPlaceByName error', error);
    console.log('geocoding getPlaceByName error', error);
  })
};

export const getPlaceByCoord = (coord) => {
  return Geocoder.geocodePosition(coord)
  .then(geocoding => {
    console.log('geocoding', geocoding);
    return geocoding[0];
  }).catch(error => {
    console.log('geocoding getPlaceByCoord error', error);
  });
};

export const getPlaceByCoordGoogle = (coord) => {
  return fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${coord.lat},${coord.lng}&key=${GEOCODING_API_KEY}`)
  .then(data => data.json())
  .catch(error => console.log(error));
}
