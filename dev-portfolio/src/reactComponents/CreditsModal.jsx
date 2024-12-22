import { useAtomValue, useAtom } from "jotai";
import { isCreditsModalVisibleAtom, creditsDataAtom } from "../store";

export default function CreditsModal() {
  const creditsData = useAtomValue(creditsDataAtom);
  const [isVisible, setIsVisible] = useAtom(isCreditsModalVisibleAtom);

  return (
    isVisible && (
      <div className="modal">
        <div
          className="modal-content"
          style={{
            position: "relative",
            height: "80vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h1>Credits & Thanks</h1>

          {/* Scrollable content area */}
          <div
            style={{
              overflowY: "auto",
              flex: 1,
              marginBottom: "60px", // Space for button
              paddingRight: "15px", // Space for scrollbar
            }}
          >
            <div className="credits-section">
              <h2>Special Thanks</h2>
              {creditsData.specialThanks.map((credit, index) => (
                <div key={index} className="credit-item">
                  <h3>{credit.name}</h3>
                  <p>{credit.contribution}</p>
                  {credit.link && (
                    <a
                      href={credit.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#00ffff" }}
                    >
                      Visit
                    </a>
                  )}
                </div>
              ))}
            </div>

            <div className="credits-section">
              <h2>Technologies Used</h2>
              {creditsData.technologies.map((tech, index) => (
                <div key={index} className="credit-item">
                  <h3>{tech.name}</h3>
                  <p>{tech.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: "15px",
              background: "inherit", // Match modal background
              borderTop: "1px solid rgba(255, 255, 255, 0.1)", // Subtle separator
            }}
          >
            <div className="modal-btn-container">
              <button
                className="modal-btn"
                onClick={() => {
                  setIsVisible(false);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
}
