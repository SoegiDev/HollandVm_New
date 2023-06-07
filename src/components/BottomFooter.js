import React, { useEffect, useState } from "react";

const BottomFooter = () => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch("https://www.google.com/", {
        mode: "no-cors",
      })
        .then(() => !isOnline && setIsOnline(true))
        .catch(() => isOnline && setIsOnline(false));
    }, 5000);

    return () => clearInterval(interval);
  }, [isOnline]);
  return (
    <div className="200 w-screen">
      <div className="flex w-full">
        <div className="flex flex-grow items-center justify-between shadow-md">
          <div className="flex items-center "></div>
          <div className="flex items-center "></div>
          <div className="flex items-center pl-2 pr-2 m-1">
            <div className="block">Content Right</div>
            <div className="block ml-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={`${isOnline ? "1.5" : "0.4"}`}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z"
                />
              </svg>
            </div>
            <div className="flex items-center pl-1 m-1 text-green-400 font-bold">
              <div
                className={`block ${!isOnline && "text-red-600 line-through"}`}
              >
                {isOnline ? "Online" : "Offline"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomFooter;
