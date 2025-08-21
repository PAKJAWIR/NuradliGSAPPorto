import Marquee from "react-fast-marquee";
import { SiHtml5, SiCss3, SiJavascript, SiGit, SiTailwindcss, SiSass, SiBootstrap, SiReact, SiNodedotjs, SiFigma } from "react-icons/si";
function RunningTechStack() {
  const tech = ["HTML", "CSS", "JavaScript", "Git", "Tailwind", "Sass", "Bootstrap", "React", "Node.js", "Figma"];

  // Perbanyak item agar marquee mengisi penuh dan looping mulus
  const repeated = [...tech, ...tech];

  const renderItems = (items) =>
    items.map((name, idx) => (
      <div key={idx} className="uppercase font-normal hover:scale-110 cursor-pointer transition-all duration-100 text-3xl text-warna2 px-5 tracking-wide whitespace-nowrap">
        {name}
      </div>
    ));

  return (
    <div className="relative w-screen h-55 flex items-center justify-center bg-warna1 overflow-hidden">
      <div className="flex h-full w-full items-center justify-center">
        {/* Police Line 1 */}
        <div className="absolute w-[200%] rotate-[-6deg]">
          <Marquee speed={30} direction="left" pauseOnHover className="bg-warna1 py-2 border-y-2 border-warna2">
            <div className="flex gap-10">{renderItems(repeated)}</div>
          </Marquee>
        </div>

        {/* Police Line 2 */}
        <div className="absolute w-[200%] rotate-[6deg]">
          <Marquee speed={30} direction="right" pauseOnHover className="bg-warna1 py-2 border-y-2 border-warna2">
            <div className="flex gap-10">{renderItems(repeated)}</div>
          </Marquee>
        </div>
      </div>
    </div>
  );
}

export default RunningTechStack;
