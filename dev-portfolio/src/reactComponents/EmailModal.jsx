import { useAtom, useAtomValue } from "jotai";
import React, { useState } from "react";
import { emailAtom, isEmailModalVisibleAtom } from "../store";

function EmailModal() {
  const [isVisible, setIsVisible] = useAtom(isEmailModalVisibleAtom);
  const email = useAtomValue(emailAtom);

  const [onCopyMessage, setOnCopyMessage] = useState("");
  const buttons = [
    {
      id: 0,
      name: "Yes",
      handler: () => {
        //Navigator Api
        navigator.clipboard.writeText(email);
        setOnCopyMessage("Email copied to clipboard");
      },
    },
    {
      id: 1,
      name: "No",
      handler: () => {
        setIsVisible(false);
      },
    },
  ];

  return (
    isVisible && (
      <div className="modal">
        <div className="modal-content">
          <h1>Do you want to open this link?</h1>
          <span>{selectedLink}</span>
          <p>{selectedLinkDescription}</p>
          <div className="modal-btn-container">
            {buttons.map((button) => (
              <button
                key={button.id}
                className={"modal-btn"}
                onClick={button.handler}
              >
                {button.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  );
}

export default EmailModal;
