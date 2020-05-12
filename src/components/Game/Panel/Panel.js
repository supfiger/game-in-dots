import React, { Component } from "react";

import "./Panel.sass";
import { gameSettings } from "../../../api";

export default class Panel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      gameSettings: {},
      fieldDots: [],
      error: null,
      user: "",
      gameMode: "DEFAULT",
      field: null,
      delay: null,
    };
  }

  async fetchGameSettings() {
    this.setState({ loading: true });
    try {
      const result = await gameSettings();
      this.setState({
        gameSettings: result,
      });
    } catch (error) {
      this.setState({
        error: error,
      });
    } finally {
      this.setState({ loading: false });
    }
  }

  componentDidMount() {
    this.fetchGameSettings();
  }

  onChangeGameMode = (e) => {
    const { gameSettings } = this.state;
    const gameMode = e.target.value;

    this.setState(
      {
        gameMode,
        field: gameSettings[gameMode].field,
        delay: gameSettings[gameMode].delay,
      },
      () => {
        if (this.state.isGameStarted) {
          this.resetFieldDots();
        }
        this.createFieldDots();
      }
    );
  };

  onChangeName = (e) => {
    const user = e.target.value;

    this.setState({ user });
  };

  onClickPlay = () => {
    console.log("isGameFinished", this.state.isGameFinished);
    if (this.state.isGameFinished) {
      this.createFieldDots();
    }

    if (!this.state.isGameStarted) {
      const isGameStarted = true;
      const isGameFinished = false;

      this.setState({ isGameStarted, isGameFinished }, () =>
        this.gameIsStarted()
      );
    }
  };

  createFieldDots = () => {
    const { field } = this.state;
    let fieldDots = [];
    const max = field ** 2;

    // Adding dots to the array with own properties
    for (let i = 0; i < max; i++) {
      fieldDots[i] = {
        status: "initial",
        id: i,
      };
    }

    this.setState({
      fieldDots,
      max,
    });

    this.props.createFieldDots(fieldDots, field, max);
  };

  render() {
    const {
      state: { gameMode, gameSettings, user, isGameStarted, loading },
      props: { isGameFinished },
    } = this;

    const disablePlayButton =
      gameMode === "DEFAULT" || user === "" || isGameStarted;

    return (
      <div className="Panel">
        <div className="gameMode">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <select value={gameMode} onChange={this.onChangeGameMode}>
              <option value="DEFAULT" disabled>
                Pick game mode...
              </option>
              {Object.keys(gameSettings).map((item) => (
                <option value={item} key={item}>
                  {item}
                </option>
              ))}
            </select>
          )}
        </div>
        <div className="inputName">
          <input
            className="enterName"
            value={user}
            onChange={this.onChangeName}
            type="text"
            placeholder="Enter your user"
          />
        </div>
        <button
          className="playButton"
          onClick={this.onClickPlay}
          disabled={disablePlayButton}
        >
          {isGameFinished ? `PLAY AGAIN` : `PLAY`}
        </button>
      </div>
    );
  }
}
