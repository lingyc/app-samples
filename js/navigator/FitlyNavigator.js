import ROUTES from './FitlyRoutes.js'
import React, { Component } from 'react';
import { NavigationExperimental, View, Text } from 'react-native';
const { CardStack } = NavigationExperimental;
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { pop } from '../actions/navigation.js'

//default navigator swipe gets too close to edge, we would increase the edgeHitWidth
// const SCREEN_WIDTH = require('Dimensions').get('window').width;
class FitlyNavigator extends Component {
  constructor(props) {
    super(props);
  }

  _renderScene(props) {
    const {isLoggedIn, user} = this.props;
    let Component = ROUTES[props.scene.route.key];
    if (isLoggedIn && user && user.public.profileComplete) {
      return (
        <Component sceneProps={props.scene} firestack={this.props.firestack}/>
      );
    } else {
      return (<Component sceneProps={props.scene} firestack={this.props.firestack}/>);
    }
  }

  render() {
    return (
      <CardStack
        onNavigateBack={this.props.navigation.pop.bind(this)}
        navigationState={this.props.globalNavState}
        renderScene={this._renderScene.bind(this)}
      />
    );
   }
 }

 const mapStateToProps = function(state) {
  return {
    user: state.user.user,
    isLoggedIn: state.user.isLoggedIn,
    globalNavState: state.navState.global
  };
};

const mapDispatchToProps = function(dispatch) {
  return {
    navigation: bindActionCreators({ pop }, dispatch)
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(FitlyNavigator);
