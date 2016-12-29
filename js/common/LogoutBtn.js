/**
 * @flow
 */

import React, { Component } from 'react';
import { Text, View, TouchableHighlight } from 'react-native';
import { headerStyle } from '../styles/styles.js';
import { asyncFBLogout } from '../library/asyncFBLogin.js';
import { resetAuthState, printAuthError } from '../actions/auth.js';
import { clearUserProfile } from '../actions/user.js';
import { resetTo, clearLocalNavState } from '../actions/navigation.js';
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
          await this.props.FitlyFirebase.auth().signOut()
          this.props.navigation.clearLocalNavState();
          this.props.action.resetAuthState();
          this.props.action.clearUserProfile();
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
    FitlyFirebase: state.app.FitlyFirebase,
  };
};

const mapDispatchToProps = function(dispatch) {
  return {
    action: bindActionCreators({ resetAuthState, printAuthError, clearUserProfile }, dispatch),
    navigation: bindActionCreators({ resetTo, clearLocalNavState }, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LogoutBtn);
