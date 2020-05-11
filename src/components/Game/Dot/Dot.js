import React from "react";
import cx from "classnames";

import "./Dot.sass";

const Dot = (props) => {
  const {
    className,
    onClick,
    onMouseOver,
    onMouseOut,
    blueDot,
    greenDot,
    redDot,
    hoverDot,
  } = props;

  let myStyles;

  if (hoverDot) {
    myStyles = {
      hover: { background: "black" },
    };
  }

  console.log("Dot hoverDot", hoverDot);
  console.log("Dot hoverDot", hoverDot);

  return (
    <li
      className={cx({
        Dot: true,
        blueDot: blueDot,
        greenDot: greenDot,
        redDot: redDot,
        hoverDot: hoverDot,
      })}
      onClick={onClick}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      style={myStyles}
    />
  );
};

export default Dot;
