/**
 * @flow
 */

import React, { Component } from 'react';
import { Provider } from 'react-redux';
import configStore from './store/configStore.js';
import FitlyApp from './FitlyApp.js'
import Firestack from 'react-native-firestack'
import firebaseConfig from '../credentials/firebaseConfig.js'

const firestack = new Firestack({
  debug: __DEV__ && !!window.navigator.userAgent,
  ...firebaseConfig
});


const store = configStore();

function setup() {
  class Root extends React.Component {
   render() {
     return (
       <Provider store={store}>
         <FitlyApp store={store} firestack={firestack}/>
       </Provider>
     );
   }
  };
  return Root;
}

 export default setup;
