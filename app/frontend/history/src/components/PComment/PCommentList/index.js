import React, { Component } from "react";
import PropTypes from "prop-types";
import { Typography } from "@material-ui/core";

class PCommentList extends Component {
  render() {
    const { comments } = this.props;
    return (
      <div>
        {comments.map((comment, index) => {
          return <Typography key={index}> {comment.text}</Typography>;
        })}
      </div>
    );
  }
}

PCommentList.propTypes = {
  comments: PropTypes.array
};

export default PCommentList;
