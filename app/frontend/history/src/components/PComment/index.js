import React, { Component } from "react";
import PropTypes from "prop-types";
import PAddComment from "../PAddComment/index";
import Typography from "@material-ui/core/Typography";
class PComment extends Component {
  render() {
    const { data } = this.props;

    return (
      <div>
        {data.maps((element, index) => {
          return <Typography> {element.text}</Typography>;
        })}
        <PAddComment />
      </div>
    );
  }
}

PComment.propTypes = { comments: PropTypes.array.isRequired };

export default PComment;
