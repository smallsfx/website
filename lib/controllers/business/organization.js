
module.exports = {
  "rootpath": "/api/organization/",
  "mapping": {
    "default": { "description": "获取培训机构列表" },
    "insert": { "description": "新增培训机构" },
    "update": { "description": "修改培训机构" },
    "delete": { "description": "删除培训机构" }
  },
  "entity": {
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
};