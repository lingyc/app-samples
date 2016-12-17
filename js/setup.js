/**
 * @flow
 */

import React, { Component } from 'react';
import { Provider } from 'react-redux';
import configStore from './store/configStore';
import FitlyApp from './FitlyApp.js'

const store = configStore();

function setup() {
  class Root extends React.Component {
   render() {
     return (
       <Provider store={store}>
         <FitlyApp/>
       </Provider>
     );
   }
  };
  return Root;
}

 export default setup;
