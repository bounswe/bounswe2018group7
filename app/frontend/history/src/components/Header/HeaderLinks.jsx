/*eslint-disable*/
// react components for routing our app without refresh
// import { Link } from "react-router-dom";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
// import Tooltip from "@material-ui/core/Tooltip";
import { signout } from "redux/auth/Actions";

// @material-ui/icons
import { Https, Person, ExitToApp, PersonAdd, Create } from "@material-ui/icons";
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

// core components
// import CustomDropdown from "componentsCustomDropdown/CustomDropdown.jsx";
import CustomButton from "components/CustomButtons/Button.jsx";

import headerLinksStyle from "assets/jss/material-kit-react/components/headerLinksStyle.jsx";

import React, { Component } from "react";
import { Button } from "@material-ui/core";

class HeaderLinks extends Component {
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
  signOut() {
    this.props.signout();
    removeCookie(TOKEN_COOKIE);
    removeCookie(USER_COOKIE);
    removeCookie(LOGGEDIN_COOKIE);
  }

  render() {
    const { classes } = this.props;

    if (this.props.auth.user.username) {
      return (
        <List className={classes.list}>
          <ListItem className={classes.listItem}>
            <CustomButton href="home/createpost" color="transparent" className={classes.navLink}>
              <Create className={classes.icons} /> Create Post
            </CustomButton>
          </ListItem>

          <ListItem className={classes.listItem}>
            <CustomButton color="transparent" className={classes.navLink}>
              <Person className={classes.icons} /> {this.props.auth.user.username}
            </CustomButton>
          </ListItem>
          <ListItem className={classes.listItem}>
            <Button onClick={() => this.signOut()} color="transparent" className={classes.navLink}>
              <ExitToApp className={classes.icons} /> Log Out
            </Button>
          </ListItem>
        </List>
      );
    } else
      return (
        <List className={classes.list}>
          <ListItem className={classes.listItem}>
            <CustomButton href="../auth/signin" color="transparent" className={classes.navLink}>
              <Https className={classes.icons} /> Login
            </CustomButton>
          </ListItem>
          <ListItem className={classes.listItem}>
            <CustomButton href="../auth/signup" color="transparent" className={classes.navLink}>
              <PersonAdd className={classes.icons} /> Sign Up
            </CustomButton>
          </ListItem>
        </List>
      );
  }

  onCookieChanged = cookie => {
    console.log("clicked II");
    if (cookie.name === LOGGEDIN_COOKIE && !cookie.value) {
      this.props.history.replace("../auth/signin");
    }
  };
}

const bindAction = dispatch => {
  return {
    signout: () => dispatch(signout())
  };
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  bindAction
)(withStyles(headerLinksStyle)(HeaderLinks));
