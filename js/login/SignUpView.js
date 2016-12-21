/**
 * @flow
 */

import React, { Component } from 'react';
import { StatusBar, TextInput, TouchableHighlight, Text, View, ActivityIndicator, TouchableWithoutFeedback } from 'react-native';
import { loginStyles, loadingStyle } from '../styles/styles.js'
import FBloginBtn from '../components/FBloginBtn.js';
import { setSignUpMedthod, printAuthError } from '../actions/auth.js';
import { setLoadingState } from '../actions/app.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
const dismissKeyboard = require('dismissKeyboard')

class SignUpView extends Component {
  constructor(props) {
    super(props);
    //refactor to redux later, must validate input
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      passwordConfirm: '',
      error: ''
    }
    firestack = this.props.firestack;
    FitlyNavigator = this.props.navigator;
    action = this.props.action;
  }

  //TODO error reporting for login error
  _handleEmailSignup() {
    //TODO validate the email, password and names before sending it out
    (async () => {
      try {
        action.setLoadingState(true);
        await firestack.auth.signOut();
        const user = await firestack.auth.createUserWithEmail(this.state.email, this.state.password)
        action.setSignUpMedthod('Email');

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
        FitlyNavigator.resetTo({ name: 'ProfileView', from: 'Email signup' });
        action.setLoadingState(true);
      } catch(error) {
        action.setLoadingState(false);
        action.printAuthError(error);
        console.log("Sign Up Error: ", error);
      }
    })();
  }

  focusNextField = (nextField) => {
    this.refs[nextField].focus();
  };

  render() {
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
    } else {
      return (
        <TouchableWithoutFeedback style={{flex:1}} onPress={()=> dismissKeyboard()}>
          <View style={loginStyles.container}>
            <StatusBar
              barStyle="light-content"
            />

            <Text style={loginStyles.header}>
              JOIN US
            </Text>

            <FBloginBtn firestack={firestack} navigator={FitlyNavigator} label='Join with Facebook'/>

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
                onChangeText={(text) => this.setState({firstName: text})}
                value={this.state.firstName}
                placeholder="First Name"
                placeholderTextColor="white"
              />
            </View>
            <View style={loginStyles.form}>
              <TextInput
                returnKeyType="next"
                maxLength={30}
                clearButtonMode="always"
                ref="2"
                onSubmitEditing={() => this.focusNextField('3')}
                style={loginStyles.input}
                onChangeText={(text) => this.setState({lastName: text})}
                value={this.state.lastName}
                placeholder="Last Name"
                placeholderTextColor="white"
              />
            </View>
            <View style={loginStyles.form}>
              <TextInput
                returnKeyType="next"
                maxLength={128}
                clearButtonMode="always"
                ref="3"
                onSubmitEditing={() => this.focusNextField('4')}
                keyboardType="email-address"
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
                maxLength={128}
                clearButtonMode="always"
                secureTextEntry={true}
                ref="4"
                onSubmitEditing={() => this.focusNextField('5')}
                style={loginStyles.input}
                onChangeText={(text) => this.setState({password: text})}
                value={this.state.password}
                placeholder="Choose Password"
                placeholderTextColor="white"
              />
            </View>
            <View style={loginStyles.form}>
              {/* make sure the confirm password is the same */}
              <TextInput
                returnKeyType="join"
                maxLength={128}
                clearButtonMode="always"
                secureTextEntry={true}
                ref="5"
                onSubmitEditing={() => this._handleEmailSignup()}
                style={loginStyles.input}
                onChangeText={(text) => this.setState({passwordConfirm: text})}
                value={this.state.passwordConfirm}
                placeholder="Confirm Password"
                placeholderTextColor="white"
              />
            </View>

            <Text style={loginStyles.disclamerText}>
              By continuing, you agree to Fitly's Terms of Service & Privacy Policy.
            </Text>
            <TouchableHighlight style={loginStyles.swipeBtn} onPress={() => this._handleEmailSignup()}>
              <Text style={loginStyles.btnText}>
                SWIPE TO JOIN
              </Text>
            </TouchableHighlight>
          </View>
        </TouchableWithoutFeedback>);
      }
    }
 };

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

export default connect(mapStateToProps, mapDispatchToProps)(SignUpView);