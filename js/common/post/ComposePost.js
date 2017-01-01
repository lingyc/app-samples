import React, {Component} from 'react';
import { composeStyle, headerStyle } from '../../styles/styles.js';
import { Modal, View, TextInput, Text, StatusBar, ScrollView, Image, KeyboardAvoidingView, TouchableOpacity, ActivityIndicator } from 'react-native';
import AutoExpandingTextInput from '../../common/AutoExpandingTextInput.js';
import Icon from 'react-native-vector-icons/Ionicons';
import HeaderInView from '../../header/HeaderInView.js'
import { push, pop, resetTo } from '../../actions/navigation.js';
import { save, clear } from '../../actions/drafts.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImagePicker from 'react-native-image-crop-picker';
import TagInput from 'react-native-tag-input';
import {savePhotoToDB} from '../../library/firebaseHelpers.js'
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
  _savePostToDB() {
    (async () => {
      try {
        this.setState({loading: true});
        let draftState = this.props.drafts[this.props.draftRef];
        let postKey = this.FitlyFirebase.database().ref().child('posts').push().key;
        let photoRefs = await savePhotoToDB(draftState.photos, this.uID, '/posts/' + postKey);
        let photoRefObject = photoRefs.reduce((refObj, photoRef) => {
            refObj[photoRef] = true;
            return refObj;
          }, {});
        let tagsArray = draftState.tags || [];
        let tagObj = tagsArray.reduce((tags, tag) => {
            tags[tag] = true;
            return tags;
          }, {});
        let postObj = {
          author: this.uID,
          title: draftState.title,
          content: draftState.content,
          category: draftState.category,
          replyCount: 0,
          tags: tagObj,
          likeCount: 0,
          createdAt: Firebase.database.ServerValue,
          photos: photoRefObject,
        };

        this.FitlyFirebase.database().ref('/posts/' + postKey).set(postObj)
        .then(post => {
          this.FitlyFirebase.database().ref('/userPosts/' + this.uID).push({postKey: true});
          this.FitlyFirebase.database().ref('/userUpdatesGeneral/' + this.uID).push({
            type: "post",
            contentID: postKey,
            contentlink: '/posts/' + postKey,
            description: `new ${draftState.category.toLowerCase()} post`,
            timestamp: Firebase.database.ServerValue
          })
        });

        this.setState({loading: false});
        //TODO: reset route to the newly created post
      } catch(error) {
        this.setState({loading: false});
        console.log('create post error', error);
      }
    })();
  };

  _getImageFromCam() {
    let draftState = this.props.drafts[this.props.draftRef];
    ImagePicker.openCamera({
      compressImageQuality: .6
    }).then(image => {
      let newPhotos = draftState.photos;
      newPhotos.push(image);
      this.setDraftState({photos: newPhotos});
    }).catch(error => {
      console.log('image picker', error);
    });
  };

  _getImageFromLib() {
    let draftState = this.props.drafts[this.props.draftRef];
    ImagePicker.openPicker({
      cropping: true,
      multiple: true,
      compressImageQuality: .6
    }).then(images => {
      let newPhotos = draftState.photos.concat(images);
      this.setDraftState({photos: newPhotos});
    }).catch(error => {
      console.log('image picker', error);
    });
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

  _removeImg(index) {
    let draftState = this.props.drafts[this.props.draftRef];
    let newPhotos = draftState.photos.slice();
    newPhotos.splice(index, 1);
    this.setDraftState({photos: newPhotos});
  };

  _renderFullSizeImgs(draftState) {
    return draftState.photos.map((photo, index) => {
      return (
        <View key={index} style={composeStyle.imgLarge}>
          <TouchableOpacity style={composeStyle.closeBtn} onPress={() => this._removeImg(index)}>
            <Icon name="ios-close-outline" size={50} color='rgba(255,255,255,.7)'/>
          </TouchableOpacity>
          <Image style={{width: null, height: 400}} source={{uri: photo.path, isStatic:true}}/>
          <AutoExpandingTextInput
            clearButtonMode="always"
            onChangeText={(text) => {
              let newPhotos = draftState.photos.slice();
              newPhotos[index].description = text;
              this.setDraftState({photos: newPhotos});
            }}
            style={[composeStyle.input, {fontSize: 16}]}
            multiline={true}
            value={(photo.description) ? photo.description : ''}
            placeholder="caption"
            placeholderTextColor="grey"
          />
          <View style={[composeStyle.hashTagInput, {borderWidth: 0}]}>
            <Text style={composeStyle.hashTag}>#</Text>
            <TagInput
              value={(photo.tags) ? photo.tags : []}
              onChange={(tags) => {
                let newPhotos = draftState.photos.slice();
                newPhotos[index].tags = tags;
                this.setDraftState({photos: newPhotos})
              }}
              regex={hashTagRegex}
            />
          </View>
        </View>
      );
    });
  };

  _renderImgModal(draftState) {
    return (
      <Modal
        animationType={"slide"}
        transparent={false}
        visible={this.state.modalVisible}
        onRequestClose={() => this.setState({modalVisible: false})}>
        <KeyboardAvoidingView behavior="position" style={{flex: 0}}>
          <Text style={{marginTop: 30, marginRight:20, marginBottom:15, fontSize: 20, alignSelf:'flex-end', color:'#1D2F7B'}} onPress={() => this.setState({modalVisible: false, contentType:'light-content'})}>back</Text>
          <ScrollView keyboardDismissMode="on-drag" contentContainerStyle={{flex: 0}}>
            {this._renderFullSizeImgs(draftState)}

            <View style={[composeStyle.photosSection, {paddingTop: 15, paddingBottom: 15}]}>
              <TouchableOpacity style={composeStyle.photoThumbnail} onPress={() => this._getImageFromLib()}>
                <Icon name="ios-image-outline" size={30} color="#bbb"/>
              </TouchableOpacity>
              <TouchableOpacity style={composeStyle.photoThumbnail} onPress={() => this._getImageFromCam()}>
                <Icon name="ios-camera-outline" size={30} color="#bbb"/>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
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
        {/* <KeyboardAvoidingView behavior="position" style={{flex: 0}}> */}
          <ScrollView keyboardDismissMode="on-drag" contentContainerStyle={composeStyle.scrollContentContainer}>
            <Image style={composeStyle.profilePic} source={(this.user.picture) ? {uri:this.user.picture} : require('../../../img/default-user-image.png')}
              defaultSource={require('../../../img/default-user-image.png')}/>
              <ActivityIndicator
                animating={this.state.loading}
                style={{position:'absolute', top: 0, right: 0, height: 80}}
                size="large"
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
        {/* </KeyboardAvoidingView> */}
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
    navigation: bindActionCreators({ push, pop, resetTo }, dispatch),
    draftsAction: bindActionCreators({ save, clear }, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ComposePost);
