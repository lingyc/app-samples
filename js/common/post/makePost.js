import React, { Component } from 'react';
import { composeStyle, headerStyle } from '../../styles/styles.js';
import { View, Text, ScrollView, Image, TouchableHighlight, TouchableOpacity, ActivityIndicator } from 'react-native';
import { push, pop, resetTo } from '../../actions/navigation.js';
import { save, clear } from '../../actions/drafts.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import HeaderInView from '../../header/HeaderInView.js'
import Icon from 'react-native-vector-icons/Ionicons';
import {guid} from '../../library/firebaseHelpers.js'

class MakePost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    }
  }

  componentDidMount() {
    if (!this.props.draftRef) {
      const draftRef = guid();
      this.setState({
        draftRef: draftRef
      })
      this.props.draftsAction.save(draftRef,{
        category: "Workout Plan",
        title: '',
        content: '',
        tags: [],
        photos: [],
        photoRefs: null,
      })
    } else {
      this.setState({
        draftRef: this.props.draftRef
      })
    }
  }

  componentWillUnMount() {
    this.props.draftsAction.clear(this.state.draftRef);
  }

  _renderCategories(categories) {
    return categories.map((category, index) => {
      let containerStyle = composeStyle.category;
      let textStyle = composeStyle.categoryText;
      if (this.props.drafts[this.state.draftRef].category === category) {
        containerStyle = [composeStyle.category, {backgroundColor: '#1D2F7B'}];
        textStyle = [composeStyle.categoryText, {color: 'white'}];
      }

      return (
        <TouchableHighlight style={containerStyle} key={index} onPress={() => this.props.draftsAction.save(this.state.draftRef, {category: category})}>
          <Text style={textStyle}>{category}</Text>
        </TouchableHighlight>
      );
    });
  }

  _onPressRight() {
    this.props.navigation.push({
      key: 'ComposePost',
      global: true,
      passProps:{
        draftRef: this.state.draftRef
      }
    });
  }

  _onPressLeft() {
    this.props.navigation.pop();
    this.props.draftsAction.clear(this.state.draftRef);
  }

  //refactor this out as a reusable component
  _renderHeader() {
    return (
      <HeaderInView
        leftElement={{icon: "ios-close"}}
        rightElement={{text: "Next"}}
        title="Choose a Post Category"
        _onPressLeft={() => this._onPressLeft()}
        _onPressRight={() => this._onPressRight()}
      />
    );
  };

  //after post creation, push navigator to the post that was just created
  render() {
    if (!this.props.drafts[this.state.draftRef]) {
      return (
        <View style={{flex: 1}}>
          <ActivityIndicator
            animating={true}
            style={{height: 80}}
            size="large"
          />
        </View>
      );
    } else {
      // console.log(this.props.drafts[this.state.draftRef]);
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
    drafts: state.drafts.drafts,
  };
};

const mapDispatchToProps = function(dispatch) {
  return {
    navigation: bindActionCreators({ push, pop, resetTo }, dispatch),
    draftsAction: bindActionCreators({ save, clear }, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MakePost);
