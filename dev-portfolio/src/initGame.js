import makeEmailIcon from "./components/EmailIcon";
import makeSection from "./components/Section";
import makeSkillIcon from "./components/SkillIcon";
import makeSocialIcon from "./components/SocialIcon";
import { PALETTE } from "./constants";
import makePlayer from "./entities/Player";
import makeKaplayCtx from "./kaplayCtx";
import { cameraZoomValueAtom, store } from "./store";
import { makeAppear } from "./utils";
export default async function initGame() {
  //Importing configs for info about the game tiles
  const generalData = await (await fetch("./configs/generalData.json")).json();
  const socialsData = await (await fetch("./configs/socialsData.json")).json();
  const skillsData = await (await fetch("./configs/skillsData.json")).json();

  const k = makeKaplayCtx(); // Initialize Kaplay context

  //===========================Logo's=====================
  k.loadFont("ibm-regular", "./fonts/IBMPlexSans-Regular.ttf");
  k.loadFont("ibm-bold", "./fonts/IBMPlexSans-Bold.ttf");
  k.loadSprite("github-logo", "./logos/github-logo.png");
  k.loadSprite("linkedin-logo", "./logos/linkedin-logo.png");
  k.loadSprite("youtube-logo", "./logos/youtube-logo.png");
  k.loadSprite("x-logo", "./logos/x-logo.png");
  k.loadSprite("substack-logo", "./logos/substack-logo.png");
  k.loadSprite("javascript-logo", "./logos/js-logo.png");
  k.loadSprite("phaser-logo", "./logos/phaser-logo.png");
  k.loadSprite("bootstrap-logo", "./logos/bootstrap-logo.png");
  k.loadSprite("mongodb-logo", "./logos/mongodb-logo.png");
  k.loadSprite("nodejs-logo", "./logos/nodejs-logo.png");
  k.loadSprite("mernstack-logo", "./logos/mernstack-logo.png");
  k.loadSprite("typescript-logo", "./logos/ts-logo.png");
  k.loadSprite("react-logo", "./logos/react-logo.png");
  k.loadSprite("nextjs-logo", "./logos/nextjs-logo.png");
  k.loadSprite("postgres-logo", "./logos/postgres-logo.png");
  k.loadSprite("html-logo", "./logos/html-logo.png");
  k.loadSprite("css-logo", "./logos/css-logo.png");
  k.loadSprite("tailwind-logo", "./logos/tailwind-logo.png");
  k.loadSprite("python-logo", "./logos/python-logo.png");
  k.loadSprite("email-logo", "./logos/email-logo.png");
  k.loadSprite("Api", "./logos/Api.png");
  k.loadSprite("sonic-js", "./projects/sonic-js.png");
  k.loadSprite("kirby-ts", "./projects/kirby-ts.png");
  k.loadSprite("platformer-js", "./projects/platformer-js.png");

  //Star Sprite
  k.loadSprite("star-sprite", "./sprites/Star.png", {
    sliceX: 13,
    sliceY: 1,
    anims: {
      spin: {
        from: 0,
        to: 12,
        speed: 5,
        loop: true,
      },
    },
  });

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
    if (camZoomValue !== k.getCamScale()) k.setCamScale(k.vec2(camZoomValue));
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

  //=============Creates the sections in the kplay view==============
  // add rect, after section name if you're square ex:
  // "rect",  Specify the shape as "rect" (square)
  //   200  Size of the square (e.g., 200x200)

  // About =============================
  makeSection(
    k,
    k.vec2(k.center().x, k.center().y - 450),
    generalData.section1Name,
    (parent) => {
      const container = parent.add([k.pos(-805, -700), k.opacity(0)]);

      container.add([
        k.text(generalData.header.title, { font: "ibm-bold", size: 88 }),
        k.color(k.Color.fromHex(PALETTE.color1)),
        k.pos(395, 0),
        k.opacity(0),
      ]);

      container.add([
        k.text(generalData.header.subtitle, {
          font: "ibm-bold",
          size: 48,
        }),
        k.color(k.Color.fromHex(PALETTE.color1)),
        k.pos(485, 100),
        k.opacity(0),
      ]);
      const socialContainer = container.add([k.pos(130, 0), k.opacity(0)]);

      for (const socialData of socialsData) {
        if (socialData.name === "Email") {
          makeEmailIcon(
            k,
            socialContainer,
            k.vec2(socialData.pos.x, socialData.pos.y),
            socialData.imageData,
            socialData.name,
            socialData.email
          );
          continue;
        }
        makeSocialIcon(
          k,
          socialContainer,
          k.vec2(socialData.pos.x, socialData.pos.y),
          socialData.imageData,
          socialData.name,
          socialData.link,
          socialData.description
        );
      }
      makeAppear(k, container);
      makeAppear(k, socialContainer);
    }
  );

  //Skills ==============================================
  makeSection(
    k,
    k.vec2(k.center().x - 450, k.center().y),
    generalData.section2Name,
    (parent) => {
      const container = parent.add([k.opacity(0), k.pos(-300, 0)]);

      for (const skillData of skillsData) {
        makeSkillIcon(
          k,
          container,
          k.vec2(skillData.pos.x, skillData.pos.y),
          skillData.logoData,
          skillData.name
        );
      }
      makeAppear(k, container);
    }
  );

  //Experience==========================================
  makeSection(
    k,
    k.vec2(k.center().x + 450, k.center().y),
    "Experience",
    (parent) => {}
  );

  //Projects
  makeSection(
    k,
    k.vec2(k.center().x, k.center().y + 450),
    "Projects",
    (parent) => {}
  );

  /* // Joke API
  makeSection(
    k,
    k.vec2(k.center().x - 550, k.center().y - 750),
    "Joke Api",

    {
      style: "rect",
      iconSprite: "Api",
      iconScale: 0.4,
      customColor: PALETTE.color3,
    },
    (parent) => {
      const container = parent.add([k.pos(-805, -700), k.opacity(0)]);
    }
  ); */

  makePlayer(k, k.vec2(k.center()), 700); // has the player in the center
}
