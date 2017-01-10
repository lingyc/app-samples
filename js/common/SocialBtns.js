import React, {Component} from 'react';
import { postStyle, feedEntryStyle, composeStyle, headerStyle } from '../styles/styles.js';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {saveUpdateToDB} from '../library/firebaseHelpers.js'
import Firebase from 'firebase';

class SocialBtns extends Component {
  constructor(props) {
    super(props);

    this.content = this.props.content;

    this.state = {
      like: null,
      likeCount: this.content.likeCount,
      share: null,
      shareCount: this.content.shareCount,
      save: null,
      saveCount: this.content.saveCount,
      replyCount: this.content.replyCount,
    };

    this.contentInfo = this.props.contentInfo;
    this.buttons = this.props.buttons;
    this.onComment = this.props.onComment;
    this.database = this.props.FitlyFirebase.database();
    this.user = this.props.user;
    this.uID = this.props.uID;

    const {contentType, contentID, parentAuthor} = this.contentInfo;
    this.userShareRef = this.database.ref('userShared/' + this.uID + '/' + contentID);
    this.userCollectionsRef = this.database.ref('userCollections/' + this.uID + '/' + contentID);
    this.userLikesRef = this.database.ref('userLikes/' + this.uID + '/' + contentID);

    this.contentRef = this.database.ref(contentType + 's').child(contentID);
    this.likeRef = this.database.ref(contentType + 'Likes').child(contentID);
    this.shareRef = this.database.ref(contentType + 'Shares').child(contentID);
    this.saveRef = this.database.ref(contentType + 'Saves').child(contentID);

    this.iconSize = 20;
    this.iconColor = 'grey';
    this.hasLiked = false;
    this._toggleLike = this._toggleLike.bind(this);
    this._handleShare = this._handleShare.bind(this);
    this._handleSave = this._handleSave.bind(this);
  };

  componentDidMount() {
    this._getInitialStates();
    this.contentRef.child('replyCount').on('value', countSnap => this.setState({replyCount: countSnap.val()}));
  };

  componentWillUnmount() {
    this.contentRef.child('replyCount').off('value');
  };

  _getInitialStates() {
    const stateTypes = [
      {ref: this.likeRef, type: 'like'},
      {ref: this.shareRef, type: 'share'},
      {ref: this.saveRef, type: 'save'}
    ].map(state => {
      const {type} = state;
      state.ref.child(this.uID).once('value').then(snap => {
        let listObj =  snap.val();
        this.setState({
          [type]: !!(listObj),
        })
      }).catch(error => {
        console.log('social buttons get initialstate error', error);
      });
    })
  };

  _createUpdate(updateType) {
    const updateObj = {
      type: updateType,
      contentType: this.contentInfo.contentType,
      contentID: this.contentInfo.contentID,
      ownerID: this.uID,
      ownerName: this.user.public.first_name + ' ' + this.user.public.last_name,
      ownerPicture: this.user.public.picture,
      timestamp: Firebase.database.ServerValue.TIMESTAMP
    };

    if (this.contentInfo.contentType === 'post') {
      updateObj.postCategory = this.content.category;
      updateObj.contentTitle = this.content.title;
      updateObj.photos = this.content.photos;
    } else if (this.contentInfo.contentType === 'message') {
      if (this.content.photos) {
        updateObj.photos = [{
          [this.content.photo.key]: {
            link: this.content.photo.link
          }
        }];
      }
    } else if (this.contentInfo.contentType === 'photo') {
      updateObj.link = this.content.link;
    }

    return updateObj;
  }

  _toggleLike() {
    (async () => {
      try {
        if (!this.state.like) {
          this.likeRef.child(this.uID).set(true);
          this.contentRef.child('likeCount').transaction(count => count + 1);

          if (!this.hasLiked) {
            const updateObj = this._createUpdate('like');
            saveUpdateToDB(updateObj, this.uID, {minor: true});
            this.userLikesRef.set(updateObj);
            this.hasSentLike = true;
          }
          this.setState({
            like: true,
            likeCount: this.state.likeCount + 1
          });
          //tables to update: userLikes, postLikes, userUpdatesAll(only once)
        } else {
          this.likeRef.child(this.uID).set(null);
          this.userLikesRef.set(null);
          this.contentRef.child('likeCount').transaction(count => count - 1);
          this.setState({
            like: false,
            likeCount: this.state.likeCount - 1
          });
        }
      } catch(error) {
        console.log('toggleLike error ', error);
      }
    })();
  };

