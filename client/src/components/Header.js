import React, { Component } from "react";
import "../../src/App.css";
import Navigator from "./Navigator.js";

const Header = () => {
  return (
    <div className="header">
      <h1>POOL MANAGER</h1>
      <Navigator current="8-Ball" items={["8-Ball", "9-Ball", "Billiards"]} />
    </div>
  );
};

export default Header;
