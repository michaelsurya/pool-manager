import React, { Component } from "react";
import backend from "../../api/backend";
import axios from "axios";
import auth0Client from "../../Auth";
import { some, orderBy, find } from "lodash";

class SubmitScoreForm extends Component {
  constructor(props) {
    super(props);

    this.initialState = {
      allPlayers: [],
      players: "",
      score1: "",
      score2: "",
      type: "",
      activeSeason: "",
      activePlayer: " ",
      fixtures: []
    };

    this.state = this.initialState;

    this.player1won = React.createRef();
    this.player2won = React.createRef();
    this.draw = React.createRef();
  }

  signal = axios.CancelToken.source();

  getFixtures = async () => {
    if (!this.props.edit) {
      //GET UNPLAYED FIXTURES
      try {
        const response = await backend.get(
          "/api/89ball_fixture/" + this.state.activeSeason,
          {
            cancelToken: this.signal.token,
            params: {
              type: this.state.type,
              hidePlayed: true,
              staffName: this.state.activePlayer
            }
          }
        );
        this.setState({ fixtures: response.data });
      } catch (err) {
        //API CALL BEING CANCELED
      }
    } else {
      //ONLY GET THE PLAYED FIXTURES
      try {
        const response = await backend.get(
          "/api/89ball_fixture/" + this.state.activeSeason,
          {
            cancelToken: this.signal.token,
            params: {
              type: this.state.type,
              onlyPlayed: true,
              staffName: this.state.activePlayer
            }
          }
        );
        this.setState({ fixtures: response.data });
      } catch (err) {
        //API CALL BEING CANCELED
      }
    }
  };

  componentDidMount = async () => {
    await this.setState({ type: this.props.type });
    await this.setState({ activeSeason: this.props.activeSeason });
    await this.setState({
      allPlayers: orderBy(this.props.players, ["staffName"], ["asc"])
    });
    if (
      auth0Client.isAuthenticated() &&
      some(this.state.allPlayers, {
        staffName: auth0Client.getProfile().nickname
      })
    ) {
      this.setState({
        activePlayer: auth0Client.getProfile().nickname,
        initialLoad: false
      });
    }
    await this.getFixtures();
  };

  componentDidUpdate = async (prevProps, prevState) => {
    if (this.props.players !== prevProps.players) {
      await this.setState({
        allPlayers: orderBy(this.props.players, ["staffName"], ["asc"])
      });
      this.getFixtures();
    }

    //Handle deletion
    if (
      this.state.activePlayer !== " " &&
      !some(this.state.allPlayers, { staffName: this.state.activePlayer })
    ) {
      this.setState({ activePlayer: " " });
    }

    if (this.props.type !== prevProps.type) {
      await this.setState({ type: this.props.type });
    }

    if (this.props.activeSeason !== prevProps.activeSeason) {
      await this.setState({ activeSeason: this.props.activeSeason });
    }

    if (
      this.state.activePlayer !== prevState.activePlayer &&
      this.props.type !== undefined
    ) {
      if (this.state.activeSeason !== undefined) {
        this.getFixtures();
      }
    }
  };

  componentWillUnmount() {
    this.signal.cancel("");
  }

  isValid() {
    var regexScore = /^[0-2]$/; // matches 0, 1, or 2
    var score1 = parseInt(this.state.score1);
    var score2 = parseInt(this.state.score2);

    /* check the inputs match the regular expressions */
    if (!regexScore.test(score1) || !regexScore.test(score2)) {
      return false;
    }
    /* check the two scores entered add up to 2 */
    if (score1 + score2 !== 2) {
      return false;
    }

    return true;
  }

  handleSubmit = () => {
    if (!this.isValid()) {
      alert("Not a valid input");
    } else {
      /* submit score */
      if (this.props.edit) {
        this.props.editFixtureScore(this.prepareSubmitState());
      } else {
        this.props.changeFixtureScore(this.prepareSubmitState());
      }
      this.setState(
        {
          fixtures: [],
          score1: "",
          score2: "",
          players: ""
        },
        () => {
          this.getFixtures();
          this.clearRadioButtons();
        }
      );
    }
  };

  prepareSubmitState() {
    let submitableState = this.state;
    let arr = this.state.players.split(" ");
    submitableState.player1 = arr[0];
    submitableState.player2 = arr[1];
    return submitableState;
  }

