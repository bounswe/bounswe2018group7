import React from "react";
import { compose, withProps } from "recompose";
import { withScriptjs, withGoogleMap, GoogleMap, Marker, Polygon } from "react-google-maps";

class PMapsArea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      coords: [],
      updated: 0
    };
  }

  render() {
    console.log(this.state.coords);
    return (
      <GoogleMap
        defaultZoom={9}
        defaultCenter={{ lat: 41.015137, lng: 28.97953 }}
        onClick={e => this.handleMapClick(e)}
      >
        {this.props.isMarkerShown && (
          <Marker position={{ lat: 41.015137, lng: 28.97953 }} onClick={this.props.onMarkerClick} />
        )}
        <Polygon
          path={this.state.coords}
          //key={1}
          updated={this.state.updated}
          options={{
            fillColor: "#000",
            fillOpacity: 0.4,
            strokeColor: "#000",
            strokeOpacity: 1,
            strokeWeight: 1
          }}
        />
      </GoogleMap>
    );
  }
  reversedCoords = coords => {
    return coords.map(ll => {
      return { lat: ll.lng, lng: ll.lat };
    });
  };
  handleMapClick(e) {
    const newArray = this.state.coords;
    newArray.push({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    this.setState(prevState => ({ coords: newArray, updated: prevState.updated + 1 }));
  }
}

export default compose(
  withScriptjs,
  withGoogleMap
)(PMapsArea);
