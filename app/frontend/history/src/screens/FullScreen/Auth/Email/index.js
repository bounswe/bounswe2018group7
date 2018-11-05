import React, { Component } from "react";
import { Button } from "@material-ui/core";
import { connect } from "react-redux";
import { tryVerifyEmail } from "redux/auth/Actions.js";

class Email extends Component {
  render() {
    const a = this.props.location.search;
    const token = a.substring(7);

    return (
      <div>
        <Button onClick={() => this.props.tryVerifyEmail(token)}>Confirm Your Email</Button>
      </div>
    );
  }
}
function bindAction(dispatch) {
  return {
    tryVerifyEmail: token => dispatch(tryVerifyEmail(token))
  };
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  bindAction
)(Email);
