import React, { Component } from "react";
import Header from "components/Header/Header.jsx";
import HeaderLinks from "components/Header/HeaderLinks.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Parallax from "components/Parallax/Parallax.jsx";
import componentsStyle from "assets/jss/material-kit-react/views/components.jsx";
import Footer from "components/Footer/Footer.jsx";
import DeleteIcon from "@material-ui/icons/Delete";
import { connect } from "react-redux";
import { createPost, createPostReset } from "redux/post/Actions";

import { Grid, TextField, Button, IconButton, Dialog, DialogTitle, CircularProgress } from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";
import classNames from "classnames";
import DatePicker from "../../../components/DatePicker";
import DateTime from "../../../components/DateTime";
import PMaps from "components/PMaps";
import PTag from "../../../components/PTag";
import { withSnackbar } from "notistack";
import Tags from "../../../components/Tag";

class CreatePost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      //time
      timeType: "",
      generalTime: "",
      certainTime: "",
      //map
      mapType: "",
      certainLoc: "",
      isMarkerShown: false,
      isloaderOpen: false,
      storyText: "",

      //tags
      tags: []
    };
  }

  handleDelete(i) {
    const { tags } = this.state;
    this.setState({
      tags: tags.filter((tag, index) => index !== i)
    });
  }

  handleAddition = tag => {
    this.setState(state => ({ tags: [...state.tags, tag] }));
  };

  handleDrag = (tag, currPos, newPos) => {
    const tags = [...this.state.tags];
    const newTags = tags.slice();

    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);

    // re-render
    this.setState({ tags: newTags });
  };

  componentDidMount() {
    this.delayedShowMarker();
  }

  delayedShowMarker = () => {
    setTimeout(() => {
      this.setState({ isMarkerShown: true });
    }, 3000);
  };

  handleMarkerClick = () => {
    this.setState({ isMarkerShown: true });
    this.delayedShowMarker();
  };

  handleCreatePost = () => {
    let tags = Object.values(this.state.tags);

    if (this.state.title && this.state.storyText) {
      this.setState({ isloaderOpen: true });
      this.props.createPost(this.state.title, '{"general":"1900s"}', '[{"type": "region", "name": "Istanbul"}]', [
        { "story[0]": this.state.storyText },
        tags
      ]);
    } else {
      this.props.enqueueSnackbar("Title and Stories are required", { variant: "warning" });
    }
  };

  componentDidUpdate(prevProps, prevState) {
    const { createPostInProgress, createPostHasError, createPostCompleted, createPostError } = this.props.post;

    if (!createPostInProgress && !createPostHasError && createPostCompleted) {
      this.props.createPostReset();
      setTimeout(() => this.setState({ isloaderOpen: false }), 1000);
    } else if (!createPostInProgress && createPostHasError && createPostCompleted) {
      this.props.enqueueSnackbar(createPostError, { variant: "warning" });
      this.props.createPostReset();
      setTimeout(() => this.setState({ isloaderOpen: false }), 1000);
    }
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  handleChangeCertainTime = m => {
    this.setState({ m });
  };

  handleSaveCertainTime = () => {
    console.log("saved", this.state.m.format("llll"));
  };

  render() {
    const { classes, history, ...rest } = this.props;
    return (
      <div>
        <Header
          brand="HiStory"
          rightLinks={<HeaderLinks history={history} />}
          fixed
          color="transparent"
          changeColorOnScroll={{
            height: 400,
            color: "hs"
          }}
          {...rest}
        />
        <Parallax image={require("assets/img/bg7.jpg")}>
          <div className={classes.container}>
            <GridContainer>
              <GridItem>
                <div className={classes.brand}>
                  <h1 className={classes.title}>Create a new post...</h1>
                </div>
              </GridItem>
            </GridContainer>
          </div>
        </Parallax>
        {/* <Tags /> */}
        <div className={classNames(classes.main, classes.mainRaised)}>
          <Grid container spacing={24}>
            <Grid item xs={6} sm={3} />
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="outlined-name"
                label="Title"
                className={classes.textField}
                value={this.state.title}
                onChange={this.handleChange("title")}
                margin="normal"
                variant="outlined"
              />
            </Grid>

            <Grid item xs={6} sm={3} />
          </Grid>

          <Grid container spacing={24}>
            <Grid item xs={6} sm={3} />
            <Grid item xs={12} sm={6}>
              <Button variant="outlined" color="secondary" onClick={() => this.setState({ timeType: "interval" })}>
                Interval Time
              </Button>
              <Button variant="outlined" color="inherit" onClick={() => this.setState({ timeType: "general" })}>
                General Time
              </Button>

              <Button variant="outlined" color="primary" onClick={() => this.setState({ timeType: "certain" })}>
                Certain Time
              </Button>

              <IconButton
                aria-label="Delete"
                className={classes.button}
                onClick={() => this.setState({ timeType: "" })}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Grid>

            <Grid item xs={6} sm={3} />
          </Grid>

          {this.state.timeType == "certain" ? (
            <Grid container spacing={24}>
              <Grid item xs={6} sm={3} />

              <Grid item xs={12} sm={6}>
                <DateTime />
              </Grid>
              <Grid item xs={6} sm={3} />
            </Grid>
          ) : null}
          {this.state.timeType == "interval" ? (
            <Grid container spacing={24}>
              <Grid item xs={6} sm={3} />

              <Grid item xs={6} sm={3}>
                <DatePicker title={"Start Date"} />
              </Grid>
              <Grid item xs={6} sm={3}>
                <DatePicker title={"End Date"} />
              </Grid>
              <Grid item xs={6} sm={3} />
            </Grid>
          ) : null}
          {this.state.timeType == "general" ? (
            <Grid container spacing={24}>
              <Grid item xs={6} sm={3} />

              <Grid item xs={6} sm={3}>
                <TextField
                  fullWidth
                  id="outlined-name"
                  label="General Time"
                  className={classes.textField}
                  value={this.state.generalTime}
                  onChange={this.handleChange("generalTime")}
                  margin="normal"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={6} sm={3} />
            </Grid>
          ) : null}

          <Grid container spacing={24}>
            <Grid item xs={6} sm={3} />
            <Grid item xs={12} sm={6}>
              <Button variant="outlined" color="primary" onClick={() => this.setState({ mapType: "certain" })}>
                Add Certain Location
              </Button>
              <Button variant="outlined" color="secondary" onClick={() => this.setState({ mapType: "path" })}>
                Add Path Location
              </Button>
              <Button variant="outlined" color="inherit" onClick={() => this.setState({ mapType: "area" })}>
                Add Area Location
              </Button>
              <IconButton aria-label="Delete" className={classes.button} onClick={() => this.setState({ mapType: "" })}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Grid>
            <Grid item xs={6} sm={3} />
          </Grid>

          {this.state.mapType == "certain" ? (
            <Grid container spacing={24}>
              <Grid item xs={6} sm={3} />

              <Grid item xs={12} sm={6}>
                <PMaps isMarkerShown={this.state.isMarkerShown} onMarkerClick={this.handleMarkerClick} />
              </Grid>
              <Grid item xs={6} sm={3} />
            </Grid>
          ) : null}

          <Grid container spacing={24}>
            <Grid item xs={6} sm={3} />
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="outlined-multiline-static"
                label="Your story text"
                multiline
                rows="10"
                className={classes.textField}
                margin="normal"
                variant="outlined"
                value={this.state.storyText}
                onChange={this.handleChange("storyText")}
              />
            </Grid>

            <Grid item xs={6} sm={3} />
          </Grid>
          <Grid container spacing={24}>
            <Grid item xs={6} sm={3} />
            <Grid item xs={12} sm={6}>
              <PTag
                tags={this.state.tags}
                handleDelete={this.handleDelete}
                handleAddition={this.handleAddition}
                handleDrag={this.handleDrag}
              />
            </Grid>

            <Grid item xs={6} sm={3} />
          </Grid>

          <Grid container spacing={24}>
            <Grid item xs={6} sm={3} />
            <Grid item xs={12} sm={6}>
              <Button onClick={() => this.handleCreatePost()} variant="contained" color="secondary">
                Send the Post
              </Button>
            </Grid>

            <Grid item xs={6} sm={3} />
          </Grid>
        </div>
        <Dialog
          maxWidth={"xs"}
          fullWidth
          aria-labelledby="simple-dialog-title"
          open={this.state.isloaderOpen}
          onClose={() => this.setState({ isloaderOpen: false })}
        >
          <DialogTitle id="loading-add-estate-dialog-title">Yükleniyor</DialogTitle>
          <div style={{ justifyContent: "center", alignItems: "center" }}>
            <CircularProgress />
          </div>
        </Dialog>

        <Footer />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  post: state.post
});

const bindAction = dispatch => ({
  createPost: (title, time, location, stories, tags) => dispatch(createPost(title, time, location, stories, tags)),
  createPostReset: () => dispatch(createPostReset())
});

export default connect(
  mapStateToProps,
  bindAction
)(withStyles(componentsStyle)(withSnackbar(CreatePost)));
