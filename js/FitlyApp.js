/**
 * @flow
 */

import React, { Component } from 'react';
import {StyleSheet, ActivityIndicator, View } from 'react-native';
import FitlyNavigator from './navigator/FitlyNavigator.js'

class FitlyApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      initialRoute: 'Welcome'
    }
    firestack = this.props.firestack;
  }
  componentDidMount() {
    this._checkAuth();
  }

  _checkAuth() {
    (async () => {
      try {
        const authData = await firestack.auth.getCurrentUser();
        console.log('authData', authData);
        //set uID in redux store
        const userRef = firestack.database.ref('users/' + authData.user.uid);
        const firebaseUserData = await userRef.once('value');
        console.log('firebaseUserData', firebaseUserData);
        if (firebaseUserData.value.profileComplete === false) {
          if (firebaseUserData.value.Firebase === 'Facebook') {
            this.setState({
              loading: false,
              initialRoute: "SetupStatsView"
            });
          } else {
            this.setState({
              loading: false,
              initialRoute: "SetupProfileView"
            });
          }
        } else {
          this.setState({
            loading: false,
            initialRoute: "ProfileView"
          });
        }
      } catch(error) {
        console.log('initial authentication check - user has not signin', error)
        this.setState({
          loading: false,
          initialRoute: "WelcomeView"
        })
      }
    })();
  }

  render() {
      //show loading screen while checking auth status
      if (this.state.loading) {
        return (
          <View style={styles.centering}>
            <ActivityIndicator
              animating={this.state.loading}
              style={{height: 80}}
              size="large"
            />
          </View>
        );
      } else {
        return (<FitlyNavigator initialRoute={{name: this.state.initialRoute}} firestack={firestack}/>);
      }
   }
 }

 const styles = StyleSheet.create({
  centering: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

 export default FitlyApp;
