//Create context to initialize the canvas
import kaplay from "kaplay";

export default function makeKaplayCtx() {
  return kaplay({
    global: false, //Prevents Kaplay from being used...golbally
    pixelDensity: 2, //Sharpness of Display
    touchToMouse: true, //Lets portfolio work on mobike
    debug: true, //Just like Phaser, the hitbox view
    debugkey: "f1",
    canvas: document.getElementById("game"), //Selects the canvas created in html
  });
}
