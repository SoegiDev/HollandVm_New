import VMINIT from "../services/init";

async function RunEngine(param) {
  var paramAPI = param;
  const PATH = process.env.REACT_APP_ENGINE_RUN;
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    //  body: JSON.stringify({ title: "React POST Request Example" }),
  };
  const response = await fetch(
    VMINIT.getURLEngine() + paramAPI,
    requestOptions
  );
  const data = await response.json();
  return data;
}

const EngineVM = {
  RunEngine,
};
export default EngineVM;
