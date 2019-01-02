import React, { Component } from "react";

import { Main, Bar, Button } from "./ui";
import Popover from "react-text-selection-popover";
import placeRightBelow from "react-text-selection-popover/lib/placeRightBelow";
import Draggable from "react-draggable";
import "./style.css";
import { Dialog, Icon, Typography, TextField } from "@material-ui/core";
import { withSnackbar } from "notistack";
import AnnotateImage from "@material-ui/icons/AspectRatio";
import IconButton from "@material-ui/core/IconButton";
import { createAnnotate, createAnnotateReset } from "../../redux/post/Actions";
import { connect } from "react-redux";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
function Transition(props) {
  return <Slide direction="up" {...props} />;
}
class PostTexture extends Component {
  constructor(props) {
    super(props);
    this.refParagraph = React.createRef();
    this.refCode = React.createRef();
    this.scrollRef = React.createRef();
    this.state = {
      selected: null,
      isOpen: false,
      openDialog: false,
      mes: "",
      exact: ""
    };
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };
  handleClickOpen = () => {
    this.setState({ openDialog: true });
  };

  handleClose = () => {
    console.log("this.state.mes :", this.state.mes);
    console.log("this.state.Ex :", this.state.exact);
    let body = {
      type: "TextualBody",
      value: this.state.mes
    };
    let target = {
      source: "http://history-backend.herokuapp.com/api/v1/memory_posts/5",
      selector: {
        type: "TextQuoteSelector",
        exact: this.state.exact,
        prefix: " ",
        suffix: " "
      }
    };
    this.props.createAnnotate(body, target);
    this.props.enqueueSnackbar("ADDED ANNOTATE", { variant: "success" });
    this.setState({ openDialog: false });
  };

  componentDidUpdate(prevProps, prevState) {
    const { createAnnotateInProgress, createAnnotateHasError, createAnnotateCompleted } = this.props.post;

    if (!createAnnotateInProgress && createAnnotateHasError && createAnnotateCompleted) {
      this.props.createAnnotateReset();
    }
  }

  render() {
    return (
      <div>
        <div ref={this.refParagraph}>{this.props.texture}</div>
        <Popover
          className={"popoverstyle"}
          selectionRef={this.refParagraph}
          isOpen={this.state.isOpen}
          onTextSelect={() => {
            this._popUp();
          }}
          onTextUnselect={() => this.setState({ isOpen: false })}
          scrollRef={this.refParagraph}
        >
          <div style={{ backgroundColor: "yellow", borderRadius: 10 }}>
            <IconButton onClick={() => this.addAnnotate()} aria-label="Add Annotate">
              <AnnotateImage />
              <Typography style={{ margin: 3 }}>Annotate</Typography>
            </IconButton>
          </div>
        </Popover>

        <Dialog fullScreen open={this.state.openDialog} onClose={this.handleClose} TransitionComponent={Transition}>
          <AppBar>
            <Toolbar>
              <IconButton color="inherit" onClick={this.handleClose} aria-label="Close">
                <CloseIcon />
              </IconButton>
              <Typography variant="title" color="inherit">
                Annotate
              </Typography>
            </Toolbar>
          </AppBar>
          <div style={{ margin: 200 }}>
            <TextField
              id="outlined-multiline-flexible"
              label="Write your comment"
              multiline
              rowsMax="4"
              value={this.state.mes}
              onChange={this.handleChange("mes")}
              margin="normal"
              variant="outlined"
            />
          </div>
        </Dialog>
      </div>
    );
  }
  addAnnotate() {
    this.handleClickOpen();
  }

  _popUp() {
    this.setState({ isOpen: true });
    const serializer = new XMLSerializer();
    const document_fragment_string = serializer.serializeToString(
      window
        .getSelection()
        .getRangeAt(0)
        .cloneContents()
    );
    console.log("this.state.exact :", this.state.exact);
    this.setState({ exact: document_fragment_string });
  }
}

function bindAction(dispatch) {
  return {
    createAnnotate: (body, target) => dispatch(createAnnotate(body, target)),
    createAnnotateReset: () => dispatch(createAnnotateReset())
  };
}

const mapStateToProps = state => ({
  post: state.post
});

export default connect(
  mapStateToProps,
  bindAction
)(withSnackbar(PostTexture));
