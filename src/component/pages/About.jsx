import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function About() {
  const container = useRef(null);
  const navbarRef = useRef(null);
  const navbarWrapperRef = useRef(null);

  useGSAP(
    () => {
      if (navbarWrapperRef.current) {
        ScrollTrigger.create({
          trigger: navbarRef.current,
          start: "top top",
          end: "bottom+=10000 top",
          pin: true,
          pinSpacing: false,
          anticipatePin: 1,
        });
      }

      return () => ScrollTrigger.getAll().forEach((st) => st.kill());
    },
    { scope: container }
  );

  return (
    <>
      <div ref={container} className="w-full h-fit bg-warna2">
        {/* Bungkus Navbar dalam wrapper agar mix-blend tetap bekerja */}
        <div ref={navbarWrapperRef} className="w-full z-50">
          <div ref={navbarRef} className="gpu-fix smooth-item w-full px-10 py-5 flex items-center justify-between mix-blend-difference text-white">
            {/* Title */}
            <div className="flex justify-start w-1/3 h-fit">
              <h2 className="uppercase overflow-hidden">Front End Developer & Graphic Designer</h2>
            </div>

            {/* Logo */}
            <div className="flex justify-center w-1/3 h-fit">
              <h1 className="font-bold text-md md:text-xl overflow-hidden">NA.</h1>
            </div>

            {/* Menu */}
            <div className="flex justify-end w-1/3 h-fit">
              <ul className="flex gap-5 md:gap-10 uppercase font-semibold overflow-hidden">
                <li className="overflow-hidden">
                  <h2>About</h2>
                </li>
                <li className="overflow-hidden">
                  <h2>Works</h2>
                </li>
                <li className="overflow-hidden">
                  <h2>Insight</h2>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="h-[2000px] text-white text-9xl p-10">About page content (scroll down to test pin)</div>
      </div>
    </>
  );
}

export default About;
