import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { useProjects } from "../../context/ProjectContext";
import { useDevice } from "../../context/DeviceProvider";

gsap.registerPlugin(ScrollTrigger);

function SelectedProject() {
  const container = useRef(null);
  const imgRef = useRef([]);
  const horizontalWrapper = useRef(null);

  const { projects, loading, openProject } = useProjects();
  const { isMobile } = useDevice();

  useGSAP(
    () => {
      if (loading) return;

      const ctx = gsap.context(() => {
        gsap.set(imgRef.current, {
          scale: 1,
          filter: "saturate(0)",
          willChange: "transform, filter",
        });

        if (!isMobile && horizontalWrapper.current) {
          const el = horizontalWrapper.current;

          gsap.to(el, {
            xPercent: -100,
            x: () => window.innerWidth,
            ease: "none",
            scrollTrigger: {
              trigger: container.current,
              pin: true,
              start: "center center",
              end: () => `+=${el.offsetWidth}`,
              scrub: true,
              invalidateOnRefresh: true,
            },
          });
        }
      }, container);

      return () => ctx.revert();
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
    <section ref={container} className="flex flex-col gap-5 w-screen h-fit bg-warna1 overflow-hidden">
      <div className="h-fit w-full relative">
        <div ref={horizontalWrapper} className="flex flex-col gap-0 md:grid md:grid-cols-2 lg:flex lg:flex-row h-max lg:h-fit w-full lg:w-max items-center justify-start md:justify-center">
          {projects.slice(0, 4).map((project, index) => (
            <div key={project.id} className="relative h-[70vh] md:h-[70vh] lg:h-screen w-full lg:w-126" onClick={() => openProject(index)}>
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
      </div>
    </section>
  );
}

export default SelectedProject;
