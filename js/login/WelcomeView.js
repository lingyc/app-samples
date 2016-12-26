/**
 * @flow
 */

import React, { Component } from 'react';
import { StatusBar, TouchableHighlight, Text, View } from 'react-native';
import { welcomeStyles } from '../styles/styles.js'
import { push } from '../actions/navigation.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class WelcomeView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clicked: 'joinUs'
    };
  }

  _goToSignIn() {
    this.setState({clicked: 'signIn'});
    this.props.navigation.push({ key: 'SignInView', global: true });
  }

  _goToSignUp() {
    this.setState({clicked: 'joinUs'});
    this.props.navigation.push({ key: 'SignUpView', global: true });
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

 const mapDispatchToProps = function(dispatch) {
  return {
    navigation: bindActionCreators({ push }, dispatch),
  };
 };

 export default connect(() => { return {}; }, mapDispatchToProps)(WelcomeView);
