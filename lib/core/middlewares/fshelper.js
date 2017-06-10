/**
 * 
 */

'use strict'; // javascript 严格说明

/**
 * 模块引用
 * @private
 */

let logger = require('./loggerAdapter'),
  fs = require("fs"),
  path = require('path'),
  { config } = require('../../../config');
/** 扫描时忽略的文件名称清单 */
var ignores = [];
var option = {
  "ignore": []
};

// 读取中间件设置：config.middleware.fsh
if (config && config.middleware && config.middleware.fsh) {
  option = config.middleware.fsh;
}
// 处理 扫描时忽略的文件名称
if (option.ignore && option.ignore instanceof Array) {
  ignores = option.ignore;
}

/**
 * 校验文件或目录是否被忽略扫描
 * @param {string} file 需要校验的文件名称或目录名称
 */

var _file_checker = (file) => {
  if (ignores.indexOf(file) > -1) {
    return true;
  } else {
    return false;
  }
}

/** 
 * 解析目录,获取目录中的子目录及文件
 * @param {string} catalog 待解析的目录名称
 * @return {string[]} 文件名称清单
 */

var scanCatlog = (catalog) => {
  var result = [];
  try {
    // 请求的目录不存在时，返回空列表，表示没有文件
    if (!fs.existsSync(catalog)) {
      logger.warn("扫描失败：" + catalog + " 目录不存在");
      return result;
    }

    let files = fs.readdirSync(catalog);
    files.forEach((file) => {

      if (_file_checker(file)) {
        logger.warn("扫描忽略：" + file);
        return;
      }

      let curpath = path.join(catalog, file);
      let stat = fs.lstatSync(curpath);
      if (stat.isDirectory()) {
        result = result.concat(scanCatlog(curpath));
      } else {
        result.push(curpath);
      }
    });
  } catch (err) {
    logger.warn("扫描失败：" + err.message);
  }
  return result;
}

/**
 * Join all arguments together and normalize the resulting path.
 * Arguments must be strings. In v0.8, non-string arguments were silently ignored. In v0.10 and up, an exception is thrown.
 * 
 * @param {...string} paths paths to join.
 * @return {string} path
 */
var join = (...paths) => {
  return path.join.apply(this, paths);
}

/** 定义系统模块清单 */
var modules = {
  "scan": scanCatlog,
  "join": join
}

/**
 * 模块内容定义
 * @public
 */

module.exports.define = {
  "id": "fshelper",
  /** 模块名称 */
  "name": "File System Helper",
  /** 模块描述 */
  "describe": "文件系统辅助功能",
  /** 模块版本 */
  "version": "1.1",
  /** 模块依赖 */
  "dependencies": []
}

/**
 * 初始化 File System Helper
 * @return {object} 返回模块对象实例
 */

module.exports = modules;