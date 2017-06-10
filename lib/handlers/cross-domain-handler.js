'use strict'; // javascript 严格说明

module.exports = {
  /**
   * 模块内容定义
   * @public
   */
  "define": {
    "id": "cross-domain-handler",
    /** 模块名称 */
    "name": "跨域访问处理",
    /** 模块版本 */
    "version": "1.0"
  },
  /**
   * HTTP请求跨域处理
   * @param  {object} app 应用程序实例
   * @return {void}     
   */
  "run": (app) => {

    /** 处理跨域问题 及 访问权限问题 */
    app.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      // res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
      res.header("X-Powered-By", '3.2.1')
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
      });

  }
}