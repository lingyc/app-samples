import React, {Component} from 'react';
import { composeStyle, optionStyle, feedEntryStyle } from '../../styles/styles.js';
import { Modal, View, TextInput, Text, StatusBar, ScrollView, Image, TouchableOpacity, ActivityIndicator, SegmentedControlIOS } from 'react-native';
import AutoExpandingTextInput from '../../common/AutoExpandingTextInput.js';
import TagInput from 'react-native-tag-input';
import ImageEditModal from '../post/ImageEditModal.js';
import Icon from 'react-native-vector-icons/Ionicons';
import { push, resetTo } from '../../actions/navigation.js';
import { save, clear } from '../../actions/drafts.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {savePhotoToDB, saveUpdateToDB, randomString} from '../../library/firebaseHelpers.js'
import {getImageFromCam, getImageFromLib} from '../../library/pictureHelper.js'
import Firebase from 'firebase';
import {getWeekdayMonthDay, getHrMinDuration} from '../../library/convertTime.js'

//TODO: input validation??
const hashTagRegex = (/^\w+$/g);

class CreateActivityScene extends Component {
  constructor(props) {
    super(props);
    // this.props.groupID;
    if (!this.props.draftRef) {
      this.draftRef = randomString();
      this.props.draftsAction.save(this.draftRef,{
        category: "Workout Plan",
        title: '',
        details: '',
        tags: [],
        mainPhoto: null,
        photos: [],
        startDate: null,
        endDate: null,
        otherOrganizers: [],
        cost: 0,
        group: this.props.groupID || null,
        location: null,
        address: null,
        placeName: null,
        photoRefs: null,
        public: true,
        invites: {
          allFollowers: false,
          allFollowings: false,
          allPrevConnected: false,
          facebookFriend: false,
          users: {},
          contacts: {},
        }
      })
    } else {
      this.draftRef = this.props.draftRef;
    }

    this.state = {
      editCost: false,
      editName: false,
      editDetails: false,
      loading: false,
      modalVisible: false,
      contentType: 'light-content',
      otherOrganizersDetails: [],
    };

    this.draftsAction = this.props.draftsAction;
    this.setDraftState = this.props.draftsAction.save.bind(this, this.draftRef);
    this.clearState = this.props.draftsAction.clear.bind(this, this.draftRef);
    this.user = this.props.user;
    this.uID = this.props.uID;
    this.database = this.props.FitlyFirebase.database();
    this._setCost = this._setCost.bind(this);
  };

  _saveActivityToDB() {
    //tables to update: posts, userPosts, userUpdatesMajor, userUpdatesAll
    (async () => {
      try {
        this.setState({loading: true});
        let draftState = this.props.drafts[this.draftRef];
        let postKey = this.database.ref('posts').push().key;
        let authorInfo = {
          author: this.uID,
          authorName: this.user.public.first_name + ' ' + this.user.public.last_name,
          authorPicture: this.user.public.picture
        }

        this.props.navigation.resetTo({
          key: "TabNavigator", global: true
        });

        this.props.navigation.push({
          key: 'PostView@' + postKey,
          passProps:{
            postID: postKey
          }
        }, {general: true});

        let photoRefs = await savePhotoToDB(draftState.photos, authorInfo, '/posts/' + postKey);
        let photoRefObject = photoRefs.reduce((refObj, photoRef) => {
            refObj[photoRef.key] = {
              link: photoRef.link,
              timestamp: Firebase.database.ServerValue.TIMESTAMP,
            };
            return refObj;
          }, {});
        let tagsArray = draftState.tags || [];
        let tagObj = tagsArray.reduce((tags, tag) => {
            tags[tag] = true;
            return tags;
          }, {});
        let postObj = {
          author: this.uID,
          authorName: this.user.public.first_name + ' ' + this.user.public.last_name,
          authorPicture: this.user.public.picture,
          title: draftState.title,
          content: draftState.content,
          category: draftState.category,
          shareCount: 0,
          saveCount: 0,
          replyCount: 0,
          tags: tagObj,
          likeCount: 0,
          createdAt: Firebase.database.ServerValue.TIMESTAMP,
          photos: photoRefObject,
        };

        this.database.ref('/posts/' + postKey).set(postObj)
        .then(post => {
          this.database.ref('/userPosts/' + this.uID).push({postKey: true});
          const updateObj = {
            type: "post",
            contentID: postKey,
            contentlink: '/posts/' + postKey,
            ownerID: this.uID,
            ownerName: this.user.public.first_name + ' ' + this.user.public.last_name,
            ownerPicture: this.user.public.picture,
            contentTitle: draftState.title,
            photos: photoRefObject,
            contentSnipet: draftState.content.slice(0, 200),
            description: draftState.category.toLowerCase(),
            timestamp: Firebase.database.ServerValue.TIMESTAMP
          };
          saveUpdateToDB(updateObj, this.uID);
        });
      } catch(error) {
        // this.setState({loading: false});
        console.log('create post error', error);
      }
    })();
  };

