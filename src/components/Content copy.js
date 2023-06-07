import React, { useState } from "react";
import loadingGif from "../assets/img/loading.gif";
const numberFormat = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
const Content = (props) => {
  const { slots, addTransaction, loadingFirst } = props;
  return (
    <div className="flex justify-center">
      <div className="content-center">
        <ul className="grid grid-cols-2 gap-1 md:grid-cols-3 lg:grid-cols-5 2xl:grid-cols-7 mt-2 mb-1">
          {slots
            .filter((item, idx) => idx <= 24)
            .map((slot, index) => (
              <MyItems
                key={index}
                slot={slot}
                addTransaction={addTransaction}
              />
            ))}
        </ul>
        <ul className="grid grid-cols-2 gap-1 md:grid-cols-10 lg:grid-cols-10 2xl:grid-cols-7 mb-">
          {slots
            .filter((item, index) => index >= 25)
            .map((slot, index) => (
              <MyItemsChild
                key={index}
                slot={slot}
                addTransaction={addTransaction}
              />
            ))}
        </ul>
      </div>
    </div>
  );
};

const MyItems = ({ slot, addTransaction }) => {
  const [isAddItemClass, setAdditemClass] = useState(false);

  const handleAddTransaction = () => {
    setAdditemClass(!isAddItemClass);
    // setTimeout(() => button.classList.remove("item-added"), 1000);
    setTimeout(() => setAdditemClass(false), 1000);

    addTransaction(slot, true);
  };
  return (
    <li className="mb-2">
      <div
        className={`relative w-44 h-full ml-1 mr-1 overflow-hidden text-center rounded-bl-2xl rounded-tr-2xl ${
          slot.onhand === 0
            ? "opacity-70 bg-opacity-70"
            : "shadow-2xl bg-white "
        }`}
      >
        <div
          className={`absolute h-8 w-16 rounded-br-2xl bg-hollandtints-700 text-2xl`}
        >
          <p className="text-lg font-bold text-white">{slot.no_slot}</p>
        </div>
        <img
          src={slot.image}
          alt="Landing Page"
          className="h-40 w-full"
          onClick={() => {
            if (slot.onhand > 0) {
              handleAddTransaction();
            }
          }}
        />
        <p
          className={`mx-auto p-1 text-xl justify-center ${
            slot.status_promo === "1" && "line-through text-hollandtints-900"
          }`}
        >
          {numberFormat(slot.harga_jual)}
        </p>
        {slot.onhand > 0 ? (
          <div
            id={"btncart-" + slot.no_slot}
            className={`${
              isAddItemClass
                ? "w-full h-full transition duration-500 ease-in-out -translate-y-0.5 bg-green-500 text-white cursor-pointer"
                : "w-full h-full transition duration-500 ease-in-out -translate-y-0.5 bg-hollandtints-800 text-white cursor-pointer"
            }`}
            onClick={() => {
              if (slot.onhand > 0) {
                handleAddTransaction();
              }
            }}
          >
            <p className="px-1 py-1 mx-auto text-xl justify-center">
              {isAddItemClass
                ? "Add Item"
                : slot.status_promo === "1"
                ? numberFormat(slot.harga_promo)
                : numberFormat(slot.harga_jual)}
            </p>
          </div>
        ) : (
          <div className="w-full h-full bg-hollandtints-700 text-white">
            <p className="mx-auto px-1 py-1 justify-center text-xl">HABIS</p>
          </div>
        )}
      </div>
    </li>
  );
};

const MyItemsChild = ({ slot, addTransaction }) => {
  const handleAddTransaction = () => {
    addTransaction(slot, true);
  };
  return (
    <li>
      <div
        className={`relative w-20 h-25 ml-1 mr-1 overflow-hidden text-center ${
          slot.onhand === 0
            ? "opacity-70 bg-opacity-70"
            : "shadow-2xl bg-white "
        }`}
      >
        <div
          className={`absolute h-8 w-8 rounded-br-2xl bg-hollandtints-700 text-2xl`}
        >
          <p className="text-lg font-bold text-white">{slot.no_slot}</p>
        </div>
        <img
          src={slot.image}
          alt="Landing Page"
          className="w-full h-20"
          onClick={() => {
            if (slot.onhand > 0) {
              handleAddTransaction();
            }
          }}
        />
        <p
          className={`mx-auto px-1 py-1 text-base justify-center ${
            slot.status_promo === "1" && "line-through text-hollandtints-900"
          }`}
        >
          {numberFormat(slot.harga_jual)}
        </p>
        {slot.onhand > 0 ? (
          <div
            className="w-full h-full transition duration-500 ease-in-out -translate-y-0.5 bg-hollandtints-800 text-white cursor-pointer"
            onClick={() => handleAddTransaction()}
          >
            <p className="px-1 py-1 text-base justify-center">
              {slot.status_promo === "1"
                ? numberFormat(slot.harga_promo)
                : numberFormat(slot.harga_jual)}
            </p>
          </div>
        ) : (
          <div className="w-full h-full bg-hollandtints-700 text-white">
            <p className="mx-auto px-1 py-1 justify-center text-base">HABIS</p>
          </div>
        )}
      </div>
    </li>
  );
};
export default Content;
