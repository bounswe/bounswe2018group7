/* global google */
import React from "react";
import { TextField, Button } from "@material-ui/core";
import GoogleMapWithDirections from "./dest";
class PMapsDest extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      city1: "bursa",
      city2: "istanbul",
      lat1: 41.85073,
      lng1: -87.65126,
      lat2: 41.85258,
      lng2: -87.65141
    };
    if (props.mapDestRef) props.mapDestRef(this);
  }

  handleRouteChange() {
    console.log("selam bacanak");
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: this.state.city1 }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        this.setState({ lng1: results[0].geometry.location.lng(), lat1: results[0].geometry.location.lat() });
      } else {
        console.log("Something got wrong " + status);
      }
    });

    geocoder.geocode({ address: this.state.city2 }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        this.setState({ lng2: results[0].geometry.location.lng(), lat2: results[0].geometry.location.lat() });
      } else {
        console.log("Something got wrong " + status);
      }
    });
  }

  render() {
    const points = [{ lng1: this.state.lng1, lat1: this.state.lat1 }, { lng2: this.state.lng2, lat2: this.state.lat2 }];

    return (
      <div>
        <TextField
          margin="normal"
          variant="outlined"
          label="City1"
          value={this.state.city1}
          onChange={this.handleChange("city1")}
        />

        <TextField
          margin="normal"
          variant="outlined"
          label="City2"
          value={this.state.city2}
          onChange={this.handleChange("city2")}
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
          points={points}
        />
      </div>
    );
  }
  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };
  getLocation() {
    return { lat1: this.state.lat1, lng1: this.state.lng1, lat2: this.state.lat2, lng2: this.state.lng2 };
  }
}

export default PMapsDest;
