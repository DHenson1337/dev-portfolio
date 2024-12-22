import { PALETTE } from "../constants";

export default function makeSection(k, posVec2, sectionName, onCollide = null) {
  // Create a container for the section
  const section = k.add([
    k.rect(200, 200, { radius: 10 }),
    k.anchor("center"),
    k.area(),
    k.pos(posVec2),
    k.color(PALETTE.color1),
    k.opacity(0),
    "collider",
    sectionName,
  ]);

  // Add star sprite to the section
  const star = section.add([
    k.sprite("star-sprite", { anim: "spin" }),
    k.scale(8.5),
    k.anchor("center"),
    k.pos(0, 0),
    "star",
  ]);

  star.play("spin", { speed: 10, loop: true });

  // Create and store the text component
  const titleText = section.add([
    k.text(sectionName, { font: "ibm-bold", size: 64 }),
    k.color(PALETTE.color1),
    k.anchor("center"),
    k.pos(0, -150),
    k.scale(1),
  ]);

  // Handle collisions with the player
  if (onCollide) {
    const onCollideHandler = section.onCollide("player", () => {
      // Combined animation sequence
      // 1. Scale and color change
      k.tween(
        titleText.scale.x,
        1.2,
        0.15,
        (val) => {
          titleText.scale.x = val;
          titleText.scale.y = val;
        },
        k.easings.bounceOut
      );

      // 2. Color flash
      k.tween(
        titleText.color,
        k.Color.fromHex("#00ffff"), // Bright cyan
        0.1,
        (val) => (titleText.color = val),
        k.easings.linear
      ).then(() => {
        k.tween(
          titleText.color,
          k.Color.fromHex(PALETTE.color1),
          0.3,
          (val) => (titleText.color = val),
          k.easings.linear
        );
      });

      // 3. Vertical bounce
      const originalY = titleText.pos.y;
      k.tween(
        titleText.pos.y,
        originalY - 20, // Bounce up
        0.1,
        (val) => (titleText.pos.y = val),
        k.easings.quadOut
      ).then(() => {
        k.tween(
          titleText.pos.y,
          originalY, // Back to original position
          0.2,
          (val) => (titleText.pos.y = val),
          k.easings.bounceOut
        );
      });

      // 4. Return scale to normal
      k.wait(0.2, () => {
        k.tween(
          titleText.scale.x,
          1,
          0.2,
          (val) => {
            titleText.scale.x = val;
            titleText.scale.y = val;
          },
          k.easings.bounceOut
        );
      });

      // Call the provided collision handler and cancel
      onCollide(section);
      onCollideHandler.cancel();
    });
  }

  return section;
}
