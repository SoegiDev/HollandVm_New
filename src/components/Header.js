import React from "react";
import Logo from "../assets/logo/logo_holland.png";
import Logo2 from "../assets/img/selforder.png";

const Header = () => {
  return (
    <div className="flex justify-center m-4">
      <div className="content-center">
        <img src={Logo} alt="" className="h-44 w-full" />
      </div>
      <div className="flex items-center">
        <img src={Logo2} alt="" className="h-28 w-full" />
      </div>
    </div>
  );
};

export default Header;
