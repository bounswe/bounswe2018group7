import React from "react";
import SendIcon from "@material-ui/icons/Send";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { createComment, createCommentReset } from "../../../redux/post/Actions";
import { connect } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";
import purple from "@material-ui/core/colors/purple";
class PCommentAdd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      commentText: ""
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const { createCommentInProgress, createCommentHasError, createCommentCompleted } = this.props.post;

    if (!createCommentInProgress && createCommentHasError && createCommentCompleted) {
      this.props.createCommentReset();
    }
  }

  _sendComment() {
    this.props.createComment(this.props.id, this.state.commentText);
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
}

function bindAction(dispatch) {
  return {
    createComment: (memory_post, content) => dispatch(createComment(memory_post, content)),
    createCommentReset: () => dispatch(createCommentReset())
  };
}

const mapStateToProps = state => ({
  post: state.post
});

export default connect(
  mapStateToProps,
  bindAction
)(PCommentAdd);
