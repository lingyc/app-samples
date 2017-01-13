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
import { loginStyles } from '../../styles/styles.js'
import { save, clear } from '../../actions/drafts.js';

class SelectDateScene extends Component {
  constructor(props) {
    super(props);
    this.draftRef = this.props.draftRef;
    this.setDraftState = this.props.draftsAction.save.bind(this, this.draftRef);
  }

  formatDate(date) {
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }

  render() {
    const {startDate, endDate} = this.props.drafts[this.draftRef];
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <View>
          <Text>Start Date</Text>
          <DatePicker
            style={{width: 200, alignSelf: 'center'}}
            date={startDate}
            mode="datetime"
            placeholder="select start date"
            minDate={this.formatDate(new Date())}
            maxDate={endDate || null}
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            onDateChange={(date) => {this.setDraftState({startDate: date})}}
            customStyles={datepickerStyle}
          />
        </View>
        <View>
          <Text>End Date</Text>
          <DatePicker
            style={{width: 200, alignSelf: 'center'}}
            date={endDate}
            mode="datetime"
            placeholder="select end date"
            minDate={startDate || this.formatDate(new Date())}
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            onDateChange={(date) => {this.setDraftState({endDate: date})}}
            customStyles={datepickerStyle}
          />
        </View>
      </View>
    )
  }
 };

 const datepickerStyle = {
   dateIcon: {
     position: 'absolute',
     left: 0,
     top: 4,
     marginLeft: 0
   },
   dateInput: {
     marginLeft: 36,
     borderWidth: 0
   },
   dateText: {
     color: 'black'
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
