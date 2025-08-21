import Marquee from "react-fast-marquee";

function Footer() {
  return (
    <div className="flex h-full w-full bg-warna2 py-5">
      <div className="w-full mt-5">
        <Marquee gradient={false} speed={50} autoFill={true} className="flex w-full h-fit gap-10 text-warna1 overflow-hidden uppercase  font-medium text-6xl md:text-4xl">
          <span>Designed & Developed by NurAdli — © 2025 NurAdli</span>
        </Marquee>
      </div>
    </div>
  );
}

export default Footer;
