import React, { useState } from "react";

const ModalStatus = (props) => {
  const {
    setModalStatus,
    typeModalStatus,
    descriptionStatus,
    actionStatus,
    titleStatus,
  } = props;
  console.log("TAMPIL MODAL STATUS");
  const handleClose = ({ status }) => {
    setModalStatus(status);
  };
  setTimeout(() => handleClose({ status: false }), 5000);
  return (
    <>
      <div
        id="modal_overlay"
        className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm "
      >
        <div className="flex h-screen w-full justify-center  items-center translate-y-1/4">
          <div className="flex flex-col w-1/2 max-h-[960px]  ml-1 mr-1 text-center rounded-2xl bg-white overflow-hidden">
            <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-hollandtints-100 animate-pulse m-8">
              {typeModalStatus === "SUCCESS" ? (
                <svg
                  className="h-6 w-6 text-hollandtints-800"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                >
                  <path
                    stroke="#000000"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 5L8 15l-5-4"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6 text-hollandtints-800"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                >
                  <path
                    stroke="#000000"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M13.253 5.98 12 13.5l-1.253-7.52a1.27 1.27 0 1 1 2.506 0Z"
                  />
                  <circle
                    cx="12"
                    cy="19"
                    r="1"
                    stroke="#000000"
                    strokeWidth="2"
                  />
                </svg>
              )}
            </div>
            <h3 className="text-2xl leading-6 font-medium text-gray-900">
              {titleStatus}
            </h3>
            <div className="mt-2 px-7 py-3">
              <p className="text-xl font-meidum text-gray-500">
                {descriptionStatus}
              </p>
            </div>
            <div className="items-center px-4 py-3">
              <button
                id="ok-btn"
                className="px-4 py-2 bg-hollandtints-800 text-white
                            text-base font-medium rounded-md w-full
                            shadow-sm hover:bg-hollandshades-900 focus:outline-none focus:ring-2 focus:ring-purple-300"
                onClick={() => handleClose({ status: false })}
              >
                {actionStatus}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default ModalStatus;
