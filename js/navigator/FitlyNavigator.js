import ROUTES from './FitlyRoutes.js'
import React, { Component } from 'react';
import { Navigator } from 'react-native';

class FitlyNavigator extends Component {
  constructor(props) {
    super(props);
  }

  renderScene(route, navigator) {
    let Component = ROUTES[route.name];
    return (<Component route={route} navigator={navigator} firestack={this.props.firestack}/>);
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
          return Navigator.SceneConfigs.SwipeFromLeft;
        }}
      />
    );
   }
 }

  export default FitlyNavigator;
