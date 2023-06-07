import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { handelRightClick } from "./function/AppUtility";
import Vending from "./pages/Vending";
import { useEffect } from "react";
function App() {
  const handleKeypress = (e) => {
    console.log("keydown", e.keyCode);
    if (
      e.ctrlKey === true &&
      (e.which === "61" ||
        e.which === "107" ||
        e.which === "173" ||
        e.which === "109" ||
        e.which === "172" ||
        e.which === "189")
    ) {
      e.preventDefault();
    }
  };
  useEffect(() => {
    document.addEventListener("mousewheel DOMMouseScroll", handleKeypress);
    document.addEventListener("mousemove keypress", handleKeypress);
    return (
      () =>
        document.removeEventListener(
          "mousewheel DOMMouseScroll",
          handleKeypress
        ),
      document.removeEventListener("mousemove keypress", handleKeypress)
    );
  }, []);
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Vending />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
export default App;
