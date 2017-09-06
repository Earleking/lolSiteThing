var hello = function() {
  return "Hello";
}
define(function (require, exports, module) {

    module.exports = {hello};
});