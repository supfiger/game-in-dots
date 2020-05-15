import React from "react";
import Loader from "react-loader-spinner";
import classNames from "classnames";

import "./Board.sass";

const Board = (props) => {
  const { winnersList, loadingWinners, isGameFinished } = props;
  const showWinnersList = winnersList && winnersList.length > 0;
  const listItemStyles = {
    winnersListItem: true,
    highlightLastWinner: isGameFinished,
  };

  return (
    <div className="Board">
      <h2 className="boardTitle">Leader Board</h2>
      {loadingWinners && !isGameFinished && (
        <Loader type="TailSpin" color="#00BFFF" height={60} width={60} />
      )}
      {showWinnersList && (
        <ul className="winnersList">
          {winnersList.map((item) => (
            <li key={item.id} className={classNames(listItemStyles)}>
              <div className="winnerUsername">{item.winner}</div>
              <div className="winnerDate">{item.date}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Board;
