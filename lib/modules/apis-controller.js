/**
 * 处理http 请求[url：/apis]
 * @author wangxin
 */
'use strict'; // javascript 严格说明

/**
 * 模块引用
 * @private
 */

let { logger } = require('../core/framework');
let array = [];

/**
 * 模块内容定义
 * @public
 */

module.exports.define = {
  "id": "apis-controller",
  /** 模块名称 */
  "name": "Apis Controller",
  /** 模块版本 */
  "version": "1.0",
  /** 模块依赖 */
  "dependencies": ["app", "controller"]
}

/**
 * 初始化 apis-controller
 * @param {object} app 应用程序宿主对象实例
 */

module.exports.run = (app) => {
  //可查看所有接口的url：/apis
  logger.info("监听 /apis 请求,返回API清单");
  app.get("/apis", function (req, res) {
    if (array.length == 0) {
      for (var url in global["route-define"]) {
        var item = global["route-define"][url];
        item.url = url;
        array.push(item);
      }
    }
    res.render('apis', { "apis": array });
  });
};