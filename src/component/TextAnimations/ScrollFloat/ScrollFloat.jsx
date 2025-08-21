import { useEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ScrollFloat = ({ children, scrollContainerRef, containerClassName = "", textClassName = "", animationDuration = 1, ease = "back.inOut(2)", scrollStart = "center bottom+=50%", scrollEnd = "bottom bottom-=40%", stagger = 0.03 }) => {
  const containerRef = useRef(null);

  const splitText = useMemo(() => {
    const text = typeof children === "string" ? children : "";
    return text.split("\n").map((line, lineIndex) => (
      <span className="block" key={lineIndex}>
        {line.split(" ").map((word, wordIndex) => (
          <span className="inline-block whitespace-nowrap" key={wordIndex}>
            {word.split("").map((char, charIndex) => (
              <span className={`${textClassName} inline-block`} key={charIndex}>
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
            {"\u00A0"}
          </span>
        ))}
      </span>
    ));
  }, [children, textClassName]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const scroller = scrollContainerRef?.current || document.querySelector("#smooth-wrapper") || window;

    const charElements = el.querySelectorAll(".inline-block");

    gsap.fromTo(
      charElements,
      {
        willChange: "opacity, transform",
        opacity: 0,
        yPercent: 10,
        scaleY: 1.1,
        scaleX: 0.7,
        transformOrigin: "50% 0%",
      },
      {
        duration: animationDuration,
        ease: ease,
        opacity: 1,
        yPercent: 0,
        scaleY: 1,
        scaleX: 1,
        stagger: stagger,
        scrollTrigger: {
          trigger: el,
          scroller,
          start: scrollStart,
          end: scrollEnd,
          scrub: true,
        },
      }
    );
  }, [scrollContainerRef, animationDuration, ease, scrollStart, scrollEnd, stagger]);

  return (
    <h2 ref={containerRef} className={` overflow-hidden ${containerClassName}`}>
      <span className={`inline-block ${textClassName}`}>{splitText}</span>
    </h2>
  );
};

export default ScrollFloat;
