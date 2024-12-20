export default function makePlayer(k, posVec2, speed) {
  const DIAGONAL_FACTOR = 0.7071; // Add the missing constant

  // Load player animations
  k.loadSprite("playerIdle", "./sprites/idle.png", {
    sliceX: 8,
    sliceY: 6,
    anims: {
      idleDown: { from: 0, to: 7, loop: true },
      idleDownLeft: { from: 8, to: 15, loop: true },
      idleTopLeft: { from: 16, to: 23, loop: true },
      idleUp: { from: 24, to: 31, loop: true },
      idleTopRight: { from: 32, to: 39, loop: true },
      idleBottomRight: { from: 40, to: 47, loop: true },
    },
  });

  k.loadSprite("playerWalk", "./sprites/walk.png", {
    sliceX: 8,
    sliceY: 6,
    anims: {
      walkDown: { from: 0, to: 7, loop: true },
      walkDownLeft: { from: 8, to: 15, loop: true },
      walkTopLeft: { from: 16, to: 23, loop: true },
      walkUp: { from: 24, to: 31, loop: true },
      walkTopRight: { from: 32, to: 39, loop: true },
      walkBottomRight: { from: 40, to: 47, loop: true },
    },
  });

  k.loadSprite("playerDash", "./sprites/dash.png", {
    sliceX: 8,
    sliceY: 6,
    anims: {
      dashDown: { from: 0, to: 7, loop: true },
      dashDownLeft: { from: 8, to: 15, loop: true },
      dashTopLeft: { from: 16, to: 23, loop: true },
      dashUp: { from: 24, to: 31, loop: true },
      dashTopRight: { from: 32, to: 39, loop: true },
      dashBottomRight: { from: 40, to: 47, loop: true },
    },
  });

  // Add the player object
  const player = k.add([
    k.sprite("playerIdle", { anim: "idleDown" }), // Start with idle animation
    k.scale(8),
    k.anchor("center"),
    k.area({ shape: new k.Rect(k.vec2(0)) }),
    k.body(),
    k.pos(posVec2),
    "player",
    {
      direction: k.vec2(0, 0),
      directionName: "idleDown", // Start with idle direction
      currentState: "idle",
    },
  ]);

  let isMouseDown = false;
  const game = document.getElementById("game");

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

  // Safe animation play function
  const safePlayAnimation = (animName) => {
    try {
      if (player.sprite && animName) {
        player.play(animName);
      }
    } catch (error) {
      console.warn(`Failed to play animation: ${animName}`, error);
    }
  };

  player.onUpdate(() => {
    // Camera follow logic
    if (!k.getCamPos().eq(player.pos)) {
      k.tween(
        k.getCamPos(),
        player.pos,
        0.2,
        (newPos) => k.setCamPos(newPos),
        k.easings.linear
      );
    }

    player.direction = k.vec2(0, 0);
    const worldMousePos = k.toWorld(k.mousePos());

    if (isMouseDown) {
      player.direction = worldMousePos.sub(player.pos).unit();
    }

    // Handle state changes and animations
    if (player.direction.eq(k.vec2(0, 0))) {
      if (player.currentState !== "idle") {
        player.currentState = "idle";
        player.use(k.sprite("playerIdle"));
        // Convert walk direction to idle direction
        const idleAnim = player.directionName.replace("walk", "idle");
        safePlayAnimation(idleAnim);
      }
    } else {
      if (player.currentState !== "walk") {
        player.currentState = "walk";
        player.use(k.sprite("playerWalk"));
      }

      // Update walking direction
      let newDirectionName = "walkDown"; // Default direction

      if (
        player.direction.x > 0 &&
        player.direction.y > -0.5 &&
        player.direction.y < 0.5
      ) {
        newDirectionName = "walkBottomRight";
      } else if (
        player.direction.x < 0 &&
        player.direction.y > -0.5 &&
        player.direction.y < 0.5
      ) {
        newDirectionName = "walkDownLeft";
      } else if (player.direction.x < 0 && player.direction.y < -0.8) {
        newDirectionName = "walkUp";
      } else if (player.direction.x < 0 && player.direction.y > 0.8) {
        newDirectionName = "walkDown";
      } else if (
        player.direction.x < 0 &&
        player.direction.y > -0.8 &&
        player.direction.y < -0.5
      ) {
        newDirectionName = "walkTopLeft";
      } else if (
        player.direction.x < 0 &&
        player.direction.y > 0.5 &&
        player.direction.y < 0.8
      ) {
        newDirectionName = "walkDownLeft";
      } else if (
        player.direction.x > 0 &&
        player.direction.y < -0.5 &&
        player.direction.y > -0.8
      ) {
        newDirectionName = "walkTopRight";
      } else if (
        player.direction.x > 0 &&
        player.direction.y > 0.5 &&
        player.direction.y < 0.8
      ) {
        newDirectionName = "walkBottomRight";
      }

      if (newDirectionName !== player.directionName) {
        player.directionName = newDirectionName;
        safePlayAnimation(newDirectionName);
      }
    }

    // Movement logic
    if (player.direction.x && player.direction.y) {
      player.move(player.direction.scale(DIAGONAL_FACTOR * speed));
    } else {
      player.move(player.direction.scale(speed));
    }
  });

  return player;
}
