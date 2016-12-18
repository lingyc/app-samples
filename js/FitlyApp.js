/**
 * @flow
 */

import React, { Component } from 'react';
import { Navigator } from 'react-native';
import Firestack from 'react-native-firestack'
import firebaseConfig from '../credentials/firebaseConfig'

const firestack = new Firestack({
  debug: __DEV__ && !!window.navigator.userAgent,
  ...firebaseConfig
});

import Welcome from './login/Welcome.js';
import Signup from './login/Signup.js';

const ROUTES = {
  Welcome: Welcome,
  Signup: Signup
};

class FitlyApp extends Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     isLoggin: firebase.auth().currentUser
  //   }
  // }

  renderScene(route, navigator) {
    let Component = ROUTES[route.name];
    return (<Component route={route} navigator={navigator} />);
  }

  render() {
    return (
      <Navigator
        initialRoute= {{ name: 'Welcome' }}
        renderScene={this.renderScene}
        configureScene={(route, routeStack) => Navigator.SceneConfigs.SwipeFromLeft}/>
    )
   }
 }

 export default FitlyApp;
