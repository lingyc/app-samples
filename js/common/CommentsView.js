import React, {Component} from 'react';
import { postStyle, feedEntryStyle, composeStyle, headerStyle } from '../styles/styles.js';
import { Modal, View, TextInput, Text, StatusBar, ScrollView, Image, KeyboardAvoidingView, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { push, pop, resetTo } from '../actions/navigation.js';
import { save } from '../actions/drafts.js';
import {convertFBObjToArray, saveUpdateToDB, turnOnCommentListener, turnOffCommentListener} from '../library/firebaseHelpers.js'
import TimeAgo from 'react-native-timeago';
import Firebase from 'firebase';
import ComposeComment from './post/ComposeComment.js';
import SocialBtns from './SocialBtns.js'

export default class CommentsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: [],
      replyModalVisible: {},
    };
    // this.props.root;
    // this.props.modalVisible;
    // this.props.renderParent;
    // this.props.closeModal
    // this.props.contentType;
    // this.props.contentID;
    // this.props.parentAuthor;
    this.user = this.props.user;
    this.uID = this.props.uID;
    this.FitlyFirebase = this.props.FitlyFirebase;
    this.msgRef = this.FitlyFirebase.database().ref('messages');
    this.commentRef = this.props.commentRef
    this.user = this.props.user;
    this.uID = this.props.uID;
  }

  componentDidMount() {
    this._turnOnCommentListener();
  }

  componentWillUnmount() {
    this._turnOffCommentListener();
  };

  _turnOnCommentListener() {
    const handleNewComment = (msgKey) => {
      this.msgRef.child(msgKey).once('value')
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
        this.msgRef.child(msgKey).once('value')
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

  _turnOffCommentListener() {
    turnOffCommentListener(this.commentRef);
  };

  _toggleMsgLike(index, comment) {
    const msgRef = this.msgRef.child(comment.key);
    (async () => {
      try {
        if (comment.likeMembers && comment.likeMembers[this.uID]) {
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
        let updatedMsg = await msgRef.once('value');
        let updateObj = updatedMsg.val();
        updateObj.key = updatedMsg.key;
        let commentsCopy = this.state.comments.slice();
        commentsCopy[index] = updateObj;
        this.setState({comments: commentsCopy});
      } catch(error) {
        console.log(error);
      }
    })();
  }
  _goToProfile(id) {
    if (id === this.uID) {
      this.props.navigation.push({key: "Profile@"}, {general: true});
    } else {
      this.props.navigation.push({
        key: "ProfileEntry@" + id,
        passProps: {
          otherUID: id,
        }
      },
      {
        general: true
      })
    }
  };

  _renderAuthor(content) {
    return <TouchableOpacity onPress={() => this._goToProfile(content.author)} style={feedEntryStyle.profileRow}>
      <Image source={(content.authorPicture) ? {uri:content.authorPicture} : require('../../img/default-user-image.png')}
      style={feedEntryStyle.profileImg} defaultSource={require('../../img/default-user-image.png')}/>
      <Text style={feedEntryStyle.username}>{content.authorName}</Text>
    </TouchableOpacity>
  };

  _renderSocialBtns(comment, index) {
    return (
      <SocialBtns
        content={comment}
        likeState={(comment.likeMembers) ? comment.likeMembers[this.uID] : false}
        sharedState={(comment.sharedMembers) ? comment.sharedMembers[this.uID] : false}
        saveState={(comment.savedMembers) ? comment.savedMembers[this.uID] : false}
        toggleLike={() => this._toggleMsgLike(index, comment)}
        onShare={() => this._sharePost(index, comment.key)}
        onSave={() => this._savePost(index, comment.key)}
        onComment={() => this._onComment(comment)}
      />
    )
  };

  _renderCommentModalforParent(authorID) {
    return (
      <Modal
        animationType={"fade"}
        transparent={false}
        visible={this.props.modalVisible}
        onRequestClose={() => this.props.closeModal()}>
        <ComposeComment
          contentID={this.props.contentID}
          contentType={this.props.contentType}
          contentAuthor={authorID}
          renderParent={() => this.props.renderParent()}
          renderComments={() => this._renderComments(this.state.comments)}
          closeModal={this.props.closeModal}
        />
      </Modal>
    )
  };

  _renderParent(comment, index) {
    return (
      <View>
        {this._renderAuthor(comment)}
        {(comment.photo)
          ? <TouchableOpacity style={feedEntryStyle.imagesTouchable} onPress={() => console.log('redirect to photo view with photokey ', photo.key)}>
              <Image style={feedEntryStyle.images} source={{uri: comment.photo.link}} style={feedEntryStyle.images} defaultSource={require('../../img/default-photo-image.png')}/>
            </TouchableOpacity>
          : <Text style={postStyle.content}>{comment.content}</Text>
        }
        {this._renderSocialBtns(comment, index)}
      </View>
    )
  };

  _renderCommentModal(comment, index) {
    return (
      <Modal
        animationType={"fade"}
        transparent={false}
        visible={this.state.replyModalVisible[comment.key]}
        onRequestClose={() => {
          let modalVisibleCopy = Object.assign({}, this.state.replyModalVisible);
          modalVisibleCopy[comment.key] = false;
          this.setState({replyModalVisible: false})
        }}>
        <ComposeComment
          contentID={comment.key}
          contentType='message'
          contentAuthor={comment.author}
          renderParent={() => this._renderParent(comment, index)}
          renderComments={() => {
            return (
              <CommentsView
                commentRef={this.FitlyFirebase.database().ref('messages/' + comment.key + '/replies')}
                FitlyFirebase={this.props.FitlyFirebase}
                uID={this.props.uID}
                user={this.props.user}
                navigation={this.props.navigation}
              />
            )
          }}
          closeModal={() => {
            let modalVisibleCopy = Object.assign({}, this.state.replyModalVisible);
            modalVisibleCopy[comment.key] = false;
            this.setState({replyModalVisible: modalVisibleCopy});
          }}
        />
      </Modal>
    );
  }

  _onComment(comment) {
    let modalVisibleCopy = Object.assign({}, this.state.replyModalVisible);
    modalVisibleCopy[comment.key] = true;
    this.setState({replyModalVisible: modalVisibleCopy});
  }


  _renderComments(comments) {
    return comments.map((comment, index) => {
      //initialize modal state
      if (comment) {
        // let modalVisibleCopy = Object.assign({}, this.state.replyModalVisible);
        // modalVisibleCopy[comment.key] = false;
        return <View key={comment.key + index}>
          {this._renderAuthor(comment)}
          <TimeAgo style={feedEntryStyle.timestamp} time={comment.createdAt}/>
          <View style={postStyle.postContent}>
            {(comment.photo)
              ? <TouchableOpacity style={feedEntryStyle.imagesTouchable} onPress={() => console.log('redirect to photo view with photokey ', photo.key)}>
                  <Image style={feedEntryStyle.images} source={{uri: photo.link}} style={feedEntryStyle.images} defaultSource={require('../../img/default-photo-image.png')}/>
                </TouchableOpacity>
              : <Text style={postStyle.content}>{comment.content}</Text>
            }
            {this._renderSocialBtns(comment, index)}
            {(this.state.replyModalVisible[comment.key]) ? this._renderCommentModal(comment, index) : null}
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
    if (this.props.root) {
      return (
        <View>
          {this._renderComments(this.state.comments)}
          {this._renderCommentModalforParent(this.props.parentAuthor)}
        </View>
      );
    } else {
      return(
        <View>
          {this._renderComments(this.state.comments)}
        </View>
      );
    }
  }
};
