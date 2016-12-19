/**
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';

class Profile extends Component {
  constructor(props) {
    super(props);
  }

  //refactor out later into a service or a logout btn component
  _logout() {
    this.props.firestack.auth.signOut()
    .then(res => {
      this.props.navigator.push({name: 'Welcome'});
    })
    .catch(err => console.error('Uh oh... something weird happened'))
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.instructions}>
          in profile view
        </Text>
        <TouchableHighlight style={styles.actionButtonInverted} onPress={() => this._logout()}>
          <Text style={styles.buttonText}>
            LOGOUT
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
   actionButtonInverted: {
    alignSelf: 'stretch',
    height: 30,
    borderColor: '#FFFFFF',
    backgroundColor: 'white',
    borderWidth: .5,
  }
 });

export default Profile;
