import React, { useState } from "react";
import PaymentGateway from "../assets/img/payment-gateway.png";
import qris__template from "../assets/img/template-qris.png";
import { useQrious } from "react-qrious";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

const ModalPayment_Qr = (props) => {
  const {
    itemsTransaction,
    addTransaction,
    setToOpenConfirmation,
    setOpenQRPayment,
    setToOpenCart,
    contentQr,
    cancelTransation,
    statusQr,
  } = props;
  const minuteSeconds = 120;
  const hourSeconds = 3600;
  const daySeconds = 86400;
  const getTimeSeconds = (time) => (minuteSeconds - time) | 0;
  const getTimeMinutes = (time) => ((time % hourSeconds) / minuteSeconds) | 0;
  const getTimeHours = (time) => ((time % daySeconds) / hourSeconds) | 0;
  const getTimeDays = (time) => (time / daySeconds) | 0;

  const stratTime = Date.now() / 1000; // use UNIX timestamp in seconds
  const endTime = stratTime + 243248; // use UNIX timestamp in seconds

  const remainingTime = endTime - stratTime;
  const days = Math.ceil(remainingTime / daySeconds);
  const daysDuration = days * daySeconds;

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
  const handleQRModel = ({ status }) => {
    //setChoice(false);
    console.log("Close");
    cancelTransation(status);
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
              <h3 className="text-white text-4xl font-serif m-2">PEMBAYARAN</h3>
            </header>
            <div className="flex w-full justify-center">
              <img
                src={qris__template}
                alt="paymentGateWay"
                className="w-[90%] px-32 mb-6 items-center"
              />
            </div>
            <div className="flex justify-around max-[192px]">
              <div className="flex flex-col h-96">
                <span className="flex w-full h-full items-center">
                  <img
                    src={dataUrl}
                    alt="Landing Page"
                    className="h-96 w-96 content-center"
                  />
                </span>
                <span className="h-20 w-80 rounded-xl justify-center bg-slate-900 border-4 border-white text-slate-50 ">
                  <p className="text-3xl font-medium justify-center mt-2">
                    Scan QR
                  </p>
                </span>
              </div>
              <div className="flex flex-col h-96">
                <span className="flex w-full h-full items-center">
                  <CountdownCircleTimer
                    className="h-64 w-64 content-center"
                    isPlaying
                    colors="#ea7a66"
                    duration={minuteSeconds}
                    strokeWidth={23}
                    size={250}
                    onComplete={() => {
                      // do your stuff here
                      handleQRModel({
                        status: false,
                      });
                      console.log("TIMER SUDAH HABIS");
                    }}
                  >
                    {({ elapsedTime, color }) => (
                      <span className="text-3xl font-sans text-hollandtints-500">
                        {renderTime("Detik", getTimeSeconds(elapsedTime))}
                      </span>
                    )}
                  </CountdownCircleTimer>
                </span>
                <span className="h-20 w-64 rounded-full justify-center bg-gray-600 border-4 border-slate-400 text-slate-50 ">
                  <p
                    className="text-3xl font-medium content-center mt-2"
                    onClick={() =>
                      handleQRModel({
                        status: false,
                      })
                    }
                  >
                    Tutup
                  </p>
                </span>
              </div>
            </div>

            <footer className="bg-white  text-center text-white bottom-0">
              <div className="flex w-full justify-center">
                <img
                  src={PaymentGateway}
                  alt="paymentGateWay"
                  className="w-[90%] px-32 pb-8 pt-10"
                />
              </div>
            </footer>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalPayment_Qr;
