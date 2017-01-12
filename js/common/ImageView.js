import React, {Component} from 'react';
import { postStyle, feedEntryStyle } from '../styles/styles.js';
import { ScrollView, Image, View, Text, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { push } from '../actions/navigation.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {saveUpdateToDB} from '../library/firebaseHelpers.js'
import Firebase from 'firebase';
import Author from './Author.js';
import CommentsModal from './comment/CommentsModal.js';
import SocialBtns from './SocialBtns.js'
import TimeAgo from 'react-native-timeago';
import FitImage from '../library/FitImage.js';

class ImageView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      photos: [],
      photoCommentModal: {}
    };

    this.FitlyFirebase = this.props.FitlyFirebase;
    this.database = this.FitlyFirebase.database();
    this.uID = this.props.uID;
    this.user = this.props.user;
    this.photoRef = this.database.ref('photos/');
    this.leftMargin = {marginLeft: 15};
  };

  componentDidMount() {
    this._getPhotos();
  }

  _getPhotos() {
    this.props.photos.forEach((photo, index) => {
      this.photoRef.child(photo.key).once('value', (photoSnap) => {
        let photoObj = photoSnap.val();
        if (!photoObj) { return; }
        photoObj.tags = Object.keys(photoObj.tags || {});
        photoObj.key = photo.key;
        let photosCopy = this.state.photos.slice()
        photosCopy[index] = photoObj;
        this.setState({
          photos: photosCopy,
        })
      });
    });
  };

  _renderTags(tags) {
    return <View style={[postStyle.tagsRow, this.leftMargin]}>
      {tags.map((tag, index) => {
        return (
          <Text style={postStyle.tags} key={'tag' + index}>#{tag}</Text>
        );
      })}
    </View>
  };

  _renderPhoto(photo, width, index) {
    const contentInfo = {
      contentID: photo.key,
      contentType: 'photo',
      parentAuthor: photo.author
    };

    const modalControl = (boolean) => {
      return () => {
        photoCommentModal = Object.assign({}, this.state.photoCommentModal)
        photoCommentModal[photo.key] = boolean;
        this.setState({photoCommentModal: photoCommentModal});
      }
    }
    return (
      <View key={'images' + index}>
        <FitImage
          indicatorSize="large"
          style={{width: width}}
          resizeMode='cover'
          source={{uri: photo.link}}
          />
        {(photo.description) ? <Text style={[postStyle.content, this.leftMargin]}>{photo.description}</Text> : null}
        {this._renderTags(photo.tags)}
        <SocialBtns
          contentInfo={contentInfo}
          content={photo}
          buttons={{comment: true, like: true, share: true, save: true}}
          onComment={modalControl(true).bind(this)}
        />
        <CommentsModal
          modalVisible={this.state.photoCommentModal[photo.key]}
          closeModal={modalControl(false).bind(this)}
          initialRoute={contentInfo}
          disableCommentOnStart={true}
        />
      </View>
    )
  };

  _renderPhotos() {
    const {photos} = this.state;
    const {width} = Dimensions.get('window');
    return (
      <View style={postStyle.postContainer}>
        {(photos[0])
          ?<View>
            <Author content={photos[0]} style={this.leftMargin} pushToRoute={this.props.navigation.push}/>
            <TimeAgo style={[feedEntryStyle.timestamp, {right: 15}]} time={photos[0].createdAt}/>
          </View>
         : null}
        {photos.map((photo, index) => {
          return (photo)
           ? this._renderPhoto(photo, width, index)
           : <ActivityIndicator animating={true} style={{height: 80}} size="large"/>
        })}
      </View>
    );
  };


  render() {
    return <ScrollView style={{backgroundColor: 'white'}} contentContainerStyle={postStyle.scrollContentContainer}>
      {this._renderPhotos()}
      <View style={{height: 100}}></View>
    </ScrollView>
  };
};

ImageView.propTypes = {
  photoID: React.PropTypes.string
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
    navigation: bindActionCreators({ push }, dispatch),
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(ImageView);
