import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function ParallaxAnim({
  src = "",
  alt = "",
  type = "image", // "image" | "video"
  className = "",
  containerClass = "",
  start = "top bottom",
  end = "bottom top",
  from = { yPercent: -20, scale: 1.05, rotateX: 5 },
  to = { yPercent: 10, scale: 1, rotateX: 0 },
  scrub = true,
  videoProps = {},
}) {
  const containerRef = useRef(null);
  const mediaRef = useRef(null);

  useGSAP(
    () => {
      if (!mediaRef.current) return;

      gsap.fromTo(mediaRef.current, from, {
        ...to,
        ease: "none",
        transformOrigin: "center bottom",
        scrollTrigger: {
          trigger: containerRef.current,
          start,
          end,
          scrub,
        },
      });
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${containerClass}`}>
      {type === "video" ? (
        <video ref={mediaRef} className={`absolute object-cover ${className}`} autoPlay muted loop playsInline {...videoProps}>
          <source src={src} />
        </video>
      ) : (
        <img ref={mediaRef} src={src} alt={alt} className={`absolute object-cover ${className}`} />
      )}
    </div>
  );
}

export default ParallaxAnim;