  _renderImgModal(draftState) {
    const removeImg = (index) => {
      let newPhotos = draftState.photos.slice();
      newPhotos.splice(index, 1);
      this.setDraftState({photos: newPhotos});
    };

    return (
      <ImageEditModal
        draftState={draftState}
        visible={this.state.modalVisible}
        onBack={() => this.setState({modalVisible: false, contentType:'light-content'})}
        onRequestClose={() => this.setState({modalVisible: false})}
        getImageFromLib={() => this._getImageFromLib()}
        getImageFromCam={() => this._getImageFromCam()}
        onRemoveImage={(index) => removeImg(index)}
        onCaptionChange={(text, index) => {
          let newPhotos = draftState.photos.slice();
          newPhotos[index].description = text;
          this.setDraftState({photos: newPhotos});
        }}
        onTagChange={(tags, index) => {
          let newPhotos = draftState.photos.slice();
          newPhotos[index].tags = tags;
          this.setDraftState({photos: newPhotos})
        }}
      />
    );
  };

  _getImageFromCam() {
    let draftState = this.props.drafts[this.draftRef];
    getImageFromCam(image => {
      let newPhotos = draftState.photos;
      newPhotos.push(image);
      this.setDraftState({photos: newPhotos});
    });
  };

  _getImageFromLib() {
    let draftState = this.props.drafts[this.draftRef];
    getImageFromLib(images => {
      let newPhotos = draftState.photos.concat(images);
      this.setDraftState({photos: newPhotos});
    })
  };

  _setCost() {
    const {cost} = this.props.drafts[this.draftRef];
    const numericCost = parseFloat(cost).toFixed(2);
    if (numericCost < 0.01 || isNaN(numericCost)) {
      this.setDraftState({cost: 0});
    } else {
      this.setDraftState({cost: numericCost});
    }
    this.setState({editCost: false});
  }

  _renderPhotoSection(draftState, renderThumnails) {
    let thumbnails;
    if (renderThumnails) {
      thumbnails = this._renderThumbnails(draftState.photos);
    }
    return (
      <View style={[composeStyle.photosSection]}>
        {thumbnails}
        <TouchableOpacity style={composeStyle.photoThumbnail} onPress={() => this._getImageFromLib()}>
          <Icon name="ios-image-outline" size={30} color="#bbb"/>
        </TouchableOpacity>
        <TouchableOpacity style={composeStyle.photoThumbnail} onPress={() => this._getImageFromCam()}>
          <Icon name="ios-camera-outline" size={30} color="#bbb"/>
        </TouchableOpacity>
      </View>
    );
  };

  _renderThumbnails(photos) {
    return photos.map((photo, index) => {
      return (
        <TouchableOpacity key={index} onPress={() => this.setState({modalVisible: true, contentType: 'default'})} style={composeStyle.photoThumbnail}>
          <Image style={{height: 100, width: 100}} source={{uri: photo.path, isStatic:true}}/>
          <Icon style={{position: 'absolute', right: 10, bottom: 5, backgroundColor: 'rgba(0,0,0,0)'}} name="ios-expand" size={30} color='rgba(255,255,255,.7)'/>
        </TouchableOpacity>
      );
    });
  };

  _renderTitle(draftState) {
    return (
      <View style={optionStyle.entry}>
        {(this.state.editName)
          ? <TextInput
              returnKeyType="done"
              maxLength={30}
              autoFocus={true}
              clearButtonMode="always"
              onChangeText={(text) => this.setDraftState({title: text})}
              style={{marginLeft: 20, fontWeight: "500", width: 200}}
              onSubmitEditing={() => this.setState({editName: false})}
              onEndEditing={() => this.setState({editName: false})}
              value={draftState.title}
              placeholder="Activity Name"
              placeholderTextColor="grey"
            />
          : <Text style={{marginLeft: 20}}>Activity Name: {(draftState.title) ? draftState.title : 'unamed'}</Text>
        }
        <TouchableOpacity
          style={optionStyle.icon}
          onPress={() => this.setState({editName: true})}>
          <Icon name="ios-create-outline" size={30} color="#bbb"/>
        </TouchableOpacity>
      </View>
    )
  }

