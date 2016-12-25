/**
 * @flow
 */

import React, { Component } from 'react';
import {StyleSheet, ActivityIndicator, View } from 'react-native';
import FitlyNavigator from './navigator/FitlyNavigator.js'
import { updateLogginStatus, storeUserProfile } from '../js/actions/user.js';
import { setFirebaseUID } from '../js/actions/auth.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class FitlyApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      initialRoute: 'Welcome'
    }
  }
  componentDidMount() {
    this._checkAuth();
  }

  _checkAuth() {
    const {firestack, action} = this.props;
    //consider using the auth status listener instead of getCurrentUser, which listens to change in auth state
    (async () => {
      try {
        const authData = await firestack.auth.getCurrentUser();
        //below code are for redirection, consider refactoring it out
        action.setFirebaseUID(authData.user.uid);
        action.updateLogginStatus(true);

        const firebaseUserData = firestack.database.ref('users/' + authData.user.uid).once('value');

        if (firebaseUserData.value.public.profileComplete === false) {
          if (firebaseUserData.value.public.provider === 'Facebook') {
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
          action.storeUserProfile(firebaseUserData.value);
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
      const {firestack} = this.props;
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

const mapDispatchToProps = function(dispatch) {
 return {
   action: bindActionCreators({ updateLogginStatus, setFirebaseUID, storeUserProfile }, dispatch)
 };
};

export default connect(() => { return {}; }, mapDispatchToProps)(FitlyApp);
