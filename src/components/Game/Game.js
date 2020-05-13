import React, { Component } from "react";
import { sampleSize, range } from "lodash";

import "./Game.sass";
import { Panel, Message, Field } from "../index";
import { gameSettings, publishWinner } from "../../api.js";

export default class Game extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: "",
      winner: null,
      gameMode: "DEFAULT",
      gameSettings: {},
      isGameStarted: false,
      isGameFinished: false,
      dataToPublish: {},
      error: null,
      field: null,
      delay: null,
      max: null,
      loading: false,
      fieldDots: [],
      lastNumber: null,
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

  async fetchPublishWinner() {
    try {
      await publishWinner(this.state.dataToPublish);
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
      () => {
        this.createFieldDots();
        if (this.state.isGameStarted) {
          this.resetFieldDots();
        }
      }
    );
  };

  onChangeName = (e) => {
    this.setState({ user: e.target.value });
  };

  onClickPlay = () => {
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

  generateRandomDot = (uniqueRandomNumbers) => {
    // Creating and displaying a new random blue dot and change it to red,
    // when it has not been pressed for the time period "delay"
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
    console.log("points.computer", this.state.points.computer.length);

    const newLastNumber = uniqueRandomNumbers.pop();
    const updatedCurrentDot = updatedFieldDots[newLastNumber];
    updatedCurrentDot.status = "blue";

    this.setState({
      fieldDots: updatedFieldDots,
      lastNumber: newLastNumber,
      points: updatedPoints,
    });
  };

  gameIsStarted = () => {
    const { field, delay, max } = this.state;

    // Creating an array of random unique numbers (from 0 to max)
    const uniqueRandomNumbers = sampleSize(range(0, max), max);

    // Setting interval for generate a new random dot
    let currentDotIndex = 0;
    const timer = setInterval(() => {
      this.gameIsFinished();
      this.generateRandomDot(uniqueRandomNumbers);
      currentDotIndex++;
      if (currentDotIndex === max || this.state.isGameFinished) {
        clearInterval(timer);
        console.log("timer ended");
      }
    }, 1000);
  };

  gameIsFinished = () => {
    const { points, max, user } = this.state;

    if (points.computer.length === Math.floor(max / 2)) {
      this.setState({
        winner: "Computer",
        isGameFinished: true,
      });
    }

    if (points.user.length === Math.floor(max / 2)) {
      this.setState({
        winner: user,
        isGameFinished: true,
      });
    }

    if (this.state.isGameFinished) {
      this.resetFieldDots();
      this.postWinnerToBoard();
    }
  };

  resetFieldDots = () => {
    const resetState = {
      isGameStarted: false,
      lastNumber: null,
      points: {
        computer: [],
        user: [],
      },
    };

    this.setState({
      ...resetState,
    });
  };

  onClickDot = (id) => {
    let { fieldDots, points } = this.state;
    const { lastNumber } = this.state;
    let currentDot = fieldDots[lastNumber];

    // Changing dot color to blue and set a point to user when he clicked to blue dot
    if (id === lastNumber) {
      currentDot.status = "green";
      points.user.push(lastNumber);
      console.log("points.user", points.user.length);

      this.setState({
        fieldDots,
        points,
      });
    }
  };

  postWinnerToBoard = () => {
    const { dataToPublish, winner } = this.state;
    let uploadWinner = { ...dataToPublish };

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
      dataToPublish: uploadWinner,
    });

    this.fetchPublishWinner();
  };

  render() {
    const componentProps = this.state;

    return (
      <div className="Game">
        <h1 className="gameTitle">Game in Dots</h1>
        <div className="content">
          <Panel
            {...componentProps}
            onChangeGameMode={this.onChangeGameMode}
            onChangeName={this.onChangeName}
            onClickPlay={this.onClickPlay}
          />
          <Message {...componentProps} />
          <Field {...componentProps} onClickDot={this.onClickDot} />
        </div>
      </div>
    );
  }
}
