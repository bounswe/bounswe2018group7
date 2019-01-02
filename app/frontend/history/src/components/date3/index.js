import React, { Component } from "react";
import DateRangePicker from "react-daterange-picker";
//import "react-daterange-picker/dist/css/react-calendar.css"; // For some basic styling. (OPTIONAL)

class date3 extends Component {
  state = {
    dates: null
  };

  onSelect = dates => this.setState({ dates });

  render() {
    return (
      <div>
        <DateRangePicker onSelect={this.onSelect} value={this.state.dates} />
      </div>
    );
  }
}
