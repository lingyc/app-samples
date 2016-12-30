import React, { Component } from 'react';
import { composeStyle, headerStyle } from '../../styles/styles.js';
import { View, Text, ScrollView, Image, TouchableHighlight, TouchableOpacity, ActivityIndicator } from 'react-native';
import { push, pop, resetTo } from '../../actions/navigation.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Icon from 'react-native-vector-icons/Ionicons';

class MakePost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category: "Workout Plan",
      loading: false,
      category: null,
      title: '',
      content: '',
      tags: null,
      photos: [],
      photoRefs: null,
    }
    this.FitlyFirebase = this.props.FitlyFirebase;
  }

  _saveInputsToState(field, value) {
    this.setState({
      [field]: value
    });
  }

  _savePhotosToDB() {
    // return this.state.photos.reduce((photoRefs, photolink) => {
    //   let photoObj = {
    //     link: photoLink
    //   };
    //
    //   this.FitlyFirebase.database().ref('/photos/').push({
    //
    //   })
    // }, {})
  }

  _renderCategories(categories) {
    return categories.map((category, index) => {
      let containerStyle = composeStyle.category;
      let textStyle = composeStyle.categoryText;
      //this function runs before state is initialized, hence we have force the first element to be highlighted at the start
      if (!this.state.category && index === 0 || this.state.category === category) {
        containerStyle = [composeStyle.category, {backgroundColor: '#1D2F7B'}];
        textStyle = [composeStyle.categoryText, {color: 'white'}];
      }

      return (
        <TouchableHighlight style={containerStyle} key={index} onPress={() => this._saveInputsToState("category", category)}>
          <Text style={textStyle}>{category}</Text>
        </TouchableHighlight>
      );
    });
  }

  //refactor this out as a reusable component
  _renderFakeHeader() {
    return (
      <View style={headerStyle.fakeHeader}>
        <TouchableOpacity style={[headerStyle.closeBtn, {position: 'absolute', left: 0, top: 20}]} onPress={() => this.props.navigation.pop({global: true})}>
          <Icon name="ios-close" size={50} color="white"/>
        </TouchableOpacity>
        <View style={headerStyle.container}>
          <Text style={headerStyle.titleText}>
            Choose a Category
          </Text>
        </View>
        <TouchableOpacity style={{position: "absolute", right: 20, top: 40}} onPress={
          () => this.props.navigation.push({key: 'CompostPost', global: true,
            passProps:{_saveInputsToState: this._saveInputsToState.bind(this)}
          })}>
          <Text style={headerStyle.text}>Next</Text>
        </TouchableOpacity>
      </View>
    );
  }

  //after post creation, push navigator to the post that was just created
  render() {
    if (this.state.loading) {
      return (
        <View style={composeStyle.container}>
          {this._renderFakeHeader()}
          <ActivityIndicator animating={this.state.loading} style={{height: 30}} size="small"/>
        </View>
      );
    } else {
      //select the category
      return (
        <View style={composeStyle.container}>
          {this._renderFakeHeader()}
          {this._renderCategories(['Workout Plan', 'Meal Plan', 'Photos', 'Others'])}
        </View>
      );
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
    navigation: bindActionCreators({ push, pop, resetTo }, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MakePost);
