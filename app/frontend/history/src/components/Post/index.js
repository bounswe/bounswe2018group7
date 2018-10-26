import React, { Component } from "react";
import PropTypes from "prop-types";
import "./style.css";
import PVideo from "../PVideo";
import PImg from "../PImg/index";
import PSound from "../PSound/index";
import Typography from "@material-ui/core/Typography";
import Card from "../Card/Card";
import PTitle from "../PTitle";
import PTagList from "../PTagList";
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
        <Divider />
        <Typography style={{ textAlign: "center", marginTop: 10 }} variant="headline" gutterBottom>
          {data.header}
        </Typography>

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
            return <div />;
          })}

          <PTagList tags={data.tags} />
          <div style={{ marginTop: 20, marginBottom: 20, marginLeft: 20, marginRight: 20 }}>
            <Divider />
          </div>
          <PComment data={data.comments} />
        </div>
      </Card>
    );
  }
}

Post.propTypes = {
  data: PropTypes.object
};

export default Post;
