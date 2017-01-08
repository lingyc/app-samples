import React, {Component} from 'react';
import { postStyle, feedEntryStyle, composeStyle, headerStyle } from '../styles/styles.js';
import { Modal, View, TextInput, Text, StatusBar, ScrollView, Image, KeyboardAvoidingView, TouchableOpacity, ActivityIndicator } from 'react-native';
// import AutoExpandingTextInput from '../../common/AutoExpandingTextInput.js';
import Icon from 'react-native-vector-icons/Ionicons';
import { push, pop, resetTo } from '../actions/navigation.js';
import { save } from '../actions/drafts.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {convertFBObjToArray, saveUpdateToDB, turnOnCommentListener, turnOffCommentListener} from '../library/firebaseHelpers.js'
import TimeAgo from 'react-native-timeago';
import Firebase from 'firebase';
import ComposeComment from './post/ComposeComment.js';
import SocialBtns from './SocialBtns.js'

class CommentsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: [],
      replyModalVisible: false,
    };

    this.props.contentType;
    this.props.contentID;
    this.commentRef = this.props.commentRef
  }

  componentDidMount() {
    this._turnOnReplyListener();
  }

  componentWillUnmount() {
    this._turnOffReplyListener();
  };

  _turnOnCommentListener() {
    const handleNewComment = (msgKey) => {
      this.FitlyFirebase.database().ref('messages').child(msgKey).once('value')
      .then(msgSnap => {
        let commentCopy = this.state.comments.slice();
        let newMsg = msgSnap.val();
        newMsg.key = msgKey;
        commentCopy.push(newMsg);
        this.setState({comments: commentCopy});
      });
    };

    const handleComments = (msgKeys) => {
      msgKeys.forEach((msgKey, index) => {
        this.FitlyFirebase.database().ref('messages').child(msgKey).once('value')
        .then(msgSnap => {
          let commentCopy = this.state.comments.slice();
          let msgObj = msgSnap.val();
          msgObj.key = msgKey;
          commentCopy[index] = msgObj;
          this.setState({comments: commentCopy});
        });
      })
    };
    turnOnCommentListener(this.commentRef, handleComments, handleNewComment);
  };

  _turnOffPostListener() {
    turnOffCommentListener(this.commentRef);
  };

  _toggleMsgLike(index, comment) {
    const msgRef = this.FitlyFirebase.database().ref('messages' + commentID)
    (async () => {
      try {
        let updatedMsg;
        if (comment.likeMembers[this.uID]) {
          await msgRef.child('likeMembers').child(this.uID).set(null);
          await msgRef.child('likeCount').transaction(count => count - 1);
        } else {
          let photo = null;
          if (comment.photo) {
            photo = {
              [comment.photo.key]: {
                link: comment.photo.link
              }
            }
          }
          const updateObj = {
            type: "like",
            contentType: 'message',
            contentID: comment.key,
            ownerID: this.uID,
            ownerName: this.user.public.first_name + ' ' + this.user.public.last_name,
            ownerPicture: this.user.public.picture,
            photos: photo,
            timestamp: Firebase.database.ServerValue.TIMESTAMP
          };
          saveUpdateToDB(updateObj, this.uID, {minor: true});
          await msgRef.child('likeMembers').child(this.uID).set(true);
          await msgRef.child('likeCount').transaction(count => count + 1);

        }
        updatedMsg = (await msgRef.once('value')).val();
        let commentsCopy = this.state.comments.slice();
        commentsCopy[index] = updatedMsg;
        this.setState({comments: commentsCopy});
      } catch(error) {
        console.log(error);
      }
    })();

    _renderComments(comments) {
      return comments.map((comment, index) => {
        if (comment) {
          return <View key={comment.key}>
            {this._renderAuthor(comment)}
            <TimeAgo style={feedEntryStyle.timestamp} time={comment.createdAt}/>
            <View style={postStyle.postContent}>
              {(comment.photo)
                ? <TouchableOpacity style={feedEntryStyle.imagesTouchable} onPress={() => console.log('redirect to photo view with photokey ', photo.key)}>
                    <Image style={feedEntryStyle.images} source={{uri: photo.link}} style={feedEntryStyle.images} defaultSource={require('../../../img/default-photo-image.png')}/>
                  </TouchableOpacity>
                : <Text style={postStyle.content}>{comment.content}</Text>
              }
              <SocialBtns
                content={comment}
                likeState={comment.likeMembers[this.uID]}
                sharedState={comment.sharedMembers[this.uID]}
                saveState={comment.savedMembers[this.uID]}
                toggleLike={() => this._toggleMsgLike(index, comment.key)}
                onShare={() => this._sharePost(index, comment.key)}
                onSave={() => this._savePost(index, comment.key)}
                onComment={() => this.setState({replyModalVisible: true})}
              />
              {/* render reply modal for the message */}
            </View>
          </View>
        } else {
          return (
            <View key={comment.key}>
              <ActivityIndicator animating={true} style={{height: 80}} size="small"/>
            </View>
          )
        }
      })
    };

    render() {
      return (
        <View>
          {this._renderComments()}
        </View>
      )
    }
  }
