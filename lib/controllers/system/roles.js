let {sqlmethod,generator,base64,db} = require('../../core/framework');
var entity = {
  "table": "sys_roles",
  "columns": [
    { "name": "id", "primary": true },
    { "name": "name", "base64": true, "filter": "like", "requid": true },
    { "name": "funcids", "filter": true, "requid": true }
  ]
}
module.exports = {
  "rootpath": "/api/roles/",
  "mapping": {
    "default": { "description": "获取角色列表" },
    "all": { "description": "获取全部角色列表", "auth": false },
    "insert": { "description": "新增角色" },
    "update": { "description": "修改角色" },
    "delete": { "description": "删除角色" }
  },
  "entity":entity,
  // "default": (req, res) => sqlmethod.executeSimpleSelect(entity, req, res),
  // "insert": (req, res) => sqlmethod.executeInsert(entity, req, res),
  // "update": (req, res) => sqlmethod.executeUpdate(entity, req, res),
  // "delete": (req, res) => sqlmethod.executeDelete(entity, req, res),
  "all": (req, res) => {
    var sql = 'SELECT * from ' + entity.table;
    var params = [];
    db.query(sql, params, function (err, rows, fields) {
      if (err) {
        res.send(generator.message(err.message));
      } else {
        rows.forEach(function (row) {
          row.name = base64.encode(row.name);
        });
        res.send(generator.data({ "list": rows }));
      }
    });
  }
};