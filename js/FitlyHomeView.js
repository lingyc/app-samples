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


class FitlyHomeView extends Component {
  constructor(props) {
    super(props);
  }

  _renderHeader(sceneProps) {
    return (<HeaderLocal sceneProps={sceneProps}/>);
  }

  _renderScene(sceneProps) {
    if (!this.props.isLoggedIn) {
      return (<View></View>);
    }
    let Component = LOCAL_ROUTES[sceneProps.scene.route.key];
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
          // renderHeader={this._ renderHeader}
          // style={styles.navigatorCardStack}
        />
        <TabBar/>
      </View>
    )
   }
 };

 const mapStateToProps = function(state) {
  return {
    navState: state.navState,
    isLoggedIn: state.auth.isLoggedIn
  };
};

const mapDispatchToProps = function(dispatch) {
  return {
    navigation: bindActionCreators({ pop }, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FitlyHomeView);
