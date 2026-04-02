import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LinkText from "../atoms/LinkText";
import ParallaxAnim from "../../animations/ParallaxAnim";
import HoverArrow from "../../animations/HoverArrow";

gsap.registerPlugin(ScrollTrigger);

function AboutMeLandingPage() {
  const container = useRef(null);

  return (
    <section ref={container} className="relative  min-h-screen w-screen bg-warna1 py-24">
      {/* Parent */}
      <div className="h-fit w-full flex flex-col  gap-16 lg:gap-24">
        {/* Top */}
        <div className="h-60 md:h-60 w-full flex flex-col gap-8 md:gap-0 md:flex-row px-4 md:px-6 lg:px-8">
          <div className="flex justify-start items-center w-full h-full ">
            <h1 className="text-4xl w-80 md:w-full lg:w-4xl md:text-5xl lg:text-7xl font-black">SIMPLICITY IS WHERE GOOD DESIGN LIVES</h1>
          </div>
          <div className="flex justify-start items-center w-80 md:w-108 lg:w-xl max-w-full h-full  ">
            <div className="flex h-1/2 w-full items-center md:items-start">
              <p className="text-xs md:text-sm ">
                My name is Nuradli, a Front-End Developer and Graphic Designer. I design and build digital experiences where simplicity, elegance, and usability work together to create lasting impressions.
              </p>
            </div>
          </div>
        </div>
        {/* Center */}
        <div className="h-[48vh] md:h-[54vh] lg:h-[76vh] w-full flex ">
          <ParallaxAnim src="/img/nuradliabout.png" alt="Nuradli" containerClass="w-full h-full rounded-xs" className="w-[125%] h-[125%]  md:object-right lg:object-center" start="top bottom" end="bottom top" scrub={true} />
        </div>

        {/* Bottom */}
        <div className="h-[40vh] w-full flex flex-col gap-16 md:gap-0 md:flex-row px-4 md:px-6 lg:px-8">
          <div className="flex justify-start items-start h-full w-full ">
            <h2 className="text-3xl md:text-3xl lg:text-5xl font-black ">
              LESS NOISE <br /> MORE MEANING
            </h2>
          </div>
          <div className="flex flex-col justify-start items-start gap-8 md:gap-12 h-full md:w-108 lg:w-xl ">
            <p className="text-xs md:text-sm">
              I bring ideas to life through clean code and thoughtful design, focusing on clarity, smooth interactions, and meaningful details. Every project is built to feel intuitive, purposeful, and enjoyable to use.
            </p>
            <p className="text-xs md:text-sm">It’s not just about making things look good — it’s about helping people feel good when they use them. Simplicity isn’t just design — it’s how we connect better with technology.</p>
            <HoverArrow text="Start a Project" className="text-xs md:text-sm font-bold uppercase" as="h3" enableAnimation={false} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutMeLandingPage;
