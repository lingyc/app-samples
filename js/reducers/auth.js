import {
  SET_SIGNUP_METHOD,
  SET_SIGNIN_METHOD,
  RESET_AUTH_STATE,
  PRINT_AUTH_ERROR,
  SET_FIREBASE_UID
} from '../actions/auth.js';

const initialState = {
  signUpMethod: '',
  signInMethod: '',
  error: false,
  errorMsg: '',
  uID: null
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_SIGNUP_METHOD:
      return { ...state,
        signInMethod: action.payload,
        signUpMethod: action.payload
      };
    case SET_SIGNIN_METHOD:
      return { ...state,
        signInMethod: action.payload
      };
    case RESET_AUTH_STATE:
      return initialState;
    case PRINT_AUTH_ERROR:
      return { ...state,
        error: true,
        errorMsg: action.payload
      };
    case SET_FIREBASE_UID:
      return { ...state,
        uID: action.payload
      };
    default:
    return state;
  }
};
