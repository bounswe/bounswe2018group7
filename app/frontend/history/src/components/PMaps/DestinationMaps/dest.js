/* global google */
import React, { Component } from "react";
const { compose } = require("recompose");
const { withScriptjs, withGoogleMap, GoogleMap, DirectionsRenderer } = require("react-google-maps");
class GoogleMapWithDirections extends Component {
  render() {
    return (
      <GoogleMap defaultZoom={7} defaultCenter={new google.maps.LatLng(41.85073, -87.65126)}>
        {this.props.directions && <DirectionsRenderer directions={this.props.directions} />}
      </GoogleMap>
    );
  }
}

export default compose(
  withScriptjs,
  withGoogleMap
)(GoogleMapWithDirections);
