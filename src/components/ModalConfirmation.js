import React from "react";
const ModalConfirmation = (props) => {
  const handleModalConfirm = ({ deleted, status }) => {
    props.dataConfirmation.deleted = deleted;
    props.dataConfirmation.status = status;
    props.setToOpenConfirmation(props.dataConfirmation);
  };
  return (
    <>
      <div
        id="modal_overlay"
        className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm "
      >
        <div className="flex h-screen w-full justify-center  items-center">
          <span className="absolute flex justify-end translate-x-[22rem] -translate-y-[10rem] overflow-visible">
            <svg
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              stroke="#ffffff"
              className="h-20 w-20 content-end fill-hollandtints-800"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <g clipPath="url(#clip0_429_11160)">
                  <circle
                    cx="12"
                    cy="11.9999"
                    r="9"
                    stroke="#ffffff"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></circle>
                  <rect
                    x="12"
                    y="8"
                    width="0.01"
                    height="0.01"
                    stroke="#ffffff"
                    strokeWidth="3.75"
                    strokeLinejoin="round"
                  ></rect>
                  <path
                    d="M12 12V16"
                    stroke="#ffffff"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </g>
                <defs>
                  <clipPath id="clip0_429_11160">
                    <rect width="24" height="24" fill="white"></rect>
                  </clipPath>
                </defs>
              </g>
            </svg>
          </span>
          <div className="flex flex-col w-4/6 max-h-[960px]  ml-1 mr-1 text-center rounded-tl-2xl rounded-br-2xl bg-white overflow-hidden">
            <header className="flex flex-col py-5 bg-hollandtints-800">
              <h3 className="text-white text-4xl font-serif ">Konfirmasi</h3>
            </header>
            <div className="flex-1 no-scrollbar overflow-y-auto">
              <p className="text-4xl font-serif mt-4 mb-4 mr-8 ml-8 line-clamp-none">
                {props.dataConfirmation.message}
              </p>
              <p className="text-4xl font-serif mt-4 mb-4 mr-8 ml-8 line-clamp-none line-through text-hollandtints-900">
                {props.dataConfirmation.Data.name_produk} ?
              </p>
            </div>
            <div className="flex bg-hollandtints-800">
              <hr className="w-full border-y-2"></hr>
            </div>
            <footer className="bg-white  text-center text-white">
              <div className="flex w-full justify-between">
                <button
                  className="w-full ml-4 mr-4 mt-2 mb-4 bg-slate-100 border-2 border-slate-400 text-black transition duration-500 rounded-2xl hover:opacity-80 hover:shadow-lg"
                  onClick={() =>
                    handleModalConfirm({ status: false, deleted: false })
                  }
                >
                  <span className="flex justify-center p-2">
                    <h3 className="text-2xl font-medium items-center ">
                      Tidak
                    </h3>
                  </span>
                </button>
                <button
                  className="w-full ml-4 mr-4 mt-2 mb-4 bg-hollandtints-800 text-white transition duration-500 rounded-2xl hover:opacity-80 hover:shadow-lg"
                  onClick={() =>
                    handleModalConfirm({ status: false, deleted: true })
                  }
                >
                  <span className="flex justify-center p-2">
                    <h3 className="text-2xl font-medium items-center">Iya</h3>
                  </span>
                </button>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalConfirmation;
