/**
 * @flow
 */

import React, { Component } from 'react';
import { StatusBar, TouchableHighlight, Text, View } from 'react-native';
import { welcomeStyles } from '../styles/styles.js'

class WelcomeView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clicked: 'joinUs'
    };
  }

  _goToSignIn() {
    this.setState({clicked: 'signIn'});
    this.props.navigator.push({
      name: 'SignInView'
    });
  }

  _goToSignUp() {
    this.setState({clicked: 'joinUs'});
    this.props.navigator.push({
      name: 'SignUpView'
    });
  }

  render() {
    return (
      <View style={welcomeStyles.container}>
        <StatusBar
          barStyle="light-content"
        />
        <View style={welcomeStyles.logoContainer}>
          <Text style={welcomeStyles.logo}>
            Fitly
          </Text>
        </View>
        <View style={welcomeStyles.logoContainer}>
          <Text style={welcomeStyles.messageText}>
            Find fitness with friends.
          </Text>
          <Text style={welcomeStyles.messageTextLight}>
            Meet work out partnes and programs just for you.
          </Text>
          <View style={welcomeStyles.buttonContainer}>
            <TouchableHighlight
              style={(this.state.clicked === 'joinUs') ? welcomeStyles.actionButton : welcomeStyles.actionButtonInverted}
              onPress={() => this._goToSignUp()}>
              <Text style={(this.state.clicked === 'joinUs') ? welcomeStyles.buttonText : welcomeStyles.buttonTextInverted}>
                JOIN US
              </Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={(this.state.clicked === 'signIn') ? welcomeStyles.actionButton : welcomeStyles.actionButtonInverted}
              onPress={() => this._goToSignIn()}>
              <Text style={(this.state.clicked === 'signIn') ? welcomeStyles.buttonText : welcomeStyles.buttonTextInverted}>
                SIGN IN
              </Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    )
   }
 };

export default WelcomeView;
