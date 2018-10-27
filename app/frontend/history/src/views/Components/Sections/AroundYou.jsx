import React, { Component } from "react";
import PTextInput from "components/PTextInput";
import { withStyles } from "@material-ui/core/styles";
import pillsStyle from "assets/jss/material-kit-react/views/componentsSections/pillsStyle.jsx";
import PComment from "components/PComment";
import PMaps from "components/PMaps";
import PTag from "components/PTag";
import PCommentList from "components/PCommentList";
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
    const { classes } = this.props;
    const { companyName } = this.state;
    return (
      <div>
        <PTextInput
          value={companyName}
          onChange={event => this.setState({ companyName: event.target.value })}
          label={"Message Text"}
          className={classes.dialogTextInput}
          multiline
          rows={5}
          fullWidth
        />
        <PComment
          username={"Bekir Burak ASLAN"}
          MainText={"Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit..."}
          SubText={
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
          }
        />

        <PTag />
        <PCommentList username="Burcu ASLAN" comments="I recommend this place for history lovers" />
        <PMaps isMarkerShown={this.state.isMarkerShown} onMarkerClick={this.handleMarkerClick} />
      </div>
    );
  }
}

export default withStyles(pillsStyle)(AroundYou);
