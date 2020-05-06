import React, { Component } from "react";

import "./Board.sass";
import { winnersGet } from "../../api.js";

export default class Board extends Component {
  constructor(props) {
    super(props);

    this.state = {
      winnersItems: {},
      error: false,
    };
  }

  async fetchWinnersGet() {
    try {
      const result = await winnersGet();
      this.setState({
        winnersItems: result,
      });
      console.log("Board result", result);
    } catch (error) {
      this.setState({
        error: error,
      });
    }
  }

  componentDidMount() {
    this.fetchWinnersGet();
  }

  render() {
    const {
      state: { winnersItems },
    } = this;

    return (
      <div>
        <h1>Leader Board</h1>
        {winnersItems && winnersItems.length > 0 && (
          <div>
            <ul className="leadersList">
              {winnersItems.map((item) => (
                <li key={item.id} className="leaderListItem">
                  <div>{item.winner}</div>
                  <div>{item.date}</div>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div></div>
      </div>
    );
  }
}
