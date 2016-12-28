import { SET_LOADING_STATE, PRINT_ERROR, CLEAR_ERROR } from '../actions/app.js';
import Firestack from 'react-native-firestack'
import firebaseConfig from '../../credentials/firebaseConfig.js'

const firestack = new Firestack({
  debug: __DEV__ && !!window.navigator.userAgent,
  ...firebaseConfig
});

const initialState = {
  loading: false,
  error: null,
  firestack: firestack
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_LOADING_STATE:
      return { ...state,
        loading: action.payload,
      };
    case PRINT_ERROR:
      console.log('PRINT_ERROR: ', action.payload);
      return { ...state,
        error: action.payload,
      };
    case CLEAR_ERROR:
      return { ...state,
        error: null,
      };
    default:
    return state;
  }
};
