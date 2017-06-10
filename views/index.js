var fs = require("fs"),
  path = require('path'),
  route_mepping_defined = {},
  route_mapping_array = [];

/** 解析目录,获取目录中的子目录及文件
* @param {string} catalog 待解析的目录名称
*/
var parseCatlog = (catalog) => {
  try {
    let files = fs.readdirSync(catalog);
    files.forEach((file) => {
      if (file == '.svn') { return; }// 忽略SVN目录
      if (file == 'index.js') { return; }// 忽略index.js
      let curpath = path.join(catalog, file);
      let stat = fs.lstatSync(curpath);
      if (stat.isDirectory()) {
        parseCatlog(curpath);
      } else {
        parseExtends(curpath);
      }
    });
  } catch (err) {

  }
}
/** */
var parseExtends = (file) => {
  console.log("解析 ." + file.replace(__dirname, ""));
  var name = file.replace('.js', '');
  require(name);
}

console.log("扫描" + __dirname + "目录中扩展脚本文件...");
// let begin = new Date().getTime() ;
parseCatlog(__dirname);
// console.log( "耗时："+ (new Date().getTime()  - begin)) ;