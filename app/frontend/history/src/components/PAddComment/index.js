import React from "react";
import PropTypes from "prop-types";
import PTextInput from "components/PTextInput";
import CustomButtons from "components/CustomButtons/Button";

class PAddComment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      commentText: "Başka söze gerek yok, Mükemmel ! "
    };
  }

  render() {
    const {} = this.props;
    return (
      <div>
        <PTextInput
          value={commentText}
          onChange={event => this.setState({ commentText: event.target.value })}
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

export default PAddComment;
