import { SET_SIGNUP_METHOD, SET_SIGNIN_METHOD, LOGOUT, PRINT_AUTH_ERROR } from '../actions/auth.js';

const initialState = {
  signUpMethod: '',
  signInMethod: '',
  error: false,
  errorMsg: ''
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
    case LOGOUT:
      return initialState;
    case PRINT_AUTH_ERROR:
      return { ...state,
        error: true,
        errorMsg: action.payload
      };
    default:
    return state;
  }
};