  _handleShare() {
    // TODO: deeplinking
    //sent out a deeplink for the particular post to all contacts??
    //for now we will send out the feed to the follower
    (async () => {
        try {
          if (!this.state.share) {
            const updateObj = this._createUpdate('share');
            this.contentRef.child('shareCount').transaction(count => count + 1);
            this.shareRef.child(this.uID).set(true);
            saveUpdateToDB(updateObj, this.uID);
            this.setState({
              share: true,
              shareCount: this.state.shareCount + 1
            })
          } else {
            console.log('already shared the post');
          }
      } catch(error) {
        conosle.log('share post', error);
      }
    })();
  };

  _handleSave() {
    (async () => {
      try {
        if (!this.state.saved) {
          const newCollection = {
            contentType: this.contentInfo.contentType,
            contentID: this.contentInfo.contentID,
            timestamp: Firebase.database.ServerValue.TIMESTAMP
          };
          this.contentRef.child('saveCount').transaction(count => count + 1);
          this.userCollectionsRef.set(newCollection);
        }
        this.setState({
          save: true,
          saveCount: this.state.saveCount + 1
        })
      } catch(error) {
        conosle.log('save post', error);
      }
    })();
  };

  _renderCommentBtn() {
    if (this.buttons.comment) {
      const replyCount = this.state.replyCount;
      return (
        <TouchableOpacity style={[postStyle.socialIcon, {width: 55, alignSelf: 'flex-start'}]} onPress={() => this.props.onComment(this.contentInfo)}>
          <Icon name="ios-undo" size={this.iconSize} color={this.iconColor}/>
          <Text style={postStyle.iconText}>{(replyCount) ? replyCount : ''}{"\n"}comment</Text>
        </TouchableOpacity>
      );
    }
    return null;
  };

  _renderLikeBtn() {
    if (this.buttons.like) {
      const likeCount = this.state.likeCount;
      return (
        <TouchableOpacity style={postStyle.socialIcon} onPress={this._toggleLike}>
          {(this.state.like)
            ? <Icon name="ios-heart" size={this.iconSize} color={this.iconColor}/>
            : <Icon name="ios-heart-outline" size={this.iconSize} color={this.iconColor}/>
          }
          <Text style={postStyle.iconText}>{(likeCount) ? likeCount : ''}{"\n"}likes</Text>
        </TouchableOpacity>
      );
    }
    return null;
  };

  _renderShareBtn() {
    if (this.buttons.share) {
      const shareCount = this.state.shareCount;
      return (this.state.share)
        ? <View style={postStyle.socialIcon}>
          <Icon name="ios-share" size={this.iconSize} color={this.iconColor}/>
          <Text style={postStyle.iconText}>{(shareCount) ? shareCount : ''}{"\n"}shared</Text>
        </View>
        : <TouchableOpacity style={postStyle.socialIcon} onPress={this._handleShare}>
          <Icon name="ios-share-outline" size={this.iconSize} color={this.iconColor}/>
          <Text style={postStyle.iconText}>{(shareCount) ? shareCount : ''}{"\n"}shared</Text>
        </TouchableOpacity>
    }
    return null;
  };

  _renderSaveBtn() {
    if (this.buttons.save) {
      const saveCount = this.state.saveCount;
      return (this.state.save)
        ? <View style={postStyle.socialIcon}>
          <Icon name="ios-bookmark" size={this.iconSize} color={this.iconColor}/>
          <Text style={postStyle.iconText}>{(saveCount) ? saveCount : ''}{"\n"}saved</Text>
        </View>
        : <TouchableOpacity style={postStyle.socialIcon} onPress={this._handleSave}>
          <Icon name="ios-bookmark-outline" size={this.iconSize} color={this.iconColor}/>
          <Text style={postStyle.iconText}>{(saveCount) ? saveCount : ''}{"\n"}saved</Text>
        </TouchableOpacity>
    }
    return null;
  };

  render() {
    return <View style={postStyle.socialBtns}>
      {this._renderCommentBtn()}
      {this._renderLikeBtn()}
      {this._renderShareBtn()}
      {this._renderSaveBtn()}
    </View>
  };
};

const mapStateToProps = function(state) {
  return {
    user: state.user.user,
    uID: state.auth.uID,
    FitlyFirebase: state.app.FitlyFirebase
  };
};

export default connect(mapStateToProps)(SocialBtns);
