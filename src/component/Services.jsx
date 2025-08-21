import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { useGSAP } from "@gsap/react";

function Services() {
  const container = useRef(null);
  const parSection = useRef(null);

  // Section refs
  const myServiceRef = useRef(null);
  const uxWebRef = useRef(null);
  const webDevRef = useRef(null);
  const creativeRef = useRef(null);
  const contentRef = useRef(null);

  // Heading refs
  const headingRefs = {
    myServiceH1: useRef(null),
    uxWebH2: useRef(null),
    webDevH2: useRef(null),
    creativeH2: useRef(null),
    contentH2: useRef(null),
  };

  // Paragraph refs
  const paragraphRefs = {
    uxWebP: useRef(null),
    webDevP: useRef(null),
    creativeP: useRef(null),
    contentP: useRef(null),
  };

  gsap.registerPlugin(ScrollTrigger);

  useGSAP(
    () => {
      const isMobile = window.innerWidth < 768;
      const isIOS = /iP(ad|hone|od)/.test(navigator.userAgent);

      ScrollTrigger.normalizeScroll({ target: ".scroller", allowNestedScroll: true });

      // Pin container with device-specific type
      ScrollTrigger.create({
        trigger: container.current,
        start: "top top",
        end: "+=200%",
        pin: true,
        pinType: isMobile && !isIOS ? "fixed" : "transform",
        markers: false,
        refreshPriority: 9,
        preventOverlaps: true,
        anticipatePin: 1,
      });

      const sections = [
        { parent: myServiceRef, heading: headingRefs.myServiceH1, paragraph: null },
        { parent: uxWebRef, heading: headingRefs.uxWebH2, paragraph: paragraphRefs.uxWebP },
        { parent: webDevRef, heading: headingRefs.webDevH2, paragraph: paragraphRefs.webDevP },
        { parent: creativeRef, heading: headingRefs.creativeH2, paragraph: paragraphRefs.creativeP },
        { parent: contentRef, heading: headingRefs.contentH2, paragraph: paragraphRefs.contentP },
      ];

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: isMobile ? "top top" : "top center-=50",
          end: "+=200%",
          scrub: 3,
          markers: false,
          refreshPriority: 9,
          preventOverlaps: true,
          anticipatePin: 1,
        },
      });

      sections.forEach(({ parent, heading, paragraph }) => {
        tl.from(parent.current, { autoAlpha: 0, y: 80, duration: 0.8, ease: "power3.out", force3D: true });

        if (heading.current) {
          const split = new SplitType(heading.current, { types: "lines", tagName: "span" });
          tl.from(split.lines, { y: "200%", autoAlpha: 0, duration: 1, ease: "power3.out", stagger: 0.05, force3D: true }, "<");
        }

        if (paragraph && paragraph.current) {
          const splitParagraph = new SplitType(paragraph.current, { types: "lines", tagName: "span" });
          tl.from(splitParagraph.lines, { y: "300%", autoAlpha: 0, duration: 1, ease: "power3.out", stagger: 0.08, force3D: true }, "<");
        }
      });

      // Cleanup
      return () => {
        ScrollTrigger.getAll().forEach((st) => st.kill());
      };
    },
    { scope: container }
  );

  return (
    <div ref={container} className="gpu-fix scroller w-full h-full md:h-fit bg-warna1 px-5 md:px-10 py-15">
      <div ref={parSection} className="flex flex-col justify-center items-start w-full h-fit md:h-65 gap-5 md:gap-10">
        {/* My Services */}
        <div ref={myServiceRef} className="flex items-start justify-start w-full h-fit overflow-hidden">
          <h1 ref={headingRefs.myServiceH1} className="font-medium text-2xl md:text-3xl overflow-hidden">
            Crafts I Create
          </h1>
        </div>

        <div className="flex w-full flex-col gap-5 md:flex-row items-start justify-between">
          {/* UX & Web Design */}
          <div ref={uxWebRef} className="flex flex-col h-fit w-full gap-3 max-w-70 overflow-hidden">
            <h2 ref={headingRefs.uxWebH2} className="text-md md:text-xl font-medium overflow-hidden">
              UX & Web Design
            </h2>
            <p ref={paragraphRefs.uxWebP} className="text-xs tracking-wide overflow-hidden">
              I design websites that balance beauty and functionality. The focus is on creating seamless user experiences, with layouts that feel intuitive and designs that leave a lasting impression.
            </p>
          </div>

          {/* Web Development */}
          <div ref={webDevRef} className="flex flex-col h-fit w-full gap-3 max-w-70 overflow-hidden">
            <h2 ref={headingRefs.webDevH2} className="text-md md:text-xl font-medium overflow-hidden">
              Web Development
            </h2>
            <p ref={paragraphRefs.webDevP} className="text-xs tracking-wide overflow-hidden">
              I build responsive and structured websites from the ground up. Using modern tools and best practices, I turn ideas into interactive platforms that perform smoothly across devices.
            </p>
          </div>

          {/* Creative & Visual Design */}
          <div ref={creativeRef} className="flex flex-col h-fit w-full gap-3 max-w-70 overflow-hidden">
            <h2 ref={headingRefs.creativeH2} className="text-md md:text-xl font-medium overflow-hidden">
              Creative & Visual Design
            </h2>
            <p ref={paragraphRefs.creativeP} className="text-xs tracking-wide overflow-hidden">
              I create visuals that tell a story and strengthen a brand’s identity. From colors to layouts, every element is crafted to be both eye-catching and purposeful.
            </p>
          </div>

          {/* Content & Copywriting */}
          <div ref={contentRef} className="flex flex-col h-fit w-full gap-3 max-w-70 overflow-hidden">
            <h2 ref={headingRefs.contentH2} className="text-md md:text-xl font-medium overflow-hidden">
              Content & Copywriting
            </h2>
            <p ref={paragraphRefs.contentP} className="text-xs tracking-wide overflow-hidden">
              I write content that connects and copy that persuades. Whether it’s storytelling or marketing-driven text, the goal is to make messages clear, engaging, and impactful.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Services;
