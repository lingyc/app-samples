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

class Signup extends Component {
  constructor(props) {
    super(props);
    //refactor to redux later, must validate input
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      error: ''
    }
    firestack = this.props.firestack;
  }

  //TODO error reporting for login error
  _handleFBLogin() {
    (async () => {
      try {
        this.props.action.setLoadingState(true);
        await asyncFBLogout();
        this.props.action.setSignUpMedthod('Facebook');
        const data = await asyncFBLoginWithPermission(["public_profile", "email","user_friends","user_location","user_birthday"]);
        const userFBprofile = await fetchFBProfile(data.credentials.token);
        const user = await firestack.auth.signInWithProvider('facebook', data.credentials.token, '');
        const userRef = firestack.database.ref('users/' + user.uid);
        const firebaseUserData = await userRef.once('value');
        if (firebaseUserData.value === null) {
          const { name, first_name, last_name, picture, email, gender, birthday, friends, location, id } = userFBprofile
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
            this.props.navigator.resetTo({ name: 'Profile', from: 'FBinitSignup'});
        } else {
          this.props.navigator.resetTo({ name: 'Profile', from: 'profile complete'});
        }
        this.props.action.setLoadingState(false);
      } catch(error) {
        this.props.action.printAuthError(error);
        console.log("Error: ", error);
      }
    })();
  }

  _handleEmailSignup() {
    //validate the email, password and names before sending it out
    (async () => {
      try {
        this.props.action.setLoadingState(true);
        await this.props.firestack.auth.signOut();
        const user = await firestack.auth.createUserWithEmail(this.state.email, this.state.password)
        this.props.action.setSignUpMedthod('Email');

        //send verification email, which is not yet available on firestack
        // firestack.auth.sendEmailVerification();

        //update the user auth profile, which is not yet available on firestack
        // const user2 = await firestack.auth.getCurrentUser();
        // user2.updateProfile({
        //   displayName: this.state.firstName + ' ' + this.state.lastName,
        // });

        const userRef = firestack.database.ref('users/' + user.uid);
        userRef.set({
          name: this.state.firstName + ' ' + this.state.lastName,
          first_name: this.state.firstName,
          last_name: this.state.lastName,
          email: this.state.email,
          picture: null,
          gender: null,
          birthday: null,
          friends: null,
          location: null,
          provider: 'Firebase',
          FacebookID: null,
          height: 0,
          weight: 0,
          activeLevel: 0,
          followerCount: 0,
          followingCount: 0,
          sessionCount: 0,
          currentLocation: null,
          profileComplete: false,
        });
        this.props.navigator.resetTo({ name: 'Profile', from: 'Email signup' });
        this.props.action.setLoadingState(true);
      } catch(error) {
        this.props.action.printAuthError(error);
        console.log("Error: ", error);
      }
    })();
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
          JOIN US
        </Text>
        <TouchableHighlight style={styles.loginButton} onPress={() => this._handleFBLogin()}>
          <Text style={styles.buttonText}>
            Join with Facebook
          </Text>
        </TouchableHighlight>
        <Text style={styles.disclamerText}>
          or
        </Text>
        <TextInput
          style={styles.signUpFormText}
          onChangeText={(text) => this.setState({firstName: text})}
          value={this.state.firstName}
          placeholder="First Name"
          placeholderTextColor="white"
        />
        <TextInput
          style={styles.signUpFormText}
          onChangeText={(text) => this.setState({lastName: text})}
          value={this.state.lastName}
          placeholder="Last Name"
          placeholderTextColor="white"
        />
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
        <Text style={styles.disclamerText}>
          By continuing, you agree to Fitly's Terms of Service & Privacy Policy.
        </Text>
        <TouchableHighlight style={styles.actionButtonInverted} onPress={() => this._handleEmailSignup()}>
          <Text style={styles.buttonText}>
            SWIPE TO JOIN
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

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
