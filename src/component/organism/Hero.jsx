import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ParallaxAnim from "../../animations/ParallaxAnim";
import LinkText from "../atoms/LinkText";

gsap.registerPlugin(ScrollTrigger);

function Hero({ navbarRef }) {
  const container = useRef(null);
  const imgRef = useRef(null);
  const textRef = useRef(null);
  const textUpRef = useRef(null);
  const textUp2Ref = useRef(null);
  const textScrollRef = useRef(null);

  useGSAP(
    () => {
      const triggerBtn = ScrollTrigger.create({
        trigger: container.current,
        start: "bottom-=95 center-=50",
        end: "top-=50 top",
        onEnter: () => {
          navbarRef.current?.animateMove("up");
        },
        onEnterBack: () => {
          navbarRef.current?.animateMove("down");
        },
      });

      const tl = gsap.timeline();

      tl.set(imgRef.current, { scale: 0.8 });
      tl.set([textRef.current.element, textScrollRef.current.element], {
        autoAlpha: 0,
        letterSpacing: "-0.06em",
      });

      tl.to(imgRef.current, {
        scale: 1,
        duration: 1,
        ease: "power3.out",
      });

      tl.call(
        () => {
          textRef.current.animate();
          textScrollRef.current?.animate();
        },
        null,
        "-=0.9"
      );

      tl.to(textRef.current.element, {
        letterSpacing: "0.07em",
        duration: 1,
        autoAlpha: 1,
        ease: "power2.out",
        delay: 0.8,
      });
      tl.to(textScrollRef.current.element, {
        autoAlpha: 1,
      });

      gsap.fromTo(
        [textUpRef.current, textUp2Ref.current],
        {
          y: 0,
        },
        {
          y: -35,
          ease: "none",
          scrollTrigger: {
            trigger: container.current,
            start: "center center",
            end: "center top",
            scrub: 1,
          },
        }
      );
      // --- Cleanup
      return () => {
        triggerBtn.kill();
      };
    },
    { scope: container }
  );

  return (
    <div ref={container} className="flex flex-col bg-warna1 w-screen h-screen ">
      <div className=" relative flex-col h-full w-full flex items-center justify-center">
        <div ref={textUpRef} className="gpu-fix absolute flex items-center z-2 justify-center  mix-blend-difference h-fit w-full">
          <LinkText ref={textRef} splitType="chars" duration={1} text="NURADLI" className=" font-extrabold  text-6xl md:text-8xl text-warna1 mix-blend-difference" />
        </div>
        <div ref={imgRef} className="h-fit w-fit z-1">
          <ParallaxAnim src="/img/Nuradli5.png" alt="Nuradli" containerClass=" h-60 w-40 md:h-90 md:w-60 rounded-md" className="h-full w-full" start="center bottom" end="center top" scrub={1} />
        </div>
      </div>

      <div className="flex items-end justify-center pb-5 ">
        <div ref={textUp2Ref} className="h-fit w-fit gpu-fix">
          <LinkText ref={textScrollRef} text="Scroll for more" className="text-warna2 font-bold text-xs z-1 uppercase" />
        </div>
      </div>
    </div>
  );
}

export default Hero;
