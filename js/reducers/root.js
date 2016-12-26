import { combineReducers } from 'redux';
import user from './user.js';
import auth from './auth.js';
import app from './app.js';
import navState from './navState.js';

const rootReducer = combineReducers({
  user: user,
  auth: auth,
  app: app,
  navState: navState
})

export default rootReducer;
