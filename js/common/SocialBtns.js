import React, {Component} from 'react';
import { postStyle, feedEntryStyle, composeStyle, headerStyle } from '../styles/styles.js';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const SocialBtns = (props) => {
  const {content, likeState, sharedState, savedState} = props;
  const {onComment, toggleLike, onShare, onSave} = props;
  const iconSize = 20;
  const iconColor = 'grey';
  return <View style={postStyle.socialBtns}>
    <TouchableOpacity style={[postStyle.socialIcon, {width: 55, alignSelf: 'flex-start'}]} onPress={() => onComment()}>
      <Icon name="ios-undo" size={iconSize} color={iconColor}/>
      <Text style={postStyle.iconText}>{content.replyCount}{"\n"}comment</Text>
    </TouchableOpacity>
    <TouchableOpacity style={postStyle.socialIcon} onPress={toggleLike}>
      {(likeState)
        ? <Icon name="ios-heart" size={iconSize} color={iconColor}/>
        : <Icon name="ios-heart-outline" size={iconSize} color={iconColor}/>
      }
      <Text style={postStyle.iconText}>{content.likeCount}{"\n"}likes</Text>
    </TouchableOpacity>
    {(sharedState)
      ? <View style={postStyle.socialIcon}>
        <Icon name="ios-share" size={iconSize} color={iconColor}/>
        <Text style={postStyle.iconText}>{content.shareCount}{"\n"}shared</Text>
      </View>
      : <TouchableOpacity style={postStyle.socialIcon} onPress={onShare}>
        <Icon name="ios-share-outline" size={iconSize} color={iconColor}/>
        <Text style={postStyle.iconText}>{content.shareCount}{"\n"}shared</Text>
      </TouchableOpacity>
    }
    {(savedState)
      ? <View style={postStyle.socialIcon}>
        <Icon name="ios-bookmark" size={iconSize} color={iconColor}/>
        <Text style={postStyle.iconText}>{content.saveCount}{"\n"}saved</Text>
      </View>
      : <TouchableOpacity style={postStyle.socialIcon} onPress={onSave}>
        <Icon name="ios-bookmark-outline" size={iconSize} color={iconColor}/>
        <Text style={postStyle.iconText}>{content.saveCount}{"\n"}saved</Text>
      </TouchableOpacity>
    }
  </View>
};

export default SocialBtns;
