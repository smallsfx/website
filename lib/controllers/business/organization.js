// let {sqlmethod} = require('../../core/framework');

var entity = {
  "table": "object_organization",
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
  "rootpath": "/api/organization/",
  "mapping": {
    "default": { "description": "获取培训机构列表" },
    "insert": { "description": "新增培训机构" },
    "update": { "description": "修改培训机构" },
    "delete": { "description": "删除培训机构" }
  },
  "entity":entity
  // "default": (req, res) => sqlmethod.executeSimpleSelect(entity, req, res),
  // "insert": (req, res) => sqlmethod.executeInsert(entity, req, res),
  // "update": (req, res) => sqlmethod.executeUpdate(entity, req, res),
  // "delete": (req, res) => sqlmethod.executeDelete(entity, req, res)
};