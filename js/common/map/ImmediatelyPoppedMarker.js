import React, { Component } from 'react';
import MapView from 'react-native-maps';

export default class ImmediatelyPoppedMarker extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    setTimeout(() => {
      //the popup needs sometime to load before it can pop, but this is not a very pretty solution
      //see: https://github.com/airbnb/react-native-maps/issues/141
      this.refs.marker.showCallout()
    }, 100)
  }
  render() {
    const {coordinate, title = null, description = null} = this.props;
    return (
      <MapView.Marker ref='marker'
        coordinate={coordinate}
        title={title}
        description={description}
      >
        {this.props.children}
      </MapView.Marker>
    )
  }
};
