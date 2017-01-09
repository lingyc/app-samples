import React, {Component} from 'react';
import { postStyle, feedEntryStyle, composeStyle, headerStyle } from '../../styles/styles.js';
import { Modal, View, TextInput, Text, StatusBar, ScrollView, Image, KeyboardAvoidingView, TouchableOpacity, ActivityIndicator } from 'react-native';
// import AutoExpandingTextInput from '../../common/AutoExpandingTextInput.js';
import Icon from 'react-native-vector-icons/Ionicons';
import { push, pop, resetTo } from '../../actions/navigation.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {convertFBObjToArray, saveUpdateToDB, turnOnCommentListener, turnOffCommentListener} from '../../library/firebaseHelpers.js'
import TimeAgo from 'react-native-timeago';
import Firebase from 'firebase';
import CommentsModal from '../comment/CommentsModal.js';
import SocialBtns from '../SocialBtns.js';

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
      modalVisible: false,
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
  }

  componentWillUnmount() {
    this._turnOffPostListener();
  };

  _turnOnPostListener() {
    const handlePostUpdates = (postSnap) => {
      let postObj = postSnap.val();
      if (!postObj) { return; }
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

  _renderSocialBtns() {
    const contentInfo = {
      contentID: this.props.postID,
      contentType: 'post',
      parentAuthor: this.state.post.author
    };
    return (
      <SocialBtns
        contentInfo={contentInfo}
        content={this.state.post}
        buttons={{comment: true, like: true, share: true, save: true}}
        onComment={() => this.setState({modalVisible: true})}
      />
    )
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

  _renderPost() {
    const initialRoute = {
      contentID: this.props.postID,
      contentType: 'post',
      parentAuthor: this.state.post.author
    };
    return <View style={postStyle.postContainer}>
      {this._renderPostBody()}
      {this._renderSocialBtns()}
      <CommentsModal
        modalVisible={this.state.modalVisible}
        renderParent={() => this._renderPostBody()}
        closeModal={() => this.setState({modalVisible: false})}
        initialRoute={initialRoute}
      />
    </View>
  };

  render() {
    if (this.state.loading) {
      return <ActivityIndicator animating={this.state.loading} style={{height: 80}} size="large"/>
    } else {
      return <ScrollView keyboardDismissMode="on-drag" style={{backgroundColor: 'white'}} contentContainerStyle={postStyle.scrollContentContainer}>
        {(this.state.postLoading)
          ? <ActivityIndicator animating={this.state.postLoading} style={{height: 80}} size="large"/>
          : this._renderPost()
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
