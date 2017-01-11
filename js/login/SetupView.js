/**
 * @flow
 */

import React, { Component } from 'react';
import {
  StatusBar,
  TextInput,
  TouchableHighlight,
  Text,
  View,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Slider,
  ActivityIndicator,
  ScrollView
} from 'react-native';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { storeUserProfile } from '../actions/user.js';
import { printError, clearError } from '../actions/app.js';
import { push, resetTo } from '../actions/navigation.js';
import FMPicker from 'react-native-fm-picker';
import DatePicker from 'react-native-datepicker'
const dismissKeyboard = require('dismissKeyboard');

import { loginStyles, loadingStyle, commonStyle } from '../styles/styles.js'
import { getCurrentPlace, getPlace } from '../library/asyncGeolocation.js';
import { createUpdateObj } from '../library/firebaseHelpers.js';

class SetupProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gender: null,
      birthday: null
    }
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

  _handlePress() {
    //TODO validate the input before pushing to next scene
    if (this.state.gender !== null && this.state.birthday !== null) {
      this.props.action.clearError();
      this.props.navigation.push({
        key:'SetupStatsView',
        global: true,
        passProps: this.state,
        from:'SetupProfileView, profile incomplete'
      });
    } else {
      //TODO: print proper errors
      this.props.action.printError('field cannot be empty');
    }
  }

  render() {
      const options = ['male', 'female'];
      const labels = ['male', 'female'];

      let genderInput = (this.state.gender)
        ? (<Text style={loginStyles.input} onPress={() => this.refs.genderPicker.show()}>
            I am a {this.state.gender}
          </Text>)
        : (<Text style={loginStyles.input} onPress={() => this.refs.genderPicker.show()}>
            I am a Male? I am a Female?
          </Text>);


    return (
      <TouchableWithoutFeedback style={{flex:1}} onPress={() => dismissKeyboard()}>
        <View style={{flex: 1, backgroundColor: '#1D2F7B'}}>
          <ScrollView contentContainerStyle={loginStyles.container}>
            <View style={loginStyles.container}>
              <StatusBar
                barStyle="light-content"
              />
              <Text style={loginStyles.header}>
                YOUR PROFILE
              </Text>
              <Text style={loginStyles.textMid}>
                Your stats help us find and suggest goals and workouts for you. This information will never be made public.
              </Text>

              <View style={loginStyles.form}>
                {genderInput}
              </View>

              <FMPicker ref={'genderPicker'}
                options={options}
                labels={labels}
                onSubmit={(option) => this.setState({gender: option})}
              />

              <View style={loginStyles.form}>
                <Text style={loginStyles.input}>
                  I was born on...
                </Text>
                <DatePicker
                  style={{width: 200, alignSelf: 'center'}}
                  date={this.state.birthday}
                  mode="date"
                  placeholder="date"
                  format="YYYY-MM-DD"
                  minDate="1800-01-01"
                  maxDate={this.formatDate(new Date())}
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  onDateChange={(date) => {this.setState({birthday: date})}}
                  customStyles={{
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
                      color: 'white'
                    },
                    btnCancel: {

                    },
                    btnTextConfirm: {
                      color: '#007AFF'
                    }
                  }}
                />
              </View>
              {(this.props.error) ? (<Text style={commonStyle.error}> {this.props.error} </Text>) : <Text style={commonStyle.hidden}> </Text> }
            </View>
          </ScrollView>
          <TouchableHighlight style={loginStyles.swipeBtn} onPress={() => this._handlePress()}>
            <Text style={loginStyles.btnText}>
              SAVE & CONTINUE
            </Text>
          </TouchableHighlight>
        </View>
      </TouchableWithoutFeedback>
    )
  }
 };

class SetupStats extends Component {
   constructor(props) {
     super(props);
     this.state = {
       height: null,
       weight: null,
       ...this.props.sceneProps.route.passProps
     }
   }

   _handlePress() {
     //TODO validate input
     this.props.action.clearError();
     if (this.state.height !== null && this.state.weight !== null ) {
       this.props.navigation.push({
         key:'SetupActiveLevelView',
         global: true,
         passProps: this.state,
         from:'SetupStatsView, profile incomplete'
       });
     } else {
       //TODO: print proper errors
       this.props.action.printError('field cannot be empty');
     }
   }

   focusNextField = (nextField) => {
     this.refs[nextField].focus();
   };

