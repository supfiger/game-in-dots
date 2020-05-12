import React, { Component } from "react";

import "./Field.sass";
import { Dot } from "../index";

export default class Field extends Component {
  constructor(props) {
    super(props);

    this.state = {
      winner: "",
      max: null,
      lastNumber: null,
      points: {
        computer: [],
        user: [],
      },
    };
  }

  onClickBlueDot = (id) => {
    const {
      state: { points, lastNumber },
      props: { fieldDots },
    } = this;

    let currentDot = fieldDots[lastNumber];

    // Changing dot color to blue and set a point to user when he clicked to blue dot
    if (id === lastNumber) {
      currentDot.status = "green";
      points.user.push(lastNumber);
      console.log("user", points.user.length);

      this.setState({
        fieldDots,
        points,
      });
    }
  };

  gameIsFinished = () => {
    const {
      state: { points },
      props: { max, user },
    } = this;

    if (points.computer.length === Math.floor(max / 2)) {
      this.setState({
        winner: "Computer",
      });
      this.resetFieldDots();
    }

    if (points.user.length === Math.floor(max / 2)) {
      this.setState({
        winner: user,
      });
      this.resetFieldDots();
    }

    if (this.state.isGameFinished) {
      this.postWinnerToBoard();
      console.log("isGameFinished", this.state.isGameFinished);
    }
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

  render() {
    const {
      props: { field, fieldDots, isGameStarted },
    } = this;

    return (
      <div className="Field">
        {field !== null && field !== undefined && (
          <ul className="grid">
            {fieldDots &&
              field &&
              fieldDots.map((dot) => (
                <Dot
                  key={dot.id}
                  field={field}
                  onClick={() => this.onClickBlueDot(dot.id)}
                  {...dot}
                />
              ))}
          </ul>
        )}
      </div>
    );
  }
}
