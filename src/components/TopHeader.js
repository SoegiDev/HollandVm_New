import React, { useEffect, useState } from "react";
import VMINIT from "../services/init";
const Account = {
  data: {
    outlet: VMINIT.getName(),
  },
};

const TopHeader = () => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch("https://vm.hollandbakery.co.id", {
        mode: "no-cors",
      })
        .then(() => !isOnline && setIsOnline(true))
        .catch(() => isOnline && setIsOnline(false));
    }, 3000);

    return () => clearInterval(interval);
  }, [isOnline]);

  return (
    <div className="flex justify-end items-center mr-4 mt-4">
      <h3 className="text-base font-normal pr-1 md:text-3xl lg:text-4xl">
        {Account.data.outlet}
      </h3>
      <div className="pl-1 pr-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={`${isOnline ? "1.5" : "0.4"}`}
          stroke="currentColor"
          className="w-3 h-3 md:w-12 md:h-12"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z"
          />
        </svg>
      </div>
      <div
        className={`text-base font-normal pr-1 md:text-2xl lg:text-3xl text-green-400 ${
          !isOnline && "text-red-600 line-through"
        }`}
      >
        {isOnline ? "Online" : "Offline"}
      </div>
    </div>
  );
};

export default TopHeader;
