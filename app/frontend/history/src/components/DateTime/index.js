import React, { Component } from "react";
import PropTypes from "prop-types";
import InfiniteCalendar from "react-infinite-calendar";
import "react-infinite-calendar/styles.css"; // Make sure to import the default stylesheet

var today = new Date();
var lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);

class DateTime extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedDate: today
    };
    if (props.dateRef) props.dateRef(this);
  }
  render() {
    console.log("this.state. :", this.state.selectedDate);
    return (
      <div>
        <InfiniteCalendar width={400} height={600} selected={today} onSelect={ev => this.onDateClick(ev)} />
      </div>
    );
  }
  onDateClick(ev) {
    this.setState({ selectedDate: ev });
  }
  getDate() {
    return { date: this.state.selectedDate };
  }
}

DateTime.propTypes = {};

export default DateTime;
