/**
 * @flow
 */

import React, { Component } from 'react';
import { NavigationExperimental, View, StatusBar } from 'react-native';
const { CardStack } = NavigationExperimental;
import LOCAL_ROUTES from './navigator/RoutesLocal.js';
import HeaderLocal from './header/HeaderLocal.js';
import TabBar from './tabs/TabBar.js';
import { pop } from './actions/navigation.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Firebase from 'firebase';

class FitlyHomeView extends Component {
  constructor(props) {
    super(props);
    this.FitlyFirebase = this.props.FitlyFirebase;
    this.userUpdateRef = this.FitlyFirebase.database().ref(`/userUpdatesMajor/${this.props.uID}`);
  }

  componentDidMount() {
    this._turnOnfeedDistService();
  }

  componentWillUnMount() {
    console.log('unmounting homeview');
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

  _renderHeader(sceneProps) {
    return (<HeaderLocal sceneProps={sceneProps}/>);
  }

  _renderScene(sceneProps) {
    if (!this.props.isLoggedIn) {
      return (<View></View>);
    }

    //sceneProps.scene.route.key aka the route key needs to be unique, so for scenes that are reused we add an additional content key to the normal route key
    //the convention is [route key]@[content key], which is why we are spliting by '@' symbol
    let componentKey = sceneProps.scene.route.key.split('@')[0];
    let Component = LOCAL_ROUTES[componentKey];
    let passProps = sceneProps.scene.route.passProps || {};
    return (<Component {...passProps} sceneProps={sceneProps}/>);
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
          renderHeader={this._renderHeader}
          onNavigateBack={this.props.navigation.pop.bind(this)}
          navigationState={localNavState}
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

export default connect(mapStateToProps, mapDispatchToProps)(FitlyHomeView);
