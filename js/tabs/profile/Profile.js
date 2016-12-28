import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { commonStyle } from '../../styles/styles.js';
import { resetTo } from '../../actions/navigation.js';
import LogoutBtn from '../../common/LogoutBtn.js';
import { push } from '../../actions/navigation.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class Profile extends Component {
  constructor(props) {
    super(props);
    console.log('profile Component');
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <Text>Hello from Profile!</Text>
        <LogoutBtn/>
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

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
