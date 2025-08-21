import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import { Link } from "react-router-dom";

gsap.registerPlugin(useGSAP, SplitText);

function Navbar() {
  const container = useRef(null);
  const titleRef = useRef(null);
  const linkRef = useRef(null);

  useGSAP(
    () => {
      document.fonts.ready.then(() => {
        const tl = gsap.timeline();

        const titleSplit = new SplitText(titleRef.current, {
          type: "words",
        });

        tl.from(titleSplit.words, {
          x: -50,
          opacity: 0,
          duration: 2,
          ease: "power3.out",
        });

        const linkSplit = new SplitText(linkRef.current, {
          type: "words",
        });

        tl.from(
          linkSplit.words,
          {
            x: 50,
            opacity: 0,
            stagger: 0.1,
            duration: 2,
            ease: "power3.out",
          },
          "<"
        );

        // Cleanup
        return () => {
          titleSplit.revert();
          linkSplit.revert();
        };
      });
    },
    { scope: container }
  );

  return (
    <>
      <div ref={container} className="flex absolute w-full h-fit z-[999] justify-between items-center bg-warna1 py-5 px-10">
        <div ref={titleRef}>
          <Link className="text-warna2 font-bold text-xl" to="/">
            NA.
          </Link>
        </div>
        <div ref={linkRef}>
          <ul className="flex text-warna2 font-bold gap-10 text-xs">
            <li>
              <Link to="/about">ABOUT</Link>
            </li>
            <li>
              <Link to="/portfolio">PORTFOLIO</Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default Navbar;
