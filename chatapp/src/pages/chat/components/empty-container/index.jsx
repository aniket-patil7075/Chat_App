import React from "react";
import { TiMessages } from "react-icons/ti"; 

const EmptyChatContainer = () => {
  return (
    <div className="flex-1 md:bg-[#1c1d25] md:flex flex-col justify-center items-center hidden duration-1000 transition-all relative overflow-hidden">
      
      <div className="absolute top-[48%] left-[50%] transform -translate-x-1/2 -translate-y-full z-10">
        <TiMessages 
          className="text-[#6ea8f8] text-6xl animate-bounce"
        />
      </div>

      {/* Text Section */}
      <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-10 lg:text-4xl text-3xl transition-all duration-300 text-center z-10 relative">
        <h3 className="poppins-medium">
          Hi <span className="text-[#6ea8f8]">!</span> Welcome to{" "}
          <span className="text-[#6ea8f8]">ChatVerse</span> Chat App{" "}
          <span className="text-[#6ea8f8]">.</span>
        </h3>
      </div>
    </div>
  );
};

export default EmptyChatContainer;
