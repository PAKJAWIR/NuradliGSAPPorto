import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import LinkText from "../atoms/LinkText";
import { useDevice } from "../../context/DeviceProvider";

gsap.registerPlugin(ScrollTrigger);

function AboutMeLandingPage() {
  const container = useRef(null);
  const textRef = useRef(null);
  const textMoveRef = useRef(null);
  const { isMobile } = useDevice();

  useGSAP(
    () => {
      gsap.set(textRef.current.element, {
        autoAlpha: 0,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: isMobile ? "top+=150 center+=100" : "top+=100 center+=100",
          markers: false,
          toggleActions: "play none none none",
        },
      });

      tl.call(() => {
        textRef.current.animate();
      });

      tl.to(textRef.current.element, {
        autoAlpha: 1,
      });

      if (!isMobile) {
        gsap.fromTo(
          textMoveRef.current,
          {
            y: 0,
          },
          {
            y: -35,
            ease: "none",
            scrollTrigger: {
              trigger: container.current,
              start: isMobile ? "center center+=100" : "top+=100 center+=100",
              end: "center top",
              scrub: 1,
            },
          }
        );
      }
    },
    { scope: container }
  );
  return (
    <div ref={container} className="p-5 w-screen h-screen flex flex-col items-center justify-center bg-warna1">
      <div ref={textMoveRef} className="flex items-center justify-center h-fit w-fit smooth-item">
        <LinkText
          ref={textRef}
          duration={1.5}
          stagger={isMobile ? 0.15 : 0.26}
          text="
       I love bringing ideas to life through clean code and thoughtful design — making every project simple, smooth, and visually satisfying. For me, it’s all about blending creativity with function, crafting digital experiences that not
        only look great but also feel intuitive and enjoyable to use."
          className="text-warna2 text-xl md:text-4xl text-center font-bold md:font-medium"
        />
      </div>
    </div>
  );
}

export default AboutMeLandingPage;
