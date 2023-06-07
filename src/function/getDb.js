import VMINIT from "../services/init";

async function initBanners() {
  const PATH = process.env.REACT_APP_LOCAL_BANNER_SYNC;
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    //  body: JSON.stringify({ title: "React POST Request Example" }),
  };
  const response = await fetch(VMINIT.getURLLocal() + PATH, requestOptions);
  const data = await response.json();
  return data;
}

async function initSlots() {
  const PATH2 = process.env.REACT_APP_LOCAL_SLOTS_SYNC;
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    //  body: JSON.stringify({ title: "React POST Request Example" }),
  };
  const response = await fetch(VMINIT.getURLLocal() + PATH2, requestOptions);
  const data = await response.json();
  return data;
}

async function getDataBannersImage() {
  const PATH = process.env.REACT_APP_LOCAL_BANNER_IMAGE;
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    //  body: JSON.stringify({ title: "React POST Request Example" }),
  };
  const response = await fetch(VMINIT.getURLLocal() + PATH, requestOptions);
  const data = await response.json();
  return data;
}

async function getDataSlots() {
  const PATH2 = process.env.REACT_APP_LOCAL_SLOTS;
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    //  body: JSON.stringify({ title: "React POST Request Example" }),
  };
  const response = await fetch(VMINIT.getURLLocal() + PATH2, requestOptions);
  const data = await response.json();
  return data;
}

async function CreateQRShopee(param) {
  var paramAPI = param;
  const PATH2 = process.env.REACT_APP_LOCAL_GET_QR_SHOPEE;
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    //  body: JSON.stringify({ title: "React POST Request Example" }),
  };
  const response = await fetch(
    VMINIT.getURLLocal() + PATH2 + paramAPI,
    requestOptions
  );
  const data = await response.json();
  return data;
}

async function PaymentCheckQRShopee(param) {
  var paramAPI = param;
  const PATH2 = process.env.REACT_APP_LOCAL_CHECKPAYMENT_QR_SHOPEE;
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    //  body: JSON.stringify({ title: "React POST Request Example" }),
  };
  const response = await fetch(
    VMINIT.getURLLocal() + PATH2 + paramAPI,
    requestOptions
  );
  const data = await response.json();
  return data;
}

async function VM_TRX(param) {
  var paramAPI = param;
  const PATH2 = process.env.REACT_APP_LOCAL_VM_TRX;
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    //  body: JSON.stringify({ title: "React POST Request Example" }),
  };
  const response = await fetch(
    VMINIT.getURLLocal() + PATH2 + paramAPI,
    requestOptions
  );
  const data = await response.json();
  return data;
}
async function VMSTOCK(param) {
  var paramAPI = param;
  const PATH2 = process.env.REACT_APP_LOCAL_VM_STOCK;
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    //  body: JSON.stringify({ title: "React POST Request Example" }),
  };
  const response = await fetch(
    VMINIT.getURLLocal() + PATH2 + paramAPI,
    requestOptions
  );
  const data = await response.json();
  return data;
}

async function VM_CHECKPAYMENT(param) {
  var paramAPI = param;
  const PATH2 = process.env.REACT_APP_LOCAL_CHECK_PAYMENT;
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    //  body: JSON.stringify({ title: "React POST Request Example" }),
  };
  const response = await fetch(
    VMINIT.getURLLocal() + PATH2 + paramAPI,
    requestOptions
  );
  const data = await response.json();
  return data;
}

const crud = {
  initSlots,
  initBanners,
  getDataSlots,
  getDataBannersImage,
  CreateQRShopee,
  PaymentCheckQRShopee,
  VMSTOCK,
  VM_TRX,
  VM_CHECKPAYMENT,
};
export default crud;
