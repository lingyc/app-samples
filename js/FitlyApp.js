/**
 * @flow
 */

import React, { Component } from 'react';
import { Navigator } from 'react-native';
import Firestack from 'react-native-firestack'
import firebaseConfig from '../credentials/firebaseConfig.js'
import ROUTES from './FitlyRoutes.js'

const firestack = new Firestack({
  debug: __DEV__ && !!window.navigator.userAgent,
  ...firebaseConfig
});

class FitlyApp extends Component {

  renderScene(route, navigator) {
    let Component = ROUTES[route.name];
    return (<Component route={route} navigator={navigator} firestack={firestack}/>);
  }

  render() {
    return (
      <Navigator
        initialRoute= {{ name: 'Auth' }}
        renderScene={this.renderScene}
        configureScene={(route, routeStack) => {
          if (route.sceneConfig) {
            return route.sceneConfig;
          }
          return Navigator.SceneConfigs.SwipeFromLeft;
        }}
      />
    );
   }
 }

 export default FitlyApp;
