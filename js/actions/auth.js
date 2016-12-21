/**
 * @flow
 */

export const SET_SIGNUP_METHOD = 'SET_SIGNUP_METHOD';
export const SET_SIGNIN_METHOD = 'SET_SIGNIN_METHOD';
export const RESET_AUTH_STATE = 'RESET_AUTH_STATE';
export const PRINT_AUTH_ERROR = 'PRINT_AUTH_ERROR';

export const setSignUpMedthod = (method: string) => {
  return {
    type: SET_SIGNUP_METHOD,
    payload: method
  }
}

export const setSignInMedthod = (method: string) => {
  return {
    type: SET_SIGNIN_METHOD,
    payload: method
  }
}

export const printAuthError = (errorMsg) => {
  return {
    type: PRINT_AUTH_ERROR,
    payload: errorMsg
  }
}

export const resetAuthState = () => {
  return {
    type: resetAuthState,
  }
}
