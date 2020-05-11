import React, { Component, Fragment } from "react";
import classNames from "classnames";
import _ from "lodash";

import "./Game.sass";
import Dot from "./Dot/Dot";
import { gameSettings } from "../../api.js";
import { winnersPost } from "../../api.js";

export default class Game extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      winner: "",
      gameMode: "DEFAULT",
      gameSettings: {},
      isGameStart: false,
      isGameFinish: false,
      toPostWinner: {},
      error: null,
      field: null,
      delay: null,
      loading: false,
      fieldDots: [],
      lastNumber: null,
      prevLastNumber: null,
      points: {
        computer: [],
        user: [],
      },
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

  async fetchWinnersPost() {
    try {
      const result = await winnersPost(this.state.toPostWinner);
      this.setState({
        winnersPost: result,
      });
      console.log("fetchWinnersPost", result);
    } catch (error) {
      this.setState({
        error: error,
      });
    }
  }

  componentDidMount() {
    this.fetchGameSettings();
  }

  whoWon = () => {
    const { toPostWinner, winner } = this.state;
    let uploadWinner = toPostWinner;

    const date = new Date();
    const winnerTime = `${date.toLocaleString("default", {
      hour: "numeric",
      minute: "numeric",
    })}; ${date.getDate()} ${date.toLocaleString("en", {
      month: "long",
    })} ${date.getFullYear()}`;

    uploadWinner.winner = winner;
    uploadWinner.date = winnerTime;

    console.log("toPostWinner", toPostWinner);

    this.setState({
      toPostWinner: uploadWinner,
    });

    this.fetchWinnersPost();
  };

  onClickFinish = () => {
    const winner = this.state.name;

    this.setState(
      {
        isGameFinish: true,
        isGameStart: false,
        winner,
      },
      () => this.whoWon()
    );
  };

  onChangeMode = (e) => {
    const { gameSettings } = this.state;
    const gameMode = e.target.value;

    this.setState(
      {
        gameMode,
        field: gameSettings[gameMode].field,
        delay: gameSettings[gameMode].delay,
      },
      () => this.createField()
    );
  };

  onChangeName = (e) => {
    const name = e.target.value;

    this.setState({ name });
  };

  onClickPlay = () => {
    const isGameStart = true;
    const isGameFinish = false;

    this.setState({ isGameStart, isGameFinish }, () => this.updateField());
  };

  Panel = () => {
    const {
      state: {
        gameMode,
        gameSettings,
        name,
        isGameStart,
        isGameFinish,
        loading,
      },
    } = this;

    const disablePlayButton =
      gameMode == "DEFAULT" || name == "" || isGameStart;

    return (
      <div className="Panel">
        <div className="gameMode">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <select value={gameMode} onChange={this.onChangeMode}>
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
            value={name}
            onChange={this.onChangeName}
            type="text"
            placeholder="Enter your name"
          />
        </div>
        <button
          className="playButton"
          onClick={this.onClickPlay}
          disabled={disablePlayButton}
        >
          {isGameFinish ? `PLAY AGAIN` : `PLAY`}
        </button>
      </div>
    );
  };

  Message = () => {
    const { isGameStart, isGameFinish } = this.state;

    return (
      <div className="Message">
        {this.state.isGameFinish && (
          <Fragment>
            WON: <span>{this.state.winner}</span>
          </Fragment>
        )}
        {(isGameStart || isGameFinish) && (
          <Fragment>
            {isGameStart && <div>Game is start!</div>}
            {isGameFinish && <div>Game is finish!</div>}
            <button onClick={this.onClickFinish}>Finish the game</button>
          </Fragment>
        )}
      </div>
    );
  };

  createField = () => {
    const { field } = this.state;
    let fieldDots = [];
    const min = 0;
    const max = field ** 2;

    if (field) {
      for (let i = 0; i < max; i++) {
        fieldDots[i] = {
          status: "initial",
          id: i,
        };
      }

      this.setState({
        fieldDots,
      });
    }
  };

  updateField = () => {
    const { field, delay } = this.state;
    const min = 0;
    const max = field ** 2;
    console.log("max", max);
    const uniqueRandomNumbers = _.sampleSize(_.range(min, max), max);

    const newField = () => {
      const { fieldDots, lastNumber, points } = this.state;
      const updatedFieldDots = [...fieldDots];
      let updatedPoints = { ...points };
      const prevNumber = lastNumber;
      const prevDot = updatedFieldDots[lastNumber];

      // Make red dot for prev number
      if (prevNumber !== null && prevDot.status !== "greenDot") {
        updatedFieldDots[prevDot.id] = { ...prevDot, status: "redDot" };
        updatedPoints = {
          ...updatedPoints,
          computer: [...updatedPoints.computer, prevDot.id],
        };
      }

      const newLastNumber = uniqueRandomNumbers.pop();
      const updatedCurrentDot = updatedFieldDots[newLastNumber];
      updatedCurrentDot.status = "blueDot";

      this.setState({
        fieldDots: updatedFieldDots,
        lastNumber: newLastNumber,
        points: updatedPoints,
      });
    };

    let i = min;
    const timer = setInterval(() => {
      newField();
      i++;
      if (i === max) {
        clearInterval(timer);
        console.log("timer ended");
      }
    }, delay);
  };

  onClickDot = (id) => {
    let { fieldDots, points } = this.state;
    const { lastNumber } = this.state;
    let currentDot = fieldDots[lastNumber];

    if (id === lastNumber) {
      currentDot.status = "greenDot";
      points.user.push(lastNumber);
      console.log("points.user", points.user);

      this.setState({
        fieldDots,
        points,
      });
    }
  };

  Field = () => {
    const { field, fieldDots } = this.state;

    return (
      <div className="Field">
        <ul
          className={classNames({
            grid: true,
            easy: field == 5,
            normal: field == 10,
            hard: field == 15,
          })}
        >
          {fieldDots.map((dot) => (
            <Dot
              key={dot.id}
              {...dot}
              onClick={() => this.onClickDot(dot.id)}
            />
          ))}
        </ul>
      </div>
    );
  };

  render() {
    const { field } = this.state;

    return (
      <div className="Game">
        <h1 className="gameTitle">Game In Dots</h1>
        <div className="content">
          {this.Panel()}
          {this.Message()}
          {field !== null && this.Field()}
        </div>
      </div>
    );
  }
}
