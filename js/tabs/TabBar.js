/**
 * @flow
 */

import React, { Component } from 'react';
import { View, TouchableHighlight, Text } from 'react-native';
import { tabStyle } from '../styles/styles.js'
import LOCAL_ROUTES from '../navigator/RoutesLocal.js';
import { asyncFBLogout } from '../library/asyncFBLogin.js';
import { selectTab } from '../actions/navigation.js'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';


class TabBar extends Component {
  constructor(props) {
    super(props);
  }

  _changeTab(index) {
    this.props.navigation.selectTab(index);
  }

  render() {
    const tabs = this.props.tabs.routes.map((tab, index) => {
      return (
        <TouchableHighlight style={tabStyle.tab} onPress={() => this._changeTab(index)}>
          <Text style={tabStyle.btnText}>
            {tab.key}
          </Text>
        </TouchableHighlight>
      )
    });
    return (
      <View style={tabStyle.tabBar}>
        {tabs}
      </View>
    )
   }
 };


 const mapStateToProps = (state) => {
  return {
    tabs: state.navState.tabs
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    navigation: bindActionCreators({ selectTab }, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TabBar);
