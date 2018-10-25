import React, { Component } from "react";
import { Player } from "video-react";
import PropTypes from "prop-types";

import "../../../node_modules/video-react/dist/video-react.css"; // import css
class PVideo extends Component {
  render() {
    const { poster, url } = this.props;
    return (
      <div>
        <Player playsInline poster={poster} src={url} />
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
  poster: "http://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/file-video-icon.png",
  url: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4"
};

export default PVideo;
