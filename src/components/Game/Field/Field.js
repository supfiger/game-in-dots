import React, { Component } from "react";
import { sampleSize, range } from "lodash";

import "./Field.sass";
import Dot from "./Dot/Dot";

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

  gameIsStarted = () => {
    const {
      state: { delay },
      props: { max },
    } = this;

    // Creating an array of random unique numbers (from 0 to max)
    const uniqueRandomNumbers = sampleSize(range(0, max), max);

    // Creating and displaying a new random blue dot and change it to red,
    // when it has not been pressed for the "delay" time period
    const generateRandomDot = () => {
      if (this.state.isGameStarted && !this.state.isGameFinished) {
        const { fieldDots, lastNumber, points } = this.state;
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
      if (this.state.isGameFinished || currentDotIndex === max) {
        clearInterval(timer);
        console.log("==================> timer ended");
      }
    }, delay);
  };

  gameIsFinished = () => {
    const {
      state: { points, user },
      props: { max },
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

  render() {
    const {
      props: { field, fieldDots },
    } = this;

    return (
      <div className="Field">
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
      </div>
    );
  }
}
