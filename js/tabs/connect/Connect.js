import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { commonStyle } from '../../styles/styles.js';
import { resetTo } from '../../actions/navigation.js';
import LogoutBtn from '../../common/LogoutBtn.js';
import { push } from '../../actions/navigation.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class Connect extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <Text>Hello from Connect!</Text>
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
    navigation: bindActionCreators({ resetTo }, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Connect);
