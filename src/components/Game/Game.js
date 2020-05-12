import React, { Component, Fragment } from "react";
import classNames from "classnames";
import { sampleSize, range } from "lodash";

import "./Game.sass";
import { Dot } from "../index";
import { gameSettings } from "../../api.js";
import { winnersPost } from "../../api.js";

export default class Game extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: "",
      winner: "",
      gameMode: "DEFAULT",
      gameSettings: {},
      isGameStarted: false,
      isGameFinished: false,
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
  };

  gameIsStarted = () => {
    const { field, delay, max } = this.state;

    // Creating an array of random unique numbers (from 0 to max)
    const uniqueRandomNumbers = sampleSize(range(0, max), max);

    // Creating and displaying a new random blue dot and change it to red,
    // when it has not been pressed for the time period "delay"
    const generateRandomDot = () => {
      const { fieldDots, lastNumber, points } = this.state;
      const updatedFieldDots = [...fieldDots];
      let updatedPoints = { ...points };
      const prevNumber = lastNumber;
      const prevDot = updatedFieldDots[lastNumber];

      // Making a red dot for a prev number
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
      console.log("points.computer", this.state.points.computer);

      const newLastNumber = uniqueRandomNumbers.pop();
      const updatedCurrentDot = updatedFieldDots[newLastNumber];
      updatedCurrentDot.status = "blue";

      this.setState({
        fieldDots: updatedFieldDots,
        lastNumber: newLastNumber,
        points: updatedPoints,
      });
      this.gameIsFinished();
    };

    // Setting interval for generate a new random dot
    let currentDotIndex = 0;
    const timer = setInterval(() => {
      generateRandomDot();
      currentDotIndex++;
      if (currentDotIndex === max || this.state.isGameFinished) {
        clearInterval(timer);
        console.log("timer ended");
      }
    }, delay);
  };

  gameIsFinished = () => {
    const { points, max, user } = this.state;
    const resetState = {
      isGameFinished: true,
      isGameStarted: false,
      lastNumber: null,
      prevLastNumber: null,
      points: {
        computer: [],
        user: [],
      },
    };

    if (points.computer.length == Math.floor(max / 2)) {
      this.setState({
        winner: "Computer",
        ...resetState,
      });
    }

    if (points.user.length == Math.floor(max / 2)) {
      this.setState({
        winner: user,
        ...resetState,
      });
    }

    if (this.state.isGameFinished) {
      this.postWinnerToBoard();
    }
  };

  onClickDot = (id) => {
    let { fieldDots, points } = this.state;
    const { lastNumber } = this.state;
    let currentDot = fieldDots[lastNumber];

    // Changing dot color to blue and set a point to user when he clicked to blue dot
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

  postWinnerToBoard = () => {
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

    this.setState({
      toPostWinner: uploadWinner,
    });

    this.fetchWinnersPost();
  };

  Panel = () => {
    const {
      state: {
        gameMode,
        gameSettings,
        user,
        isGameStarted,
        isGameFinished,
        loading,
      },
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
  };

  Message = () => {
    const { isGameFinished, winner } = this.state;

    return (
      <div className="Message">
        {this.state.isGameFinished && (
          <Fragment>
            WON: <span>{this.state.winner}</span>
          </Fragment>
        )}
      </div>
    );
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
        <h1 className="gameTitle">Game in Dots</h1>
        <div className="content">
          {this.Panel()}
          {this.Message()}
          {field !== null && this.Field()}
        </div>
      </div>
    );
  }
}
