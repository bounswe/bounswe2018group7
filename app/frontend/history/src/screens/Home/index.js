import React, { Component } from "react";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import {
  removeCookie,
  getCookie,
  addCookieListener,
  removeCookieListener,
  LOGGEDIN_COOKIE,
  TOKEN_COOKIE,
  USER_COOKIE
} from "utils/cookies.js";
import { signout } from "redux/auth/Actions";

class Home extends Component {
  constructor(props) {
    super(props);

    this.user = getCookie(USER_COOKIE);
  }

  componentDidMount() {
    addCookieListener(this.onCookieChanged);
  }

  componentWillUnmount() {
    removeCookieListener(this.onCookieChanged);
  }

  render() {
    return (
      <div>
        Home
        <Button onClick={this.signOut} variant="contained" color="primary">
          Log Out
        </Button>
      </div>
    );
  }

  signOut = () => {
    this.props.signout();
    removeCookie(TOKEN_COOKIE);
    removeCookie(USER_COOKIE);
    removeCookie(LOGGEDIN_COOKIE);
  };

  onCookieChanged = cookie => {
    if (cookie.name === LOGGEDIN_COOKIE && !cookie.value) {
      this.props.history.replace("/auth/login");
    }
  };
}

const bindAction = dispatch => {
  return {
    signout: () => dispatch(signout())
  };
};

export default connect(
  null,
  bindAction
)(Home);
