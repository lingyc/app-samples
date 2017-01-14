/**
 * @flow
 */

import React, { Component } from 'react';
import {
  TouchableHighlight,
  Text,
  View,
  KeyboardAvoidingView,
  ActivityIndicator,
  ScrollView,
  TextInput,
  TouchableOpacity
} from 'react-native';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DatePicker from 'react-native-datepicker'
import { optionStyle, container, loginStyles } from '../../styles/styles.js'
import { save, clear } from '../../actions/drafts.js';
import MapView from 'react-native-maps';
import {getCurrentPosition, getPlaceByCoord, getPlaceByCoordGoogle} from '../../library/asyncGeolocation.js';
import PlaceSearchBox from '../PlaceSearchBox.js';
import ImmediatelyPoppedMarker from '../map/ImmediatelyPoppedMarker.js';
import Icon from 'react-native-vector-icons/Ionicons';
import { pop } from '../../actions/navigation.js';

class SelectLocationScene extends Component {
  constructor(props) {
    super(props);
    this.draftRef = this.props.draftRef;
    this.setDraftState = this.props.draftsAction.save.bind(this, this.draftRef);
    this.state = {
      searchInput: '',
      region: {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      edit: false,
      marker: null,
    }
    this._onRegionChange = this._onRegionChange.bind(this);
    this._showMarker = this._showMarker.bind(this);
    this._setLocation = this._setLocation.bind(this);
    this._onLongPressMap = this._onLongPressMap.bind(this);
    this._animateToCurrentLocation = this._animateToCurrentLocation.bind(this);
  }

  componentDidMount() {
    const {location} = this.props.drafts[this.draftRef];
    if (location) {
      this.setState({
        region: {
          ...location.coordinate,
          latitudeDelta: 0,
          longitudeDelta: 0
        },
        marker: location,
      });
    }

    getCurrentPosition()
    .then(position => getPlaceByCoord({lat: position.coords.latitude, lng: position.coords.longitude}))
    .then(location => {
      const {position, formattedAddress} = location;
      this.setState({
        region: {
          latitude: position.lat,
          longitude: position.lng,
          latitudeDelta: 0,
          longitudeDelta: 0
        },
        marker: {
          coordinate: {
            latitude: position.lat,
            longitude: position.lng,
          },
          address: formattedAddress,
          placeName: 'unamed'
        },
      })
    });

  }

  _renderPlaceName() {
    const {edit, marker} = this.state;
    return (edit)
      ? <TextInput
        returnKeyType="done"
        maxLength={100}
        clearButtonMode="always"
        style={{width: 200, borderWidth:.5, borderColor: 'grey', marginRight: 15, borderRadius: 5}}
        onSubmitEditing={() => this.setState({edit: false})}
        onChangeText={(text) => {
          let newMarker = Object.assign({}, marker);
          newMarker.placeName = text;
          this.setState({marker: newMarker})
        }}
        value={marker.placeName}
        placeholderTextColor="white"
      />
      : <Text style={{fontSize: 18, marginRight: 15}}>{marker.placeName}</Text>
  }

  _setLocation() {
    const {marker} = this.state;
    this.setState({edit: false});
    this.setDraftState({
      location: marker
    })
  }

  //see: https://github.com/airbnb/react-native-maps/issues/580
  _onLongPressMap(event) {
    const {coordinate} = event.nativeEvent;
    getPlaceByCoord({lat: coordinate.latitude, lng: coordinate.longitude})
    .then(geocoding => {
      console.log(geocoding);
      this.setState({
        marker: {
          coordinate,
          address: geocoding.formattedAddress,
          placeName: 'unamed'
        }
      })
    });
  };

  _renderConfirmBtn() {
    const {location} = this.props.drafts[this.draftRef];
    const {marker} = this.state;
    if (location && marker &&
        location.placeName === marker.placeName &&
        location.address === marker.address) {
      return (
        <TouchableHighlight onPress={() => this.props.navigation.pop({global: true})}
          style={{marginTop: 15, justifyContent: 'center', alignSelf: 'center', borderWidth: .5, borderColor: 'grey', width: 150, height: 30, borderRadius: 5}}>
          <Text style={{textAlign: 'center', color: 'green'}}>using this location</Text>
        </TouchableHighlight>
      )
    } else {
      return (
        <TouchableHighlight onPress={this._setLocation}
          style={{marginTop: 15, justifyContent: 'center', alignSelf: 'center', borderWidth: .5, borderColor: 'grey', width: 150, height: 30, borderRadius: 5}}>
          <Text style={{textAlign: 'center'}}>use this location</Text>
        </TouchableHighlight>
      )
    }
  }

  _renderMarker() {
    const {marker} = this.state;
    return (marker)
      ? <ImmediatelyPoppedMarker {...marker}>
          <MapView.Callout style={{ flex: 0, position: 'relative' }}>
            <View style={{alignItems:'center'}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {this._renderPlaceName()}
                <TouchableHighlight onPress={() => this.setState({edit: true})}>
                  <Icon name="ios-create-outline" size={30} color="#bbb"/>
                </TouchableHighlight>
              </View>
              <Text style={{width: 250, textAlign: 'center'}}>{marker.address}</Text>
              {this._renderConfirmBtn()}
            </View>
          </MapView.Callout>
        </ImmediatelyPoppedMarker>
      : null;
  }

  _showMarker(data, details) {
    const coordinate = {
      latitude: details.geometry.location.lat,
      longitude: details.geometry.location.lng,
      latitudeDelta: 0,
      longitudeDelta: 0
    };
    this.setState({
      marker: {
        coordinate,
        address: details.formatted_address,
        placeName: details.name,
      },
      region: coordinate,
    });
  }

  _animateToCurrentLocation() {
    getCurrentPosition()
    .then(position => {
      this.refs.map.animateToCoordinate(position.coords);
    });
  }

  _onRegionChange(region) {
    this.setState({ region });
  }

  render() {
    const {placeName, endDate} = this.props.drafts[this.draftRef];
    return (
      <View style={[optionStyle.container, {alignItems: 'center'}]}>
        <MapView
          ref='map'
          followsUserLocation={true}
          style={optionStyle.map}
          region={this.state.region}
          onRegionChange={this._onRegionChange}
          onLongPress={this._onLongPressMap}
          showsUserLocation={true}
          showsCompass={true}
          >
          {this._renderMarker()}
        </MapView>
        <View style={optionStyle.searchBar}>
          <PlaceSearchBox onPress={this._showMarker}/>
        </View>
        <TouchableOpacity style={{width: 60, height: 60, borderRadius: 30, alignSelf: 'flex-end', top: 20, right: 20, alignItems: 'center', justifyContent:'center', backgroundColor:'rgba(255,255,255,.8)'}} onPress={this._animateToCurrentLocation}>
          <Icon name="ios-locate-outline" size={30} color="#999"/>
        </TouchableOpacity>
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
    draftsAction: bindActionCreators({ save, clear }, dispatch),
    navigation: bindActionCreators({ pop }, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectLocationScene);
