import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import DateIcon from "@material-ui/icons/DateRange";

import { Calendar, CalendarControls } from "react-yearly-calendar";

const styles = {
  appBar: {
    position: "relative",
    color: "secondary"
  },
  flex: {
    flex: 1
  }
};

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class DatePicker extends React.Component {
  state = {
    open: false
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes, title } = this.props;
    return (
      <div>
        <IconButton onClick={this.handleClickOpen} aria-label="Add Date">
          <DateIcon />
          <Typography style={{ margin: 3 }}>{title}</Typography>
        </IconButton>

        <Dialog fullScreen open={this.state.open} onClose={this.handleClose} TransitionComponent={Transition}>
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton color="inherit" onClick={this.handleClose} aria-label="Close">
                <CloseIcon />
              </IconButton>
              <Typography variant="title" color="inherit" className={classes.flex}>
                {title}
              </Typography>
              <Button color="inherit" onClick={this.handleClose}>
                Save
              </Button>
            </Toolbar>
          </AppBar>
          <div>
            Date Picker
            <Calendar year={2018} />
          </div>
        </Dialog>
      </div>
    );
  }
}

DatePicker.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.string
};

DatePicker.defaultProps = {
  title: "Date"
};
export default withStyles(styles)(DatePicker);
