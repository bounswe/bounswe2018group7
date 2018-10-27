import React from "react";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import Schedule from "@material-ui/icons/LocationSearching";
import List from "@material-ui/icons/List";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import NavPills from "components/NavPills/NavPills.jsx";
import pillsStyle from "assets/jss/material-kit-react/views/componentsSections/pillsStyle.jsx";
import RecentPost from "../../../components/RecentPost";

import AroundYou from "views/Components/Sections/AroundYou";
class SectionPills extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      companyName: ""
    };
  }
  render() {
    const { classes } = this.props;
    const { companyName } = this.state;
    return (
      <div className={classes.section}>
        <div className={classes.container}>
          <div id="navigation-pills">
            <GridContainer>
              <GridItem xs={12} sm={12} md={12} lg={12}>
                <NavPills
                  color="warning"
                  horizontal={{
                    tabsGrid: { xs: 12, sm: 4, md: 4 },
                    contentGrid: { xs: 12, sm: 8, md: 8 }
                  }}
                  tabs={[
                    {
                      tabButton: "Recent Posts",

                      tabIcon: Dashboard,
                      tabContent: <RecentPost />
                    },
                    {
                      tabButton: "Around You",
                      tabIcon: Schedule,
                      tabContent: <AroundYou />
                    }
                  ]}
                />
              </GridItem>
            </GridContainer>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(pillsStyle)(SectionPills);