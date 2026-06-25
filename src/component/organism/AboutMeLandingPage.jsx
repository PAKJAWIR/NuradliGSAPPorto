import { useRef, useState, useEffect, memo } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TextHeadingAnimation from "../../animations/TextHeadingAnimation";
import { useDevice } from "../../context/DeviceProvider";

gsap.registerPlugin(ScrollTrigger);

// =============================================================================
// CENTRALIZED DATA
// =============================================================================
const LANDING_DATA = {
  about: {
    heading:
      "I am a creative engineer specializing in the synthesis of visual narratives and functional logic. My practice operates at the intersection of aesthetic precision and technical architecture where every pixel serves a purpose and every line of code follows a rhythm. I strive to create digital environments that are not just seen but felt through a meticulous balance of aesthetics and performance.",
    description:
      "Based in Indonesia, I bridge the gap between graphic systems and scalable web solutions. By aligning visual constraints with modern standards, I help brands establish a distinctive digital presence. My goal is to craft interfaces that are inherently intuitive, maintaining a silent dialogue through clarity, structure, and poise.",
  },
  status: {
    heading: "I operate on the discipline of essentialism, where every decision is an exercise in restraint. I believe that clarity is found by removing the noise, focusing only on what remains when everything else is stripped away.",
    description: "My current focus is a deliberate expansion into end to end architectures. I am refining my craft through constant friction, bridging the gap between current limits and the caliber of industry masters.",
  },
  images: [
    { src: "/img/Nuradli6.webp", alt: "Nuradli Portrait 1", className: "h-full md:h-[44vh] lg:h-[76vh] w-full md:w-[34vw] lg:w-[24vw]" },
    { src: "/img/Nuradli5.webp", alt: "Nuradli Portrait 2", className: "hidden md:flex md:h-[38vh] lg:h-[66vh] w-[34vw] lg:w-[24vw]" },
  ],
};

// =============================================================================
// ISOLATED SUB-COMPONENTS
// =============================================================================
const LiveClock = memo(() => {
  const [timeString, setTimeString] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = { timeZone: "Asia/Jakarta", hour: "2-digit", minute: "2-digit", hour12: true };
      const formattedTime = new Intl.DateTimeFormat("en-US", options).format(now);
      setTimeString(`[${formattedTime}, GMT +7]`);
    };

    updateTime();
    const intervalId = setInterval(updateTime, 60000);
    return () => clearInterval(intervalId);
  }, []);

  return <h2 className="font-bold text-sm md:text-md w-full md:w-[10%] lg:w-[5dvw]">{timeString || "[--:-- --, GMT +7]"}</h2>;
});

LiveClock.displayName = "LiveClock";

// =============================================================================
// MAIN COMPONENT
// =============================================================================
function AboutMeLandingPage() {
  const container = useRef(null);
  const bottomRef = useRef(null);

  const { isMobile } = useDevice();

  // =============================================================================
  // GSAP ANIMATION LOGIC (Hanya Mengurus Image Reveal)
  // =============================================================================
  useGSAP(
    () => {
      if (isMobile) return;

      requestAnimationFrame(() => {
        // IMAGE REVEAL OVERLAYS
        gsap.set(".reveal-overlay", { scaleY: 1, transformOrigin: "top" });
        gsap.to(".reveal-overlay", {
          scaleY: 0,
          ease: "none",
          force3D: true,
          lazy: true,
          scrollTrigger: {
            trigger: bottomRef.current,
            start: "top bottom",
            end: "center+=18% center",
            scrub: 1.1,
            immediateRender: false,
          },
        });
      });
    },
    { scope: container },
  );

  return (
    <section ref={container} className="flex flex-col gap-16 md:gap-4 relative min-h-svh w-screen bg-warna1 p-4 md:p-6">
      {/* About Intro Section */}
      <div className=" flex flex-col justify-center lg:flex-row h-fit lg:h-[84svh] w-full ">
        <div className="flex justify-start items-end py-8 lg:items-center w-1/2 h-[20svh] md:h-[48%] lg:h-1/2">
          <h2 className="uppercase font-bold text-sm md:text-base mb-6">About</h2>
        </div>

        <div className=" flex flex-col items-end justify-start lg:justify-center gap-16 md:gap-26 w-full h-fit md:h-[80vh] lg:h-full">
          {/* IMPLEMENTASI ANIMASI 1: TOP HEADING */}
          <TextHeadingAnimation
            text={LANDING_DATA.about.heading}
            // Konfigurasi Desktop
            startDesktop="top bottom"
            endDesktop="center top+=20%"
            scrubDesktop={1.7}
            // Konfigurasi Mobile & Tablet
            startMobile="top center+=25%"
            endMobile="bottom center-=10%"
            disableAnimation={isMobile}
            // Sinkronisasi Layout
            className="md:pl-24 lg:p-0 text-xl md:text-2xl lg:text-3xl font-bold w-full md:w-[96%] will-change-opacity"
            containerClassName="items-end md:justify-end !h-fit"
          />

          <div className="flex items-start justify-start md:justify-end h-fit w-full md:w-1/2">
            <p className="text-xs w-[90%] md:w-full lg:w-[88%] md:text-sm">{LANDING_DATA.about.description}</p>
          </div>
        </div>
      </div>

      {/* Status & Gallery Section */}
      <div ref={bottomRef} className=" flex flex-row min-h-svh md:h-svh w-full py-12 lg:py-0">
        <div className="w-full h-full flex flex-col">
          <div className="flex items-start lg:items-end justify-between h-20 w-full">
            <LiveClock />
            <h2 className="font-bold text-sm">[MORE]</h2>
          </div>

          <div className="flex flex-col-reverse lg:flex-row gap-8 lg:gap-24 h-full w-full">
            <div className="flex flex-row items-end md:gap-2 md:justify-start h-full w-full">
              {LANDING_DATA.images.map((img, index) => (
                <div key={index} className={`relative h-fit w-full md:w-fit ${img.className.includes("hidden") ? "hidden md:flex" : ""}`}>
                  <img src={img.src} alt={img.alt} decoding="async" loading="lazy" className={`${img.className} rounded-xs object-center object-cover`} />
                  <div className="md:flex hidden reveal-overlay gpu-fix absolute inset-0 bg-warna1 pointer-events-none" />
                </div>
              ))}
            </div>

            <div className=" flex items-start lg:items-end justify-start md:h-full lg:h-full w-full lg:w-[70vw]">
              <div className="flex flex-col items-start md:justify-center gap-12 md:gap-16 lg:justify-between md:h-full lg:h-[54vh] w-full">
                {/* IMPLEMENTASI ANIMASI 2: BOTTOM HEADING */}
                <TextHeadingAnimation
                  text={LANDING_DATA.status.heading}
                  // Konfigurasi Desktop
                  startDesktop="top bottom"
                  endDesktop="center top+=20%"
                  scrubDesktop={1.7}
                  // Konfigurasi Mobile & Tablet
                  startMobile="top center+=25%"
                  endMobile="bottom center-=10%"
                  disableAnimation={isMobile}
                  // Sinkronisasi Layout
                  className="font-bold text-xl md:text-2xl w-full md:w-[88%] md:max-w-[80%] lg:max-w-full"
                  containerClassName="!justify-start !items-start lg:!items-end !h-fit"
                />

                <p className="text-xs md:text-sm w-[90%] md:w-[50%] lg:w-[78%]">{LANDING_DATA.status.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutMeLandingPage;
