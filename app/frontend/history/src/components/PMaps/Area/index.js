import React from "react";
import { compose, withProps } from "recompose";
import { withScriptjs, withGoogleMap, GoogleMap, Marker, Polygon } from "react-google-maps";

const coords = [
  { lat: 29.047487, lng: 41.023164 },
  { lat: 29.0459633, lng: 41.0212904 },
  { lat: 29.0449333, lng: 41.0167573 },
  { lat: 29.0393543, lng: 41.0106695 },
  { lat: 29.032917, lng: 41.0049697 },
  { lat: 29.0226173, lng: 41.0061356 },
  { lat: 29.0078545, lng: 41.0039334 },
  { lat: 29.0201283, lng: 40.9765933 },
  { lat: 29.0319729, lng: 40.9657708 },
  { lat: 29.0784073, lng: 40.9536501 },
  { lat: 29.0944576, lng: 40.9493068 },
  { lat: 29.0975475, lng: 40.9514461 },
  { lat: 29.1052294, lng: 40.9647986 },
  { lat: 29.097338, lng: 40.978242 },
  { lat: 29.0931273, lng: 40.9835914 },
  { lat: 29.0858746, lng: 40.987738 },
  { lat: 29.056509, lng: 40.998902 },
  { lat: 29.061456, lng: 41.008443 },
  { lat: 29.0617561, lng: 41.0104752 },
  { lat: 29.0595245, lng: 41.0126772 },
  { lat: 29.052014, lng: 41.018198 },
  { lat: 29.047487, lng: 41.023164 }
];

const reversedCoords = coords.map(ll => {
  return { lat: ll.lng, lng: ll.lat };
});

const Area = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyDHduayDw74dgAhiZeP-oby-oHd-uQGv1Q",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  withScriptjs,
  withGoogleMap
)(props => (
  <GoogleMap defaultZoom={9} defaultCenter={{ lat: 41.015137, lng: 28.97953 }}>
    {props.isMarkerShown && <Marker position={{ lat: 41.015137, lng: 28.97953 }} />}
    <Polygon
      path={reversedCoords}
      //key={1}
      options={{
        fillColor: "#000",
        fillOpacity: 0.4,
        strokeColor: "#000",
        strokeOpacity: 1,
        strokeWeight: 1
      }}
    />
  </GoogleMap>
));
class PMapsArea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return <Area />;
  }
}

export default PMapsArea;
