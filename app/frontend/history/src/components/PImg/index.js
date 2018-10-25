import React, { Component } from "react";
import PropTypes from "prop-types";
import Img from "react-image";

class PImg extends Component {
  render() {
    const { url } = this.props;
    return (
      <div>
        <Img src={url} />
      </div>
    );
  }
}

PImg.propTypes = {
  url: PropTypes.string
};

PImg.defaultProps = {
  url: "https://pbs.twimg.com/media/DhHiz70X4AMzadT.jpg"
};
export default PImg;
