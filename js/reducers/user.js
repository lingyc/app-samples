import {
  STORE_USER_PROFILE,
  CLEAR_USER_PROFILE,
  UPDATE_LOGIN_STATUS
} from '../actions/user.js';

const initialState = {
  isLoggedIn: false,
  user: null,

};

function user(state = initialState, action) {
  switch (action.type) {
    case STORE_USER_PROFILE:
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
};

export default user;
