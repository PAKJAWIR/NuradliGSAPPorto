import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useDevice } from "../../context/DeviceProvider";

gsap.registerPlugin(ScrollTrigger);

function HeroNew({ navbarRef }) {
  const container = useRef(null);

  const { isMobile } = useDevice();

  useGSAP(
    () => {
      if (isMobile) return;

      const triggerBtn = ScrollTrigger.create({
        trigger: container.current,
        start: "bottom-=200 top+=50",
        end: "top-=50 top",

        onEnter: () => navbarRef.current?.animateMove("up"),
        onEnterBack: () => navbarRef.current?.animateMove("down"),
      });

      return () => triggerBtn.kill();
    },
    { scope: container },
  );
  return (
    <section ref={container} className="relative bg-warna1 h-screen w-screen flex flex-col gap-6  overflow-hidden py-6 md:py-0 md:pt-6">
      <video className="block rotate-180 md:hidden absolute w-full h-full object-center  inset-0 object-cover gpu-fix" src="/img/Rotatevids.webm" autoPlay muted loop playsInline />
      {/* Mobile */}
      <div className="flex md:hidden h-full w-full flex-col mix-blend-difference">
        <div className="flex justify-center items-center h-full w-full  mix-blend-difference">
          <h1 className="text-warna1 mix-blend-difference text-xl uppercase font-bold">Nuradli</h1>
        </div>
        <div className="flex items-center justify-center h-fit w-full  mix-blend-difference">
          <span className="leading-[150%] text-[11px] text-center text-warna1 mix-blend-difference font-bold ">
            FRONT END DEVELOPER <br /> & GRAPHIC DESIGNER
          </span>
        </div>
      </div>

      {/* TEKS */}
      <div className="hidden md:flex flex-row justify-around items-end w-full md:h-full px-4 md:px-6 lg:px-8 ">
        <div className="flex flex-row justify-between items-end h-full w-full ">
          <h1 className="text-5xl lg:text-8xl font-black">NURADLI</h1>
        </div>
        <div className="hidden lg:flex h-full md:w-full lg:w-260 items-end justify-end ">
          <h2 className="text-xs font-bold leading-[150%]">
            FRONT END DEVELOPER <br /> & GRAPHIC DESIGNER
          </h2>
        </div>
      </div>
      {/* Dekstop & Tablet */}
      <div className="relative hidden md:flex md:items-end lg:items-center md:justify-center lg:justify-start w-full md:h-1/5 lg:h-1/2  ">
        <video className="md:w-full md:h-full max-h-100 object-cover  gpu-fix" src="/img/vids.webm" autoPlay muted loop playsInline />
      </div>
      <div className="hidden md:flex lg:hidden flex-col h-full w-full px-6 ">
        <div className="flex h-full w-full items-start justify-end ">
          <span className="text-xs font-bold leading-[150%]">
            FRONT END DEVELOPER <br /> & GRAPHIC DESIGNER
          </span>
        </div>
      </div>
    </section>
  );
}

export default HeroNew;
