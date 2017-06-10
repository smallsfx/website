'use strict'; // javascript 严格说明

/**
 * 模块引用
 * @private
 */

let { logger, generator, sqlmethod, fsh } = require('../framework'),
  // route_mepping_defined = {},
  route_mapping_array = [],
  rootPath = undefined;
global["route-define"] = {};

/**
 * 处理跨域问题及访问权限问题
 * @param {object} req 
 * @param {object} res 
 * @param {Function} next 
 */

var crossdomain = (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  // res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  // res.header("X-Powered-By", ' 3.2.1')
  // res.header("Content-Type", "application/json;charset=utf-8");
  // 输出当前请求的内容
  logger.debug((req.url.underline + ", " + JSON.stringify(req.query)).debug);
  logger.debug("user-agent:" + req.headers["user-agent"]);
  if (req.path.indexOf("/api/") > -1) {
    if (req.session.user) {
      next();
    } else {
      // 处理扫描的Controller文件权限问题:auth == false 不需要权限认证
      for (var url in global["route-define"]) {
        var item = global["route-define"][url];
        if (item.auth == false && req.path.indexOf(url) > -1) {
          next();
          return;
        }
      }
      res.send(generator.error("101", "用户尚未登录"));
    }
  } else {
    next();
  }
}

/**
 * 解析controllers目录下所有.js文件
 * @param {object} app 
 * @param {string} file 
 */

var parseController = (app, file) => {
  logger.info("解析 ." + file.replace(rootPath, ""));
  var name = file.replace('.js', '');
  var actions = require(name);
  var rootpath = actions["rootpath"];
  /** 若未定义rootpath属性,则使用文件名作为rootpath */
  if (rootpath == undefined) {
    rootpath = name;
  }
  var mapping = actions["mapping"];
  /** 若未定义mapping属性,说明没有route mapping,则忽略该文件 */
  if (mapping == undefined) {
    logger.warn("忽略 ." + file.replace(rootPath, "") + " 未定义映射关系.");
    return;
  }

  Object.keys(mapping).map(function (action) {
    var fn = actions[action];
    if (typeof (fn) === "function") {

    } else {
      // logger.debug("生成 " + action + " 方法.");
      let entity = actions["entity"];
      if (!entity) {
        logger.warn("忽略 ." + file.replace(__dirname, "") + " 未定义entity.");
        return;
      }
      switch (action) {
        case "default":
          fn = (req, res) => sqlmethod.executeSimpleSelect(entity, req, res);
          break;
        case "insert":
          fn = (req, res) => sqlmethod.executeInsert(entity, req, res);
          break;
        case "update":
          fn = (req, res) => sqlmethod.executeUpdate(entity, req, res);
          break;
        case "delete":
          fn = (req, res) => sqlmethod.executeDelete(entity, req, res);
          break;
        default:
          return;
      }
    }

    let api_method = undefined;
    if (api_method = mapping[action]) {
      // 设置权限默认值:需要验证
      if (api_method.auth == undefined) {
        api_method.auth = true;
      }
      // 设置访问方式默认值:get
      if (api_method.method == undefined) {
        // if (action == "delete") {
        //     a.method = "delete";
        //     if (a.url == undefined) a.url = "";
        // } else if (action == "update") {
        //     a.method = "put";
        //     if (a.url == undefined) a.url = "";
        // } else if (action == "insert") {
        //     a.method = "post";
        //     if (a.url == undefined) a.url = "";
        // } else {
        api_method.method = "get";
        // }
      }

      if (api_method.url == undefined) {
        if (action == "default") {
          api_method.url = "";
        } else if (action == "insert") {
          api_method.url = "add";
        } else {
          api_method.url = action;
        }
      }
      api_method.url = rootpath + api_method.url;

      switch (api_method.method) {
        case "put":
          app.put(api_method.url, fn);
          break;
        case "delete":
          app.delete(api_method.url, fn);
          break;
        case "get":
          app.get(api_method.url, fn);
          break;
        case "post":
          app.post(api_method.url, fn);
          break;
      }

      let ml = api_method.method.length, ul = api_method.url.length;

      logger.info((api_method.method + " ".repeat(7 - ml) +
        api_method.url +
        " ".repeat(25 - ul) +
        api_method.description).input);

      global["route-define"][api_method.url] = api_method;

    } else {
      logger.warn(action + " 尚未定义映射");
    }

  });

}

/** 
 * 解析目录,获取目录中的子目录及文件
 * @param {object} app
 * @param {string} catalog 待解析的目录名称
 */

var parseCatlog = (app, catalog) => {
  var paths = fsh.scan(catalog);
  paths.forEach((_path) => {
    try {
      var name = _path.replace('.js', '');
      parseController(app, name);
    } catch (err) {
      logger.error("controller:" + err.message);
    }
  });
}

/**
 * 模块内容定义
 * @public
 */

module.exports.define = {
  "id": "controller",
  /** 模块名称 */
  "name": "Controller Scaner",
  /** 模块版本 */
  "version": "1.0",
  /** 模块依赖 */
  "dependencies": [
    "config", "app"
  ]
}

/**
 * 初始化 Controller
 * @param {object} app 应用程序宿主对象实例
 */

module.exports.run = (config, app) => {

  rootPath = fsh.join(config.rootPath, config.catalog.controller);

  /** 处理跨域问题 及 访问权限问题 */
  app.use(crossdomain);

  // logger.info("开始扫描Controller文件...");
  let begin = new Date().getTime();
  logger.info("扫描 ." + rootPath.replace(config.rootPath, '') + " ");
  parseCatlog(app, rootPath);
  logger.info("扫描完成,耗时：" + (new Date().getTime() - begin) + " ms");

  app.get("/", function (req, res) {
    res.render('index', {
      title: '<h1>Express</h1>',
      users: [{ username: 'Wilson' }, { username: 'Wilson Zhong' }, { username: 'Zhong Wei' }]
    });
  });

}