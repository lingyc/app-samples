import React, {Component} from 'react';
import { composeStyle, headerStyle } from '../../styles/styles.js';
import { Modal, View, TextInput, Text, StatusBar, ScrollView, Image, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView } from 'react-native';
import AutoExpandingTextInput from '../../common/AutoExpandingTextInput.js';
import Icon from 'react-native-vector-icons/Ionicons';
import TagInput from 'react-native-tag-input';
const hashTagRegex = (/^\w+$/g);

class ImageEditModal extends Component {
  constructor(props) {
    super(props);

    this.props.visible;
    this.props.onRequestClose;
    this.props.getImageFromLib;
    this.props.getImageFromCam;
    this.props.onRemoveImage;
    this.props.onCaptionChange;
    this.props.onTagChange;
  }
  _renderFullSizeImgs(draftState) {
    return draftState.photos.map((photo, index) => {
      return (
        <View key={index} style={composeStyle.imgLarge}>
          <TouchableOpacity style={composeStyle.closeBtn} onPress={() => this._removeImg(index)}>
            <Icon name="ios-close-outline" size={50} color='rgba(255,255,255,.7)'/>
          </TouchableOpacity>
          <Image style={{width: null, height: 400}} source={{uri: photo.path, isStatic:true}}/>
          <AutoExpandingTextInput
            clearButtonMode="always"
            onChangeText={(text) => {
              let newPhotos = draftState.photos.slice();
              newPhotos[index].description = text;
              this.setDraftState({photos: newPhotos});
            }}
            style={[composeStyle.input, {fontSize: 16}]}
            multiline={true}
            value={(photo.description) ? photo.description : ''}
            placeholder="caption"
            placeholderTextColor="grey"
          />
          <View style={[composeStyle.hashTagInput, {borderWidth: 0}]}>
            <Text style={composeStyle.hashTag}>#</Text>
            <TagInput
              value={(photo.tags) ? photo.tags : []}
              onChange={(tags) => {
                let newPhotos = draftState.photos.slice();
                newPhotos[index].tags = tags;
                this.setDraftState({photos: newPhotos})
              }}
              regex={hashTagRegex}
            />
          </View>
        </View>
      );
    });
  };


  render() {
    return (
      <Modal
        animationType={"slide"}
        transparent={false}
        visible={this.state.modalVisible}
        onRequestClose={() => this.setState({modalVisible: false})}>
        <KeyboardAvoidingView behavior="position" style={{flex: 0}}>
          <Text style={{marginTop: 30, marginRight:20, marginBottom:15, fontSize: 20, alignSelf:'flex-end', color:'#1D2F7B'}} onPress={() => this.setState({modalVisible: false, contentType:'light-content'})}>back</Text>
          <ScrollView keyboardDismissMode="on-drag" contentContainerStyle={{flex: 0}}>
            {this._renderFullSizeImgs(draftState)}

            <View style={[composeStyle.photosSection, {paddingTop: 15, paddingBottom: 15}]}>
              <TouchableOpacity style={composeStyle.photoThumbnail} onPress={() => this._getImageFromLib()}>
                <Icon name="ios-image-outline" size={30} color="#bbb"/>
              </TouchableOpacity>
              <TouchableOpacity style={composeStyle.photoThumbnail} onPress={() => this._getImageFromCam()}>
                <Icon name="ios-camera-outline" size={30} color="#bbb"/>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    );
  };
}
export default ImageEditModal;
