import React, {Component} from 'react';
import { postStyle, feedEntryStyle, composeStyle, headerStyle } from '../../styles/styles.js';
import { Modal, View, TextInput, Text, StatusBar, ScrollView, Image, KeyboardAvoidingView, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { push } from '../../actions/navigation.js';
import {saveUpdateToDB, turnOnCommentListener, turnOffCommentListener} from '../../library/firebaseHelpers.js'
import TimeAgo from 'react-native-timeago';
import SocialBtns from '../SocialBtns.js'
import Author from '../Author.js';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class CommentsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: [],
    };

    this.props.route;
    this.props.pushRoute;

    this.user = this.props.user;
    this.uID = this.props.uID;
    this.database = this.props.FitlyFirebase.database();
    this.msgRef = this.database.ref('messages');

    const {contentType, contentID} = this.props.route;
    if (contentType === 'post') {
      this.commentsRef = this.database.ref('postComments').child(contentID);
    } else if (contentType === 'message') {
      this.commentsRef = this.database.ref('messages').child(contentID).child('replies');
    } else if (contentType === 'photo') {
      this.commentsRef = this.database.ref('photos').child(contentID).child('replies');
    }

    this._onComment = this._onComment.bind(this);
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
    turnOnCommentListener(this.commentsRef, handleComments, handleNewComment);
  };

  _turnOffCommentListener() {
    turnOffCommentListener(this.commentsRef);
  };

  _onComment(route) {
    this.props.openModal && this.props.openModal();
    this.props.pushRoute(route);
  }

  _onPhotoPress(comment) {
    const route = {
      contentID: comment.photo.key,
      contentType: 'photo',
      authorName: comment.author
    };
    this._onComment(route);
  }

  _renderSocialBtns(content) {
    let contentInfo = {
      contentType: 'message',
      contentID: content.key,
      parentAuthor: content.author,
    };
    return (
      <SocialBtns
        contentInfo={contentInfo}
        buttons={{comment: true, like: true, share: true, save: true}}
        onComment={this._onComment}
        content={content}
      />
    )
  };

  render() {
    return (
      <View>
        {this.state.comments.map((comment, index) => {
          if (comment) {
            return (
              <View key={comment.key + index} style={{borderBottomWidth: .5, borderColor: '#ccc'}}>
                <Author content={comment} pushToRoute={this.props.navigation.push}/>
                <TimeAgo style={feedEntryStyle.timestamp} time={comment.createdAt}/>
                <View style={postStyle.postContent}>
                  {(comment.photo)
                    ? <TouchableOpacity style={feedEntryStyle.imagesTouchable} onPress={() => console.log('redirect to photo view with photokey ', comment.photo.key)}>
                        <Image style={feedEntryStyle.images} source={{uri: comment.photo.link}} style={feedEntryStyle.images} defaultSource={require('../../../img/default-photo-image.png')}/>
                      </TouchableOpacity>
                    : <Text style={postStyle.content}>{comment.content}</Text>}
                  {this._renderSocialBtns(comment)}
                </View>
              </View>
            )
          } else {
            return (
              <View key={comment.key + index}>
                <ActivityIndicator animating={true} style={{height: 80}} size="small"/>
              </View>
            )
          }
        })}
        <View style={{height: 100}}></View>
      </View>
    );
  }
};


const mapStateToProps = function(state) {
  return {
    user: state.user.user,
    uID: state.auth.uID,
    FitlyFirebase: state.app.FitlyFirebase
  };
};

const mapDispatchToProps = function(dispatch) {
  return {
    navigation: bindActionCreators({ push }, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CommentsView);
