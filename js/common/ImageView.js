import React, {Component} from 'react';
import { postStyle, feedEntryStyle } from '../styles/styles.js';
import { ScrollView, Image, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
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

class ImageView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      photo: null,
      modalVisible: false,
    };

    this.FitlyFirebase = this.props.FitlyFirebase;
    this.database = this.FitlyFirebase.database();
    this.uID = this.props.uID;
    this.user = this.props.user;
    this.photoRef = this.database.ref('photos/' + this.props.photoID);
  };

  componentDidMount() {
    this._getPhoto();
  }

  _getPhoto() {
    this.photoRef.once('value', (photoSnap) => {
      let photoObj = photoSnap.val();
      if (!photoObj) { return; }
      photoObj.tags = Object.keys(photoObj.tags || {});
      this.setState({
        photo: photoObj,
      })
    });
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

  _renderPhoto() {
    const {photo} = this.state;
    const contentInfo = {
      contentID: this.props.photoID,
      contentType: 'photo',
      parentAuthor: photo.author
    };

    return (
      <View style={postStyle.postContainer}>
        <Author content={photo} pushToRoute={this.props.navigation.push}/>
        <TimeAgo style={feedEntryStyle.timestamp} time={photo.createdAt}/>
        <Image style={postStyle.fullWidthImage} source={{uri: photo.link}} defaultSource={require('../../img/default-photo-image.png')}/>
        <Text style={postStyle.content}>{photo.description}</Text>
        {this._renderTags(photo.tags)}
        <SocialBtns
          contentInfo={contentInfo}
          content={this.state.photo}
          buttons={{comment: true, like: true, share: true, save: true}}
          onComment={() => this.setState({modalVisible: true})}
        />
        <CommentsModal
          modalVisible={this.state.modalVisible}
          renderParent={() => this._renderPostBody()}
          openModal={() => this.setState({modalVisible: true})}
          closeModal={() => this.setState({modalVisible: false})}
          initialRoute={contentInfo}
        />
      </View>
    )
  }


  render() {
    return <ScrollView style={{backgroundColor: 'white'}} contentContainerStyle={postStyle.scrollContentContainer}>
      {(this.state.photo)
        ? this._renderPhoto()
        : <ActivityIndicator animating={this.state.postLoading} style={{height: 80}} size="large"/>
      }
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
