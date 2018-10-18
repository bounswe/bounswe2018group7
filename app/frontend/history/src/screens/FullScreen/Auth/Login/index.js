import React, { Component } from "react";
import { Snackbar } from "@material-ui/core";
import { Alert, Button } from "reactstrap";
import CircularProgress from "@material-ui/core/CircularProgress";

import { connect } from "react-redux";
import { trySignin, signinReset } from "redux/auth/Actions.js";
import "./index.css";
import { setCookie, getCookie, LOGGEDIN_COOKIE, TOKEN_COOKIE, USER_COOKIE } from "utils/cookies.js";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      emailError: "",
      password: "",
      passwordErrowr: "",
      isSnackbarOpen: false
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { signinInProgress, signinHasError, signinCompleted } = nextProps.auth;

    if (!signinInProgress && signinHasError && signinCompleted) {
      return { isSnackbarOpen: true };
    }

    return prevState;
  }

  componentDidMount() {
    const { history } = this.props;

    const loggedIn = getCookie(LOGGEDIN_COOKIE);
    if (loggedIn) return history.push("/home");
  }

  componentDidUpdate(prevProps, prevState) {
    const { history } = this.props;
    const { signinInProgress, signinHasError, signinCompleted, token, user, loggedIn } = this.props.auth;

    if (signinInProgress && !signinHasError && !signinCompleted) {
      //TODO: do some acitivity indicator
    } else if (!signinInProgress && !signinHasError && signinCompleted) {
      setCookie(TOKEN_COOKIE, token, { path: "/" });
      setCookie(USER_COOKIE, user, { path: "/" });
      setCookie(LOGGEDIN_COOKIE, loggedIn, { path: "/" });
      this.props.signinReset();
      history.push("/home");
    } else if (!signinInProgress && signinHasError && signinCompleted) {
      this.props.signinReset();
    }
  }

  render() {
    const { emailError, passwordError } = this.state;
    const { signinError } = this.props.auth;

    return (
      <div className="wrapper">
        <div className="container">
          <h1>Welcome to HiStory!</h1>

          <form className="form">
            {emailError !== "" && <Alert color="warning">{emailError}</Alert>}
            <input
              value={this.state.email}
              onChange={event => this.setState({ email: event.target.value })}
              // onFocus={() => this.setState({ emailError: "" })}
              type="email"
              placeholder="Email | Username"
            />
            {passwordError !== "" && <Alert color="warning">{passwordError}</Alert>}
            <input
              type="password"
              onChange={event => this.setState({ password: event.target.value })}
              onFocus={() => this.setState({ passwordError: "" })}
              placeholder="Password"
              value={this.state.password}
            />
            {!this.props.auth.signinInProgress ? (
              <button onClick={event => this.handleLoginSubmit(event)} id="login-button">
                Login
              </button>
            ) : (
              <CircularProgress thickness={3} />
            )}
          </form>
        </div>

        <ul className="bg-bubbles">
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
        </ul>

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
          message={<span id="message-id">{signinError}</span>}
          action={
            <Button close aria-label="Cancel" onClick={() => this.setState({ isSnackbarOpen: false })}>
              <span aria-hidden>&#88;</span>
            </Button>
          }
        />
      </div>
    );
  }

  handleLoginSubmit(event) {
    this.setState({ emailError: "", passwordError: "" });
    const { email, password } = this.state;
    if (email && password) {
      if (email.length > 3) {
        this.props.trySignin(email, password);
      } else {
        this.setState({ emailError: "Invalid Email | Username (Min 3 character) " });
      }
    } else {
      if (!email && !password) {
        this.setState({ emailError: "Please fill this area", passwordError: "Please fill this area" });
      } else if (!email) {
        this.setState({ emailError: "Please fill this area" });
      } else if (!password) {
        this.setState({ passwordError: "Please fill this area" });
      }
    }
    event.preventDefault();
  }
}

function bindAction(dispatch) {
  return {
    trySignin: (email, password) => dispatch(trySignin(email, password)),
    signinReset: () => dispatch(signinReset())
  };
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  bindAction
)(Login);
