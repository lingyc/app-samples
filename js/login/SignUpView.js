/**
 * @flow
 */

import React, { Component } from 'react';
import { StatusBar, TextInput, TouchableHighlight, Text, View, ScrollView, ActivityIndicator, TouchableWithoutFeedback, KeyboardAvoidingView } from 'react-native';
import { loginStyles, loadingStyle, commonStyle } from '../styles/styles.js'
import FBloginBtn from '../common/FBloginBtn.js';
import { setFirebaseUID, setSignUpMethod, printAuthError, clearAuthError } from '../actions/auth.js';
import { setLoadingState } from '../actions/app.js';
import { resetTo } from '../actions/navigation.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Firebase from 'firebase';

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

  componentWillMount() {
    this.props.action.clearAuthError();
  }

  _handleEmailSignup() {
    //TODO error reporting for login error
    //TODO validate the email, password and names before sending it out
    const { FitlyFirebase, navigation, action } = this.props;

    (async () => {
      try {
        action.setLoadingState(true);
        action.clearAuthError();
        await FitlyFirebase.auth().signOut();
        const user = await FitlyFirebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
        action.setSignUpMethod('Email');
        action.setFirebaseUID(user.uid);

        //TODO: send verification email
        // firebase.auth().sendEmailVerification();

        const userRef = FitlyFirebase.database().ref('users/' + user.uid);
        const serverVal = await Firebase.database.ServerValue;
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
        navigation.resetTo({ key: 'SetupProfileView', global: true, from: 'Email signup' });
      } catch(error) {
        action.setLoadingState(false);
        action.printAuthError(error.message);
      }
    })();
  }

  focusNextField = (nextField) => {
    this.props.action.clearAuthError();
    this.refs[nextField].focus();
  };

  render() {
    const { FitlyFirebase } = this.props;

    if (this.props.loading === true) {
      return (
        <View style={loadingStyle.app}>
          <StatusBar
            barStyle="default"
          />
          <ActivityIndicator
            animating={this.state.loading}
            style={{height: 80}}
            size="large"
          />
        </View>
      );
    } else {
      return (
        <View style={{flex: 1, backgroundColor: '#1D2F7B'}}>
          <ScrollView keyboardDismissMode="on-drag" contentContainerStyle={loginStyles.container}>
            <KeyboardAvoidingView behavior="position" style={loginStyles.KeyboardAvoidingContainer}>
              <StatusBar
                barStyle="light-content"
              />

              <Text style={loginStyles.header}>
                JOIN US
              </Text>

              <FBloginBtn FitlyFirebase={FitlyFirebase} label='Join with Facebook'/>

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
            <Text style={{height: 100}}></Text>
          </ScrollView>
          {/* TODO: use SwipeableListView? */}
          <TouchableHighlight style={loginStyles.swipeBtn} onPress={() => this._handleEmailSignup()}>
            <Text style={loginStyles.btnText}>
              SWIPE TO JOIN
            </Text>
          </TouchableHighlight>
        </View>
        )
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
    action: bindActionCreators({ setFirebaseUID, setSignUpMethod, printAuthError, clearAuthError, setLoadingState }, dispatch),
    navigation: bindActionCreators({ resetTo }, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUpView);
