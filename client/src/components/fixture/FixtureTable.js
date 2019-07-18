import React from "react";
import FixtureTableBody from "./FixtureTableBody";
import FixtureTableHeader from "./FixtureTableHeader";

const FixtureTable = props => {
  if (props.fixtures.length === 0) {
    return null;
  }
  return (
    <div className="fixtureTableContainer">
      {/*<h3>Round {props.round}</h3>
      <p>
        Due:{" "}
        {new Date(parseInt(props.fixtures[0].date))
          .toString()
          .split(" ")
          .slice(1, 4)
          .join("-")}
        </p>*/}
      <table className="fixtureTable" cellSpacing="0">
        <FixtureTableHeader round={props.round} fixtures={props.fixtures} />
        <FixtureTableBody fixtures={props.fixtures} />
      </table>
    </div>
  );
};

export default FixtureTable;
