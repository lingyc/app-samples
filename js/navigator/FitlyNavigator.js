import ROUTES from './FitlyRoutes.js'
import React, { Component } from 'react';
import { Navigator } from 'react-native';
//default navigator swipe gets too close to edge, we would increase the edgeHitWidth
const SCREEN_WIDTH = require('Dimensions').get('window').width;

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

  export default FitlyNavigator;
