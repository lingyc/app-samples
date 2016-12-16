/**
 * @flow
 */

import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View } from 'react-native';
import { Provider } from 'react-redux';
import configStore from './store/configStore';

class Fitly extends Component {
   render() {
     return (
       <View style={styles.container}>
         <Text style={styles.welcome}>
           Welcome to React Native!
         </Text>
         <Text style={styles.instructions}>
           To get started, edit index.ios.js
         </Text>
         <Text style={styles.instructions}>
           Press Cmd+R to reload,{'\n'}
           Cmd+D or shake for dev menu
         </Text>
       </View>
     );
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

 function setup() {
   class Root extends React.Component {
     render() {
       return (
         <Provider store={configStore()}>
           <Fitly />
         </Provider>
       );
     }
   }
   return Root;
 };


 export default setup;
