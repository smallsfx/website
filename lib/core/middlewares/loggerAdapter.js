"use strict";

/**
 * 模块引用
 * @private
 */

var logger = require('../proxy/logger/console');

/** 输出内容
 * @param {string} level 日志级别：INFO,ERROR,WARN,DEBUG
 * @param {string} text  日志内容
 * @private
 */
var output = function (level, text) {
  logger.output(level, text);
}

/**
 * 模块定义
 * @public
 */

module.exports = {
  /** 以DEBUG级别输出内容
   * @param {string} text  日志内容
   */
  "debug": function (text) {
    output("DEBUG", text);
  },
  /** 以WARN级别输出内容
   * @param {string} text  日志内容
   */
  "warn": function (text) {
    output("WARN", text);
  },
  /** 以INFO级别输出内容
   * @param {string} text  日志内容
   */
  "info": function (text) {
    output("INFO", text);
  },
  /** 以ERROR级别输出内容
   * @param {string} text  日志内容
   */
  "error": function (text) {
    output("ERRPR", text);
  },
  /** 以SQL级别输出内容
   * @param {string} text  日志内容
   */
  "sql": function (text) {
    output("SQL", text);
  }
};