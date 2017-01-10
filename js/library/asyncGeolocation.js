import Geocoder from 'react-native-geocoder';
//fall back to google in case something happens, need google api key
// Geocoder.fallbackToGoogle(MY_KEY);

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
  let gotGeocoding = false;
  return getCurrentPosition()
  .then(({coords}) => {
    setTimeout(() => {
      if (!gotGeocoding) { throw new Error({message: 'geocoder problem'}) }
    }, 5000);
    return Geocoder.geocodePosition({lat: coords.latitude, lng: coords.longitude})
  })
  .then(geocoding => {
    gotGeocoding = true;
    return geocoding[0];
  }).catch(error => {
    console.log('geocoding getCurrentPlace error', error);
  })
};

export const getPlace = (userInput) => {
  let gotGeocoding = false;
  setTimeout(() => {
    if (!gotGeocoding) { throw new Error({message: 'geocoder problem'}) }
  }, 5000);
  return Geocoder.geocodeAddress(userInput)
  .then(geocoding => {
    gotGeocoding = true;
    return geocoding[0];
  }).catch(error => {
    console.log('geocoding getPlace error', error);
  })
};
