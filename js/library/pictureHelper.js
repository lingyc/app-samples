import ImagePicker from 'react-native-image-picker';
import ImageCropPicker from 'react-native-image-crop-picker';

export const selectPicture = () => {
  let options = {
    title: 'Select a Profile Picture',
    cameraType: 'front',
    mediaType: 'photo',
    maxWidth: '350',
    maxHeight: '350',
    quality: .3,
  };
  return new Promise((resolve, reject) => {
    ImagePicker.showImagePicker(options, (response) => {
      if (response.error || response.didCancel) {
        reject(response.error);
      }
      resolve(response);
    });
  })
};

export const getImageFromCam = (callback) => {
  ImageCropPicker.openCamera({
    compressImageQuality: .6
  }).then(images => {
    callback(images);
  }).catch(error => {
    console.log('image picker', error);
  });
};

export const getImageFromLib = (callback) => {
  ImageCropPicker.openPicker({
    cropping: true,
    multiple: true,
    compressImageQuality: .6
  }).then(images => {
    callback(images);
  }).catch(error => {
    console.log('image picker', error);
  });
};
