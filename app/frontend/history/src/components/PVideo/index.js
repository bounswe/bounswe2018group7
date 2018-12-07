import React, { Component } from "react";
import { Player } from "video-react";
import PropTypes from "prop-types";
import "./style.css";
import "../../../node_modules/video-react/dist/video-react.css"; // import css
class PVideo extends Component {
  render() {
    const { url } = this.props;
    return (
      <div>
        <Player className={"videoStyle"} playsInline src={url} />
      </div>
    );
  }
}
//URL AND POSTER MUST START WITH HTTP NOT STATIC FILE
PVideo.propTypes = {
  poster: PropTypes.string,
  url: PropTypes.string
};

PVideo.defaultProps = {
  url: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4"
};

export default PVideo;
