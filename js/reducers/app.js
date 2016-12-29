import { SET_LOADING_STATE, PRINT_ERROR, CLEAR_ERROR } from '../actions/app.js';
import {FitlyFirebase} from '../library/firebaseHelpers.js';

const initialState = {
  loading: false,
  error: null,
  FitlyFirebase: FitlyFirebase
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
