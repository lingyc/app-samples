/**
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import { asyncFBLogout } from '../library/asyncFBLogin.js';
import { resetAuthState, printAuthError } from '../actions/auth.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';


class Profile extends Component {
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
          this.props.navigator.resetTo({name: 'Welcome'});
      } catch(err) {
        this.props.action.printAuthError(err);
        console.log('Uh oh... something weird happened', err)
      }
    })();
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.instructions}>
          in profile view
        </Text>
        <Text style={styles.instructions}>
          {this.props.route.from}
        </Text>
        <TouchableHighlight style={styles.loginButton} onPress={() => this._logout()}>
          <Text style={styles.buttonText}>
            Logout
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
     backgroundColor: '#F5FCFF',
   },
   welcome: {
     fontSize: 20,
     textAlign: 'center',
     margin: 10,
   },
   instructions: {
     textAlign: 'center',
     color: '#333333',
     marginBottom: 5,
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
   }
 });

 const mapStateToProps = function(state) {
  return {
    signInMethod: state.auth.signInMethod
  };
};

const mapDispatchToProps = function(dispatch) {
  return {
    action: bindActionCreators({ resetAuthState, printAuthError }, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
