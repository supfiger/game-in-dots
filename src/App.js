import React from "react";

import "./App.sass";
import { Board, Game } from "./components/index";

function App() {
  return (
    <div className="App">
      <Game />
      <Board />
    </div>
  );
}

export default App;
