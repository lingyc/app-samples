/**
 * @flow
 */

import React, { Component } from 'react';
import {StyleSheet, ActivityIndicator, View } from 'react-native';
import FitlyNavigator from './navigator/FitlyNavigator.js'
import { storeUserProfile } from '../js/actions/user.js';
import { setFirebaseUID, updateLogginStatus } from '../js/actions/auth.js';
import { resetTo } from '../js/actions/navigation.js';
import { asyncFBLogout } from './library/asyncFBLogin.js';
import { firebaseGetCurrentUser } from './library/firebaseHelpers.js';
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
    const {FitlyFirebase, action, navigation} = this.props;
    //consider using the auth status listener instead of getCurrentUser, which listens to change in auth state
    (async () => {
      try {
        // await asyncFBLogout();
        // await FitlyFirebase.auth().signOut();
        const authData = await firebaseGetCurrentUser();
        //below code are for redirection, consider refactoring it out
        action.setFirebaseUID(authData.uid);
        action.updateLogginStatus(true);

        const firebaseUserData = (await FitlyFirebase.database().ref('users/' + authData.uid).once('value')).val();
        if (firebaseUserData === null || firebaseUserData.public.profileComplete === false) {
          if (firebaseUserData === null || firebaseUserData.public.provider === 'Firebase') {
            this.setState({ loading: false });
            navigation.resetTo({key: "SetupProfileView", global: true});
          } else {
            this.setState({ loading: false });
            navigation.resetTo({key: "SetupStatsView", global: true});
          }
        } else {
          action.storeUserProfile(firebaseUserData);
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
      const {FitlyFirebase} = this.props;
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
        return (<FitlyNavigator FitlyFirebase={FitlyFirebase}/>);
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
    FitlyFirebase: state.app.FitlyFirebase,
  };
};

const mapDispatchToProps = function(dispatch) {
 return {
   action: bindActionCreators({ updateLogginStatus, setFirebaseUID, storeUserProfile }, dispatch),
   navigation: bindActionCreators({ resetTo }, dispatch)
 };
};

export default connect(mapStateToProps, mapDispatchToProps)(FitlyApp);
