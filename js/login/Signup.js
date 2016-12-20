/**
 * @flow
 */

import React, { Component } from 'react';
import { StatusBar, TextInput, TouchableHighlight, StyleSheet, Text, View } from 'react-native';
import { FBLoginManager } from 'react-native-facebook-login';
import { setSignUpMedthod, printAuthError } from '../actions/auth.js';
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
  }

  //refactor into seperate login button component
  _handleFBLogin() {
    FBLoginManager.loginWithPermissions(["email","user_friends","user_location"], (error, data) => {
      if (!error) {
        let token = data.credentials.token
        this.props.firestack.auth.signInWithProvider('facebook', token, '') // facebook need only access token.
        .then((user)=>{
          //if user record doesn't exists
            //ask for more info
            //create user record
            //show slides
            //redirect to profile

          //if user record exists then redirect to profile
          console.log('facebook auth', data)
          console.log('firebase auth', user)
          this.props.action.setSignUpMedthod('Facebook');
          this.props.navigator.resetTo({ name: 'Profile' });
        })
      } else {
        this.props.action.printAuthError(err);
        console.log("Error: ", error);
      }
    })
  }

  _handleEmailSignup() {
    //validate the email, password and names before sending it out
    firestack.auth.createUserWithEmail(this.state.email, this.state.password)
    .then((user) => {
      //ask for more info
      //create user record
      //show slides
      //redirect to profile
      console.log('firebase: user created with email', user)
      this.props.action.setSignUpMedthod('Email');
      this.props.navigator.resetTo({ name: 'Profile' });
    })
    .catch((err) => {
      //if user exists, show btn to go to signin?
      this.props.action.printAuthError(err);
      console.log('An error occurred with createUserWithEmail', err);
    })
  }

  render() {
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
        <TouchableHighlight style={styles.actionButtonInverted} onPress={() => this._goToLogin()}>
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
  }
 });

 const mapStateToProps = function(state) {
  return {
    signUpMethod: state.auth.signUpMethod
  };
};

const mapDispatchToProps = function(dispatch) {
  return {
    action: bindActionCreators({ setSignUpMedthod, printAuthError }, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
