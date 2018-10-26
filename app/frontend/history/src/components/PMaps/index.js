import React, { Component } from "react";
import ReactGoogleMapLoader from "react-google-maps-loader";
import ReactGoogleMap from "react-google-map";
import iconMarker from "assets/marker.png";
import iconMarkerHover from "assets/markerHover.jpg";

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
          coordinates={[
            {
              title: "Toulouse",
              position: {
                lat: newLat,
                lng: newlng
              },
              onLoaded: (googleMaps, map, marker) => {
                // Set Marker animation
                marker.setAnimation(googleMaps.Animation.BOUNCE);

                // Define Marker InfoWindow
                const infoWindow = new googleMaps.InfoWindow({
                  content: `
                <div>
                  <h3>Toulouse<h3>
                  <div>
                    Toulouse is the capital city of the southwestern
                    French department of Haute-Garonne,
                    as well as of the Occitanie region.
                  </div>
                </div>
              `
                });

                // Open InfoWindow when Marker will be clicked
                googleMaps.event.addListener(marker, "click", () => {
                  infoWindow.open(map, marker);
                });

                // Change icon when Marker will be hovered
                googleMaps.event.addListener(marker, "mouseover", () => {
                  marker.setIcon(iconMarkerHover);
                });

                googleMaps.event.addListener(marker, "mouseout", () => {
                  marker.setIcon(iconMarker);
                });

                // Open InfoWindow directly
                infoWindow.open(map, marker);
              }
            }
          ]}
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
