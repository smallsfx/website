'use strict'; // javascript 严格说明

/**
 * 模块引用
 * @private
 */

let { logger, fsh } = require('../framework');
let sysRoot = undefined;


/**
 * 处理器（handler）导入。
 * @param {string} catalog 处理器文件（.js）所在的目录
 */

var importHandler = (catalog) => {
  // 扫描目录，获取文件清单，包含子目录
  var paths = fsh.scan(catalog);

  paths.forEach((_path) => {
    var name = _path.replace('.js', '');
    _path = _path.replace(sysRoot, '');
    try {
      var handler = require(name);
      var define = handler.define;
      if (define && typeof handler.run === 'function') {
        handler.run(app);
        logger.info("处理器 " + define.name + " v" + define.version + " 导入成功.");
      } else {
        logger.info("处理器 " + _path + " 无效：未定义 define结构 或 run方法.");
      }
    } catch (err) {
      logger.info("处理器 " + _path + " 导入失败：" + err.message);
    }
  });
}

/**
 * 模块内容定义
 * @public
 */

module.exports.define = {
  "id": "handler",
  /** 模块名称 */
  "name": "HTTP Request Handler",
  "":"",
  /** 模块版本 */
  "version": "1.1",
  /** 模块依赖 */
  "dependencies": [
    "config", "app"
  ]
}

/**
 * 初始化 HttpHandler
 * @param {object} config 应用程序配置对象实例
 * @param {object} app 应用程序宿主对象实例
 */

module.exports.run = (config, app) => {
  sysRoot = config.rootPath;
  if (config && config.catalog && config.catalog.handler) {
    var rootPath = fsh.join(config.rootPath, config.catalog.handler);
    importHandler(rootPath);
  }

}