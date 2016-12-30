import React from 'react';
import { composeStyle, headerStyle } from '../../styles/styles.js';
import { View, TextInput, Text, ScrollView, Image, KeyboardAvoidingView, TouchableWithoutFeedback, TouchableHighlight, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import HeaderInView from '../../header/HeaderInView.js'
const dismissKeyboard = require('dismissKeyboard');

//TODO: input validation??

const ComposePost = (props) => {
  const {_saveInputsToState, _navigation, state, user} = props;

  // const _focusNextField = (nextField) => {
  //   this.refs[nextField].focus();
  // };

  const _renderHeader = () => {
    return (
      <HeaderInView
        leftElement={{icon: "ios-arrow-round-back-outline"}}
        title="Compose"
        _navigation={_navigation}
      />
    );
  };

  return (
    <TouchableWithoutFeedback style={{flex: 1}} onPress={()=> dismissKeyboard()}>
      <View style={{flex: 1}}>
        {_renderHeader()}
        <ScrollView contentContainerStyle={composeStyle.scrollContentContainer}>
          <Image source={(user.picture) ? {uri:user.picture} : require('../../../img/default-user-image.png')}
          style={{}} defaultSource={require('../../../img/default-user-image.png')}/>
          <TextInput
            returnKeyType="next"
            maxLength={30}
            clearButtonMode="always"
            // ref="1"
            // onSubmitEditing={() => _focusNextField('2')}
            onChangeText={(text) => _saveInputsToState({title: text})}
            style={composeStyle.input}
            value={state.title}
            placeholder="title optional"
            placeholderTextColor="grey"
          />
          <TextInput
            returnKeyType="next"
            clearButtonMode="always"
            // ref="2"
            onChangeText={(text) => _saveInputsToState({title: text})}
            style={composeStyle.input}
            value={state.title}
            placeholder="what's kicking?"
            placeholderTextColor="grey"
          />
          {/* <KeyboardAvoidingView behavior="position" style={loginStyles.KeyboardAvoidingContainer}>
          </KeyboardAvoidingView> */}
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ComposePost;
