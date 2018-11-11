import React, { Component } from "react";
import { Button, Grid, CircularProgress, Snackbar } from "@material-ui/core";
import { connect } from "react-redux";
import { tryVerifyEmail, verifyEmailReset } from "redux/auth/Actions.js";

class Email extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSnackbarOpen: false
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { verifyEmailInProgress, verifyEmailHasError, verifyEmailCompleted } = nextProps.auth;

    if (!verifyEmailInProgress && verifyEmailHasError && verifyEmailCompleted) {
      return { isSnackbarOpen: true };
    }

    return prevState;
  }
  componentDidUpdate(prevProps, prevState) {
    const { verifyEmailInProgress, verifyEmailHasError, verifyEmailCompleted } = this.props.auth;

    if (!verifyEmailInProgress && verifyEmailHasError && verifyEmailCompleted) {
      this.props.verifyEmailReset();
    }
  }
  render() {
    const a = this.props.location.search;
    const token = a.substring(7);

    return (
      <div>
        <Grid container spacing={24}>
          <Grid item xs />
          <Grid item xs={6}>
            {!this.props.auth.signinInProgress ? (
              <Button variant="raised" color={"secondary"} onClick={() => this.props.tryVerifyEmail(token)}>
                Confirm Your Email
              </Button>
            ) : (
              <CircularProgress thickness={3} />
            )}
          </Grid>
          <Grid item xs />
        </Grid>
        <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "right"
          }}
          open={this.state.isSnackbarOpen}
          autoHideDuration={4000}
          onClose={() => this.setState({ isSnackbarOpen: false })}
          ContentProps={{
            "aria-describedby": "message-id"
          }}
          message={<span id="message-id">{this.props.auth.verifyEmailError}</span>}
          action={
            <Button close aria-label="Cancel" onClick={() => this.setState({ isSnackbarOpen: false })}>
              <span aria-hidden>&#88;</span>
            </Button>
          }
        />
      </div>
    );
  }
}
function bindAction(dispatch) {
  return {
    tryVerifyEmail: token => dispatch(tryVerifyEmail(token)),
    verifyEmailReset: () => dispatch(verifyEmailReset())
  };
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  bindAction
)(Email);
