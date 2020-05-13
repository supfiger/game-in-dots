import React, { Component, Fragment } from "react";

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
        winnersItems: result.reverse(),
      });
    } catch (error) {
      this.setState({
        error: error,
      });
    }
  }

  componentDidMount() {
    this.fetchWinnersGet();
  }

  componentDidUpdate() {
    this.fetchWinnersGet();
  }

  render() {
    const { winnersItems } = this.state;

    return (
      <div className="Board">
        <h2 className="boardTitle">Leader Board</h2>
        {winnersItems && winnersItems.length > 0 && (
          <div>
            <ul className="leaderList">
              {winnersItems.map((item) => (
                <li key={item.id} className="leaderListItem">
                  <div className="leaderUsername">{item.winner}</div>
                  <div className="leaderDate">{item.date}</div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
}
