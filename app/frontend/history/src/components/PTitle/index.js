import React, { Component } from "react";
import PropTypes from "prop-types";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import "./style.css";
import { withStyles } from "@material-ui/core/styles";
import deepOrange from "@material-ui/core/colors/deepOrange";

const styles = {
  avatar: {
    margin: 10
  },
  orangeAvatar: {
    margin: 10,
    color: "#fff",
    backgroundColor: deepOrange[500]
  }
};

class PTitle extends Component {
  render() {
    const { username, creation_date, creation_time, classes } = this.props;
    return (
      <CardHeader
        avatar={
          <Avatar aria-label="Recipe" className={classes.orangeAvatar}>
            {username.charAt(0).toUpperCase()}
          </Avatar>
        }
        action={
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        }
        title={username}
        subheader={creation_date + " " + creation_time}
      />
    );
  }
}

PTitle.propTypes = {
  username: PropTypes.string,
  title: PropTypes.string,
  creation_date: PropTypes.string,
  creation_time: PropTypes.string
};

PTitle.defaultProps = {
  username: "BBA",

  creation_date: "November,29 2018",
  creation_date: "13:45"
};

export default withStyles(styles)(PTitle);
