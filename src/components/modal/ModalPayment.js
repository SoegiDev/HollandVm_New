import React, { useState } from "react";
import PaymentGateway from "../../assets/img/payment-gateway.png";
import qris__template from "../../assets/img/template-qris.png";
import { QRious, useQrious } from "react-qrious";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import loading from "../../assets/img/loadingpng.png";
import { useRef } from "react";
import { useEffect } from "react";

const ModalPayment = (props) => {
  const {
    itemsTransaction,
    cancelTransaction,
    setOpenModalPayment,
    checkPayment,
    contentPaymnetQR,
  } = props;
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
  const [value, setValue] = useState(null);

  const [dataUrl, _qrious] = useQrious({ value });
  const [isLoading, setLoading] = useState(true);
  const [ishabis, setHabis] = useState(false);
  useEffect(() => {
    if (contentPaymnetQR !== null) {
      setLoading(false);
      setValue(contentPaymnetQR);
    }
  }, [contentPaymnetQR]);
  console.log("BARCODE ", dataUrl, value);
  const handleQRModel = ({ status }) => {
    //setChoice(false);
    cancelTransaction();
  };
  const CheckPembayaran = () => {
    //setChoice(false);
    checkPayment();
  };
  const HabisWaktu = () => {
    //setChoice(false);
    setHabis(true);
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
                className="w-[90%] px-32 mb-2 items-center"
              />
            </div>
            {ishabis ? (
              <div>
                <div className="flex flex-col w-full">
                  <p className="text-3xl font-medium items-center text-slate-800 mt-2">
                    Apakah anda sudah melakukan Pembayaran tapi Produk tidak
                    keluar? Klik Tombol di atas ini
                  </p>
                  <span className="h-20 w-64 rounded-full justify-center bg-gray-600 border-4 border-slate-400 text-slate-50 ">
                    <p
                      className="text-3xl font-medium content-center mt-2"
                      onClick={() => {
                        CheckPembayaran();
                      }}
                    >
                      Check Payment
                    </p>
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex justify-around max-[192px]">
                <div className="flex flex-col h-96">
                  <span className="flex w-full h-full items-center">
                    {isLoading ? (
                      <span className="flex w-full h-full justify-center">
                        <img
                          src={loading}
                          alt="Landing Page"
                          className="h-40 w-40 mt-8 items-center animate-spin"
                        />
                      </span>
                    ) : (
                      <QRious
                        value={value}
                        className="h-96 w-96 mt-8 items-center"
                      />
                    )}
                  </span>
                  <span className="hidden h-20 w-80 rounded-xl justify-center bg-slate-900 border-4 border-white text-slate-50 ">
                    <p className="text-3xl font-medium justify-center mt-2">
                      Scan QR
                    </p>
                  </span>
                </div>
                <div className="flex flex-col h-96">
                  <span className="flex w-full h-full items-center">
                    <CountdownCircleTimer
                      className="h-64 w-64 content-center"
                      isPlaying={!isLoading ? true : false}
                      colors="#ea7a66"
                      duration={minuteSeconds}
                      strokeWidth={23}
                      size={250}
                      onComplete={() => {
                        console.log("TIMER SUDAH HABIS");
                        HabisWaktu();
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
            )}

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

export default ModalPayment;
