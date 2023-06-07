import React, { useState } from "react";
import PaymentGateway from "../../assets/img/payment-gateway.png";
import qris__template from "../../assets/img/template-qris.png";
import { useQrious } from "react-qrious";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import loading from "../../assets/img/loadingpng.png";
import { useRef } from "react";

const ModalRefund = (props) => {
  const { tutupRefund, contentPaymnetQR } = props;
  const minuteSeconds = 120;
  const getTimeSeconds = (time) => (minuteSeconds - time) | 0;

  const renderTime = (dimension, time) => {
    return (
      <div className="time-wrapper">
        <div className="time">{time}</div>
        <div>{dimension}</div>
      </div>
    );
  };
  const [value, setValue] = useState(contentPaymnetQR);
  const [dataUrl, _qrious] = useQrious({ value });
  const [rundown, setStartRundown] = useState(false);
  const [openCheck, setOpenCheck] = useState(false);
  const timer = useRef(null);
  timer.current = setTimeout(() => {
    clearTimeout(timer.current);
    setStartRundown(true);
    timer.current = setTimeout(() => {
      clearTimeout(timer.current);
      setOpenCheck(true);
    }, 4000);
  }, 3000);
  const handleRefund = (props) => {
    //setChoice(false);
    console.log("Close");
    tutupRefund(props);
  };
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
                Pengajuan Refund
              </h3>
            </header>
            <div className="flex w-full justify-center">
              <h3 className="text-black mt-4 text-4xl font-serif m-2">
                Silahkan Scan QR Code di bawah ini dan Team Call Center kami
                akan melayani complain anda
              </h3>
            </div>
            <div className="flex justify-around max-[192px]">
              <div className="flex flex-col h-96">
                <span className="flex w-full h-full items-center">
                  {rundown ? (
                    <img
                      src={dataUrl}
                      alt="Landing Page"
                      className="h-96 w-96 content-center"
                    />
                  ) : (
                    <span className="flex w-full h-full justify-center">
                      <img
                        src={loading}
                        alt="Landing Page"
                        className="h-40 w-40 mt-8 items-center animate-spin"
                      />
                    </span>
                  )}
                </span>
                <span className="h-20 w-80 rounded-xl justify-center bg-slate-900 border-4 border-white text-slate-50 ">
                  <p className="text-3xl font-medium justify-center mt-2">
                    Scan QR
                  </p>
                </span>
              </div>
            </div>

            <footer className="bg-white  text-center text-white bottom-4">
              <div className="flex flex-col w-full">
                <div className="flex flex-col w-full items-center p-2">
                  <button
                    className="text-3xl font-sans items-center rounded-3xl bg-slate-600 w-44 h-20  content-center"
                    onClick={() =>
                      handleRefund({
                        status: false,
                      })
                    }
                  >
                    <p className="p-3">Tutup</p>
                  </button>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalRefund;
