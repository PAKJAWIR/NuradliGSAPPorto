import { useState, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LinkText from "../atoms/LinkText";

gsap.registerPlugin(ScrollTrigger);

function Faq() {
  const container = useRef(null);
  const textLeftRef = useRef(null);
  const textItemsRef = useRef([]);
  const Ref = useRef([]);
  const contentRef = useRef([]);
  const parIconsRef = useRef([]);

  const iconRef = useRef([]); // vertical line (yang turun jadi -)

  const items = [
    {
      title: "How much does a website cost?",
      desc: "Every site I make is 100% custom, so there’s no one-size-fits-all price tag. It really depends on what features you want, how complex the design is, and what the site needs to do. Once I get the full picture of your project, I’ll give you a quote that actually fits you — no random numbers, just real value.",
    },
    {
      title: "What kind of services do you offer?",
      desc: "I mainly focus on building clean, modern websites — from design to front-end development. I also create graphic designs for t-shirts, mockups, and digital posters, as well as UI/UX designs for apps and web interfaces. Basically, if it’s digital and needs a creative touch, I’m down for it.",
    },
    {
      title: "How long does a project usually take?",
      desc: "It really depends on the project’s size and complexity. A simple website might take a few weeks, while something bigger with animations and custom design could take a month or more. I always make sure the timeline feels realistic — quality > rush.",
    },
    {
      title: "Can you help me redesign my existing website?",
      desc: "Definitely. If you already have a website but it feels outdated or doesn’t reflect your brand anymore, I can help redesign it with a cleaner layout, smoother experience, and a modern touch.",
    },
    {
      title: "Do you work with clients worldwide?",
      desc: "Definitely. I collaborate remotely and make sure communication stays clear and structured, no matter the time zone.",
    },
    {
      title: "Can I bring my own design?",
      desc: "Yes. If you already have a design (Figma, etc.), I can focus purely on development and implementation with clean, scalable code.",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(null);

  const handleToggle = (index) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  useGSAP(
    () => {
      if (!container.current) return;

      const s = Ref.current.filter(Boolean);
      const textItems = textItemsRef.current.filter(Boolean);
      const contents = contentRef.current.filter(Boolean);

      // initial state accordion
      gsap.set(contents, {
        height: 0,
        overflow: "hidden",
      });

      // initial state icon (vertical line visible = +)
      gsap.set(iconRef.current, {
        transformOrigin: "center",
      });
      gsap.set(parIconsRef.current, {
        yPercent: 300,
      });

      // intro animation
      gsap.set(s, {
        scaleX: 0,
        transformOrigin: "left",
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: "center-=20% 95%",
        },
      });

      tl.call(() => {
        textLeftRef.current?.animate?.();
      })
        .to(s, {
          scaleX: 1,
          duration: 1.1,
          ease: "power3.out",
          stagger: 0.15,
        })
        .call(
          () => {
            textItems.forEach((el) => el?.animate?.());
          },
          null,
          ">-=0.85",
        )

        .to(
          parIconsRef.current,
          {
            yPercent: 0,
            duration: 1,
          },
          ">+=0.3",
        );
    },
    { scope: container },
  );

  // accordion + icon animation
  useGSAP(() => {
    contentRef.current.forEach((el, i) => {
      if (!el) return;

      if (i === activeIndex) {
        gsap.to(el, {
          height: "auto",
          duration: 1,
          ease: "power3.out",
        });

        // vertical line turun (hilang) jadi -
        gsap.to(iconRef.current[i], {
          duration: 0.8,
          rotate: 0,

          ease: "power2.out",
        });
      } else {
        gsap.to(el, {
          height: 0,
          duration: 1,
          ease: "power3.out",
        });

        // vertical line muncul lagi jadi +
        gsap.to(iconRef.current[i], {
          duration: 0.8,
          rotate: 90,
          opacity: 1,
          ease: "power2.out",
        });
      }
    });
  }, [activeIndex]);

  return (
    <div ref={container} className="bg-warna1 h-screen w-screen flex items-center justify-center px-3 md:px-8 lg:px-15 ">
      <div className="h-135 md:h-150 lg:h-135  w-full flex flex-col items-center justify-center gap-5 lg:flex-row  ">
        <div className=" h-15 md:h-full w-full flex items-start justify-start ">
          <LinkText ref={textLeftRef} duration={1.1} as="h1" className="text-2xl md:text-5xl font-bold w-full md:w-80 text-start uppercase" text="Frequently Asked Question" />
        </div>

        <div className=" h-100 md:h-full lg:h-full w-full md:w-150 lg:w-270  flex flex-col gap-1 justify-center lg:justify-start items-start ">
          {items.map((item, index) => (
            <div
              key={index}
              ref={(el) => {
                Ref.current[index] = el;
              }}
              className="w-full border-b pb-1"
            >
              <button type="button" className="cursor-pointer w-full h-10 md:h-14 flex items-center justify-between text-left overflow-hidden" onClick={() => handleToggle(index)}>
                <LinkText
                  as="span"
                  ref={(el) => {
                    textItemsRef.current[index] = el;
                  }}
                  duration={1.5}
                  className="font-semibold  text-sm md:text-xl "
                  text={item.title}
                />

                {/* ICON + / - */}
                <div
                  ref={(el) => {
                    parIconsRef.current[index] = el;
                  }}
                  className="relative w-6 h-6 flex items-center justify-center overflow-hidden"
                >
                  {/* horizontal line (selalu ada) */}
                  <span className="absolute w-4 h-[1.5px] bg-warna2" />

                  {/* vertical line (animasi turun jadi -) */}
                  <span
                    ref={(el) => {
                      iconRef.current[index] = el;
                    }}
                    className="absolute w-4 h-[1.5px] bg-warna2 rotate-90 "
                  />
                </div>
              </button>

              <div
                ref={(el) => {
                  contentRef.current[index] = el;
                }}
                className="md:pb-1"
              >
                <p className="font-normal text-xs md:text-sm text-justify">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Faq;
