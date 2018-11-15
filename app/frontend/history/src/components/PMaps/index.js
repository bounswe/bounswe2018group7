import React from "react";
import { compose, withProps } from "recompose";
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";

const MyMaps = compose(
  withProps({
    googleMapURL:
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyDHduayDw74dgAhiZeP-oby-oHd-uQGv1Q&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  withScriptjs,
  withGoogleMap
)(props => (
  <GoogleMap onClick={props.onClick} defaultZoom={8} defaultCenter={{ lat: -34.397, lng: 150.644 }}>
    {props.isMarkerShown && <Marker position={{ lat: props.lat, lng: props.lng }} onClick={props.onMarkerClick} />}
  </GoogleMap>
));

class PMaps extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      lat: -34.397,
      lng: 150.644
    };
    if (props.mapRef) props.mapRef(this);
  }

  render() {
    return (
      <MyMaps
        isMarkerShown={this.props.isMarkerShown}
        onClick={ev => this.onMapClick(ev)}
        lat={this.state.lat}
        lng={this.state.lng}
      />
    );
  }
  onMapClick(ev) {
    this.setState({ lat: ev.latLng.lat(), lng: ev.latLng.lng() });
  }

  getLocation() {
    return { lat: this.state.lat, lng: this.state.lng };
  }
}

export default PMaps;
