/**

* @flow
*/

import React, { Component } from 'react';
import { NavigationExperimental, View, StatusBar } from 'react-native';
const { CardStack } = NavigationExperimental;
import LOCAL_ROUTES from './RoutesLocal.js';
import HeaderLocal from '../header/HeaderLocal.js';
import TabBar from '../tabs/TabBar.js';
import { pop } from '../actions/navigation.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Firebase from 'firebase';
import {
  ActivityNavigator,
  SearchNavigator,
  ProfileNavigator,
  NotificationNavigator,
  ConnectNavigator
} from './TabEntryNavigators.js'

class TabNavigator extends Component {
 constructor(props) {
   super(props);
   this.FitlyFirebase = this.props.FitlyFirebase;
   this.userUpdateRef = this.FitlyFirebase.database().ref(`/userUpdatesMajor/${this.props.uID}`);
 }

 componentDidMount() {
   this._turnOnfeedDistService();
 }

 componentWillUnmount() {
   this._turnOffFeedDistService();
 }

 _turnOnfeedDistService() {
   const feedDistributor = (newUpdate) => {
     const updateObj = newUpdate.val();
     const updateKey = newUpdate.key;
     this.FitlyFirebase.database().ref(`/followers/${this.props.uID}`).once('value')
     .then(followersObj => {
       let updateFanOut = {};
       for (let follower in followersObj.val()) {
         updateFanOut[`/followingNotifications/${follower}/${updateKey}`] = updateObj;
       }
       this.FitlyFirebase.database().ref().update(updateFanOut);
     })
     .catch(error => {
       console.log('feed distribution error', error);
     });
   };
   this.userUpdateRef.orderByChild('timestamp').startAt(Date.now()).on('child_added', feedDistributor.bind(this));
 }


 _turnOffFeedDistService() {
   this.userUpdateRef.off('child_added');
 }

 _renderScene(sceneProps) {
   if (!this.props.isLoggedIn) {
     return (<View></View>);
   }
   const {key} = sceneProps.scene.route;
   if (key === 'Activity') {
    return <ActivityNavigator/>
  } else if (key === 'Search') {
    return <SearchNavigator/>
  } else if (key === 'Profile') {
    return <ProfileNavigator/>
  } else if (key === 'Notification') {
    return <NotificationNavigator/>
  } else if (key === 'Connect') {
    return <ConnectNavigator/>
  }
 }

 render() {
   const { tabs } = this.props.navState;
   const key = tabs.routes[tabs.index].key;
   const localNavState = this.props.navState[key];
   return (
     <View style={{flex: 1}}>
       <StatusBar
         barStyle="light-content"
       />
       <CardStack
         key={key}
         onNavigateBack={this.props.navigation.pop.bind(this)}
         navigationState={this.props.navState.tabs}
         renderScene={this._renderScene.bind(this)}
       />
       <TabBar/>
     </View>
   )
  }
};

const mapStateToProps = function(state) {
 return {
   navState: state.navState,
   isLoggedIn: state.auth.isLoggedIn,
   FitlyFirebase: state.app.FitlyFirebase,
   uID: state.auth.uID
 };
};

const mapDispatchToProps = function(dispatch) {
 return {
   navigation: bindActionCreators({ pop }, dispatch)
 };
};

export default connect(mapStateToProps, mapDispatchToProps)(TabNavigator);
