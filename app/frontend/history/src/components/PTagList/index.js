import React, { Component } from "react";
import PropTypes from "prop-types";
import "./style.css";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { Typography } from "@material-ui/core";

class PTagList extends Component {
  render() {
    const { tags } = this.props;

    return (
      <div>
        <Grid container spacing={8}>
          {tags.map((element, index) => {
            return (
              <Grid key={index} item xs={6} sm={3}>
                <Paper elevation={1}>
                  <Typography color={"secondary"} align="center" component="p">
                    #{element}
                  </Typography>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </div>
    );
  }
}

PTagList.propTypes = {
  tags: PropTypes.array
};

export default PTagList;
