/**
 * @flow
 */

import React, { Component } from 'react';
import { StatusBar, TextInput, TouchableHighlight, Text, View, ActivityIndicator, TouchableWithoutFeedback, KeyboardAvoidingView } from 'react-native';
import { loginStyles, loadingStyle } from '../styles/styles.js'
// import { setSignUpMedthod, printAuthError } from '../actions/auth.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
const dismissKeyboard = require('dismissKeyboard')

class profileInfoView extends Component {
  constructor(props) {
    super(props);

  }


  render() {
    <TouchableWithoutFeedback style={{flex:1}} onPress={()=> dismissKeyboard()}>
      <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={100} style={loginStyles.container}>
        <StatusBar
          barStyle="light-content"
        />
        <Text style={loginStyles.header}>
          YOUR PROFILE
        </Text>
        <Text style={loginStyles.textMid}>
          Your stats help us find and suggest goals and workouts for you. This information will never be made public.
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
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  }
 };

 const mapStateToProps = function(state) {
  return {
    uID: state.auth.uID
  };
};

const mapDispatchToProps = function(dispatch) {
  return {
    action: bindActionCreators({ printAuthError, setLoadingState }, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(profileInfoView);
