
let {generator,base64,parameterParse,sqlmethod,db} = require('../../core/framework');

var entity = {
  "table": "sys_logs",
  "columns": [
    { "name": "id", "primary": true },
    { "name": "date", "requid": true, "filter": true, "filter": "daterange" },
    { "name": "owner", "requid": true, "base64": true, "filter": "like" },
    { "name": "ip", "base64": true, "base64": true, "filter": "like", "type": "ip" },
    { "name": "type", "requid": true, "filter": true },
    { "name": "msg", "requid": true, "base64": true, "filter": "like" }
  ]
}

module.exports = {
  "rootpath": "/api/logs/",
  "mapping": {
    "default": { "description": "获取日志列表" },
    "types": { "description": "获取日志类型类表" }
  },
  "default": (req, res) => {
    
    var _params = parameterParse.parseFilterParams(req, entity);
    if (_params.s == false) {
      res.send(generator.message(_params.m));
      return;
    }

    var filter = sqlmethod.buildFilter(entity, _params);
    var sql = "SELECT * FROM " + entity.table + filter.where + " ORDER BY `date` DESC";
    sqlmethod.executePaper(sql, filter.params, _params.pagenumber, function (err, json) {
      if (err) {
        res.send(err);
      } else {
        json.data.list.forEach(function (row) {
          row.msg = base64.encode(row.msg);
          row.owner = base64.encode(row.owner);
          row.ip = base64.encode(row.ip);
          // row.type = base64.encode(row.ip);
        });
        res.send(json);
      }
    });

  },
  "types": (req, res) => {
    var sql = 'SELECT DISTINCT `type` FROM `sys_logs`';
    var params = [];
    db.query(sql, params, function (err, rows, fields) {
      if (err) {
        res.send(generator.message(err.message));
      } else {
        res.send(generator.data({ "list": rows }));
      }
    });
  }
};
