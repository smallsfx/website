var cfgs = {
  "app_name": "桥梁养护调度指挥系统",
  "logo": "",
  "loginPage": "login.html",
  "mainPage": "index.html",
  "debug": true,
  "imgserver": "http://223.100.9.91:8008/hpbridge/bhFile/",
  "imgserver2": "http://223.100.9.91:8008/hpbridge/sdBhFile/",
  "server": "http://223.100.9.91:8008/ymate.demo/admin/"
    //, "imgserver": "http://localhost:8888/hpbridge/bhFile/"
    // , "server": "http://localhost:8080/ymate.demo/admin/"//"http://192.168.3.84:8888/admin/"//
    ,
  "output": {
    "debug": false,
    "info": true,
    "warn": true,
    "error": true
  },
  "topmenu": {
    "0": {
      "text": "桥隧计划",
      "icon": "fa fa-tasks",
      "children": [{
          "text": "桥检计划制定",
          "icon": "icon-calendar",
          "children": [{
              "text": '高速制定',
              "icon": "icon-calendar",
              "script": "App.plugins.qljc.design()"
            },
            {
              "text": '普通制定',
              "icon": "icon-calendar",
              "script": "App.plugins.qljc.design()"
            }
          ]
        },
        {
          "text": "桥检计划查询",
          "icon": "icon-magnifier",
          "script": "App.plugins.qljc.search()"
        },
        {
          "text": "隧道计划制定",
          "icon": "icon-calendar",
          "script": "App.plugins.tasks.management()"
        },
        {
          "text": "隧道计划查询",
          "icon": "icon-magnifier",
          "script": "App.plugins.tasks.management()"
        }
      ]
      // , "refresh": "App.plugins.tasks.refreshMenu()"
      //, "id":"taskmenu", "children":[]
    },
    "1": {
      "text": "线路桥梁",
      "icon": "icon-pointer",
      "search": "searchBridgeByRoute",
      "id": "bridge"
    },
    "2": {
      "text": "线路隧道",
      "icon": "icon-pointer",
      "search": "searchChannelByRoute",
      "id": "channel"
    },
    "4": {
      "text": "地图服务",
      "icon": "icon-map",
      "children": [{
          "text": "恢复初始地图",
          "icon": "icon-refresh",
          "script": "App.plugins.mapShow.initialMap()"
        },
        {
          "text": "消除地图",
          "icon": "icon-key",
          "script": "App.plugins.mapShow.deleMap()"
        }
      ]
    },
    "5": {
      "text": "病害报告",
      "icon": "icon-pie-chart",
      "script": "App.plugins.reports.binghai.show()"
    },
    "7": {
      "text": "退出登录",
      "icon": "icon-power",
      "id": "btn_logout",
      "children": [
        // { "text": "计划管理", "icon": "icon-calendar", "script": "App.plugins.tasks.management()" },
        {
          "text": "修改密码",
          "icon": "icon-key",
          "script": "App.route.changepwd()"
        }, {
          "text": "退出登录",
          "icon": "icon-power",
          "script": "App.route.gotoLogin()"
        }
      ]
    }
  }
};

