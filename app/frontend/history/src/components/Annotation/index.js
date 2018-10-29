import React, { Component } from "react";
// import PropTypes from "prop-types";
import MeasuredImage from "./MeasuredImage";
import "./style.css";
class Annotation extends Component {
  state = { loaded: false };

  render() {
    const { content } = this.props;
    return (
      <div className="container">
        <div className="content">
          <div className={"measurements-body" + (this.state.loaded ? " loaded" : "")}>
            <div>
              <MeasuredImage content={content} onImageLoaded={this.onImageLoaded} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  onImageLoaded = () => this.setState({ ...this.state, loaded: true });
}

// Annotation.propTypes = {};

export default Annotation;
