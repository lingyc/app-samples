import { FBLoginManager } from 'react-native-facebook-login';

export const asyncFBLogout = () => {
  return new Promise((resolve, reject) => {
    FBLoginManager.logout((error, data) => {
      if (!error) {
        resolve(data);
      } else {
        reject(error);
      }
    })
  })
};

export const asyncFBLoginWithPermission = (permissions) => {
  return new Promise((resolve, reject) => {
    FBLoginManager.loginWithPermissions(permissions, (error, data) => {
      if (!error) {
        resolve(data);
      } else {
        reject(error);
      }
    })
  })
};
