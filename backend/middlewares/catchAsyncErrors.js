export default (asyncController) => {
  if (typeof asyncController !== "function") {
    throw new TypeError("Expected a function as the controller");
  }

  return (req, res, next) =>
    Promise.resolve(asyncController(req, res, next)).catch(next);
};
