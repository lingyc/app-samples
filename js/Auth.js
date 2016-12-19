/**
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';

class Auth extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // check if user has login
    this._checkAuth();
  }

  _checkAuth() {
    this.props.firestack.auth.getCurrentUser()
    .then(user => {
      console.log('The currently logged in user', user);
      this.props.navigator.resetTo({name: 'Profile'});
    })
    .catch(err => {
      console.log('user not login ', err)
      this.props.navigator.resetTo({name: 'Welcome'});
    })
  }

  render() {
      //show loading screen while checking auth status
      return (
        <ActivityIndicator
          animating={true}
          style={[styles.centering, {height: 80}]}
          size="large"
        />
      )
   }
 };

 const styles = StyleSheet.create({
  centering: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  }
});

export default Auth;
