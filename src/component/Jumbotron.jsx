import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import SplitType from "split-type";
import { useRef, useState, useEffect } from "react";

function Jumbotron() {
  const container = useRef(null);

  // Refs for text (desktop)
  const refs = {
    bigText: useRef(null),
    subText1: useRef(null),
    subText2: useRef(null),
    tagline: useRef(null),
  };

  // Refs for text (mobile)
  const mobileRefs = {
    bigText: useRef(null),
    subText1: useRef(null),
    subText2: useRef(null),
    tagline: useRef(null),
  };

  // Mobile Checking
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 720);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Ref for image with overlay
  const imageRef = useRef(null);
  const mobileImageRef = useRef(null);

  // Desktop Animation
  useGSAP(
    () => {
      if (!isMobile) {
        // Animate Big Text (chars)
        const splitBig = new SplitType(refs.bigText.current, {
          types: "chars",
          tagName: "span",
        });
        gsap.from(splitBig.chars, {
          y: "150%",
          opacity: 0,
          duration: 1.5,
          ease: "power3.out",
          stagger: 0.1,
        });

        // Animate other texts (lines)
        [refs.subText1, refs.subText2, refs.tagline].forEach((ref) => {
          if (!ref.current) return;
          const split = new SplitType(ref.current, {
            types: "lines",
            tagName: "span",
          });
          gsap.from(split.lines, {
            y: "300%",
            duration: 1.5,
            ease: "power3.out",
            stagger: 0.1,
          });
        });

        // Animate overlay on image
        if (imageRef.current) {
          const overlay = imageRef.current.querySelector(".img-overlay");
          gsap.fromTo(overlay, { scaleY: 1, transformOrigin: "bottom" }, { scaleY: 0, duration: 2, ease: "power3.out" });
        }
      }
    },
    { scope: container, dependencies: [isMobile] }
  );

  // Mobile Animation
  useGSAP(
    () => {
      if (isMobile) {
        // Animate Big Text (chars)
        const splitBig = new SplitType(mobileRefs.bigText.current, {
          types: "chars",
          tagName: "span",
        });
        gsap.from(splitBig.chars, {
          y: "150%",
          opacity: 0,
          duration: 1.5,
          ease: "power3.out",
          stagger: 0.1,
        });

        // Animate other texts (lines)
        [mobileRefs.subText1, mobileRefs.subText2, mobileRefs.tagline].forEach((ref) => {
          if (!ref.current) return;
          const split = new SplitType(ref.current, {
            types: "lines",
            tagName: "span",
          });
          gsap.from(split.lines, {
            y: "300%",
            duration: 1.5,
            ease: "power3.out",
            stagger: 0.1,
          });
        });

        // Animate overlay on mobile image
        if (mobileImageRef.current) {
          const overlay = mobileImageRef.current.querySelector(".img-overlay");
          if (overlay) {
            gsap.fromTo(overlay, { scaleY: 1, transformOrigin: "bottom" }, { scaleY: 0, duration: 2, ease: "power3.out" });
          }
        }
      }
    },
    { scope: container, dependencies: [isMobile] }
  );

  return (
    <div ref={container} className="h-screen w-screen bg-warna1 py-5 px-5 md:px-10">
      {/* Desktop Layout */}
      <div className={`hidden md:flex w-full h-full ${isMobile ? "hidden" : ""}`}>
        {/* Left Section */}
        <div className="flex w-full h-full justify-start items-end gap-10">
          {/* Image with overlay */}
          <div ref={imageRef} className="flex h-full max-h-80 max-w-40 w-full relative overflow-hidden rounded-md">
            <img className="w-full h-full object-cover object-center" src="/img/Nuradli2.jpg" alt="NurAdli" />
            <div className="img-overlay absolute inset-0 bg-white"></div>
          </div>

          {/* Text */}
          <div className="flex flex-col text-end gap-5 text-xs items-start">
            <p ref={refs.subText1} className="max-w-sm text-start tracking-wide overflow-hidden">
              I love crafting good and simple things, both as a Front-End Developer and a Graphic Designer.
            </p>
            <p ref={refs.subText2} className="max-w-md text-start tracking-wide overflow-hidden">
              I make the web look good and work even better — simple, clean, and user-friendly. Don’t be fooled by my serious-looking face — it’s just my default setting. In reality, I’m super chill and love keeping things fun and simple.
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex w-full h-full justify-end leading-18 items-end">
          <div className="flex flex-col max-w-100 gap-5 justify-end">
            <h1 ref={refs.bigText} className="text-8xl text-end leading-18 font-medium overflow-hidden">
              NurAdli
            </h1>
            <h2 ref={refs.tagline} className="text-2xl font-medium text-end overflow-hidden">
              The simpler things are, the happier you are.
            </h2>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className={`flex md:hidden justify-end items-center flex-col w-fit h-full gap-5 ${!isMobile ? "hidden" : ""}`}>
        <div className="flex flex-col gap-10 text-xs items-start">
          {/* Top Class Name and Tagline */}
          <div className="flex flex-col items-start justify-center">
            <h1 ref={mobileRefs.bigText} className="text-5xl font-medium overflow-hidden">
              NurAdli
            </h1>
            <h2 ref={mobileRefs.tagline} className="text-md max-w-40 font-medium overflow-hidden">
              The simpler things are, the happier you are.
            </h2>
          </div>
          {/* Bottom Class Para and Image */}
          <div className="flex flex-col gap-5">
            <p ref={mobileRefs.subText1} className="text-xs max-w-60 text-start overflow-hidden">
              I love crafting good and simple things, both as a Front-End Developer and a Graphic Designer.
            </p>
            <p ref={mobileRefs.subText2} className="text-xs max-w-70 text-start overflow-hidden">
              I make the web look good and work even better — simple, clean, and user-friendly. Don’t be fooled by my serious-looking face — it’s just my default setting. In reality, I’m super chill and love keeping things fun and simple.
            </p>
          </div>
          {/* Image with overlay */}
          <div ref={mobileImageRef} className="flex items-start justify-start h-fit w-full relative overflow-hidden ">
            <img className="w-30 h-55 rounded-md object-cover object-center" src="/img/Nuradli2.jpg" alt="NurAdli" />
            <div className="img-overlay absolute inset-0 left-0 bg-warna1"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Jumbotron;
