import React, { Component } from "react";
import PropTypes from "prop-types";
import "./style.css";
import PVideo from "../PVideo";
import PImg from "../PImg/index";
import PSound from "../PSound/index";
import Typography from "@material-ui/core/Typography";

class Post extends Component {
  render() {
    const { data } = this.props;

    return (
      <div className={"postComponent"}>
        <Typography>{data.username}</Typography>
        <Typography>{data.header}</Typography>
        <Typography>{data.creation_date}</Typography>
        <Typography>{data.creation_time}</Typography>
        <Typography>LIKE: {data.like}</Typography>

        {data.content.map((element, index) => {
          if (element.type === "text") {
            return <Typography>{element.payload}</Typography>;
          } else if (element.type === "video") {
            return <PVideo />;
          } else if (element.type === "image") {
            return <PImg />;
          } else if (element.type === "sound") {
            return <PSound />;
          }
        })}
      </div>
    );
  }
}

Post.propTypes = {};

export default Post;
