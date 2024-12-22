import { atom, createStore } from "jotai"; //// Import atom and createStore from Jotai for state management

// Atom to manage the visibility of the social modal
export const isSocialModalVisibleAtom = atom(false);

// Atom to store the currently selected social link
export const selectedLinkAtom = atom(null);

// Atom to store the description of the selected social link
export const selectedLinkDescriptionAtom = atom("");

// Atom to manage the visibility of the email modal
export const isEmailModalVisibleAtom = atom(false);

// Atom to store the entered email value
export const emailAtom = atom("");

// Atom to manage the visibility of the project modal
export const isProjectModalVisibleAtom = atom(false);

// Atom to store the data of the currently chosen project, including title and associated links
export const chosenProjectDataAtom = atom({
  title: "",
  links: [{ id: 0, name: "", link: "" }],
});

// Atom to track the camera zoom level (used for any zoomable interface or feature)
export const cameraZoomValueAtom = atom({ value: 1 });

export const store = createStore();

//For Joke Modal
export const isJokeModalVisibleAtom = atom(false);
export const jokeDataAtom = atom({ setup: "", delivery: "" });

//For Special Thanks Model
export const isCreditsModalVisibleAtom = atom(false);
export const creditsDataAtom = atom({
  specialThanks: [],
  technologies: [],
});
