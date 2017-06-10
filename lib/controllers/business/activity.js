
module.exports = {
  "rootpath": "/api/activity/",
  "mapping": {
    "default": { "description": "获取活动列表" },
    "insert": { "description": "新增活动" },
    "update": { "description": "修改活动" },
    "delete": { "description": "删除活动" }
  },
  "entity": {
    "table": "object_activity",
    "columns": [
      { "name": "id", "primary": true },
      { "name": "name", "base64": true, "filter": "like", "requid": true },
      { "name": "price", "filter": true, "requid": true },
      { "name": "describe", "base64": true, "filter": true },
      { "name": "endtime", "requid": true, "filter": "daterange" },
      { "name": "begintime", "requid": true, "filter": "daterange" },
      { "name": "imgs", "filter": true },
      { "name": "person", "filter": true, "requid": true },
      { "name": "children", "filter": true, "requid": true },
      { "name": "type", "filter": true, "requid": true },
      { "name": "sender", "default": (req, res) => { return req.session.user; } },
      { "name": "sendertype", "default": (req, res) => { return "self"; } }
    ]
  }
};