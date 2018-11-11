import React, { Component } from "react";
import PropTypes from "prop-types";
import InfiniteCalendar from "react-infinite-calendar";
import "react-infinite-calendar/styles.css"; // Make sure to import the default stylesheet

var today = new Date();
var lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);

class DateTime extends Component {
  render() {
    return (
      <div>
        <InfiniteCalendar width={400} height={600} selected={today} disabledDays={[0, 6]} minDate={lastWeek} />
      </div>
    );
  }
}

DateTime.propTypes = {};

export default DateTime;
