import React from "react";

const LeagueTableBody = props => {
  const itemsToBeDisplayed = props.players.map((player, index) => {
    return (
      <tr key={player.seasonId + player.staffName}>
        <td align="center">{index + 1}</td>
        <td align="center" id="leagueTablePlayerName">
          {player.staffName}
        </td>
        <td align="center">{player.play}</td>
        <td align="center">{player.win}</td>
        <td align="center">{player.draw}</td>
        <td align="center">{player.lose}</td>
        <td align="center">{player.goalsFor}</td>
        <td align="center">{player.goalsAgainst}</td>
        {/* <td align="center" className="leagueTableForm">
          <div className="leagueTableFormItem">
            <div className="win-icon" />
          </div>
          <div className="leagueTableFormItem">
            <div className="draw-icon" />
          </div>
          <div className="leagueTableFormItem">
            <div className="win-icon" />
          </div>
          <div className="leagueTableFormItem">
            <div className="loss-icon" />
          </div>
          <div className="leagueTableFormItem">
            <div className="loss-icon" />
          </div>
        </td> */}
        <td align="center">{player.points}</td>
        <td style={{ backgroundColor: "#DBE9E2" }}>
          <span
            className="delete-icon"
            onClick={() => {
              if (
                window.confirm(
                  `Are you sure you want to delete ${player.staffName}?`
                )
              )
                props.deletePlayer(player.staffName);
            }}
            alt="remove player"
          />
        </td>
      </tr>
    );
  });
  return <tbody>{itemsToBeDisplayed}</tbody>;
};

export default LeagueTableBody;
