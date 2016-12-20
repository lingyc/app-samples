import { combineReducers } from 'redux';
import user from './user';
import auth from './auth';
import app from './app'

const rootReducer = combineReducers({
  user: user,
  auth: auth,
  app: app
})

export default rootReducer;
