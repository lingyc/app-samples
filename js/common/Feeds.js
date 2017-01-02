import React, { Component } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, TouchableHighlight, ActivityIndicator } from 'react-native';
import { profileStyle } from '../styles/styles.js';
import { push } from '../actions/navigation.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class Feeds extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: {},
    }
  }

  render() {
    return this.props.feeds.map(feed => {
      if (!this.state.users[feed.owner]) {
        this.props.FitlyFirebase.database().ref(`/users/${feed.owner}/public`).once('value')
        .then(userData => {
          let newUsers = Object.assign({}, this.state.users);
          newUsers[feed.owner] = userData.val();
          this.setState({users: newUsers});
        })
      }

      return (
        <View>
          <Image source={(profile.picture) ? {uri:profile.picture} : require('../../../img/default-user-image.png')}
          style={profileStyle.profileImg} defaultSource={require('../../../img/default-user-image.png')}>
            {(this.state.loading)
              ? <ActivityIndicator animating={this.state.loading} style={{height: 30}} size="small"/>
              : <View></View>
            }
          </Image>
        </View>
      )
    })
  }

}

const mapStateToProps = function(state) {
  return {
    uID: state.auth.uID,
    FitlyFirebase: state.app.FitlyFirebase
  };
};

const mapDispatchToProps = function(dispatch) {
  return {
    navigation: bindActionCreators({ push }, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileEntry);
