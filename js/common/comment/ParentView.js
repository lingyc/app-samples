import React, {Component} from 'react';
import { postStyle, feedEntryStyle } from '../../styles/styles.js';
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { push } from '../../actions/navigation.js';
import TimeAgo from 'react-native-timeago';
import SocialBtns from '../SocialBtns.js'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Author from '../Author.js';
import {convertFBObjToArray} from '../../library/firebaseHelpers.js'

class ParentView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: null,
      like: false,
      shared: false,
      saved: false,
    };

    this.uID = this.props.uID;
    this.database = this.props.FitlyFirebase.database();
  }

  componentDidMount() {
    this._getContent();
  }

  _getContent() {
    const {contentType, contentID} = this.props.route;
    this.contentRef = this.database.ref(contentType + 's').child(contentID);
    this.contentRef.once('value').then(snap => {
      let contentObj = snap.val();
      contentObj.photos = convertFBObjToArray(snap.child('photos'));
      contentObj.tags = Object.keys(contentObj.tags || {});
      this.setState({
        content: contentObj,
      })
    });
  };

  _renderPhotos(content) {
    const route = {
      contentID: content.photos.key,
      contentType: 'photo',
      authorName: content.author
    };
    return (
      <View style={postStyle.imgContainer}>
        {content.photos.map((photo, index) => {
          return (
            <TouchableOpacity style={postStyle.imagesTouchable}  key={'postPhotos' + index}
              onPress={() => this.props.pushRoute(route)}>
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

  _renderPost(content) {
    return (
      <View style={{borderBottomWidth: .5, borderColor: '#ccc'}}>
        <Author content={content} nonClickable={true}/>
        <TimeAgo style={feedEntryStyle.timestamp} time={content.createdAt}/>
        <View style={postStyle.postContent}>
          <Text style={postStyle.title}>{content.title}</Text>
          <Text style={postStyle.textContent}>{content.content}</Text>
          {this._renderPhotos(content)}
          {this._renderTags(content.tags)}
          <SocialBtns
            contentInfo={this.props.route}
            content={this.state.content}
            buttons={{like: true, share: true, save: true}}
          />
        </View>
      </View>
    )
  };

  _renderMsg(content) {
    return (
      <View>
        <Author content={content} nonClickable={true}/>
        <TimeAgo style={feedEntryStyle.timestamp} time={content.createdAt}/>
        {(content.photo)
          ? <Image style={feedEntryStyle.images} source={{uri: content.photo.link}} style={feedEntryStyle.images} defaultSource={require('../../../img/default-photo-image.png')}/>
          : <Text style={postStyle.content}>{content.content}</Text>
        }
        <SocialBtns
          contentInfo={this.props.route}
          content={this.state.content}
          buttons={{like: true, share: true, save: true}}
        />
      </View>
    );
  }

  _renderPhoto(content) {
    return (
      <View>
        <Author style={{marginLeft: 15}} content={content} nonClickable={true}/>
        <TimeAgo style={[feedEntryStyle.timestamp, {right: 15}]} time={content.createdAt}/>
        <Image style={feedEntryStyle.images} source={{uri: content.link}} style={feedEntryStyle.images} defaultSource={require('../../../img/default-photo-image.png')}/>
        <Text style={postStyle.content}>{content.description}</Text>
        {this._renderTags(content.tags)}
        <SocialBtns
          contentInfo={this.props.route}
          content={this.state.content}
          buttons={{like: true, share: true, save: true}}
        />
      </View>
    );
  }

  render() {
    const {contentType, contentID} = this.props.route;
    const {content} = this.state;
    if (!content) {
      return <ActivityIndicator animating={true} style={{height: 80}} size="small"/>
    } else if (contentType === 'post') {
      return this._renderPost(content);
    } else if (contentType === 'message') {
      return this._renderMsg(content);
    } else if (contentType === 'photo') {
      return this._renderPhoto(content);
    }
  }
};


const mapStateToProps = function(state) {
  return {
    uID: state.auth.uID,
    FitlyFirebase: state.app.FitlyFirebase
  };
};

const mapDispatchToProps = function(dispatch) {
  return {
    navigation: bindActionCreators({ push }, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ParentView);
