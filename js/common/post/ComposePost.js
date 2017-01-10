import React, {Component} from 'react';
import { composeStyle, headerStyle } from '../../styles/styles.js';
import { Modal, View, TextInput, Text, StatusBar, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import AutoExpandingTextInput from '../../common/AutoExpandingTextInput.js';
import HeaderInView from '../../header/HeaderInView.js'
import TagInput from 'react-native-tag-input';
import ImageEditModal from './ImageEditModal.js';
import Icon from 'react-native-vector-icons/Ionicons';
import { pop, push, resetTo } from '../../actions/navigation.js';
import { save, clear } from '../../actions/drafts.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {savePhotoToDB, saveUpdateToDB} from '../../library/firebaseHelpers.js'
import {getImageFromCam, getImageFromLib} from '../../library/pictureHelper.js'
import Firebase from 'firebase';

//TODO: input validation??
const hashTagRegex = (/^\w+$/g);

class ComposePost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      modalVisible: false,
      contentType: 'light-content'
    };
    this.draftsAction = this.props.draftsAction;
    this.setDraftState = this.props.draftsAction.save.bind(this, this.props.draftRef);
    this.clearState = this.props.draftsAction.clear.bind(this, this.props.draftRef);
    this.user = this.props.user;
    this.uID = this.props.uID;
    this.FitlyFirebase = this.props.FitlyFirebase;
  };

  //TODO: when hit summit does the view redirects to the post display view directly?
  //disables cliking send
  _savePostToDB() {
    //tables to update: posts, userPosts, userUpdatesMajor, userUpdatesAll
    (async () => {
      try {
        this.setState({loading: true});
        let draftState = this.props.drafts[this.props.draftRef];
        let postKey = this.FitlyFirebase.database().ref().child('posts').push().key;
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
        });

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

        this.FitlyFirebase.database().ref('/posts/' + postKey).set(postObj)
        .then(post => {
          // this.setState({loading: false});

          // this.props.navigation.resetTo({
          //   key: "TabNavigator", global: true
          // });
          //
          // this.props.navigation.push({
          //   key: 'PostView@' + postKey,
          //   passProps:{
          //     postID: postKey
          //   }
          // });
          this.FitlyFirebase.database().ref('/userPosts/' + this.uID).push({postKey: true});
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

  _getImageFromCam() {
    let draftState = this.props.drafts[this.props.draftRef];
    getImageFromCam(image => {
      let newPhotos = draftState.photos;
      newPhotos.push(image);
      this.setDraftState({photos: newPhotos});
    });
  };

  _getImageFromLib() {
    let draftState = this.props.drafts[this.props.draftRef];
    getImageFromLib(images => {
      let newPhotos = draftState.photos.concat(images);
      this.setDraftState({photos: newPhotos});
    })
  };

  _renderHeader() {
    let draftState = this.props.drafts[this.props.draftRef];
    return (
      <HeaderInView
        leftElement={{icon: "ios-arrow-round-back-outline"}}
        rightElement={{text: "Post"}}
        title={draftState.category}
        _onPressRight={() => this._savePostToDB()}
        _onPressLeft={() => this.props.navigation.pop()}
      />
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

  _renderPhotoSection(draftState, renderThumnails) {
    let thumbnails;
    if (renderThumnails) {
      thumbnails = this._renderThumbnails(draftState.photos);
    }
    return (
      <View style={composeStyle.photosSection}>
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

  render() {
    let draftState = this.props.drafts[this.props.draftRef];
    return (
      <View style={{flex: 1, backgroundColor:"white"}}>
        <StatusBar barStyle={this.state.contentType}/>
        {this._renderImgModal(draftState)}
        {this._renderHeader()}
          <ScrollView keyboardDismissMode="on-drag" contentContainerStyle={composeStyle.scrollContentContainer}>
            <Image style={composeStyle.profilePic} source={(this.user.public.picture) ? {uri:this.user.public.picture} : require('../../../img/default-user-image.png')}
              defaultSource={require('../../../img/default-user-image.png')}/>
              <ActivityIndicator
                animating={this.state.loading}
                style={{position:'absolute', top: 0, right: 0, height: 80}}
                size="small"
              />
            <View style={composeStyle.inputBox}>
              <TextInput
                returnKeyType="done"
                maxLength={30}
                clearButtonMode="always"
                onChangeText={(text) => this.setDraftState({title: text})}
                style={[composeStyle.input, {fontWeight: "300"}]}
                value={draftState.title}
                placeholder="Title"
                placeholderTextColor="grey"
              />
            </View>
            <View style={[composeStyle.inputBox, {paddingBottom: 20}]}>
              <AutoExpandingTextInput
                clearButtonMode="always"
                onChangeText={(text) => this.setDraftState({content: text})}
                style={[composeStyle.input, {fontSize: 16}]}
                multiline={true}
                value={draftState.content}
                placeholder="what's kicking?"
                placeholderTextColor="grey"
              />
              <View style={composeStyle.hashTagInput}>
                <Text style={composeStyle.hashTag}>#</Text>
                <TagInput
                  value={draftState.tags}
                  onChange={(tags) => this.setDraftState({tags: tags})}
                  regex={hashTagRegex}
                />
              </View>
            </View>
            {this._renderPhotoSection(draftState, true)}
          </ScrollView>
      </View>
    );
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
    navigation: bindActionCreators({ pop, push, resetTo }, dispatch),
    draftsAction: bindActionCreators({ save, clear }, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ComposePost);
