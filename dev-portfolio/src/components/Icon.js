//Section for adding the Icons

import { PALETTE } from "../constants";
import { opacityTrickleDown } from "../utils";

export default function makeIcon(k, parent, posVec2, imageData, subtitle) {
  const icon = parent.add([
    k.sprite(imageData.name, {
      width: imageData.width,
      height: imageData.height,
    }),
    k.anchor("center"),
    k.pos(posVec2),
    k.opacity(0),
    k.offscreen({ hide: true, distance: 300 }),
  ]);

  const subtitleText = icon.add([
    k.text(subtitle, { font: "ibm-bold", size: 32 }),
    k.color(k.Color.fromHex(PALETTE.color1)),
    k.anchor("center"),
    k.pos(0, 100),
    k.opacity(0),
  ]);

  //Adds the visibility to the child  of the parent
  opacityTrickleDown(parent, [subtitleText]);

  return [icon, subtitleText];
}
