import Marquee from "react-fast-marquee";
import { SiHtml5, SiCss3, SiJavascript, SiGit, SiTailwindcss, SiSass, SiBootstrap, SiReact, SiNodedotjs, SiFigma } from "react-icons/si";

function TechStack() {
  const tech = [
    { icon: <SiHtml5 /> },
    { icon: <SiCss3 /> },
    { icon: <SiJavascript /> },
    { icon: <SiGit /> },
    { icon: <SiTailwindcss /> },
    { icon: <SiSass /> },
    { icon: <SiBootstrap /> },
    { icon: <SiReact /> },
    { icon: <SiNodedotjs /> },
    { icon: <SiFigma /> },
  ];

  const iconClass = "text-warna2 hover:scale-125 transition duration-300 text-xs lg:text-base";

  return (
    <div className="flex flex-col w-80  z-40 overflow-hidden">
      <Marquee speed={15} pauseOnHover direction="left" autoFill className="py-2">
        <div className="flex px-2 gap-5 items-center">
          {tech.map((item, idx) => (
            <span key={idx} className={iconClass}>
              {item.icon}
            </span>
          ))}
        </div>
      </Marquee>
    </div>
  );
}

export default TechStack;
