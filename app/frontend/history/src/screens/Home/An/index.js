import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchAnnotate, fetchAnnotateReset } from "redux/post/Actions.js";
import { CircularProgress, Typography, Paper } from "@material-ui/core";
import purple from "@material-ui/core/colors/purple";

class An extends Component {
  componentDidMount() {
    this.props.fetchAnnotate();
  }

  render() {
    const { annotateList } = this.props.post;
    if (!annotateList)
      return (
        <div style={{ justifyContent: "center", display: "flex" }}>
          <CircularProgress style={{ color: purple[500] }} thickness={7} />
        </div>
      );
    else
      return (
        <div style={{ padding: 200, backgroundColor: "whitesmoke" }}>
          <Typography style={{ marginLeft: 100 }} variant="display1" gutterBottom>
            Annotations Lists
          </Typography>
          {annotateList
            .slice(0)
            .reverse()
            .map(annotate => (
              <Paper style={{ padding: 30, margin: 30 }}>
                <Typography>iD : {annotate.id}</Typography>
                <Typography>Type : {annotate.body.type}</Typography>

                <Typography> Creator : {annotate.creator}</Typography>
                <Typography>Generated : {annotate.generated}</Typography>

                <Typography variant="headline" style={{ backgroundColor: "yellow" }}>
                  Highlighted Message: {annotate.target.selector ? annotate.target.selector.exact : ""}
                </Typography>

                <Typography variant="headline">Annotation Message : {annotate.body.value}</Typography>
              </Paper>
            ))}
        </div>
      );
  }
}

const mapDispatchToProps = {
  fetchAnnotate,
  fetchAnnotateReset
};

const mapStateToProps = state => ({
  post: state.post
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(An);
