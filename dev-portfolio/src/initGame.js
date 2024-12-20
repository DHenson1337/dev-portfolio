import { PALETTE } from "./constants";
import makePlayer from "./entities/Player";
import makeKaplayCtx from "./kaplayCtx";
import { cameraZoomValueAtom, store } from "./store";
export default async function initGame() {
  const k = makeKaplayCtx(); // Initialize Kaplay context

  //Debugging
  /*   console.log("Kaplay context:", k);
  k.loadSprite("testSprite", "./sprites/walk.png");
  console.log("Test sprite loaded");
  console.log("All loaded sprites:", k.sprites); */

  // Initialize the Player Character

  /*   const player = k.add([
    k.sprite("playerIdle"), // Use idle sprite by default
    k.pos(100, 100), // Starting position
    k.area(), // Collision area
    k.body(), // Physics for movement and collisions
  ]); */

  // WASD + Multi-Directional Movement Handling

  //===========================Logo's=====================
  /*   k.loadFont("ibm-regular", "./fonts/IBMPlexSans-Regular.ttf");
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
 */
  // Import Shaders
  k.loadShaderURL("tiledPattern", null, "shaders/tiledPattern.frag");

  //Camera Zoom

  if (k.width() < 1000) {
    store.set(cameraZoomValueAtom, 0.5);
    k.setCamScale(k.vec2(0.5));

    return;
  } else {
    store.set(cameraZoomValueAtom, 0.8);
    k.setCamScale(k.vec2(0.8));
  }

  k.onUpdate(() => {
    const camZoomValue = store.get(cameraZoomValueAtom);
    if (camZoomValue !== k.camScale()) k.camScale(k.vec2(camZoomValue));
  });

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
    k.z(0), // Explicit z-index for background
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
