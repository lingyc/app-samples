import React, { Component } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { profileStyle } from '../../styles/styles.js';
import { push } from '../../actions/navigation.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class ProfileEntry extends Component {
  constructor(props) {
    super(props);
    //props will have a uID attribute which holds the uID
    this.state = {
      loading: true,
      following: null,
      userProfile: null,
    }

    this.database = this.props.firestack.database;
    this.userRef = this.database.ref('users/' + this.props.otherUID + '/public/');
  }

  componentDidMount() {
    //register listener to update the feeds and profile changes
    this.userRef.on('value', this._handleProfileChange.bind(this));
    this.database.ref('/followers/' + this.props.uID + '/' + this.props.otherUID).on('value', this._handleFollowingChange.bind(this));
  }

  componentWillUnmount() {
    //unregister the listener
    this.userRef.off('value');
    this.database.ref('/followers/' + this.props.uID + '/' + this.props.otherUID).off('value');
  }

  _handleProfileChange(userProfile) {
    this.setState({
      loading: false,
      userProfile: userProfile.val()
    });
  }

  _handleFollowingChange(following) {
    this.setState({
      following: !!(following.val())
    })
  }

  _toggleFollow() {
    if (this.state.following) {
      let updates = {};
      updates['/followers/' + this.props.uID + '/' + this.props.otherUID] = null;
      updates['/followings/' + this.props.otherUID + '/' + this.props.uID] = null;
      this.database.ref().update(updates);
      this.database.ref('users/' + this.props.otherUID + '/public/followerCount').transaction(currentFollowerCount => currentFollowerCount - 1);
      this.database.ref('users/' + this.props.uID + '/public/followingCount').transaction(currentFollowingCount => currentFollowingCount - 1);
    } else {
      let updates = {};
      updates['/followers/' + this.props.uID + '/' + this.props.otherUID] = true;
      updates['/followings/' + this.props.otherUID + '/' + this.props.uID] = true;
      this.database.ref().update(updates);
      this.database.ref('users/' + this.props.otherUID + '/public/followerCount').transaction(currentFollowerCount => currentFollowerCount + 1);
      this.database.ref('users/' + this.props.uID + '/public/followingCount').transaction(currentFollowingCount => currentFollowingCount + 1);
    }
  }

  _renderCenteredText(text, styles) {
    return (
      <Text style={[profileStyle.centeredText, styles]}>{text}</Text>
    );
  }

  render() {
    const profile = this.state.userProfile;
    let followBtn;
    if (this.state.following) {
      followBtn = (
        <TouchableHighlight style={profileStyle.followingBtn}>
          <Text>Following</Text>
        </TouchableHighlight>
      );
    } else {
      followBtn = (
        <TouchableHighlight style={profileStyle.followBtn}>
          <Text>Follow</Text>
        </TouchableHighlight>
      );
    }

    return (
      <ScrollView contentContainerStyle={profileStyle.container}>
        <Image source={{uri:profile.picture}} style={profileStyle.profileImg}/>
        <Text>{profile.first_name + ' ' + profile.last_name}</Text>
        <Text>{profile.location.place}</Text>
        <Text>{(profile.summary) ? profile.summary : 'I love to workout!'}</Text>
        {followBtn}
        <View style={profileStyle.dashboard}>
          <TouchableOpacity style={profileStyle.dashboardItem}>
            <View>
              {this._renderCenteredText(profile.sessionCount, profileStyle.dashboardTextColor)}
              {this._renderCenteredText('SESSIONS')}
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={profileStyle.dashboardItem}>
            <View>
              {this._renderCenteredText(profile.followerCount, profileStyle.dashboardTextColor)}
              {this._renderCenteredText('FOLLOWERS')}
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={profileStyle.dashboardItem}>
            <View>
              {this._renderCenteredText(profile.followingCount, profileStyle.dashboardTextColor)}
              {this._renderCenteredText('FOLLOWING')}
            </View>
          </TouchableOpacity>
        </View>

        <View style={[profileStyle.dashboard, {borderTopWidth: 0, paddingTop: 20, paddingBottom: 20}]}>
          <TouchableOpacity>
            <Text>FEED</Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text>PHOTOS</Text>
          </TouchableOpacity>
        </View>

        {/* TODO: create a feed component that renders the feeds in realtime */}
      </ScrollView>
    );
  }

const mapStateToProps = function(state) {
  return {
    uID: state.auth.uID,
    firestack: state.app.firestack
  };
};

const mapDispatchToProps = function(dispatch) {
  return {
    navigation: bindActionCreators({ push }, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileEntry);
