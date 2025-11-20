import React from "react";

export default function Player({ x, y }) {
  return (
    <div
      className="player"
      style={{
        left: x,
        top: y,
      }}
    />
  );
}
