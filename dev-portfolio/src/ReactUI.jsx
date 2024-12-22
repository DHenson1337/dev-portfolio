import CameraController from "./reactComponents/CameraController";
import SocialModal from "./reactComponents/SocialModal";
import EmailModal from "./reactComponents/EmailModal";
import ProjectModal from "./reactComponents/ProjectModal";
import JokeModal from "./reactComponents/JokeModal";
import CreditsModal from "./reactComponents/CreditsModal";

function ReactUI() {
  return (
    <>
      <p className="controls-message"> Tap/Hold to explore the World🌍</p>
      <CameraController />
      <SocialModal />
      <EmailModal />
      <ProjectModal />
      <JokeModal />
      <CreditsModal />
    </>
  );
}

export default ReactUI;