  setScore1(score) {
    this.setState({ score1: score });
  }

  setScore2(score) {
    this.setState({ score2: score });
  }

  handleFixturesChange = event => {
    this.setState({ players: event.target.value }, () => {
      let arr = this.state.players.split(" ");
      let p1 = arr[0];
      let p2 = arr[1];

      let fixtures = find(this.state.fixtures, { player1: p1, player2: p2 });
      if (fixtures.score1 === 2) {
        this.player1won.current.checked = true;
      } else if (fixtures.score2 === 2) {
        this.player2won.current.checked = true;
      } else if (fixtures.score1 === 1 && fixtures.score2 === 1) {
        this.draw.current.checked = true;
      }
    });
  };

  handleRadioClick() {
    if (this.player1won.current.checked) {
      this.setScore1(2);
      this.setScore2(0);
    } else if (this.player2won.current.checked) {
      this.setScore1(0);
      this.setScore2(2);
    } else {
      this.setScore1(1);
      this.setScore2(1);
    }
  }

  resultStyle() {
    if (this.state.players === "") {
      return {
        display: "none"
      };
    } else {
      return {
        display: "block"
      };
    }
  }

  clearRadioButtons() {
    this.player1won.current.checked = false;
    this.player2won.current.checked = false;
    if (!this.props.isPlayoff || this.props.isPlayoff === 0) {
      this.draw.current.checked = false;
    }
  }

  render() {
    return (
      <div id="submitScoreForm">
        {this.props.edit ? (
          <div>
            <h3>Edit Result</h3>
            <p style={{ color: "red" }}>
              <strong>Warning:</strong> Only use this form to edit an&nbsp;
              <strong>incorrect</strong> score.
            </p>
          </div>
        ) : (
          <h3>Submit Result</h3>
        )}
        <form>
          <label>Select your name:</label>
          <select
            id="selectPlayer"
            value={this.state.activePlayer}
            onChange={e => this.setState({ activePlayer: e.target.value })}
          >
            <option value=" ">ALL</option>
            {this.state.allPlayers.map(player => {
              return (
                <option key={player.staffName} value={player.staffName}>
                  {player.staffName}
                </option>
              );
            })}
          </select>
          <br />
          <label>Select fixture:</label>
          <select
            id="selectFixture"
            value={this.state.players}
            onChange={this.handleFixturesChange}
          >
            <option disabled value={""}>
              PLAYER1 &nbsp;&nbsp;VS&nbsp;&nbsp; PLAYER 2
            </option>
            {this.state.fixtures.map(fixture => {
              let player1 = fixture.player1;
              let player2 = fixture.player2;
              return (
                <option
                  key={fixture.seasonID + fixture.player1 + fixture.player2}
                  value={player1 + " " + player2}
                >
                  {player1} &nbsp;&nbsp;VS&nbsp;&nbsp; {player2}
                </option>
              );
            })}
          </select>
          <br />
          <div id="result" className="selectWinner" style={this.resultStyle()}>
            <label>Who won?</label> <br />
            <label className="radioContainer">
              <input
                id="player1won"
                ref={this.player1won}
                type="radio"
                name="result"
                value="player1"
                onClick={this.handleRadioClick.bind(this)}
              />
              {this.state.players.split(" ")[0]}
            </label>
            {this.props.isPlayoff ? null : (
              <label className="radioContainer">
                <input
                  id="draw"
                  ref={this.draw}
                  type="radio"
                  name="result"
                  value="draw"
                  onClick={this.handleRadioClick.bind(this)}
                />
                DRAW
              </label>
            )}
            <label className="radioContainer">
              <input
                id="player2won"
                ref={this.player2won}
                type="radio"
                name="result"
                value="player2"
                onClick={this.handleRadioClick.bind(this)}
              />

              {this.state.players.split(" ")[1]}
            </label>
            <br />
          </div>
          <button
            type="button"
            id="submitScoreBtn"
            onClick={() => {
              if (
                window.confirm("Are you sure you want to submit this result?")
              )
                this.handleSubmit();
            }}
          >
            Submit Result
          </button>
        </form>
      </div>
    );
  }
}

export default SubmitScoreForm;
