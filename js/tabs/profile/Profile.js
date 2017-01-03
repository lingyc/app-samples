import React, { Component } from 'react';
import { Alert, View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import Feeds from '../../common/Feeds.js'
import { profileStyle } from '../../styles/styles.js';
import { storeUserProfile } from '../../actions/user.js';
import { push } from '../../actions/navigation.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {selectPicture} from '../../library/pictureHelper.js';
import {uploadPhoto} from '../../library/firebaseHelpers.js';
import Icon from 'react-native-vector-icons/Ionicons';
import ScrollableTabView from 'react-native-scrollable-tab-view';


class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      feeds: [],
    }
  }

  //register listener to update the feeds, and follower count
  componentDidMount() {
    this._turnOnProfileWatcher();
    this._turnOnfeedService();
  }
  componentWillUnMount() {
    this._turnOffProfileWatcher();
    this._turnOfffeedService();
  };

  _turnOnProfileWatcher() {
    this.props.FitlyFirebase.database().ref('users/' + this.props.uID + '/public/').on('value', this._handleProfileChange.bind(this));
  };

  _turnOffProfileWatcher() {
    this.props.FitlyFirebase.database().ref('users/' + this.props.uID + '/public/').off('value');
  };

  _turnOnfeedService() {
    const followingNotifications = this.props.FitlyFirebase.database().ref('followingNotifications/' + this.props.uID);
    const appendToFeed = (feedEntry) => {
      let feedObject = feedEntry.val();
      let feedPictures = [];
      feedEntry.child('photos').forEach(photo => {
        let photoObj = photo.val();
        photoObj.key = photo.key;
        feedPictures.push(photoObj);
      });
      feedObject.photos = feedPictures;
      this.setState({
        feeds: this.state.feeds.concat(feedObject)
      });
    };

    followingNotifications.orderByChild('timestamp').limitToLast(10).once('value')
    .then(feeds => {
      //the forEach below is from Firebase API not native JS firebase data come back as objects,
      //which needs to convert back to array for interating in the correct order
      let feedsArray = [];
      feeds.forEach(feed => {
        let feedObject = feed.val();
        let feedPictures = [];
        feed.child('photos').forEach(photo => {
          let photoObj = photo.val();
          photoObj.key = photo.key;
          feedPictures.push(photoObj);
        });
        feedObject.photos = feedPictures;
        feedsArray.push(feedObject);
      });
      this.setState({feeds: feedsArray})
    }).catch(error => console.log(error));

    followingNotifications.orderByChild('timestamp').startAt(Date.now()).on('child_added', appendToFeed.bind(this));
  };

  _turnOfffeedService() {
    this.props.FitlyFirebase.database().ref('followingNotifications/' + this.props.uID).off('child_added');
  };


  _handleProfileChange(snapshot) {
    const {private: privateData} = this.props.user;
    // TODO: get push notification for updates in follower and following
    this.props.action.storeUserProfile({private: privateData, public: snapshot.val()});
  };

  _renderCenteredText(text, styles) {
    return (
      <Text style={[profileStyle.centeredText, styles]}>{text}</Text>
    );
  };

  _updateProfilePic() {
    selectPicture()
    .then(picture => {
      this.setState({loading: true});
      return uploadPhoto('users/' + this.props.uID + '/profilePic/', picture.uri, {profile: true});
    })
    .then(link => this.props.FitlyFirebase.database().ref('users/' + this.props.uID + '/public/picture').set(link))
    .then(snap => this.setState({loading: false}))
    .catch(error => {
      this.setState({loading: false});
      console.log("update profile pic", error)
    });
  };


  //this function should be a reusable component
  render() {
    const {public: profile} = this.props.user;
    return (
      <ScrollView style={{flex:1}} contentContainerStyle={profileStyle.container}>
        <TouchableOpacity onPress={() => this._updateProfilePic()}>
          <Image source={(profile.picture) ? {uri:profile.picture} : require('../../../img/default-user-image.png')}
          style={profileStyle.profileImg} defaultSource={require('../../../img/default-user-image.png')}>
            {(this.state.loading)
              ? <ActivityIndicator animating={this.state.loading} style={{height: 30}} size="small"/>
              : <View></View>
            }
          </Image>
        </TouchableOpacity>
        <Text style={profileStyle.nameText}>{profile.first_name + ' ' + profile.last_name}</Text>
        <Text style={profileStyle.dashboardText}>{profile.location.place}</Text>
        {/* TODO: add edit summary btn */}
        <Text style={profileStyle.summaryText}>{(profile.summary) ? profile.summary : 'I love to workout!'}</Text>

        <TouchableOpacity onPress={() => this.props.navigation.push({key: "MakePost", global: true})}>
          <Icon name="ios-create-outline" size={35} color="black"/>
        </TouchableOpacity>

        {/* below is the same as ProfileEntryView */}
        <View style={profileStyle.dashboard}>
          <TouchableOpacity style={profileStyle.dashboardItem}>
            <View>
              {this._renderCenteredText(profile.sessionCount, profileStyle.dashboardTextColor)}
              {this._renderCenteredText('SESSIONS', profileStyle.dashboardText)}
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={profileStyle.dashboardItem}>
            <View>
              {this._renderCenteredText(profile.followerCount, profileStyle.dashboardTextColor)}
              {this._renderCenteredText('FOLLOWERS', profileStyle.dashboardText)}
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={profileStyle.dashboardItem}>
            <View>
              {this._renderCenteredText(profile.followingCount, profileStyle.dashboardTextColor)}
              {this._renderCenteredText('FOLLOWING', profileStyle.dashboardText)}
            </View>
          </TouchableOpacity>
        </View>

        <View style={[profileStyle.dashboard, {borderTopWidth: 0, paddingTop: 17, paddingBottom: 17}]}>

          <TouchableOpacity>
            <Text>FEED</Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text>PHOTOS</Text>
          </TouchableOpacity>
        </View>

        <Feeds feeds={this.state.feeds}/>

        {/* TODO: create a feed component that renders the feeds in realtime */}
        <View style={{height: 100}}></View>
      </ScrollView>
    );
  };
};

const mapStateToProps = function(state) {
  return {
    loading: state.app.loading,
    user: state.user.user,
    uID: state.auth.uID,
    FitlyFirebase: state.app.FitlyFirebase
  };
};

const mapDispatchToProps = function(dispatch) {
  return {
    action: bindActionCreators({storeUserProfile}, dispatch),
    navigation: bindActionCreators({ push }, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
