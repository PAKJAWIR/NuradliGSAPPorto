import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useDevice } from "../../context/DeviceProvider";

gsap.registerPlugin(ScrollTrigger);

function Hero({ navbarRef }) {
  const container = useRef(null);
  const silkPin = useRef(null);

  const { isMobile } = useDevice();

  useGSAP(
    () => {
      if (isMobile) return;

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
        },
      );

      const triggerBtn = ScrollTrigger.create({
        trigger: container.current,
        start: "bottom-=120 center-=50",
        end: "top-=50 top",
        onEnter: () => navbarRef.current?.animateMove("up"),
        onEnterBack: () => navbarRef.current?.animateMove("down"),
      });

      return () => triggerBtn.kill();
    },
    { scope: container },
  );

  return (
    <div ref={container} className="flex flex-col bg-warna1 w-full h-screen overflow-hidden z-1">
      <div className="relative h-full w-full flex flex-col items-center justify-center overflow-hidden ">
        <div className=" relative h-full w-full flex items-center justify-center overflow-hidden">
          <div className="relative overflow-hidden flex items-center justify-center w-full h-full">
            {/* ===== MOBILE VIDEO ===== */}
            <video className="absolute inset-0 w-full h-full object-cover md:hidden pointer-events-none " src="/img/silkvd.webm" autoPlay muted loop playsInline />

            {/* ===== DESKTOP SILK ===== */}
            <div ref={silkPin} className="hidden md:block relative w-full h-full lg:w-[1025px] lg:h-[535px] overflow-hidden md:rounded-lg">
              <video className="absolute inset-0 w-screen h-screen object-cover object-center pointer-events-none " src="/img/silkvd.webm" autoPlay muted loop playsInline />
            </div>
          </div>
          <div className="absolute inset-0 flex h-full w-full items-center justify-center">
            <h1 className=" font-bold text-warna1 text-md md:text-lg mix-blend-difference tracking-[5px]">NURADLI</h1>{" "}
          </div>
        </div>
        <div className="absolute bottom-0 h-10 w-full flex items-center justify-center">
          <h3 className="text-warna1  uppercase text-[9px] md:text-[10px] font-regular text-center w-full items-center justify-center  mix-blend-difference">Scroll for more</h3>
        </div>
      </div>
    </div>
  );
}

export default Hero;
