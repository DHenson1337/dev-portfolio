export default function makePlayer(k, posVec2, speed) {
  // Load player animations
  k.loadSprite("playerIdle", "./sprites/idle.png", {
    sliceX: 8, // 8 frames horizontally
    sliceY: 6, // 6 rows of frames
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
    k.sprite("playerIdle", { anim: "idleDown" }), // Default animation
    k.scale(8), // Adjust to fit your scene
    k.anchor("center"), // Center the sprite
    k.area({ shape: new k.Rect(k.vec2(0)) }), // Add collision area
    k.body(),
    k.pos(posVec2), // Player's starting position
    "player",
    { direction: k.vec2(0, 0), directionName: "dashDown" },
    // { isDashing: false }, // Custom state for dashing
  ]);
  // Default animation
  player.play("idleDown");

  //Player Controls
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

  player.onUpdate(() => {
    if (!k.camPos().eq(player.pos)) {
      k.tween(
        k.camPos(),
        player.pos,
        0.2,
        (newPos) => k.camPos(newPos),
        k.easings.linear
      );
    }
    player.direction = k.vec2(0, 0);
    const worldMousePos = k.toWorld(k.mousePos());

    if (isMouseDown) {
      player.direction = worldMousePos.sub(player.pos).unit();
    }

    player.move(player.direction.scale(speed));
  });

  return player;
}
