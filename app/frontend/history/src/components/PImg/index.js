import React, { Component } from "react";
import PropTypes from "prop-types";
import Img from "react-image";
import "./style.css";
import Dialog from "../Dialog/index";

class PImg extends Component {
  render() {
    const { url, content } = this.props;
    return (
      <div className={"imgDivStyle"}>
        <Img className={"imgStyle"} src={url} />
        <Dialog url={url} />
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
