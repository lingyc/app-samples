import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { feedEntryStyle } from '../styles/styles.js';
import { push } from '../actions/navigation.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TimeAgo from 'react-native-timeago';

class Feeds extends Component {
  constructor(props) {
    super(props);

    //TODO: settings will dictate what kind of feed should trigger a push notification and should be rendered
  }

  shouldComponentUpdate(nextProps) {
    return this.props !== nextProps;
  }

  _renderUpdateMsg(feed) {
    if (feed.type === 'post') {
      return (<Text style={feedEntryStyle.description}>{`posted a new ${feed.description}`}</Text>);
    } else if (feed.type === 'follow') {
      return (
        <Text style={feedEntryStyle.description}>{'just followed'}</Text>
      );
    }
    //TODO: more types of updates to add
  };

  _renderPhotos(feed) {
    return (
      <View style={feedEntryStyle.imgContainer}>
        {feed.photos.map((photo, index) => {
          return (
            <TouchableOpacity style={feedEntryStyle.imagesTouchable}  key={'feedPhotos' + index} onPress={() => console.log('redirect to photo view with photokey ', photo.key)}>
              <Image style={feedEntryStyle.images} source={{uri: photo.link}} style={feedEntryStyle.images} defaultSource={require('../../img/default-photo-image.png')}/>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

 _renderFeedEntryContent(feed) {
   if (feed.type === 'post') {
     return (
       <View style={{flex: 0}}>
         {(feed.contentTitle) ? <TouchableOpacity onPress={() => this.props.navigation.push({key: 'PostView', passProps:{postID: feed.contentID}})}><Text style={{marginBottom: 5}}>{feed.contentTitle}</Text></TouchableOpacity> : null}
         {(feed.contentSnipet) ? <TouchableOpacity onPress={() => this.props.navigation.push({key: 'PostView', passProps:{postID: feed.contentID}})}><Text style={{marginBottom: 5}}>{feed.contentSnipet + '...'}</Text></TouchableOpacity> : null}
         {this._renderPhotos(feed)}
       </View>
     );
   } else if (feed.type === 'follow') {
     return (
       <TouchableOpacity style={[feedEntryStyle.profileRow, {flexDirection: 'row', justifyContent: 'flex-end'}]}
         onPress={() => this.props.navigation.push({
           key: "ProfileEntry",
           passProps: {
             otherUID: feed.followingID,
           }
       })}>
         <Text style={[feedEntryStyle.username, {marginRight: 10}]}>{feed.followingName}</Text>
         <Image source={(feed.followingPicture) ? {uri:feed.followingPicture} : require('../../img/default-user-image.png')}
         style={[feedEntryStyle.profileImg, {borderRadius: 25, width: 50, height: 50,}]} defaultSource={require('../../img/default-user-image.png')}/>
       </TouchableOpacity>
     )
   }
 }

  render() {
    if (this.props.feeds.length > 0) {
      return (
        <View style={{flex: 0, alignSelf: 'stretch'}}>
          {this.props.feeds.map((feed, index) => {
            return (
              <View style={feedEntryStyle.container} key={"feed" + index}>
                <TouchableOpacity onPress={() => this.props.navigation.push({
                  key: "ProfileEntry",
                  passProps: {
                    otherUID: feed.ownerID,
                  }
                })} style={feedEntryStyle.profileRow}>
                  <Image source={(feed.ownerPicture) ? {uri:feed.ownerPicture} : require('../../img/default-user-image.png')}
                  style={feedEntryStyle.profileImg} defaultSource={require('../../img/default-user-image.png')}/>
                  <View>
                    <Text style={feedEntryStyle.username}>{feed.ownerName}</Text>
                    {this._renderUpdateMsg(feed)}
                  </View>
                  <TimeAgo style={feedEntryStyle.timestamp} time={feed.timestamp}/>
                </TouchableOpacity>
                {this._renderFeedEntryContent(feed)}
              </View>
            );
          })}
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

export default connect(mapStateToProps, mapDispatchToProps)(Feeds);
