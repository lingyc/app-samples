/**
 * @flow
 */

import React, { Component } from 'react';
import { NavigationExperimental, View, Text, TouchableOpacity } from 'react-native';
const { Header } = NavigationExperimental;
import Icon from 'react-native-vector-icons/FontAwesome';
import { headerStyle } from '../styles/styles.js';
import { pop, push } from '../actions/navigation.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';


class HeaderLocal extends Component {
  constructor(props) {
    super(props);
  }

  _renderTitleComponent(sceneProps) {
    // console.log('sceneProps', sceneProps);
    if (sceneProps.scene.route.key === "Profile") {
      return (
        //header for the profile home view
        <View style={headerStyle.container}>
          <Text style={headerStyle.logoText}>
            Fitly
          </Text>
          <TouchableOpacity style={headerStyle.msgBtn}>
            <Icon name="envelope-o" size={30} color="white"/>
          </TouchableOpacity>
          <TouchableOpacity
            style={headerStyle.settingsBtn}
            onPress={() => this.props.navigation.push({key: "SettingsMenu", global: true})}>
            <Icon name="bars" size={30} color="white"/>
          </TouchableOpacity>
        </View>
      )
    } else {
      let componentKey = sceneProps.scene.route.key.split('@')[0];
      return (
        //header for the profile home view
        <View style={headerStyle.container}>
          <Text style={headerStyle.titleText}>
            {componentKey}
          </Text>
        </View>
      )
    }
  }

  render() {
    return (
      <Header
        {...this.props.sceneProps}
        renderTitleComponent={this._renderTitleComponent.bind(this)}
        onNavigateBack={this.props.navigation.pop.bind(this)}
        style={headerStyle.header}
      />
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
    navigation: bindActionCreators({ pop, push }, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HeaderLocal);
