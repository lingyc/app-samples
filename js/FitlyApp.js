/**
 * @flow
 */

import React, { Component } from 'react';
import { Navigator } from 'react-native';
//put all routes here for now, need to seperate it into own module later
import Welcome from './login/Welcome.js';
import Signup from './login/Signup.js';

const ROUTES = {
  Welcome: Welcome,
  Signup: Signup
};

class FitlyApp extends Component {
  renderScene(route, navigator) {
    let Component = ROUTES[route.name];
    return (<Component route={route} navigator={navigator} />);
  }

  render() {
    return (
      <Navigator
        initialRoute= {{ name: 'Welcome' }}
        renderScene={this.renderScene.bind(this)}
        configureScene={(route, routeStack) => Navigator.SceneConfigs.SwipeFromLeft}/>
    )
   }
 }

 export default FitlyApp;
