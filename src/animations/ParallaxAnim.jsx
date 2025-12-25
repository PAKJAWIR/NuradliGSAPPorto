import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function ParallaxAnim({ src = "", alt = "", className = "", containerClass = "", start = "top bottom", end = "bottom top", from = { yPercent: -1, scale: 1.1, rotateX: 5 }, to = { yPercent: 0, scale: 1, rotateX: 0 }, scrub = true }) {
  const containerRef = useRef(null);
  const imgRef = useRef(null);

  useGSAP(
    () => {
      gsap.fromTo(imgRef.current, from, {
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
    { scope: containerRef }
  );

  return (
    // 💡DEV NOTE PENTING: Ukuran container WAJIB LEBIH KECIL dari isi (gambar),
    // supaya efek depth illusion / parallax benar-benar terasa saat discroll.
    <div ref={containerRef} className={`relative overflow-hidden ${containerClass}`}>
      <img ref={imgRef} src={src} alt={alt} className={`absolute object-cover object-center ${className}`} />
    </div>
  );
}

export default ParallaxAnim;
