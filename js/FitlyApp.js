/**
 * @flow
 */

import React, { Component } from 'react';
import { Navigator } from 'react-native';
//put all routes here for now, need to seperate it into own module later
import * as firebase from 'firebase';
import firebaseConfig from '../config/env'

firebase.initializeApp(firebaseConfig);
//show loading screen while checking to see if user has signin
//if not direct to login
//if yes direct to profile
//remember to setup navigator

import Welcome from './login/Welcome.js';
import Signup from './login/Signup.js';

const ROUTES = {
  Welcome: Welcome,
  Signup: Signup
};

class FitlyApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggin: firebase.auth().currentUser
    }
  }

  renderScene(route, navigator) {
    let Component = ROUTES[route.name];
    return (<Component route={route} navigator={navigator} />);
  }

  render() {
    return (
      <Navigator
        initialRoute= {(this.state.isLoggin) ? { name: 'Signup' } : { name: 'Welcome' }}
        renderScene={this.renderScene}
        configureScene={(route, routeStack) => Navigator.SceneConfigs.SwipeFromLeft}/>
    )
   }
 }

 export default FitlyApp;
