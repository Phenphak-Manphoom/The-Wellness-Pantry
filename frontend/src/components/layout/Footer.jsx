import React from "react";

const Footer = () => {
  return (
    <footer className="flex flex-col items-center bg-[#527210] text-primary-content p-2 text-sm">
      <aside className="flex flex-col items-center">
        <a href="/">
          <img
            src="/images/logo5.png"
            alt="MyWebsite Logo"
            className="h-24 w-52 "
          />
        </a>
        <p className="text-center">
          Copyright © {new Date().getFullYear()} - All rights reserved
        </p>
      </aside>
    </footer>
  );
};

export default Footer;
