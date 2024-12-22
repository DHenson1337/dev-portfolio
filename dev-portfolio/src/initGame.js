import makeEmailIcon from "./components/EmailIcon";
import makeProjectCard from "./components/ProjectCard";
import makeSection from "./components/Section";
import makeSkillIcon from "./components/SkillIcon";
import makeSocialIcon from "./components/SocialIcon";
import makeWorkExperienceCard from "./components/WorkExperienceCard";
import { PALETTE } from "./constants";
import makePlayer from "./entities/Player";
import { opacityTrickleDown } from "./utils";
import makeKaplayCtx from "./kaplayCtx";
import {
  cameraZoomValueAtom,
  jokeDataAtom,
  isJokeModalVisibleAtom,
  creditsDataAtom,
  isCreditsModalVisibleAtom,
  store,
} from "./store";
import { makeAppear } from "./utils";
export default async function initGame() {
  //Importing configs for info about the game tiles
  const generalData = await (await fetch("./configs/generalData.json")).json();
  const socialsData = await (await fetch("./configs/socialsData.json")).json();
  const skillsData = await (await fetch("./configs/skillsData.json")).json();
  const creditsData = await (await fetch("./configs/creditsData.json")).json();
  const experiencesData = await (
    await fetch("./configs/experiencesData.json")
  ).json();
  const projectsData = await (
    await fetch("./configs/projectsData.json")
  ).json();

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
  k.loadSprite("wip", "./projects/wip.png");
  //Audio
  k.loadSound("walk", "./sounds/walk.wav");
  k.loadSound("collision", "./sounds/collision.ogg");
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
      u_time: k.time() / 25, // Changed from /20 to /10 for faster animation
      u_color1: k.Color.fromHex(PALETTE.color3),
      u_color2: k.Color.fromHex(PALETTE.color2),
      u_speed: k.vec2(0.5, -1.0), // Changed from (1, -1) for different flow
      u_aspect: k.width() / k.height(),
      u_size: 5, // Changed from 5 for different density
    })),
    k.pos(0),
    k.z(0),
    k.fixed(),
  ]);

  //Resizes the squares when the aspect ratio changes
  k.onResize(() => {
    tiledBackground.width = k.width();
    tiledBackground.height = k.height();
    tiledBackground.uniform.u_aspect = k.width() / k.height();
  });

  //=============Creates the sections in the kplay view==============

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
    generalData.section3Name,
    (parent) => {
      const container = parent.add([k.opacity(0), k.pos(0)]);

      for (const experienceData of experiencesData) {
        makeWorkExperienceCard(
          k,
          container,
          k.vec2(experienceData.pos.x, experienceData.pos.y),
          experienceData.cardHeight,
          experienceData.roleData
        );
      }

      makeAppear(k, container);
    }
  );

  //Projects====================================================
  makeSection(
    k,
    k.vec2(k.center().x, k.center().y + 400),
    generalData.section4Name,
    (parent) => {
      const container = parent.add([k.opacity(0), k.pos(0, 0)]);

      for (const project of projectsData) {
        makeProjectCard(
          k,
          container,
          k.vec2(project.pos.x, project.pos.y),
          project.data,
          project.thumbnail
        );
      }

      makeAppear(k, container);
    }
  );

  //Joke API=========================================================
  makeSection(
    k,
    k.vec2(k.center().x - 450, k.center().y - 800),
    "Want a Joke?",
    async (parent) => {
      const container = parent.add([k.opacity(0), k.pos(0, 0)]);

      try {
        const response = await fetch(
          "https://v2.jokeapi.dev/joke/Programming,Pun?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&type=twopart"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch joke");
        }

        const jokeData = await response.json();

        //Store the initial Joke
        store.set(jokeDataAtom, {
          setup: "Why did the programmer quit his job?", // Default joke if API fails
          delivery: "Because he didn't get arrays!",
        });

        // Show modal on collision
        const jokeSwitch = container.add([
          k.circle(30),
          k.area(),
          k.color(k.Color.fromHex(PALETTE.color1)),
          k.pos(0, 0),
          k.opacity(0),
        ]);

        jokeSwitch.onCollide("player", () => {
          store.set(isJokeModalVisibleAtom, true);
        });

        opacityTrickleDown(container, [jokeSwitch]);
        makeAppear(k, container);
      } catch (error) {
        console.error("Error fetching joke:", error);

        // Store a fallback joke
        store.set(jokeDataAtom, {
          setup: "Looks like our joke API is taking a coffee break! ☕",
          delivery:
            "But here's a classic: Why do programmers prefer dark mode? Because light attracts bugs! 🐛",
        });

        // Still create the interaction point even if API fails
        const jokeSwitch = container.add([
          k.circle(30),
          k.area(),
          k.color(k.Color.fromHex(PALETTE.color1)),
          k.pos(0, 0),
          k.opacity(0),
        ]);

        jokeSwitch.onCollide("player", () => {
          store.set(isJokeModalVisibleAtom, true);
        });

        opacityTrickleDown(container, [jokeSwitch]);
        makeAppear(k, container);
      }
    }
  );

  //Credits Section =====================================
  makeSection(
    k,
    k.vec2(k.center().x + 550, k.center().y - 750),
    "Credits",
    async (parent) => {
      const container = parent.add([k.opacity(0), k.pos(0, 0)]);

      try {
        const creditsData = await (
          await fetch("./configs/creditsData.json")
        ).json();

        // Store the credits data
        store.set(creditsDataAtom, creditsData);

        // Show modal on collision
        const creditsSwitch = container.add([
          k.circle(30),
          k.area(),
          k.color(k.Color.fromHex(PALETTE.color1)),
          k.pos(0, 0),
          k.opacity(0),
        ]);

        creditsSwitch.onCollide("player", () => {
          store.set(isCreditsModalVisibleAtom, true);
        });

        opacityTrickleDown(container, [creditsSwitch]);
        //opacityTrickleDown(parent, [creditsSwitch]) if I want the dot to be invisible
        makeAppear(k, container);
      } catch (error) {
        console.error("Error loading credits:", error);
      }
    }
  );

  makePlayer(k, k.vec2(k.center()), 700); // has the player in the center
}
