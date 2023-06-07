function getID() {
  return process.env.REACT_APP_VM_ID;
}

function getName() {
  return process.env.REACT_APP_VM_NAME;
}

function getURLEngine() {
  return process.env.REACT_APP_BASEURL_VMENGINE;
}
function getURLLocal() {
  return process.env.REACT_APP_BASEURL_LOCAL;
}

const VMINIT = {
  getID,
  getName,
  getURLEngine,
  getURLLocal,
};
export default VMINIT;
