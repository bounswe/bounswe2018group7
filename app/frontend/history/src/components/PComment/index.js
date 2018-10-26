import React from "react";
import PropTypes from "prop-types";
import PTextInput from "components/PTextInput";
import CustomButtons from "components/CustomButtons/Button";

class PComment extends React.Component {
  render() {
    const { comments } = this.props;
    return (
      <div>
        <PTextInput
          value={comments}
          onChange={event => this.setState({ comments: event.target.value })}
          label={"Your Comments"}
          multiline
          rows={5}
          fullWidth
        />
        <CustomButtons>Add Comment</CustomButtons>
      </div>
    );
  }
}

PComment.propTypes = {
  comments: PropTypes.string
};

PComment.defaultProps = {
  comments: "This is awesome place for visiting"
};
export default PComment;
