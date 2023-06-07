import React, { useEffect, useState } from "react";
import useIdle from "../hooks/useIdleTimeout";
import ScreenSaver from "../components/ScreenSaver";
import Loading from "../components/modal/Loading";
import crud from "../function/getDb";

import Content from "../components/Content";
import TopHeader from "../components/TopHeader";
import Header from "../components/Header";
import RunningText from "../components/RunningText";
import ContentFooter from "../components/ContentFooter";
import Footer from "../components/Footer";
import Swal from "sweetalert2";
// import { formatDate } from "../model/DateFormat";
// import VMINIT from "../services/init";
// import EngineVM from "../function/vmEngine";
// var CryptoJS = require("crypto-js");
import { Transition } from "@headlessui/react";
import ModalCart from "../components/modal/ModalCart";
import ModalPayment from "../components/modal/ModalPayment";
import ModalRefund from "../components/modal/ModalRefund";
const Vending = () => {
  const [screensaverActive, setScreensaverActive] = useState(false);
  const [isloading] = useState(false);

  const [itemSlots, setItemSlots] = useState([]);
  const [itemBannersImage, setItemBannersImage] = useState([]);
  const [isSyncSlot, setSyncSlot] = useState(false);
  //ITEMCART
  const [subTotal, setsubTotal] = useState(0);
  const [TotalItemCart, setTotalItemCart] = useState(0);
  const [transactions, setTransaction] = useState([]);

  const [isoverlay, setOverlay] = useState(false);

  // MODAL
  const [openModalCart, setopenModalCart] = useState(false);
  const [openModalPayment] = useState(false);
  const [openModalRefund] = useState(false);
  // PAYMENT
  const [contentPaymnetQR] = useState(false);

  // let toModalPayment;
  // let toModalCart;
  // let toModalRefund;
  // let timerId;
  // let timerId2;
  const [message, setmessage] = useState("Event");

  const handleIdle = () => {
    setScreensaverActive(true);
  };
  const stay = () => {
    setScreensaverActive(false);
  };
  const refreshPage = () => {
    console.log("REFRESH DATA");
    setOverlay(true);
    setTimeout(() => {
      window.location.reload(true);
      setOverlay(false);
    }, 3000);
  };
  const { idleTimer } = useIdle({ onIdle: handleIdle, idleTime: 2000 });

  const { idleRefreshData } = useIdle({
    onIdle: refreshPage,
    idleTime: 60,
  });

  // const logOutUser = () => {
  //   console.log("LOGs");
  // };
  // const startTimer = () => {
  //   if (timerId) clearTimeout(timerId);
  //   timerId = setTimeout(logOutUser, 3000);
  // };

  // const stopTimer = () => {
  //   if (timerId) {
  //     clearTimeout(timerId);
  //   }
  // };

  // const setLoad = () => {
  //   console.log("Set Overlay");
  //   setLoading(true);
  //   setOverlay(true);
  //   if (timerId2) clearTimeout(timerId2);
  //   console.log("MUlai Oeveraly");
  //   timerId2 = setTimeout(() => {
  //     setOverlay(false);
  //     console.log("Selesai Overlay");
  //     setLoading(false);
  //   }, 3000);
  // };

  useEffect(() => {
    console.log("Add transaction");
  }, [transactions]);
  // useEffect(() => {
  //   const fetchData = async () => {
  //     setOverlay(true);
  //     crud.getDataBannersImage().then((res) => {
  //       console.log(res);
  //       if (res.message === "No Data") {
  //         console.log("DATA BANNERS KOSONG");
  //       } else {
  //         setItemBannersImage(res.results.data);
  //         fetchData2();
  //       }
  //     });
  //   };
  //   const fetchData2 = async () => {
  //     crud.getDataSlots().then((res) => {
  //       console.log("Running Get SLOTS");
  //       console.log(res);
  //       if (res.message === "No Data") {
  //         console.log("Data SLots Local Kosong");
  //       } else {
  //         console.log("Set Slot");
  //         setSyncSlot(true);
  //         setOverlay(false);
  //         setItemSlots(res.results.data);
  //       }
  //     });
  //   };
  //   if (!isSyncSlot) {
  //     fetchData();
  //   }
  // });
  const addTransaction = (item, tambah) => {
    console.log(itemBannersImage);
    const existItem = transactions.find(
      (slot) => slot.no_slot === item.no_slot
    );
    if (!existItem) {
      if (item.onhand === 0) {
        console.log("STOCK SUDAH ABIS");
        Swal.fire({
          title: `Stock Product ${item.name_produk} Sudah tidak ada`,
          text: "Silahkan Pilih Produk lainnya",
          icon: "success",
          timer: 3000,
        });
      } else {
        setTransaction([
          ...transactions,
          {
            id_vm: null,
            documentno: null,
            no_slot: item.no_slot,
            kode_produk: item.kode_produk,
            name_produk: item.name_produk,
            rear_status: null,
            timestamp: null,
            error_no: null,
            error_msg: null,
            qty: 1,
            onhand: item.onhand,
            image: item.image,
            payment_type: null,
            verify_no: null,
            status_promo: item.status_promo,
            harga_promo: item.harga_promo,
            harga_jual: item.harga_jual,
            issync: 0,
          },
        ]);
      }
      const promo =
        item.status_promo === "1" ? item.harga_promo : item.harga_jual;
      setsubTotal(parseInt(subTotal) + promo);
      setTotalItemCart(TotalItemCart + 1);
    } else {
      if (tambah) {
        var stock = existItem.onhand - existItem.qty;
        if (stock <= 0) {
          console.log("STOCK SUDAH ABIS");
          Swal.fire({
            title: `Stock Product ${item.name_produk} Sudah tidak ada`,
            text: "Silahkan Pilih Produk lainnya",
            icon: "success",
            timer: 3000,
          });
        } else {
          console.log("TAMBAH");
          const promo =
            item.status_promo === "1" ? item.harga_promo : item.harga_jual;
          setsubTotal(parseInt(subTotal) + promo);
          setTransaction(
            transactions.map((product) =>
              product.no_slot === item.no_slot
                ? {
                    id_vm: null,
                    documentno: null,
                    no_slot: item.no_slot,
                    kode_produk: item.kode_produk,
                    name_produk: item.name_produk,
                    rear_status: null,
                    timestamp: null,
                    error_no: null,
                    error_msg: null,
                    payment_type: null,
                    verify_no: null,
                    status_promo: item.status_promo,
                    harga_promo: item.harga_promo,
                    harga_jual: item.harga_jual,
                    issync: 0,
                    qty: existItem.qty + 1,
                    onhand: item.onhand,
                    image: item.image,
                  }
                : product
            )
          );
          setTotalItemCart(TotalItemCart + 1);
        }
      } else {
        if (item.qty <= 1) {
          deleteItem(item);
        } else {
          const promo =
            item.status_promo === "1" ? item.harga_promo : item.harga_jual;
          setsubTotal(parseInt(subTotal) - promo);
          setTransaction(
            transactions.map((product) =>
              product.no_slot === item.no_slot
                ? {
                    id_vm: null,
                    documentno: null,
                    no_slot: item.no_slot,
                    kode_produk: item.kode_produk,
                    name_produk: item.name_produk,
                    rear_status: null,
                    timestamp: null,
                    error_no: null,
                    error_msg: null,
                    payment_type: null,
                    verify_no: null,
                    status_promo: item.status_promo,
                    harga_promo: item.harga_promo,
                    harga_jual: item.harga_jual,
                    issync: 0,
                    qty: existItem.qty - 1,
                    onhand: item.onhand,
                    image: item.image,
                  }
                : product
            )
          );
          setTotalItemCart(TotalItemCart - 1);
        }
      }
    }
  };
  const deleteItem = (item) => {
    if (transactions.length <= 1) {
      //  OpenModalCancel();
    } else {
      setTransaction(
        transactions.filter((cart) => cart.no_slot !== item.no_slot)
      );
      const promo =
        item.status_promo === "1" ? item.harga_promo : item.harga_jual;
      let sumSubTotal = promo * item.qty;
      setsubTotal(parseInt(subTotal) - sumSubTotal);

      setTotalItemCart(TotalItemCart - 1);
    }
  };

  const batalkanKeranjang = ({ props }) => {
    console.log(props);
  };

  const requestPayment = () => {
    console.log("Request Payment");
  };
  const batalkanTransaksi = ({ props }) => {
    console.log(props);
  };
  const requestCheckPayment = ({ props }) => {
    console.log(props);
  };
  const tutupRefund = ({ props }) => {
    console.log("TUTUP REFUDN");
  };
  return (
    <div className="flex flex-col h-screen w-full overflow-hidden" id="hb-vm">
      {screensaverActive ? (
        <ScreenSaver stay={stay} images={itemBannersImage}></ScreenSaver>
      ) : (
        // <div className="flex w-full justify-center">
        //   <button
        //     className="text-2xl rounded-2xl content-center bg-hollandtints-800 text-white"
        //     onClick={() => {
        //       startTimer();
        //       setLoad();
        //       setSyncSlot(false);
        //     }}
        //   >
        //     <p className="p-6">Start TEST</p>
        //   </button>

        //   <button
        //     className="text-2xl rounded-2xl content-center bg-hollandtints-800 text-white"
        //     onClick={() => {
        //       stopTimer();
        //     }}
        //   >
        //     <p className="p-6">Stop TEST</p>
        //   </button>
        // </div>
        <div className="landscape:hidden w-screen">
          <TopHeader />
          <Header />
          <RunningText />
          {isSyncSlot && (
            <Content slots={itemSlots} addCart={addTransaction}></Content>
          )}
          <ContentFooter
            transactions={transactions}
            openMocalCart={setopenModalCart}
            totalItemCart={TotalItemCart}
          />
          <Footer />
          <Transition
            show={openModalCart}
            enter="transition-opacity duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <ModalCart
              className="transition-transform delay-700 duration-700 ease-in-out"
              transactions={transactions}
              addTransaction={addTransaction}
              openMocalCart={setopenModalCart}
              batalkanKeranjang={batalkanKeranjang}
              deletedItem={deleteItem}
              subTotal={subTotal}
              requstPayment={requestPayment}
              totalItemCart={TotalItemCart}
            />
          </Transition>
          <Transition
            show={openModalPayment}
            enter="transition-opacity duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <ModalPayment
              className="transition-transform delay-700 duration-700 ease-in-out"
              itemsTransaction={transactions}
              cancelTransaction={batalkanTransaksi}
              contentPaymnetQR={contentPaymnetQR}
              requestCheckPayment={requestCheckPayment}
            />
          </Transition>
          <Transition
            show={openModalRefund}
            enter="transition-opacity duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <ModalRefund
              className="transition-transform delay-700 duration-700 ease-in-out"
              tutupRefund={tutupRefund}
              contentPaymnetQR={contentPaymnetQR}
            />
          </Transition>
        </div>
      )}
      {isloading && <Loading></Loading>}
      {isoverlay && <Loading className="featuredOverlay"></Loading>}
    </div>
  );
};

export default Vending;
