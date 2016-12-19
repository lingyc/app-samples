/**
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {FBLogin, FBLoginManager} from 'react-native-facebook-login';

class Signin extends Component {

  render() {
    return (
      <FBLogin
        onLogin={function(data){
          console.log("Logged in!");
          console.log(data);
          let token = data.credentials.token
          firestack.signInWithProvider('facebook', token, '') // facebook need only access token.
            .then((user)=>{
              console.log(user)
            })
        }}
      />
    );
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
 });

export default Signin;
