import React, { Component } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, TouchableHighlight, ActivityIndicator } from 'react-native';
import FeedTabs from '../common/FeedTabs.js'
import { profileStyle } from '../styles/styles.js';
import { push } from '../actions/navigation.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {saveUpdateToDB, turnOnfeedService, turnOffeedService} from '../library/firebaseHelpers.js'
import Firebase from 'firebase';

class ProfileEntry extends Component {
  constructor(props) {
    super(props);
    //props will have a otherUID attribute which holds the uID of the other user
    this.state = {
      loading: true,
      following: null,
      // TODO: create a local dummy profile and load it while the profile is being fetched from the database
      userProfile: null,
      feeds: []
    }
    
    this.otherUID = this.props.otherUID;
    this.FitlyFirebase = this.props.FitlyFirebase;
    this.database = this.FitlyFirebase.database();
    this.userRef = this.database.ref('users/' + this.props.otherUID + '/public/');
    this.user = this.props.user;
    this.uID = this.props.uID;

    //when the current user follows another user, a notification entry will be created in the other user's notifications,
    //we dont want the users to spam notifications by constantly toggling the follow/unfollow button,
    //this marker will solve that by setting to true when the other user is notified
    this.hasSentFollowerUpdate = false;
  };

  componentWillMount() {
    this._turnOnProfileWatcher();
    turnOnfeedService(this.otherUID, {self: false},
      (feeds) => this.setState({feeds: feeds.reverse()}),
      (newFeed) => this.setState({feeds: [newFeed].concat(this.state.feeds)})
    );
  };

  componentWillUnmount() {
    this._turnOffProfileWatcher();
    turnOffeedService(this.otherUID, {self: false});
  };

  _turnOnProfileWatcher() {
    this.userRef.on('value', this._handleProfileChange.bind(this));
    this.database.ref('/followings/' + this.uID + '/' + this.otherUID).on('value', this._handleFollowingChange.bind(this));
  };

  _turnOffProfileWatcher() {
    this.userRef.off('value');
    this.database.ref('/followings/' + this.uID + '/' + this.otherUID).off('value');
  };

  _handleProfileChange(userProfile) {
    this.setState({
      loading: false,
      userProfile: userProfile.val()
    });
  };

  _handleFollowingChange(following) {
    this.setState({
      following: !!(following.val())
    })
  };

  _toggleFollow() {
    if (this.state.following) {
      this.database.ref('/followings/' + this.uID + '/' + this.otherUID).set(null);
      this.database.ref('/followers/' + this.otherUID + '/' + this.uID).set(null);
      this.database.ref('/users/' + this.otherUID + '/public/followerCount').transaction(currentFollowerCount => currentFollowerCount - 1);
      this.database.ref('/users/' + this.uID + '/public/followingCount').transaction(currentFollowingCount => currentFollowingCount - 1);
    } else {
      this.database.ref('/followings/' + this.uID + '/' + this.otherUID).set(true);
      this.database.ref('/followers/' + this.otherUID + '/' + this.uID).set(true);
      this.database.ref('/users/' + this.otherUID + '/public/followerCount').transaction(currentFollowerCount => currentFollowerCount + 1);
      this.database.ref('/users/' + this.uID + '/public/followingCount').transaction(currentFollowingCount => currentFollowingCount + 1);
      if (!this.hasSentFollowerUpdate) {
        const updateObj = {
          type: "follow",
          ownerID: this.uID,
          ownerName: this.user.public.first_name + ' ' + this.user.public.last_name,
          ownerPicture: this.user.public.picture,
          followingID: this.otherUID,
          followingName: this.state.userProfile.first_name + ' ' + this.state.userProfile.last_name,
          followingPicture: this.state.userProfile.picture,
          timestamp: Firebase.database.ServerValue.TIMESTAMP
        };
        saveUpdateToDB(updateObj, this.uID);
        this.FitlyFirebase.database().ref('/followerNotifications/' + this.otherUID).push(updateObj);
        this.hasSentFollowerUpdate = true;
      }
    }
  };

  _renderCenteredText(text, styles) {
    return (
      <Text style={[profileStyle.centeredText, styles]}>{text}</Text>
    );
  };

  _renderFollowBtn() {
    const profile = this.state.userProfile;
    if (this.state.following) {
      return (
        <TouchableHighlight style={[profileStyle.followBtn, {backgroundColor: 'green'}]} onPress={() => this._toggleFollow()}>
          {this._renderCenteredText("Following", {color: "white", fontSize: 17})}
        </TouchableHighlight>
      );
    } else {
      return (
        <TouchableHighlight style={profileStyle.followBtn} onPress={() => this._toggleFollow()}>
          {this._renderCenteredText("Follow", {color: "white", fontSize: 17})}
        </TouchableHighlight>
      );
    }
  };


  render() {
    const profile = this.state.userProfile;
    // TODO: create a local dummy profile and load it while the profile is being fetched from the database
    if (this.state.loading) {
      return (
        <ActivityIndicator
          animating={this.state.loading}
          style={{height: 80}}
          size="large"
        />
      );
    } else {
      return (
        <ScrollView contentContainerStyle={profileStyle.container}>
          <Image source={(profile.picture) ? {uri:profile.picture} : require('../../img/default-user-image.png')} style={profileStyle.profileImg}/>
          <Text style={profileStyle.nameText}>{profile.first_name + ' ' + profile.last_name}</Text>
          <Text style={profileStyle.dashboardText}>{profile.location.place}</Text>
          <Text>{(profile.summary) ? profile.summary : 'I love to workout!'}</Text>
          {this._renderFollowBtn()}

          {/* below is the same as ProfileView */}
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
          <FeedTabs feeds={this.state.feeds}/>
          <View style={{height: 100}}></View>
        </ScrollView>
      );
    }
  }
}

const mapStateToProps = function(state) {
  return {
    user: state.user.user,
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
