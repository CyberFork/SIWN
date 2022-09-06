import React, { useEffect, useRef } from "react";

interface IAppProps {}

const Logo: React.FunctionComponent<IAppProps> = (props) => {
  const text1 = useRef<HTMLSpanElement>(null)!;
  const text2 = useRef<HTMLSpanElement>(null)!;

  // The strings to morph between. You can change these to anything you want!
  const texts = ["WAHT", "IS", "NFT", "AND", "WAHT", "IS", "GATE?"];

  // Controls the speed of morphing.
  const morphTime = 1;
  const cooldownTime = 0.25;

  let textIndex = texts.length - 1;
  let time = new Date();
  let morph = 0;
  let cooldown = cooldownTime;

  useEffect(() => {
    text1.current!.innerText = texts[textIndex % texts.length];
    text2.current!.innerText = texts[(textIndex + 1) % texts.length];
    animate();
  }, []);

  const doMorph = () => {
    morph -= cooldown;
    cooldown = 0;

    let fraction = morph / morphTime;

    if (fraction > 1) {
      cooldown = cooldownTime;
      fraction = 1;
    }

    setMorph(fraction);
  };

  // A lot of the magic happens here, this is what applies the blur filter to the text.
  function setMorph(fraction: number) {
    if(!text2.current) return
    // fraction = Math.cos(fraction * Math.PI) / -2 + .5;   

    text2.current.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
    text2.current!.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

    fraction = 1 - fraction;
    text1.current!.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
    text1.current!.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

    text1.current!.innerText = texts[textIndex % texts.length];
    text2.current!.innerText = texts[(textIndex + 1) % texts.length];
  }

  function doCooldown() {
    morph = 0;
    if(!text2.current) return
    text2.current!.style.filter = "";
    text2.current!.style.opacity = "100%";

    text1.current!.style.filter = "";
    text1.current!.style.opacity = "0%";
  }

  // Animation loop, which is called every frame.
  function animate() {
    requestAnimationFrame(animate);

    let newTime = new Date();
    let shouldIncrementIndex = cooldown > 0;
    let dt = (newTime.getTime() - time.getTime()) / 1000;
    time = newTime;

    cooldown -= dt;

    if (cooldown <= 0) {
      if (shouldIncrementIndex) {
        textIndex++;
      }

      doMorph();
    } else {
      doCooldown();
    }
  }

  return (
    <div className="m-auto logo-filter">
      <div id="container">
        <span id="text1" ref={text1}></span>
        <span id="text2" ref={text2}></span>
      </div>

      <svg id="filters">
        <defs>
          <filter id="threshold">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0
                                                0 1 0 0 0
                                                0 0 1 0 0
                                                0 0 0 255 -140"
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
};

export default Logo;
