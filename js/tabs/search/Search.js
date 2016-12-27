import React from 'react';
import { View, Text } from 'react-native';
import { LogoutBtn } from '../../common/LogoutBtn.js';
import { push } from '../../actions/navigation.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

const Search = (props) => (
  <View style={{flex: 1}}>
    <Text>Hello from Profile!</Text>
    <LogoutBtn/>
  </View>
)

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

export default connect(mapStateToProps, mapDispatchToProps)(Search);
