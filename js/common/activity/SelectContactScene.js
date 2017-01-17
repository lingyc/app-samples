import React, { Component } from 'react';
import { TouchableHighlight, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { optionStyle, container } from '../../styles/styles.js'
import Icon from 'react-native-vector-icons/Ionicons';
import { push, resetTo } from '../../actions/navigation.js';
import { save, clear } from '../../actions/drafts.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SearchBar from 'react-native-search-bar';
import Contacts from 'react-native-contacts';

class SelectContactScene extends Component {
  constructor(props) {
    super(props);
    this.draftRef = this.props.draftRef;
    this.state = {
      contacts: [],
    }
    console.log(Contacts);
  }

  componentWillMount() {
    console.log(Contacts);
    Contacts.getAll( (error, contacts) =>  {
      if (error && error.type === 'permissionDenied') {
        console.error(error);
      }
      else {
        console.log(contacts);
        this.setState({
          contacts: contacts
        })
      }
    });
  }

  render() {
    return <ScrollView keyboardDismissMode="on-drag" contentContainerStyle={{flex:1, backgroundColor:'white'}}>

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

export default connect(mapStateToProps, mapDispatchToProps)(SelectContactScene);
