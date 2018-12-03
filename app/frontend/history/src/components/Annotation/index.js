import React, { Component } from "react";
// import PropTypes from "prop-types";
import MeasuredImage from "./MeasuredImage";
import "./style.css";
class Annotation extends Component {
  state = { loaded: false };

  render() {
    const { content, url } = this.props;
    return (
      <div className="containerAno">
        <div className="contentAno">
          <div className={"measurements-body" + (this.state.loaded ? " loaded" : "")}>
            <MeasuredImage url={url} onImageLoaded={this.onImageLoaded} />
          </div>
        </div>
      </div>
    );
  }

  onImageLoaded = () => this.setState({ ...this.state, loaded: true });
}

// Annotation.propTypes = {};

export default Annotation;
