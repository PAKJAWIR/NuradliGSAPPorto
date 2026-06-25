import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";

function Footer() {
  return (
    <footer className=" h-[48vh] md:h-[40vh] lg:h-[56dvh] w-screen bg-warna2  p-4 md:p-6 py-6">
      <div className="flex flex-col-reverse lg:flex-row gap-4 justify-between h-full w-full items-end ">
        {/* Title */}
        <div className="flex flex-row justify-start gap-4 items-end  h-fit md:h-full w-full md:w-full lg:w-fit ">
          <h1 className="font-bold text-7xl md:text-8xl leading-10 md:leading-18 text-warna1">NURADLI</h1>
          <h2 className="font-bold text-xs md:text-sm text-warna1 uppercase w-34 hidden md:flex lg:hidden">All right reserved ©2026 </h2>
        </div>
        <div className="flex flex-col-reverse md:flex-row-reverse justify-between lg:flex-row h-full w-full ">
          {/* Copyright & Icons */}
          <div className="flex flex-row justify-between h-full w-full ">
            {/* Copyright */}
            <div className="flex md:hidden lg:flex h-full w-full items-center lg:items-end justify-start ">
              <h2 className="font-bold text-xs md:text-sm text-warna1 uppercase w-[58%] lg:w-34 md:hidden lg:flex">All right reserved ©2026 </h2>
            </div>
            {/* Icons */}
            <div className="flex flex-row h-full items-center md:items-start lg:items-end justify-end lg:justify-start w-full gap-4 md:gap-6 ">
              <FaGithub className="text-warna1 w-4 h-4 md:w-5 md:h-5" />
              <FaInstagram className="text-warna1 w-4 h-4 md:w-5 md:h-5" />
              <FaLinkedin className="text-warna1 w-4 h-4 md:w-5 md:h-5" />
            </div>
          </div>

          {/* Menu  */}
          <div className="flex flex-row h-full items-start justify-between lg:items-end md:justify-start lg:justify-end w-full gap-6 ">
            <div className="flex items-start md:items-start lg:items-end justify-start lg:justify-end h-full  w-full md:w-fit flex-col md:flex-row gap-6">
              <h3 className="text-warna1 text-sm uppercase font-bold">Home</h3>
              <h3 className="text-warna1 text-sm uppercase font-bold">About</h3>
            </div>
            <div className="flex items-end md:items-start lg:items-end justify-start lg:justify-end h-full w-full md:w-fit flex-col md:flex-row gap-6">
              <h3 className="text-warna1 text-sm uppercase font-bold">Works</h3>
              <h3 className="text-warna1 text-sm uppercase font-bold">Contact</h3>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
