import React, { Component } from "react";
import PropTypes from "prop-types";
import AudioPlayer from "react-h5-audio-player";
import "./style.css";
class PSound extends Component {
  render() {
    const { url } = this.props;
    return (
      <div className="soundStyle">
        <AudioPlayer
          src={url}
          onPlay={e => console.log("onPlay")}
          // other props here
        />
      </div>
    );
  }
}

PSound.propTypes = {
  url: PropTypes.string
};

PSound.defaultProps = {
  url:
    "http://www.diyanetradyo.com/resim_arsivi/icerik_galerisi/5+1-yarisma-85wb5x8f33/256---5+1-Yarisma---04.12.2017-18667280.mp3"
};
export default PSound;
