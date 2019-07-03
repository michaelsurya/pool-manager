import React from "react";
import { Link, matchPath } from "react-router-dom";

const HeaderNavigator = () => {
  var currentPath = window.location.pathname;
  var eightBallCurrentStyle = matchPath(currentPath, {
    path: "/8-ball",
    exact: false
  })
    ? { fontWeight: "bold" }
    : {};

  var nineBallCurrentStyle = matchPath(currentPath, {
    path: "/9-ball",
    exact: false
  })
    ? { fontWeight: "bold" }
    : {};

  var billiardsCurrentStyle = matchPath(currentPath, {
    path: "/billiards",
    exact: false
  })
    ? { fontWeight: "bold" }
    : {};

  return (
    <div className="nav">
      <ul>
        <li>
          <Link to="/8-ball" style={eightBallCurrentStyle}>
            8-Ball
          </Link>
        </li>
        <li>
          <Link to="/9-ball" style={nineBallCurrentStyle}>
            9-Ball
          </Link>
        </li>
        <li>
          <Link to="/billiards" style={billiardsCurrentStyle}>
            Billiards
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default HeaderNavigator;
