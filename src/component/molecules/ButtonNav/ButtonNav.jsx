import { useRef, useState, forwardRef, useImperativeHandle } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LinkText from "../../atoms/LinkText";
import SpanHoverAnimations from "../../atoms/SpanHoverAnimations";

gsap.registerPlugin(ScrollTrigger);

const ButtonNav = forwardRef(({ onToggleOverlay }, ref) => {
  // --------------------------------------------------
  // Refs
  // --------------------------------------------------
  const container = useRef(null);
  const overlayWrapperRef = useRef(null);
  const overlayShapeRef = useRef(null);
  const menuRefs = useRef([]);
  const menuTextRef = useRef(null);
  const spanRef = useRef(null);

  // FIX: Gunakan useRef agar tidak memicu re-render saat user sedang scrolling!
  const activeClickType = useRef("btnClick");

  // --------------------------------------------------
  // State
  // --------------------------------------------------
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const menuItems = [
    { text: "Home", link: "/" },
    { text: "About", link: "/about" },
    { text: "Works", link: "/works" },
    { text: "Contact", link: "/contact" },
  ];

  // --------------------------------------------------
  // INITIAL GSAP SETUP
  // --------------------------------------------------
  useGSAP(
    () => {
      const trig = ScrollTrigger.create({
        trigger: container.current,
        start: "center-=200 top",
        end: "top-=50 top",
        // Mengubah .current ref tidak membebani main-thread sama sekali
        onEnter: () => (activeClickType.current = "btnClickVer2"),
        onLeaveBack: () => (activeClickType.current = "btnClick"),
      });

      gsap.set(overlayWrapperRef.current, {
        width: "2.8rem",
        height: "2.8rem",
        yPercent: 0,
        willChange: "width, height, transform",
      });

      gsap.set(overlayShapeRef.current, {
        borderRadius: "50%",
      });

      gsap.set(menuTextRef.current.element, { opacity: 0 });

      return () => trig.kill();
    },
    { scope: container },
  );

  // --------------------------------------------------
  // PROGRAMMATIC MOVE (Navbar)
  // --------------------------------------------------
  const animateMove = (direction) => {
    if (!isOpen) return;

    gsap.to(overlayWrapperRef.current, {
      yPercent: direction === "up" ? 80 : 0,
      duration: 3,
      ease: "elastic.out(1, 0.7)",
      overwrite: "auto",
      lazy: true,
    });
  };

  // --------------------------------------------------
  // BUTTON CLICK HANDLER
  // --------------------------------------------------
  const handleBtnClick = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    const next = !isOpen;
    onToggleOverlay(next);

    const tl = gsap.timeline({
      onComplete: () => setIsAnimating(false),
    });

    const overlayProps = {
      btnClick: { width: "14.5rem", height: "15.5rem", yPercent: 0 },
      btnClickVer2: { width: "16rem", height: "16rem", yPercent: 80 },
    };

    if (next) {
      tl.to(overlayWrapperRef.current, {
        duration: 1.6,
        ease: "elastic.out(1, 1)",
        overwrite: "auto",
        lazy: true,
        // Ambil nilai dari ref saat tombol diklik
        ...overlayProps[activeClickType.current],
      });

      tl.to(
        overlayShapeRef.current,
        {
          borderRadius: "10%",
          duration: 1.5,
          ease: "elastic.out(1, 1)",
          lazy: true,
        },
        0,
      );

      tl.call(
        () => {
          menuTextRef.current.animate();
          menuRefs.current.forEach((ref) => ref.animate());
        },
        null,
        "-=1.3",
      );
    } else {
      tl.call(() => {
        menuTextRef.current.animate2();
        menuRefs.current.forEach((ref) => ref.animate2());
      });

      tl.to(
        overlayWrapperRef.current,
        {
          width: "2.8rem",
          height: "2.8rem",
          yPercent: 0,
          duration: 1.6,
          ease: "elastic.out(1, 1)",
          overwrite: "auto",
          lazy: true,
        },
        "+=0.45",
      );

      tl.to(
        overlayShapeRef.current,
        {
          borderRadius: "50%",
          duration: 1.6,
          ease: "elastic.out(1, 1)",
          lazy: true,
        },
        "<",
      );
    }

    setIsOpen(next);
  };

  // --------------------------------------------------
  // CLOSE MENU FROM OUTSIDE
  // --------------------------------------------------
  const closeMenu = () => {
    if (!isOpen || isAnimating) return;

    setIsAnimating(true);
    setIsOpen(false);
    onToggleOverlay(false);

    const tl = gsap.timeline({
      onComplete: () => setIsAnimating(false),
    });

    tl.call(() => {
      menuTextRef.current.animate2();
      menuRefs.current.forEach((ref) => ref.animate2());
    });

    tl.to(
      overlayWrapperRef.current,
      {
        width: "2.8rem",
        height: "2.8rem",
        yPercent: 0,
        duration: 1.6,
        ease: "elastic.out(1, 1)",
        overwrite: "auto",
        lazy: true,
      },
      "+=0.45",
    );

    tl.to(
      overlayShapeRef.current,
      {
        borderRadius: "50%",
        duration: 1.6,
        ease: "elastic.out(1, 1)",
        lazy: true,
      },
      "<",
    );
    tl.call(() => {
      spanRef.current?.animateClose();
    });
  };

  useImperativeHandle(ref, () => ({ animateMove, isAnimating, closeMenu }));

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------
  return (
    <div ref={container} className="relative w-full h-full">
      <div className="relative flex items-end justify-end h-full w-full p-5">
        <div ref={overlayWrapperRef} className="absolute z-6">
          <div ref={overlayShapeRef} className="w-full h-full bg-warna2 shadow-sm shadow-warna2/30 overflow-hidden flex">
            <div className="flex flex-col gap-5 w-full h-full items-start justify-between p-5">
              <LinkText ref={menuTextRef} duration={0.8} text="Menu" className="text-warna1/65 text-xs uppercase" />

              <div className="flex flex-col gap-1">
                {menuItems.map((item, i) => (
                  <LinkText key={i} ref={(el) => (menuRefs.current[i] = el)} duration={0.8} text={item.text} link={item.link} className="text-warna1 text-xl uppercase font-normal" />
                ))}
              </div>
            </div>
          </div>
        </div>

        <SpanHoverAnimations ref={spanRef} className="absolute z-6 smooth-item flex items-center justify-center w-11 h-11" isClicked={isOpen} onClick={handleBtnClick} />
      </div>
    </div>
  );
});

export default ButtonNav;
