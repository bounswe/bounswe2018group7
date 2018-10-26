import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import classnames from "classnames";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import red from "@material-ui/core/colors/red";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import PTextInput from "components/PTextInput";
import CustomButtons from "components/CustomButtons/Button";

const styles = theme => ({
  card: {
    width: "100%"
  },
  media: {
    height: 0,
    paddingTop: "56.25%" // 16:9
  },
  actions: {
    display: "flex"
  },
  expand: {
    transform: "rotate(0deg)",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    }),
    marginLeft: "auto",
    [theme.breakpoints.up("sm")]: {
      marginRight: -8
    }
  },
  expandOpen: {
    transform: "rotate(180deg)"
  },
  avatar: {
    backgroundColor: red[500]
  }
});

class PComment extends React.Component {
  state = { expanded: false };

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  render() {
    const { classes, title, comments, username, creation_date, creation_time } = this.props;
    return (
      <div>
        <Card className={classes.card}>
          <CardHeader
            avatar={
              <Avatar aria-label="Recipe" className={classes.avatar}>
                {username.charAt(0).toUpperCase()}
              </Avatar>
            }
            action={
              <IconButton>
                <MoreVertIcon />
              </IconButton>
            }
            title={title}
            subheader={creation_date + creation_time}
          />
        </Card>
        <PTextInput
          value={comments}
          onChange={event => this.setState({ comments: event.target.value })}
          label={"Your Comments"}
          className={classes.dialogTextInput}
          multiline
          rows={5}
          fullWidth
        />
        <CustomButtons>Add Comment</CustomButtons>
      </div>
    );
  }
}

PComment.propTypes = {
  classes: PropTypes.object.isRequired,
  username: PropTypes.string,
  title: PropTypes.string,
  creation_date: PropTypes.string,
  creation_time: PropTypes.string,
  comments: PropTypes.string
};

PComment.defaultProps = {
  username: "BBA",
  title: "BBA",
  creation_date: "November,29 2018",
  creation_date: "13:45",
  comments: "This is awesome place for visiting"
};
export default withStyles(styles)(PComment);
