import React, { Component, Fragment } from "react";
import classNames from "classnames";
import { sampleSize, range } from "lodash";

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
      max: null,
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

  onChangeGameMode = (e) => {
    const { gameSettings } = this.state;
    const gameMode = e.target.value;

    this.setState(
      {
        gameMode,
        field: gameSettings[gameMode].field,
        delay: gameSettings[gameMode].delay,
      },
      () => this.createFieldDots()
    );
  };

  onChangeName = (e) => {
    const name = e.target.value;

    this.setState({ name });
  };

  onClickPlay = () => {
    const isGameStart = true;
    const isGameFinish = false;

    this.setState({ isGameStart, isGameFinish }, () => this.gameIsStarted());
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
      gameMode === "DEFAULT" || name === "" || isGameStart;

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

  createFieldDots = () => {
    const { field } = this.state;
    let fieldDots = [];
    const max = field ** 2;

    // adding dots to the array with own properties
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
  };

  gameIsStarted = () => {
    const { field, delay, max } = this.state;

    // create an array of random unique numbers from 0 to max
    const uniqueRandomNumbers = sampleSize(range(0, max), max);

    // creating and displaying a new random blue dot and change it to red,
    // when it has not been pressed for the time period "delay"
    const generateRandomDot = () => {
      const { fieldDots, lastNumber, points } = this.state;
      const updatedFieldDots = [...fieldDots];
      let updatedPoints = { ...points };
      const prevNumber = lastNumber;
      const prevDot = updatedFieldDots[lastNumber];

      // making a red dot for a prev number
      if (prevNumber !== null && prevDot.status !== "green") {
        updatedFieldDots[prevDot.id] = {
          ...prevDot,
          status: "red",
        };
        updatedPoints = {
          ...updatedPoints,
          computer: [...updatedPoints.computer, prevDot.id],
        };
      }

      const newLastNumber = uniqueRandomNumbers.pop();
      const updatedCurrentDot = updatedFieldDots[newLastNumber];
      updatedCurrentDot.status = "blue";

      this.setState({
        fieldDots: updatedFieldDots,
        lastNumber: newLastNumber,
        points: updatedPoints,
      });
      console.log("points.computer", points.computer);
    };

    // setting interval for generate new random dot
    let currentDotIndex = 0;
    const timer = setInterval(() => {
      generateRandomDot();
      currentDotIndex++;
      if (currentDotIndex === max) {
        clearInterval(timer);
        console.log("timer ended");
      }
    }, delay);
  };

  onClickDot = (id) => {
    let { fieldDots, points } = this.state;
    const { lastNumber } = this.state;
    let currentDot = fieldDots[lastNumber];

    // changing dot color to blue and set a point to user when he clicked to blue dot
    if (id === lastNumber) {
      currentDot.status = "green";
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
            easy: field === 5,
            normal: field === 10,
            hard: field === 15,
          })}
        >
          {fieldDots.map((dot) => (
            <Dot
              key={dot.id}
              onClick={() => this.onClickDot(dot.id)}
              {...dot}
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
