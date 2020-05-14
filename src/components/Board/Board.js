import React from "react";

import "./Board.sass";

const Board = (props) => {
  const { winnersList } = props;

  return (
    <div className="Board">
      <h2 className="boardTitle">Leader Board</h2>
      {winnersList && winnersList.length > 0 && (
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
      )}
    </div>
  );
};

export default Board;
