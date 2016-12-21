/**
 * @flow
 */

import React, { Component } from 'react';
import { StatusBar, TextInput, TouchableHighlight, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import FBloginBtn from '../components/FBloginBtn.js';
import { setSignInMedthod, printAuthError } from '../actions/auth.js';
import { setLoadingState } from '../actions/app.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

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
        const userRef = firestack.database.ref('users/' + authData.user.uid);
        const firebaseUserData = await userRef.once('value');
        if (firebaseUserData.value.profileComplete === false) {
          FitlyNavigator.resetTo({ name: 'ProfileView', from: 'SigninEmail, profile incomplete' });
        } else {
          FitlyNavigator.resetTo({ name: 'ProfileView', from: 'SigninEmail, profile complete' });
        }
      } catch(error) {
        action.printAuthError(error);
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
          SIGN IN
        </Text>
        <FBloginBtn firestack={firestack} navigator={FitlyNavigator} text="Connect With Facebook"/>
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
            Forgot your password?
          </Text>
        </TouchableHighlight>
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
    action: bindActionCreators({ setSignInMedthod, printAuthError, setLoadingState }, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignInView);
