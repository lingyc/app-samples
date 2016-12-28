import React, { Component } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, TouchableHighlight, ActivityIndicator } from 'react-native';
import { profileStyle } from '../styles/styles.js';
import { push } from '../actions/navigation.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class ProfileEntry extends Component {
  constructor(props) {
    super(props);
    //props will have a otherUID attribute which holds the uID of the other user
    this.state = {
      loading: true,
      following: null,
      // TODO: create a local dummy profile and load it while the profile is being fetched from the database
      userProfile: null,
    }
    // this.otherUID = sceneProps.scene.route.passProps;
    console.log(this.props);
    this.database = this.props.firestack.database;
    this.userRef = this.database.ref('users/' + this.props.otherUID + '/public/');
  }

  componentWillMount() {
    //register listener to update the feeds and profile changes
    this.userRef.on('value', this._handleProfileChange.bind(this));
    this.database.ref('/followings/' + this.props.uID + '/' + this.props.otherUID).on('value', this._handleFollowingChange.bind(this));
  }

  componentWillUnmount() {
    //unregister the listener
    this.userRef.off('value');
    this.database.ref('/followings/' + this.props.uID + '/' + this.props.otherUID).off('value');
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
      updates['/followings/' + this.props.uID + '/' + this.props.otherUID] = null;
      updates['/followers/' + this.props.otherUID + '/' + this.props.uID] = null;
      this.database.ref().update(updates);
      this.database.ref('users/' + this.props.otherUID + '/public/followerCount').transaction(currentFollowerCount => currentFollowerCount - 1);
      this.database.ref('users/' + this.props.uID + '/public/followingCount').transaction(currentFollowingCount => currentFollowingCount - 1);
    } else {
      let updates = {};
      updates['/followings/' + this.props.uID + '/' + this.props.otherUID] = true;
      updates['/followers/' + this.props.otherUID + '/' + this.props.uID] = true;
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
        <TouchableHighlight style={[profileStyle.followBtn, {backgroundColor: 'green'}]} onPress={() => this._toggleFollow()}>
          {this._renderCenteredText("Following", {color: "white"})}
        </TouchableHighlight>
      );
    } else {
      followBtn = (
        <TouchableHighlight style={profileStyle.followBtn} onPress={() => this._toggleFollow()}>
          {this._renderCenteredText("Follow", {color: "white"})}
        </TouchableHighlight>
      );
    }

    // TODO: create a local dummy profile and load it while the profile is being fetched from the database
    if (this.state.loading) {
      return (
        <ActivityIndicator
          animating={this.state.loading}
          style={{height: 80}}
          size="large"
        />);
    } else {
      return (
        <ScrollView contentContainerStyle={profileStyle.container}>
          <Image source={(profile.picture) ? {uri:profile.picture} : require('../../img/default-user-image.png')} style={profileStyle.profileImg}/>
          <Text style={profileStyle.nameText}>{profile.first_name + ' ' + profile.last_name}</Text>
          <Text style={profileStyle.dashboardText}>{profile.location.place}</Text>
          <Text>{(profile.summary) ? profile.summary : 'I love to workout!'}</Text>
          {followBtn}
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
  }
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
