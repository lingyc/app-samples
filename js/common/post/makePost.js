import React, { Component } from 'react';
import { composeStyle, headerStyle } from '../../styles/styles.js';
import { View, Text, ScrollView, Image, TouchableHighlight, TouchableOpacity, ActivityIndicator } from 'react-native';
import { push, pop, resetTo } from '../../actions/navigation.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import HeaderInView from '../../header/HeaderInView.js'
import Icon from 'react-native-vector-icons/Ionicons';

class MakePost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category: "Workout Plan",
      loading: false,
      title: '',
      content: '',
      tags: null,
      photos: [],
      photoRefs: null,
    }
    this.FitlyFirebase = this.props.FitlyFirebase;
  }

  _saveInputsToState(value) {
    this.setState({...value});
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
      if (this.state.category === category) {
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
  _renderHeader() {
    return (
      <HeaderInView
        leftElement={{icon: "ios-close"}}
        rightElement={{text: "Next"}}
        title="Choose a Post Category"
        _navigation={this.props.navigation}
        nextRoute={{
          key: 'ComposePost',
          global: true,
          passProps:{
            user: this.props.user.public,
            state: this.state,
            _saveInputsToState: this._saveInputsToState.bind(this),
            _navigation: this.props.navigation,
          }
        }}
      />
    );
  };

  //after post creation, push navigator to the post that was just created
  render() {
    if (this.state.loading) {
      return (
        <View style={{flex: 1}}>
          {this._renderHeader()}
          <View style={composeStyle.container}>
            <ActivityIndicator animating={this.state.loading} style={{height: 30}} size="small"/>
          </View>
        </View>
      );
    } else {
      //select the category
      return (
        <View style={{flex: 1}}>
          {this._renderHeader()}
          <View style={composeStyle.container}>
            {this._renderCategories(['Workout Plan', 'Meal Plan', 'Photos', 'Others'])}
          </View>
        </View>
      );
    }
  }
};

const mapStateToProps = function(state) {
  return {
    user: state.user.user,
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
