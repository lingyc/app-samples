/**
 * @flow
 */

import React, { Component } from 'react';
import { View, TouchableHighlight, StyleSheet, Text } from 'react-native';
import { asyncFBLoginWithPermission, asyncFBLogout, fetchFBProfile } from '../library/asyncFBLogin.js';
import { setSignUpMedthod, printAuthError } from '../actions/auth.js';
import { setLoadingState } from '../actions/app.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class FBloginBtn extends Component {
  constructor(props) {
    super(props);
    firestack = this.props.firestack;
    navigator = this.props.navigator;
    action = this.props.action;
  }

  //TODO error reporting for login error
  _handleFBLogin() {
    (async () => {
      try {
        action.setLoadingState(true);
        await asyncFBLogout();
        action.setSignUpMedthod('Facebook');
        const data = await asyncFBLoginWithPermission(["public_profile", "email","user_friends","user_location","user_birthday"]);
        const userFBprofile = await fetchFBProfile(data.credentials.token);
        const user = await firestack.auth.signInWithProvider('facebook', data.credentials.token, '');
        const userRef = firestack.database.ref('users/' + user.uid);
        const firebaseUserData = await userRef.once('value');
        if (firebaseUserData.value === null) {
          const { name, first_name, last_name, picture, email, gender, birthday, friends, location, id } = userFBprofile;
          userRef.set({
            name: name,
            first_name: first_name,
            last_name: last_name,
            picture: picture.data.url,
            email: email,
            gender: gender,
            birthday: birthday,
            friends: friends.data,
            location: location.name,
            provider: 'Facebook',
            FacebookID: id,
            height: 0,
            weight: 0,
            activeLevel: 0,
            followerCount: 0,
            followingCount: 0,
            sessionCount: 0,
            currentLocation: null,
            profileComplete: false
          });
        } else if (firebaseUserData.value.profileComplete === false) {
          FitlyNavigator.resetTo({ name: 'ProfileView', from: 'FBinitSignup'});
        } else {
          FitlyNavigator.resetTo({ name: 'ProfileView', from: 'profile complete'});
        }
        action.setLoadingState(false);
      } catch(error) {
        action.printAuthError(error);
        console.log("Error: ", error);
      }
    })();
  }

  render() {
    return (
        <TouchableHighlight style={styles.loginButton} onPress={() => this._handleFBLogin()}>
          <Text style={styles.buttonText}>
            {this.props.text}
          </Text>
        </TouchableHighlight>
    )
  }
 };

 const styles = StyleSheet.create({
   buttonText: {
     fontSize: 19,
     textAlign: 'center',
     color: '#1D2F7B',
   },
   loginButton: {
     justifyContent: 'center',
     flexDirection: 'column',
     height: 50,
     width: 270,
     backgroundColor: 'white'
   }
 });

 const mapStateToProps = function(state) {
  return {
    loading: state.app.loading
  };
};

const mapDispatchToProps = function(dispatch) {
  return {
    action: bindActionCreators({ setSignUpMedthod, printAuthError, setLoadingState }, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FBloginBtn);
