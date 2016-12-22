/**
 * @flow
 */

import React, { Component } from 'react';
import { StatusBar, TextInput, TouchableHighlight, Text, View, ActivityIndicator, TouchableWithoutFeedback, KeyboardAvoidingView } from 'react-native';
import { loginStyles, loadingStyle } from '../styles/styles.js'
import FBloginBtn from '../components/FBloginBtn.js';
import { setFirebaseUID, setSignInMedthod, printAuthError } from '../actions/auth.js';
import { setLoadingState } from '../actions/app.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
const dismissKeyboard = require('dismissKeyboard')

class SignInView extends Component {
  constructor(props) {
    super(props);
    //refactor to redux later, must validate input
    this.state = {
      email: '',
      password: '',
      error: ''
    }
    firestack = this.props.firestack;
    FitlyNavigator = this.props.navigator;
    action = this.props.action;
  }

  _handleEmailSignin() {
    //validate the email, password and names before sending it out
    (async () => {
      try {
        await firestack.auth.signOut();
        const authData = await firestack.auth.signInWithEmail(this.state.email, this.state.password)
        action.setSignInMedthod('Email');
        action.setFirebaseUID(authData.user.uid);

        //TODO abstract away check for profile completion
        //write a isProfileComplete function
        const userRef = firestack.database.ref('users/' + authData.user.uid);
        const firebaseUserData = await userRef.once('value');
        if (firebaseUserData.value.profileComplete === false) {
          FitlyNavigator.resetTo({ name: 'SetupProfileView', from: 'SetupProfileView, profile incomplete' });
        } else {
          FitlyNavigator.resetTo({ name: 'ProfileView', from: 'SigninEmail, profile complete' });
        }
      } catch(error) {
        action.printAuthError(error);
        console.log("Error: ", error);
      }
    })()
  }

  focusNextField = (nextField) => {
    this.refs[nextField].focus();
  };

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
      <TouchableWithoutFeedback style={{flex:1}} onPress={()=> dismissKeyboard()}>
        <KeyboardAvoidingView behavior="padding" style={loginStyles.container}>
          <StatusBar
            barStyle="light-content"
          />
          <Text style={loginStyles.header}>
            SIGN IN
          </Text>

          <FBloginBtn firestack={firestack} navigator={FitlyNavigator} label="Connect With Facebook"/>
          <Text style={loginStyles.textSmall}>
            or
          </Text>

          <View style={loginStyles.form}>
            <TextInput
              returnKeyType="next"
              maxLength={30}
              clearButtonMode="always"
              ref="1"
              onSubmitEditing={() => this.focusNextField('2')}
              style={loginStyles.input}
              onChangeText={(text) => this.setState({email: text})}
              value={this.state.email}
              placeholder="Email"
              placeholderTextColor="white"
            />
          </View>

          <View style={loginStyles.form}>
            <TextInput
              returnKeyType="next"
              maxLength={30}
              clearButtonMode="always"
              style={loginStyles.input}
              onSubmitEditing={() => this._handleEmailSignin()}
              onChangeText={(text) => this.setState({password: text})}
              value={this.state.password}
              placeholder="Password"
              placeholderTextColor="white"
            />
          </View>

          <TouchableHighlight onPress={() => this._handleEmailSignup()}>
            <Text style={loginStyles.textMid}>
              Forgot your password?
            </Text>
          </TouchableHighlight>

          <TouchableHighlight style={loginStyles.swipeBtn} onPress={() => this._handleEmailSignup()}>
            <Text style={loginStyles.btnText}>
              SWIPE TO SIGN IN
            </Text>
          </TouchableHighlight>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    );
   }
 };

 const mapStateToProps = function(state) {
  return {
    loading: state.app.loading
  };
};

const mapDispatchToProps = function(dispatch) {
  return {
    action: bindActionCreators({ setFirebaseUID, setSignInMedthod, printAuthError, setLoadingState }, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignInView);
