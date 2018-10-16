import React, { Component } from "react";
import { Button } from "reactstrap";

class XButton extends Component {
  render() {
    return (
      <div>
        <Button className={"custom-btn"} color="primary">
          primary
        </Button>{" "}
      </div>
    );
  }
}

export default XButton;
