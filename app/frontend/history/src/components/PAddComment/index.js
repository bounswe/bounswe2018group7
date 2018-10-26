import React from "react";
import SendIcon from "@material-ui/icons/Send";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

class PAddComment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      commentText: ""
    };
  }

  render() {
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
          <Button variant="fab" mini color="secondary" aria-label="Add">
            <SendIcon />
          </Button>
        </div>
      </div>
    );
  }
}

export default PAddComment;
