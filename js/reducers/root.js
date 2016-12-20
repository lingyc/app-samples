import { combineReducers } from 'redux';
import user from './user';
import auth from './auth'

const rootReducer = combineReducers({
  user: user,
  auth: auth
})

export default rootReducer;
