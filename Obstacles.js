import React from "react";
import "./index.css";

export default function Obstacles({ pipe, height }) {
  const { x, topHeight, gap } = pipe;

  return (
    <>
      {/* TOP PIPE */}
      <div
        className="pipe top-pipe"
        style={{
          left: x,
          height: topHeight,
        }}
      ></div>

      {/* BOTTOM PIPE */}
      <div
        className="pipe bottom-pipe"
        style={{
          left: x,
          top: topHeight + gap,
          height: height - (topHeight + gap),
        }}
      ></div>
    </>
  );
}
