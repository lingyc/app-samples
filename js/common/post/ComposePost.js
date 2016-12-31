import React, {Component} from 'react';
import { composeStyle, headerStyle } from '../../styles/styles.js';
import { View, TextInput, Text, ScrollView, Image, KeyboardAvoidingView, TouchableWithoutFeedback, TouchableHighlight, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import HeaderInView from '../../header/HeaderInView.js'
import { push, pop, resetTo } from '../../actions/navigation.js';
import { save, clear } from '../../actions/drafts.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

const dismissKeyboard = require('dismissKeyboard');

//TODO: input validation??

class ComposePost extends Component {
  constructor(props) {
    super(props);
    this.draftsAction = this.props.draftsAction;
    this.setDraftState = this.props.draftsAction.save.bind(this, this.props.draftRef);
    this.clearState = this.props.draftsAction.clear.bind(this, this.props.draftRef);
    this.user = this.props.user;
  }


  _renderHeader() {
    return (
      <HeaderInView
        leftElement={{icon: "ios-arrow-round-back-outline"}}
        title="Compose"
        _onPressLeft={() => this.props.navigation.pop()}
      />
    );
  };

  // if (this.state.loading) {
  //   return (
  //     <View style={{flex: 1}}>
  //       {this._renderHeader()}
  //       <View style={composeStyle.container}>
  //         <ActivityIndicator animating={this.state.loading} style={{height: 30}} size="small"/>
  //       </View>
  //     </View>
  //   );
  // } else {

  render() {
    return (
      <TouchableWithoutFeedback style={{flex: 1}} onPress={()=> dismissKeyboard()}>
        <View style={{flex: 1}}>
          {this._renderHeader()}
          <ScrollView contentContainerStyle={composeStyle.scrollContentContainer}>
            <Image style={composeStyle.profilePic} source={(this.user.picture) ? {uri:this.user.picture} : require('../../../img/default-user-image.png')}
              defaultSource={require('../../../img/default-user-image.png')}/>
            <View style={composeStyle.inputBox}>
              <TextInput
                returnKeyType="next"
                maxLength={30}
                clearButtonMode="always"
                onChangeText={(text) => this.setDraftState({title: text})}
                style={composeStyle.input}
                value={this.props.drafts[this.props.draftRef].title}
                placeholder="title optional"
                placeholderTextColor="grey"
              />
            </View>
            <View style={[composeStyle.inputBox, {height: 400}]}>
              <TextInput
                returnKeyType="next"
                clearButtonMode="always"
                onChangeText={(text) => this.setDraftState({content: text})}
                style={composeStyle.input}
                multiline={true}
                value={this.props.drafts[this.props.draftRef].content}
                placeholder="what's kicking?"
                placeholderTextColor="grey"
              />
            </View>
            {/* <KeyboardAvoidingView behavior="position" style={loginStyles.KeyboardAvoidingContainer}>
            </KeyboardAvoidingView> */}
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    );
  }
};

const mapStateToProps = function(state) {
  return {
    drafts: state.drafts.drafts,
    user: state.user.user,
    uID: state.auth.uID,
    FitlyFirebase: state.app.FitlyFirebase
  };
};

const mapDispatchToProps = function(dispatch) {
  return {
    navigation: bindActionCreators({ push, pop, resetTo }, dispatch),
    draftsAction: bindActionCreators({ save, clear }, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ComposePost);
