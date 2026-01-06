import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import LinkText from "../atoms/LinkText";
import { useDevice } from "../../context/DeviceProvider";
import HoverArrow from "../../animations/HoverArrow";
gsap.registerPlugin(ScrollTrigger);

function MyPhilosophyLP() {
  const container = useRef();
  const textRef = useRef(null);
  const textLiRef = useRef(null);

  const { isMobile } = useDevice();

  useGSAP(
    () => {
      gsap.set(textRef.current.element, {
        autoAlpha: 0,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: isMobile ? "top center+=100" : "center center+=100",
          toggleActions: "play none none none",
        },
      });

      tl.call(() => {
        textRef.current.animate();
        textLiRef.current.show();
      });

      tl.to(textRef.current.element, {
        autoAlpha: 1,
      });
    },
    { scope: container }
  );

  return (
    <div ref={container} className="flex items-center justify-center h-screen  w-screen bg-warna1 ">
      <div className="flex flex-col gap-2.5 h-full w-full  items-center justify-center">
        <div className="relative  flex flex-col items-center justify-center w-full h-full">
          <div className="bg-warna2 h-50 w-full md:h-115 md:w-115"></div>
          <h1 className="absolute mix-blend-difference text-center w-85 md:w-215 text-warna1 font-bold text-3xl md:text-3xl">The Simpler Things Are, The Happier You Are</h1>
        </div>
        <div className="flex flex-col items-center justify-start gap-7 h-full w-full">
          <LinkText
            ref={textRef}
            className="text-center text-warna2 w-full md:w-100  text-xs md:text-sm"
            duration={1.5}
            stagger={0.26}
            text="
          I believe the best work comes from balancing creativity with functionality. My goal is to craft designs and code that look elegant, work seamlessly, and leave users with a sense of ease and satisfaction."
          />
          <HoverArrow ref={textLiRef} duration={1.5} text="About Me" className="text-warna2 uppercase text-xs font-bold" link={"/about"} />
        </div>
      </div>
    </div>
  );
}

export default MyPhilosophyLP;
