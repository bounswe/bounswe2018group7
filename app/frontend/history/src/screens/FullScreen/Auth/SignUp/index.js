import React, { Component } from "react";
import { Snackbar } from "@material-ui/core";
import { Alert, Button } from "reactstrap";

import { connect } from "react-redux";
import { trySignin, signinReset, trySignup, signupReset } from "redux/auth/Actions.js";
// import "./index.css";
import { checkEmailValidity } from "utils";

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      emailError: "",
      password: "",
      passwordError: "",
      username: "",
      usernameError: "",
      first_name: "",
      first_nameError: "",
      last_name: "",
      last_nameError: "",
      password_confirmation: "",
      password_confirmationError: "",
      isSnackbarOpen: false
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { signupInProgress, signupHasError, signupCompleted } = nextProps.auth;

    if (!signupInProgress && signupHasError && signupCompleted) {
      return { isSnackbarOpen: true };
    }

    return prevState;
  }

  componentDidUpdate() {
    const { signupInProgress, signupHasError, signupCompleted } = this.props.auth;
    const { history } = this.props;

    if (!signupInProgress && !signupHasError && signupCompleted) {
      this.props.signupReset();
      history.push("/auth/signin");
    } else if (!signupInProgress && signupHasError && signupCompleted) {
      this.props.signupReset();
    }
  }

  render() {
    const {
      emailError,
      passwordError,
      usernameError,
      first_nameError,
      password_confirmationError,
      last_nameError
    } = this.state;
    const { signupError } = this.props.auth;

    return (
      <div className="wrapper">
        <div className="container">
          <h1>Welcome to HiStory!</h1>

          <form className="form">
            {usernameError !== "" && <Alert color="warning">{usernameError}</Alert>}
            <input
              value={this.state.username}
              onChange={event => this.setState({ username: event.target.value })}
              onFocus={() => this.setState({ usernameError: "" })}
              type="string"
              placeholder="User Name"
            />
            {emailError !== "" && <Alert color="warning">{emailError}</Alert>}
            <input
              value={this.state.email}
              onChange={event => this.setState({ email: event.target.value })}
              onFocus={() => this.setState({ emailError: "" })}
              type="email"
              placeholder="Email"
            />
            {passwordError !== "" && <Alert color="warning">{passwordError}</Alert>}
            <input
              type="password"
              onChange={event => this.setState({ password: event.target.value })}
              onFocus={() => this.setState({ passwordError: "" })}
              placeholder="Password"
              value={this.state.password}
            />
            {password_confirmationError !== "" && <Alert color="warning">{password_confirmationError}</Alert>}
            <input
              type="password"
              onChange={event => this.setState({ password_confirmation: event.target.value })}
              onFocus={() => this.setState({ password_confirmationError: "" })}
              placeholder="Confirm Password"
              value={this.state.password_confirmation}
            />
            {first_nameError !== "" && <Alert color="warning">{first_nameError}</Alert>}
            <input
              value={this.state.first_name}
              onChange={event => this.setState({ first_name: event.target.value })}
              onFocus={() => this.setState({ first_nameError: "" })}
              type="string"
              placeholder="First Name"
            />
            {last_nameError !== "" && <Alert color="warning">{last_nameError}</Alert>}
            <input
              value={this.state.last_name}
              onChange={event => this.setState({ last_name: event.target.value })}
              onFocus={() => this.setState({ last_nameError: "" })}
              type="string"
              placeholder="Last Name"
            />
            <button onClick={event => this.handleSingupSubmit(event)} id="login-button">
              Sign Up
            </button>
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
          message={<span id="message-id">{signupError}</span>}
          action={
            <Button close aria-label="Cancel" onClick={() => this.setState({ isSnackbarOpen: false })}>
              <span aria-hidden>&ndash;</span>
            </Button>
          }
        />
      </div>
    );
  }

  handleSingupSubmit(event) {
    this.setState({
      emailError: "",
      passwordError: "",
      usernameError: "",
      full_nameError: "",
      password_confirmationError: "",
      last_nameError: ""
    });

    const { email, password, username, password_confirmation, first_name, last_name } = this.state;

    if (!email || !password || !username || !password_confirmation || !first_name || !last_name) {
      if (!email) {
        this.setState({ emailError: "Please fill this area" });
      }

      if (!password) {
        this.setState({ passwordError: "Please fill this area" });
      }

      if (!username) {
        this.setState({ usernameError: "Please fill this area" });
      }
      if (!first_name) {
        this.setState({ first_nameError: "Please fill this area" });
      }
      if (!last_name) {
        this.setState({ last_nameError: "Please fill this area" });
      }
      if (!password_confirmation) {
        this.setState({ password_confirmationError: "Please fill this area" });
      }
    } else {
      if (!checkEmailValidity(email)) {
        if (password === password_confirmation) {
          this.props.trySignup(username, email, password, password_confirmation, first_name, last_name);
        } else {
          this.setState({ password_confirmationError: "Your confirmation password is not same" });
        }
      } else {
        this.setState({ emailError: "Invalid Email" });
      }
    }
    event.preventDefault();
  }
}

function bindAction(dispatch) {
  return {
    trySignin: (email, password) => dispatch(trySignin(email, password)),

    trySignup: (username, email, password, password_confirmation, first_name, last_name) =>
      dispatch(trySignup(username, email, password, password_confirmation, first_name, last_name)),
    signinReset: () => dispatch(signinReset()),
    signupReset: () => dispatch(signupReset())
  };
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  bindAction
)(SignUp);
