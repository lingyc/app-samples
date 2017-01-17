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

const Entry = (props) => {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={[optionStyle.entry, {minHeight: 40}]}>
        <Text style={optionStyle.label}>{props.text}</Text>
        <Icon style={{right: 22}} name={props.icon} size={40} color="#bbb"/>
      </View>
    </TouchableOpacity>
  )
};

const Separator = (props) => {
  return (
    <View style={{height: 25, backgroundColor: '#eee', justifyContent:'center', borderColor:'#ddd', borderTopWidth: .5, borderBottomWidth: .5}}>
      {(props.text)
        ? <Text style={{textAlign:'center', color: '#aaa'}}>{props.text}</Text>
        : null
      }
    </View>
  )
}

class SelectInvitesScene extends Component {
  constructor(props) {
    super(props);
    this.draftRef = this.props.draftRef;
    this.setDraftState = this.props.draftsAction.save.bind(this, this.draftRef);
    this.state = {
      contacts: []
    }
  }

  componentDidMount() {
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

  _renderEntries(boolean) {
    const {allFollowings, allFollowers, allPrevConnected, facebookFriend, contacts} = this.props.drafts[this.draftRef].invites;
    const icon = (boolean) ? 'ios-remove-outline' : 'ios-add-outline';
    const contactLength = Object.keys(contacts).length;
    const showEmpty = boolean
      ? (allFollowings || allFollowers || allPrevConnected || !!contactLength) === boolean
      : (allFollowings && allFollowers && allPrevConnected && facebookFriend && !!contactLength) === boolean;

    const showContacts = (boolean)
      ? ((contactLength > 0) === boolean) ? <Entry text={'contacts: ' + contactLength + ' added'} icon={icon} onPress={() => this._clearInviteContacts()}/> : null
      : null;
    return (
      <View>
        {(showEmpty)
          ? null
          : <View style={[optionStyle.entry, {minHeight: 40, justifyContent: 'center'}]}>
              <Text style={{textAlign: 'center', color: 'grey'}}>empty</Text>
            </View>}
        {(allFollowings === boolean) ? <Entry text='all followings' icon={icon} onPress={() => this._onPressQuickInvites('allFollowings')}/> : null}
        {(allFollowers === boolean) ? <Entry text='all followers' icon={icon} onPress={() => this._onPressQuickInvites('allFollowers')}/> : null}
        {(allPrevConnected === boolean) ? <Entry text='all previously connected users' icon={icon} onPress={() => this._onPressQuickInvites('allPrevConnected')}/> : null}
        {(facebookFriend === boolean) ? <Entry text='all facebook friends' icon={icon} onPress={() => this._onPressQuickInvites('facebookFriend')}/> : null}
        {showContacts}
      </View>
    )
  }


  _onPressQuickInvites(key) {
    const {invites} = this.props.drafts[this.draftRef];
    let invitesCopy = Object.assign({}, invites);
    invitesCopy[key] = !invitesCopy[key];
    this.setDraftState({invites: invitesCopy});
  }

  _clearInviteContacts() {
    const {invites} = this.props.drafts[this.draftRef];
    let invitesCopy = Object.assign({}, invites);
    invitesCopy.contacts = {};
    this.setDraftState({invites: invitesCopy});
  }

  render() {
    return <ScrollView keyboardDismissMode="on-drag" contentContainerStyle={{flex:1, backgroundColor:'white'}}>
      <View style={{flex: 0}}>
        <SearchBar
          ref='searchBar'
          placeholder='Search Users'
          showsCancelButton={true}
        />
        <Separator text='invited'/>
        {this._renderEntries(true)}
      </View>
      <View style={{flex: 0}}>
        <Separator text='quick invites'/>
        {this._renderEntries(false)}
      </View>
      <View style={{flex: 0}}>
        <Separator text='invite contacts'/>
        <Entry
          text='contacts'
          onPress={() => this.props.navigation.push({
            key: 'SelectContactScene',
            showHeader: true,
            headerTitle: 'select contacts',
            leftHeaderIcon: 'ios-arrow-round-back-outline',
            global: true,
            passProps:{
              draftRef: this.draftRef,
              contacts: this.state.contacts
            }
          })}
          icon='ios-add-outline'
        />
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
