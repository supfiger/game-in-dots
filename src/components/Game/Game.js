import React, { Component } from "react";
import { sampleSize, range } from "lodash";

import "./Game.sass";
import { Panel, Message, Field } from "../index";
import { winnersPost } from "../../api.js";

export default class Game extends Component {
  constructor(props) {
    super(props);

    this.state = {
      winner: "",
      isGameStarted: false,
      isGameFinished: false,
      toPostWinner: {},
      fieldDots: null,
      max: null,
      field: null,
    };
  }

  async fetchWinnersPost() {
    try {
      const result = await winnersPost(this.state.toPostWinner);
      this.setState({
        winnersPost: result,
      });
    } catch (error) {
      this.setState({
        error: error,
      });
    }
  }

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

  createFieldDots = (fieldDots, field, delay, max, user) => {
    this.setState({
      fieldDots,
      field,
      delay,
      max,
      user,
    });
  };

  gameIsStarted = () => {
    const {
      props: { field, delay, max, isGameStarted, isGameFinished, fieldDots },
    } = this;

    // Creating an array of random unique numbers (from 0 to max)
    const uniqueRandomNumbers = sampleSize(range(0, max), max);

    // Creating and displaying a new random blue dot and change it to red,
    // when it has not been pressed for the "delay" time period
    const generateRandomDot = () => {
      if (isGameStarted && !isGameFinished) {
        const { lastNumber, points } = this.state;
        const updatedFieldDots = [...fieldDots];
        let updatedPoints = { ...points };
        // console.log("updatedPoints", updatedPoints);
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
          console.log("computer", updatedPoints.computer.length);
        }

        const newLastNumber = uniqueRandomNumbers.pop();
        const updatedCurrentDot = updatedFieldDots[newLastNumber];
        updatedCurrentDot.status = "blue";

        this.setState({
          fieldDots: updatedFieldDots,
          lastNumber: newLastNumber,
          points: updatedPoints,
        });
      }
    };

    // Setting interval for generate a new random dot
    let currentDotIndex = 0;
    const timer = setInterval(() => {
      this.gameIsFinished();
      generateRandomDot();
      currentDotIndex++;
      if (isGameFinished || currentDotIndex === max) {
        clearInterval(timer);
        console.log("==================> timer ended");
      }
    }, delay);
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
      () => {
        this.createFieldDots();
        if (this.state.isGameStarted) {
          this.resetFieldDots();
        }
        this.gameIsStarted();
      }
    );
  };

  render() {
    const {
      state: {
        winner,
        field,
        delay,
        isGameStarted,
        isGameFinished,
        fieldDots,
        max,
        user,
      },
    } = this;

    return (
      <div className="Game">
        <h1 className="gameTitle">Game in Dots</h1>
        <div className="content">
          <Panel
            isGameFinished={isGameFinished}
            createFieldDots={this.createFieldDots}
            onChangeGameMode={this.onChangeGameMode}
          />
          <Message winner={winner} isGameFinished={isGameFinished} />
          <Field
            isGameStarted={isGameStarted}
            isGameFinished={isGameFinished}
            fieldDots={fieldDots}
            max={max}
            field={field}
            delay={delay}
            user={user}
          />
        </div>
      </div>
    );
  }
}
