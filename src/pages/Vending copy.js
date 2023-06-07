import React, { useEffect, useState } from "react";
import TopHeader from "../components/TopHeader";
import Header from "../components/Header";
import Content from "../components/Content";
import Footer from "../components/Footer";
import RunningText from "../components/RunningText";
import ContentFooter from "../components/ContentFooter";
import Modal from "../components/Modal";
import ModalConfirmation from "../components/ModalConfirmation";
import ModalQRPayment from "../components/ModalPayment_Qr";
import useIdle from "../hooks/useIdleTimeout";
import loadingGif from "../assets/img/loading.gif";
import vendingService from "../services/vendingService";
import { formatDate } from "../model/DateFormat";
import ModalStatus from "../components/ModalStatus";
import ModalRefundQr from "../components/ModalRefund_Qr";
import sha256 from "crypto-js/sha256";
import hmacSHA512 from "crypto-js/hmac-sha512";
import Base64 from "crypto-js/enc-base64";
import { Transition } from "@headlessui/react";
import useEscape from "../model/UseEscape";
import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import ModalCheckPayment from "../components/ModalCheckPayment";
var CryptoJS = require("crypto-js");
var VM_ID = process.env.REACT_APP_VM_ID;
var VM_NAME = process.env.REACT_APP_VM_NAME;
const Vending = () => {
  const [slots, setSlot] = useState([]);
  const [isSyncSlot, setSlotSync] = useState(false);
  const [banners, setBanner] = useState([]);
  const [transaction, setTransaction] = useState([]);

  const [jumlahItemVend, setjumlahItemVend] = useState(0);

  const [jumlahErrorVend, setjumlahErrorVend] = useState(0);

  const [contentQr, setContentQr] = useState(null);
  const [isReadyQR, setReadyQR] = useState(false);
  const [openQRPayment, setOpenQRPayment] = useState(false);

  const [openRefundQR, setRefundQR] = useState(false);

  const [screensaverActive, setScreensaverActive] = useState(false);

  const [openCart, setOpenCart] = useState(false);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [dataConfirmation, setDataConfirmation] = useState({});
  const [subTotal, setSubTotal] = useState(0);
  const [totalItemCart, setTotalItemCart] = useState(0);
  const [trxCode, setTrxCode] = useState(null);

  const [modalStatus, setModalStatus] = useState(false);
  const [typeModalStatus, setTypeModalStatus] = useState(null);
  const [titleStatus, setTitleStatus] = useState("");
  const [descriptionStatus, setDescStatus] = useState("");
  const [actionStatus, setActionStatus] = useState("");

  const [loadingFirst, setLoading] = useState(true);
  var parmStatusPaymentinterval = "";
  var parmStatusPaymentcheckPaymentStatus = "";
  var parmStatusPaymenttimeout = "";
  var parmStatusPaymentcheckPaymentTimeout = "";
  var parmStatusPaymentintervalRefund = "";
  var setTIMEOUTVR = "";
  useEffect(() => {
    var slotsLocal = localStorage.getItem("slots");
    var bannersLocal = localStorage.getItem("banners");
    console.log(slotsLocal, bannersLocal);
    if (slotsLocal === null || bannersLocal === null) {
      async function getINIT() {
        var dataslot = await vendingService
          .getSlotOnline()
          .then((response) => {
            return response;
          })
          .catch((e) => {
            console.log("TIDAK OK");
            console.log(e);
          });
        var dataBanner = await vendingService
          .getBannerImageOnline()
          .then((response) => {
            return response;
          })
          .catch((e) => {
            console.log(e);
          });
        if (dataslot.message === "NO DATA") {
          console.log("DD", dataslot);
          setSlot(null);
          localStorage.setItem("slots", null);
        } else {
          setSlot(dataslot.data.results.data);
          localStorage.setItem(
            "slots",
            JSON.stringify(dataslot.data.results.data)
          );
        }
        if (dataBanner.message === "NO DATA") {
          setBanner(null);
          localStorage.setItem("banners", null);
        } else {
          setBanner(dataBanner.data.results.data);
          localStorage.setItem(
            "banners",
            JSON.stringify(dataBanner.data.results.data)
          );
        }

        setLoading(!loadingFirst);
        setSlotSync(true);
      }
      getINIT();
    } else {
      setLoading(!loadingFirst);
      setBanner(JSON.parse(localStorage.getItem("banners")));
      setSlot(JSON.parse(localStorage.getItem("slots")));
    }
  }, []);
  useEffect(() => {
    if (isReadyQR) {
      setOpenQRPayment(true);
    }
  }, [isReadyQR]);
  let sumSubTotal = 0;
  const handleIdle = () => {
    setScreensaverActive(true);
  };
  const { idleTimer } = useIdle({ onIdle: handleIdle, idleTime: 3000 });
  const stay = () => {
    setScreensaverActive(false);
    idleTimer.reset();
  };

  const setToOpenCart = (cart) => {
    setOpenCart(cart);
  };

  const setToOpenConfirmation = (props) => {
    setDataConfirmation(props);
    if (props.deleted) {
      if (props.module === "remove-all") {
        setSubTotal(0);
        setTotalItemCart(0);
        setTransaction([]);
        setOpenCart(false);
        setStatusModalOpen(
          "INFO",
          "KERANJANG ANDA TELAH KOSONG",
          "SILAHKAN PILIH PRODUK YANG LAINNYA DAN LANJUTKAN PEMBAYARAN!",
          "TUTUP"
        );
      }
      if (props.module === "remove-item") {
        deleteItem(props.Data);
      }
      setOpenConfirmation(props.status);
    } else {
      setOpenConfirmation(props.status);
    }
  };

  const addTransaction = (item, tambah) => {
    const existItem = transaction.find((slot) => slot.no_slot === item.no_slot);
    if (!existItem) {
      var harga = item.status_promo === 1 ? item.harga_promo : item.harga_jual;
      setTransaction([
        ...transaction,
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
          harga: harga,
          harga_jual: item.harga_jual,
          issync: 0,
        },
      ]);

      const promo =
        item.status_promo === "1" ? item.harga_promo : item.harga_jual;
      setSubTotal(parseInt(subTotal) + promo);
      setTotalItemCart(totalItemCart + 1);
    } else {
      if (tambah) {
        const promo =
          item.status_promo === "1" ? item.harga_promo : item.harga_jual;
        setSubTotal(parseInt(subTotal) + promo);
        setTransaction(
          transaction.map((product) =>
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
                  harga: harga,
                  harga_jual: item.harga_jual,
                  issync: 0,
                  qty: existItem.qty + 1,
                  onhand: item.onhand,
                  image: item.image,
                }
              : product
          )
        );
        setTotalItemCart(totalItemCart + 1);
      } else {
        if (item.qty <= 1) {
          setToOpenConfirmation({
            Data: item,
            module: "remove-item",
            message: "Anda ingin Menghapus ",
            status: true,
          });
        } else {
          const promo =
            item.status_promo === "1" ? item.harga_promo : item.harga_jual;
          setSubTotal(parseInt(subTotal) - promo);
          setTransaction(
            transaction.map((product) =>
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
                    harga: harga,
                    harga_jual: item.harga_jual,
                    issync: 0,
                    qty: existItem.qty - 1,
                    onhand: item.onhand,
                    image: item.image,
                  }
                : product
            )
          );
          setTotalItemCart(totalItemCart - 1);
        }
      }
    }
  };
  const deleteItem = (item) => {
    setTransaction(transaction.filter((cart) => cart.no_slot !== item.no_slot));
    const promo =
      item.status_promo === "1" ? item.harga_promo : item.harga_jual;
    sumSubTotal = promo * item.qty;
    setSubTotal(parseInt(subTotal) - sumSubTotal);
    if (transaction.length <= 1) {
      setOpenCart(false);
      setStatusModalOpen(
        "INFO",
        "KERANJANG ANDA TELAH KOSONG",
        "SILAHKAN PILIH PRODUK YANG LAINNYA DAN LANJUTKAN PEMBAYARAN!",
        "TUTUP"
      );
    }
    setTotalItemCart(totalItemCart - 1);
  };

  const cancelTransation = (status) => {
    setSubTotal(0);
    setTotalItemCart(0);
    setTransaction([]);
    setTotalItemCart(0);
    setOpenQRPayment(false);
    clearTimeout(parmStatusPaymentinterval);
    clearTimeout(parmStatusPaymentcheckPaymentStatus);
    clearTimeout(parmStatusPaymenttimeout);
    clearTimeout(parmStatusPaymentcheckPaymentTimeout);
    clearTimeout(parmStatusPaymentintervalRefund);
  };
  const setPaymentQR = () => {
    setOpenCart(false);
    var trxCode = VM_ID + "-" + formatDate();
    var apiQRCode = "payment/qr-shopee?";
    apiQRCode += "trx_code=" + trxCode + "&";
    var product_name = "";

    for (let i = 0; i < transaction.length; i++) {
      var data = transaction[i];
      product_name += data.name_produk + ",";
    }

    apiQRCode += "product_name=" + product_name + "&";
    apiQRCode += "qty_product=" + totalItemCart + "&";
    apiQRCode += "amount=" + subTotal;
    vendingService
      .getQRShopee(apiQRCode)
      .then((response) => {
        if (response.data.message === "SUCCESS") {
          setContentQr(response.data.results.qrcode);
          setReadyQR(true);
          setTrxCode(trxCode);
          parmStatusPaymentinterval = setTimeout(() => {
            checkQRPayment(trxCode, totalItemCart, subTotal, "SHOPEEPAY");
          }, 3000);
        } else {
          setReadyQR(false);
          setModalStatus(true);
          setTypeModalStatus("FAILED");
          setTitleStatus("TIDAK DAPAT MENAMPILKAN QR");
          setDescStatus("SILAHKAN DICOBA KEMBALI");
          setActionStatus("TUTUP");
          console.log("TAMPIL STATUS");
        }
      })
      .catch((e) => {
        setReadyQR(false);
        setModalStatus(true);
        setTypeModalStatus("FAILED SERVER");
        setTitleStatus("SERVER SEDANG ADA GANGGUAN");
        setDescStatus(
          "Mohon maaf ya.. Ada kesalahan di dalam sistem Vending Machine"
        );
        setActionStatus("TUTUP");
        console.log(e);
      });
  };

  const checkQRPayment = (trxCode, jumlahItem, jumlahBayar, payment_type) => {
    var apicheck = "payment/payment-shopee?";
    apicheck += "trx_code=" + trxCode + "&";
    vendingService
      .getQRShopee(apicheck)
      .then((response) => {
        if (response.data.message === "SUCCESS") {
          PaymentSuccess(trxCode, payment_type);
          clearTimeout(parmStatusPaymentinterval);
          clearTimeout(parmStatusPaymentcheckPaymentStatus);
          clearTimeout(parmStatusPaymenttimeout);
          clearTimeout(parmStatusPaymentcheckPaymentTimeout);
          clearTimeout(parmStatusPaymentintervalRefund);
        } else {
          console.log("CHECK PAYMENT ", response);
        }
      })
      .catch((e) => {
        console.log(e);
      });
    parmStatusPaymentcheckPaymentStatus = setInterval(() => {
      vendingService
        .getQRShopee(apicheck)
        .then((response) => {
          console.log(response);
          if (response.data.message === "SUCCESS") {
            PaymentSuccess(trxCode, payment_type);
            clearTimeout(parmStatusPaymentinterval);
            clearTimeout(parmStatusPaymentcheckPaymentStatus);
            clearTimeout(parmStatusPaymenttimeout);
            clearTimeout(parmStatusPaymentcheckPaymentTimeout);
            clearTimeout(parmStatusPaymentintervalRefund);
            setOpenQRPayment(false);
          } else {
            console.log("CHECK PAYMENT ", response);
          }
        })
        .catch((e) => {
          console.log(e);
          setReadyQR(false);
          setModalStatus(true);
          setTypeModalStatus("FAILED SERVER");
          setTitleStatus("ADA ERROR SAAT CHECK PAYMENT");
          setDescStatus(
            "Mohon maaf ya.. Ada kesalahan di dalam sistem Vending Machine"
          );
          setActionStatus("TUTUP");
        });
    }, 11600);

    //set waktu habis bayar
    parmStatusPaymenttimeout = setTimeout(() => {
      setModalStatus(true);
      setTypeModalStatus("INFO");
      setTitleStatus("Yahhh, Waktu Transaksi Habis!");
      setDescStatus("Silahkan coba kembali");
      setActionStatus("TUTUP");
      setOpenQRPayment(false);
      clearTimeout(parmStatusPaymentinterval);
      clearTimeout(parmStatusPaymentcheckPaymentStatus);
      clearTimeout(parmStatusPaymenttimeout);
      clearTimeout(parmStatusPaymentcheckPaymentTimeout);
      clearTimeout(parmStatusPaymentintervalRefund);
      parmStatusPaymentcheckPaymentTimeout = setTimeout(() => {
        afterQR("0", "408", "Payment timeout", trxCode, payment_type);
        setSubTotal(0);
        setTotalItemCart(0);
        setTransaction([]);
        setOpenQRPayment(false);
        clearTimeout(parmStatusPaymentinterval);
        clearTimeout(parmStatusPaymentcheckPaymentStatus);
        clearTimeout(parmStatusPaymenttimeout);
        clearTimeout(parmStatusPaymentcheckPaymentTimeout);
        clearTimeout(parmStatusPaymentintervalRefund);
        var TIMEOUTTRANSACTION = setTimeout(() => {
          console.log("TIME OUT TRANSACTION");
        }, 5000);
        clearTimeout(TIMEOUTTRANSACTION);
        //console.log("Waktu Habis")
      }, 12 * 1000);
    }, 115 * 1000);
  };

  const PaymentSuccess = (trxCode, payment_type) => {
    setModalStatus(true);
    setTypeModalStatus("SUCCESS PAYMENT");
    setTitleStatus("PEMBAYARAN SUKSES");
    setDescStatus("Pembayaran Berhasil, Mohon Ditunggu Ya!!!");
    setActionStatus("TUTUP");
    clearTimeout(parmStatusPaymentinterval);
    clearTimeout(parmStatusPaymentcheckPaymentStatus);
    clearTimeout(parmStatusPaymenttimeout);
    clearTimeout(parmStatusPaymentcheckPaymentTimeout);
    clearTimeout(parmStatusPaymentintervalRefund);
    cartVendProcess(trxCode, payment_type);
  };

  const afterQR = (vmStatus, errorCode, errStatus, trxCode, payment_type) => {
    //set verify_no
    var verify_no = Math.floor(Date.now() / 1000);

    for (let i = 0; i < transaction.length; i++) {
      for (
        let jumProduct = 0;
        jumProduct < transaction[i].onhand;
        jumProduct++
      ) {
        vmStock(
          i,
          vmStatus,
          errorCode,
          errStatus,
          trxCode,
          payment_type,
          verify_no
        );
      }
    }
  };

  function cartVendProcess(trxCode, payment_type) {
    let totalItem = transaction.length;
    if (totalItem > 0) {
      //set parameter
      var verify_no = Math.floor(Date.now() / 1000);
      var paramRefund = {
        vm_store: VM_NAME,
        verify_no: verify_no,
        note: "",
        transactionId: trxCode,
      };
      var looper = async function () {
        for (let index = 0; index < transaction.length; index++) {
          for (
            let jumProduct = 0;
            jumProduct < transaction[index].onhand;
            jumProduct++
          ) {
            let secret = trxCode + "elmy2605" + transaction[index].no_slot;
            let hash = CryptoJS.HmacSHA256(trxCode, secret);
            let hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
            let encodeuri = encodeURIComponent(hashInBase64);
            let textCounterItem = "";
            let apiStockOffline = "";
            let vmStatus = 0;
            let errorCode = null;
            let errStatus = null;
            let apiVend =
              "vend?slot=" +
              transaction[index].no_slot +
              "&data=" +
              trxCode +
              "&hmac=" +
              encodeuri;
            console.log(apiVend);
            setTimeout(function () {
              setjumlahItemVend(jumlahItemVend + 1);
              //console.log("iteration: " + index);
              //buat encrypt slot
              console.log("ATAS", apiVend);
              vendingService
                .VMEngine(apiVend)
                .then((response) => {
                  console.log("MASUK", response);
                  textCounterItem =
                    "Product ke " + jumlahItemVend + " / " + totalItemCart;
                  if (response.data.status) {
                    apiStockOffline =
                      "vm-stock?slot=" + transaction[index].no_slot;
                    vendingService
                      .getQRShopee(apiStockOffline)
                      .then((response) => {
                        console.log("API STOCK OFFLINE", response);
                      })
                      .catch((e) => {
                        console.log(e);
                      });
                    vmStatus = 1;
                    errorCode = response.data.buffer;
                    errStatus = response.data.message;
                    // vmStock(
                    //   index,
                    //   vmStatus,
                    //   errorCode,
                    //   errStatus,
                    //   trxCode,
                    //   payment_type,
                    //   verify_no
                    // );
                    setModalStatus(true);
                    setTypeModalStatus("SUCCESS");
                    setTitleStatus("TRANSAKSI BERHASIL");
                    setDescStatus(`Silahkan ambil produk anda dibawah`);
                    setActionStatus("TUTUP");
                  } else {
                    console.log("VMENGINE ELSE ", response);
                    vmStatus = 0;
                    errorCode = response.data.buffer;
                    errStatus = response.data.message;
                    // vmStock(
                    //   index,
                    //   vmStatus,
                    //   errorCode,
                    //   errStatus,
                    //   trxCode,
                    //   payment_type,
                    //   verify_no
                    // );
                    setModalStatus(true);
                    setTypeModalStatus("INFO");
                    setTitleStatus("VENDING MACHINE ISSUE");
                    setDescStatus(
                      `Maaf, Produk tidak jatuh.. Untuk Keluhan dan Pengajuan Refund Hubungi di Call Center (021) 691 8181, atau no CS yang ada dilayar VM.. Terimakasih`
                    );
                    setActionStatus("TUTUP");
                    if (jumlahErrorVend > 0) {
                      paramRefund["note"] =
                        paramRefund["note"] +
                        "product code: " +
                        transaction[index].kode_produk +
                        ", error code: " +
                        errorCode +
                        ", message: " +
                        errStatus +
                        "%0A";
                    } else {
                      paramRefund["note"] =
                        "product code: " +
                        transaction[index].kode_produk +
                        ", error code: " +
                        errorCode +
                        ", message: " +
                        errStatus +
                        "%0A";
                    }

                    setjumlahErrorVend(jumlahErrorVend + 1);
                  }
                })
                .catch((e) => {
                  console.log("gagal", e);
                });
              setjumlahItemVend(0);
            }, 2000);
          }
        }
        return true;
      };

      looper().then(function () {
        //console.log(paramRefund);
        afterCartVendProcess(jumlahErrorVend, paramRefund, payment_type);
      });
    }
  }

  function afterCartVendProcess(jumlahError, paramRefund, payment_type) {
    if (jumlahError > 0) {
      //sett qr WA
      var QR_refund_wa = refund_wa(paramRefund, payment_type);
      setContentQr(QR_refund_wa);
      setRefundQR(true);
      setTIMEOUTVR = setTimeout(() => {
        setSubTotal(0);
        setTotalItemCart(0);
        setTransaction([]);
        setOpenCart(false);
        setPaymentQR(false);
        setModalStatus(true);
        setTypeModalStatus("INFO");
        setTitleStatus("Waktu Scan Refund Habis!");
        setDescStatus(`Silahkan Hubungi Call Center Jika Ada kendala`);
        setActionStatus("TUTUP");
      }, 3000);
      clearTimeout(setTIMEOUTVR);
    } else {
      setTIMEOUTVR = setTimeout(() => {
        setSubTotal(0);
        setTotalItemCart(0);
        setTransaction([]);
        setOpenCart(false);
        setModalStatus(false);
        setOpenQRPayment(false);
        setContentQr(QR_refund_wa);
        setOpenConfirmation(false);
      }, 3000);
      clearTimeout(setTIMEOUTVR);
    }
  }

  const vmStock = (
    itemNo,
    vmStatus,
    errorCode,
    errorInfo,
    trxCode,
    payment_type,
    verify_no
  ) => {
    var timestamp = Math.floor(Date.now());
    var harga = transaction[itemNo].harga_jual;
    var harga_jual =
      transaction[itemNo].status_promo === 1
        ? transaction[itemNo].harga_promo
        : transaction[itemNo].harga_jual;

    var param = {
      documentno: trxCode,
      no_slot: transaction[itemNo].no_slot,
      kode_produk: transaction[itemNo].kode_produk,
      name_produk: transaction[itemNo].name_produk,
      rear_status: vmStatus,
      timestamp: timestamp,
      error_no: errorCode,
      error_msg: errorInfo,
      payment_type: payment_type,
      verify_no: verify_no,
      harga: harga,
      harga_jual: harga_jual,
    };

    var jsonEncode = JSON.stringify(param);
    var apivmStock = "payment/vm-trx?param=" + jsonEncode;
    vendingService
      .getQRShopee(apivmStock)
      .then((response) => {
        if (response.data.message === "SUCCESS") {
          console.log(response);
        } else {
          console.log(response);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const setStatusModalOpen = (type, title, desc, action) => {
    setModalStatus(true);
    setTypeModalStatus(type);
    setTitleStatus(title);
    setDescStatus(desc);
    setActionStatus(action);
  };

  function refund_wa(paramRefund, payment_type) {
    var QR_whatsApp =
      "https://wa.me/6281806918181/?text=Dear%20Holland%20Bakery%20Customer%20Support%2C%0A%0A";
    QR_whatsApp +=
      "I%20would%20like%20to%20ask%20refund%20with%20following%20details%20%3A%0AName%20%20%3A%20%20%0APhone%20%3A%20%0A";
    QR_whatsApp +=
      "Email%20%20%20%3A%20%0AReason%20of%20Refund%20%3A%0A%0ARefund%20Information%20%3A%0A";
    QR_whatsApp +=
      payment_type +
      "%20No%20%3A%0A%0ATransaction%20Information%20(Please%20do%20not%20change%20)%0A";
    QR_whatsApp +=
      "Store%20%3A%20" +
      paramRefund["vm_store"] +
      "%0ATransaction%20No%20%3A%20" +
      paramRefund["transactionId"] +
      "%0A";
    QR_whatsApp +=
      "Verify%20No%20%3A%20" +
      paramRefund["verify_no"] +
      "%0ANote%20%3A%20" +
      paramRefund["note"] +
      "%0A%0A";
    QR_whatsApp +=
      "Notes%20%3A%20All%20Information%20are%20mandatory.%0A%0AThank%C2%A0You.";

    return QR_whatsApp;
  }
  for (let index = 0; index < banners.length; index++) {
    const element = banners[index];
    console.log(element);
  }
  return (
    <div
      className="flex flex-col h-screen w-full overflow-hidden"
      id="my-component"
    >
      <div className="portrait:hidden">Landscape</div>
      {screensaverActive ? (
        <div
          id="screenSaver"
          className="landscape:hidden w-screen h-full"
          onClick={stay}
        >
          <img className="h-full w-full" src={banners[0].banner_url} alt="" />
        </div>
      ) : (
        <div className="landscape:hidden w-screen">
          <TopHeader />
          <Header />
          <RunningText />
          {loadingFirst && isSyncSlot ? (
            <div className="flex justify-center">
              <img
                src={loadingGif}
                alt=""
                className="flex h-64 w-64 items-center"
              />
            </div>
          ) : (
            <Content
              loadingFirst={loadingFirst}
              items={slots}
              slots={slots}
              addTransaction={addTransaction}
            />
          )}
          <ContentFooter
            itemsTransaction={transaction}
            setToOpenCart={setToOpenCart}
            totalItemCart={totalItemCart}
          />
          <Footer />
          <Transition
            show={openCart}
            enter="transition-opacity duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Modal
              className="transition-transform delay-700 duration-700 ease-in-out"
              itemsTransaction={transaction}
              addTransaction={addTransaction}
              setToOpenConfirmation={setToOpenConfirmation}
              setToOpenCart={setToOpenCart}
              subTotal={subTotal}
              setPaymentQR={setPaymentQR}
              totalItemCart={totalItemCart}
            />
          </Transition>
          <Transition
            show={openConfirmation}
            enter="transition-opacity duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <ModalConfirmation
              className="transition-transform delay-700 duration-700 ease-in-out"
              dataConfirmation={dataConfirmation}
              setToOpenConfirmation={setToOpenConfirmation}
              setStatusModalOpen={setStatusModalOpen}
            />
          </Transition>
          <Transition
            show={openQRPayment}
            enter="transition-opacity duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <ModalQRPayment
              className="transition-transform delay-700 duration-700 ease-in-out"
              itemsTransaction={transaction}
              addTransaction={addTransaction}
              cancelTransation={cancelTransation}
              setToOpenConfirmation={setToOpenConfirmation}
              setOpenQRPayment={setOpenQRPayment}
              setToOpenCart={setToOpenCart}
              totalItemCart={totalItemCart}
              contentQr={contentQr}
            />
          </Transition>
          <Transition
            show={modalStatus}
            enter="transition-opacity duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <ModalStatus
              setModalStatus={setModalStatus}
              typeModalStatus={typeModalStatus}
              descriptionStatus={descriptionStatus}
              actionStatus={actionStatus}
              titleStatus={titleStatus}
            />
          </Transition>
          <Transition
            show={openRefundQR}
            enter="transition-opacity duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <ModalRefundQr setRefundQR={setRefundQR} contentQr={contentQr} />
          </Transition>
        </div>
      )}
    </div>
  );
};

export default Vending;
