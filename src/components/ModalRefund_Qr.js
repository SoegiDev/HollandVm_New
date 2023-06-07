import React, { useState } from "react";
import qris__template from "../assets/img/template-qris.png";
import { useQrious } from "react-qrious";

const ModalRefundQr = (props) => {
  const { setRefundQr, contentQr } = props;
  const renderTime = (dimension, time) => {
    return (
      <div className="time-wrapper">
        <div className="time">{time}</div>
        <div>{dimension}</div>
      </div>
    );
  };
  const [value, setValue] = useState(contentQr);
  const [dataUrl, _qrious] = useQrious({ value });
  return (
    <>
      <div
        id="modal_overlay"
        className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm "
      >
        <div className="flex h-screen w-full justify-center  items-center translate-y-1/4">
          <div className="flex flex-col w-4/6 max-h-[960px]  ml-1 mr-1 text-center rounded-3xl bg-white overflow-hidden">
            <header className="py-5 bg-hollandtints-800 text-center ">
              <h3 className="text-white text-4xl font-serif m-2">
                Silahkan Scan QR Code di bawah ini dan Team Call Center kami
                akan melayani complain anda{" "}
              </h3>
            </header>
            <div className="flex w-full justify-center">
              <span className="flex w-full h-full items-center">
                <img
                  src={dataUrl}
                  alt="Landing Page"
                  className="h- w-80 content-center"
                />
              </span>
              <span className="h-20 w-80 rounded-xl justify-center bg-slate-900 border-4 border-white text-slate-50 ">
                <p className="text-3xl font-medium justify-center mt-2">
                  Scan QR Refund
                </p>
              </span>
            </div>
            <footer className="bg-white  text-center text-white bottom-0"></footer>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalRefundQr;
