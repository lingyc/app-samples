import GLOBAL_ROUTES from './RoutesGlobal.js'
import React, { Component } from 'react';
import { NavigationExperimental, View, Text } from 'react-native';
const { CardStack } = NavigationExperimental;
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { pop } from '../actions/navigation.js'
import HeaderGlobal from '../header/HeaderGlobal.js';


//default navigator swipe gets too close to edge, we would increase the edgeHitWidth
// const SCREEN_WIDTH = require('Dimensions').get('window').width;
class FitlyNavigator extends Component {
  constructor(props) {
    super(props);
  }

  _renderScene(props) {
    const {isLoggedIn, user} = this.props;
    let Component = GLOBAL_ROUTES[props.scene.route.key];
    if (isLoggedIn && user && user.public.profileComplete) {
      return (
        <Component sceneProps={props.scene} FitlyFirebase={this.props.FitlyFirebase}/>
      );
    } else {
      return (<Component sceneProps={props.scene} FitlyFirebase={this.props.FitlyFirebase}/>);
    }
  }

  _renderHeader(sceneProps) {
    if (sceneProps.scene.route.key === "SettingsMenu") {
      return (<HeaderGlobal sceneProps={sceneProps}/>);
    }
    return null;
  }


  render() {
    return (
      <CardStack
        onNavigateBack={() => this.props.navigation.pop({global: true})}
        renderHeader={this._renderHeader}
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
