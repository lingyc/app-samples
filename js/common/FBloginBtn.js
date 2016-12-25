/**
 * @flow
 */

import React, { Component } from 'react';
import { View, TouchableHighlight, Text } from 'react-native';
import { loginStyles } from '../styles/styles.js'
import { asyncFBLoginWithPermission, asyncFBLogout, fetchFBProfile } from '../library/asyncFBLogin.js';
import { setFirebaseUID, setSignUpMethod, printAuthError } from '../actions/auth.js';
import { setLoadingState } from '../actions/app.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class FBloginBtn extends Component {
  constructor(props) {
    super(props);
  }

  //TODO error reporting for login error
  _handleFBLogin() {
    const { firestack, navigator: FitlyNavigator, action } = this.props;
    (async () => {
      try {
        action.printAuthError(null);
        action.setLoadingState(true);
        await asyncFBLogout();
        action.setSignUpMethod('Facebook');
        const data = await asyncFBLoginWithPermission(["public_profile", "email","user_friends","user_location","user_birthday"]);
        const userFBprofile = await fetchFBProfile(data.credentials.token);
        const user = await firestack.auth.signInWithProvider('facebook', data.credentials.token, '');
        const userRef = firestack.database.ref('users/' + user.uid);
        action.setFirebaseUID(user.uid);
        const firebaseUserData = await userRef.once('value');
        console.log('firebaseUserData', firebaseUserData);
        if (firebaseUserData.value === null) {
          console.log('creating user data');
          const { first_name, last_name, picture, email, gender, birthday, friends, location, id } = userFBprofile;
          userRef.set({
            public: {
              first_name: first_name,
              last_name: last_name,
              picture: picture.data.url,
              location: location.name,
              provider: 'Facebook',
              summary: '',
              profileComplete: false,
              FacebookID: id,
              dateJoined: firestack.ServerValue.TIMESTAMP,
              lastActive: firestack.ServerValue.TIMESTAMP,
              followerCount: 0,
              followingCount: 0,
              sessionCount: 0,
            },
            private: {
              email: email,
              gender: gender,
              birthday: birthday,
              friends: friends.data,
            }
          });
          FitlyNavigator.resetTo({ name: 'SetupStatsView', from: 'FBinitSignup'});
        } else if (firebaseUserData.value.profileComplete === false) {
          FitlyNavigator.resetTo({ name: 'SetupStatsView', from: 'FBinitSignup'});
        } else {
          FitlyNavigator.resetTo({ name: 'ProfileView', from: 'profile complete'});
        }
        action.setLoadingState(false);
      } catch(error) {
        action.setLoadingState(false);
        action.printAuthError(error.description);
      }
    })();
  }

  render() {
    return (
        <TouchableHighlight style={loginStyles.FBbtn} onPress={() => this._handleFBLogin()}>
          <Text style={loginStyles.btnText}>
            {this.props.label}
          </Text>
        </TouchableHighlight>
    )
  }
 };

 const mapStateToProps = function(state) {
  return {
    loading: state.app.loading
  };
};

const mapDispatchToProps = function(dispatch) {
  return {
    action: bindActionCreators({ setFirebaseUID, setSignUpMethod, printAuthError, setLoadingState }, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FBloginBtn);
