import makeKaplayCtx from "./kaplayCtx";

export default async function initGame() {
  const k = makeKaplayCtx(); //Holds Kaply Context, for loading sprites etc
  k.loadSprite("player", "./sprites/player.png", {}); //Loads player sprite
}
