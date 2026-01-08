import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Silk from "../../animations/Silk";
import { useDevice } from "../../context/DeviceProvider";

gsap.registerPlugin(ScrollTrigger);

function Hero({ navbarRef }) {
  const container = useRef(null);
  const silkPin = useRef(null);

  const { isMobile } = useDevice();
  const [showSilk, setShowSilk] = useState(false);

  useGSAP(
    () => {
      if (isMobile) return;

      requestAnimationFrame(() => setShowSilk(true));

      gsap.fromTo(
        silkPin.current,
        {
          width: "101vw",
          height: "100vh",
          borderRadius: 0,
        },
        {
          width: "1025px",
          height: "535px",
          borderRadius: 16,
          ease: "none",
          scrollTrigger: {
            trigger: container.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
            pin: true,
            anticipatePin: 1,
            pinSpacing: true,
          },
        }
      );

      const triggerBtn = ScrollTrigger.create({
        trigger: container.current,
        start: "bottom-=95 center-=50",
        end: "top-=50 top",
        onEnter: () => navbarRef.current?.animateMove("up"),
        onEnterBack: () => navbarRef.current?.animateMove("down"),
      });

      return () => triggerBtn.kill();
    },
    { scope: container }
  );

  return (
    <div ref={container} className="flex flex-col bg-warna1 w-full h-screen overflow-hidden z-1">
      <div className="relative h-full w-full flex flex-col items-center justify-center overflow-hidden">
        <div className=" relative h-full w-full flex items-center justify-center overflow-hidden">
          <div className="relative overflow-hidden flex items-center justify-center w-full h-full">
            {/* ===== MOBILE VIDEO ===== */}
            <video preload="metadata" className="absolute inset-0 w-full h-full object-cover md:hidden" src="/img/silkvd.webm" autoPlay muted loop plays-Inline />

            {/* ===== DESKTOP SILK ===== */}
            <div ref={silkPin} className="hidden md:block relative w-full h-full md:w-[1025px] md:h-[535px] overflow-hidden ">
              <video className="absolute inset-0 w-screen h-screen object-cover object-center" src="/img/silkvd.webm" autoPlay muted loop playsInline preload="metadata" />
            </div>
          </div>

          <h1 className="absolute text-warna1 text-lg md:text-2xl mix-blend-difference">NURADLI</h1>
        </div>
        <span className="text-warna1 uppercase text-[9px] md:text-[11px] font-medium absolute bottom-5 mix-blend-difference">Scroll for more</span>
      </div>
    </div>
  );
}

export default Hero;
