import React, {Component} from 'react';
import { composeStyle, headerStyle } from '../../styles/styles.js';
import { Modal, View, TextInput, Text, StatusBar, ScrollView, Image, KeyboardAvoidingView, TouchableOpacity, ActivityIndicator } from 'react-native';
// import AutoExpandingTextInput from '../../common/AutoExpandingTextInput.js';
import { postStyle, feedEntryStyle } from '../../styles/styles.js';
import Icon from 'react-native-vector-icons/Ionicons';
import { push, pop, resetTo } from '../../actions/navigation.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {convertFBObjToArray, saveUpdateToDB} from '../../library/firebaseHelpers.js'
import TimeAgo from 'react-native-timeago';
import Firebase from 'firebase';

class PostView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: '',
      post: null,
      postLoading: true,
      commentLoading: true,
      comments: [],
      like: null,
      shared: null,
      saved: null,
    }
    this.FitlyFirebase = this.props.FitlyFirebase;
    this.database = this.FitlyFirebase.database();
    this.uID = this.props.uID;
    this.user = this.props.user;
    this.hasSentLike = false;
  };

  componentDidMount() {
    this._turnOnPostListener();
    this._turnOnLikeListener();
    this.database.ref('userShared/' + this.uID + '/' + this.props.postID).on('value', (snap) => this.setState({shared: snap.val()}));
    this.database.ref('userCollections/' + this.uID + '/' + this.props.postID).on('value', (snap) => this.setState({saved: snap.val()}));
    //turn on listener for the replies
  }

  componentWillUnMount() {
    console.log('unmounting postView');
    this._turnOffPostListener();
    this._turnOffLikeListener();
    this.database.ref('userShared/' + this.uID + '/' + this.props.postID).off('value');
    this.database.ref('userCollections/' + this.uID + '/' + this.props.postID).off('value');
    //turn off listener for the replies
  }

  _turnOnPostListener() {
    const handlePostUpdates = (postSnap) => {
      let postObj = postSnap.val();
      postObj.photos = convertFBObjToArray(postSnap.child('photos'));
      postObj.tags = Object.keys(postObj.tags);
      this.setState({
        post: postObj,
        postLoading: false,
      })
    };
    this.database.ref('posts/' + this.props.postID).on('value',handlePostUpdates);
  };

  _turnOffPostListener() {
    this.database.ref('posts/' + this.props.postID).off('value');
  };

  _turnOnLikeListener() {
    this.database.ref('postLikes/' + this.props.postID + '/' + this.uID)
    .on('value', (snap) => {
      this.setState({like: snap.val()});
    });
  };

  _turnOffLikeListener() {
    this.database.ref('postsLikes/' + this.props.postID + '/' + this.uID).off('value');
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
          this.database.ref('/posts/' + this.props.postID + '/likeCount').transaction(currentLikeCount => currentLikeCount + 1);
          this.database.ref('postLikes/' + this.props.postID + '/' + this.uID).set(true);
          this.database.ref('userLikes/' + this.uID + '/' + this.props.postID).set(updateObj);
        } else {
          this.database.ref('/posts/' + this.props.postID + '/likeCount').transaction(currentLikeCount => currentLikeCount - 1);
          this.database.ref('postLikes/' + this.props.postID + '/' + this.uID).set(null);
          this.database.ref('userLikes/' + this.uID + '/' + this.props.postID).set(null);
        }
      } catch(error) {
        console.log('toggleLike error ', error);
      }
    })();
  };

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
              photos: this.state.post.photos,
              timestamp: Firebase.database.ServerValue.TIMESTAMP
            };
            this.database.ref('userShared/' + this.uID + '/' + this.props.postID).set(true);
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
          this.database.ref('/userCollections/' + this.uID + '/' + this.props.postID).set(newCollection);
        }
      } catch(error) {
        conosle.log('save post', error);
      }
    })();
  };

  _renderInputBar() {
    //this will render the input box that always sticks to the bottom
  };

  _renderPostBody() {
    //like, share, save
    const iconSize = 20;
    const iconColor = 'grey';
    const {post} = this.state;
    return <View style={postStyle.postContainer}>
      <TouchableOpacity onPress={() => this.props.navigation.push({
        key: "ProfileEntry",
        passProps: {
          otherUID: post.author,
        }
      })} style={feedEntryStyle.profileRow}>
        <Image source={(post.authorPicture) ? {uri:post.authorPicture} : require('../../../img/default-user-image.png')}
        style={feedEntryStyle.profileImg} defaultSource={require('../../../img/default-user-image.png')}/>
        <Text style={feedEntryStyle.username}>{post.authorName}</Text>
      </TouchableOpacity>
      <TimeAgo style={feedEntryStyle.timestamp} time={post.createdAt}/>
      <View style={postStyle.postContent}>
        <Text style={postStyle.title}>{post.title}</Text>
        <Text style={postStyle.textContent}>{post.content}</Text>
        {this._renderPhotos(post.photos)}
        {this._renderTags(post.tags)}
      </View>
      <View style={postStyle.socialBtns}>
        <TouchableOpacity style={postStyle.socialIcon} onPress={() => this._toggleLike()}>
          {(this.state.like)
            ? <Icon name="ios-heart" size={iconSize} color={iconColor}/>
            : <Icon name="ios-heart-outline" size={iconSize} color={iconColor}/>
          }
          <Text style={postStyle.iconText}>{post.likeCount} likes</Text>
        </TouchableOpacity>
        {(this.state.shared)
          ? <View style={postStyle.socialIcon}>
            <Icon name="ios-share" size={iconSize} color={iconColor}/>
            <Text style={postStyle.iconText}>shared</Text>
          </View>
          : <TouchableOpacity style={postStyle.socialIcon} onPress={() => this._sharePost()}>
            <Icon name="ios-share-outline" size={iconSize} color={iconColor}/>
          </TouchableOpacity>
        }
        {(this.state.saved)
          ? <View style={postStyle.socialIcon}>
            <Icon name="ios-bookmark" size={iconSize} color={iconColor}/>
            <Text style={postStyle.iconText}>saved</Text>
          </View>
          : <TouchableOpacity style={postStyle.socialIcon} onPress={() => this._savePost()}>
            <Icon name="ios-bookmark-outline" size={iconSize} color={iconColor}/>
          </TouchableOpacity>
        }
      </View>
    </View>
  }

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
  }

  _renderTags(tags) {
    return <View style={postStyle.tagsRow}>
      {tags.map((tag, index) => {
        return (
          <Text style={postStyle.tags} key={'tag' + index}>#{tag}</Text>
        );
      })}
    </View>
  }

  _renderComments() {

  }

  render() {
    if (this.state.loading) {
      return <ActivityIndicator animating={this.state.loading} style={{height: 80}} size="large"/>
    } else {
      return <ScrollView keyboardDismissMode="on-drag" style={{backgroundColor: 'white'}} contentContainerStyle={postStyle.scrollContentContainer}>
        {(this.state.postLoading)
          ? <ActivityIndicator animating={this.state.postLoading} style={{height: 80}} size="large"/>
          : this._renderPostBody()
        }
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
    FitlyFirebase: state.app.FitlyFirebase
  };
};

const mapDispatchToProps = function(dispatch) {
  return {
    navigation: bindActionCreators({ push, pop, resetTo }, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PostView);