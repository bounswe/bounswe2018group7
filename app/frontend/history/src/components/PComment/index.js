import React, { Component } from "react";
import PropTypes from "prop-types";
import PCommentAdd from "./PCommentAdd/index";
import PCommentList from "./PCommentList";
class PComment extends Component {
  render() {
    const { comments } = this.props;

    return (
      <div>
        <PCommentList comments={comments} />
        <PCommentAdd />
      </div>
    );
  }
}

PComment.propTypes = { comments: PropTypes.array };

export default PComment;
