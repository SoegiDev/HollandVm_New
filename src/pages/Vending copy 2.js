import React, { useEffect, useRef, useState } from "react";
import useIdle from "../hooks/useIdleTimeout";
import ScreenSaver from "../components/ScreenSaver";
import Loading from "../components/modal/Loading";
import crud from "../function/getDb";
import EngineVM from "../function/vmEngine";
import Content from "../components/Content";
import TopHeader from "../components/TopHeader";
import Header from "../components/Header";
import RunningText from "../components/RunningText";
import ContentFooter from "../components/ContentFooter";
import Footer from "../components/Footer";
import Swal from "sweetalert2";
import { formatDate } from "../model/DateFormat";
import VMINIT from "../services/init";
import { Transition } from "@headlessui/react";
import ModalCart from "../components/modal/ModalCart";
import ModalPayment from "../components/modal/ModalPayment";
import ModalRefund from "../components/modal/ModalRefund";
var CryptoJS = require("crypto-js");
const Vending = () => {
  const [screensaverActive, setScreensaverActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSyncSlot, setSyncSlot] = useState(false);
  const [isSyncBanners, setSynBanners] = useState(false);
  const [isUpdateData, setUpdateData] = useState(false);
  const [itemSlots, setItemSlots] = useState([]);
  const [itemBannersImage, setItemBannersImage] = useState([]);
  const [transactions, setTransaction] = useState([]);

  const [subTotal, setsubTotal] = useState(0);
  const [TotalItemCart, setTotalItemCart] = useState(0);

  const [ContentQR, setContentQR] = useState(null);
  const [openModalPaymnet, setOpenModalPayment] = useState(false);
  const [TrxCode, setTrxCode] = useState(null);
  const [openModalCart, setOpenModalCart] = useState(false);

  let [vendTotalItem, setVendTotalItem] = useState(0);
  let [vendTotalError, setVendTotalError] = useState(0);
  let [vendTotalJumlah, setVendTotalJumlah] = useState(0);
  let [vendCounterItem, setVendCounterItem] = useState(0);
  const [openModalRefund, setModalRefund] = useState(false);

  const [checkPaymentManual, setCheckPaymentManual] = useState(false);
  const [paymentOut, setPaymentOut] = useState(false);
  let timerPayment = useRef(null);

  let timerTimeout = useRef(null);
  let timerInterval = useRef(null);
  let jumlahError = useRef(0);
  let jumlahItem = useRef(0);

  const SetError = (number) => {
    setVendTotalError(number);
  };
  useEffect(() => {
    const getbanners = () =>
      crud.getDataBannersImage().then((res) => {
        console.log("Running Get Banners");
        console.log(res);
        if (res.message === "No Data") {
          timerTimeout.current = setTimeout(() => {
            clearTimeout(timerTimeout.current);
            crud
              .initBanners()
              .then((res) => {
                console.log("Running Get Banners LOCAL");
                console.log(res.results.data);
                setItemBannersImage(res.results.data);
                setSynBanners(true);
                getSlots();
              })
              .catch((error) => {
                this.setState({ errorMessage: error.toString() });
                console.error("There was an error!", error);
              });
          }, 1000);
        } else {
          setItemBannersImage(res.results.data);
          getSlots();
        }
      });
    const getSlots = () =>
      crud.getDataSlots().then((res) => {
        console.log("Running Get SLOTS");
        console.log(res);
        if (res.message === "No Data") {
          timerTimeout.current = setTimeout(() => {
            clearTimeout(timerTimeout.current);
            crud
              .initSlots()
              .then((res) => {
                console.log("Running Get Slots LOCAL");
                console.log("Data Slot INIT", res);
                setItemSlots(res.results.data);
                setSyncSlot(true);
                setLoading(false);
              })
              .catch((error) => {
                this.setState({ errorMessage: error.toString() });
                console.error("There was an error!", error);
              });
          }, 1000);
        } else {
          console.log("Get slot");
          setItemSlots(res.results.data);
          setSyncSlot(true);
          setLoading(false);
        }
      });
    const initBanners = () =>
      crud.initBanners().then((res) => {
        console.log("Running Get Banners");
        console.log(res);
        if (res.message === "No Data") {
          timerTimeout.current = setTimeout(() => {
            clearTimeout(timerTimeout.current);
            crud.getDataBannersImage().then((res) => {
              console.log("Running Get Banners LOCAL");
              console.log(res.results.data);
              setItemBannersImage(res.results.data);
              initSlots();
            });
          }, 1000);
        } else {
          console.log("ERROR NO CONNECTION");
          getbanners();
        }
      });
    const initSlots = () =>
      crud.initSlots().then((res) => {
        console.log("Running Get SLOTS");
        console.log(res);
        timerTimeout.current = setTimeout(() => {
          clearTimeout(timerTimeout.current);
          timerTimeout.current = setTimeout(() => {
            clearTimeout(timerTimeout.current);
            crud.getSlots().then((res) => {
              console.log("Running Get Slots LOCAL");
              console.log(res.results.data);
              setItemSlots(res.results.data);
              setLoading(false);
            });
          }, 1000);
        }, 1000);
      });
    const timerTimeout = setTimeout(() => {
      clearTimeout(timerTimeout);
      if (!isSyncBanners && !isSyncSlot) {
        if (isUpdateData) {
          console.log("UPDATE DATA TRUE");
          setLoading(true);
          const timerTimeout = setTimeout(() => {
            clearTimeout(timerTimeout);
            console.log("Update Data");
            initBanners();
            clearCart();
          }, 2000);
        } else {
          console.log("UPDATE DATA False");
          setLoading(true);
          const timerTimeout = setTimeout(() => {
            clearTimeout(timerTimeout);
            getbanners();
          }, 2000);
        }
      }
    }, 1000);
    return () => {};
  });

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
      OpenModalCancel();
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

  // const updateSlotsOnHand = (item) => {
  //   const existItem = itemSlots.find((slot) => slot.no_slot === item.no_slot);
  //   console.log("UPDATE SLOTS ", item, existItem);
  //   setItemSlots(
  //     itemSlots.map((product) =>
  //       product.no_slot === item.no_slot
  //         ? {
  //             no_slot: item.no_slot,
  //             kode_produk: item.kode_produk,
  //             name_produk: item.name_produk,
  //             status_promo: item.status_promo,
  //             harga_promo: item.harga_promo,
  //             harga_jual: item.harga_jual,
  //             issync: 0,
  //             onhand: existItem.onhand + item.qty,
  //             image: item.image,
  //             created: item.created,
  //             updated: item.updated,
  //           }
  //         : product
  //     )
  //   );
  // };
  // const updateSlotContent = (item, tambah) => {
  //   if (tambah) {
  //     setItemSlots(
  //       itemSlots.map((product) =>
  //         product.no_slot === item.no_slot
  //           ? {
  //               no_slot: item.no_slot,
  //               kode_produk: item.kode_produk,
  //               name_produk: item.name_produk,
  //               status_promo: item.status_promo,
  //               harga_promo: item.harga_promo,
  //               harga_jual: item.harga_jual,
  //               issync: 0,
  //               onhand: item.onhand + 1,
  //               image: item.image,
  //               created: item.created,
  //               updated: item.updated,
  //             }
  //           : product
  //       )
  //     );
  //   } else {
  //     console.log("STOCK ", item.onhand);
  //     setItemSlots(
  //       itemSlots.map((product) =>
  //         product.no_slot === item.no_slot
  //           ? {
  //               no_slot: item.no_slot,
  //               kode_produk: item.kode_produk,
  //               name_produk: item.name_produk,
  //               status_promo: item.status_promo,
  //               harga_promo: item.harga_promo,
  //               harga_jual: item.harga_jual,
  //               issync: 0,
  //               onhand: item.onhand - 1,
  //               image: item.image,
  //               created: item.created,
  //               updated: item.updated,
  //             }
  //           : product
  //       )
  //     );
  //   }
  // };

  const OpenModalCancel = () => {
    Swal.fire({
      title: "Batalkan Transaksi",
      text: "Kamu Akan Membatalkan Transaksi ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      allowOutsideClick: false,
      confirmButtonText: "Ya Batalkan",
    }).then((result) => {
      if (result.isConfirmed) {
        clearCart();
        setOpenModalCart(false);
        setOpenModalPayment(false);
        clearInterval(timerInterval);
        clearTimeout(timerTimeout);
        clearTimeout(timerPayment);
        Swal.fire({
          title: "Transaksi Batal!",
          text: "Anda Telah membatalkan Transaksi.",
          icon: "success",
          timer: 3000,
        });
        if (TrxCode !== null) {
          afterQR("0", "107", "Transaction Cancelled", TrxCode, "SHOPEEPAY");
          setTrxCode(null);
        }
      } else {
      }
    });
  };

  const clearCart = () => {
    setsubTotal(0);
    setTotalItemCart(0);
    setTransaction([]);
    setTotalItemCart(0);
    clearTimeout(timerTimeout);
    clearInterval(timerInterval);
    clearTimeout(timerPayment);
    setUpdateData(true);
  };

  const TutupRefund = () => {
    Swal.fire({
      title: "Proses Refund Telah Selesai ?",
      text: "",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Refund Selesai",
          text: "",
          icon: "success",
          timer: 2000,
        });
        setsubTotal(0);
        setTotalItemCart(0);
        setTransaction([]);
        setTotalItemCart(0);
        clearTimeout(timerTimeout.current);
        clearTimeout(timerTimeout);
        clearInterval(timerInterval);
        setModalRefund(false);
        setUpdateData(true);
      } else {
        Swal.fire({
          title: "Silahkan dilanjutkan",
          text: "",
          icon: "info",
          timer: 2000,
        });
      }
    });
  };

  const setPaymentQR = () => {
    Swal.fire({
      icon: "info",
      title: "Proses QR",
      text: "......",
      showConfirmButton: false,
      allowOutsideClick: false,
      timer: 3000,
    }).then(() => {
      setOpenModalPayment(true);
      setOpenModalCart(false);
      var trxCode = VMINIT.getID() + "-" + formatDate();
      var apiQRCode = "trx_code=" + trxCode + "&";
      var product_name = "";

      for (let i = 0; i < transactions.length; i++) {
        var data = transactions[i];
        product_name += data.name_produk + ",";
      }

      apiQRCode += "product_name=" + product_name + "&";
      apiQRCode += "qty_product=" + TotalItemCart + "&";
      apiQRCode += "amount=" + subTotal;
      crud
        .CreateQRShopee(apiQRCode)
        .then((res) => {
          console.log("HASIL", res);
          console.log(res);
          if (res.message === "SUCCESS") {
            setContentQR(res.results.qrcode);
            setTrxCode(trxCode);
            timerTimeout.current = setTimeout(() => {
              clearTimeout(timerTimeout.current);
              checkQRPayment(trxCode, TotalItemCart, subTotal, "SHOPEEPAY");
            }, 3000);
          } else {
            clearTimeout(timerPayment.current);
            setOpenModalPayment(false);
            console.log("TIDAK MUNCUL");
            var errInfo = "Yahh, QR Tidak Muncul!";
            var errText = "Silahkan coba kembali..";
            error("460", res.message, errText, errInfo, trxCode, "SHOPEEPAY");
            failedQR();
          }
          // getSlots();
        })
        .catch((er) => {
          console.log(er);
          setTimeout(() => {
            //--> set logic success/error/time out
            var errInfo = "Waduh, Waktu Habis!";
            var errText = "Silahkan coba kembali.";
            error(
              "470",
              "Failed Request QR",
              errText,
              errInfo,
              trxCode,
              "SHOPEEPAY"
            );
            failedQR();
          }, 3000);
        });
    });
  };

  const checkQRPayment = (trxCode, jumlahItem, jumlahBayar, payment_type) => {
    var apicheck = "trx_code=" + trxCode + "&";
    timerTimeout.current = setTimeout(() => {
      clearTimeout(timerTimeout.current);
      crud
        .PaymentCheckQRShopee(apicheck)
        .then((res) => {
          if (res.message === "SUCCESS") {
            if (timerPayment.current) clearInterval(timerPayment.current);
            if (timerTimeout) clearTimeout(timerTimeout);
            if (timerInterval) clearInterval(timerInterval);
            PaymentSuccess(trxCode, payment_type);
            setTrxCode(trxCode);
            timerTimeout.current = setTimeout(() => {
              clearTimeout(timerTimeout.current);
              checkQRPayment(trxCode, TotalItemCart, subTotal, "SHOPEEPAY");
            }, 3000);
          } else {
            console.log("TAMPIL STATUS");
          }
          // getSlots();
        })
        .catch((error) => {
          this.setState({ errorMessage: error.toString() });
          console.error("There was an error!", error);
        });
    }, 1000);
    timerInterval.current = setInterval(() => {
      crud
        .PaymentCheckQRShopee(apicheck)
        .then((res) => {
          if (res.message === "SUCCESS") {
            if (timerPayment.current) clearInterval(timerPayment.current);
            if (timerTimeout) clearTimeout(timerTimeout);
            if (timerInterval) clearInterval(timerInterval);
            clearInterval(timerInterval.current);
            setTrxCode(trxCode);
            PaymentSuccess(trxCode, payment_type);
            setTrxCode(trxCode);
          } else {
            console.log(res);
          }
        })
        .catch((error) => {
          console.error("There was an error!", error);
        });
    }, 12000);

    timerPayment.current = setTimeout(() => {
      console.log("Get TIMEOUT HABIS WAKTU");
      Swal.fire({
        icon: "info",
        title: "Yahhh, Waktu Transaksi Habis!",
        text: "Silahkan coba kembali. [auto close]",
        showConfirmButton: false,
        allowOutsideClick: false,
        timer: 3000,
      }).then(() => {
        if (timerTimeout) clearTimeout(timerTimeout);
        if (timerInterval) clearInterval(timerInterval);
        clearCart();
        setOpenModalPayment(false);
        setContentQR(null);
        afterQR("0", "408", "Payment timeout", TrxCode, "SHOPEEPAY");

        /* Read more about handling dismissals below */
      });
    }, 145 * 1000);
    //set waktu habis bayar
  };

  const setCountDownTimer = () => {
    timerPayment.current = setTimeout(() => {
      console.log("Get TIMEOUT HABIS WAKTU");
      Swal.fire({
        icon: "info",
        title: "Yahhh, Waktu Transaksi Habis!",
        text: "Silahkan coba kembali. [auto close]",
        showConfirmButton: false,
        allowOutsideClick: false,
        timer: 3000,
      }).then(() => {
        if (timerTimeout) clearTimeout(timerTimeout);
        if (timerInterval) clearInterval(timerInterval);
        clearCart();
        setOpenModalPayment(false);
        setContentQR(null);
        afterQR("0", "408", "Payment timeout", TrxCode, "SHOPEEPAY");

        /* Read more about handling dismissals below */
      });
    }, 115 * 1000);
  };

  const checkPayment = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
    var apicheck = "trx_code=" + TrxCode + "&";
    crud
      .VM_CHECKPAYMENT(apicheck)
      .then((res) => {
        setLoading(false);
        if (res.message === "SUCCESS") {
          clearTimeout(timerPayment.current);
          PaymentSuccess(TrxCode, "SHOPEEPAY");
        } else {
          new Swal({
            title: "Pembayaran anda belum terverifikasi oleh Payment Gateway.",
            text: "Silahkan coba kembali. [auto close]",
            icon: "success",
            allowOutsideClick: false,
            timer: 2500,
          }).then(() => {
            clearTimeout(timerPayment.current);
            setOpenModalPayment(false);
            setContentQR(null);
            afterQR("0", "409", "Check Payment Pending", TrxCode, "SHOPEEPAY");
            clearCart();
          });
        }
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };
  const afterQR = (vmStatus, errorCode, errStatus, trxCode, payment_type) => {
    //set verify_no
    console.log(vmStatus, errorCode, errStatus, trxCode, payment_type);
    var verify_no = Math.floor(Date.now() / 1000);

    for (let i = 0; i < transactions.length; i++) {
      for (let jumProduct = 0; jumProduct < transactions[i].qty; jumProduct++) {
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
    var harga = transactions[itemNo].harga_jual;
    var harga_jual =
      transactions[itemNo].status_promo === 1
        ? transactions[itemNo].harga_promo
        : transactions[itemNo].harga_jual;

    var param = {
      documentno: trxCode,
      no_slot: transactions[itemNo].no_slot,
      kode_produk: transactions[itemNo].kode_produk,
      name_produk: transactions[itemNo].name_produk,
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
    var apivmStock = "param=" + jsonEncode;
    crud
      .VM_TRX(apivmStock)
      .then((res) => {
        if (res.status === "OK") {
          //console.log('vm oke');
        }
        // showPreloader();
        // getSlots();
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };

  function failedQR() {
    setLoading(true);
    clearInterval(timerInterval);
    clearTimeout(timerTimeout);
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }

  function error(
    errorCode,
    errStatus,
    errText,
    errInfo,
    trxCode,
    payment_type
  ) {
    var vmStatus = 0;
    console.log(
      "ERROR",
      errorCode,
      errStatus,
      errText,
      errInfo,
      trxCode,
      payment_type
    );
    Swal.fire({
      title: errInfo,
      text: errText,
      icon: "error",
      allowOutsideClick: false,
      timer: 2000,
    }).then(() => {
      afterQR(vmStatus, errorCode, errStatus, trxCode, payment_type);
    });
  }

  const PaymentSuccess = (trxCode, payment_type) => {
    setPaymentOut(false);
    clearTimeout(timerPayment.current);
    if (timerTimeout) clearTimeout(timerTimeout);
    if (timerInterval) clearInterval(timerInterval);

    setOpenModalPayment(false);
    Swal.fire({
      title: "PEMBAYARAN SUKSES",
      text: "PEMBAYARAN BERHASIL , MOHON DITUNGGU YA !!!",
      icon: "success",
      allowOutsideClick: false,
      timer: 5000,
    }).then(() => {
      cartVendProcess(trxCode, payment_type);
    });
    //afterCartVendProcess(2, "asdasdsad,asdsadsadsad", "SHOPPEPAY");
  };

  const cartVendProcess = (trxCode, payment_type) => {
    setVendTotalError(0);
    setVendTotalItem(0);
    jumlahError.current = 0;
    jumlahItem.current = 0;
    clearTimeout(timerPayment);
    console.log("LOG TIMER PAYMENT ", timerPayment);
    if (timerTimeout) clearTimeout(timerTimeout);
    if (timerInterval) clearInterval(timerInterval);
    if (timerPayment) clearTimeout(timerPayment);

    let totalItem = transactions.length;
    if (totalItem > 0) {
      //set parameter
      var verify_no = Math.floor(Date.now() / 1000);

      var paramRefund = {
        vm_store: VMINIT.getName(),
        verify_no: verify_no,
        note: "",
        transactionId: TrxCode,
      };

      //buat loop productnya
      async function myFunction() {
        setVendTotalError(0);
        setVendTotalItem(0);
        for (let index = 0; index < transactions.length; index++) {
          for (
            let jumProduct = 0;
            jumProduct < transactions[index].qty;
            jumProduct++
          ) {
            let secret = trxCode + "elmy2605" + transactions[index].no_slot;
            let hash = CryptoJS.HmacSHA256(trxCode, secret);
            let hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
            let encodeuri = encodeURIComponent(hashInBase64);
            let apiVend =
              "vend?slot=" +
              transactions[index].no_slot +
              "&data=" +
              trxCode +
              "&hmac=" +
              encodeuri;
            console.log("PROMISE ", "MULAI");
            setTimeout(function () {
              jumlahItem.current = jumlahItem.current + 1;
              setVendTotalItem(vendTotalItem + 1);
              EngineVM.RunEngine(apiVend)
                .then((resp) => {
                  console.log("MASUK BUFFER", resp["buffer"]);
                  var textCounterItem =
                    "Product ke " + vendTotalItem + " / " + TotalItemCart;
                  if (resp["status"] === true) {
                    console.log("PROMISE ", "AMAN");
                    var apiStockOffline = "slot=" + transactions[index].no_slot;
                    crud
                      .VMSTOCK(apiStockOffline)
                      .then((response) => {})
                      .catch((e) => {
                        console.log(e);
                      });
                    var vmStatus = 1;
                    var errorCode = resp["buffer"];
                    var errStatus = resp["message"];
                    vmStock(
                      index,
                      vmStatus,
                      errorCode,
                      errStatus,
                      trxCode,
                      payment_type,
                      verify_no
                    );
                    var myhtml =
                      "Silahkan ambil produk anda dibawah . ..  . <br><br>" +
                      textCounterItem;

                    Swal.fire({
                      title: "Transaksi Berhasil",
                      text: myhtml,
                      icon: "success",
                      allowOutsideClick: false,
                      timer: 2000,
                    }).then(() => {});
                  } else {
                    SetError(vendTotalError + 1);
                    console.log("PROMISE ", "ERROR");
                    vmStatus = 0;
                    errorCode = resp["buffer"];
                    errStatus = resp["message"];
                    vmStock(
                      index,
                      vmStatus,
                      errorCode,
                      errStatus,
                      trxCode,
                      payment_type,
                      verify_no
                    );
                    myhtml =
                      "Maaf, Produk tidak jatuh.. Untuk Keluhan dan Pengajuan Refund Hubungi di Call Center (021) 691 8181, atau no CS yang ada dilayar VM.. Terimakasih";

                    Swal.fire({
                      title: "Vending Machine Issues",
                      text: myhtml,
                      icon: "error",
                      allowOutsideClick: false,
                      timer: 5000,
                    }).then(() => {
                      if (vendTotalError > 0) {
                        paramRefund["note"] =
                          paramRefund["note"] +
                          "product code: " +
                          transactions[index].kode_produk +
                          ", error code: " +
                          errorCode +
                          ", message: " +
                          errStatus +
                          "%0A";
                      } else {
                        paramRefund["note"] =
                          "product code: " +
                          transactions[index].kode_produk +
                          ", error code: " +
                          errorCode +
                          ", message: " +
                          errStatus +
                          "%0A";
                      }
                    });
                  }
                })
                .catch((err) => {
                  console.log("ERRRRRR", err);
                  var vmStatus = 0;
                  var errorCode = 444;
                  var errStatus = "VM_NOT_RESPONDING";
                  vmStock(
                    index,
                    vmStatus,
                    errorCode,
                    errStatus,
                    trxCode,
                    payment_type,
                    verify_no
                  );
                  var myhtml =
                    "Maaf, Produk tidak jatuh..<br> Untuk Keluhan dan Pengajuan Refund Hubungi di Call Center (021) 691 8181, atau no CS yang ada dilayar VM.. Terimakasih<br><br>";

                  Swal.fire({
                    title: "Vending Machine Issues",
                    content: myhtml,
                    icon: "error",
                    allowOutsideClick: false,
                    timer: 5000,
                  }).then(() => {});
                  if (vendTotalError > 0) {
                    paramRefund["note"] =
                      paramRefund["note"] +
                      transactions[index].kode_produk +
                      "-" +
                      errorCode +
                      "-" +
                      errStatus +
                      "%0A";
                  } else {
                    paramRefund.note =
                      "-" +
                      transactions[index].kode_produk +
                      "-" +
                      errorCode +
                      "-" +
                      errStatus +
                      "%0A";
                  }
                  jumlahError.current = jumlahError.current + 1;
                  SetError(vendTotalError + 1);
                });
            }, 3000);
          }
        }
        return true;
      }
      myFunction().then(function () {
        afterCartVendProcess(paramRefund, payment_type);
      });
    }
  };

  function afterCartVendProcess(paramRefund, payment_type) {
    console.log("after cart SHOW TOTAL ERROR ", vendTotalError);
    console.log("TIMEOUT", timerPayment);
    if (timerPayment.current) clearTimeout(timerPayment.current);
    if (vendTotalError > 0) {
      console.log("error JUMLAH", jumlahError);
      //sett qr WA
      console.log("AFTERCART");
      setOpenModalPayment(false);
      var QR_refund_wa = refund_wa(paramRefund, payment_type);
      setContentQR(QR_refund_wa);
      setModalRefund(true);
      timerTimeout.current = setTimeout(() => {
        Swal.fire({
          title: "Waktu Scan Refund Habis!",
          text: "Silahkan Hubungi Call Center Jika Ada Terkendala. [auto close]",
          icon: "success",
          allowOutsideClick: false,
          timer: 2500,
        });

        //Hapus QR and clear Interval Payment

        //set modal kranjang
        setTimeout(() => {
          //set display modal payment
          setTimeout(() => {
            clearTimeout(timerTimeout);
            clearInterval(timerInterval);
            clearInterval(timerTimeout.current);
            setOpenModalPayment(false);
            setModalRefund(false);
            clearCart();
            setContentQR(null);
            setUpdateData(true);
          }, 7000);
        }, 500);
      }, 80 * 1000);
    } else {
      setTimeout(() => {
        clearCart();
        setUpdateData();
      }, 7000);
    }
  }
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
  let hits = 0;
  const clickLoading = () => {
    hits++;
    if (hits === 5) {
      Swal.fire({
        title: "Anda ingin Memperbaharui Data Terkini ?",
        icon: "info",
        showCancelButton: true,
        cancelButtonText: "Tidak",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        allowOutsideClick: false,
        confirmButtonText: "Ya",
      }).then((result) => {
        if (result.isConfirmed) {
          setUpdateData(true);
          setSyncSlot(false);
          setSynBanners(false);
        } else {
        }

        hits = 0;
      });
    } else {
      console.log("Hits ", hits);
    }
  };
  const handleIdle = () => {
    setUpdateData(true);
    setSyncSlot(false);
    setSynBanners(false);
    setScreensaverActive(true);
  };
  const stay = () => {
    setScreensaverActive(false);
    idleTimer.reset();
  };
  const { idleTimer } = useIdle({ onIdle: handleIdle, idleTime: 620 });

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden" id="hb-vm">
      {screensaverActive && itemBannersImage !== null ? (
        <ScreenSaver stay={stay} images={itemBannersImage}></ScreenSaver>
      ) : itemBannersImage !== null && itemSlots !== null ? (
        <div className="landscape:hidden w-screen">
          <TopHeader />
          <Header />
          <div
            onClick={() => {
              clickLoading();
            }}
          >
            <RunningText />
          </div>
          <Content slots={itemSlots} addCart={addTransaction}></Content>
          <ContentFooter
            itemsTransaction={transactions}
            setToOpenCart={setOpenModalCart}
            totalItemCart={TotalItemCart}
          />
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
              itemsTransaction={transactions}
              addTransaction={addTransaction}
              setToOpenCart={setOpenModalCart}
              cancelTransaction={OpenModalCancel}
              deletedItem={deleteItem}
              subTotal={subTotal}
              setPaymentQR={setPaymentQR}
              totalItemCart={TotalItemCart}
            />
          </Transition>
          <Transition
            show={openModalPaymnet}
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
              cancelTransaction={OpenModalCancel}
              setOpenModalPayment={setOpenModalPayment}
              contentQr={ContentQR}
              checkPayment={checkPayment}
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
              TutupRefund={TutupRefund}
              setModalRefund={setModalRefund}
              contentQr={ContentQR}
            />
          </Transition>
          <Footer />
        </div>
      ) : (
        <div className="flex w-full h-full justify-center"></div>
      )}
      {loading && <Loading></Loading>}
    </div>
  );
};

export default Vending;
