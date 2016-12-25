import {
  STORE_USER_PROFILE,
  CLEAR_USER_PROFILE,
  UPDATE_LOGIN_STATUS
} from '../actions/user.js';

const initialState = {
  isLoggedIn: false,
  user: null,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case STORE_USER_PROFILE:
      console.log('STORE_USER_PROFILE: ', action.payload);
      return { ...state,
        user: action.payload
      };
    case CLEAR_USER_PROFILE:
      return { ...state,
        user: null
      };
    case UPDATE_LOGIN_STATUS:
      return { ...state,
        isLoggedIn: action.payload
      };
    default:
    return state;
  }
};
