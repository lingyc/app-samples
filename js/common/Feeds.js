import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, TouchableHighlight, ActivityIndicator } from 'react-native';
import { profileStyle, feedEntryStyle } from '../styles/styles.js';
import { push } from '../actions/navigation.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class Feeds extends Component {
  constructor(props) {
    super(props);
  }

  _renderUpdateMsg(feed) {
    if (feed.type === 'post') {
      return (<Text style={feedEntryStyle.description}>{`posted a new ${feed.description}`}</Text>);
    }
    //TODO: more cases to add
  };

  _renderPhotos(feed) {
    return feed.photos.map((photo, index) => {
      return (
        <Image key={'feedPhotos' + index} source={{uri: photo.link}} style={feedEntryStyle.images} defaultSource={require('../../img/default-user-image.png')}/>
      );
    })
  };

  render() {
    if (this.props.feeds.length > 0) {
      return (
        <View style={{flex: 0, alignSelf: 'stretch'}}>
          {this.props.feeds.reverse().map((feed, index) => {
            return (
              <View style={feedEntryStyle.container} key={"feed" + index}>
                <View style={feedEntryStyle.profileRow}>
                  <Image source={(feed.ownerPicture) ? {uri:feed.ownerPicture} : require('../../img/default-user-image.png')}
                  style={feedEntryStyle.profileImg} defaultSource={require('../../img/default-user-image.png')}/>
                  <View>
                    <Text style={feedEntryStyle.username}>{feed.ownerName}</Text>
                    {this._renderUpdateMsg(feed)}
                  </View>
                </View>
                <View style={feedEntryStyle.imgContainer}>
                  {this._renderPhotos(feed)}
                </View>
              </View>
            );
          })}
        </View>
      );
    } else {
      return (
        <View style={{flex: 0}}>
          <Text style={{textAlign: 'center', color: '#ccc'}}>Your feeds are empty, let's find someone you want to follow</Text>
        </View>
      );
    }
  };
};

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

export default connect(mapStateToProps, mapDispatchToProps)(Feeds);
