/**
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as firebase from 'firebase';
import firebaseConfig from '../config/env'

firebase.initializeApp(firebaseConfig);
//show loading screen while checking to see if user has signin
//if not direct to login
//if yes direct to profile
//remember to setup navigator

class Fitly extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggin: firebase.auth().currentUser
    }
  }

  render() {
    console.log('isLoggin', this.state.isLoggin);
    if (this.state.isLoggin) {
      return (
        <View style={styles.container}>
          <Text style={styles.instructions}>
            log in
          </Text>
        </View>
      )
    } else {
      return (
        <View style={styles.container}>
          <Text style={styles.instructions}>
            not log in
          </Text>
        </View>
      );
    }
   }
 }

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
 });

 export default Fitly;
