import React, { Component } from "react";
import PropTypes from "prop-types";
import PCommentAdd from "./PCommentAdd/index";
import PCommentList from "./PCommentList";
class PComment extends Component {
  render() {
    const { comments, id } = this.props;

    return (
      <div>
        <PCommentList comments={comments} />
        <PCommentAdd id={id} />
      </div>
    );
  }
}

PComment.propTypes = { comments: PropTypes.array };

export default PComment;
