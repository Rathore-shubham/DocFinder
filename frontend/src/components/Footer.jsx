import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div className="md:mx-10">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        <div>
          <div className="flex flex-col mb-4 md:flex-row md:items-center md:justify-start">
            <h2 className="text-[28px] sm:text-[32px] md:text-[36px] lg:text-[40px] mb-2 md:mb-0">
              Doc
            </h2>
            <span className="text-gray-500 text-[28px] sm:text-[32px] md:text-[36px] lg:text-[40px] font-semibold ml-0 md:ml-2">
              Finder
            </span>
          </div>
          <p className="w-full md:w-2/3 text-white leading-6">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic vel
            error minus illum, inventore, repudiandae amet quae ut cupiditate,
            odio totam? Blanditiis, quo facilis aspernatur amet officia maiores
            deleniti nam.
          </p>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-2 text-white">
            <li>Home</li>
            <li>About Us</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-2 text-white">
            <li>+91 9302936188</li>
            <li>DocFinder@gmail.com</li>
          </ul>
        </div>
      </div>

      <div>
        <hr />
        <p className="py-5 text-sm text-center">
          Copyright 2024 @ DocFinder - All Rights Reserved
        </p>
      </div>
    </div>
  );
};

export default Footer;
