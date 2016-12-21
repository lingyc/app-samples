/**
 * @flow
 */

import React, { Component } from 'react';
import { StatusBar, TextInput, TouchableHighlight, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { asyncFBLoginWithPermission, asyncFBLogout, fetchFBProfile } from '../library/asyncFBLogin.js';
import { setSignUpMedthod, printAuthError } from '../actions/auth.js';
import { setLoadingState } from '../actions/app.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class Signin extends Component {
  constructor(props) {
    super(props);
    //refactor to redux later, must validate input
    this.state = {
      email: '',
      password: '',
      error: ''
    }
    firestack = this.props.firestack;
  }

  //TODO error reporting for login error
  //refactor into separete facebook btn component
  _handleFBLogin() {
    (async () => {
      try {
        await asyncFBLogout();
        const data = await asyncFBLoginWithPermission(["public_profile", "email","user_friends","user_location","user_birthday"]);
        this.props.action.setLoadingState(true);
        const userFBprofile = await fetchFBProfile(data.credentials.token);
        const user = await firestack.auth.signInWithProvider('facebook', data.credentials.token, '');
        this.props.action.setSignUpMedthod('Facebook');
        const userRef = firestack.database.ref('users/' + user.uid);
        const firebaseUserData = await userRef.once('value');
        if (firebaseUserData.value === null) {
          const { name, first_name, last_name, picture, email, gender, birthday, friends, location } = userFBprofile
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
            FacebookID: "10158053821090121",
            height: 0,
            weight: 0,
            activeLevel: 0,
            followerCount: 0,
            followingCount: 0,
            sessionCount: 0,
            currentLocation: null,
            profileComplete: false
          });
        }
        if (firebaseUserData.value.profileComplete === false) {
            this.props.navigator.resetTo({ name: 'Profile', from: 'FBinitSignin'});
        } else {
          this.props.navigator.resetTo({ name: 'Profile', from: 'profile complete'});
        }
        this.props.action.setLoadingState(false);
      } catch(error) {
        this.props.action.printAuthError(error);
        console.log("Error: ", error);
      }
    })()
  }

  _handleEmailSignin() {
    //validate the email, password and names before sending it out
    (async () => {
      try {
        await this.props.firestack.auth.signOut();
        const authData = await firestack.auth.signInWithEmail(this.state.email, this.state.password)
        this.props.action.setSignInMedthod('Email');
        const userRef = firestack.database.ref('users/' + authData.user.uid);
        const firebaseUserData = await userRef.once('value');
        if (firebaseUserData.value.profileComplete === false) {
          this.props.navigator.resetTo({ name: 'Profile', from: 'SigninEmail, profile incomplete' });
        } else {
          this.props.navigator.resetTo({ name: 'Profile', from: 'SigninEmail, profile complete' });
        }
      } catch(error) {
        this.props.action.printAuthError(error);
        console.log("Error: ", error);
      }
    })()
  }

  render() {
    if (this.props.loading === true) {
      return (
        <View style={styles.centering}>
          <ActivityIndicator
            animating={this.state.loading}
            style={{height: 80}}
            size="large"
          />
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <StatusBar
          barStyle="light-content"
        />
        <Text style={styles.mainHeader}>
          SIGNIN
        </Text>
        <TouchableHighlight style={styles.loginButton} onPress={() => this._handleFBLogin()}>
          <Text style={styles.buttonText}>
            Signin with Facebook
          </Text>
        </TouchableHighlight>
        <Text style={styles.disclamerText}>
          or
        </Text>
        <TextInput
          style={styles.signUpFormText}
          onChangeText={(text) => this.setState({email: text})}
          value={this.state.email}
          placeholder="Email"
          placeholderTextColor="white"
        />
        <TextInput
          style={styles.signUpFormText}
          onChangeText={(text) => this.setState({password: text})}
          value={this.state.password}
          placeholder="Choose Password"
          placeholderTextColor="white"
        />
        <TouchableHighlight style={styles.actionButtonInverted} onPress={() => this._handleEmailSignup()}>
          <Text style={styles.buttonText}>
            SWIPE TO SIGNIN
          </Text>
        </TouchableHighlight>
        </View>
    )
   }
 };

 const styles = StyleSheet.create({
   container: {
     flex: 1,
     justifyContent: 'center',
     alignItems: 'center',
     backgroundColor: '#1D2F7B',
   },
   mainHeader: {
     fontFamily: 'HelveticaNeue',
     fontSize: 50,
     color: 'white',
     fontWeight: '400',
   },
   disclamerText: {
     fontSize: 12,
     marginBottom: 0,
     textAlign: 'center',
     color: '#FFFFFF',
     marginBottom: 5
   },
   signUpFormText: {
     height: 40,
     borderColor: 'gray',
     borderWidth: 1,
     textAlign: 'center',
     color: '#FFFFFF'
   },
   buttonText: {
     fontSize: 20,
     marginBottom: 0,
     textAlign: 'center',
     color: '#1D2F7B',
     marginBottom: 5,
   },
   loginButton: {
     backgroundColor: 'white'
   },
   actionButtonInverted: {
    alignSelf: 'stretch',
    height: 30,
    borderColor: '#FFFFFF',
    backgroundColor: 'white',
    borderWidth: .5,
  },
  centering: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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

export default connect(mapStateToProps, mapDispatchToProps)(Signin);
