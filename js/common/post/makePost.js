import React, { Component } from 'react';
// import { profileStyle } from '../../styles/styles.js';
import { push } from '../../actions/navigation.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class makePost extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
    })
  }

  _savePhotosToDB() {
    return this.state.photos.reduce((photoRefs, photolink) => {
      this.FitlyFirebase.database().ref('/photos/').push({
      })
    }, {})
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
    action: bindActionCreators({storeUserProfile}, dispatch),
    navigation: bindActionCreators({ resetTo }, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(makePost);
