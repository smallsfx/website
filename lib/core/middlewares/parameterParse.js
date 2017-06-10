var validator = require("validator");
var base64 = require('./base64');
/** 参数有效性校验
 * @param  {array} errors 错误清单
 * @param  {string} value 参数值
 * @param  {json} column 参数规则字段
 * @param  {bool} canNaN 是否可以为空
 */
var check = function (errors, value, column, canNaN) {
  if ((value == undefined || value == "")) {
    if (!canNaN && column.requid) {
      errors.push(column.name + " 参数不能为空");
    }
  } else {
    if (column.base64) {
      if (validator.isBase64(value)) {
        value = base64.decode(value);
      } else {
        errors.push(column.name + " 没有采用base64加密");
      }
      if (column.type == "isIP" && !validator.isIp(value) && column.filter != "like") {
        errors.push(column.name + " 不是有效的IP地址");
      }
    }
  }
}
/**
 * @param {Object} req
 * @param {Object} entity
 * @param {String} mode ["select","delete","update"]
 */
var getRequestQueryParams = function (req, entity, mode) {
  var params = {}, errors = [];
  for (var property in req.query) {
    params[property] = req.query[property].trim();
  }
  entity.columns.forEach(function (column) {
    var value = params[column.name];
    // 增\删\改时参数验证
    if (mode == "select") { // 查询时不需要非空验证
      check(errors, value, column, true);
    } else if (mode == "delete") {
      if (column.primary) {
        check(errors, value, column, false);
      }
    } else {
      check(errors, value, column, false);
    }
  });
  if (errors.length > 0) {
    return { "s": false, "m": errors[0], "ms": errors };
  } else {
    return params;
  }
}

/** 解析查询类参数
 * @param  {object} req
 * @param  {object} entity
 */
exports.parseFilterParams = function (req, entity) {
  return getRequestQueryParams(req, entity, "select");
}

/** 解析删除类参数
 * @param  {object} req
 * @param  {object} entity
 */
exports.parseDeleteParams = function (req, entity) {
  return getRequestQueryParams(req, entity, "delete");
}

/** 解析编辑类参数
 * @param  {object} req
 * @param  {object} entity
 */
exports.parseUpdateParams = function (req, entity) {
  return getRequestQueryParams(req, entity, "update");
}