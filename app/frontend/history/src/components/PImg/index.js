import React, { Component } from "react";
import PropTypes from "prop-types";
import Img from "react-image";
import "./style.css";
class PImg extends Component {
  render() {
    const { url } = this.props;
    return <Img className={"imgStyle"} src={url} />;
  }
}

PImg.propTypes = {
  url: PropTypes.string
};

PImg.defaultProps = {
  url: "https://pbs.twimg.com/media/DhHiz70X4AMzadT.jpg"
};
export default PImg;
