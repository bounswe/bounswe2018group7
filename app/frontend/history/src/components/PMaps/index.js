import React, { Component } from "react";
import ReactGoogleMapLoader from "react-google-maps-loader";
import ReactGoogleMap from "react-google-map";
import PropTypes from "prop-types";

class PMaps extends Component {
  render() {
    const { latitude, longtitude, zoom } = this.props;
    var lat = latitude;
    var newLat = parseFloat(lat);

    var lng = longtitude;
    var newlng = parseFloat(lng);

    return (
      <div>
        <ReactGoogleMapLoader
          params={{
            key: "AIzaSyDHduayDw74dgAhiZeP-oby-oHd-uQGv1Q", // Define your api key here
            libraries: "places,geometry" // To request multiple libraries, separate them with a comma
          }}
          render={googleMaps =>
            googleMaps && (
              <div style={{ height: 300 }}>
                <ReactGoogleMap googleMaps={googleMaps} center={{ lat: newLat, lng: newlng }} zoom={zoom} />
              </div>
            )
          }
        />
      </div>
    );
  }
}
PMaps.propTypes = {
  longtitude: PropTypes.string,
  latitude: PropTypes.string,
  zoom: PropTypes.number
};

PMaps.defaultProps = {
  longtitude: "43.604363",
  latitude: "1.443363",
  zoom: 8
};
export default PMaps;
