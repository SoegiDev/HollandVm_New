import axios from "axios";

const NodeJsAPI = axios.create({
  baseURL: "http://localhost:3000/",
  timeout: 30000,
  headers: {
    "Content-type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

const VMMachine = axios.create({
  baseURL: "http://localhost:2605/",
});
const API = {
  NodeJsAPI,
  VMMachine,
};

export default API;
