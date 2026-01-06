import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Silk from "../../animations/Silk";

gsap.registerPlugin(ScrollTrigger);

function Hero({ navbarRef }) {
  const container = useRef(null);

  useGSAP(
    () => {
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
    <div ref={container} className="flex flex-col bg-warna1 w-full h-screen overflow-hidden">
      <div className="relative h-full w-full flex flex-col items-center justify-center overflow-hidden">
        <div className=" relative h-full w-full flex items-center justify-center overflow-hidden">
          <div className="relative overflow-hidden flex items-center justify-center w-full h-full md:w-[1025px] md:h-[535px] rounded-none md:rounded-lg">
            {/* ===== MOBILE VIDEO ===== */}
            <video className="absolute inset-0 w-full h-full object-cover md:hidden" src="/img/silkvd.webm" autoPlay muted loop plays-Inline />

            {/* ===== DESKTOP SILK ===== */}
            <div className="hidden md:block w-full h-full overflow-hidden">
              <Silk speed={5} scale={0.9} color="#486970" noiseIntensity={1.5} rotation={0} />
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
