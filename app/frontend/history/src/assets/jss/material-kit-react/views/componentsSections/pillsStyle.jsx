import { container, title } from "assets/jss/material-kit-react.jsx";
import { SECONDARY } from "../../../../../variables/commonColor";
const pillsStyle = {
  section: {
    padding: "70px 03",
    backgroundColor: SECONDARY
  },
  container,
  title: {
    ...title,
    marginTop: "30px",
    minHeight: "32px",
    textDecoration: "none"
  }
};

export default pillsStyle;
