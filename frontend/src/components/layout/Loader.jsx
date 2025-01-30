import React from "react";

const Loader = () => {
  return (
    <div class="flex items-center justify-center min-h-screen">
      <div class="relative">
        <div class="relative w-32 h-32">
          <div class="absolute w-full h-full rounded-full border-[3px] border-gray-100/10 border-r-[#0ff] border-b-[#0ff] animate-spin duration-[3s]"></div>

          <div class="absolute w-full h-full rounded-full border-[3px] border-gray-100/10 border-t-[#0ff] animate-spin duration-[2s] animate-reverse"></div>
        </div>

        <div class="absolute inset-0 bg-gradient-to-tr from-[#0ff]/10 via-transparent to-[#0ff]/5 animate-pulse rounded-full blur-sm"></div>
      </div>
    </div>
  );
};

export default Loader;
