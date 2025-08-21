import { useState, useEffect, useRef } from "react";

function MainTextScrollTrigger() {
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

  return (
    <div className="flex gap-25 flex-col w-screen h-fit bg-warna1 py-2 px-10">
      <div className="flex w-full h-fit ">
        {/* Left Section */}
        <div className="flex flex-col w-full h-fit gap-5">
          <p className="text-xs max-w-sm">Outside of the serious-looking face, I’m actually super chill. I enjoy keeping things fun, embracing creativity, and turning simple concepts into designs that speak louder than complexity.</p>
          <div className="flex flex-row gap-5">
            <p className="text-xs">{formatted}</p>
            <p className="text-xs">West Java, Indonesia</p>
          </div>
        </div>
        {/* Right Section */}
        <div className=" flex w-full h-fit  items-end justify-end">
          <h1 className="text-4xl font-medium text-end max-w-md">The simpler things are, the happier you are.</h1>
        </div>
      </div>
    </div>
  );
}

export default MainTextScrollTrigger;
