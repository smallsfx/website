let base64 = require('./base64');
let logger = require('./loggerAdapter');

/** 封装API返回字符串
 * /@param {string} code    API返回的代码
 * /@param {string} message API返回的消息
 * /@param {object} data    API返回的数据
 */
var package = function (code, message, data) {
  var result = {};
  if (code || code == 0) {
    result.c = code;
  }
  if (message) {
    result.m = base64.encode(message);
    result.zh_cn = message;
  }
  if (data) {
    result.data = data;
  }
  logger.info("<- " + JSON.stringify(result).input);
  return result;
}



/** 封装API返回字符串
 * /@param {string} code    API返回的代码
 * /@param {string} message API返回的消息
 */
exports.error = function (code, message) {
  return package(code, message, null);
}
/** 封装API返回字符串,code=1
 * /@param {string} message API返回的消息
 */
exports.message = function (message) {
  return package(1, message, null);
}
/** 封装API返回字符串,code=0
 * /@param {object} data    API返回的数据
 */
exports.data = function (data) {
  return package(0, null, data);
}