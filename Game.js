import React, { useEffect, useRef, useState } from "react";
import Player from "./Player";
import Obstacles from "./Obstacles";
import { clamp, randomBetween } from "./utils";
import "./index.css";

const GAME_WIDTH = 800;
const GAME_HEIGHT = 500;