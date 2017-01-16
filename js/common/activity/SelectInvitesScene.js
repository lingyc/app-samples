import React, { Component } from 'react';
import { TouchableHighlight, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { optionStyle, container } from '../../styles/styles.js'
import Icon from 'react-native-vector-icons/Ionicons';
import { push, resetTo } from '../../actions/navigation.js';
import { save, clear } from '../../actions/drafts.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SearchBar from 'react-native-search-bar';

class SelectInvitesScene extends Component {
  constructor(props) {
    super(props);
    this.draftRef = this.props.draftRef;
  }

  render() {
    return <ScrollView keyboardDismissMode="on-drag" contentContainerStyle={{flex:1, backgroundColor:'white'}}>
      <View style={{flex: 0}}>
        <SearchBar
          ref='searchBar'
          placeholder='Search Users'
          showsCancelButton={true}
        />
      </View>
      <View style={{flex: 0}}>
        <View style={{height: 25, backgroundColor: '#eee', justifyContent:'center', borderColor:'#aaa'}}>
          <Text style={{textAlign:'center', color: '#aaa'}}>quick invites</Text>
        </View>
        <TouchableOpacity>
          <View style={[optionStyle.entry, {minHeight: 40}]}>
            <Text style={optionStyle.label}>all followings</Text>
            <Icon style={{right: 22}} name="ios-add-outline" size={40} color="#bbb"/>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <View style={[optionStyle.entry, {minHeight: 40}]}>
            <Text style={optionStyle.label}>all followers</Text>
            <Icon style={{right: 22}} name="ios-add-outline" size={40} color="#bbb"/>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <View style={[optionStyle.entry, {minHeight: 40}]}>
            <Text style={optionStyle.label}>all previously connected users</Text>
            <Icon style={{right: 22}} name="ios-add-outline" size={40} color="#bbb"/>
          </View>
        </TouchableOpacity>
      </View>
      <View style={{flex: 0}}>
        <View style={{height: 25, backgroundColor: '#eee', justifyContent:'center', borderColor:'#aaa'}}>
          <Text style={{textAlign:'center', color: '#aaa'}}>invite contacts</Text>
        </View>
        <TouchableOpacity>
          <View style={[optionStyle.entry, {minHeight: 40}]}>
            <Text style={optionStyle.label}>contacts</Text>
            <Icon style={{right: 22}} name="ios-arrow-forward" size={40} color="#bbb"/>
          </View>
        </TouchableOpacity>
      </View>

    </ScrollView>
  }
};

const mapStateToProps = (state) => {
  return {
    drafts: state.drafts.drafts,
    user: state.user.user,
    uID: state.auth.uID,
    FitlyFirebase: state.app.FitlyFirebase
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    navigation: bindActionCreators({ push, resetTo }, dispatch),
    draftsAction: bindActionCreators({ save, clear }, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectInvitesScene);
