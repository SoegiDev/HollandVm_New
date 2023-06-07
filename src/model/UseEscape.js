import React, { useEffect } from "react";

const useEscape = (onEscape) => {
  useEffect(() => {
    const handleEsc = (event) => {
      if (
        event.which === "61" ||
        event.which === "107" ||
        event.which === "173" ||
        event.which === "109" ||
        event.which === "172" ||
        event.which === "189"
      )
        onEscape();
    };
    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);
};

export default useEscape;
