import React from "react";
import FacebookIcon from "../assets/img/facebook.png";
import WebsiteIcon from "../assets/img/website.png";
import Instagramicon from "../assets/img/insta.png";
const Footer = () => {
  return (
    <div className="flex justify-between bottom-0">
      <div className="flex border-hollandtints-700 ml-4 mr-4 mt-2 mb-2 justify-start">
        <img src={Instagramicon} alt="" className="h-10 w-10" />
        <h3 className="text-xl font-medium mx-3 p-2 -ml-0">@hollandbakery</h3>
      </div>
      <div className="flex border-hollandtints-700 ml-4 mr-4 mt-2 mb-2">
        <img src={FacebookIcon} alt="" className="h-10 w-10" />
        <h3 className="text-xl font-medium mx-3 p-2 -ml-0">
          Holland Bakery Indonesia (Official)
        </h3>
      </div>
      <div className="flex border-hollandtints-700 ml-4 mr-4 mt-2 mb-2 justify-end">
        <img src={WebsiteIcon} alt="" className="h-10 w-10" />
        <h3 className="text-xl font-medium mx-3 p-2 -ml-0">
          www.hollandbakery.co.id
        </h3>
      </div>
    </div>
  );
};

export default Footer;
