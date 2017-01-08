import React, {Component} from 'react';
import { composeStyle, headerStyle, postStyle } from '../../styles/styles.js';
import { Modal, View, TextInput, Text, StatusBar, ScrollView, Image, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView } from 'react-native';
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
import {selectPicture} from '../../library/pictureHelper.js'
import Firebase from 'firebase';

//TODO: input validation??
const hashTagRegex = (/^\w+$/g);

class ComposeReply extends Component {
  constructor(props) {
    super(props);
    this.initialState = {
      loading: false,
      modalVisible: false,
      contentType: 'light-content',
      content: '',
      photo: null,
      tags: [],
    };

    this.state = {...this.initialState};

    this.user = this.props.user;
    this.uID = this.props.uID;
    this.FitlyFirebase = this.props.FitlyFirebase;
    this.postRef = this.FitlyFirebase.database().ref('/posts/' + this.props.postID);
    this.msgRef = this.FitlyFirebase.database().ref('/messages/');
    this.userMsgRef = this.FitlyFirebase.database().ref('/userMessages/' + this.uID);
    this.postCommentRef = this.FitlyFirebase.database().ref('/postComments/' + this.props.postID);
    this.notificationRef = this.FitlyFirebase.database().ref('/otherNotifications/' + this.props.post.author);
  };

  //TODO: when hit summit does the view redirects to the post display view directly?
  //disables cliking send
  _sendMsg() {
    //tables to update: posts, userPosts, userUpdatesMajor, userUpdatesAll
    (async () => {
      try {
        this.setState({loading: true});
        let draftState = this.state;
        let msgKey = this.msgRef.push().key;
        let authorInfo = {
          author: this.uID,
          authorName: this.user.public.first_name + ' ' + this.user.public.last_name,
          authorPicture: this.user.public.picture
        };

        let msgObj = {
          ...authorInfo,
          contentlink: '/posts' + this.props.postID,
          content: draftState.content,
          replyCount: 0,
          likeMembers: null,
          sharedMembers: null,
          savedMembers: null,
          likeCount: 0,
          sharedCount: 0,
          savedCount: 0,
          createdAt: Firebase.database.ServerValue.TIMESTAMP,
        };

        if (this.state.photo) {
          let photoRefs = await savePhotoToDB([photo], authorInfo, '/messages/' + msgKey);
          msgObj.photo = {...photoRefs[0]};
          msgObj.content = null;
        }

        this.msgRef.child(msgKey).set(msgObj);
        this.userMsgRef.child(msgKey).set({timestamp: Firebase.database.ServerValue.TIMESTAMP});
        this.postCommentRef.child(msgKey).set({timestamp: Firebase.database.ServerValue.TIMESTAMP});
        this.postRef.child('replyCount').transaction(count => count + 1);
        this.postRef.child('lastRepliedAt').set(Firebase.database.ServerValue.TIMESTAMP);
        this.postRef.child('lastMsg').set(this.state.content);

        const updateObj = {
          type: "reply",
          sourceType: "post",
          postID: this.props.postID,
          msgID: msgKey,
          ownerID: this.uID,
          ownerName: authorInfo.authorName,
          ownerPicture: authorInfo.authorPicture,
          message: draftState.content,
          timestamp: Firebase.database.ServerValue.TIMESTAMP
        };

        this.notificationRef.push(updateObj);
        this.setState({...this.initialState})

      } catch(error) {
        this.setState({loading: false});
        console.log('create post error', error);
      }
    })();
  };

  _sendPhotoMsg() {
    selectPicture()
    .then(photo => {
      this.setState({photo: photo.uri});
      this._sendMsg();
    }).catch(error => {
      console.log('error getting photo')
    })
  }

  _renderHeader() {
    let draftState = this.props.drafts[this.props.draftRef];
    return (
      <HeaderInView
        leftElement={{icon: "ios-arrow-round-back-outline"}}
        title='comment'
        _onPressLeft={() => this.props.closeModal()}
      />
    );
  };

  _renderInputBar() {
    return (
      <KeyboardAvoidingView behavior={'padding'} style={postStyle.inputBar}>
        <AutoExpandingTextInput
          clearButtonMode="always"
          onChangeText={(text) => this.setState({content: text})}
          style={postStyle.replyInput}
          value={this.state.content}
          placeholderTextColor="grey"
          autoFocus={true}
          returnKeyType='send'
          onSubmitEditing={() => this._sendMsg()}
        />
          {(this.state.loading)
            ? <ActivityIndicator
              animating={this.state.loading}
              // style={{position:'absolute', top: 0, right: 0, height: 80}}
              size="small"
            />
            : <TouchableOpacity style={postStyle.cameraBtn} onPress={() => this._sendPhotoMsg()}>
               <Icon name="ios-camera-outline" size={35} color='#888'/>
            </TouchableOpacity>
          }
      </KeyboardAvoidingView>
    );
  }

  render() {
    let draftState = this.state;
    return (
      <View style={{flex: 1}}>
        <StatusBar barStyle={this.state.contentType}/>
        {this._renderHeader()}
          <ScrollView keyboardDismissMode="on-drag" contentContainerStyle={[postStyle.scrollContentContainer, {marginTop: 20}]}>
            <View style={postStyle.postContainer}>
              {this.props.renderPost()}
              {this.props.renderComments()}
            </View>
          </ScrollView>
          {this._renderInputBar()}
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

export default connect(mapStateToProps, mapDispatchToProps)(ComposeReply);
