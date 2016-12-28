/**
 * @flow
 */

import React, { Component } from 'react';
import { Text, View, TouchableHighlight } from 'react-native';
import { headerStyle } from '../styles/styles.js';
import { asyncFBLogout } from '../library/asyncFBLogin.js';
import { resetAuthState, printAuthError } from '../actions/auth.js';
import { updateLogginStatus, clearUserProfile } from '../actions/user.js';
import { resetTo } from '../actions/navigation.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';


class LogoutBtn extends Component {
  constructor(props) {
    super(props);
  }

  //refactor out later into a service or a logout btn component
  _logout() {
    (async () => {
      try {
        if (this.props.signInMethod === 'Facebook') {
          await asyncFBLogout();
        }
          await this.props.firestack.auth.signOut()
          this.props.action.resetAuthState();
          this.props.action.updateLogginStatus(false);
          this.props.action.clearUserProfile();
          this.props.navigation.resetTo({key: 'WelcomeView', global: true});
      } catch(err) {
        this.props.action.printAuthError(err);
        console.log('Uh oh... something weird happened', err)
      }
    })();
  }

  render() {
    return (
      <TouchableHighlight style={headerStyle.logoutBtn} onPress={() => this._logout()}>
        <Text style={headerStyle.logoutBtnText}>
          Logout
        </Text>
      </TouchableHighlight>
    )
   }
 };

 const mapStateToProps = function(state) {
  return {
    signInMethod: state.auth.signInMethod,
    firestack: state.app.firestack,
  };
};

const mapDispatchToProps = function(dispatch) {
  return {
    action: bindActionCreators({ resetAuthState, printAuthError, updateLogginStatus, clearUserProfile }, dispatch),
    navigation: bindActionCreators({ resetTo }, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LogoutBtn);
