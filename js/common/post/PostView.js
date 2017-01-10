import React, {Component} from 'react';
import { postStyle, feedEntryStyle, composeStyle, headerStyle } from '../../styles/styles.js';
import { Modal, View, TextInput, Text, StatusBar, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
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
import Author from '../Author.js';

class PostView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      post: null,
      commentLoading: true,
      modalVisible: false,
    };
    this.FitlyFirebase = this.props.FitlyFirebase;
    this.database = this.FitlyFirebase.database();
    this.uID = this.props.uID;
    this.user = this.props.user;
    this.postRef = this.database.ref('posts/' + this.props.postID);
  };

  componentDidMount() {
    this._turnOnPostListener();
  }

  _turnOnPostListener() {
    const handlePostUpdates = (postSnap) => {
      let postObj = postSnap.val();
      if (!postObj) { return; }
      postObj.photos = convertFBObjToArray(postSnap.child('photos'));
      postObj.tags = Object.keys(postObj.tags || {});
      this.setState({
        post: postObj,
      })
      this.postRef.off('value');
    };
    this.postRef.on('value', handlePostUpdates);
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
            <TouchableOpacity style={postStyle.imagesTouchable}  key={'postPhotos' + index}
              onPress={() => this.props.navigation.push({
                key: "ImageView@" + photo.key,
                passProps: {photoID: photo.key}
              },{general: true}
            )}>
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
      <View style={{borderBottomWidth: .5, borderColor: '#ccc'}}>
        <Author content={post} pushToRoute={this.props.navigation.push}/>
        <TimeAgo style={feedEntryStyle.timestamp} time={post.createdAt}/>
        <View style={postStyle.postContent}>
          <Text style={postStyle.title}>{post.title}</Text>
          <Text style={postStyle.textContent}>{post.content}</Text>
          {this._renderPhotos(post.photos)}
          {this._renderTags(post.tags)}
          {this._renderSocialBtns()}
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
      <CommentsModal
        modalVisible={this.state.modalVisible}
        openModal={() => this.setState({modalVisible: true})}
        closeModal={() => this.setState({modalVisible: false})}
        initialRoute={initialRoute}
      />
    </View>
  };

  render() {
    return <ScrollView style={{backgroundColor: 'white'}} contentContainerStyle={postStyle.scrollContentContainer}>
      {(this.state.post)
        ? this._renderPost()
        : <ActivityIndicator animating={true} style={{height: 80}} size="large"/>
      }
      <View style={{height: 100}}></View>
    </ScrollView>
  };
}

PostView.propTypes = {
  postID: React.PropTypes.string
};

const mapStateToProps = (state) => {
  return {
    user: state.user.user,
    uID: state.auth.uID,
    FitlyFirebase: state.app.FitlyFirebase
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    navigation: bindActionCreators({ push, pop, resetTo }, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PostView);
