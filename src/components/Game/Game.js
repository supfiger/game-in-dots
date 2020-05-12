import React, { Component } from "react";

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

  gameIsStarted = (isGameStarted) => {
    console.log("isGameStarted", isGameStarted);
    this.setState({
      isGameStarted,
    });
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
            gameIsStarted={this.gameIsStarted}
            createFieldDots={this.createFieldDots}
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
