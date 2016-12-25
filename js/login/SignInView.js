/**
 * @flow
 */

import React, { Component } from 'react';
import { StatusBar, TextInput, TouchableHighlight, Text, View, ActivityIndicator, TouchableWithoutFeedback, KeyboardAvoidingView } from 'react-native';
import { loginStyles, loadingStyle, commonStyle } from '../styles/styles.js'
import FBloginBtn from '../common/FBloginBtn.js';
import { setFirebaseUID, setSignInMethod, printAuthError, clearAuthError } from '../actions/auth.js';
import { updateLogginStatus, storeUserProfile } from '../actions/user.js';
import { setLoadingState } from '../actions/app.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
const dismissKeyboard = require('dismissKeyboard')

class SignInView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    }
  }

  _handleEmailSignin() {
    //TODO: validate the email, password and names before sending it out
    const { firestack, navigator: FitlyNavigator, action } = this.props;
    (async () => {
      try {
        action.clearAuthError();
        action.setLoadingState(true);
        const authData = await firestack.auth.signInWithEmail(this.state.email, this.state.password);
        action.updateLogginStatus(true);
        action.setSignInMethod('Email');
        action.setFirebaseUID(authData.user.uid);

        //TODO abstract away check for profile completion, write a isProfileComplete function
        const userRef = firestack.database.ref('users/' + authData.user.uid);
        const firebaseUserData = await userRef.once('value');
        if (firebaseUserData.value.public.profileComplete === false) {
          FitlyNavigator.resetTo({ name: 'SetupProfileView', from: 'SetupProfileView, profile incomplete' });
          action.setLoadingState(false);
        } else {
          action.storeUserProfile(firebaseUserData.value);
          FitlyNavigator.resetTo({ name: 'ProfileView', from: 'SigninEmail, profile complete' });
          action.setLoadingState(false);
        }
      } catch(error) {
        action.setLoadingState(false);
        action.printAuthError(error.description);
      }
    })();
  }

  focusNextField = (nextField) => {
    this.props.action.clearAuthError();
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
              keyboardType="email-address"
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
              keyboardType="email-address"
              secureTextEntry={true}
              placeholder="Password"
              placeholderTextColor="white"
            />
          </View>
          {/* TODO: need to implement the forget password and reset password feature */}
          <TouchableHighlight onPress={() => this._handleEmailSignin()}>
            <Text style={loginStyles.textMid}>
              Forgot your password?
            </Text>
          </TouchableHighlight>
          {(this.props.error) ? (<Text style={commonStyle.error}> {this.props.error} </Text>) : <Text style={commonStyle.hidden}> </Text> }
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
    loading: state.app.loading,
    error: state.auth.errorMsg
  };
};

const mapDispatchToProps = function(dispatch) {
  return {
    action: bindActionCreators({ setFirebaseUID, setSignInMethod, printAuthError, clearAuthError, setLoadingState, updateLogginStatus, storeUserProfile }, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignInView);
