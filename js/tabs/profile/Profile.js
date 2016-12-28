import React, { Component } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { commonStyle } from '../../styles/styles.js';
import { resetTo } from '../../actions/navigation.js';
import { push } from '../../actions/navigation.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class Profile extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ScrollView style={{flex: 1}}>
        <Text>Hello from Profile!</Text>
      </ScrollView>
    );
  }
};

const mapStateToProps = function(state) {
  return {
    loading: state.app.loading,
    user: state.user.user
  };
};

const mapDispatchToProps = function(dispatch) {
  return {
    navigation: bindActionCreators({ resetTo }, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
