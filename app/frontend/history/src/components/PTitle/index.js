import React, { Component } from "react";
import PropTypes from "prop-types";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import FavoriteIcon from "@material-ui/icons/Favorite";
import AnnotateImage from "@material-ui/icons/AspectRatio";
import "./style.css";
import { withStyles } from "@material-ui/core/styles";
import deepOrange from "@material-ui/core/colors/deepOrange";
import { Typography } from "@material-ui/core";

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
    const { username, creation_date, creation_time, classes, like } = this.props;
    return (
      <CardHeader
        avatar={
          <Avatar aria-label="Recipe" className={classes.orangeAvatar}>
            {username.charAt(0).toUpperCase()}
          </Avatar>
        }
        action={
          <div>
            <IconButton aria-label="Add to favorites">
              <FavoriteIcon />
              <Typography style={{ margin: 3 }}>{like}</Typography>
            </IconButton>
            <IconButton aria-label="Add Annotate">
              <AnnotateImage />
              <Typography style={{ margin: 3 }}>Annotate</Typography>
            </IconButton>
          </div>
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
  creation_time: PropTypes.string,
  like: PropTypes.number
};

PTitle.defaultProps = {
  username: "BBA",

  creation_date: "November,29 2018",
  creation_date: "13:45",
  like: 123
};

export default withStyles(styles)(PTitle);
