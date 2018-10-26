import React, { Component } from "react";
import PropTypes from "prop-types";
import PAddComment from "../PAddComment/index";

class PComment extends Component {
  render() {
    return (
      <div>
        <PAddComment />
      </div>
    );
  }
}

PComment.propTypes = {};

export default PComment;
