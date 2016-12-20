/**
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import { FBLoginManager } from 'react-native-facebook-login';
import { logout, printAuthError } from '../actions/auth.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class Profile extends Component {
  constructor(props) {
    super(props);
  }

  //refactor out later into a service or a logout btn component
  _logout() {
    if (this.props.signInMethod === 'Facebook') {
      //refactor FBLoginManager.logout with promises?
      FBLoginManager.logout((error, data) => {
        if (!error) {
          this.props.firestack.auth.signOut()
          .then(res => {
            console.log('facebook logout', data);
            console.log('firebase logout', res);
            this.props.action.logout();
            this.props.navigator.push({name: 'Welcome'});
          })
          .catch(err => {
            this.props.action.printAuthError(err);
            console.log('Uh oh... something weird happened', err)
          })
        } else {
          this.props.action.printAuthError(error);
          console.log(error, data);
        }
      });
    } else {
      this.props.firestack.auth.signOut()
      .then(res => {
        console.log('firebase logout', res);
        this.props.action.logout();
        this.props.navigator.push({name: 'Welcome'});
      })
      .catch(err => {
        this.props.action.printAuthError(err);
        console.log('Uh oh... something weird happened', err)
      })
    }

  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.instructions}>
          in profile view
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
    action: bindActionCreators({ logout, printAuthError }, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
