import React, { Component } from "react";
import axios from "axios";

class CreateSeasonForm extends Component {
  constructor(props) {
    super(props);

    this.initialState = {
      players: [],
      seasonName: ""
    };

    this.hasInvalidCells = false;
    this.state = this.initialState;
  }

  addPlayer() {
    this.setState({ players: [...this.state.players, ""] });
  }

  handleChange(e, index) {
    this.state.players[index] = e.target.value.toUpperCase();
    this.setState({ players: this.state.players });
  }

  removePlayer(index) {
    this.state.players.splice(index, 1);

    this.setState({ players: this.state.players });
  }

  createSeason = () => {
    var regex = /^[A-Z]+$/;
    /* check if the text inputs match the regular expression */
    for (var i = 0; i < this.state.players.length; i++) {
      if (!regex.test(this.state.players[i])) {
        this.hasInvalidCells = true;
      }
    }
    /* check if the season name text input is empty */
    if (this.state.seasonName === "") {
      this.hasInvalidCells = true;
    }
    /* alert the user that their input is not valid */
    if (this.hasInvalidCells) {
      alert("Not a valid input");
      this.hasInvalidCells = false;
    } else {
      console.log("Players: " + this.state.players);
      this.props.createSeason(this.state);
      this.setState(this.initialState);
    }
  };

  render() {
    return (
      <div className="createSeasonForm">
        <h2>Create a season</h2>
        <form>
          <label>Season name:</label>
          <input
            type="text"
            placeholder="Season name"
            value={this.state.seasonName}
            onChange={e => this.setState({ seasonName: e.target.value })}
          />
          <div className="inputPlayers">
            {/* Map the players in the state to inputs */}
            {this.state.players.map((player, index) => {
              return (
                <div key={index}>
                  <label>Player {index + 1}</label>
                  {/* player name text input */}
                  <input
                    placeholder="Player name"
                    className="inputPlayerName"
                    onChange={e => this.handleChange(e, index)}
                    value={player}
                  />
                  {/* button for removing player */}
                  <button
                    type="button"
                    className="removeBtn"
                    onClick={() => this.removePlayer(index)}
                  >
                    - Remove
                  </button>
                </div>
              );
            })}
            {/* button for adding a player */}
            <button
              type="button"
              id="addPlayer"
              onClick={e => this.addPlayer(e)}
            >
              + Add player
            </button>
            <button type="button" onClick={this.createSeason}>
              Create season
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default CreateSeasonForm;