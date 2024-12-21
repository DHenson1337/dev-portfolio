import { PALETTE } from "../constants";

export default function makeSection(
  k,
  posVec2,
  sectionName,
  shape = "star",
  onCollide = null
) {
  let baseShape;

  if (shape === "rect") {
    baseShape = k.rect(200, 200, { radius: 10 });
  } else {
    baseShape = k.sprite("star-sprite", { anim: "spin" });
    baseShape.scale = 8.5; // Only scale the star
  }

  // Add the base shape (star or rect) to the section
  const section = k.add([
    baseShape,
    k.anchor("center"),
    k.area(),
    k.pos(posVec2),
    sectionName,
  ]);

  // Add the section label (text) separately to avoid scaling
  k.add([
    k.text(sectionName, { font: "ibm-bold", size: 64 }),
    k.color(PALETTE.color1),
    k.anchor("center"),
    k.pos(posVec2.x, posVec2.y - 150), // Position text above the star
  ]);

  if (shape === "star") {
    section.play("spin", { speed: 10, loop: true });
  }

  // Collision logic
  if (onCollide) {
    const onCollideHandler = section.onCollide("player", () => {
      onCollide(section);
      onCollideHandler.cancel();
    });
  }

  return section;
}
