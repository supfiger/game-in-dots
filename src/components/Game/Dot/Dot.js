import React from "react";
import classNames from "classnames";

import "./Dot.sass";

const Dot = (props) => {
  const { onClick, status } = props;

  return <li className={classNames("Dot", status)} onClick={onClick} />;
};

export default Dot;
