import React, { Component } from 'react';
import { Alert, View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
// import Feeds from '../../common/Feeds.js'
import FeedTabs from '../../common/FeedTabs.js'
import { profileStyle } from '../../styles/styles.js';
import { storeUserProfile } from '../../actions/user.js';
import { push } from '../../actions/navigation.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {selectPicture} from '../../library/pictureHelper.js';
import {uploadPhoto, turnOnfeedService, turnOffeedService} from '../../library/firebaseHelpers.js';
import Icon from 'react-native-vector-icons/Ionicons';
import AutoExpandingTextInput from '../../common/AutoExpandingTextInput.js'


class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      feeds: [],
      summaryEditMode: false,
      summaryInput: '',
    }
  }

  //register listener to update the feeds, and follower count
  componentDidMount() {
    this._turnOnProfileWatcher();
    turnOnfeedService(this.props.uID, {self: true},
      (feeds) => this.setState({feeds: feeds.reverse()}),
      (newFeed) => this.setState({feeds: [newFeed].concat(this.state.feeds)})
    );
  }

  componentWillUnmount() {
    this._turnOffProfileWatcher();
    turnOffeedService(this.props.uID, {self: true});
  };

  _turnOnProfileWatcher() {
    const handleProfileChange = (snapshot) => {
      const {private: privateData} = this.props.user;
      // TODO: get push notification for updates in follower and following
      this.props.action.storeUserProfile({private: privateData, public: snapshot.val()});
    };
    this.props.FitlyFirebase.database().ref('users/' + this.props.uID + '/public/').on('value', handleProfileChange.bind(this));
  };

  _turnOffProfileWatcher() {
    this.props.FitlyFirebase.database().ref('users/' + this.props.uID + '/public/').off('value');
  };

  _renderCenteredText(text, styles) {
    return (
      <Text style={[profileStyle.centeredText, styles]}>{text}</Text>
    );
  };

  _updateSummary() {
    this.props.FitlyFirebase.database().ref('users/' + this.props.uID + '/public/summary').set(this.state.summaryInput);
    this.setState({summaryInput: '', summaryEditMode: false});
  }

  _renderSummary(profile) {
    if (this.state.summaryEditMode) {
      return (
        <View style={{flex: 0, alignItems:'center'}}>
          <AutoExpandingTextInput
            style={profileStyle.summaryTextBox}
            multiline={true}
            maxLength={200}
            clearButtonMode="always"
            onSubmitEditing={() => this._updateSummary()}
            onChangeText={(text) => this.setState({summaryInput: text})}
            value={this.state.summaryInput}
            placeholder="say a little about yourself!"
          />
          <Text style={profileStyle.summaryTextBtn} onPress={() => this._updateSummary()}>send</Text>
          <Text style={profileStyle.summaryTextBtn} onPress={() => this.setState({summaryEditMode: !this.state.summaryEditMode, summaryInput: ''})}>close</Text>
        </View>
      );
    } else {
      return (
        <View style={{flex: 0, alignItems:'center'}}>
          <Text style={profileStyle.summaryText}>{(profile.summary) ? profile.summary : 'I love to workout!'}</Text>
          <Text style={{fontSize: 12, marginLeft: 10, color: 'grey'}} onPress={() => this.setState({summaryEditMode: !this.state.summaryEditMode})}>edit</Text>
        </View>
      );
    }
  }

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
        <View style={profileStyle.locationContainer}>
          <Icon name="ios-pin-outline" size={30} color="grey"/>
          <Text style={[profileStyle.dashboardText, {marginLeft: 5}]}>{profile.location.place}</Text>
        </View>
        {this._renderSummary(profile)}
        <View style={profileStyle.createBtnContainer}>
          <TouchableOpacity style={profileStyle.createBtn} onPress={() => this.props.navigation.push({key: "MakePost", global: true})}>
            <Icon name="ios-create-outline" size={35} color="black"/>
            <Text style={profileStyle.dashboardText}>post</Text>
          </TouchableOpacity>

          <TouchableOpacity style={profileStyle.createBtn} onPress={() => this.props.navigation.push({key: "CreateActivity", global: true})}>
            <Icon name="ios-add-outline" size={35} color="black"/>
            <Text style={profileStyle.dashboardText}>activity</Text>
          </TouchableOpacity>
        </View>

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

        <FeedTabs feeds={this.state.feeds}/>
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
