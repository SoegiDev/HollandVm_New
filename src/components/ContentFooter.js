import React from "react";

const ContentFooter = (props) => {
  const { transactions, openMocalCart, totalItemCart } = props;

  const handleCancelClick = () => {
    if (transactions.length > 0) {
      openMocalCart(true);
    }
  };
  return (
    <div className="flex justify-center mt-4 mb-4">
      <button
        className={`relative w-full ml-4 mr-4 mt-2 mb-2 bg-hollandtints-800 text-white rounded-2xl border-2 border-yellow-500`}
        onClick={() => handleCancelClick()}
      >
        <div
          className={`flex justify-center p-4 ${
            transactions.length > 0 && "animate-pulse"
          }`}
        >
          <span className="mr-2 items-center">
            <svg
              baseProfile="tiny"
              version="1.2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 fill-current text-white"
            >
              <g id="Layer_1">
                <g>
                  <path d="M20.756,5.345C20.565,5.126,20.29,5,20,5H6.181L5.986,3.836C5.906,3.354,5.489,3,5,3H2.75c-0.553,0-1,0.447-1,1    s0.447,1,1,1h1.403l1.86,11.164c0.008,0.045,0.031,0.082,0.045,0.124c0.016,0.053,0.029,0.103,0.054,0.151    c0.032,0.066,0.075,0.122,0.12,0.179c0.031,0.039,0.059,0.078,0.095,0.112c0.058,0.054,0.125,0.092,0.193,0.13    c0.038,0.021,0.071,0.049,0.112,0.065C6.748,16.972,6.87,17,6.999,17C7,17,18,17,18,17c0.553,0,1-0.447,1-1s-0.447-1-1-1H7.847    l-0.166-1H19c0.498,0,0.92-0.366,0.99-0.858l1-7C21.031,5.854,20.945,5.563,20.756,5.345z M18.847,7l-0.285,2H15V7H18.847z M14,7    v2h-3V7H14z M14,10v2h-3v-2H14z M10,7v2H7C6.947,9,6.899,9.015,6.852,9.03L6.514,7H10z M7.014,10H10v2H7.347L7.014,10z M15,12v-2    h3.418l-0.285,2H15z" />
                  <circle cx="8.5" cy="19.5" r="1.5" />
                  <circle cx="17.5" cy="19.5" r="1.5" />
                </g>
              </g>
            </svg>
          </span>
          <span className="items-center ml-2">
            <h3 className="text-3xl font-medium">Keranjang</h3>
          </span>
          {transactions.length > 0 && (
            <span className="items-center ml-2">
              <h3 className="text-3xl font-medium justify-center p-1 ml-4 h-12 w-12 rounded-full shadow-lg bg-hollandshades-700 -translate-y-10">
                {totalItemCart}
              </h3>
            </span>
          )}
        </div>
      </button>
    </div>
  );
};

export default ContentFooter;
