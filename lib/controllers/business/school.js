// let {sqlmethod} = require('../../core/framework');

var entity = {
  "table": "object_school",
  "columns": [
    { "name": "id", "primary": true },
    { "name": "name", "base64": true, "requid": true, "filter": "like" },
    { "name": "type", "filter": "multiple", "requid": true },
    { "name": "addr", "base64": true, "requid": true, "filter": "like" },
    { "name": "telphone", "filter": "like" },
    { "name": "describe", "base64": true, "filter": true },
    { "name": "jointime", "filter": "daterange" },
    { "name": "imgs" }
  ]
}
module.exports = {
  "rootpath": "/api/school/",
  "mapping": {
    "default": { "description": "获取学校列表" },
    "insert": { "description": "新增学校" },
    "update": { "description": "修改学校" },
    "delete": { "description": "删除学校" }
  },
  "entity":entity
};