import { PALETTE } from "./constants";
import makePlayer from "./entities/Player";
import makeKaplayCtx from "./kaplayCtx";

export default async function initGame() {
  const k = makeKaplayCtx(); // Initialize Kaplay context

  // Load the Idle Animation Sprite Sheet
  k.loadSprite("playerIdle", "./sprites/idle.png", {
    sliceX: 8, // 8 frames per row
    sliceY: 6, // 6 rows (directions)
    anims: {
      idleDown: { from: 0, to: 7, loop: true }, // Row 1
      idleDownLeft: { from: 8, to: 15, loop: true }, // Row 2
      idleTopLeft: { from: 16, to: 23, loop: true }, // Row 3
      idleUp: { from: 24, to: 31, loop: true }, // Row 4
      idleTopRight: { from: 32, to: 39, loop: true }, // Row 5
      idleBottomRight: { from: 40, to: 47, loop: true }, // Row 6
    },
  });

  // Initialize the Player Character
  const player = k.add([
    k.sprite("playerIdle"), // Use idle sprite by default
    k.pos(100, 100), // Starting position
    k.area(), // Collision area
    k.body(), // Physics for movement and collisions
  ]);

  // Default animation: Idle facing down
  player.play("idleDown");

  // Speed of the player
  const playerSpeed = 150;

  // WASD + Multi-Directional Movement Handling
  k.onUpdate(() => {
    let moved = false;

    // Multi-Directional Movement (WASD)
    if (k.isKeyDown("w") && k.isKeyDown("a")) {
      player.move(-playerSpeed, -playerSpeed); // Move top-left
      player.play("idleTopLeft");
      moved = true;
    } else if (k.isKeyDown("w") && k.isKeyDown("d")) {
      player.move(playerSpeed, -playerSpeed); // Move top-right
      player.play("idleTopRight");
      moved = true;
    } else if (k.isKeyDown("s") && k.isKeyDown("a")) {
      player.move(-playerSpeed, playerSpeed); // Move bottom-left
      player.play("idleDownLeft");
      moved = true;
    } else if (k.isKeyDown("s") && k.isKeyDown("d")) {
      player.move(playerSpeed, playerSpeed); // Move bottom-right
      player.play("idleBottomRight");
      moved = true;
    }

    // Single Directional Movement (WASD)
    else if (k.isKeyDown("a")) {
      player.move(-playerSpeed, 0); // Move left
      player.play("idleDownLeft");
      moved = true;
    } else if (k.isKeyDown("d")) {
      player.move(playerSpeed, 0); // Move right
      player.play("idleTopRight");
      moved = true;
    } else if (k.isKeyDown("w")) {
      player.move(0, -playerSpeed); // Move up
      player.play("idleUp");
      moved = true;
    } else if (k.isKeyDown("s")) {
      player.move(0, playerSpeed); // Move down
      player.play("idleDown");
      moved = true;
    }

    // If no key is pressed, stop animations
    if (!moved) {
      player.stop(); // Stop current animation
    }
  });

  // Touch-To-Mouse Movement Handling
  k.onMouseDown((pos) => {
    const dx = pos.x - player.pos.x; // Difference in x-coordinate
    const dy = pos.y - player.pos.y; // Difference in y-coordinate
    const magnitude = Math.sqrt(dx * dx + dy * dy); // Calculate the magnitude (distance)

    // Normalize the direction vector and move the player
    const directionX = dx / magnitude;
    const directionY = dy / magnitude;

    player.move(directionX * playerSpeed, directionY * playerSpeed); // Move player
  });

  k.onMouseRelease(() => {
    player.stop(); // Stop player when touch/mouse is released
  });

  //===========================Logo's=====================
  k.loadFont("ibm-regular", "./fonts/IBMPlexSans-Regular.ttf");
  k.loadFont("ibm-bold", "./fonts/IBMPlexSans-Bold.ttf");
  k.loadSprite("github-logo", "./logos/github-logo.png");
  k.loadSprite("linkedin-logo", "./logos/linkedin-logo.png");
  k.loadSprite("youtube-logo", "./logos/youtube-logo.png");
  k.loadSprite("x-logo", "./logos/x-logo.png");
  k.loadSprite("substack-logo", "./logos/substack-logo.png");
  k.loadSprite("javascript-logo", "./logos/js-logo.png");
  k.loadSprite("typescript-logo", "./logos/ts-logo.png");
  k.loadSprite("react-logo", "./logos/react-logo.png");
  k.loadSprite("nextjs-logo", "./logos/nextjs-logo.png");
  k.loadSprite("postgres-logo", "./logos/postgres-logo.png");
  k.loadSprite("html-logo", "./logos/html-logo.png");
  k.loadSprite("css-logo", "./logos/css-logo.png");
  k.loadSprite("tailwind-logo", "./logos/tailwind-logo.png");
  k.loadSprite("python-logo", "./logos/python-logo.png");
  k.loadSprite("email-logo", "./logos/email-logo.png");
  k.loadSprite("sonic-js", "./projects/sonic-js.png");
  k.loadSprite("kirby-ts", "./projects/kirby-ts.png");
  k.loadSprite("platformer-js", "./projects/platformer-js.png");
  k.loadShaderURL("tiledPattern", null, "./shaders/tiledPattern.frag");
  // Import Shaders
  k.loadShaderURL("tiledPattern", null, "shaders/tiledPattern.frag");

  //Displays the ShaderBackground
  const tiledBackground = k.add([
    k.uvquad(k.width(), k.height()),
    k.shader("tiledPattern", () => ({
      u_time: k.time() / 20,
      u_color1: k.Color.fromHex(PALETTE.color3), // Pulls colors from constant.js
      u_color2: k.Color.fromHex(PALETTE.color2),
      u_speed: k.vec2(1, -1), // Block Speed
      u_aspect: k.width() / k.height(), //Width of the display
      u_size: 5, //Size of each square in the pattern
    })),
    k.pos(0), //Position where the tiles start from
    k.fixed(), //Makes sure game object isn't affect by the Camera
  ]);

  //Resizes the squares when the aspect ratio changes
  k.onResize(() => {
    tiledBackground.width = k.width();
    tiledBackground.height = k.height();
    tiledBackground.uniform.u_aspect = k.width() / k.height();
  });

  makePlayer(k, k.vec2(k.center()), 700); // has the player in the center
}
