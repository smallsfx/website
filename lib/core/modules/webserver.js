'use strict'; // javascript 严格说明

/**
 * 模块引用
 * @private
 */

let http = require('http');

/**
 * 模块内容定义
 * @public
 */
module.exports.define = {
  "id": "webserver",
  /** 模块名称 */
  "name": "WebServer",
  /** 模块版本 */
  "version": "1.0",
  /** 模块依赖 */
  "dependencies": [
    "app"
  ]
}
/**
 * 初始化WebServer
 * @param {object} app 应用程序宿主对象实例
 */
module.exports.run = (app) => {

  /** 校验端口参数值
   * @param  {string} val 待校验的值
   * 
   * @return 若参数值为标准端口值则返回端口号,否则返回false
   */

  var normalizePort = (val) => {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
      // named pipe
      return val;
    }

    if (port >= 0) {
      // port number
      return port;
    }

    return false;
  }

  /** HTTP error 事件处理函数 */

  var onError = (error) => {
    if (error.syscall !== 'listen') {
      throw error;
    }

    var bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

  /** HTTP listening 事件处理函数 */

  var onListening = () => {
    var addr = server.address();
    var bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
    // logger.debug('Listening on ' + bind);
  }

  /** 通过全局变量获取HTTP监听端口号 */
  var port = normalizePort(process.env.PORT || '3000');
  app.set('port', port);

  /** 创建HTTP服务 */
  var server = http.createServer(app);

  /** 开始监听端口 */
  server.listen(port);

  server.on('error', onError);
  server.on('listening', onListening);

  return server;
}