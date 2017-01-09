import React, {Component} from 'react';
import { postStyle, feedEntryStyle } from '../../styles/styles.js';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { push } from '../../actions/navigation.js';
import TimeAgo from 'react-native-timeago';
import SocialBtns from '../SocialBtns.js'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

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
    this.FitlyFirebase = this.props.FitlyFirebase;
  }

  componentDidMount() {
    this._getContent();
  }

  _getContent() {
    const {contentType, contentID} = this.props.route;
    if (contentType === 'message') {
      this.contentRef = this.FitlyFirebase.database().ref('messages').child(contentID);
    } else if (contentType === 'photo') {
      this.contentRef = this.FitlyFirebase.database().ref('photos').child(contentID);
    }

    this.contentRef.once('value').then(snap => this.setState({content: snap.val()}));
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

  render() {
    const {content} = this.state;
    return (
      <View>
        {this._renderAuthor(content)}
        <TimeAgo style={feedEntryStyle.timestamp} time={content.createdAt}/>
        {(content.photo)
          ? <TouchableOpacity style={feedEntryStyle.imagesTouchable} onPress={() => console.log('redirect to photo view with photokey ', photo.key)}>
              <Image style={feedEntryStyle.images} source={{uri: content.photo.link}} style={feedEntryStyle.images} defaultSource={require('../../../img/default-photo-image.png')}/>
            </TouchableOpacity>
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
