import React, { Component } from "react";
import { compose } from "recompose";

import { withScriptjs, withGoogleMap, GoogleMap, Marker, Polygon } from "react-google-maps";

class PMapsAreaView extends Component {
  constructor(props) {
    super(props);
    if (props.mapAreaRef) props.mapAreaRef(this);
  }

  render() {
    const path = this.reversedCoords(this.props.coords);
    return (
      <div>
        <GoogleMap defaultZoom={9} defaultCenter={{ lat: 41.015137, lng: 28.97953 }}>
          {this.props.isMarkerShown && (
            <Marker position={{ lat: 41.015137, lng: 28.97953 }} onClick={this.props.onMarkerClick} />
          )}
          <Polygon
            ref={el => (this.mapPolygonArea = el)}
            path={path}
            options={{
              fillColor: "#000",
              fillOpacity: 0.4,
              strokeColor: "#000",
              strokeOpacity: 1,
              strokeWeight: 1
            }}
          />
        </GoogleMap>
      </div>
    );
  }

  reversedCoords = coords => {
    return coords.map(ll => {
      return { lat: ll.lat, lng: ll.lng };
    });
  };
}

export default compose(
  withScriptjs,
  withGoogleMap
)(PMapsAreaView);
