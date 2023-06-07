import React from "react";
import loadingGif from "../../assets/img/loadingpng.png";

const Loading = () => {
  return (
    <div
      id="modal_overlay"
      className="fixed inset-0 bg-black bg-opacity-10 backdrop-blur-sm "
    >
      <div className="flex h-screen w-full justify-center items-center">
        <img
          src={loadingGif}
          className="h-96 w-96 items-center animate-spin"
          alt=""
        />
      </div>
    </div>
  );
};
export default Loading;
