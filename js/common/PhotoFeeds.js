import React, { Component } from 'react';
import { Dimensions, View, Text, Image, TouchableOpacity } from 'react-native';
import { feedEntryStyle } from '../styles/styles.js';
import { push } from '../actions/navigation.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TimeAgo from 'react-native-timeago';
let screenWidth = Dimensions.get('window').width;

class PhotoFeed extends Component {
  constructor(props) {
    super(props);

    //TODO: settings will dictate what kind of feed should trigger a push notification and should be rendered
  }

  shouldComponentUpdate(nextProps) {
    return this.props !== nextProps;
  }

  _renderPhotos(feed) {
    return feed.photos.map((photo, index) => {
      return (
        <TouchableOpacity style={{flex: 0}}  key={'feedPhotos' + index}
          onPress={() => {
            this.props.navigation.push({
              key: "ImageView@" + photo.key,
              passProps: {photoID: photo.key}
            },{general: true})
          }}>
          <Image style={[feedEntryStyle.photoFeedEntry, {width: screenWidth / 3, height: screenWidth / 3}]} source={{uri: photo.link}} defaultSource={require('../../img/default-photo-image.png')}/>
          <Text style={[feedEntryStyle.smallDescription, {color: 'white', paddingRight: 10, bottom: 0}]}>{feed.ownerName + ' \nposted '}
            <TimeAgo time={feed.timestamp}/>
          </Text>
        </TouchableOpacity>
      );
    })
  };

  render() {
    if (this.props.feeds.length > 0) {
      return (
        <View style={feedEntryStyle.photoFeedContainer}>
          {this.props.feeds.filter(feed => !!feed.photos)
          .map((feed, index) => this._renderPhotos(feed))}
        </View>
      );
    } else {
      return (
        <View style={{flex: 0}}>
          <Text style={{textAlign: 'center', color: '#ccc', marginTop: 30, marginLeft: 30, marginRight: 30}}>Your feeds are empty, let's find someone you want to follow</Text>
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

export default connect(mapStateToProps, mapDispatchToProps)(PhotoFeed);
