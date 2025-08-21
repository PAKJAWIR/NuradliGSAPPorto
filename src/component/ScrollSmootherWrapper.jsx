import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/all";
import { ScrollSmoother } from "gsap/all";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

function ScrollSmootherWrapper({ children }) {
  const wrapperRef = useRef(null);
  const contentRef = useRef(null);

  useGSAP(() => {
    const isMobile = window.innerWidth < 768;

    if (!isMobile) {
      const smoother = ScrollSmoother.create({
        smooth: 3,
        effects: true,
        normalizeScroll: true,
        wrapper: wrapperRef.current,
        content: contentRef.current,
        smoothTouch: 0,
      });

      return () => smoother.kill();
    }
  }, []);

  return (
    <div className="relative" ref={wrapperRef} id="smooth-wrapper">
      <div className="relative md:will-change-transform" ref={contentRef} id="smooth-content">
        {children}
      </div>
    </div>
  );
}

export default ScrollSmootherWrapper;
