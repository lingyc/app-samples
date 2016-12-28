/**
 * @flow
 */

import React, { Component } from 'react';
import { NavigationExperimental, View } from 'react-native';
const { CardStack } = NavigationExperimental;
import LOCAL_ROUTES from './navigator/RoutesLocal.js'
import TabBar from './tabs/TabBar.js';
import { pop } from './actions/navigation.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';


class FitlyHomeView extends Component {
  constructor(props) {
    super(props);
  }

  _renderScene(sceneProps) {
    let Component = LOCAL_ROUTES[sceneProps.scene.route.key];
    return (<Component sceneProps={sceneProps} firestack={this.props.firestack}/>);
  }

  render() {
    const { tabs } = this.props.navState;
    const key = tabs.routes[tabs.index].key;
    const localNavState = this.props.navState[key];
    return (
      <View style={{flex: 1}}>
        <CardStack
          key={key}
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
    navState: state.navState
  };
};

const mapDispatchToProps = function(dispatch) {
  return {
    navigation: bindActionCreators({ pop }, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FitlyHomeView);
