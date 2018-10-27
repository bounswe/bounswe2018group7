import React, { Component } from "react";
import PropTypes from "prop-types";

class PTagList extends Component {
  render() {
    const { tags } = this.props;
    console.log("TCL: -------------------------------------");
    console.log("TCL: PTagList -> render -> tags", tags);
    console.log("TCL: -------------------------------------");

    return (
      <div>
        {tags.map((element, index) => {
          return (
            <div key={index} style={{ backgroundColor: "red" }}>
              <div>{element}</div>
            </div>
          );
        })}
      </div>
    );
  }
}

PTagList.propTypes = {
  tags: PropTypes.array
};

export default PTagList;