   render() {
     return (
       <TouchableWithoutFeedback style={{flex:1}} onPress={()=> dismissKeyboard()}>
         <View style={{flex: 1, backgroundColor: '#1D2F7B'}}>
           <ScrollView contentContainerStyle={loginStyles.container}>
             <View style={loginStyles.container}>
               <StatusBar barStyle="light-content"/>
               <Text style={loginStyles.header}>
                 YOUR STATS
               </Text>
               <Text style={loginStyles.textMid}>
                 Your stats help us find and suggest goals and workouts for you. This information will never be made public.
               </Text>

               {/* TODO make picker with feet and inch */}
               <View style={loginStyles.form}>
                 <TextInput
                   returnKeyType="next"
                   maxLength={30}
                   clearButtonMode="always"
                   ref="1"
                   onSubmitEditing={() => this.focusNextField('2')}
                   style={loginStyles.input}
                   onChangeText={(text) => this.setState({height: text})}
                   value={this.state.height}
                   placeholder="Height"
                   placeholderTextColor="white"
                 />
               </View>

               <View style={loginStyles.form}>
                 <TextInput
                   maxLength={30}
                   returnKeyType="next"
                   clearButtonMode="always"
                   ref="2"
                   onSubmitEditing={() => this._handlePress()}
                   style={loginStyles.input}
                   onChangeText={(text) => this.setState({weight: text})}
                   value={this.state.weight}
                   placeholder="Weight"
                   placeholderTextColor="white"
                 />
               </View>
               {(this.props.error) ? (<Text style={commonStyle.error}> {this.props.error} </Text>) : <Text style={commonStyle.hidden}> </Text> }
             </View>
           </ScrollView>
           <TouchableHighlight style={loginStyles.swipeBtn} onPress={() => this._handlePress()}>
             <Text style={loginStyles.btnText}>
               SAVE & CONTINUE
             </Text>
           </TouchableHighlight>
         </View>
       </TouchableWithoutFeedback>
     )
   }
  };

class SetupActiveLevel extends Component {
   constructor(props) {
     super(props);
     this.state = {
       activeLevel: 0,
       ...this.props.sceneProps.route.passProps
     }
   }

   _handlePress() {
     this.props.action.clearError();
     if (this.state.activeLevel !== null) {
       this.props.navigation.push({
         key:'SetupLocationView',
         global: true,
         passProps: this.state,
         from:'SetupActiveLevelView, profile incomplete'
       });
     } else {
       //TODO: print proper errors
       this.props.action.printError('field cannot be empty');
     }
   }

   render() {
     return (
       <TouchableWithoutFeedback style={{flex:1}} onPress={()=> dismissKeyboard()}>
         <View style={{flex: 1, backgroundColor: '#1D2F7B'}}>
           <ScrollView contentContainerStyle={loginStyles.container}>
             <View style={loginStyles.container}>
               <StatusBar
                 barStyle="light-content"
               />
               <Text style={loginStyles.header}>
                 ACTIVITY LEVEL
               </Text>
               <Text style={loginStyles.textMid}>
                 Your stats help us find and suggest goals and workouts for you. This information will never be made public.
               </Text>

               <View style={[loginStyles.form, {borderBottomWidth: 0}]}>
                 <Text style={loginStyles.input}>
                     Choose a level of activity...
                 </Text>
               </View>

               <Slider
                 style={{width: 260, alignSelf: 'center'}}
                 value={this.state.activeLevel}
                 minimumValue={0}
                 maximumValue={10}
                 step={.5}
                 onValueChange={(value) => this.setState({activeLevel: value})} />

               <Text style={[loginStyles.input, {marginTop: 40, fontSize: 40}]}>
                 {this.state.activeLevel}
               </Text>
               {(this.props.error) ? (<Text style={commonStyle.error}> {this.props.error} </Text>) : <Text style={commonStyle.hidden}> </Text> }
             </View>
           </ScrollView>
           <TouchableHighlight style={loginStyles.swipeBtn} onPress={() => this._handlePress()}>
             <Text style={loginStyles.btnText}>
               SAVE & CONTINUE
             </Text>
           </TouchableHighlight>
         </View>
       </TouchableWithoutFeedback>
     );
   }
  };

class SetupLocation extends Component {
   constructor(props) {
     super(props);
     this.state = {
       loading: false,
       location: null,
       locationInput: null,
     }
     console.log('this.props.sceneProps.route.passProps', this.props.sceneProps.route.passProps)
   }

