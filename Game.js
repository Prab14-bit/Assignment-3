import React, { useEffect, useRef, useState } from "react";
import Player from "./Player";
import Obstacles from "./Obstacles";
import { clamp, randomBetween } from "./utils";
import "./index.css";

const GAME_WIDTH = 800;
const GAME_HEIGHT = 500;
const PLAYER_SIZE = { w: 40, h: 40 };
const GRAVITY = 0.7;
const JUMP_VELOCITY = -12;
const HORIZ_SPEED = 6;

const PIPE_WIDTH = 80;
const PIPE_SPEED = 3;
const PIPE_SPAWN_INTERVAL = 1600;

const GAP_MIN = 120;
const GAP_MAX = 180;

export default function Game() {
  const [player, setPlayer] = useState({
    x: GAME_WIDTH / 4,
    y: GAME_HEIGHT - PLAYER_SIZE.h - 10,
    vx: 0,
    vy: 0,
    isOnGround: true,
  });
  const [pipes, setPipes] = useState([]);
  const [score, setScore] = useState(0);
  const [running, setRunning] = useState(true);

  const keysRef = useRef({});
  const rafRef = useRef(null);
  const idRef = useRef(1);

  // handle keydown
  useEffect(() => {
    function onKeyDown(e) {
      keysRef.current[e.code] = true;

      if ((e.code === "Space" || e.code === "ArrowUp") && player.isOnGround) {
        setPlayer((p) => ({ ...p, vy: JUMP_VELOCITY, isOnGround: false }));
      }

      if (!running && e.code === "Enter") resetGame();
    }

    function onKeyUp(e) {
      delete keysRef.current[e.code];
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [running, player.isOnGround]);

  // SPAWN PIPES
  useEffect(() => {
    const interval = setInterval(() => {
      if (!running) return;

      const gap = randomBetween(GAP_MIN, GAP_MAX);
      const topHeight = randomBetween(40, GAME_HEIGHT - gap - 40);

      const id = idRef.current++;
      setPipes((prev) => [
        ...prev,
        {
          id,
          x: GAME_WIDTH,
          topHeight,
          gap,
          passed: false,
        },
      ]);
    }, PIPE_SPAWN_INTERVAL);

    return () => clearInterval(interval);
  }, [running]);

  // GAME LOOP
  useEffect(() => {
    function update() {
      setPlayer((p) => {
        let vx = 0;
        if (keysRef.current["ArrowLeft"]) vx = -HORIZ_SPEED;
        if (keysRef.current["ArrowRight"]) vx = HORIZ_SPEED;

        let vy = p.vy + GRAVITY;
        let newX = clamp(p.x + vx, 0, GAME_WIDTH - PLAYER_SIZE.w);
        let newY = p.y + vy;

        let grounded = false;
        if (newY + PLAYER_SIZE.h >= GAME_HEIGHT) {
          newY = GAME_HEIGHT - PLAYER_SIZE.h;
          vy = 0;
          grounded = true;
        }

        return {
          ...p,
          x: newX,
          y: newY,
          vx,
          vy,
          isOnGround: grounded,
        };
      });

      // Update pipes + scoring
      setPipes((prev) =>
        prev
          .map((pipe) => ({
            ...pipe,
            x: pipe.x - PIPE_SPEED,
          }))
          .filter((pipe) => pipe.x + PIPE_WIDTH > 0)
      );

      // Score
      pipes.forEach((pipe) => {
        if (!pipe.passed && player.x > pipe.x + PIPE_WIDTH) {
          pipe.passed = true;
          setScore((s) => s + 1);
        }
      });

      // Collision detection
      pipes.forEach((pipe) => {
        const topCollide =
          player.x < pipe.x + PIPE_WIDTH &&
          player.x + PLAYER_SIZE.w > pipe.x &&
          player.y < pipe.topHeight;

        const bottomCollide =
          player.x < pipe.x + PIPE_WIDTH &&
          player.x + PLAYER_SIZE.w > pipe.x &&
          player.y + PLAYER_SIZE.h >
            pipe.topHeight + pipe.gap;

        if (topCollide || bottomCollide) setRunning(false);
      });

      rafRef.current = requestAnimationFrame(update);
    }

    rafRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafRef.current);
  });

  function resetGame() {
    setPlayer({
      x: GAME_WIDTH / 4,
      y: GAME_HEIGHT - PLAYER_SIZE.h - 10,
      vx: 0,
      vy: 0,
      isOnGround: true,
    });
    setPipes([]);
    setScore(0);
    setRunning(true);
  }

  return (
    <div className="game-container" style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}>
      <div className="score">Score: {score}</div>

      <Player x={player.x} y={player.y} />

      {pipes.map((p) => (
        <Obstacles key={p.id} pipe={p} height={GAME_HEIGHT} />
      ))}

      {!running && <div className="game-over">Game Over — Press Enter</div>}
    </div>
  );
}
