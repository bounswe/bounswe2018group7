import React, { Component } from "react";
import PTextInput from "components/PTextInput";
import { withStyles } from "@material-ui/core/styles";
import pillsStyle from "assets/jss/material-kit-react/views/componentsSections/pillsStyle.jsx";

class AroundYou extends Component {
  constructor(props) {
    super(props);

    this.state = {
      companyName: ""
    };
  }
  render() {
    const { classes } = this.props;
    const { companyName } = this.state;
    return (
      <div>
        <PTextInput
          value={companyName}
          onChange={event => this.setState({ companyName: event.target.value })}
          label={"Message Text"}
          className={classes.dialogTextInput}
          multiline
          rows={5}
          fullWidth
        />

        <h1>Ram</h1>
      </div>
    );
  }
}

export default withStyles(pillsStyle)(AroundYou);
