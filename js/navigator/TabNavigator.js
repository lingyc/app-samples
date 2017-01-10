/**
 * @flow
 */

import React, { Component } from 'react';
import { Animated, NavigationExperimental, View, StatusBar, StyleSheet } from 'react-native';
import LOCAL_ROUTES from '../navigator/RoutesLocal.js';
import HeaderLocal from '../header/HeaderLocal.js';
import TabBar from '../tabs/TabBar.js';
import { pop } from '../actions/navigation.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Firebase from 'firebase';

const { Card, Transitioner } = NavigationExperimental;
const { PagerStyleInterpolator } = Card;

//tabs are rendered when there is only one navigator handling all the tabs
//we set up a dedicated navigator for each tab so each tab will not get rerender when tab switches
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
    this.database = this.props.FitlyFirebase.database();
    this.userUpdateRef = this.database.ref(`/userUpdatesMajor/${this.props.uID}`);

    this._render = this._render.bind(this);
  };

  componentDidMount() {
    this._turnOnfeedDistService();
  };

  componentWillUnmount() {
    this._turnOffFeedDistService();
  };

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
  };


  _turnOffFeedDistService() {
    this.userUpdateRef.off('child_added');
  };

  _render(transitionProps) {
    const scenes = transitionProps.scenes.map((scene) => {
      const sceneProps = {
        ...transitionProps,
        scene,
      };
      return this._renderScene(sceneProps);
    });

    return (
      <View style={{flex: 1}}>
        {scenes}
      </View>
    );
  }

  _renderScene(sceneProps) {
    console.log('asdfasd');
    const style = [
      styles.scene,
      PagerStyleInterpolator.forHorizontal(sceneProps),
    ];

    let Scene;
    const {key} = sceneProps.scene.route;
    if (!this.props.isLoggedIn) { Scene = (<View></View>) }
    else if (key === 'Activity') { Scene = ActivityNavigator }
    else if (key === 'Search') { Scene = SearchNavigator }
    else if (key === 'Profile') { Scene = ProfileNavigator }
    else if (key === 'Notification') { Scene = NotificationNavigator }
    else if (key === 'Connect') { Scene = ConnectNavigator }

    return  (
      <Animated.View style={style} key={sceneProps.scene.key} >
        <Scene {...this.sceneProps} style={style} />
      </Animated.View>
    );
  };


  render() {
    return (
      <View style={{flex: 1}}>
        <StatusBar barStyle="light-content"/>
        <Transitioner
         navigationState={this.props.navState.tabs}
         render={this._render}
        />
        <TabBar/>
      </View>
    )
   }
 };

 const styles = StyleSheet.create({
  scene: {
    flex: 1,
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
});

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
