/**
 * @flow
 */

import React, { Component } from 'react';
import { View, TouchableHighlight, Text } from 'react-native';
import { loginStyles } from '../styles/styles.js'
import { asyncFBLoginWithPermission, asyncFBLogout, fetchFBProfile } from '../library/asyncFBLogin.js';
import { setFirebaseUID, setSignUpMethod, printAuthError, clearAuthError } from '../actions/auth.js';
import { storeUserProfile } from '../actions/user.js';
import { setLoadingState } from '../actions/app.js';
import { resetTo } from '../actions/navigation.js';
import { connect } from 'react-redux';
import Firebase from 'firebase';
import { bindActionCreators } from 'redux';
import { updateCurrentLocationInDB } from '../library/firebaseHelpers.js';

class FBloginBtn extends Component {
  constructor(props) {
    super(props);
  }

  //TODO error reporting for login error
  _handleFBLogin() {
    const { FitlyFirebase, navigation, action } = this.props;
    (async () => {
      try {
        action.clearAuthError();
        action.setLoadingState(true);
        await asyncFBLogout();
        const data = await asyncFBLoginWithPermission(["public_profile", "email","user_friends","user_location","user_birthday"]);
        action.setSignUpMethod('Facebook');
        const userFBprofile = await fetchFBProfile(data.credentials.token);
        const credential = Firebase.auth.FacebookAuthProvider.credential(data.credentials.token);
        const user = await FitlyFirebase.auth().signInWithCredential(credential);
        await updateCurrentLocationInDB(user.uid);
        const userRef = FitlyFirebase.database().ref('users/' + user.uid + '/');
        action.setFirebaseUID(user.uid);
        //update user's Facebook friends everytime they login with Facebook
        await FitlyFirebase.database().ref('users/' + user.uid + '/private/friends').set(userFBprofile.friends);
        const firebaseUserData = (await userRef.once('value')).val();
        // console.log('firebaseUserData', firebaseUserData);
        if (firebaseUserData === null) {
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
              dateJoined: Firebase.database.ServerValue.TIMESTAMP,
              lastActive: Firebase.database.ServerValue.TIMESTAMP,
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
          navigation.resetTo({ key: 'SetupStatsView', global: true, from: 'FBinitSignup'});
        } else if (firebaseUserData.profileComplete === false) {
          navigation.resetTo({ key: 'SetupStatsView', global: true, from: 'FBinitSignup'});
        } else {
          action.storeUserProfile(firebaseUserData);
          navigation.resetTo({ key: 'TabNavigator', global: true, from: 'profile complete'});
        }
        action.setLoadingState(false);
      } catch(error) {
        action.setLoadingState(false);
        console.log(error);
        action.printAuthError(error.message);
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
    action: bindActionCreators({ setFirebaseUID, setSignUpMethod, printAuthError, setLoadingState, storeUserProfile, clearAuthError }, dispatch),
    navigation: bindActionCreators({ resetTo }, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FBloginBtn);
