import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import IconButton from "@material-ui/core/IconButton";
import red from "@material-ui/core/colors/red";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Avatar from "@material-ui/core/Avatar";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

const styles = {
  avatar: {
    margin: 10
  },
  orangeAvatar: {
    margin: 10,
    color: "#fff",
    backgroundColor: red[500]
  }
};

class PCommentList extends React.Component {
  render() {
    const { classes, comments } = this.props;
    return (
      <div>
        {comments.map((comment, index) => {
          return (
            <div style={{ margin: 15 }}>
              <Card key={index}>
                <CardHeader
                  avatar={<Avatar className={classes.orangeAvatar}>{comment.username.charAt(0).toUpperCase()}</Avatar>}
                  action={
                    <IconButton>
                      <MoreVertIcon />
                    </IconButton>
                  }
                  title={comment.username}
                  subheader={comment.creation_time}
                />
                <CardContent>
                  <Typography component="p">{comment.text}</Typography>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
    );
  }
}
PCommentList.propTypes = {
  classes: PropTypes.object,
  comments: PropTypes.array
};

PCommentList.defaultProps = {
  comments: [
    {
      creation_time: "12.12.2012",
      text: "cok iyisin",
      username: "abcdrk"
    }
  ]
};

export default withStyles(styles)(PCommentList);
