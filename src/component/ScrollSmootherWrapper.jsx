import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/all";
import { ScrollSmoother } from "gsap/all";
import { useRef } from "react";
import { useProjects } from "../context/ProjectContext";
import { useDevice } from "../context/DeviceProvider";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

function ScrollSmootherWrapper({ children }) {
  const { isProjectFullyLoaded } = useProjects();
  const wrapperRef = useRef(null);
  const contentRef = useRef(null);
  const { isMobile } = useDevice();
  useGSAP(() => {
    if (!isMobile) {
      const smoother = ScrollSmoother.create({
        smooth: 1.7,
        effects: true,
        normalizeScroll: true,
        wrapper: wrapperRef.current,
        content: contentRef.current,
        smoothTouch: 0,
        snap: true,
      });

      return () => smoother.kill();
    }
  }, []);

  // Pause smoother when project detail is active
  useGSAP(
    () => {
      ScrollSmoother.get()?.paused(isProjectFullyLoaded);
    },
    { dependencies: [isProjectFullyLoaded] },
  );

  return (
    <div className="relative" ref={wrapperRef} id="smooth-wrapper">
      <div className="relative lg:will-change-transform" ref={contentRef} id="smooth-content">
        {children}
      </div>
    </div>
  );
}

export default ScrollSmootherWrapper;
