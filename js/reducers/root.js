import { combineReducers } from 'redux';
import user from './user.js';
import auth from './auth.js';
import app from './app.js';
import navState from './navState.js';
import drafts from './drafts.js';

const rootReducer = combineReducers({
  user: user,
  auth: auth,
  app: app,
  navState: navState,
  drafts: drafts,
})

export default rootReducer;
