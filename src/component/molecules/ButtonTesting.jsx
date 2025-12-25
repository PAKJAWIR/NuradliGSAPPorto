import { useRef, useState, forwardRef, useImperativeHandle } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import LinkText from "../atoms/LinkText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ButtonTesting = forwardRef((_, ref) => {
  const container = useRef(null);
  const overlayRef = useRef(null);
  const menuRefs = useRef([]);
  const menuTextRef = useRef(null);
  const spanRef = useRef(null);
  const span2Ref = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeClick, setActiveClick] = useState("btnClick");

  const menuItems = [
    { text: "Home", link: "/" },
    { text: "About", link: "/about" },
    { text: "Works", link: "/works" },
    { text: "Contact", link: "/contact" },
  ];

  // CLEAN: ANIMATE MOVE (UP/DOWN)
  const animateMove = (direction) => {
    if (isOpen) return;

    gsap.killTweensOf(overlayRef.current);

    gsap.to(overlayRef.current, {
      yPercent: direction === "up" ? 0 : 80,
      duration: 3,
      ease: "elastic.out(1, 0.7)",
    });
  };

  // EXPOSE TO HERO.JSX
  useImperativeHandle(ref, () => ({
    animateMove,
  }));

  // INITIAL SETUP
  useGSAP(
    () => {
      const trig = ScrollTrigger.create({
        trigger: container.current,
        start: "bottom-=150 center-=50",
        end: "top-=50 top",
        toggleActions: "play none reverse none",
        markers: true,
        onEnter: () => setActiveClick("btnClickVer2"),
        onLeaveBack: () => setActiveClick("btnClick"),
      });

      gsap.set(overlayRef.current, {
        width: "3.125rem",
        height: "3.125rem",
        borderRadius: "50%",
      });

      gsap.set(menuTextRef.current.element, { opacity: 0 });

      return () => trig.kill();
    },
    { scope: container }
  );

  // CLICK
  const handleBtnClick = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    const next = !isOpen;

    const tl = gsap.timeline({
      onComplete: () => setIsAnimating(false),
    });

    const overlayProps = {
      btnClick: { width: "14.5rem", height: "15.5rem", yPercent: 0 },
      btnClickVer2: { width: "16rem", height: "16rem", yPercent: 80 },
    };

    if (next) {
      // OPEN
      tl.to(overlayRef.current, {
        borderRadius: "10%",
        duration: 1.5,
        ease: "elastic.out(1, 1)",
        ...overlayProps[activeClick],
      });

      tl.call(
        () => {
          menuTextRef.current.animate();
          menuRefs.current.forEach((ref) => ref.animate());
        },
        null,
        "-=1.35"
      );
    } else {
      // CLOSE
      tl.call(() => {
        menuTextRef.current.animate2();
        menuRefs.current.forEach((ref) => ref.animate2());
      });

      tl.to(
        overlayRef.current,
        {
          borderRadius: "50%",
          width: "3.125rem",
          height: "3.125rem",
          yPercent: 0,
          duration: 1.6,
          ease: "elastic.out(1, 1)",
        },
        "+=0.45"
      );
    }

    setIsOpen(next);
  };

  return (
    <div ref={container} className="relative">
      <div ref={overlayRef} className="bg-warna2 rounded-xl p-3 relative">
        <div className="flex flex-row w-full h-full">
          <div className="flex flex-col w-full h-full">
            <div className="w-full h-full">
              <LinkText ref={menuTextRef} duration={0.5} text="Menu" className="text-warna1/65 text-xs uppercase" />
            </div>
            <div className="flex flex-col items-start justify-end w-full h-full gap-1">
              {menuItems.map((item, i) => (
                <LinkText key={i} ref={(el) => (menuRefs.current[i] = el)} duration={0.5} text={item.text} link={item.link} className="text-warna1 text-2xl uppercase font-normal" />
              ))}
            </div>
          </div>
        </div>
      </div>
      <button onClick={handleBtnClick} className="absolute bottom-3 right-3 cursor-pointer flex items-center justify-center h-6 w-6">
        <span ref={spanRef} className="absolute w-5 h-[2px] bg-warna1 mix-blend-difference"></span>
        <span ref={span2Ref} className="absolute w-5 h-[2px] bg-warna1 mix-blend-difference rotate-90"></span>
      </button>
    </div>
  );
});

export default ButtonTesting;
