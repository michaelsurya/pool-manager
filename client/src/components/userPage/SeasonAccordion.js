import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel
} from "react-accessible-accordion";
import { uniqBy } from "lodash";

import backend from "../../api/backend";

import SeasonItemPanel from "./SeasonItemPanel";

import "../../accordion.css";

import Axios from "axios";

class SeasonAccordion extends React.Component {
  state = {
    type: "",
    staffName: " ",
    unplayedSeasons: []
  };

  signal = Axios.CancelToken.source();

  getUnplayedSeasons = async () => {
    const result = await backend.get("/api/89ball_fixture/all/", {
      cancelToken: this.signal.token,
      params: {
        type: this.state.type,
        staffName: this.state.staffName,
        hidePlayed: true
      }
    });
    this.setState({ unplayedSeasons: uniqBy(result.data, "seasonId") });
  };

  componentDidMount = async () => {
    await this.setState({ type: this.props.type });
    await this.setState({ staffName: this.props.staffName });
  };

  componentDidUpdate = async (prevProps, prevState) => {
    if (prevProps.staffName !== this.props.staffName) {
      await this.setState({ staffName: this.props.staffName });
      this.getUnplayedSeasons();
    }
  };

  render() {
    return (
      <div style={{ width: "650px"}}>
        <Accordion allowZeroExpanded={true}>
          {this.state.unplayedSeasons.map(season => {
            return (
              <AccordionItem key={season.seasonId}>
                <AccordionItemHeading>
                  <AccordionItemButton>
                    Season {season.seasonId}
                  </AccordionItemButton>
                </AccordionItemHeading>
                <SeasonItemPanel
                  type={this.state.type}
                  staffName={this.state.staffName}
                  seasonId={season.seasonId}
                />
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    );
  }
}

export default SeasonAccordion;
