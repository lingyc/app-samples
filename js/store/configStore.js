import { applyMiddleware, createStore } from 'redux';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';
import promise from 'redux-promise';
import rootReducer from '../reducers/root'


const isDebuggingInChrome = __DEV__ && !!window.navigator.userAgent;
const logger = createLogger({
  predicate: (getState, action) => isDebuggingInChrome,
  collapsed: true,
  duration: true,
});

function configStore(onComplete: ?() => void) {
  const store = createStore(rootReducer, applyMiddleware(thunk, promise, logger));
  if (isDebuggingInChrome) {
    window.store = store;
  }
  return store;
};

export default configStore;
