import React from "react";
import cx from "classnames";

import "./Dot.sass";

const Dot = (props) => {
  const { className, onClick, blueDot, greenDot, redDot } = props;

  return (
    <li
      className={cx({
        Dot: true,
        blueDot: blueDot,
        greenDot: greenDot,
        redDot: redDot,
      })}
      onClick={onClick}
    />
  );
};

export default Dot;
