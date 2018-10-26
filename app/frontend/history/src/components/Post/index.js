import React, { Component } from "react";
import PropTypes from "prop-types";
import "./style.css";
import PVideo from "../PVideo";
import PImg from "../PImg/index";
import PSound from "../PSound/index";
import Typography from "@material-ui/core/Typography";
import Card from "../Card/Card";
import PTitle from "../PTitle";

class Post extends Component {
  render() {
    const { data } = this.props;

    return (
      <Card className={"postComponent"}>
        <PTitle username={data.username} creation_date={data.creation_date} creation_time={data.creation_time} />

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

        <Typography>LIKE: {data.like}</Typography>
      </Card>
    );
  }
}

Post.propTypes = {};

export default Post;
