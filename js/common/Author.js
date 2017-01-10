import React, {Component} from 'react';
import { postStyle, feedEntryStyle, composeStyle, headerStyle } from '../styles/styles.js';
import { Image, View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default Author = (props) => {
  const {content, pushToRoute, reversed, nonClickable} = props;

  const _goToProfile = (id) => {
    if (id === this.uID) {
      pushToRoute({key: "Profile@"}, {general: true});
    } else {
      pushToRoute({
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

  const Wrapper = (nonClickable) ? View : TouchableOpacity;
  return (reversed)
    ? <Wrapper onPress={() => _goToProfile(content.author)} style={feedEntryStyle.profileRow}>
        <Text style={feedEntryStyle.username}>{content.authorName}</Text>
        <Image source={(content.authorPicture) ? {uri:content.authorPicture} : require('../../img/default-user-image.png')}
        style={feedEntryStyle.profileImg} defaultSource={require('../../img/default-user-image.png')}/>
      </Wrapper>
    : <Wrapper onPress={() => _goToProfile(content.author)} style={feedEntryStyle.profileRow}>
        <Image source={(content.authorPicture) ? {uri:content.authorPicture} : require('../../img/default-user-image.png')}
        style={feedEntryStyle.profileImg} defaultSource={require('../../img/default-user-image.png')}/>
        <Text style={feedEntryStyle.username}>{content.authorName}</Text>
      </Wrapper>
}

Author.propTypes = {
  content: React.PropTypes.object,
  pushRoute: React.PropTypes.func,
};
