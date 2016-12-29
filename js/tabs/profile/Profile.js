import React, { Component } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { profileStyle } from '../../styles/styles.js';
import { storeUserProfile } from '../../actions/user.js';
import { resetTo } from '../../actions/navigation.js';
import { push } from '../../actions/navigation.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class Profile extends Component {
  constructor(props) {
    super(props);
  }

  //register listener to update the feeds, and follower count
  componentDidMount() {
    this.props.FitlyFirebase.database().ref('users/' + this.props.uID + '/public/').on('value', this._handleProfileChange.bind(this));
  }

  _handleProfileChange(snapshot) {
    const {private: privateData} = this.props.user;
    // TODO: get push notification for updates in follower and following
    this.props.action.storeUserProfile({private: privateData, public: snapshot.val()});
  }

  _renderCenteredText(text, styles) {
    return (
      <Text style={[profileStyle.centeredText, styles]}>{text}</Text>
    );
  }

  render() {
    // console.log('this.props.user', this.props.user);
    const {public: profile} = this.props.user;
    return (
      <ScrollView contentContainerStyle={profileStyle.container}>
        {/* TODO: add upload photo btn */}
        <Image source={(profile.picture) ? {uri:profile.picture} : require('../../../img/default-user-image.png')} style={profileStyle.profileImg}/>
        <Text style={profileStyle.nameText}>{profile.first_name + ' ' + profile.last_name}</Text>
        <Text style={profileStyle.dashboardText}>{profile.location.place}</Text>
        {/* TODO: add edit summary btn */}
        <Text style={profileStyle.summaryText}>{(profile.summary) ? profile.summary : 'I love to workout!'}</Text>
        {/* TODO: add content creation */}
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

        {/* TODO: create a feed component that renders the feeds in realtime */}
      </ScrollView>
    );
  }
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
    navigation: bindActionCreators({ resetTo }, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