   _handlePress() {
     const { FitlyFirebase } = this.props;
     //TODO: if picture not created yet, direct to picture upload scene
     this.props.action.clearError();
     if (this.state.location) {
       (async () => {
         try {
           this.props.navigation.resetTo({
             key:'OnBoardingSlides',
             global: true,
           });

           let publicDataUpdates = createUpdateObj('/users/' + this.props.uID + '/public', {
             location:this.state.location,
             currentLocation:this.state.location,
             profileComplete: true
           });

           let privateDataUpdates = createUpdateObj('/users/' + this.props.uID + '/private', this.props.sceneProps.route.passProps);

           await this.props.FitlyFirebase.database().ref().update({...publicDataUpdates, ...privateDataUpdates})
           const userData = (await FitlyFirebase.database().ref('users/' + this.props.uID).once('value')).val();
           this.props.action.storeUserProfile(userData);


         } catch(error) {
           this.props.action.printError(error.message)
         }
       })();
     } else {
       //TODO: show proper error
       this.props.action.printError('location error')
     }
   }

   _getLocation(input) {
     let getLocationFunc = (input) ? getPlace.bind(null, input) : getCurrentPlace;
     this.props.action.clearError();
     (async () => {
       try {
         this.setState({loading: true});
         const place = await getLocationFunc();
         this.setState({
           loading: false,
           location: {
             place: `${place.locality}, ${place.adminArea}`,
             lat: place.position.lat,
             lon: place.position.lng,
             zip: place.postalCode
           }
         })
       } catch(error) {
         this.props.action.printError(error);
         console.log('geolocation error', error)
       }
     })();
   }

   render() {
     return (
       <TouchableWithoutFeedback style={{flex:1}} onPress={()=> dismissKeyboard()}>
         <View style={{flex: 1, backgroundColor: '#1D2F7B'}}>
           <ScrollView contentContainerStyle={loginStyles.container}>
             <View style={loginStyles.container}>
               <StatusBar
                 barStyle="light-content"
               />
               <Text style={loginStyles.header}>
                 LOCATION
               </Text>
               <Text style={loginStyles.textMid}>
                 Plese enter your locations so we can find activities, events, and friends in your area.
               </Text>

               <TouchableHighlight style={loginStyles.FBbtn} onPress={() => this._getLocation()}>
                 <Text style={loginStyles.btnText}>
                   USE CURRENT LOCATION
                 </Text>
               </TouchableHighlight>

               <Text style={loginStyles.textSmall}>
                 or
               </Text>

               <View style={loginStyles.form}>
                 <TextInput
                   maxLength={30}
                   returnKeyType="search"
                   clearButtonMode="always"
                   onSubmitEditing={() => this._getLocation(this.state.locationInput)}
                   style={loginStyles.input}
                   onChangeText={(text) => this.setState({locationInput: text})}
                   value={this.state.locationInput}
                   placeholder="Enter postal code, or city"
                   placeholderTextColor="white"
                 />
               </View>

               <Text style={[loginStyles.input, {marginTop: 40, fontSize: 30}]}>
                 {(this.state.location && this.state.location.place) ? this.state.location.place : '' }
               </Text>
               {(this.props.error) ? (<Text style={commonStyle.error}> {this.props.error} </Text>) : <Text style={commonStyle.hidden}> </Text> }
               <ActivityIndicator
                 animating={this.state.loading}
                 style={{height: 80}}
                 size="large"
               />
             </View>
           </ScrollView>
           <TouchableHighlight style={loginStyles.swipeBtn} onPress={() => this._handlePress()}>
             <Text style={loginStyles.btnText}>
               FINISH
             </Text>
           </TouchableHighlight>
         </View>
       </TouchableWithoutFeedback>
     );
   }
  };
 const mapStateToProps = function(state) {
  return {
    uID: state.auth.uID,
    error: state.app.error,
    FitlyFirebase: state.app.FitlyFirebase
  };
};

const mapDispatchToProps = function(dispatch) {
  return {
    action: bindActionCreators({ printError, clearError, storeUserProfile }, dispatch),
    navigation: bindActionCreators({ push, resetTo }, dispatch)
  };
};

export const SetupProfileView = connect(mapStateToProps, mapDispatchToProps)(SetupProfile);
export const SetupStatsView = connect(mapStateToProps, mapDispatchToProps)(SetupStats);
export const SetupActiveLevelView = connect(mapStateToProps, mapDispatchToProps)(SetupActiveLevel);
export const SetupLocationView = connect(mapStateToProps, mapDispatchToProps)(SetupLocation);
