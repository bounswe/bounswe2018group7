import React from "react";
import { compose } from "recompose";
import { withScriptjs, withGoogleMap, GoogleMap, Marker, Polygon } from "react-google-maps";
import Button from "@material-ui/core/Button";

class PMapsArea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      coords: [],

      isRecording: false
    };
    if (props.mapAreaRef) props.mapAreaRef(this);
  }

  render() {
    const { isRecording, coords } = this.state;
    return (
      <div>
        <Button variant="contained" color="primary" onClick={() => this.handleRecordStopPolygonVertex()}>
          {isRecording ? "Stop" : "Record"}
        </Button>
        <Button variant="contained" color="primary" onClick={() => this.setState({ coords: [] })}>
          Reset
        </Button>
        <GoogleMap
          defaultZoom={9}
          defaultCenter={{ lat: 41.015137, lng: 28.97953 }}
          onClick={e => this.handleMapClick(e)}
        >
          {this.props.isMarkerShown && (
            <Marker position={{ lat: 41.015137, lng: 28.97953 }} onClick={this.props.onMarkerClick} />
          )}
          <Polygon
            ref={el => (this.mapPolygonArea = el)}
            path={this.reversedCoords(coords)}
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

  handleRecordStopPolygonVertex() {
    const { isRecording } = this.state;
    if (isRecording) {
      this.setState({ isRecording: false });
    } else {
      this.setState({ isRecording: true });
    }
  }

  reversedCoords = coords => {
    return coords.map(ll => {
      return { lat: ll.lat, lng: ll.lng };
    });
  };
  handleMapClick(e) {
    if (this.state.isRecording) {
      console.log("pushladım gitti");
      const newArray = this.state.coords;
      newArray.push({ lat: e.latLng.lat(), lng: e.latLng.lng() });
      this.setState(prevState => ({ coords: newArray, updated: prevState.updated + 1 }));
    }
  }
  getLocation() {
    return { coords: this.state.coords };
  }
}

export default compose(
  withScriptjs,
  withGoogleMap
)(PMapsArea);
