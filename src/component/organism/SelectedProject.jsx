import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState } from "react";
import LinkText from "../atoms/LinkText";
import HoverArrow from "../../animations/HoverArrow";
import { useProjects } from "../../context/ProjectContext";
import { useDevice } from "../../context/DeviceProvider";

gsap.registerPlugin(ScrollTrigger);

function SelectedProject() {
  const container = useRef(null);
  const h1HeaderRef = useRef(null);
  const h3Ref = useRef(null);
  const h3RefMobile = useRef(null);
  const paraRef = useRef(null);
  const paraRefMobile = useRef(null);
  const overlayRef = useRef([]);
  const imgRef = useRef([]);
  const horizontalWrapper = useRef(null);

  const [isOverlayDone, setIsOverlayDone] = useState(false);

  const { projects, loading, openProject } = useProjects();
  const { isMobile } = useDevice();

  useGSAP(
    () => {
      if (loading) return;

      const overlays = overlayRef.current.filter(Boolean);

      gsap.set(imgRef.current, {
        scale: 1,
        filter: "saturate(0)",
        willChange: "transform, filter",
      });

      gsap.set(h1HeaderRef.current, { autoAlpha: 1 });
      gsap.set(overlays, {
        scaleY: 1,
        transformOrigin: "bottom",
        autoAlpha: 1,
      });

      const textTL = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: "top-=50 center",
          once: true,
        },
      });

      textTL
        .call(() => {
          h1HeaderRef.current.animate();
          paraRef.current.animate();
          paraRefMobile.current.animate();
        })

        .call(
          () => {
            h3Ref.current.show();
            h3RefMobile.current.show();
          },
          null,
          ">+=0.2",
        );

      gsap.to(overlays, {
        scaleY: 0,
        duration: 1.5,
        ease: "power3.inOut",
        stagger: 0.12,
        onComplete: () => setIsOverlayDone(true),
        scrollTrigger: {
          trigger: container.current,
          start: "top+=100 center-=50",
        },
      });

      //  Horizontal scroll ONLY for desktop
      if (!isMobile && horizontalWrapper.current) {
        const el = horizontalWrapper.current;

        const horizontalTween = gsap.to(el, {
          xPercent: -100,
          x: () => window.innerWidth,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            pin: true,
            start: "left left",
            end: () => `+=${el.offsetWidth}`,
            scrub: true,
            invalidateOnRefresh: true,
          },
        });

        return () => {
          horizontalTween.kill();
          ScrollTrigger.getAll().forEach((t) => t.kill());
        };
      }
    },
    { scope: container, dependencies: [projects.length, isMobile] },
  );

  const handleEnter = (el) => {
    if (isMobile) return;

    gsap.to(el, {
      scale: 1.05,
      filter: "saturate(1)",
      duration: 0.7,
      ease: "power3.out",
    });
  };

  const handleLeave = (el) => {
    if (isMobile) return;

    gsap.to(el, {
      scale: 1,
      filter: "saturate(0)",
      duration: 0.7,
      ease: "power3.out",
    });
  };

  return (
    <div ref={container} className="flex  flex-col gap-5 md:gap-8 lg:gap-5 w-screen h-fit bg-warna1 overflow-hidden">
      {/* HEADER */}
      <header className=" px-4 md:px-8 w-full h-50 md:h-full lg:h-86 flex flex-col md:flex-row justify-between items-start md:items-end md:gap-12 lg:gap-0">
        {/* LEFT SIDE (Title) */}
        <div className="flex items-center justify-start w-full md:w-lg lg:w-full h-full ">
          <LinkText as="h1" ref={h1HeaderRef} duration={1.3} text="Selected Projects" className="text-warna2 font-bold text-4xl md:text-5xl lg:text-7xl uppercase w-1/2 md:w-full lg:w-full" />
        </div>
      </header>

      {/* PROJECT SECTION */}
      <section className="h-fit w-full relative">
        <div ref={horizontalWrapper} className="flex flex-col  md:grid md:grid-cols-2 lg:flex lg:flex-row  h-max lg:h-screen w-full lg:w-max items-center justify-start md:justify-center">
          {projects.slice(0, 4).map((project, index) => (
            <div
              key={project.id}
              className="relative h-[70vh] md:h-[50vh] lg:h-full w-full lg:w-126"
              onClick={() => {
                if (!isOverlayDone) return;
                openProject(index);
              }}
            >
              <div ref={(el) => (overlayRef.current[index] = el)} className="absolute inset-0 bg-warna1 z-2" />

              <div className="relative h-full w-full overflow-hidden">
                <img
                  ref={(el) => (imgRef.current[index] = el)}
                  src={project.image}
                  className="absolute h-full w-full object-cover cursor-pointer"
                  onMouseEnter={() => handleEnter(imgRef.current[index])}
                  onMouseLeave={() => handleLeave(imgRef.current[index])}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default SelectedProject;
