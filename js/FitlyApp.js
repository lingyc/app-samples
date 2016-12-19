/**
 * @flow
 */

import React, { Component } from 'react';
import { Navigator } from 'react-native';
import Firestack from 'react-native-firestack'
import firebaseConfig from '../credentials/firebaseConfig.js'
import ROUTES from './FitlyRoutes.js'

const firestack = new Firestack({
  debug: __DEV__ && !!window.navigator && !!window.navigator.userAgent,
  ...firebaseConfig
});

//check auth status
//if auth
  //push route to Profile
//else
  //push to welcome View


class FitlyApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggin: false
    }
  }

  componentDidMount() {
    // check if user has login
    firestack.auth.getCurrentUser()
    .then(user => {
      console.log('The currently logged in user', user);
      this.setState({
        isLoggin: true
      })
    })
    .catch(err => {
      console.log('user not login')
      this.setState({
        isLoggin: false
      })
    })
  }

  renderScene(route, navigator) {
    let Component = ROUTES[route.name];
    return (<Component route={route} navigator={navigator} firestack={firestack}/>);
  }

  render() {
    return (
      <Navigator
        initialRoute= {(this.state.isLoggin) ? { name: 'Profile' } : { name: 'Welcome' }}
        renderScene={this.renderScene}
        configureScene={(route, routeStack) => {
          if (route.sceneConfig) {
            return route.sceneConfig;
          }
          return Navigator.SceneConfigs.SwipeFromLeft;
        }}
      />
    )
   }
 }

 export default FitlyApp;
