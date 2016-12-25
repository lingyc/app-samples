import ROUTES from './FitlyRoutes.js'
import React, { Component } from 'react';
import { Navigator } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//default navigator swipe gets too close to edge, we would increase the edgeHitWidth
const SCREEN_WIDTH = require('Dimensions').get('window').width;

class FitlyNavigator extends Component {
  constructor(props) {
    super(props);
  }

  renderScene(route, navigator) {
    const {isLoggedIn, user} = this.props;
    let Component = ROUTES[route.name];
    //if logged in show tabs
    //has uID, has profile, isLoggedIn
    if (isLoggedIn && user && user.profileComplete) {
      return (<Component route={route} navigator={navigator} firestack={this.props.firestack}/>);
    } else {
      return (<Component route={route} navigator={navigator} firestack={this.props.firestack}/>);
    }
  }

  render() {
    return (
      <Navigator
        initialRoute= {this.props.initialRoute}
        renderScene={this.renderScene.bind(this)}
        configureScene={(route, routeStack) => {
          if (route.sceneConfig) {
            return route.sceneConfig;
          }
          //this is modified PushFromRight transistion, which increase the edge hit width of the swipe
          const PushFromRight = {
            ...Navigator.SceneConfigs.PushFromRight,
            gestures: {
              pop: {
                ...Navigator.SceneConfigs.PushFromRight.gestures.pop,
                edgeHitWidth: SCREEN_WIDTH / 2,
              },
            },
          };
          return PushFromRight;
        }}
      />
    );
   }
 }

 const mapStateToProps = function(state) {
  return {
    user: state.user.user,
    isLoggedIn: state.user.isLoggedIn
  };
};


export default connect(mapStateToProps)(FitlyNavigator);
