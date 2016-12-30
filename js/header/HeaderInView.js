import React from 'react';
import { composeStyle, headerStyle } from '../styles/styles.js';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const HeaderInView = (props) => {
  const { leftElement, title, rightElement, _navigation, nextRoute } = props;
  let left, right, leftBtn, rightBtn;
  if (leftElement && leftElement.icon) {
    left = (<Icon name={leftElement.icon} size={50} color="white"/>);
  } else if (leftElement && leftElement.text) {
    left = (<Text style={headerStyle.text}>{leftElement.text}</Text>);
  }

  if (rightElement && rightElement.icon) {
    right = (<Icon name={rightElement.icon} size={50} color="white"/>);
  } else if (rightElement && rightElement.text) {
    right = (<Text style={headerStyle.text}>{rightElement.text}</Text>);
  }

  if (left) {
    leftBtn = (
      <TouchableOpacity style={[headerStyle.closeBtn, {position: 'absolute', left: 0, top: 20}]} onPress={() => _navigation.pop({global: true})}>
        {left}
      </TouchableOpacity>
    );
  }

  if (right) {
    rightBtn = (
      <TouchableOpacity style={{position: "absolute", right: 20, top: 40}} onPress={() => _navigation.push(nextRoute)}>
        {right}
      </TouchableOpacity>
    );
  }

  return (
    <View style={headerStyle.inlineHeader}>
      {leftBtn}
      <Text style={headerStyle.titleText}>
        {title}
      </Text>
      {rightBtn}
    </View>
  );
};

export default HeaderInView;
