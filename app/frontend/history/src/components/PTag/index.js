import React, { Component } from "react";
import { WithContext as ReactTags } from "react-tag-input";
// import "../../../node_modules/react-tagsinput/react-tagsinput.css"; // If using WebPack and style-loader.
// import "react-tag-input/example/reactTags.css";

const KeyCodes = {
  comma: 188,
  enter: 13,
  SPACE: 32
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];
class PTag extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tags: [],
      suggestions: [
        { id: "Istanbul", text: "Istanbul" },
        { id: "İstanbul", text: "İstanbul" },
        { id: "Boğaziçi", text: "Boğaziçi" },
        { id: "Kız Kulesi", text: "Kız Kulesi" },
        { id: "SriLanka", text: "Sri Lanka" },
        { id: "Thailand", text: "Thailand" }
      ]
    };
    this.handleDelete = this.handleDelete.bind(this);
    this.handleAddition = this.handleAddition.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
  }

  handleDelete(i) {
    const { tags } = this.state;
    this.setState({
      tags: tags.filter((tag, index) => index !== i)
    });
  }

  handleAddition(tag) {
    this.setState(state => ({ tags: [...state.tags, tag] }));
    this.props.handleAddition(tag);
  }

  handleDrag(tag, currPos, newPos) {
    const tags = [...this.state.tags];
    const newTags = tags.slice();

    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);

    // re-render
    this.setState({ tags: newTags });
  }
  render() {
    const { suggestions } = this.state;
    const { tags } = this.props;
    return (
      <div style={{ width: "100%" }}>
        <ReactTags
          tags={tags}
          suggestions={suggestions}
          handleDelete={this.handleDelete}
          handleAddition={this.handleAddition}
          handleDrag={this.handleDrag}
          delimiters={delimiters}
          classNames={{
            tags: "tagsClass",
            tagInput: "form-control",
            selected: "selectedClass",
            tag: "tagClass",
            remove: "removeClass",
            suggestions: "suggestionsClass"
          }}
        />
      </div>
    );
  }
}

export default PTag;
