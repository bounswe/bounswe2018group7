/* global google */
import React from "react";
import { TextField, Button } from "@material-ui/core";
import GoogleMapWithDirections from "./dest";
class PMapsDest extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      lat1: 41.85073,
      lng1: -87.65126,
      lat2: 41.85258,
      lng2: -87.65141,
      routeDirection: {}
    };
  }

  handleRouteChange() {
    const DirectionsService = new google.maps.DirectionsService();

    DirectionsService.route(
      {
        origin: new google.maps.LatLng(this.state.lat1, this.state.lng1),
        destination: new google.maps.LatLng(this.state.lat2, this.state.lng2),
        travelMode: google.maps.TravelMode.DRIVING
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          this.setState({
            routeDirection: result
          });
        } else {
          console.error(`error fetching directions ${result}`);
        }
      }
    );
  }
  render() {
    return (
      <div>
        <TextField
          margin="normal"
          variant="outlined"
          label="LAT1"
          value={this.state.lat1}
          onChange={this.handleChange("lat1")}
        />

        <TextField
          margin="normal"
          variant="outlined"
          label="LNG1"
          value={this.state.lng1}
          onChange={this.handleChange("lng1")}
        />

        <TextField
          margin="normal"
          variant="outlined"
          label="LAT2"
          value={this.state.lat2}
          onChange={this.handleChange("lat2")}
        />

        <TextField
          margin="normal"
          variant="outlined"
          label="LNG2"
          value={this.state.lng2}
          onChange={this.handleChange("lng2")}
        />
        <Button color="primary" onClick={() => this.handleRouteChange()}>
          Set New Route
        </Button>
        <GoogleMapWithDirections
          googleMapURL={
            "https://maps.googleapis.com/maps/api/js?key=AIzaSyDHduayDw74dgAhiZeP-oby-oHd-uQGv1Q&v=3.exp&libraries=geometry,drawing,places"
          }
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `400px` }} />}
          mapElement={<div style={{ height: `100%` }} />}
          directions={this.state.routeDirection}
        />
      </div>
    );
  }
  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };
}

export default PMapsDest;
