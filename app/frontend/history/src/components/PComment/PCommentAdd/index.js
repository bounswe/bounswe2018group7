import React from "react";
import SendIcon from "@material-ui/icons/Send";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { createComment, createCommentReset, pushLastComment } from "../../../redux/post/Actions";
import { connect } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";
import purple from "@material-ui/core/colors/purple";
import { withSnackbar } from "notistack";

import { getCookie, USER_COOKIE } from "utils/cookies.js";
import moment from "moment";

class PCommentAdd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      commentText: ""
    };
    this.user = getCookie(USER_COOKIE);

    if (props.mapAreaRef) props.mapAreaRef(this);
  }

  componentDidUpdate(prevProps, prevState) {
    const { createCommentInProgress, createCommentHasError, createCommentCompleted } = this.props.post;

    if (!createCommentInProgress && createCommentHasError && createCommentCompleted) {
      this.props.createCommentReset();

      this.props.pushLastComment(
        this.props.id,
        this.props.id,
        this.user.username,
        this.state.commentText,
        moment().format("MMMM-Do-YYYY, h:mm:ss")
      );
    }
  }

  _sendComment() {
    if (this.user) {
      if (this.state.commentText) {
        this.props.createComment(this.props.id, this.state.commentText);
      } else {
        this.props.enqueueSnackbar("You must fill the comment 🤨", { variant: "warning" });
      }
    } else {
      this.props.enqueueSnackbar("You must log in :D 😍", { variant: "info" });
    }
  }
  render() {
    const { createCommentInProgress } = this.props.post;

    if (createCommentInProgress) {
      return (
        <div style={{ justifyContent: "center", display: "flex" }}>
          <CircularProgress style={{ color: purple[500] }} thickness={7} />
        </div>
      );
    } else
      return (
        <div>
          <div>
            <TextField
              id="outlined-full-width"
              label="Your Comments"
              style={{ margin: 8 }}
              placeholder="Write Something"
              fullWidth
              margin="normal"
              value={this.state.commentText}
              onChange={event => this.setState({ commentText: event.target.value })}
              variant="outlined"
              InputLabelProps={{
                shrink: true
              }}
            />
          </div>
          <div style={{ margin: 10 }}>
            <Button onClick={() => this._sendComment()} variant="fab" mini color="secondary" aria-label="Add">
              <SendIcon />
            </Button>
          </div>
        </div>
      );
  }

  getLocation() {
    return {
      id: 5,
      memory_post: 117,
      username: "this.user.username",
      content: "this.state.commentText",
      created: "MMMM-Do-YYYY, h:mm:ss"
    };

    // return {
    //   id: 5,
    //   memory_post: this.props.id,
    //   username: this.user.username,
    //   content: this.state.commentText,
    //   created: moment().format("MMMM-Do-YYYY, h:mm:ss")
    // };
  }
}

function bindAction(dispatch) {
  return {
    createComment: (memory_post, content) => dispatch(createComment(memory_post, content)),
    createCommentReset: () => dispatch(createCommentReset()),
    pushLastComment: (id, memory_post, username, content, created) =>
      dispatch(pushLastComment(id, memory_post, username, content, created))
  };
}

const mapStateToProps = state => ({
  post: state.post
});

export default connect(
  mapStateToProps,
  bindAction
)(withSnackbar(PCommentAdd));
