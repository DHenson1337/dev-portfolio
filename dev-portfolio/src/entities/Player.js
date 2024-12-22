import { store } from "../store";
import {
  isEmailModalVisibleAtom,
  isProjectModalVisibleAtom,
  isSocialModalVisibleAtom,
  isJokeModalVisibleAtom,
} from "../store";

export default function makePlayer(k, posVec2, speed) {
  const DIAGONAL_FACTOR = 0.7071; // Adjusts diagonal movement speed to be consistent with cardinal directions

  // Load player animations - each sprite sheet has 8 frames horizontally and 6 rows vertically
  k.loadSprite("playerIdle", "./sprites/idle.png", {
    sliceX: 8,
    sliceY: 6,
    anims: {
      idleDown: { from: 0, to: 7, loop: true },
      idleDownLeft: { from: 8, to: 15, loop: true },
      idleLeft: { from: 8, to: 15, loop: true },
      idleTopLeft: { from: 16, to: 23, loop: true },
      idleUp: { from: 24, to: 31, loop: true },
      idleTopRight: { from: 32, to: 39, loop: true },
      idleRight: { from: 40, to: 47, loop: true },
      idleBottomRight: { from: 40, to: 47, loop: true },
    },
  });

  k.loadSprite("playerWalk", "./sprites/walk.png", {
    sliceX: 8,
    sliceY: 6,
    anims: {
      walkDown: { from: 0, to: 7, loop: true },
      walkDownLeft: { from: 8, to: 15, loop: true },
      walkLeft: { from: 8, to: 15, loop: true },
      walkTopLeft: { from: 16, to: 23, loop: true },
      walkUp: { from: 24, to: 31, loop: true },
      walkTopRight: { from: 32, to: 39, loop: true },
      walkRight: { from: 40, to: 47, loop: true },
      walkBottomRight: { from: 40, to: 47, loop: true },
    },
  });

  k.loadSprite("playerDash", "./sprites/dash.png", {
    sliceX: 8,
    sliceY: 6,
    anims: {
      dashDown: { from: 0, to: 7, loop: true },
      dashDownLeft: { from: 8, to: 15, loop: true },
      dashLeft: { from: 8, to: 15, loop: true },
      dashTopLeft: { from: 16, to: 23, loop: true },
      dashUp: { from: 24, to: 31, loop: true },
      dashTopRight: { from: 32, to: 39, loop: true },
      dashRight: { from: 40, to: 47, loop: true },
      dashBottomRight: { from: 40, to: 47, loop: true },
    },
  });

  // Initialize the player object with core components and starting state
  const player = k.add([
    k.sprite("playerIdle", { anim: "idleDown" }), // Start with idle animation
    k.scale(8),
    k.anchor("center"),
    //(Top left corner relative to player position
    // X & Y)
    k.area({ shape: new k.Rect(k.vec2(0), 5, 15) }),

    k.body(),
    k.pos(posVec2),
    "player",
    {
      direction: k.vec2(0, 0),
      directionName: "idleDown",
      currentState: "idle",
      lastValidDirection: k.vec2(0, 1), // Track last direction for idle animations
    },
  ]);

  // Minimum distance threshold to prevent jittery movement when mouse is near player
  const MIN_MOVEMENT_THRESHOLD = 5;

  // Mouse/Touch input handling
  let isMouseDown = false;
  const game = document.getElementById("game");

  // Input event listeners
  game.addEventListener("focusout", () => {
    isMouseDown = false;
  });
  game.addEventListener("mousedown", () => {
    isMouseDown = true;
  });
  game.addEventListener("mouseup", () => {
    isMouseDown = false;
  });
  game.addEventListener("touchstart", () => {
    isMouseDown = true;
  });
  game.addEventListener("touchend", () => {
    isMouseDown = false;
  });

  // Safely handles animation transitions with error catching
  const safePlayAnimation = (animName) => {
    try {
      if (player.sprite && animName) {
        player.play(animName);
      }
    } catch (error) {
      console.warn(`Failed to play animation: ${animName}`, error);
    }
  };

  // Determine the correct animation based on movement direction
  const getDirectionName = (direction, isMoving) => {
    const prefix = isMoving ? "walk" : "idle";

    // Handle pure horizontal movement
    if (Math.abs(direction.y) < 0.3) {
      if (direction.x > 0) return `${prefix}Right`;
      if (direction.x < 0) return `${prefix}Left`;
    }

    // Handle vertical and diagonal movement
    if (direction.y < -0.3) {
      // Moving upward
      if (direction.x > 0.3) return `${prefix}TopRight`;
      if (direction.x < -0.3) return `${prefix}TopLeft`;
      return `${prefix}Up`;
    } else if (direction.y > 0.3) {
      // Moving downward
      if (direction.x > 0.3) return `${prefix}BottomRight`;
      if (direction.x < -0.3) return `${prefix}DownLeft`;
      return `${prefix}Down`;
    }

    // Default case
    return `${prefix}Down`;
  };

  // Main update loop for player logic
  player.onUpdate(() => {
    // Smooth camera following
    if (!k.getCamPos().eq(player.pos)) {
      k.tween(
        k.getCamPos(),
        player.pos,
        0.2,
        (newPos) => k.setCamPos(newPos),
        k.easings.linear
      );
    }

    // Skip updates if modals are visible
    if (
      store.get(isSocialModalVisibleAtom) ||
      store.get(isEmailModalVisibleAtom) ||
      store.get(isProjectModalVisibleAtom) ||
      store.get(isJokeModalVisibleAtom)
    ) {
      return;
    }

    // Calculate movement direction and distance
    player.direction = k.vec2(0, 0);
    const worldMousePos = k.toWorld(k.mousePos());
    const directionVector = worldMousePos.sub(player.pos);
    const distance = directionVector.len();

    // Only move if mouse is pressed and beyond minimum threshold
    if (isMouseDown && distance > MIN_MOVEMENT_THRESHOLD) {
      player.direction = directionVector.unit();
      player.lastValidDirection = player.direction;
    }

    // Handle state changes and animations
    const isMoving = !player.direction.eq(k.vec2(0, 0));

    if (!isMoving) {
      // Switch to idle state if not moving
      if (player.currentState !== "idle") {
        player.currentState = "idle";
        player.use(k.sprite("playerIdle"));
      }
      // Use last valid direction for idle animation
      const newDirectionName = getDirectionName(
        player.lastValidDirection,
        false
      );
      if (newDirectionName !== player.directionName) {
        player.directionName = newDirectionName;
        safePlayAnimation(newDirectionName);
      }
    } else {
      // Switch to walk state if moving
      if (player.currentState !== "walk") {
        player.currentState = "walk";
        player.use(k.sprite("playerWalk"));
      }
      // Update walking animation direction
      const newDirectionName = getDirectionName(player.direction, true);
      if (newDirectionName !== player.directionName) {
        player.directionName = newDirectionName;
        safePlayAnimation(newDirectionName);
      }
    }

    // Apply movement with diagonal adjustment
    if (player.direction.x && player.direction.y) {
      player.move(player.direction.scale(DIAGONAL_FACTOR * speed));
    } else {
      player.move(player.direction.scale(speed));
    }
  });

  return player;
}
