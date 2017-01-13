/**
 * @flow
 */

import React, { Component } from 'react';
import {
  TouchableHighlight,
  Text,
  View,
  KeyboardAvoidingView,
  Slider,
  ActivityIndicator,
  ScrollView,
  TextInput
} from 'react-native';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DatePicker from 'react-native-datepicker'
import { optionStyle, container } from '../../styles/styles.js'
import { save, clear } from '../../actions/drafts.js';

class SelectLocationScene extends Component {
  constructor(props) {
    super(props);
    this.draftRef = this.props.draftRef;
    this.setDraftState = this.props.draftsAction.save.bind(this, this.draftRef);
  }

  render() {
    const {placeName, endDate} = this.props.drafts[this.draftRef];
    return (
      <View style={optionStyle.container}>
        <View style={optionStyle.entry}>
          <Text style={optionStyle.label}>Place Name</Text>
          <TextInput
            returnKeyType="done"
            maxLength={30}
            autoFocus={true}
            clearButtonMode="always"
            onChangeText={(text) => this.setDraftState({placeName: text})}
            value={placeName}
            placeholder="Activity Name"
            placeholderTextColor="grey"
          />
        </View>
        <View style={optionStyle.entry}>
          <Text style={optionStyle.label}>End Date</Text>
        </View>
      </View>
    )
  }
 };

 const datepickerStyle = {
   dateIcon: {
     left: 0,
     marginLeft: 15
   },
   dateInput: {
     borderWidth: 0
   },
   dateText: {
     color: 'black',
     width: 200,
     textAlign: 'right',
     marginRight: 100
   },
   btnCancel: {

   },
   placeholderText: {
     color: 'black'
   },
   btnTextConfirm: {
     color: '#007AFF'
   }
 }


 const mapStateToProps = function(state) {
  return {
    drafts: state.drafts.drafts,
  };
};

const mapDispatchToProps = function(dispatch) {
  return {
    draftsAction: bindActionCreators({ save, clear }, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectLocationScene);
