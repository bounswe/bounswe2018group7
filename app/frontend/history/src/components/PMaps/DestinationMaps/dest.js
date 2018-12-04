/* global google */
import React, { Component } from "react";
const { compose } = require("recompose");
const { withScriptjs, withGoogleMap, GoogleMap, DirectionsRenderer } = require("react-google-maps");
class GoogleMapWithDirections extends Component {
  constructor(props) {
    super(props);

    this.state = {
      directions: {}
    };
  }

  componentDidMount() {
    this.changeRoute(this.props.points);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.points !== this.props.points) this.changeRoute(this.props.points);
  }

  render() {
    return (
      <GoogleMap defaultZoom={7} defaultCenter={new google.maps.LatLng(41.85073, -87.65126)}>
        {(this.props.directions || this.props.points) && (
          <DirectionsRenderer directions={this.props.directions || this.state.directions} />
        )}
      </GoogleMap>
    );
  }

  changeRoute(points) {
    const DirectionsService = new google.maps.DirectionsService();
    DirectionsService.route(
      {
        origin: new google.maps.LatLng(points[0].lat1, points[0].lng1),
        destination: new google.maps.LatLng(points[1].lat2, points[1].lng2),
        travelMode: google.maps.TravelMode.DRIVING
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          this.setState({
            directions: result
          });
        } else {
          console.error(`error fetching directions ${result}`);
        }
      }
    );
  }
}

export default compose(
  withScriptjs,
  withGoogleMap
)(GoogleMapWithDirections);
