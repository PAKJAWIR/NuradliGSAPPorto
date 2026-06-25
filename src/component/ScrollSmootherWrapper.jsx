import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/all";
import { ScrollSmoother } from "gsap/all";
import { useRef } from "react";
import { useProjects } from "../context/ProjectContext";
import { useDevice } from "../context/DeviceProvider";
import { useFaq } from "../context/FaqContext";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

function ScrollSmootherWrapper({ children }) {
  const { isProjectFullyLoaded } = useProjects();
  const { isFaqsFullyLoaded } = useFaq();
  const wrapperRef = useRef(null);
  const contentRef = useRef(null);
  const { isTablet, isMobile } = useDevice();

  const isLoaded = isProjectFullyLoaded || isFaqsFullyLoaded;

  useGSAP(() => {
    if (!isTablet && !isMobile) {
      const smoother = ScrollSmoother.create({
        smooth: 1.4,
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
      ScrollSmoother.get()?.paused(isLoaded);
    },
    { dependencies: [isLoaded] },
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
