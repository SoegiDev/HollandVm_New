import React, { useState } from "react";
import { Tooltip } from "react-tooltip";
import loadingGif from "../assets/img/loading.gif";
const numberFormat = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);

var permTimeout1 = "";
const Modal = (props) => {
  const [openPayment, setOpenPayment] = useState(false);

  const {
    itemsTransaction,
    addTransaction,
    setToOpenConfirmation,
    setPaymentQR,
    setToOpenCart,
    subTotal,
  } = props;
  const handleModal = (status) => {
    setToOpenCart(status);
  };

  const handleModalBeli = () => {
    setOpenPayment(true);
    permTimeout1 = setTimeout(() => TutupLoading(), 5000);
  };
  const TutupLoading = () => {
    clearTimeout(permTimeout1);
    setPaymentQR();
    setTimeout(() => setOpenPayment(false), 1000);
  };
  const handleModalConfirm = ({ Data, module, message, status, deleted }) => {
    setToOpenConfirmation({ Data, module, message, status, deleted });
  };
  const handleRemoveAll = (Data, status) => {
    handleModalConfirm({
      Data: Data,
      module: "remove-all",
      message: "Anda ingin membatalkan Transaksi",
      status: status,
      deleted: false,
    });
  };

  return (
    <div
      id="modal_overlay"
      className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm "
    >
      <div className="flex h-screen w-full justify-center items-center">
        <div className="flex flex-col w-4/6 max-h-[960px]  ml-1 mr-1 text-center rounded-2xl bg-white overflow-hidden shadow-lg shadow-yellow-700">
          <header className="py-5 bg-hollandtints-800 text-center ">
            <h3 className="text-white text-4xl font-serif ">
              KERANJANG BELANJA
            </h3>
          </header>

          <div className="flex-1 no-scrollbar overflow-y-auto">
            <ul>
              {itemsTransaction.map((item, index) => (
                <MyItems
                  key={index}
                  Data={item}
                  handleModalConfirm={handleModalConfirm}
                  addTransaction={addTransaction}
                />
              ))}
            </ul>
          </div>
          <div className="flex bg-hollandtints-800 mt-4 mb-4">
            <hr className="w-full border-y-2"></hr>
          </div>
          <footer className="bg-white  text-center text-white mt-6 mb-6">
            <div className="flex w-full justify-between">
              <div className="flex justify-items-start m-4">
                <div className="flex flex-col items-center mt-12">
                  <button className="w-full ml-4 mr-4 mt-2 mb-4 bg-hollandtints-800 text-white transition duration-500 rounded-2xl hover:opacity-80 hover:shadow-lg">
                    <span
                      className="flex justify-center p-2"
                      onClick={() => {
                        if (!openPayment) {
                          handleRemoveAll(itemsTransaction, true);
                        }
                      }}
                    >
                      <h3 className="text-2xl font-medium items-center">
                        Kosongkan Keranjang
                      </h3>
                    </span>
                  </button>
                  <button
                    className="w-full ml-4 mr-4 mt-2 mb-4 bg-slate-100 border-2 border-slate-400 text-black transition duration-500 rounded-2xl hover:opacity-80 hover:shadow-lg"
                    onClick={() => {
                      if (!openPayment) {
                        handleModal(false);
                      }
                    }}
                  >
                    <span className="flex justify-center p-2">
                      <h3 className="text-2xl font-medium items-center">
                        Tutup
                      </h3>
                    </span>
                  </button>
                </div>
              </div>
              <div className="flex justify-items-end m-4">
                <div className="flex flex-col items-center">
                  <div className="w-full ml-4 mr-4">
                    <span className="flex justify-end p-2">
                      <h3 className="text-3xl font-medium items-end text-black">
                        TOTAL BELANJA
                      </h3>
                    </span>
                  </div>
                  <div className="w-full ml-4 mr-4 mt-2 mb-4">
                    <span className="flex justify-end p-1">
                      <h3 className="text-3xl font-bold items-end mr-2 text-hollandtints-800">
                        {numberFormat(subTotal)}
                      </h3>
                    </span>
                    <span className="flex justify-end">
                      <hr className="border-y bg-hollandtints-800 w-2/3 mr-2"></hr>
                    </span>
                  </div>
                  {openPayment ? (
                    <button className="w-64 ml-4 mr-2 mt-2 mb-4 text-white border-2 border-slate-500 transition duration-500 rounded-2xl ">
                      <span className="flex justify-center p-2">
                        <svg
                          className="animate-spin h-8 w-8 text-hollandtints-800"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12 1V5"
                            stroke="#1C1C1C"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                          />
                          <path
                            d="M19.4246 18.9246L16.5961 16.0962"
                            stroke="#e4543a"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                          />
                          <path
                            d="M22.5 11.5L18.5 11.5"
                            stroke="#e4543a"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                          />
                          <path
                            d="M12 18V22"
                            stroke="#e4543a"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                          />
                          <path
                            d="M7.40381 6.90381L4.57538 4.07538"
                            stroke="#e4543a"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                          />
                          <path
                            d="M5.5 11.5L1.5 11.5"
                            stroke="#e4543a"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                          />
                          <path
                            d="M7.40381 16.0962L4.57538 18.9246"
                            stroke="#e4543a"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                          />
                        </svg>
                        <p className="text-xl font-serif text-hollandtints-800">
                          Processing...
                        </p>
                      </span>
                    </button>
                  ) : (
                    <button
                      className={`w-64 ml-4 mr-2 mt-2 mb-4 bg-hollandtints-800 text-white transition duration-500 rounded-2xl ${
                        subTotal === 0 && "hidden"
                      }`}
                      onClick={() => handleModalBeli()}
                    >
                      <span className="flex justify-center p-2">
                        <h3 className="text-3xl font-serif items-center">
                          Beli
                        </h3>
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

const MyItems = ({ Data, handleModalConfirm, addTransaction }) => {
  const [isFlagStock, setisFlagStock] = useState(true);
  const handleRemoveItem = (item, status) => {
    handleModalConfirm({
      Data: item,
      module: "remove-item",
      message: "Anda ingin menghapus Product ",
      status: status,
      deleted: false,
    });
  };
  const ClickMinus = (Menu) => {
    if (Menu.qty === 0) {
      setisFlagStock(true);
    } else {
      setisFlagStock(true);
      addTransaction(Menu, false);
    }
  };
  const ClickPlus = (Menu) => {
    if (Menu.onhand <= Menu.qty) {
      setisFlagStock(!isFlagStock);
    } else {
      setisFlagStock(true);
      addTransaction(Menu, true);
    }
  };
  return (
    <li className="mb-2">
      <div className="flex h-max[192px] w-full">
        <div className="flex w-1/4 h-44 justify-center m-2">
          <span className="flex w-32 items-center">
            <img
              src={Data.image}
              alt="Landing Page"
              className="h-32 w-full border content-center rounded-3xl shadow-lg"
            />
          </span>
        </div>
        <div className="flex flex-col w-full mt-4 mr-4">
          <div className="flex ml-2 mb-2">
            <p className="truncate text-3xl font-bold w-96 text-left">
              {Data.name_produk}
            </p>
          </div>
          <div className="flex ml-2 mt-4">
            <p
              className={`text-2xl font-sans mt-5 pl-2 ${
                Data.harga_jual < Data.harga_promo &&
                "line-through text-hollandtints-900"
              }`}
            >
              {Data.disc > 0 ? numberFormat(Data.harga_promo) : ""}
            </p>
          </div>
          <div className="flex ml-2">
            <p className="text-3xl font-bold pl-2 text-hollandtints-900">
              {Data.status_promo === "1"
                ? numberFormat(Data.harga_promo)
                : numberFormat(Data.harga_jual)}
            </p>
          </div>
          <div className="relative flex ml-2 mt-4 justify-between">
            <div className="flex items-start">
              <p className="text-2xl font-sans pl-2 text-hollandtints-900 align-bottom">
                Sisa {Data.onhand - Data.qty}
              </p>
            </div>
            <div className="flex items-end">
              <div
                className="mr-4"
                onClick={() => handleRemoveItem(Data, true)}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    <g id="Interface / Trash_Full">
                      <path
                        id="Vector"
                        d="M14 10V17M10 10V17M6 6V17.8C6 18.9201 6 19.4798 6.21799 19.9076C6.40973 20.2839 6.71547 20.5905 7.0918 20.7822C7.5192 21 8.07899 21 9.19691 21H14.8031C15.921 21 16.48 21 16.9074 20.7822C17.2837 20.5905 17.5905 20.2839 17.7822 19.9076C18 19.4802 18 18.921 18 17.8031V6M6 6H8M6 6H4M8 6H16M8 6C8 5.06812 8 4.60241 8.15224 4.23486C8.35523 3.74481 8.74432 3.35523 9.23438 3.15224C9.60192 3 10.0681 3 11 3H13C13.9319 3 14.3978 3 14.7654 3.15224C15.2554 3.35523 15.6447 3.74481 15.8477 4.23486C15.9999 4.6024 16 5.06812 16 6M16 6H18M18 6H20"
                        stroke="#e4543a"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </g>
                  </g>
                </svg>
              </div>
              <div className="ml-4 mr-4" onClick={() => ClickMinus(Data)}>
                <svg
                  viewBox="0 -0.5 21 21"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#e4543a"
                  stroke="#e4543a"
                  className="h10 w-10"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    <title>minus_circle [#e4543a]</title>
                    <desc>Created with Sketch.</desc> <defs> </defs>
                    <g
                      id="Page-1"
                      stroke="none"
                      strokeWidth="1"
                      fill="none"
                      fillRule="evenodd"
                    >
                      <g
                        id="Dribbble-Light-Preview"
                        transform="translate(-379.000000, -520.000000)"
                        fill="#e4543a"
                      >
                        <g
                          id="icons"
                          transform="translate(56.000000, 160.000000)"
                        >
                          <path
                            d="M329.3,371 L337.7,371 L337.7,369 L329.3,369 L329.3,371 Z M333.5,378 C328.8674,378 325.1,374.411 325.1,370 C325.1,365.588 328.8674,362 333.5,362 C338.13155,362 341.9,365.588 341.9,370 C341.9,374.411 338.13155,378 333.5,378 L333.5,378 Z M333.5,360 C327.70085,360 323,364.477 323,370 C323,375.523 327.70085,380 333.5,380 C339.2981,380 344,375.523 344,370 C344,364.477 339.2981,360 333.5,360 L333.5,360 Z"
                            id="minus_circle-[#e4543a]"
                          ></path>
                        </g>
                      </g>
                    </g>
                  </g>
                </svg>
              </div>
              <div className="">
                <input
                  id={Data.id}
                  type="text"
                  value={Data.qty}
                  disabled
                  className="mt-1 block w-20 px-3 py-2 font-bold bg-white border border-slate-300 rounded-md text-lg shadow-sm placeholder-slate-400 text-center"
                />
              </div>
              <div
                className="ml-4 mr-4"
                onClick={() => ClickPlus(Data)}
                data-tooltip-id={`tooltip${Data.id}`}
                data-tooltip-content="Stock tidak mencukupi"
                data-tooltip-delay-hide={1000}
              >
                <svg
                  viewBox="0 -0.5 21 21"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#000000"
                  className="h-10 w-10"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    <title>plus_circle [#e4543a]</title>
                    <desc>Created with Sketch.</desc> <defs> </defs>
                    <g
                      id="Page-1"
                      stroke="none"
                      strokeWidth="1"
                      fill="none"
                      fillRule="evenodd"
                    >
                      <g
                        id="Dribbble-Light-Preview"
                        transform="translate(-419.000000, -520.000000)"
                        fill="#e4543a"
                      >
                        <g
                          id="icons"
                          transform="translate(56.000000, 160.000000)"
                        >
                          <path
                            d="M374.55,369 L377.7,369 L377.7,371 L374.55,371 L374.55,374 L372.45,374 L372.45,371 L369.3,371 L369.3,369 L372.45,369 L372.45,366 L374.55,366 L374.55,369 Z M373.5,378 C368.86845,378 365.1,374.411 365.1,370 C365.1,365.589 368.86845,362 373.5,362 C378.13155,362 381.9,365.589 381.9,370 C381.9,374.411 378.13155,378 373.5,378 L373.5,378 Z M373.5,360 C367.70085,360 363,364.477 363,370 C363,375.523 367.70085,380 373.5,380 C379.29915,380 384,375.523 384,370 C384,364.477 379.29915,360 373.5,360 L373.5,360 Z"
                            id="plus_circle-[#e4543a]"
                          ></path>
                        </g>
                      </g>
                    </g>
                  </g>
                </svg>
              </div>
              <Tooltip
                id={`tooltip${Data.id}`}
                events={["click"]}
                isOpen={!isFlagStock}
                style={{
                  backgroundColor: "#e4543a",
                  color: "#F9F5F6",
                }}
                className="text-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};
export default Modal;
