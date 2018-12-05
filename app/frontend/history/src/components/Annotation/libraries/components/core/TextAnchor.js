import React, { PureComponent } from "react";

export default class TextAnchor extends PureComponent {
  state = { buttonShowing: false, justCreated: true };

  componentDidMount() {
    this.mounted = true;
    this.textBox.addEventListener("click", this.onClick);
    this.textBox.addEventListener("mouseleave", this.onMouseLeave);

    setTimeout(() => {
      if (this.mounted) {
        this.setState({ ...this.state, justCreated: false });
      }
    }, 200);
  }

  componentWillUnmount() {
    this.mounted = false;
    this.textBox.removeEventListener("click", this.onClick);
    this.textBox.removeEventListener("mouseleave", this.onMouseLeave);
  }

  render() {
    const textAnchorStyle = {
      left: this.props.x + "px",
      top: this.props.y + "px"
    };
    if (this.props.rotate) {
      textAnchorStyle.transform = "rotate(" + this.props.rotate + "rad)";
    }

    const className =
      "text-anchor" +
      (this.state.buttonShowing ? " button-showing" : "") +
      (this.state.justCreated ? " just-created" : "");

    return (
      <div className={className} style={textAnchorStyle}>
        <div className="text-box" ref={e => (this.textBox = e)}>
          {this.props.children}
          <button
            type="button"
            className="delete-button"
            onClick={this.onDeleteButtonClick}
            // Additional mouse-down handler means delete works cleanly if text is being edited:
            onMouseDown={this.onDeleteButtonClick}
            ref={e => (this.deleteButton = e)}
          >
            <svg className="delete-button-svg">
              <path
                className="delete-button-icon"
                d="M 4 4 L 11 11 M 11 4 L 4 11"
              />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  onClick = event => this.setState({ ...this.state, buttonShowing: true });

  onMouseLeave = event =>
    this.setState({ ...this.state, buttonShowing: false });

  onDeleteButtonClick = event => {
    if (event.button === 0) {
      event.preventDefault();
      event.stopPropagation();
      this.props.onDeleteButtonClick();
    }
  };
}
