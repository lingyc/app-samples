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
  ScrollView
} from 'react-native';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DatePicker from 'react-native-datepicker'
import { optionStyle, container } from '../../styles/styles.js'
import { save, clear } from '../../actions/drafts.js';

class SelectDateScene extends Component {
  constructor(props) {
    super(props);
    this.draftRef = this.props.draftRef;
    this.setDraftState = this.props.draftsAction.save.bind(this, this.draftRef);
  }

  render() {
    const {startDate, endDate} = this.props.drafts[this.draftRef];
    return (
      <View style={optionStyle.container}>
        <View style={optionStyle.entry}>
          <Text style={optionStyle.label}>Start Date</Text>
          <DatePicker
            style={optionStyle.datePicker}
            date={startDate && startDate.dateString}
            mode="datetime"
            format={"ddd, MMM Do, h:mm A"}
            placeholder="date"
            minDate={new Date()}
            maxDate={endDate && endDate.date || null}
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            onDateChange={(dateString, date) => this.setDraftState({startDate: {dateString, date}})}
            customStyles={datepickerStyle}
          />
        </View>
        <View style={optionStyle.entry}>
          <Text style={optionStyle.label}>End Date</Text>
          <DatePicker
            style={optionStyle.datePicker}
            date={endDate && endDate.dateString}
            mode="datetime"
            format={"ddd, MMM Do, h:mm A"}
            placeholder="date"
            minDate={startDate && startDate.date || new Date()}
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            onDateChange={(dateString, date) => this.setDraftState({endDate: {dateString, date}})}
            customStyles={datepickerStyle}
          />
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

export default connect(mapStateToProps, mapDispatchToProps)(SelectDateScene);
