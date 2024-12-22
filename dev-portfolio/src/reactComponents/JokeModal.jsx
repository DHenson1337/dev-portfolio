import { useAtomValue, useAtom } from "jotai";
import { isJokeModalVisibleAtom, jokeDataAtom, store } from "../store";

export default function JokeModal() {
  const jokeData = useAtomValue(jokeDataAtom);
  const [isVisible, setIsVisible] = useAtom(isJokeModalVisibleAtom);

  return (
    isVisible && (
      <div className="modal">
        <div className="modal-content">
          <h1>Wanna hear something funny?</h1>
          {jokeData.setup && (
            <>
              <p>{jokeData.setup}</p>
              <p>{jokeData.delivery}</p>
            </>
          )}
          <div className="modal-btn-container">
            <button
              className="modal-btn"
              onClick={async () => {
                try {
                  const respone = await fetch(
                    "https://v2.jokeapi.dev/joke/Programming,Pun?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&type=twopart"
                  );
                  const newJoke = await respone.json();
                  store.set(jokeDataAtom, {
                    setup: newJoke.setup,
                    delivery: newJoke.delivery,
                  });
                } catch (error) {
                  console.error("This ain't a joke I can't help you:", error);
                }
              }}
            >
              {" "}
              Want Another?
            </button>
            <button
              className="modal-btn"
              onClick={() => {
                setIsVisible(false);
              }}
            >
              Escape!
            </button>
          </div>
        </div>
      </div>
    )
  );
}
