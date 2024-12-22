import { PALETTE } from "../constants";

export default function makeSection(k, posVec2, sectionName, onCollide = null) {
  // Create a container for the section
  const section = k.add([
    k.rect(200, 200, { radius: 10 }),
    k.anchor("center"),
    k.area(),
    k.pos(posVec2),
    k.color(PALETTE.color1),
    k.opacity(0), // Make rectangle invisible
    "collider", // Add this tag for collision detection
    sectionName,
  ]);

  // Add star sprite to the section
  const star = section.add([
    k.sprite("star-sprite", { anim: "spin" }),
    k.scale(8.5),
    k.anchor("center"),
    k.pos(0, 0), // Centered on the section
    "star",
  ]);

  // Start the star spinning animation
  star.play("spin", { speed: 10, loop: true });

  // Add text above the star
  section.add([
    k.text(sectionName, { font: "ibm-bold", size: 64 }),
    k.color(PALETTE.color1),
    k.anchor("center"),
    k.pos(0, -150), // 150 pixels above the center
  ]);

  // Handle collisions with the player
  if (onCollide) {
    const onCollideHandler = section.onCollide("player", () => {
      onCollide(section);
      onCollideHandler.cancel();
    });
  }

  return section;
}
