/**
 * @flow
 */

import React, { Component } from 'react';
import { StatusBar, TouchableOpacity, StyleSheet, Text, View } from 'react-native';

class Welcome extends Component {

  _goToLogin() {
    this.props.navigator.push({
      name: 'SignIn'
    })
  }

  _goToSignUp() {
    this.props.navigator.push({
      name: 'SignUp'
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          barStyle="light-content"
        />
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>
            Fitly
          </Text>
        </View>
        <View style={styles.logoContainer}>
          <Text style={styles.messageText}>
            Find fitness with friends.
          </Text>
          <Text style={styles.messageTextLight}>
            Meet work out partnes and programs just for you.
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.actionButton} onPress={() => this._goToSignUp()}>
              <Text style={styles.buttonText}>
                JOIN US
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => this._goToLogin()}>
              <Text style={styles.buttonText}>
                SIGN IN
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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
   logoContainer: {
     flex: 1,
     justifyContent: 'center',
     alignItems: 'center',
   },
   buttonContainer: {
     flex: 1,
     justifyContent: 'center',
     alignItems: 'flex-end',
     flexDirection: 'row'
   },
   logo: {
     fontFamily: 'HelveticaNeue',
     fontSize: 100,
     color: 'white',
     fontWeight: '700',
     letterSpacing: -2
   },
   messageText: {
     fontSize: 40,
     marginBottom: 0,
     textAlign: 'center',
     color: '#FFFFFF',
     marginBottom: 5,
   },
   messageTextLight: {
     marginTop: 40,
     width: 220,
     fontSize: 18,
     marginBottom: 0,
     textAlign: 'center',
     color: '#bbbbbb',
     marginBottom: 5,
   },
   buttonText: {
     fontSize: 20,
     marginBottom: 0,
     textAlign: 'center',
     color: '#FFFFFF',
     marginBottom: 5,
   },
   actionButton: {
    flex: 1,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#FFFFFF',
    borderWidth: .5,
  }
 });

export default Welcome;
