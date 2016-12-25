/**
 * @flow
 */

import React, { Component } from 'react';
import { StatusBar, TextInput, TouchableHighlight, Text, View, ActivityIndicator, TouchableWithoutFeedback, KeyboardAvoidingView } from 'react-native';
import { loginStyles, loadingStyle, commonStyle } from '../styles/styles.js'
import FBloginBtn from '../common/FBloginBtn.js';
import { setFirebaseUID, setSignUpMethod, printAuthError, clearAuthError } from '../actions/auth.js';
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
    }
  }

  _handleEmailSignup() {
    //TODO error reporting for login error
    //TODO validate the email, password and names before sending it out
    const { firestack, navigator: FitlyNavigator, action } = this.props;

    (async () => {
      try {
        action.setLoadingState(true);
        action.clearAuthError();
        await firestack.auth.signOut();
        const user = await firestack.auth.createUserWithEmail(this.state.email, this.state.password)
        action.setSignUpMethod('Email');
        action.setFirebaseUID(user.uid);

        //TODO: send verification email, which is not yet available on firestack
        // firestack.auth.sendEmailVerification();

        const userRef = firestack.database.ref('users/' + user.uid);
        const serverVal = await firestack.ServerValue;
        userRef.set({
          public: {
            first_name: this.state.firstName,
            last_name: this.state.lastName,
            provider: 'Firebase',
            followerCount: 0,
            followingCount: 0,
            sessionCount: 0,
            profileComplete: false,
            dateJoined: serverVal.TIMESTAMP
          },
          private: {
            email: this.state.email,
          }
        });
        action.setLoadingState(false);
        FitlyNavigator.resetTo({ name: 'SetupProfileView', from: 'Email signup' });
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
    } else {
      return (
        <TouchableWithoutFeedback onPress={()=> dismissKeyboard()}>
          <View style={loginStyles.container}>
            <KeyboardAvoidingView behavior="position" style={loginStyles.KeyboardAvoidingContainer}>
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
              {(this.props.error) ? (<Text style={commonStyle.error}> {this.props.error} </Text>) : <Text style={commonStyle.hidden}> </Text> }
            </KeyboardAvoidingView>
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
    loading: state.app.loading,
    error: state.auth.errorMsg
  };
};

const mapDispatchToProps = function(dispatch) {
  return {
    action: bindActionCreators({ setFirebaseUID, setSignUpMethod, printAuthError, clearAuthError, setLoadingState }, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUpView);
