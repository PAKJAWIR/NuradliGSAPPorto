import { useState, useEffect, useRef } from "react";
import { FiArrowRight } from "react-icons/fi";
import gsap from "gsap";
import SplitType from "split-type";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

function ContactMe() {
  const container = useRef(null);

  // Animated text refs
  const refs = {
    chatTitleRef: useRef(null),
    chatDescRef: useRef(null),
    sayHelloRef: useRef(null),
    addressTitleRef: useRef(null),
    addressLine1Ref: useRef(null),
    addressLine2Ref: useRef(null),
    contactTitleRef: useRef(null),
    waRef: useRef(null),
    emailRef: useRef(null),
    socialTitleRef: useRef(null),
    igRef: useRef(null),
    linkedinRef: useRef(null),
    githubRef: useRef(null),
  };

  // Map refs for overlay animation
  const mapRefs = {
    mapMediumRef: useRef(null),
    mapMobileRef: useRef(null),
    mapDesktopRef: useRef(null),
  };

  useGSAP(
    () => {
      // SplitType animations for text
      Object.values(refs).forEach((ref) => {
        if (!ref.current) return;
        const split = new SplitType(ref.current, {
          types: "lines",
          tagName: "span",
        });

        gsap.from(split.lines, {
          y: "300%",
          duration: 2,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: container.current,
            start: "center bottom",
            end: "center center",
          },
        });
      });

      // Overlay animations for maps
      Object.values(mapRefs).forEach((mapRef) => {
        if (!mapRef.current) return;
        const overlay = mapRef.current.querySelector(".map-overlay");
        if (!overlay) return;

        gsap.fromTo(
          overlay,
          { scaleY: 1, transformOrigin: "top" },
          {
            scaleY: 0,
            duration: 1.5,
            ease: "power3.out",
            scrollTrigger: {
              trigger: container.current,
              start: "top center+=200",
            },
          }
        );
      });
    },
    { scope: container }
  );

  // Time Zone clock
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatted = time.toLocaleTimeString("en-US", {
    timeZone: "Asia/Jakarta",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  // Tailwind Class Vars
  const sectionTitle = "font-medium text-xl md:text-2xl mb-2 text-warna2 overflow-hidden";
  const textSmall = "text-xs text-warna2 overflow-hidden";
  const linkSmall = "text-xs text-warna2 overflow-hidden w-fit";
  const flexCenter = "w-full h-full items-center justify-center rounded-2xl relative overflow-hidden";

  const gMapsSrc =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d414489.7111747198!2d106.47478420369916!3d-6.555576559128116!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69c3e312798437%3A0x301576d14feb990!2sKabupaten%20Bogor%2C%20Jawa%20Barat!5e0!3m2!1sid!2sid!4v1755174896158!5m2!1sid!2sid";

  return (
    <div ref={container} className="flex flex-col w-full h-full md:flex-row px-5 md:px-10 py-8">
      {/* Left Section */}
      <div className="flex flex-col justify-start w-full md:w-full gap-10 lg:gap-10">
        {/* Top: Let's have a chat */}
        <div className="flex flex-col gap-5 text-justify">
          <h1 ref={refs.chatTitleRef} className="font-medium text-3xl md:text-4xl text-warna2 overflow-hidden">
            Let’s have a chat
          </h1>
          <p ref={refs.chatDescRef} className={`${textSmall} leading-relaxed max-w-lg`}>
            Don’t be afraid to say hello — I don’t bite! Whether it’s a question, a project idea, or just a friendly chat, feel free to reach out. I’m always open to collaborations and new opportunities.
          </p>
          <a ref={refs.sayHelloRef} href="mailto:muhammadnuradlialghifari@gmail.com" className="flex gap-2 w-fit items-center text-sm font-medium text-warna2 hover:gap-3 transition-all duration-200 overflow-hidden">
            Say hello to me <FiArrowRight />
          </a>
        </div>

        {/* Maps Medium Only */}
        <div ref={mapRefs.mapMediumRef} className="lg:hidden md:flex hidden w-full h-50 justify-center items-center relative">
          <iframe className={flexCenter} src={gMapsSrc} loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
          <div className="map-overlay absolute inset-0 bg-warna1"></div>
        </div>

        {/* Bottom: Address, Contact, Social */}
        <div className="flex flex-col sm:flex-row gap-5 md:gap-10 max-w-xl">
          {/* Maps Mobile Only */}
          <div ref={mapRefs.mapMobileRef} className="md:hidden flex w-full h-50 justify-center items-center relative">
            <iframe className={flexCenter} src={gMapsSrc} loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
            <div className="map-overlay absolute inset-0 bg-warna1"></div>
          </div>

          {/* Address */}
          <div className="flex flex-col gap-1 md:gap-3 text-justify flex-1">
            <h2 ref={refs.addressTitleRef} className={sectionTitle}>
              Address
            </h2>
            <div className="flex gap-1 flex-col break-all">
              <p ref={refs.addressLine1Ref} className={textSmall}>
                Bogor Regency, West Java, Indonesia
              </p>
              <p ref={refs.addressLine2Ref} className={textSmall}>
                {formatted} GMT+7
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-1 md:gap-3 text-justify flex-1">
            <h2 ref={refs.contactTitleRef} className={sectionTitle}>
              Contact
            </h2>
            <div className="flex gap-1 flex-col break-all">
              <a ref={refs.waRef} href="https://wa.me/6282111776599?text=Hello!%20How%20are%20you%3F" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-700 overflow-hidden">
                +62 821-1177-6599
              </a>
              <a ref={refs.emailRef} href="mailto:muhammadnuradlialghifari@gmail.com" className={linkSmall}>
                muhammadnuradlialghifari@gmail.com
              </a>
            </div>
          </div>

          {/* Social */}
          <div className="flex flex-col gap-1 md:gap-3 text-justify flex-1">
            <h2 ref={refs.socialTitleRef} className={sectionTitle}>
              Social
            </h2>
            <div className="flex flex-col gap-1">
              <a ref={refs.igRef} href="https://instagram.com/na_athenaa" target="_blank" rel="noopener noreferrer" className={linkSmall}>
                Instagram
              </a>
              <a ref={refs.linkedinRef} href="https://linkedin.com/in/m-nur-adli-al-ghifari-97106230a/" target="_blank" rel="noopener noreferrer" className={linkSmall}>
                LinkedIn
              </a>
              <a ref={refs.githubRef} href="https://github.com/PAKJAWIR" target="_blank" rel="noopener noreferrer" className={linkSmall}>
                Github
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section Desktop Only */}
      <div ref={mapRefs.mapDesktopRef} className="hidden md:hidden lg:flex w-full h-80 justify-center items-center relative">
        <iframe className={flexCenter} src={gMapsSrc} loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
        <div className="map-overlay absolute inset-0 bg-warna1"></div>
      </div>
    </div>
  );
}

export default ContactMe;
