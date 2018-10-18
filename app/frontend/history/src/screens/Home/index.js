import React, { Component } from "react";
import { connect } from "react-redux";

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
import { Link } from "react-router-dom";
import { Button } from 'reactstrap';
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
        <Button color={'primary'} text={'blabla'} onClick={this.signOut}>
          Log Out
        </Button>
        <Link to="/auth/login">
          <Button>Login</Button>
        </Link>
        <Link to="/auth/signup">
          <Button>Signup</Button>
        </Link>
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
