import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import pillsStyle from "assets/jss/material-kit-react/views/componentsSections/pillsStyle.jsx";
import PMaps from "components/PMaps";

class AroundYou extends Component {
  constructor(props) {
    super(props);

    this.state = {
      companyName: ""
    };
  }
  state = {
    isMarkerShown: false
  };

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
  render() {
    return (
      <div>
        <PMaps isMarkerShown={this.state.isMarkerShown} onMarkerClick={this.handleMarkerClick} />
      </div>
    );
  }
}

export default withStyles(pillsStyle)(AroundYou);
