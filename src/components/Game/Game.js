import React, { Component } from "react";
import { sampleSize, range } from "lodash";
import classNames from "classnames";

import "./Game.sass";
import { Panel, Message, Field } from "../index";
import { gameSettings, publishWinner, winnersGet } from "../../api.js";

export default class Game extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: "",
      winner: null,
      gameMode: "DEFAULT",
      isGameStarted: false,
      isGameFinished: false,
      dataToPublish: {},
      gameSettings: {},
      winnersList: {},
      error: null,
      field: null,
      delay: null,
      max: null,
      fieldDots: [],
      lastNumber: null,
      points: {
        computer: [],
        user: [],
      },
    };
  }

  async fetchWinnersGet() {
    try {
      const result = await winnersGet();
      this.setState({
        winnersList: result.reverse(),
      });
      this.props.getWinnersList(this.state.winnersList);
    } catch (error) {
      this.setState({
        error: error,
      });
    }
  }

  async fetchGameSettings() {
    try {
      const result = await gameSettings();
      this.setState({
        gameSettings: result,
      });
    } catch (error) {
      this.setState({
        error: error,
      });
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

  async componentDidMount() {
    await this.fetchWinnersGet();
    await this.fetchGameSettings();
    localStorage.setItem("loader", false);
  }

  onChangeGameMode = async (e) => {
    const { isGameStarted } = this.state;
    const { gameSettings } = this.state;
    const gameMode = e.target.value;

    if (isGameStarted) {
      this.resetFieldDots();
    }

    await this.setState({
      gameMode,
      field: gameSettings[gameMode].field,
      delay: gameSettings[gameMode].delay,
    });
    this.createFieldDots();
  };

  onChangeName = (e) => {
    this.setState({ user: e.target.value });
  };

  onClickPlay = async () => {
    const { isGameStarted, isGameFinished } = this.state;

    if (isGameFinished) {
      this.createFieldDots();
    }

    if (!isGameStarted) {
      await this.setState({
        isGameStarted: true,
        isGameFinished: false,
      });
      this.gameIsStarted();
    }
  };

  createFieldDots = () => {
    const { field } = this.state;
    let fieldDots = [];
    const max = field ** 2;

    // Adding dots to the array with own properties
    for (let i = 0; i < max; i++) {
      fieldDots[i] = {
        color: "initial",
        clicked: false,
        id: i,
      };
    }

    this.setState({
      fieldDots,
      max,
    });
  };

  gameIsStarted = () => {
    const { delay, max } = this.state;

    // Creating an array of random unique numbers (from 0 to max)
    const uniqueRandomNumbers = sampleSize(range(0, max), max);

    // Setting interval for generate a new random dot
    let currentDotIndex = 0;
    const timer = setInterval(() => {
      if (this.isGameFinished()) {
        this.onFinishGame();
        clearInterval(timer);
      } else {
        this.generateRandomDot(uniqueRandomNumbers);
      }
      // currentDotIndex++;
      // if (
      //   !this.state.isGameStarted ||
      //   this.state.isGameFinished ||
      //   currentDotIndex === max
      // ) {
      //   clearInterval(timer);
      //   console.log("timer ended");
      // }
    }, delay);
  };

  makeLastPointRed = () => {
    const { lastNumber, points, fieldDots } = this.state;
    const updatedFieldDots = [...fieldDots];
    let updatedPoints = { ...points };
    const lastDot = updatedFieldDots[lastNumber];

    if (lastNumber !== null && lastDot.color !== "green") {
      updatedFieldDots[lastDot.id] = {
        ...lastDot,
        color: "red",
      };
      updatedPoints = {
        ...updatedPoints,
        computer: [...updatedPoints.computer, lastDot.id],
      };
    }

    this.setState({
      fieldDots: updatedFieldDots,
      points: updatedPoints,
    });
  };

  generateRandomDot = (uniqueRandomNumbers) => {
    const {
      isGameStarted,
      isGameFinished,
      fieldDots,
      lastNumber,
      points,
    } = this.state;
    // Creating and displaying a new random blue dot and change it to red,
    // when it has not been pressed for the time period "delay"
    if (isGameStarted && !isGameFinished) {
      const updatedFieldDots = [...fieldDots];
      let updatedPoints = { ...points };
      const prevNumber = lastNumber;
      const prevDot = updatedFieldDots[lastNumber];

      // Making a red dot for a prev number
      if (prevNumber !== null && prevDot.color !== "green") {
        updatedFieldDots[prevDot.id] = {
          ...prevDot,
          color: "red",
        };
        updatedPoints = {
          ...updatedPoints,
          computer: [...updatedPoints.computer, prevDot.id],
        };
        console.log("points.computer", updatedPoints.computer.length);
      }

      const newLastNumber = uniqueRandomNumbers.pop();
      const updatedCurrentDot = updatedFieldDots[newLastNumber];
      updatedCurrentDot.color = "blue";

      this.setState({
        fieldDots: updatedFieldDots,
        lastNumber: newLastNumber,
        points: updatedPoints,
      });
    }
  };

  onClickDot = (id) => {
    const { fieldDots, points, lastNumber } = this.state;

    let updatedPoints = { ...points };
    let updatedFieldDots = [...fieldDots];
    let currentDot = updatedFieldDots[lastNumber];

    // Changing dot color to blue and set a point to user when he clicked to blue dot
    if (id === lastNumber && currentDot.clicked === false) {
      currentDot.color = "green";
      currentDot.clicked = true;

      updatedPoints.user.push(lastNumber);
      console.log("points.user", updatedPoints.user.length);

      this.setState({
        fieldDots: updatedFieldDots,
        points: updatedPoints,
      });
    }
  };

  onFinishGame = () => {
    const { points, max, user } = this.state;
    const winner =
      points.computer.length === Math.floor(max / 2) ? "Computer" : user;
    this.setState(
      {
        winner,
      },
      async () => {
        this.makeLastPointRed();
        await this.postWinnerToBoard();
        this.resetFieldDots();
      }
    );
  };

  isGameFinished = () => {
    const { points, max } = this.state;
    return (
      points.computer.length === Math.floor(max / 2) ||
      points.user.length === Math.floor(max / 2)
    );
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
    this.fetchWinnersGet();
  };

  render() {
    const componentProps = this.state;

    const contentStyles = {
      content: true,
      isGameModePicked: this.state.gameMode !== "DEFAULT",
    };

    return (
      <div className="Game">
        <h1 className="gameTitle">Game in Dots</h1>
        <div className={classNames(contentStyles)}>
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
