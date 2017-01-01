import React, {Component} from 'react';
import { composeStyle, headerStyle } from '../../styles/styles.js';
import { Modal, View, TextInput, Text, StatusBar, ScrollView, Image, KeyboardAvoidingView, TouchableWithoutFeedback, TouchableHighlight, TouchableOpacity, ActivityIndicator } from 'react-native';
import AutoExpandingTextInput from '../../common/AutoExpandingTextInput.js';
import Icon from 'react-native-vector-icons/Ionicons';
import HeaderInView from '../../header/HeaderInView.js'
import { push, pop, resetTo } from '../../actions/navigation.js';
import { save, clear } from '../../actions/drafts.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImagePicker from 'react-native-image-crop-picker';

//TODO: input validation??

class ComposePost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      contentType: 'light-content'
    }
    this.draftsAction = this.props.draftsAction;
    this.setDraftState = this.props.draftsAction.save.bind(this, this.props.draftRef);
    this.clearState = this.props.draftsAction.clear.bind(this, this.props.draftRef);
    this.user = this.props.user;
  };


  _renderHeader() {
    let draftState = this.props.drafts[this.props.draftRef];
    return (
      <HeaderInView
        leftElement={{icon: "ios-arrow-round-back-outline"}}
        rightElement={{text: "Post"}}
        title={draftState.category}
        _onPressLeft={() => this.props.navigation.pop()}
      />
    );
  };

  _renderThumbnails(photos) {
    if (!photos) {
      return this._renderPhotoSection();
    }
    return photos.map((photo, index) => {
      return (
        <TouchableOpacity key={index} onPress={() => this.setState({modalVisible: true, contentType: 'default'})} style={composeStyle.photoThumbnail}>
          <Image style={{height: 100, width: 100}} source={{uri: photo.path, isStatic:true}}/>
        </TouchableOpacity>
      );
    })
  };

  _removeImg(index) {
    let draftState = this.props.drafts[this.props.draftRef];
    let newPhotos = draftState.photos.slice();
    newPhotos.splice(index, 1);
    this.setDraftState({photos: newPhotos});
  };

  _renderFullSizeImgs(photos) {
    return photos.map((photo, index) => {
      return (
        <View key={index} style={composeStyle.imgLarge}>
          <TouchableOpacity style={composeStyle.closeBtn} onPress={() => this._removeImg(index)}>
            <Icon name="ios-trash-outline" size={30} color="#bbb"/>
          </TouchableOpacity>
          <Image style={{height: 500, width: 500}} source={{uri: photo.path, isStatic:true}}/>
        </View>
      );
    })
  };

  _getImageFromCam() {
    let draftState = this.props.drafts[this.props.draftRef];
    ImagePicker.openCamera({
      compressImageQuality: .6
    }).then(image => {
      let newPhotos = draftState.photos;
      newPhotos.push(image);
      this.setDraftState({photos: newPhotos});
    }).catch(error => {
      console.log('image picker', error);
    });
  }

  _getImageFromLib() {
    let draftState = this.props.drafts[this.props.draftRef];
    ImagePicker.openPicker({
      multiple: true,
      compressImageQuality: .6
    }).then(images => {
      let newPhotos = draftState.photos.concat(images);
      this.setDraftState({photos: newPhotos});
    }).catch(error => {
      console.log('image picker', error);
    });
  }

  _renderImgModal(draftState) {
    return (
      <Modal
        animationType={"slide"}
        transparent={false}
        visible={this.state.modalVisible}
        onRequestClose={() => this.setState({modalVisible: false})}>
        <Text style={{marginTop: 40, marginRight:20, fontSize: 20, alignSelf:'flex-end'}} onPress={() => this.setState({modalVisible: false, contentType:'light-content'})}>back</Text>
        <ScrollView contentContainerStyle={{flex: 0}}>
          {this._renderFullSizeImgs(draftState.photos)}
        </ScrollView>
      </Modal>
    );
  }

  _renderPhotoSection(draftState) {
    return (
      <View style={composeStyle.photosSection}>
        {this._renderThumbnails(draftState.photos)}
        <TouchableOpacity style={composeStyle.photoThumbnail} onPress={() => this._getImageFromLib()}>
          <Icon name="ios-image-outline" size={30} color="#bbb"/>
        </TouchableOpacity>
        <TouchableOpacity style={composeStyle.photoThumbnail} onPress={() => this._getImageFromCam()}>
          <Icon name="ios-camera-outline" size={30} color="#bbb"/>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    let draftState = this.props.drafts[this.props.draftRef];
    return (
      <View style={{flex: 1, backgroundColor:"white"}}>
        <StatusBar barStyle={this.state.contentType}/>
        {this._renderImgModal(draftState)}
        {this._renderHeader()}
        <ScrollView keyboardDismissMode="on-drag" contentContainerStyle={composeStyle.scrollContentContainer}>
          <Image style={composeStyle.profilePic} source={(this.user.picture) ? {uri:this.user.picture} : require('../../../img/default-user-image.png')}
            defaultSource={require('../../../img/default-user-image.png')}/>
          <View style={composeStyle.inputBox}>
            <TextInput
              returnKeyType="next"
              maxLength={30}
              clearButtonMode="always"
              onChangeText={(text) => this.setDraftState({title: text})}
              style={[composeStyle.input, {fontWeight: "300"}]}
              value={draftState.title}
              placeholder="Title"
              placeholderTextColor="grey"
            />
          </View>
          <View style={[composeStyle.inputBox, {paddingBottom: 20}]}>
            <AutoExpandingTextInput
              returnKeyType="next"
              clearButtonMode="always"
              onChangeText={(text) => this.setDraftState({content: text})}
              style={[composeStyle.input, {fontSize: 16}]}
              multiline={true}
              value={draftState.content}
              placeholder="what's kicking?"
              placeholderTextColor="grey"
            />
          </View>
          {/* TODO: add photos */}
          {this._renderPhotoSection(draftState)}
          {/* <KeyboardAvoidingView behavior="position" style={loginStyles.KeyboardAvoidingContainer}>
          </KeyboardAvoidingView> */}
        </ScrollView>
      </View>
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
