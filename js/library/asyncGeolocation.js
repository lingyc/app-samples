import Geocoder from 'react-native-geocoder';
//fall back to google in case something happens, need google api key
// Geocoder.fallbackToGoogle(MY_KEY);

export const getCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (location) => resolve(location),
      (error) => reject(error.message),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
  })
};

export const getCurrentPlace = () => {
  return getCurrentPosition()
  .then(({coords}) => {
    // console.log(coords);
    return Geocoder.geocodePosition({lat: coords.latitude, lng: coords.longitude})
  })
  .then(geocoding => {
    console.log(geocoding);
    return geocoding[0];
  })
};

export const getPlace = (userInput) => {
  return Geocoder.geocodeAddress(userInput)
  .then(geocoding => {
    console.log(geocoding);
    return geocoding[0];
  })
};