  _renderOrganizers(draftState) {
    const {public: userProfile} = this.props.user;
    return (
      <View style={optionStyle.entry}>
        <View style={{marginTop: 15, marginBottom: 15, marginLeft: 20}}>
          <Text style={{marginBottom: 10}}>Organizer:</Text>
          <View style={{flexDirection:'row', justifyContent:'center'}}>
            <View style={{alignItems:'center'}}>
              <Image source={(userProfile.picture) ? {uri:userProfile.picture} : require('../../../img/default-user-image.png')}
              style={feedEntryStyle.profileImg} defaultSource={require('../../../img/default-user-image.png')}/>
              <Text>{userProfile.first_name + ' ' + userProfile.last_name}</Text>
            </View>
            {this.state.otherOrganizersDetails.map(organizer => {
              return <Image
                source={(organizer.picture) ? {uri:organizer.picture} : require('../../../img/default-user-image.png')}
                defaultSource={require('../../../img/default-user-image.png')}/>
              })}
            </View>
        </View>
        <TouchableOpacity
          style={[optionStyle.icon, {right: 22}]}
          onPress={() => console.log('add more organizers')}>
          <Icon name="ios-add-outline" size={40} color="#bbb"/>
        </TouchableOpacity>
      </View>
    )
  }

  _renderInvites(draftState) {
    const {public: userProfile} = this.props.user;
    return (
      <View style={optionStyle.entry}>
        <Text style={{marginLeft: 20}}>Select Invites: {(draftState.title) ? draftState.title : 'unamed'}</Text>
        <TouchableOpacity
          style={[optionStyle.icon, {right: 22}]}
          onPress={() => {
            this.props.navigation.push({
              key: 'SelectInvitesScene',
              showHeader: true,
              headerTitle: 'select invites',
              leftHeaderIcon: 'ios-arrow-round-back-outline',
              global: true,
              passProps:{
                draftRef: this.draftRef
              }
            })
          }}>
          <Icon name="ios-add-outline" size={40} color="#bbb"/>
        </TouchableOpacity>
      </View>
    )
  }

  _renderPublicOrPrivate(draftState) {
    return (
      <View style={optionStyle.entry}>
        <View style={{marginTop: 15, marginBottom: 15, marginLeft: 20}}>
          <Text>Only users invited can join private events {'\n'}</Text>
          <SegmentedControlIOS
            style={{alignSelf: 'stretch'}}
            values={['Public', 'Private']}
            selectedIndex={(draftState.public) ? 1 : 0}
            onChange={(event) => (event.nativeEvent.selectedSegmentIndex)
              ? this.setDraftState({public: true})
              : this.setDraftState({public: false})}
          />
        </View>
      </View>
    )
  }

  _renderSchedule(draftState) {
    const {startDate, endDate} = draftState;
    return (
      <View style={optionStyle.entry}>
        {(startDate && endDate)
          ? <View style={{marginLeft: 20}}>
              <Text>{getWeekdayMonthDay(startDate.date)}</Text>
              <Text>{getHrMinDuration(startDate.date, endDate.date)}</Text>
            </View>
          : <Text style={{marginLeft: 20}}>Select a Date</Text>
        }
        <TouchableOpacity
          style={optionStyle.icon}
          onPress={() => this.props.navigation.push({
            key: 'SelectDateScene',
            showHeader: true,
            headerTitle: 'select a date',
            leftHeaderIcon: 'ios-arrow-round-back-outline',
            global: true,
            passProps:{
              draftRef: this.draftRef
            }
          })}>
          <Icon name="ios-calendar-outline" size={30} color="#bbb"/>
        </TouchableOpacity>
      </View>
    );
  };

  _renderLocation(draftState) {
    const {location} = draftState;
    return (
      <View style={optionStyle.entry}>
        {(location)
          ? <View style={{marginTop: 15, marginBottom: 15, marginLeft: 20}}>
              <Text>Location: {'\n'}</Text>
              <Text>{location.placeName}</Text>
              <Text style={{left: 0, width: 300}}>{location.address}</Text>
            </View>
          : <Text style={{marginLeft: 20}}>Select a Location</Text>
        }
        <TouchableOpacity
          style={optionStyle.icon}
          onPress={() => this.props.navigation.push({
            key: 'SelectLocationScene',
            showHeader: true,
            headerTitle: 'select a location',
            leftHeaderIcon: 'ios-arrow-round-back-outline',
            global: true,
            passProps:{
              draftRef: this.draftRef
            }
          })}>
          <Icon name="ios-map-outline" size={30} color="#bbb"/>
        </TouchableOpacity>
      </View>
    );
  };

