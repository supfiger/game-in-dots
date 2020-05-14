import React from "react";
import Loader from "react-loader-spinner";

import "./Board.sass";

const Board = (props) => {
  const { winnersList, loadingWinners } = props;

  return (
    <div className="Board">
      <h2 className="boardTitle">Leader Board</h2>
      {!loadingWinners && winnersList && winnersList.length > 0 ? (
        <div>
          <ul className="winnersList">
            {winnersList.map((item) => (
              <li key={item.id} className="winnersListItem">
                <div className="winnerUsername">{item.winner}</div>
                <div className="winnerDate">{item.date}</div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <Loader type="ThreeDots" color="#00BFFF" height={100} width={100} />
      )}
    </div>
  );
};

export default Board;
