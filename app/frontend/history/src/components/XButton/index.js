import React, { Component } from "react";
import { Button } from "reactstrap";
import PropTypes from "prop-types";

class XButton extends Component {
  render() {
    const { color } = this.props;
    return (
      <div>
       <Button color="primary">primary</Button>

      </div>
    );
  }
}

XButton.propTypes = {
  color: PropTypes.oneOf(["warning", "success", "danger", "info", "primary", "secondary", "dark", "light"])
};

export default XButton;