  _renderCost(draftState) {
    const {editCost} = this.state;
    const {cost} = draftState;
    return (
      <View style={optionStyle.entry}>
        <View style={{marginLeft: 20, flexDirection:'row'}}>
          <Text>Cost to Enter: {(cost) ? '$' : ''}</Text>
          {(editCost)
            ? <TextInput
                returnKeyType="done"
                maxLength={30}
                autoFocus={true}
                keyboardType='numeric'
                clearButtonMode="always"
                onChangeText={(text) => this.setDraftState({cost: text})}
                onSubmitEditing={this._setCost}
                onEndEditing={this._setCost}
                style={{width: 200}}
                value={cost.toString()}
                placeholder="amount"
                placeholderTextColor="grey"
              />
            : <Text>{(cost) ? cost : 'free'}</Text>
          }
        </View>
        <TouchableOpacity
          style={optionStyle.icon}
          onPress={() => this.setState({editCost: true})}>
          <Icon name="ios-create-outline" size={30} color="#bbb"/>
        </TouchableOpacity>
      </View>
    );
  };

  _renderDetails(draftState) {
    return (
      <View style={[optionStyle.entry, {paddingTop: 15, paddingBottom: 15}]}>
        {(this.state.editDetails)
          ? <AutoExpandingTextInput
            clearButtonMode="always"
            autoFocus={true}
            onChangeText={(text) => this.setDraftState({details: text})}
            style={{marginLeft: 20, width: 300, fontSize: 16}}
            multiline={true}
            onSubmitEditing={() => this.setState({editDetails: false})}
            onEndEditing={() => this.setState({editDetails: false})}
            value={draftState.details}
            placeholder="Activity Details"
            placeholderTextColor="grey"
          />
          : <View>
            <Text style={{marginLeft: 20}}>Activity Details: {'\n'}</Text>
            <Text style={{marginLeft: 20, width: 300}}>{(draftState.details) ? draftState.details : 'no details'}</Text>
          </View>
        }
        <TouchableOpacity
          style={optionStyle.icon}
          onPress={() => this.setState({editDetails: true})}>
          <Icon name="ios-create-outline" size={30} color="#bbb"/>
        </TouchableOpacity>
      </View>
    )
  }

  _renderHashTags(draftState) {
    return (
      <View style={composeStyle.hashTagInput}>
        <Text style={composeStyle.hashTag}>#</Text>
        <TagInput
          value={draftState.tags}
          onChange={(tags) => this.setDraftState({tags: tags})}
          regex={hashTagRegex}
        />
      </View>
    )
  }

  render() {
    let draftState = this.props.drafts[this.draftRef];
    if (draftState) {
      return (
        <View style={{flex: 1, backgroundColor:"white"}}>
          <StatusBar barStyle={this.state.contentType}/>
          <ScrollView keyboardDismissMode="on-drag" contentContainerStyle={composeStyle.scrollContentContainer}>
            {this._renderTitle(draftState)}
            {this._renderOrganizers(draftState)}
            {this._renderSchedule(draftState)}
            {this._renderLocation(draftState)}
            {this._renderPublicOrPrivate(draftState)}
            {this._renderInvites(draftState)}
            {this._renderCost(draftState)}
            {this._renderDetails(draftState)}
            {this._renderHashTags(draftState)}
            {this._renderPhotoSection(draftState, true)}
          </ScrollView>
          {this._renderImgModal(draftState)}
        </View>
      );
    } else {
      return <ActivityIndicator animating={true} style={{height: 80}} size="large"/>
    }
  }
};

const mapStateToProps = function(state) {
  return {
    drafts: state.drafts.drafts,
    user: state.user.user,
    uID: state.auth.uID,
    FitlyFirebase: state.app.FitlyFirebase
  };
};

const mapDispatchToProps = function(dispatch) {
  return {
    navigation: bindActionCreators({ push, resetTo }, dispatch),
    draftsAction: bindActionCreators({ save, clear }, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateActivityScene);
