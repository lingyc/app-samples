/**
 * @flow
 */

import React, { Component } from 'react';
import { View, TouchableHighlight, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
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
      let tabStyling = tabStyle.tab;
      let iconSize = 30;
      if (this.props.tabs.index === index) {
        tabStyling = tabStyle.selectedTab;
        iconSize = 40;
      }
      let iconName, size = 30;
      if (tab.key === 'Activity') {
        iconName = "calendar";
      } else if (tab.key === 'Search') {
        iconName = "search";
      } else if (tab.key === 'Profile') {
        iconName = "user-circle-o";
      } else if (tab.key === 'Notification') {
        iconName = "rss";
      } else if (tab.key === 'Connect') {
        iconName = "users";
      }

      return (
        <TouchableHighlight style={tabStyling} key={index} onPress={() => this._changeTab(index)}>
          <Icon name={iconName} size={iconSize} color="white"/>
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
