export default function makePlayer(k, posVec2, speed) {
  const player = k.add([
    k.sprite("playerIdle", { anim: "idleDown" }),
    k.scale(8), // Player size
    k.anchor("center"), //Centers Player Character at the start of the game
    k.area({ shape: new k.Rect(k.vec2(0), 5, 10) }), // Player Hitbox area
    k.body(), //Player Gravity, not needed in a top-down game
    k.pos(posVec2), // A way to check collison without having reference to the game Object?
    "playerIdle",
    //Custom Properties for the game Object
    {
      direction: k.vec2(0, 0),
      directionName: "dash-down",
    },

    // Player Controls
  ]);
}
