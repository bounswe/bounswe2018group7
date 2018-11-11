import React, { Component } from "react";
import Header from "components/Header/Header.jsx";
import HeaderLinks from "components/Header/HeaderLinks.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Parallax from "components/Parallax/Parallax.jsx";
import componentsStyle from "assets/jss/material-kit-react/views/components.jsx";
import Footer from "components/Footer/Footer.jsx";
import DeleteIcon from "@material-ui/icons/Delete";

import { Grid, TextField, Button, IconButton, Typography } from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";
import InputMoment from "input-moment";
import classNames from "classnames";
import DatePicker from "../../../components/DatePicker";
import DateTime from "../../../components/DateTime";
import PMaps from "components/PMaps";

class CreatePost extends Component {
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
      isMarkerShown: false
    };
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
              <Button variant="outlined" color="warn" onClick={() => this.setState({ timeType: "general" })}>
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
              <Button variant="outlined" color="warn" onClick={() => this.setState({ mapType: "area" })}>
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
              />
            </Grid>

            <Grid item xs={6} sm={3} />
          </Grid>

          <Grid container spacing={24}>
            <Grid item xs={6} sm={3} />
            <Grid item xs={12} sm={6}>
              <Button variant="contained" color="secondary">
                Send the Post
              </Button>
            </Grid>

            <Grid item xs={6} sm={3} />
          </Grid>
        </div>
        <Footer />
      </div>
    );
  }
}

export default withStyles(componentsStyle)(CreatePost);
