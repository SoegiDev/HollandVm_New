import http from "../http-commons";

const getSlotOnline = () => {
  return http.NodeJsAPI("api/get-slot");
};

const getSlotOffline = () => {
  return http.NodeJsAPI("vending/get-slot");
};

const getBannerImageOnline = () => {
  return http.NodeJsAPI("api/get-banner-image");
};

const getBannerImageOffline = () => {
  return http.NodeJsAPI("vending/get-banner-image");
};

const getQRShopee = (url = "") => {
  return http.NodeJsAPI(url);
};

const VMEngine = (url = "") => {
  return http.VMMachine(url);
};

const vendingService = {
  getSlotOnline,
  getSlotOffline,
  getBannerImageOnline,
  getBannerImageOffline,
  getQRShopee,
  VMEngine,
};
export default vendingService;
