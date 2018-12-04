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
import PMapsDest from "components/PMaps/DestinationMaps";
import PMapsArea from "components/PMaps/Area";
import PTag from "../../../components/PTag";
import { withSnackbar } from "notistack";
import { PARSE } from "../../../utils/parsingStory";

import { Upload, Modal, Button as ButtonX, Icon as IconX } from "antd";

import "./index.css";
// import Tags from "../../../components/Tag";
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
      locGlobal: [],
      //tags
      tags: [],
      fileList: [],
      uploading: false,
      previewVisible: false,
      previewImage: ""
    };
  }

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true
    });
  };
  handleUploadChange = ({ fileList }) => {
    // console.log(fileList);
    // this.setState({ fileList });
  };

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
    const script = document.createElement("script");

    script.src = "./image.js";
    script.async = true;

    document.body.appendChild(script);
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
    var storyArray = PARSE(this.state.storyText, this.state.fileList);

    const date = this.myCreateDateRef.getDate();

    let dateObj = { type: this.state.timeType, data: date.date };

    let tagArr = [];
    this.state.tags.forEach(element => {
      tagArr.push(element.text);
    });

    if (this.state.title && this.state.storyText) {
      this.setState({ isloaderOpen: true });
      this.props.createPost(
        this.state.title,
        JSON.stringify(dateObj),
        JSON.stringify(this.state.locGlobal),
        storyArray,
        JSON.stringify(tagArr)
      );
    } else {
      this.props.enqueueSnackbar("Title and Stories are required", { variant: "warning" });
    }
  };

  componentDidUpdate(prevProps, prevState) {
    const { createPostInProgress, createPostHasError, createPostCompleted, createPostError } = this.props.post;

    if (!createPostInProgress && !createPostHasError && createPostCompleted) {
      this.props.createPostReset();
      setTimeout(() => this.setState({ isloaderOpen: false }), 1000);
      this.props.enqueueSnackbar("YOUR POST CREATED :) ", { variant: "success" });

      this.props.history.replace("../");
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
  handleMap() {
    if (this.state.mapType === "certain") {
      const location = this.myCreateMapRef.getLocation();
      this.setState({
        locGlobal: [{ type: this.state.mapType, points: [{ lat1: location.lat, lng1: location.lng }] }]
      });
    } else if (this.state.mapType === "path") {
      const locationDest = this.myCreateMapDestRef.getLocation();
      this.setState({
        locGlobal: [
          {
            type: this.state.mapType,
            points: [
              { lat1: locationDest.lat1, lng1: locationDest.lng1 },
              { lat2: locationDest.lat2, lng2: locationDest.lng2 }
            ]
          }
        ]
      });
    } else if (this.state.mapType === "area") {
      const locationArea = this.myCreateMapAreaRef.getLocation();
      console.log("​handleCreatePost -> locationArea", locationArea);
      this.setState({
        locGlobal: [{ type: this.state.mapType, points: locationArea.coords }]
      });
    }
    console.log(this.state.locGlobal);
  }

  render() {
    const { classes, history, ...rest } = this.props;
    const { previewVisible, previewImage } = this.state;
    const uploadButton = (
      <div>
        <IconX type="plus" />
        <div className="ant-upload-text">Upload Media</div>
      </div>
    );
    const props = {
      action: file => {
        Promise.resolve();
      },
      onRemove: file => {
        this.setState(({ fileList }) => {
          const index = fileList.indexOf(file);
          const newFileList = fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList
          };
        });
      },
      beforeUpload: file => {
        this.setState(({ fileList }) => ({
          fileList: [...fileList, file]
        }));

        return false;
      },
      fileList: this.state.fileList,
      listType: "picture-card",
      onPreview: this.handlePreview,
      onChange: this.handleUploadChange
    };

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
          <div style={{ width: 500 }}>
            <br />
          </div>

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
                Interval Date
              </Button>
              <Button variant="outlined" color="inherit" onClick={() => this.setState({ timeType: "general" })}>
                General Date
              </Button>
              <Button variant="outlined" color="primary" onClick={() => this.setState({ timeType: "certain" })}>
                Certain Date
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

          {this.state.timeType === "certain" ? (
            <Grid container spacing={24}>
              <Grid item xs={6} sm={3} />

              <Grid item xs={12} sm={6}>
                <DateTime dateRef={el => (this.myCreateDateRef = el)} />
              </Grid>
              <Grid item xs={6} sm={3} />
            </Grid>
          ) : null}

          {this.state.timeType === "interval" ? (
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

          {this.state.timeType === "general" ? (
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
              <Button aria-label="ok" className={classes.button} onClick={() => this.handleMap()}>
                Save Map
              </Button>
            </Grid>
            <Grid item xs={6} sm={3} />
          </Grid>

          {this.state.mapType === "certain" ? (
            <Grid container spacing={24}>
              <Grid item xs={6} sm={3} />

              <Grid item xs={12} sm={6}>
                <PMaps
                  isMarkerShown={this.state.isMarkerShown}
                  onMarkerClick={this.handleMarkerClick}
                  mapRef={el => (this.myCreateMapRef = el)}
                />
              </Grid>
              <Grid item xs={6} sm={3} />
            </Grid>
          ) : null}

          {this.state.mapType === "path" ? (
            <Grid container spacing={24}>
              <Grid item xs={6} sm={3} />
              <Grid item xs={12} sm={6}>
                <PMapsDest mapDestRef={el => (this.myCreateMapDestRef = el)} />
              </Grid>
              <Grid item xs={6} sm={3} />
            </Grid>
          ) : null}

          {this.state.mapType === "area" ? (
            <Grid container spacing={24}>
              <Grid item xs={6} sm={3} />
              <Grid item xs={12} sm={6}>
                <PMapsArea
                  googleMapURL={"https://maps.googleapis.com/maps/api/js?key=AIzaSyDHduayDw74dgAhiZeP-oby-oHd-uQGv1Q"}
                  loadingElement={<div style={{ height: `100%` }} />}
                  containerElement={<div style={{ height: `400px` }} />}
                  mapElement={<div style={{ height: `100%` }} />}
                  mapAreaRef={el => (this.myCreateMapAreaRef = el)}
                />
              </Grid>
              <Grid item xs={6} sm={3} />
            </Grid>
          ) : null}

          <Grid container spacing={24}>
            <Grid item xs={6} sm={3} />
            <Grid item xs={12} sm={6}>
              <Upload {...props}>
                <div
                  onClick={() =>
                    this.setState(prevState => ({ storyText: prevState.storyText.concat("\n***[media]***") }))
                  }
                >
                  {this.state.fileList.length >= 3 ? null : uploadButton}
                </div>
              </Upload>
              <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                <img alt="example" style={{ width: "100%" }} src={previewImage} />
              </Modal>
            </Grid>
            <Grid item xs={6} sm={3} />
          </Grid>

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
