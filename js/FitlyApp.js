/**
 * @flow
 */

import React, { Component } from 'react';
import {StyleSheet, ActivityIndicator, View } from 'react-native';
import FitlyNavigator from './navigator/FitlyNavigator.js'
import { updateLogginStatus, storeUserProfile } from '../js/actions/user.js';
import { setFirebaseUID } from '../js/actions/auth.js';
import { resetTo } from '../js/actions/navigation.js';
import { asyncFBLogout } from './library/asyncFBLogin.js';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class FitlyApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    }
  }
  componentDidMount() {
    this._checkAuth();
  }

  _checkAuth() {
    const {firestack, action, navigation} = this.props;
    //consider using the auth status listener instead of getCurrentUser, which listens to change in auth state
    (async () => {
      try {
        const authData = await firestack.auth.getCurrentUser();
        //below code are for redirection, consider refactoring it out
        action.setFirebaseUID(authData.user.uid);
        action.updateLogginStatus(true);

        const firebaseUserData = await firestack.database.ref('users/' + authData.user.uid).once('value');
        if (firebaseUserData.value === null || firebaseUserData.value.public.profileComplete === false) {
          if (firebaseUserData.value === null || firebaseUserData.value.public.provider === 'Firebase') {
            this.setState({ loading: false });
            navigation.resetTo({key: "SetupProfileView", global: true});
          } else {
            this.setState({ loading: false });
            navigation.resetTo({key: "SetupStatsView", global: true});
          }
        } else {
          action.storeUserProfile(firebaseUserData.value);
          this.setState({ loading: false });
          navigation.resetTo({key: "FitlyHomeView", global: true});
        }
      } catch(error) {
        console.log('initial authentication check - user has not signin', error)
        this.setState({ loading: false });
        navigation.resetTo({key: "WelcomeView", global: true});
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
        return (<FitlyNavigator firestack={firestack}/>);
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

const mapStateToProps = function(state) {
  return {
    firestack: state.app.firestack,
  };
};

const mapDispatchToProps = function(dispatch) {
 return {
   action: bindActionCreators({ updateLogginStatus, setFirebaseUID, storeUserProfile }, dispatch),
   navigation: bindActionCreators({ resetTo }, dispatch)
 };
};

export default connect(mapStateToProps, mapDispatchToProps)(FitlyApp);
