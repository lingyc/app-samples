import ImagePicker from 'react-native-image-picker';

export const selectPicture = () => {
  let options = {
    title: 'Select a Profile Picture',
    cameraType: 'front',
    mediaType: 'photo',
    maxWidth: '350',
    maxHeight: '350',
    quality: .3,
    allowEditing: true
  };
  return new Promise((resolve, reject) => {
    ImagePicker.showImagePicker(options, (response) => {
      if (response.error) {
        reject(response.error);
      }
      resolve(response);
    });
  })
};
