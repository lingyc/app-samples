import React, { Component } from 'react';
import { View, Text, TouchableHighlight } from 'react-native';
import { commonStyle } from '../../styles/styles.js';
import { push } from '../../actions/navigation.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class Search extends Component {
  constructor(props) {
    super(props);
  }

  _openProfile(id) {
    this.props.navigation.push({
      key: "ProfileEntry",
      passProps: {
        otherUID: id
      }
    })
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <Text>Hello from Search!</Text>
        <TouchableHighlight onPress={() => this._openProfile('CcVODIpufJhEGLIufy0ApdsuXYm1')}>
          <Text>open up a profile</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={() => this._openProfile('LxYypUAFR6Ugk1EqvhdgBecaPcQ2')}>
          <Text>open up a profile</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={() => this._openProfile('AYlNbqhTDTXx1uEohfbke24KTDC2')}>
          <Text>open up a profile</Text>
        </TouchableHighlight>
      </View>
    );
  }
};

const mapStateToProps = function(state) {
  return {
    loading: state.app.loading,
  };
};

const mapDispatchToProps = function(dispatch) {
  return {
    navigation: bindActionCreators({ push }, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Search);
