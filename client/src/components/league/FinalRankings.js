import React from "react";

const FinalRankings = props => {
  return (
    <div style={{ marginBottom: "4rem" }}>
      <div className="seasonClosed">
        <div className="chequered-flag-icon" alt="chequered flag" />
        <h1 style={{ fontSize: "40pt" }}>
          {" "}
          Season {props.season} has finished
        </h1>
        <div className="chequered-flag-icon" alt="chequered flag" />
      </div>
      <div className="finalRankings">
        <div className="finalRankingsItem">
          <div className="gold-medal-icon-large" alt="first place" />
          <h1 style={{ fontSize: "50pt" }}>
            {props.players[0].staffName} &nbsp;&nbsp; {props.players[0].points}{" "}
            pts
          </h1>
        </div>
        <div className="finalRankingsItem">
          <div className="silver-medal-icon-large" alt="second place" />
          <h1 style={{ fontSize: "36pt" }}>
            {props.players[1].staffName} &nbsp;&nbsp; {props.players[1].points}{" "}
            pts
          </h1>
        </div>
        <div className="finalRankingsItem">
          <div className="bronze-medal-icon-large" alt="third place" />
          {props.players[2] ? (
            <h1 style={{ fontSize: "36pt" }}>
              {props.players[2].staffName} &nbsp;&nbsp;{" "}
              {props.players[2].points} pts
            </h1>
          ) : (
            <h1 style={{ fontSize: "36pt" }}>-</h1>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinalRankings;
