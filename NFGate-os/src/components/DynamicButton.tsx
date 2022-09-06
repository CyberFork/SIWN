import React, { useEffect, useRef } from "react";

interface IAppProps {}

const DynamicButton: React.FunctionComponent<IAppProps> = (props) => {
  // init other global elements
  let disabled = false;
  const button = useRef<HTMLButtonElement>(null)!;
  // cycle through button states when clicked
  const clickButton = () => {
    if (!disabled) {
      disabled = true;
      // Loading stage
      button.current!.classList.add("loading");
      button.current!.classList.remove("ready");
      setTimeout(() => {
        // Completed stage
        button.current!.classList.add("complete");
        button.current!.classList.remove("loading");
        setTimeout(() => {
          setTimeout(() => {
            // Reset button so user can select it again
            disabled = false;
            button.current!.classList.add("ready");
            button.current!.classList.remove("complete");
          }, 4000);
        }, 320);
      }, 1800);
    }
  };

  // Set up button text transition timings on page load
  useEffect(() => {
    const textElements = button.current!.querySelectorAll(".button-text");
    textElements.forEach((element: Element) => {
      // @ts-ignore
      const span: HTMLElement = element;
      const characters = span.innerText.split("");
      let characterHTML = "";
      characters.forEach((letter: string, index: number) => {
        characterHTML += `<span class="char${index}" style="--d:${
          index * 30
        }ms; --dr:${(characters.length - index - 1) * 30}ms;">${letter}</span>`;
      });
      element.innerHTML = characterHTML;
    });
  });

  return (
    <>
      <button
        id="button"
        ref={button}
        className="w-full bg-none text-lg font-bold border-none outline-none overflow-hidden ready"
        onClick={clickButton}
      >
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div className="message submitMessage">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13 12.2">
            <polyline stroke="currentColor" points="2,7.1 6.5,11.1 11,7.1 " />
            <line stroke="currentColor" x1="6.5" y1="1.2" x2="6.5" y2="10.3" />
          </svg>
          <span className="button-text text-white">Connect</span>
        </div>

        <div className="message loadingMessage">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19 17">
            <circle className="loadingCircle" cx="2.2" cy="10" r="1.6" />
            <circle className="loadingCircle" cx="9.5" cy="10" r="1.6" />
            <circle className="loadingCircle" cx="16.8" cy="10" r="1.6" />
          </svg>
        </div>

        <div className="message successMessage">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13 11">
            <polyline
              stroke="currentColor"
              points="1.4,5.8 5.1,9.5 11.6,2.1 "
            />
          </svg>
          <span className="button-text text-white">Success</span>
        </div>
      </button>
    </>
  );
};

export default DynamicButton;
