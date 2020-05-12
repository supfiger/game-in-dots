import React from "react";

import "./Field.sass";
import { Dot } from "../index";

const Field = (props) => {
  const { field, fieldDots } = props;

  return (
    <div className="Field">
      {field && (
        <ul className="grid">
          {fieldDots.map((dot) => (
            <Dot
              key={dot.id}
              onClick={() => props.onClickDot(dot.id)}
              {...dot}
              field={field}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default Field;
