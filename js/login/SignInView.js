/**
 * @flow
 */

import React, { Component } from 'react';
import { StatusBar, TextInput, TouchableHighlight, Text, View, ActivityIndicator, TouchableWithoutFeedback, KeyboardAvoidingView } from 'react-native';
import { loginStyles, loadingStyle } from '../styles/styles.js'
import FBloginBtn from '../common/FBloginBtn.js';
import { setFirebaseUID, setSignInMethod, printAuthError } from '../actions/auth.js';
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
  }

  _handleEmailSignin() {
    //validate the email, password and names before sending it out
    const { firestack, navigator: FitlyNavigator, action } = this.props;
    (async () => {
      try {
        action.setLoadingState(true);
        const authData = await firestack.auth.signInWithEmail(this.state.email, this.state.password);
        console.log('signInView', setSignInMethod);
        console.log('signInView', action);
        action.setSignInMethod('Email');
        action.setFirebaseUID(authData.user.uid);

        //TODO abstract away check for profile completion
        //write a isProfileComplete function
        const userRef = firestack.database.ref('users/' + authData.user.uid);
        const firebaseUserData = await userRef.once('value');
        if (firebaseUserData.value.public.profileComplete === false) {
          FitlyNavigator.resetTo({ name: 'SetupProfileView', from: 'SetupProfileView, profile incomplete' });
          action.setLoadingState(false);
        } else {
          FitlyNavigator.resetTo({ name: 'ProfileView', from: 'SigninEmail, profile complete' });
          action.setLoadingState(false);
        }
      } catch(error) {
        action.setLoadingState(false);
        action.printAuthError(error);
        console.log("Error: ", error);
      }
    })();
  }

  focusNextField = (nextField) => {
    this.refs[nextField].focus();
  };

  render() {
    const { firestack, navigator: FitlyNavigator } = this.props;
    if (this.props.loading === true) {
      return (
        <View style={loadingStyle.app}>
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
              ref="2"
              style={loginStyles.input}
              onSubmitEditing={() => this._handleEmailSignin()}
              onChangeText={(text) => this.setState({password: text})}
              value={this.state.password}
              placeholder="Password"
              placeholderTextColor="white"
            />
          </View>

          <TouchableHighlight onPress={() => this._handleEmailSignin()}>
            <Text style={loginStyles.textMid}>
              Forgot your password?
            </Text>
          </TouchableHighlight>

          <TouchableHighlight style={loginStyles.swipeBtn} onPress={() => this._handleEmailSignin()}>
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
    action: bindActionCreators({ setFirebaseUID, setSignInMethod, printAuthError, setLoadingState }, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignInView);