/* 业务逻辑参数 */
var bus_cfgs = {
  "cache": {},
  "options": {},
  "master": {
    "loginpage": "views/login.html",
    "mainpage": "views/main.html",
    "changepwdpage": "views/master/changepwd.html",
    "changepwdapi": cfgs.server + "changepwd",
    "loginapi": cfgs.server + "login",
    "token_cookie": "sendbox_user_token",
    "token_json_cookie": "sendbox_user_json",
    "loginlogapi": cfgs.server + "userloginlogger"
  },
  /* 系统管理 - 任务管理 */
  "task": {
    /*API：任务分页列表*/
    "datas": cfgs.server + "tasklistnopage"
      /*API：添加任务*/
      ,
    "add": cfgs.server + "addtask"
      /*API：更新任务*/
      ,
    "update": cfgs.server + "updatetask"
      /*API：删除任务*/
      ,
    "remove": cfgs.server + "deletetask",
    "detailapi": cfgs.server + "detailtask",
    "treeapi": cfgs.server + "planTree",
    "editpage": "views/taskedit.html",
    "listpage": "views/task.html",
    "tasksearchapi": cfgs.server + "tasksearch"
  },
  "qljc": {
    "searchpage": "views/qljc-task-search.html",
    "designpage": "views/qljc-task-design.html",
  },
  "base": {
    "routeapi": cfgs.server + "linelist",
    "suidaorouteapi": cfgs.server + "suidaolinelist",
    "bridgeapi": cfgs.server + "bridgelist",
    "chunnelapi": cfgs.server + "tunnellist",
    "infoapi": cfgs.server + "infodetail",
    "reportapi": cfgs.server + "bh_report",
    "noticeapi": cfgs.server + "notice"
  },
  "monitor": {
    "bhdataapi": cfgs.server + "bhdatacountmonitor",
    "bhinfoapi": cfgs.server + "bhinfomonitor",
    "workerapi": cfgs.server + "workteammonitor",
    "padLocatapi": cfgs.server + "getPadLocat"
  }
};
/* 各项内容模板设置 */
bus_cfgs.templates = {
  "cell": "<td class='center'/>"
};
/* 各项数据默认值设置 */
bus_cfgs.options.defaults = {
  "dateformatsort": "YYYY-MM-DD",
  "dateformatsort2": "yyyy-MM-dd HH:mm",
  "dateformat": "yyyy-MM-dd HH:mm:ss"
};
/* 数据字典相关设置 */
bus_cfgs.dict = {
  "sex": {
    "0": "男",
    "1": "女"
  }
  //是否
  ,
  "SF": {
    "": "全部",
    "1": "是",
    "2": "否"
  }
};
//（1：未开始，2：已完成，3：采集延期，4：未设定计划，5：全部）
/*异常字典定义*/
bus_cfgs.dict.errorCode = {
  "9999": "系统错误",
  "8888": "JSON格式错误",
  "1001": "账号不存在",
  "1002": "密码错误"
};
/* 日期选择控件参数设置 */
bus_cfgs.options.datepicker = {
  format: "yyyy-mm-dd",
  autoclose: true,
  todayBtn: true,
  language: "zh-CN",
  startDate: "2010-01-01",
  minView: "month",
  pickerPosition: "bottom-left"
}
bus_cfgs.options.datetimepicker = {
  format: "yyyy-mm-dd hh:ii",
  autoclose: true,
  todayBtn: true,
  language: "zh-CN",
  startDate: "2010-01-01 00:00",
  pickerPosition: "bottom-left",
  minuteStep: 5,
  minView: 1
}
/* 文本相关参数设置 */
bus_cfgs.options.texts = {
  "btn_delete": " <i class=\"fa fa-trash-o\"></i> 删除 ",
  "btn_add": "<i class=\"fa fa-plus\"></i> 新增"
};
/* 样式相关参数设置 */
bus_cfgs.options.styles = {
  "default": "btn btn-default"
};
/* 页面相关参数设置 */
bus_cfgs.options.page = {
  "size": 8,
  "texts": {
    "first": "<i class=\"icon-control-start\"></i> 首页",
    "priv": "<i class=\"icon-control-rewind\"></i> 上一页",
    "next": "下一页 <i class=\"	 icon-control-forward\"></i>",
    "last": "末页 <i class=\"icon-control-end\"></i>"
  }
};
/* 请求相关参数设置 */
bus_cfgs.options.request = {
  /* 设置AJAX请求超时时间:单位毫秒*/
  "timeout": 50000,
  "monitor": 90000,
  "padLocat": 300
};
/* 下拉列表选项 */
bus_cfgs.options.select2 = {
  allowClear: true,
  language: "zh-CN"
};
/*-------------------------------------------------------------*/
/*  当前页面选项
/*-------------------------------------------------------------*/
var pageOptions = {
  menus: [],
  items: [],
  currentmenu: null /* 当前选中的菜单 */ ,
  requestOptions: {} /* 最后一次分页数据请求 */ ,
  buffer: {} /* 最后一次请求分页数据 */ ,
  fromCache: false /* 是否读取缓存数据 */
};