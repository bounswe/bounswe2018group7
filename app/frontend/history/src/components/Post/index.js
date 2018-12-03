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
import PMapsDest from "../PMaps/DestinationMaps";
import PMapsArea from "../PMaps/Area";
import Divider from "@material-ui/core/Divider";
import PMaps from "../PMaps/index";

class Post extends Component {
  render() {
    const { data } = this.props;

    return (
      <Card className={"postComponent"}>
        <PTitle username={data.username} like={data.like ? data.like : 0} creation_date={data.created} />
        <Divider />
        <Typography style={{ textAlign: "center", marginTop: 10 }} variant="headline" gutterBottom>
          {data.title}
        </Typography>

        <div className="postContentStyle">
          {data.story.map((element, index) => {
            if (element.type.startsWith("text")) {
              return (
                <div key={index} className={"postTextStyle"}>
                  <Typography color={"textSecondary"} component="p">
                    {element.payload}
                  </Typography>
                </div>
              );
            } else if (element.type.startsWith("video")) {
              return <PVideo key={index} url={element.payload} />;
            } else if (element.type.startsWith("image")) {
              return <PImg content={data.content} key={index} url={element.payload} />;
            } else if (element.type.startsWith("audio")) {
              return <PSound key={index} url={element.payload} />;
            }
            return <div key={index} />;
          })}

          <PTagList tags={data.tags} />
          <div style={{ marginTop: 20, marginBottom: 20 }}>
            <Divider />
          </div>
          <Typography align={"center"} variant="headline" gutterBottom>
            {data.time.data}
          </Typography>
          <div style={{ marginTop: 20, marginBottom: 20 }}>
            <Divider />
          </div>

          <div style={{ marginTop: 20, marginBottom: 20 }}>
            <Divider />
          </div>

          {this.dataLocationFunc(data)}

          <div style={{ marginTop: 20, marginBottom: 20 }}>
            <Divider />
          </div>

          <PComment id={data.id} comments={data.comments} />
        </div>
      </Card>
    );
  }
  dataLocationFunc(loc) {
    console.log(loc);
    console.log("inside the datalocationfunc");
    if (loc.location[0] && loc.location[0].points && loc.location[0].points.length === 1) {
      return <PMaps />;
    } else if (loc.location[0] && loc.location[0].points && loc.location[0].points.length === 2) {
      console.log("loloc inside");
      return <PMapsDest point={loc.location.points} />;
    } else if (loc.location[0] && loc.location[0].points && loc.location[0].points.length > 2) {
      return <PMapsArea />;
    }
  }
}

Post.propTypes = {
  data: PropTypes.object
};

export default Post;
