import React, {Component} from 'react';
import { postStyle, feedEntryStyle, composeStyle, headerStyle } from '../../styles/styles.js';
import { Modal, View, TextInput, Text, StatusBar, ScrollView, Image, KeyboardAvoidingView, TouchableOpacity, ActivityIndicator } from 'react-native';
// import AutoExpandingTextInput from '../../common/AutoExpandingTextInput.js';
import Icon from 'react-native-vector-icons/Ionicons';
import { push, pop, resetTo } from '../../actions/navigation.js';
import { save } from '../../actions/drafts.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {convertFBObjToArray, saveUpdateToDB, turnOnCommentListener, turnOffCommentListener} from '../../library/firebaseHelpers.js'
import TimeAgo from 'react-native-timeago';
import Firebase from 'firebase';
import ComposeComment from './ComposeComment.js';
import SocialBtns from '../SocialBtns.js'

class PostView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      post: null,
      postLoading: true,
      commentLoading: true,
      like: null,
      shared: null,
      saved: null,
      replyModalVisible: false,
    };
    this.FitlyFirebase = this.props.FitlyFirebase;
    this.database = this.FitlyFirebase.database();
    this.uID = this.props.uID;
    this.user = this.props.user;
    this.hasSentLike = false;

    this.postRef = this.database.ref('posts/' + this.props.postID);
    this.shareRef = this.database.ref('userShared/' + this.uID + '/' + this.props.postID);
    this.likeRef = this.database.ref('postLikes/' + this.props.postID + '/' + this.uID);
    this.postLikesRef = this.database.ref('postLikes/' + this.props.postID + '/' + this.uID)
    this.userCollectionsRef = this.database.ref('userCollections/' + this.uID + '/' + this.props.postID);
    this.userLikesRef = this.database.ref('userLikes/' + this.uID + '/' + this.props.postID);
    this.postCommentRef = this.database.ref('/postComments/' + this.props.postID);
  };

  componentDidMount() {
    this._turnOnPostListener();
    this._turnOnLikeListener();
    this.shareRef.on('value', (snap) => this.setState({shared: snap.val()}));
    this.userCollectionsRef.on('value', (snap) => this.setState({saved: snap.val()}));
    //turn on listener for the replies
  }

  componentWillUnmount() {
    this._turnOffPostListener();
    this._turnOffLikeListener();
    this.shareRef.off('value');
    this.userCollectionsRef.off('value');
    //turn off listener for the replies
  };

  _turnOnPostListener() {
    const handlePostUpdates = (postSnap) => {
      let postObj = postSnap.val();
      postObj.photos = convertFBObjToArray(postSnap.child('photos'));
      postObj.tags = Object.keys(postObj.tags || {});
      this.setState({
        post: postObj,
        postLoading: false,
      })
    };

    this.postRef.on('value', handlePostUpdates);
  };

  _turnOffPostListener() {
    this.postRef.off('value');
  };

  _turnOnLikeListener() {
    this.likeRef.on('value', (snap) => {
      this.setState({like: snap.val()});
    });
  };

  _turnOffLikeListener() {
    this.likeRef.off('value');
  };

  _toggleLike() {
    (async () => {
      try {
        if (!this.state.like) {
          const updateObj = {
            type: "like",
            contentType: 'post',
            contentID: this.props.postID,
            ownerID: this.uID,
            ownerName: this.user.public.first_name + ' ' + this.user.public.last_name,
            ownerPicture: this.user.public.picture,
            postCategory: this.state.post.category,
            contentTitle: this.state.post.title,
            photos: this.state.post.photos,
            timestamp: Firebase.database.ServerValue.TIMESTAMP
          };
          if (!this.hasSentLike) {
            saveUpdateToDB(updateObj, this.uID, {minor: true});
            this.hasSentLike = true;
          }
          //tables to update: userLikes, postLikes, userUpdatesAll(only once)
          this.postRef.child('likeCount').transaction(currentLikeCount => currentLikeCount + 1);
          this.postLikesRef.set(true);
          this.userLikesRef.set(updateObj);
        } else {
          this.postRef.child('likeCount').transaction(currentLikeCount => currentLikeCount - 1);
          this.postLikesRef.set(null);
          this.userLikesRef.set(null);
        }
      } catch(error) {
        console.log('toggleLike error ', error);
      }
    })();
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
  }

  _sharePost() {
    // TODO: deeplinking
    //sent out a deeplink for the particular post to all contacts??
    //for now we will send out the feed to the follower
    (async () => {
        try {
          if (!this.state.shared) {
            const updateObj = {
              type: "shared",
              contentType: 'post',
              contentID: this.props.postID,
              ownerID: this.uID,
              ownerName: this.user.public.first_name + ' ' + this.user.public.last_name,
              ownerPicture: this.user.public.picture,
              postCategory: this.state.post.category,
              contentTitle: this.state.post.title,
              contentSnipet: this.state.post.content,
              photos: this.state.post.photos,
              timestamp: Firebase.database.ServerValue.TIMESTAMP
            };
            this.shareRef.set(true);
            saveUpdateToDB(updateObj, this.uID);
          } else {
            console.log('you have already shared the post');
          }
      } catch(error) {
        conosle.log('share post', error);
      }
    })();
  };

  _savePost() {
    (async () => {
      try {
        if (!this.state.saved) {
          const newCollection = {
            contentType: 'post',
            contentID: this.props.postID,
            timestamp: Firebase.database.ServerValue.TIMESTAMP
          };
          this.userCollectionsRef.set(newCollection);
        }
      } catch(error) {
        conosle.log('save post', error);
      }
    })();
  };

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
      <Image source={(content.authorPicture) ? {uri:content.authorPicture} : require('../../../img/default-user-image.png')}
      style={feedEntryStyle.profileImg} defaultSource={require('../../../img/default-user-image.png')}/>
      <Text style={feedEntryStyle.username}>{content.authorName}</Text>
    </TouchableOpacity>
  };

  _renderPostBody() {
    const {post} = this.state;
    return (
      <View>
        {this._renderAuthor(post)}
        <TimeAgo style={feedEntryStyle.timestamp} time={post.createdAt}/>
        <View style={postStyle.postContent}>
          <Text style={postStyle.title}>{post.title}</Text>
          <Text style={postStyle.textContent}>{post.content}</Text>
          {this._renderPhotos(post.photos)}
          {this._renderTags(post.tags)}
        </View>
      </View>
    )
  };

  _renderSocialBtns() {
    return (
      <SocialBtns
        content={this.state.post}
        likeState={this.state.like}
        sharedState={this.state.shared}
        saveState={this.state.saved}
        toggleLike={this._toggleLike.bind(this)}
        onShare={this._sharePost.bind(this)}
        onSave={this._savePost.bind(this)}
        onComment={() => this.setState({replyModalVisible: true})}
      />
    )
  };

  _renderPost() {
    return <View style={postStyle.postContainer}>
      {this._renderPostBody()}
      {this._renderSocialBtns()}
    </View>
  };

  _renderPhotos(photos) {
    return (
      <View style={postStyle.imgContainer}>
        {photos.map((photo, index) => {
          return (
            <TouchableOpacity style={postStyle.imagesTouchable}  key={'postPhotos' + index} onPress={() => console.log('redirect to photo view with photokey ', photo.key)}>
              <Image style={postStyle.images} source={{uri: photo.link}} defaultSource={require('../../../img/default-photo-image.png')}/>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  _renderTags(tags) {
    return <View style={postStyle.tagsRow}>
      {tags.map((tag, index) => {
        return (
          <Text style={postStyle.tags} key={'tag' + index}>#{tag}</Text>
        );
      })}
    </View>
  };

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

  _renderCommentModal() {
    return (
      <Modal
        animationType={"fade"}
        transparent={false}
        visible={this.state.replyModalVisible}
        onRequestClose={() => this.setState({replyModalVisible: false})}>
        <ComposeComment
          postID={this.props.postID}
          post={this.state.post}
          renderPost={this._renderPostBody.bind(this)}
          renderComments={() => this._renderComments(this.state.comments)}
          closeModal={() => this.setState({replyModalVisible: false})}
        />
      </Modal>
    )
  }

  render() {
    if (this.state.loading) {
      return <ActivityIndicator animating={this.state.loading} style={{height: 80}} size="large"/>
    } else {
      return <ScrollView keyboardDismissMode="on-drag" style={{backgroundColor: 'white'}} contentContainerStyle={postStyle.scrollContentContainer}>
        {(this.state.postLoading)
          ? <ActivityIndicator animating={this.state.postLoading} style={{height: 80}} size="large"/>
          : this._renderPost()
        }
        {this._renderComments(this.state.comments)}
        {this._renderCommentModal()}
        <View style={{height: 100}}></View>
      </ScrollView>
    }
  };
}

PostView.propTypes = {
  postID: React.PropTypes.string
};

const mapStateToProps = function(state) {
  return {
    user: state.user.user,
    uID: state.auth.uID,
    drafts: state.drafts.drafts,
    FitlyFirebase: state.app.FitlyFirebase
  };
};

const mapDispatchToProps = function(dispatch) {
  return {
    navigation: bindActionCreators({ push, pop, resetTo }, dispatch),
    draftsAction: bindActionCreators({ save }, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PostView);
