import React, { Component } from "react";
import PropTypes from "prop-types";
import PCommentAdd from "./PCommentAdd/index";
import PCommentList from "./PCommentList";
class PComment extends Component {
  render() {
    const { comments, id } = this.props;

    // let lastComment = {
    //   id: 5,
    //   memory_post: 119,
    //   username: "KAMIL",
    //   content: "This is awesome Serdar",
    //   created: "28-11-2018 15:20:49"
    // };

    // comments.push(lastComment);

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
