import { useRef, useState } from "react";

function OpenImage() {
  const [isOpen, setIsOpen] = useState(false);


  const btnOnClick = () => {
    setIsOpen (prev => !prev)
  };

  return (
    <div className=" h-full w-full flex items-center justify-center">
      <div onClick={btnOnClick} className="w-50 h-50 z-2 bg-blue-300 border"></div>
          {isOpen && (
        <div className="h-full w-full bg-warna2 fixed z-1" />
      )}
    </div>
  );
}

export default OpenImage;
