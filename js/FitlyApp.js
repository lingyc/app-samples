/**
 * @flow
 */

import React, { Component } from 'react';
import {StyleSheet, ActivityIndicator } from 'react-native';
import FitlyNavigator from './navigator/FitlyNavigator.js'

class FitlyApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      isLoggin: false
    }
    firestack = this.props.firestack;
  }
  componentDidMount() {
    this._checkAuth();
  }

  _checkAuth() {
    firestack.auth.getCurrentUser()
    .then(user => {
      console.log('initial authentication check from firebase: ', user);
      this.setState({
        loading: false,
        isLoggin: true
      })
    })
    .catch(err => {
      console.log('initial authentication check - user has not signin', err)
      this.setState({
        loading: false,
        isLoggin: false
      })
    })
  }

  render() {
      //show loading screen while checking auth status
      if (this.state.loading) {
        return (
          <ActivityIndicator
            animating={this.state.loading}
            style={[styles.centering, {height: 80}]}
            size="large"
          />
        )
      } else {
        return (this.state.isLoggin)
          ? (<FitlyNavigator initialRoute={{name: 'Profile'}} firestack={firestack}/>)
          : (<FitlyNavigator initialRoute={{name: 'Welcome'}} firestack={firestack}/>);
      }
   }
 }

 const styles = StyleSheet.create({
  centering: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  }
});

 export default FitlyApp;
