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