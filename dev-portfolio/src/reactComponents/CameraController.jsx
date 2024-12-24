import { useAtom } from "jotai";
import { cameraZoomValueAtom } from "../store";
import { ZOOM_MAX_BOUND, ZOOM_MIN_BOUND } from "../constants";

export default function CameraController() {
  const [camZoomValue, setCamZoomValue] = useAtom(cameraZoomValueAtom);

  const handleZoom = (increase) => {
    const zoomStep = window.innerWidth < 1000 ? 0.1 : 0.2; // Smaller steps for mobile
    const newZoomValue = increase
      ? camZoomValue + zoomStep
      : camZoomValue - zoomStep;

    // Ensure we stay within bounds
    if (newZoomValue <= ZOOM_MAX_BOUND && newZoomValue >= ZOOM_MIN_BOUND) {
      setCamZoomValue(newZoomValue);
    }
  };

  return (
    <div className="camera-controller">
      <button
        className="camera-controller-btn"
        onClick={() => handleZoom(true)}
      >
        +
      </button>
      <button
        className="camera-controller-btn"
        onClick={() => handleZoom(false)}
      >
        -
      </button>
    </div>
  );
}
