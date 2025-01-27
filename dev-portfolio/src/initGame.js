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
  const gameProjectsData = await (
    await fetch("./configs/gameProjectsData.json")
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
  //Projects
  k.loadSprite("apple", "./projects/appleGame.png");
  k.loadSprite("mgs", "./projects/miniGameSite.png");
  k.loadSprite("skyCast", "./projects/skyCast.png");
  k.loadSprite("mgp", "./projects/mgp.png");
  //Audio
  k.loadSound("walk", "./sounds/walk.wav");
  k.loadSound("collision", "./sounds/collision.ogg");
  k.loadSound(
    "bgm",
    "./sounds/Earthbound - Battle Against a Weird Opponent.mp3"
  );
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

  // Get actual viewport dimensions
  const getViewportSize = () => ({
    width: Math.max(
      document.documentElement.clientWidth || 0,
      window.innerWidth || 0
    ),
    height: Math.max(
      document.documentElement.clientHeight || 0,
      window.innerHeight || 0
    ),
  });

  //Camera Zoom
  const setAppropriateZoom = () => {
    const { width, height } = getViewportSize();
    if (width < 1000) {
      store.set(cameraZoomValueAtom, Math.min((width / 1000) * 0.3, 0.3));
      k.setCamScale(k.vec2(store.get(cameraZoomValueAtom)));
    } else {
      store.set(cameraZoomValueAtom, 0.6);
      k.setCamScale(k.vec2(0.6));
    }
  };

  setAppropriateZoom();
  window.addEventListener("resize", setAppropriateZoom);
  window.addEventListener("orientationchange", setAppropriateZoom);

  // camera update listener
  k.onUpdate(() => {
    const camZoomValue = store.get(cameraZoomValueAtom);
    if (camZoomValue !== k.getCamScale().x) {
      k.setCamScale(k.vec2(camZoomValue));
    }
  });

  setAppropriateZoom();
  window.addEventListener("resize", setAppropriateZoom);
  window.addEventListener("orientationchange", setAppropriateZoom);

  // Displays the ShaderBackground
  const tiledBackground = k.add([
    k.uvquad(getViewportSize().width, getViewportSize().height),
    k.shader("tiledPattern", () => ({
      u_time: k.time() / 25,
      u_color1: k.Color.fromHex(PALETTE.color3),
      u_color2: k.Color.fromHex(PALETTE.color2),
      u_speed: k.vec2(0.5, -1.0),
      u_aspect: getViewportSize().width / getViewportSize().height,
      u_size: 5,
    })),
    k.pos(0),
    k.z(0),
    k.fixed(),
  ]);

  // Combined resize handler
  const handleResize = () => {
    const { width, height } = getViewportSize();
    tiledBackground.width = width;
    tiledBackground.height = height;
    tiledBackground.uniform.u_aspect = width / height;
  };

  // Add multiple event listeners to catch all resize scenarios
  window.addEventListener("resize", handleResize);
  window.addEventListener("orientationchange", handleResize);
  k.onResize(handleResize);

  // Initial size setup
  handleResize();

  // Background Music
  const bgMusic = k.play("bgm", {
    volume: 0.2,
    loop: true,
  });

  //Music Control
  window.addEventListener("keydown", (e) => {
    if (e.key === "m") {
      bgMusic.paused = !bgMusic.paused;
    }
  });

  const musicBtn = k.add([
    k.text("🔊", { size: 24 }),
    k.pos(k.width() - 50, 20),
    k.area(),
    k.fixed(),
    "musicToggle",
  ]);

  musicBtn.onClick(() => {
    bgMusic.paused = !bgMusic.paused;
    musicBtn.text = bgMusic.paused ? "🔈" : "🔊";
  });

  //=============Creates the sections in the kplay view==============

  // About =============================
  makeSection(
    k,
    k.vec2(k.center().x, k.center().y - 400),
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
    k.vec2(k.center().x - 600, k.center().y),
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
    k.vec2(k.center().x + 600, k.center().y),
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
    k.vec2(k.center().x - 400, k.center().y + 500),
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
    k.vec2(k.center().x - 750, k.center().y - 750),
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
    k.vec2(k.center().x + 750, k.center().y - 750),
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

  //Game Projects =================================================

  makeSection(
    k,
    k.vec2(k.center().x + 400, k.center().y + 500), // Positioned to the right of Projects
    "Game Projects",
    (parent) => {
      const container = parent.add([k.opacity(0), k.pos(0, 0)]);

      for (const project of gameProjectsData) {
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

  makePlayer(k, k.vec2(k.center()), 700); // has the player in the center
}
