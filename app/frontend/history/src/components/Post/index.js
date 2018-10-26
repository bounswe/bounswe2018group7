import React, { Component } from "react";
import PropTypes from "prop-types";
import "./style.css";
import PVideo from "../PVideo";
import PImg from "../PImg/index";
import PSound from "../PSound/index";
import Typography from "@material-ui/core/Typography";
import Card from "../Card/Card";
import PTitle from "../PTitle";
import PComment from "../PComment";

import Divider from "@material-ui/core/Divider";

class Post extends Component {
  render() {
    const { data } = this.props;

    return (
      <Card className={"postComponent"}>
        <PTitle
          username={data.username}
          like={data.like}
          creation_date={data.creation_date}
          creation_time={data.creation_time}
        />
        <div className="postContentStyle">
          {data.content.map((element, index) => {
            if (element.type === "text") {
              return (
                <div className={"postTextStyle"}>
                  <Typography component="p">{element.payload}</Typography>
                </div>
              );
            } else if (element.type === "video") {
              return <PVideo url={element.payload} />;
            } else if (element.type === "image") {
              return <PImg url={element.payload} />;
            } else if (element.type === "sound") {
              return <PSound url={element.payload} />;
            }
          })}
        </div>

        <Divider />
        <PComment />
      </Card>
    );
  }
}

Post.propTypes = {};

export default Post;
