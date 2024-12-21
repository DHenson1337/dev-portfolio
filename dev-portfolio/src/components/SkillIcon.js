import makeIcon from "../components/Icon";
import { opacityTrickleDown } from "../utils";

export default function makeSkillIcon(k, parent, posVec2, imageData, subtitle) {
  const [skillIcon, subtitleText] = makeIcon(
    k,
    parent,
    posVec2,
    imageData,
    subtitle
  );

  skillIcon.use(
    k.area({
      shape: new k.Rect(k.vec2(0), skillIcon.width + 50, skillIcon.height + 65),
    })
  );
  skillIcon.use(k.body({ drag: 1 }));
  skillIcon.use({ direction: k.vec2(0, 0) });

  skillIcon.onCollide("player", (player) => {
    skillIcon.applyImpulse(player.direction.scale(1000));
    skillIcon.direction = player.direction;
  });

  //   opacityTrickleDown(parent, [subtitleText]);

  return skillIcon;
}
