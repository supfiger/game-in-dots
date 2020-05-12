import React, { Component } from "react";

import "./Game.sass";
import Message from "./Message/Message";
import Panel from "./Panel/Panel";
import Field from "./Field/Field";
import { winnersPost } from "../../api.js";

export default class Game extends Component {
  constructor(props) {
    super(props);

    this.state = {
      winner: "",
      isGameStarted: false,
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

  createFieldDots = (fieldDots, max, field) => {
    this.setState({
      fieldDots,
      max,
      field,
    });
  };

  resetFieldDots = () => {
    const resetState = {
      isGameFinished: true,
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

  render() {
    const {
      state: { winner, isGameFinished, fieldDots, max },
      props: { field },
    } = this;

    console.log("Game Component field", field);

    return (
      <div className="Game">
        <h1 className="gameTitle">Game in Dots</h1>
        <div className="content">
          <Panel
            isGameFinished={isGameFinished}
            createFieldDots={this.createFieldDots}
          />
          <Message winner={winner} isGameFinished={isGameFinished} />
          {field !== null && field !== undefined && (
            <Field fieldDots={fieldDots} max={max} field={field} />
          )}
        </div>
      </div>
    );
  }
}
