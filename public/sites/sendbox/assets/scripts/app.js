var App = function () {
  "use strict";
  // IE mode
  var _isRTL = false;
  var _isIE8 = false;
  var _isIE9 = false;
  var _isIE10 = false;

  var resizeHandlers = [];

  var getResponsiveBreakpoint = function (size) {
    // bootstrap responsive breakpoints
    var sizes = {
      "xs": 480,     // extra small
      "sm": 768,     // small
      "md": 992,     // medium
      "lg": 1200     // large
    };

    return sizes[size] ? sizes[size] : 0;
  }

  var resBreakpointMd = getResponsiveBreakpoint('md');

  var _getViewPort = function () {
    var e = window, a = "inner";
    if (!("innerWidth" in window)) {
      a = "client";
      e = document.documentElement || document.body;
    }
    return {
      width: e[a + "Width"],
      height: e[a + "Height"]
    }
  }

  //* END:CORE HANDLERS *//
  var handleInit = function () {

    if ($('body').css('direction') === 'rtl') {
      _isRTL = true;
    }

    _isIE8 = !!navigator.userAgent.match(/MSIE 8.0/);
    _isIE9 = !!navigator.userAgent.match(/MSIE 9.0/);
    _isIE10 = !!navigator.userAgent.match(/MSIE 10.0/);

    if (_isIE10) {
      $('html').addClass('ie10'); // detect IE10 version
    }

    if (_isIE10 || _isIE9 || _isIE8) {
      $('html').addClass('ie'); // detect IE10 version
    }
  };

  var _runResizeHandlers = function () {
    for (var i = 0; i < resizeHandlers.length; i++) {
      var each = resizeHandlers[i];
      each.call();
    }
  };

  var handleOnResize = function () {
    var resize;
    if (_isIE8) {
      var currheight;
      $(window).resize(function () {
        if (currheight == document.documentElement.clientHeight) {
          return; //quite event since only body resized not window.
        }
        if (resize) {
          clearTimeout(resize);
        }
        resize = setTimeout(function () {
          _runResizeHandlers();
        }, 50); // wait 50ms until window resize finishes.                
        currheight = document.documentElement.clientHeight; // store last body client height
      });
    } else {
      $(window).resize(function () {
        if (resize) {
          clearTimeout(resize);
        }
        resize = setTimeout(function () {
          _runResizeHandlers();
        }, 50); // wait 50ms until window resize finishes.
      });
    }
  };

  // 注册工具栏事件
  var handlePortletTools = function () {
    // handle portlet fullscreen
    $('body').on('click', '.portlet > .portlet-title .fullscreen', function (e) {
      e.preventDefault();
      var portlet = $(this).closest(".portlet");
      if (portlet.hasClass('portlet-fullscreen')) {
        $(this).removeClass('on');
        portlet.removeClass('portlet-fullscreen');
        $('body').removeClass('page-portlet-fullscreen');
        portlet.children('.portlet-body').css('height', 'auto');
      } else {
        var height = _getViewPort().height -
          portlet.children('.portlet-title').outerHeight() -
          parseInt(portlet.children('.portlet-body').css('padding-top')) -
          parseInt(portlet.children('.portlet-body').css('padding-bottom'));

        $(this).addClass('on');
        portlet.addClass('portlet-fullscreen');
        $('body').addClass('page-portlet-fullscreen');
        portlet.children('.portlet-body').css('height', height);
      }
    });

    $('body').on('click', '.portlet > .portlet-title > .tools > .collapse, .portlet .portlet-title > .tools > .expand', function (e) {
      e.preventDefault();
      var el = $(this).closest(".portlet").children(".portlet-body");
      if ($(this).hasClass("collapse")) {
        $(this).removeClass("collapse").addClass("expand");
        el.slideUp(200);
      } else {
        $(this).removeClass("expand").addClass("collapse");
        el.slideDown(200);
      }
    });
  };

  var handleUniform = function () {
    if (!$().uniform) {
      return;
    }
    var test = $("input[type=checkbox]:not(.toggle, .md-check, .md-radiobtn, .make-switch, .icheck), input[type=radio]:not(.toggle, .md-check, .md-radiobtn, .star, .make-switch, .icheck)");
    if (test.size() > 0) {
      test.each(function () {
        if ($(this).parents(".checker").size() === 0) {
          $(this).show();
          $(this).uniform();
        }
      });
    }
  };

  var handleFixInputPlaceholderForIE = function () {
    //fix html5 placeholder attribute for ie7 & ie8
    if (_isIE8 || _isIE9) { // ie8 & ie9
      // this is html5 placeholder fix for inputs, inputs with placeholder-no-fix class will be skipped(e.g: we need this for password fields)
      $('input[placeholder]:not(.placeholder-no-fix), textarea[placeholder]:not(.placeholder-no-fix)').each(function () {
        var input = $(this);

        if (input.val() === '' && input.attr("placeholder") !== '') {
          input.addClass("placeholder").val(input.attr('placeholder'));
        }

        input.focus(function () {
          if (input.val() == input.attr('placeholder')) {
            input.val('');
          }
        });

        input.blur(function () {
          if (input.val() === '' || input.val() == input.attr('placeholder')) {
            input.val(input.attr('placeholder'));
          }
        });
      });
    }
  };

  var handlerSwitchTab =function(){
    $(".switch-tab-item").on("click",function(){
      if($(this).hasClass("active")){
        return;
      }
      $(".switch-tab-item").each(function(item,index){
        $(this).removeClass("active");
      });
      $(this).addClass("active");

      // todo:选中tab
      
    });
  }
  //* END:CORE HANDLERS *//

  var AppObject = {
    "userinfo": {}
    //应用入口.
    , "onReady": function () {
      $(document).on('click', '.search', function (e) {
        e.stopPropagation();
      });
      $(document).on('click', '.dialog', function (e) {
        e.stopPropagation();
        var that = $(this);
        var script = that.attr("data-action");
        if (script != "") {
          eval(script);
        }
      });
      $(document).on('click', '.refresh', function (e) {
        e.stopPropagation();
        var that = $(this);
        var script = that.attr("data-action");
        if (script != "") {
          eval(script);
        }
      });
      $(document).on('click', '.tag-container a', function (e) {
        e.stopPropagation();
        var that = $(this);

        if (that.parent().hasClass("checked")) {
          that.parent().removeClass("checked");
        } else {
          that.parent().addClass("checked");
        }

        App.map.refreshState();
      });

      App.logger.info("应用程序启动");

      handleInit();
      handleOnResize();
      handleUniform();
      handlePortletTools();// 注册portlet扩展功能：伸展、全屏等
      handleFixInputPlaceholderForIE();
      handlerSwitchTab();
      if (!App.readCookie()) {
        App.logger.debug("TOKEN验证失败,重新登录");
        App.route.gotoLogin();/*不存在token或token失效，需重新登录*/
      } else {
        App.logger.debug("TOKEN验证成功,进入系统");
        App.route.gotoMain();/*token有效，可正常使用系统*/
      }
    }
    , "addResizeHandler": function (func) {
      resizeHandlers.push(func);
      func.call();
    }
    // 刷新窗口大小
    , "runResizeHandlers": function () {
      _runResizeHandlers();
      $(window).resize(function () {
        setTimeout(_runResizeHandlers, 50);
      });
    }

    , "initSlimScroll": function (el) {
      $(el).each(function () {
        if ($(this).attr("data-initialized")) {
          return; // exit
        }
        var height = 'auto', width = 'auto';

        if ($(this).attr("data-height")) {
          height = $(this).attr("data-height");
        } else {
          height = $(this).css('height');
        }

        $(this).slimScroll({
          width: width, //可滚动区域宽度
          height: height, //可滚动区域高度
          size: '7px', //组件宽度
          color: '#999', //滚动条颜色
          position: 'right', //组件位置：left/right
          distance: '0px', //组件与侧边之间的距离
          start: 'top', //默认滚动位置：top/bottom
          opacity: .4, //滚动条透明度
          alwaysVisible: false, //是否 始终显示组件
          disableFadeOut: false, //是否 鼠标经过可滚动区域时显示组件，离开时隐藏组件
          railVisible: ($(this).attr("data-rail-visible") == "0" ? false : true), //是否 显示轨道
          railColor: '#eee', //轨道颜色
          railOpacity: .2, //轨道透明度
          railDraggable: true, //是否 滚动条可拖动
          railClass: 'slimScrollRail', //轨道div类名 
          barClass: 'slimScrollBar', //滚动条div类名
          wrapperClass: ($(this).attr("data-wrapper-class") ? $(this).attr("data-wrapper-class") : 'slimScrollDiv'),
          allowPageScroll: false, //是否 使用滚轮到达顶端/底端时，滚动窗口
          wheelStep: 20, //滚轮滚动量
          touchScrollStep: 200, //滚动量当用户使用手势
          borderRadius: '7px', //滚动条圆角
          railBorderRadius: '7px' //轨道圆角
        });

        $(this).attr("data-initialized", "1");
      });
    }

    , "destroySlimScroll": function (el) {
      $(el).each(function () {
        if ($(this).attr("data-initialized") === "1") { // destroy existing instance before updating the height
          $(this).removeAttr("data-initialized");
          $(this).removeAttr("style");

          var attrList = {};

          // store the custom attribures so later we will reassign.
          if ($(this).attr("data-handle-color")) {
            attrList["data-handle-color"] = $(this).attr("data-handle-color");
          }
          if ($(this).attr("data-wrapper-class")) {
            attrList["data-wrapper-class"] = $(this).attr("data-wrapper-class");
          }
          if ($(this).attr("data-rail-color")) {
            attrList["data-rail-color"] = $(this).attr("data-rail-color");
          }
          if ($(this).attr("data-always-visible")) {
            attrList["data-always-visible"] = $(this).attr("data-always-visible");
          }
          if ($(this).attr("data-rail-visible")) {
            attrList["data-rail-visible"] = $(this).attr("data-rail-visible");
          }

          $(this).slimScroll({
            wrapperClass: ($(this).attr("data-wrapper-class") ? $(this).attr("data-wrapper-class") : 'slimScrollDiv'),
            destroy: true
          });

          var the = $(this);

          // reassign custom attributes
          $.each(attrList, function (key, value) {
            the.attr(key, value);
          });

        }
      });
    }

    , "isLogin": function () { if (App.readCookie()) { return true; } else { return false; } }

  };
  // 为对象附加属性
  Object.defineProperties(AppObject, {
    "_assetsPath": {
      "value": "assets/"
    },
    "globalImgPath": {
      "value": "img/"
    },
    "globalPluginsPath": {
      "value": "plugins/"
    },
    "globalCssPath": {
      "value": "css/"
    },
    "layoutImgPath": {
      "value": "img/"
    },
    "layoutCssPath": {
      "value": "css/"
    },
    "AssetsPath": {
      "get": function () {
        return this._assetsPath;
      },
      "set": function (value) {
        this._assetsPath = value;
      }
    },
    "LayoutImgPath": {
      "get": function () {
        return this._assetsPath + this.layoutImgPath;
      }
    },
    "LayoutCssPath": {
      "get": function () {
        return this._assetsPath + this.layoutCssPath;
      }
    },
    "ViewPort": {
      "get": function () {
        return _getViewPort();
      }
    },
    // 判断当前浏览器是否支持HTML5
    // ====================================================================
    "isHTML5": {
      "get": function () { return (document.createElement("canvas") && document.createElement("canvas").getContext && document.createElement("canvas").getContext("2d")); }
    },
    // 判断当前是否在移动设备中运行
    // ====================================================================
    "isTouchDevice": {
      "get": function () {
        try { document.createEvent("TouchEvent"); return true; } catch (e) { return false; }
      }
    },
    // 验证浏览器是否是ie8模式
    // ====================================================================
    "isIE8": {
      "get": function () { return _isIE8; },
      "set": function (value) { _isIE8 = value }
    },
    // 验证浏览器是否是ie9模式
    // ====================================================================
    "isIE9": {
      "get": function () { return _isIE9; },
      "set": function (value) { _isIE9 = value }
    },
    // 验证浏览器是否是RTL 右侧显示模式
    // ====================================================================
    "isRTL": {
      "get": function () { return _isRTL; },
      "set": function (value) { _isRTL = value }
    }
  });
  return AppObject;
} ();
/* ========================================================================
 * App.saveCookie v1.0
 * App.readCookie v1.0
 * App.cookie v1.0
 * COOKIE操作组件
 * ========================================================================
 * Copyright 2015-2025 WangXin nvlbs,Inc.
 * ======================================================================== */
(function (app) {

  var getCookie = function (key) {
    var cookieStr = $.cookie(key);
    if (cookieStr == undefined || cookieStr == "") {
      return "";
    } else {
      return cookieStr;
    }
  }

  var setCookie = function (key, value) {
    $.cookie(key, value);
  }
  app.cookie = {
    "get": function (key) {
      return getCookie(key);
    }
    , "set": function (key, value) {
      setCookie(key, value);
    }
  };
  //将登录信息JSON内容保存至COOKIE.
  //@param json jsonObject 要保存的JSON内容,目前仅保存登录信息.
  //=======================================================================
  app.saveCookie = function (json) {
    if (json == "") {
      $.cookie(bus_cfgs.master.token_cookie, "");
      this.userinfo = null;
    } else {
      $.cookie(bus_cfgs.master.token_cookie, App.util.jsonToString(json.data));
      this.userinfo = json.data;
    }
  };
  //读取COOKIE中的登录信息JSON内容.
  //=======================================================================
  app.readCookie = function () {
    var cookieStr = $.cookie(bus_cfgs.master.token_cookie);
    if (cookieStr == undefined || cookieStr == "") {
      App.logger.debug("COOKIE " + bus_cfgs.master.token_cookie + " 不存在或没有值！");
      return undefined;
    } else {
      var json = $.parseJSON(cookieStr);
      this.userinfo = json;
      return json;
    }
  };
})(App);
/* ========================================================================
 * App.logger v1.0
 * 日志记录插件
 * ========================================================================
 * Copyright 2015-2025 WangXin nvlbs,Inc.
 * ======================================================================== */
(function (app) {
  //输出内容
  //@param level 日志级别：INFO,ERROR,WARN,DEBUG
  //@param text  日志内容
  //=======================================================================
  var output = function (level, text) {
    /// <summary>根据日志级别记录日志.</summary>
    /// <param name="level" type="string">记录日志级别</param>
    /// <param name="text" type="string">日志内容</param>
    if (cfgs.output) {
      var date = App.util.dateformat(new Date(), "yyyy-MM-dd HH:mm:ss");
      if (level == "INFO ") {
        console.info(date + " [" + level + "] " + text);
      } else if (level == "ERROR") {
        console.error(date + " [" + level + "] " + text);
      } else if (level == "WARN ") {
        console.warn(date + " [" + level + "] " + text);
      } else if (level == "DEBUG") {
        console.debug(date + " [" + level + "] " + text);
      } else {
        console.log(date + " [" + level + "] " + text);
      }
    }
  }
  /// <field type="logger">日志记录器对象.</field> 
  app.logger = {
    //以DEBUG级别输出内容
    //@param text  日志内容
    //=====================================================================
    "debug": function (text) {
      /// <summary>记录DEBUG级日志.</summary>
      /// <param name="text" type="string">日志内容</param>
      if (cfgs.output.debug) {
        output("DEBUG", text);
      }
    }
    //以WARN级别输出内容
    //@param text  日志内容
    //=====================================================================
    , "warn": function (text) {
      /// <summary>记录WARN级日志.</summary>
      /// <param name="text" type="string">日志内容</param>
      if (cfgs.output.warn) {
        output("WARN ", text);
      }
    }
    //以INFO级别输出内容
    //@param text  日志内容
    //=====================================================================
    , "info": function (text) {
      /// <summary>记录INFO级日志.</summary>
      /// <param name="text" type="string">日志内容</param>
      if (cfgs.output.info) {
        output("INFO ", text);
      }
    }
    //以ERROR级别输出内容
    //@param text  日志内容
    //=====================================================================
    , "error": function (text) {
      /// <summary>记录ERRPR级日志.</summary>
      /// <param name="text" type="string">日志内容</param>
      if (cfgs.output.error) {
        output("ERRPR", text);
      }
    }
  }
})(App);
/* ========================================================================
 * App.util v1.0
 * 公共数据类型转换插件
 * ========================================================================
 * Copyright 2015-2025 WangXin nvlbs,Inc.
 * ======================================================================== */
(function (app) {
  //解析URL返回URL中各部件。例如：文件名、地址、域名、请求、端口、协议等
  var _parseURL = function (url) {
    /*-----------------------------------------------------------------------------------*/
    /*  解析URL返回URL中各部件。例如：文件名、地址、域名、请求、端口、协议等
    /*@param {string} url 完整的URL地址 
    /*@returns {object} 自定义的对象 
    /*@description 
    /*@samples：
    /*  var myURL = parseURL('http://abc.com:8080/dir/index.html?id=255&m=hello#top'); 
    /*  myURL.file='index.html' 
    /*  myURL.hash= 'top' 
    /*  myURL.host= 'abc.com' 
    /*  myURL.query= '?id=255&m=hello' 
    /*  myURL.params= Object = { id: 255, m: hello } 
    /*  myURL.path= '/dir/index.html' 
    /*  myURL.segments= Array = ['dir', 'index.html'] 
    /*  myURL.port= '8080' 
    /*  myURL.protocol= 'http' 
    /*  myURL.source= 'http://abc.com:8080/dir/index.html?id=255&m=hello#top' 
    /*-----------------------------------------------------------------------------------*/
    var a = document.createElement('a');
    a.href = url;
    return {
      source: url,
      protocol: a.protocol.replace(':', ''),
      host: a.hostname,
      port: a.port,
      query: a.search,
      params: (function () {
        var ret = {},
          seg = a.search.replace(/^\?/, '').split('&'),
          len = seg.length, i = 0, s;
        for (; i < len; i++) {
          if (!seg[i]) { continue; }
          s = seg[i].split('=');
          ret[s[0]] = s[1];
        }
        return ret;
      })(),
      file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
      hash: a.hash.replace('#', ''),
      path: a.pathname.replace(/^([^\/])/, '/$1'),
      relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
      segments: a.pathname.replace(/^\//, '').split('/')
    };
  };
  /**
   * 检测时间是否符合格式
   * @param string time
   */
  var checkTime = function (time) {
    var regTime = /^([0-2][0-9]):([0-5][0-9]):([0-5][0-9])$/;
    var result = false;
    if (regTime.test(time)) {
      if ((parseInt(RegExp.$1) < 24) && (parseInt(RegExp.$2) < 60) && (parseInt(RegExp.$3) < 60)) {
        result = true;
      }
    }
    return result;
  }
  //| 日期有效性验证 
  //| 格式为：YYYY-MM-DD或YYYY/MM/DD   
  var IsValidDate = function (DateStr) {
    var sDate = DateStr.replace(/(^\s+|\s+$)/g, '');//去两边空格; 
    if (sDate == '') {
      return true;
    }
    //如果格式满足YYYY-(/)MM-(/)DD或YYYY-(/)M-(/)DD或YYYY-(/)M-(/)D或YYYY-(/)MM-(/)D就替换为'' 
    //数据库中，合法日期可以是:YYYY-MM/DD(2003-3/21),数据库会自动转换为YYYY-MM-DD格式 
    var s = sDate.replace(/[\d]{ 4,4 }[\-/]{1}[\d]{1,2}[\-/]{1}[\d]{1,2}/g, '');
    if (s == '') {//说明格式满足YYYY-MM-DD或YYYY-M-DD或YYYY-M-D或YYYY-MM-D 
      var t = new Date(sDate.replace(/\-/g, '/'));
      var ar = sDate.split(/[-/:]/);
      if (ar[0] != t.getYear() || ar[1] != t.getMonth() + 1 || ar[2] != t.getDate()) {//alert('错误的日期格式！格式为：YYYY-MM-DD或YYYY/MM/DD。注意闰年。'); 
        return false;
      }
    } else {//alert('错误的日期格式！格式为：YYYY-MM-DD或YYYY/MM/DD。注意闰年。'); 
      return false;
    }
    return true;
  }
  //| 日期时间有效性检查 
  //| 格式为：YYYY-MM-DD HH:MM:SS 
  var IsValidDateTime = function (str) {
    var reg = /^(\d+)-(\d{ 1,2})-(\d{ 1,2})(\d{ 1,2}):(\d{1,2}):(\d{1,2})$/;
    var r = str.match(reg);
    if (r == null) return false;
    r[2] = r[2] - 1;
    var d = new Date(r[1], r[2], r[3], r[4], r[5], r[6]);
    if (d.getFullYear() != r[1]) return false;
    if (d.getMonth() != r[2]) return false;
    if (d.getDate() != r[3]) return false;
    if (d.getHours() != r[4]) return false;
    if (d.getMinutes() != r[5]) return false;
    if (d.getSeconds() != r[6]) return false;
    return true;
  }
  /*-----------------------------------------------------------------------------------*/
  /*  日期格式字符串转为时间戳
  /*@params string 日期格式字符串,例如2015年10月29日,2015-10-29 14:00:36
  /*-----------------------------------------------------------------------------------*/
  var stringToUTC = function (string) {
    return new Date(string.replace(/-/g, '/')).getTime() / 1000;
  };
  /*-----------------------------------------------------------------------------------*/
  /*  时间戳转为日期格式字符串
  /*@params string 时间戳字符串,例如123121234123
  /*-----------------------------------------------------------------------------------*/
  var utcTostring = function (timestamp, format) {
    if (!timestamp || timestamp == "0") {
      return "";
    }
    if (!format) {
      format = "yyyy-MM-dd";
    }
    return datetimeToString(new Date(parseInt(timestamp) * 1000), format);//.toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
  };
  /**
    * 对Date的扩展，将 Date 转化为指定格式的String
    * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用 1-2 个占位符
    * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
    * eg:
    * (new Date()).formate("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
    * (new Date()).formate("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04
    * (new Date()).formate("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04
    * (new Date()).formate("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04
    * (new Date()).formate("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
    */
  var datetimeToString = function (date, format) {
    var o = {
      "M+": date.getMonth() + 1, //月份
      "d+": date.getDate(), //日
      "h+": date.getHours() % 12 == 0 ? 12 : date.getHours() % 12, //小时
      "H+": date.getHours(), //小时
      "m+": date.getMinutes(), //分
      "s+": date.getSeconds(), //秒
      "q+": Math.floor((date.getMonth() + 3) / 3), //季度
      "S": date.getMilliseconds() //毫秒
    };
    var week = {
      "0": "\u65e5",
      "1": "\u4e00",
      "2": "\u4e8c",
      "3": "\u4e09",
      "4": "\u56db",
      "5": "\u4e94",
      "6": "\u516d"
    };
    if (/(y+)/.test(format)) {
      format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(format)) {
      format = format.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "\u661f\u671f" : "\u5468") : "") + week[date.getDay() + ""]);
    }
    for (var k in o) {
      if (new RegExp("(" + k + ")").test(format)) {
        format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      }
    }
    return format;
  }

  app.util = {
    parseURL: function (url) {
      return _parseURL(url);
    }
    , isDate: function (string) {
      return /^(\d{4})-(0\d{1}|1[0-2])-(0\d{1}|[12]\d{1}|3[01])$/.test(string);
      //  return IsValidDate(string);
    }
    , isDatetime: function (string) {
      return IsValidDateTime(string);
    }
    , stringToUTC: function (string) {
      return stringToUTC(string);
    }
    , dateformat: function (date, format) {
      return datetimeToString(date, format);
    }
    , utcTostring: function (timestamp, format) {
      return utcTostring(timestamp, format);
    }
    , jsonToString: function (json) {
      return JSON.stringify(json)
    }
    //检查是否为正数
    , isNumeric: function (a) {
      return /^d+(.d+)?$/.test(a);
    }
    //检查是否为正整数
    , isInteger: function (a) {
      return /^d+$/.test(a);
    }
    //检查是否数字
    , isNum: function (a) {
      return /^d+(.d+)?$/.test(a);
    }
    //检查是否整数
    , isInt: function (a) {
      return /^-?d+$/.test(a);
    }

    //根据数据字典名称获取该键对应的数据字典
    , getDict: function (dictkey) {
      ///<summary>根据数据字典名称及字典项的键获取该键对应的数据项.</summary>
      ///<param name="dictkey" type="string">数据字典名称.</param>
      ///<return type="Array">数据项对象.</return>
      if (dictkey) {
        return bus_cfgs.dict[dictkey];
      } else {
        return undefined;
      }
    }
    //根据数据字典名称及字典项的键获取该键对应的值
    , getDictText: function (dictkey, key) {
      ///<summary>根据数据字典名称及字典项的键获取该键对应的值.</summary>
      ///<param name="dictkey" type="string">数据字典名称.</param>
      ///<param name="key" type="string">字典项的键.</param>
      ///<return type="JSONObject">数据项对象.</return>
      var dictItem = this.getDict(dictkey);
      if (dictItem) {
        var item = dictItem[key];
        if (!item) {
          item = "未定义:" + key;
        } else {
          if (item.text) {
            return item.text;
          } else {
            return item;
          }
        }
      } else {
        return "数据字典不存在";
      }
    }
    //根据数据字典名称及字典项的键获取该键对应的数据项
    , getDictItem: function (dictkey, key) {
      ///<summary>根据数据字典名称及字典项的键获取该键对应的数据项.</summary>
      ///<param name="dictkey" type="string">数据字典名称.</param>
      ///<param name="key" type="string">字典项的键.</param>
      ///<return type="JSONObject">数据项对象.</return>
      var dictItem = this.getDict(dictkey);
      if (dictItem) {
        return dictItem[key];
      } else {
        return undefined;
      }
    }
    , urlencode: function (text) {
      //text = text.replace( " ", "%20" );
      return encodeURI(text);
    }
    , monthFirst: function () {
      var date = new Date();
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      // return "" + year + "-" + (month < 10 ? "0" + month : month) + "-01 00:00:00";
      return "2016-01-01 00:00:00";
    }
    , monthLast: function () {
      var date = new Date();
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      if (month > 12) {
        year += 1;
        month = 1;
      } else {
        month += 1;
      }
      return "" + year + "-" + (month < 10 ? "0" + month : month) + "-01 00:00:00";
    }
  };

  Array.prototype.clear = function () {
    this.length = 0;
  }
  Array.prototype.insertAt = function (index, obj) {
    this.splice(index, 0, obj);
  }
  Array.prototype.removeAt = function (index) {
    this.splice(index, 1);
  }
  Array.prototype.remove = function (obj) {
    var index = this.indexOf(obj);
    if (index >= 0) {
      this.removeAt(index);
    }
  }
})(App);
/* ========================================================================
 * App.util.wgs84togcj02 v1.0
 * App.util.gcj02towgs84 v1.0
 * 坐标转换插件
 * ========================================================================
 * Copyright 2015-2025 WangXin nvlbs,Inc.
 * ======================================================================== */
(function (app) {
  /**
   * 提供了百度坐标（BD09）、国测局坐标（火星坐标，GCJ02）、和WGS84坐标系之间的转换
   */

  //定义一些常量
  var x_PI = 3.14159265358979324 * 3000.0 / 180.0;
  var PI = 3.1415926535897932384626;
  var a = 6378245.0;
  var ee = 0.00669342162296594323;

  /**
   * 百度坐标系 (BD-09) 与 火星坐标系 (GCJ-02)的转换
   * 即 百度 转 谷歌、高德
   * @param bd_lon
   * @param bd_lat
   * @returns {*[]}
   */
  function bd09togcj02(bd_lon, bd_lat) {
    var x = bd_lon - 0.0065;
    var y = bd_lat - 0.006;
    var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_PI);
    var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_PI);
    var gg_lng = z * Math.cos(theta);
    var gg_lat = z * Math.sin(theta);
    return [gg_lng, gg_lat]
  }

  /**
   * WGS84转GCj02
   * @param lng
   * @param lat
   * @returns {*[]}
   */
  function wgs84togcj02(lng, lat) {
    if (out_of_china(lng, lat)) {
      return [lng, lat]
    }
    else {
      var dlat = transformlat(lng - 105.0, lat - 35.0);
      var dlng = transformlng(lng - 105.0, lat - 35.0);
      var radlat = lat / 180.0 * PI;
      var magic = Math.sin(radlat);
      magic = 1 - ee * magic * magic;
      var sqrtmagic = Math.sqrt(magic);
      dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
      dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
      var mglat = lat + dlat;
      var mglng = lng + dlng;
      return [mglng, mglat]
    }
  }

  /**
   * GCJ02 转换为 WGS84
   * @param lng
   * @param lat
   * @returns {*[]}
   */
  function gcj02towgs84(lng, lat) {
    if (out_of_china(lng, lat)) {
      return [lng, lat]
    }
    else {
      var dlat = transformlat(lng - 105.0, lat - 35.0);
      var dlng = transformlng(lng - 105.0, lat - 35.0);
      var radlat = lat / 180.0 * PI;
      var magic = Math.sin(radlat);
      magic = 1 - ee * magic * magic;
      var sqrtmagic = Math.sqrt(magic);
      dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
      dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
      mglat = lat + dlat;
      mglng = lng + dlng;
      return [lng * 2 - mglng, lat * 2 - mglat]
    }
  }

  function transformlat(lng, lat) {
    var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
    ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0;
    ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0;
    return ret
  }

  function transformlng(lng, lat) {
    var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
    ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0;
    ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0;
    return ret
  }

  /**
   * 判断是否在国内，不在国内则不做偏移
   * @param lng
   * @param lat
   * @returns {boolean}
   */
  function out_of_china(lng, lat) {
    return (lng < 72.004 || lng > 137.8347) || ((lat < 0.8293 || lat > 55.8271) || false);
  }
  /**
   * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
   * 即谷歌、高德 转 百度
   * @param lng
   * @param lat
   * @returns {*[]}
   */
  app.util.gcj02tobd = function (lng, lat) {
    lng = lng / 3600000;
    lat = lat / 3600000;
    var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_PI);
    var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_PI);
    var bd_lon = z * Math.cos(theta) + 0.0065;
    var bd_lat = z * Math.sin(theta) + 0.006;
    return { "Lon": bd_lon, "Lat": bd_lat };
  };
  app.util.wgs84togcj02 = function (lon, lat) {
    return gcj02towgs84(lon, lat);
  };
  app.util.gcj02towgs84 = function (lon, lat) {
    return gcj02towgs84(lon, lat);
  }
})(App);
/* ========================================================================
 * App.base64 v1.0
 * base64转换插件 
 * ========================================================================
 * Copyright 2015-2025 WangXin nvlbs,Inc.
 * ======================================================================== */
(function (app) {
  var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var base64DecodeChars = new Array(
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
    52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
    -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
    -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);

  var base64encode = function (str) {
    var out, i, len;
    var c1, c2, c3;

    len = str.length;
    i = 0;
    out = "";
    while (i < len) {
      c1 = str.charCodeAt(i++) & 0xff;
      if (i == len) {
        out += base64EncodeChars.charAt(c1 >> 2);
        out += base64EncodeChars.charAt((c1 & 0x3) << 4);
        out += "==";
        break;
      }
      c2 = str.charCodeAt(i++);
      if (i == len) {
        out += base64EncodeChars.charAt(c1 >> 2);
        out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
        out += base64EncodeChars.charAt((c2 & 0xF) << 2);
        out += "=";
        break;
      }
      c3 = str.charCodeAt(i++);
      out += base64EncodeChars.charAt(c1 >> 2);
      out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
      out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
      out += base64EncodeChars.charAt(c3 & 0x3F);
    }
    return out;
  }

  var base64decode = function (str) {
    var c1, c2, c3, c4;
    var i, len, out;

    len = str.length;
    i = 0;
    out = "";
    while (i < len) {
      /* c1 */
      do {
        c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
      } while (i < len && c1 == -1);
      if (c1 == -1)
        break;

      /* c2 */
      do {
        c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
      } while (i < len && c2 == -1);
      if (c2 == -1)
        break;

      out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));

      /* c3 */
      do {
        c3 = str.charCodeAt(i++) & 0xff;
        if (c3 == 61)
          return out;
        c3 = base64DecodeChars[c3];
      } while (i < len && c3 == -1);
      if (c3 == -1)
        break;

      out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));

      /* c4 */
      do {
        c4 = str.charCodeAt(i++) & 0xff;
        if (c4 == 61)
          return out;
        c4 = base64DecodeChars[c4];
      } while (i < len && c4 == -1);
      if (c4 == -1)
        break;
      out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
    }
    return out;
  }

  var utf16to8 = function (str) {
    var out, i, len, c;

    out = "";
    len = str.length;
    for (i = 0; i < len; i++) {
      c = str.charCodeAt(i);
      if ((c >= 0x0001) && (c <= 0x007F)) {
        out += str.charAt(i);
      } else if (c > 0x07FF) {
        out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
        out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
        out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
      } else {
        out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
        out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
      }
    }
    return out;
  }

  var utf8to16 = function (str) {
    var out, i, len, c;
    var char2, char3;

    out = "";
    len = str.length;
    i = 0;
    while (i < len) {
      c = str.charCodeAt(i++);
      switch (c >> 4) {
        case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
          // 0xxxxxxx
          out += str.charAt(i - 1);
          break;
        case 12: case 13:
          // 110x xxxx   10xx xxxx
          char2 = str.charCodeAt(i++);
          out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
          break;
        case 14:
          // 1110 xxxx  10xx xxxx  10xx xxxx
          char2 = str.charCodeAt(i++);
          char3 = str.charCodeAt(i++);
          out += String.fromCharCode(((c & 0x0F) << 12) |
            ((char2 & 0x3F) << 6) |
            ((char3 & 0x3F) << 0));
          break;
      }
    }

    return out;
  }

  var CharToHex = function (str) {
    var out, i, len, c, h;
    out = "";
    len = str.length;
    i = 0;
    while (i < len) {
      c = str.charCodeAt(i++);
      h = c.toString(16);
      if (h.length < 2)
        h = "0" + h;

      out += "\\x" + h + " ";
      if (i > 0 && i % 8 == 0)
        out += "\r\n";
    }

    return out;
  }

  var doEncode = function (src) {
    return base64encode(utf16to8(src));
  }

  var doDecode = function (src, opt) {
    if (opt) {
      return CharToHex(base64decode(src));
    }
    else {
      return utf8to16(base64decode(src));
    }
  }

  app.base64 = {
    encode: function (str) {
      if (str) {
        try {
          return doEncode(str);
        } catch (ex) {
          console.log("[ERROR]App.base64.encode:" + ex.message);
          return "";
        }
      } else {
        return "";
      }
    }
    , decode: function (str) {
      if (str) {
        try {
          return doDecode(str, false);
        } catch (ex) {
          console.log("[ERROR]App.base64.decode:" + ex.message);
          return "";
        }
      } else {
        return "";
      }
    }
  };
})(App);
/* ========================================================================
 * App.confirm App.alert v1.0
 * 提示框组件（ALERT ： sweetalert） 
 * ========================================================================
 * Copyright 2015-2025 WangXin nvlbs,Inc.
 * ======================================================================== */
(function (app) {
  app.confirm = function (text, title, type, callback) {
    var options = {
      title: title,
      text: text,
      type: (type) ? type : "warning",
      showCancelButton: true,
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      closeOnConfirm: true,
      closeOnCancel: true
    }
    var feedback = function (isConfirm) {
      if (callback) {
        callback(isConfirm);
      }
    };
    swal(options, feedback);
  }
  app.alert = function (options) {
    if (options.callback) {
      swal({
        title: options.title,
        text: options.text,
        type: (options.type) ? options.type : "warning",
        showCancelButton: (options.callback == undefined),
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnConfirm: true,
        closeOnCancel: false
      },
        function (isConfirm) {
          if (options.callback) {
            options.callback(isConfirm);
          }
        });
    } else if (options.type) {
      swal(options.text, options.title, options.type);
    } else if (options.title) {
      swal(options.title, options.text);
    } else {
      swal({
        "title": options
        , "confirmButtonText": "确定"
      }
        , function (isConfirm) { });
    }
  };
})(App);
/* ========================================================================
 * App.block v1.0
 * 遮罩组件（BLOCKUI） 
 * ========================================================================
 * Copyright 2015-2025 WangXin nvlbs,Inc.
 * ======================================================================== */
(function (app) {
  var blockUI = function (options) {
    options = $.extend(true, { "message": "LOADING..." }, options);
    var html = "<div class=\"loading-message loading-message-boxed\"><img src=\"assets/img/loading-spinner-blue.gif\"><span>&nbsp;&nbsp;" + (options.message) + "</span></div>";
    var el = $(options.target);
    if (el.height() <= ($(window).height())) {
      options.cenrerY = true;
    }
    el.block({
      message: html,
      baseZ: options.zIndex ? options.zIndex : 30000,
      centerY: options.cenrerY !== undefined ? options.cenrerY : false,
      css: {
        top: "10%",
        border: "0",
        padding: "0",
        backgroundColor: "none"
      },
      overlayCSS: {
        backgroundColor: options.overlayColor ? options.overlayColor : "#555",
        opacity: options.boxed ? 0.05 : 0.1,
        cursor: "wait"
      }
    });
  }
  app.block = {
    /** 显示遮罩.
      *  
      * @params text      遮罩显示的提示信息
      * @params target    遮罩所指向的目标对象
      **/
    "show": function (text, target) {
      var blockTarget;
      if (target) {
        blockTarget = target;
      } else {
        blockTarget = $("body");
      }
      if (!blockTarget) {
        App.logger.error("BLOCK.ERROR:未找到BLOCK Target");
      }
      blockUI({ "target": blockTarget, "message": text });
    }
    /** 移除遮罩.
      *  @params target    遮罩所指向的目标对象
      **/
    , "close": function (target) {
      var blockTarget;
      if (target) {
        blockTarget = target;
      } else {
        blockTarget = $("body");
      }
      blockTarget.unblock({
        onUnblock: function () {
          blockTarget.css("position", "");
          blockTarget.css("zoom", "");
        }
      });
    }
  };
})(App);
/* ========================================================================
 * App.ajax v1.0
 * AJAX请求组件
 * ========================================================================
 * Copyright 2015-2025 WangXin nvlbs,Inc.
 * ======================================================================== */
(function (app) {
  //发起AJAX请求.
  var _ajax_request = function (api, options, callback) {
    /// <summary>发起AJAX请求.</summary>
    /// <param name="api">请求的接口.</param>
    /// <param name="options">请求附加的参数.
    /// <para>[可选结构] 1</para>
    /// <para>直接传入请求API时附带的参数.</para>
    /// <para>[可选结构] 2</para>
    /// <para>block       : 请求API时是否叠加遮罩.</para>
    /// <para>args        : 请求API时附带的参数.</para>
    /// <para>nowrap    : 请求API时参数是否使用S封装,即将参数改为s=参数json,默认为false,即使用S封装.</para>
    /// <para>nocache  : 请求API成功回调时,是否将结果缓存,默认为false,即缓存结果.</para>
    /// <para>error       : 请求返回时的异常处理函数 function(errorcode,message).</para>
    /// </param>
    /// <param name="callback">请求回调函数.
    /// <para>[可选结构] 1</para>
    /// <para>直接传入请求API成功时的回调函数.</para>
    /// <para>[可选结构] 2</para>
    /// <para>clear         : 清空表格数据(如果有表格) function().</para>
    /// <para>noneDate  : 表格中添加没有数据提示(如果有表格) function().</para>
    /// <para>success    : 请求API成功时的回调函数 function(json).</para>
    /// <para>[可选结构] 3</para>
    /// <para>不传入参数则视为调用默认参数 App.back().</para>
    /// </param>
    var block = true, cache = true, defaults = {}, cooike, errorParse;
    /*处理请求参数*/
    if (options && options.args) {
      /*处理附加参数*/
      if (options.block || options.block == false) { block = options.block; }
      if (options.nocache) { cache = false; }
      if (options.nowrap) {
        defaults = options.args;
      } else {
        defaults = options.args;//{ s: App.util.jsonToString(options.args) };
      }
      if (options.error) {
        errorParse = options.error;
      }
    } else if (options != null) {
      /*处理无附加参数*/
      defaults = options;//{ s: App.util.jsonToString(options) };
    }
    /* 读取本地COOKIE,校验是否已经登录用户*/
    cooike = App.readCookie();
    if (cooike) {
      defaults.token = cooike.token;/*已登录,则发送请求时需要传入TOKEN*/
    }
    /*处理遮罩*/
    if (block) { App.block.show("正在处理中..."); }
    var timestamp = Date.parse(new Date());
    defaults.timestamp = timestamp;
    /* 处理调试模式 */
    var options = defaults;/*公网部署请求参数*/
    /* 请求成功后的回调函数。 */
    var onSuccess = function (json, textStatus, jqXHR) {
      if (block) { App.block.close(); } // 关闭
      App.logger.debug(App.util.jsonToString(json));
      if (errorParse) {
        var result = errorParse(json.ret, json.msg)
        if (!result) {
          return;
        }
      }
      var hasError = true;
      if (json.ret) {
        var error = bus_cfgs.dict.errorCode[json.ret];
        if (error) {
          App.alert(error);
        } else if (json.ret == "1") {
          App.alert({
            "title": "登录超时!"
            , "text": "错误代码:" + json.ret
            , "callback": function (isok) {
              App.route.gotoLogin();
            }
          });
        } else if (json.ret != "0") {
          if (json.msg != "") {
            App.alert(App.base64.decode(json.msg));
          } else {
            App.alert({ "title": "其他未知错误!", "text": "错误代码:" + json.ret });
          }
        } else {
          hasError = false;
        }
      } else if (json.data) {
        hasError = false;
      }
      if (!hasError) {
        /* 判断是否需要记录缓存 */
        if (cache) {
          /* 清空历史缓存 */
          pageOptions.buffer = {
            "pagecount": (json.data && json.data.count) ? json.data.count : 1
            , "pageindex": pageOptions.requestOptions.pageindex
            , "data": []
          };
          if (json.data && json.data.pList && json.data.pList.length > 0) {
            /* 如果返回结果为列表数据则记录缓存 */
            $.each(json.data.pList, function (index, item) { pageOptions.buffer.data[index] = item; });
          }
        }//if (cache) {
        if (callback) {
          if (json.data && ((!json.data.pList && (callback.clear || callback.noneDate)) || (json.data.pList && json.data.pList == 0))) {
            if (callback.clear) { callback.clear(); }
            if (callback.noneDate) { callback.noneDate(); }
          } else if (callback.success) {
            callback.success(json);
          } else {
            callback(json);
          }
        } else {
          App.back();
        }
      }
    }
    //处理HTTP请求异常
    var onRequestError = function (XMLHttpRequest, textStatus, errorThrown) {
      /// <summary>处理HTTP请求异常.<para>请求失败时调用此函数.</para></summary>
      App.block.close();
      App.logger.info("请求失败:" + XMLHttpRequest.status);
      if (XMLHttpRequest.status == "404") {
        App.alert("请求地址不存在!");
      } else if (XMLHttpRequest.status == "500") {
        App.alert({ "title": "服务端异常!", "text": "CODE:500" });
      } else if (XMLHttpRequest.status == "502") {
        App.alert({ "title": "服务端异常!", "text": "CODE:502" });
      } else if (XMLHttpRequest.statusText) {
        if (XMLHttpRequest.statusText == "NetworkError") {
          App.alert({ "title": "网络连接错误", "text": "请检查是否已经连接网络.\r\n请检查网络地址是否存在.\r\n请检查服务端是否存在跨域问题." });
        } else if (cfgs.debug && errorThrown && errorThrown.name == "NS_ERROR_FAILURE") {
          var json = prompt("请输入JSON内容");
          onSuccess(JSON.parse(json), null, null);
        } else if (cfgs.debug) {
          App.alert({ "title": "系统错误", "text": XMLHttpRequest.statusText });
        }
      } else {
        App.alert(textStatus);
      }
    }
    /* AJAX请求选项 */
    var ajaxOptions = {
      "type": "GET"
      , "dataType": "json"
      , "crossDomain": true
      , "success": onSuccess
      , "error": onRequestError
      , "url": api
      , "data": options
    }
    /*设置请求超时*/
    if (bus_cfgs.options.request.timeout) {
      ajaxOptions.timeout = bus_cfgs.options.request.timeout;
    }
    if (callback) {
      /*清空表格内容*/
      if (callback.clear) { callback.clear(); }
      /*显示无数据内容*/
      if (callback.noneDate) { callback.noneDate(); }
    }
    App.logger.debug("准备请求." + ajaxOptions.url + ",参数:" + App.util.jsonToString(ajaxOptions.data));

    /*执行操作请求*/
    $.ajax(ajaxOptions);
  };

  app.ajax = function (api, options, callback) {
    _ajax_request(api, options, callback);
  };
  //支持缓存的列表请求方法.通常用于请求字典数据.
  app.ajaxListCached = function (options) {
    /// <summary>支持缓存的列表请求方法.通常用于请求字典数据.</summary>
    /// <param name="options" type="string"> 参数设置
    ///   <para>[可选结构]</para>
    ///   <para>api       请求的服务地址.</para>
    ///   <para>args      请求时附带的参数.</para>
    ///   <para>cached    是否缓存数据,boolean,默认为true.</para>
    ///   <para>target    承载内容的元素selector,通常为select</para>
    ///   <para>valuefn   返回value内容的方法,function(index,item) return string</para>
    ///   <para>textfn    返回text内容的方法,function(index,item) return string</para>
    ///   <para>parsefn   请求成功后解析数据的方法 function(index,item).该属性与target\valuefn\textfn冲突仅设置一种</para>
    ///   <para>done      解析数据完成后执行的反馈 function().</para>
    /// </param>
    if (!options.api) {
      App.alert("未设置数据服务地址!");
      return;
    }
    if (!options.args) {
      options.args = {};
    }
    if (options.cached == undefined) {
      options.cached = true;
    }
    var parse = function (index, item) {
      if (options.parsefn) {
        options.parsefn(index, item);
      } else if (options.target && options.textfn && options.valuefn) {
        var value = options.valuefn(index, item);
        var text = options.textfn(index, item);
        var opotion = $("<option/>").val(value).text(text);
        options.target.append(opotion);
      }
    }
    if (bus_cfgs.cache[options.api] && options.cached) {
      //App.logger.info( "Cached:" + options.api );
      $.each(bus_cfgs.cache[options.api], function (index, item) {
        parse(index, item);
      });
      if (options.done) {
        options.done();
      }
    } else {
      //App.logger.info( "UnCached:" + options.api );
      _ajax_request(options.api, {
        "nocache": true,
        "args": options.args,
        "block": false
      }, function (json) {
        bus_cfgs.cache[options.api] = json.data.list;
        $.each(json.data.list, function (index, item) {
          parse(index, item);
        });
        if (options.done) {
          options.done();
        }
      });
    }
  }
})(App);
/* ========================================================================
 * App.dialog v1.0
 * 模式窗口对话框组件
 * ========================================================================
 * Copyright 2015-2025 WangXin nvlbs,Inc.
 * ======================================================================== */
(function (app) {
  // 以模式窗口方式打开功能界面
  var modals = { "modal1": 0, "modal2": 0, "modal3": 0 }; // 当前对话框容器 
  $('body').on('hidden.bs.modal', '.modal', function () {
    if ($('.modal:visible').size() > 1 && $('html').hasClass('modal-open') === false) {
      $('html').addClass('modal-open');
    } else if ($('.modal:visible').size() <= 1) {
      $('html').removeClass('modal-open');
      $('html').removeClass('task');
      $('html').removeClass('login');
    }
  });
  $('body').on('hide.bs.modal', '.modal', function () {
    $('body').removeClass("modal-open-noscroll");
  });
  $('body').on('hidden.bs.modal', '.modal:not(.modal-cached)', function () {
    $(this).removeData('bs.modal');
  });
  $.fn.modal.defaults.spinner = $.fn.modalmanager.defaults.spinner =
    '<div class="loading-spinner" style="width: 200px; margin-left: -100px;">' +
    '<div class="progress progress-striped active">' +
    '<div class="progress-bar" style="width: 100%;"></div>' +
    '</div>' +
    '</div>';
  $.fn.modalmanager.defaults.resize = true;
  /*-----------------------------------------------------------------------------------*/
  /*  对话框组件.
  /*-----------------------------------------------------------------------------------*/
  app.dialog = {
    /*-----------------------------------------------------------------------------------*/
    /*  加载内容的对话框.
    /*@params options   参数设置.
    /*[可选结构]
    /*  url       : 包含对话框内容的文件地址;
    /*  callback  : 操作完成反馈 function().
    /*  args      : 
    /*  done      : 加载完成处理函数 function(options);
    /*-----------------------------------------------------------------------------------*/
    "load": function (options) {
      var defaults = { "url": "", "callback": "", "done": function (options) { } };
      var options = $.extend(defaults, options);
      var modal = $('#modal');
      $('body').modalmanager('loading');
      // 加载完成回调函数
      var _load_callback = function () {
        var m;
        if (options.args) {
          m = modal.modal(options.args);
        } else {
          m = modal.modal();
        }

        var footer = $(".modal-footer", modal);
        var header = $(".modal-header", modal);
        var body = $(".modal-body", modal);

        if (App.isTouchDevice == false) {
          // 计算dialog内部滚动条高度
          var height = modal.height() - footer.height() - header.height() - 31;
          body.attr("data-height", height);
          App.initSlimScroll(body);
        }
        if (options.callback) {
          if (typeof options.callback === 'function') {
            options.callback(modal.attr("id"));
          } else {
            try {
              eval(options.callback + "('" + modal.attr("id") + "')");
            } catch (ex) { App.alert(ex.message); }
          }
        }
        App.form.init(modal);

        if (options.done) {
          var doneoptions = {
            "parent": modal.attr("id")
            , "height": modal.height()
            , "header": { "height": header.height() }
            , "fotter": { "height": footer.height() }
            , "modal": modal
            , "hideModel": function () { modal.modal('hide'); }
          };
          options.done(doneoptions);
        }
      };

      modal.load(options.url, '', _load_callback);
    }
    , "close": function () {
      $('#modal').modal('hide');
    }
  };
})(App);
/* ========================================================================
 * App.table v1.0
 * App.cell v1.0
 * App.row v1.0
 * 表格处理插件
 * ========================================================================
 * Copyright 2015-2025 WangXin nvlbs,Inc.
 * ======================================================================== */
(function (app) {
  //分页相关设置:从configs/cfgs.js中读取
  var cfgs_page = bus_cfgs.options.page;
  //初始化表格注册按钮事件.
  var _regist_table = function (target, options) {
    /// <summary>初始化表格注册按钮事件.</summary>
    /// <param name="options">请求参数选项.
    /// <para>pagecount : 页面总数.</para>
    /// <para>pageindex : 当前页面索引.</para>
    /// </param>
    var defaults = { "pagecount": "1", "pageindex": "1" };
    var paginationKey = "pagination_" + target.attr("id");
    var pagination = "." + paginationKey;
    var options = $.extend(defaults, options);
    // 仅有1页时,删除分页内容
    if (options.pagecount == 1) {
      $(pagination).remove();
      return;
    }
    // 处理分页组件
    if ($(pagination).length == 0) {
      $("<ul />").addClass("pagination pagination-sm pull-right" + " " + paginationKey).appendTo(target.parent().parent());
    }
    $(pagination).empty();

    var paper_index = options.pageindex * 1;
    var paper_count = 5;
    var begin = paper_index - 2;
    var end = paper_index + 2;
    var li = $("<li />").appendTo($(pagination));
    $("<a href=\"#\"/>").html(cfgs_page.texts.first).attr("data-index", 1).appendTo(li);
    if (paper_index == 1) { li.addClass("disabled"); }
    li = $("<li />").appendTo($(pagination));
    $("<a href=\"#\"/>").html(cfgs_page.texts.priv).attr("data-index", paper_index - 1).appendTo(li);
    if (paper_index == 1) { li.addClass("disabled"); }
    if (begin < 1) {
      if (paper_count <= options.pagecount) { end = paper_count; }
      else { end = options.pagecount; }
      begin = 1;
    } else if (end >= options.pagecount) {
      end = options.pagecount;
      begin = end - paper_count + 1;
      if (begin < 1) { begin = 1; }
    }
    for (; begin <= end; begin++) {
      li = $("<li />").appendTo($(pagination));
      $("<a href=\"#\"/>").data("index", begin).text(begin).appendTo(li);
      if (paper_index == begin) { li.addClass("active"); }
    }
    li = $("<li />").appendTo($(pagination));
    $("<a href=\"#\"/>").html(cfgs_page.texts.next).data("index", (paper_index + 1)).appendTo(li);
    if (paper_index == options.pagecount) { li.addClass("disabled"); }
    li = $("<li />").appendTo($(pagination));
    $("<a href=\"#\"/>").html(cfgs_page.texts.last).data("index", options.pagecount).appendTo(li);
    if (paper_index == options.pagecount) { li.addClass("disabled"); }
    // 注册内容中的点击事件
    $(pagination + ">li>a").on("click", function (e) {
      if ($(this).parent().hasClass("active") || $(this).parent().hasClass("disabled")) { return; }
      var index = $(this).data("index");
      current_pageindex = index;
      re_common_load_data(index);
    });
  };
  //将缓存中的数据填充至表格
  var displayTable = function (target) {
    /// <summary>将缓存中的数据填充至表格.</summary>
    var start_index = (pageOptions.paperOptions.start - 1) * pageOptions.paperOptions.limit + 1;/* 生成页面数据起始索引 */
    $("tbody", target).empty();
    if (pageOptions.buffer.data.length > 0) {
      $.each(pageOptions.buffer.data, function (index, item) {/* 填充数据*/
        // if (index >= 10) { return;}
        pageOptions.requestOptions.parsefn($("<tr />").appendTo(target), index, start_index + index, item);
      });
    }
    var count = pageOptions.buffer.pagecount / pageOptions.paperOptions.limit;
    if (parseInt(count) != count) {
      count = parseInt(count) + 1;
    }
    $(":checkbox,:radio", target).uniform();
    _regist_table(target, { "pagecount": count, "pageindex": pageOptions.paperOptions.start });
  }
  //公共数据处理:回调parsefn填充数据并且生成分页按钮
  var common_load_data = function (options) {
    /// <summary>公共数据处理:回调parsefn填充数据并且生成分页按钮.</summary>
    /// <param name="options">请求参数选项.
    /// <para> api            : 请求数据的地址</para>
    /// <para> args           : 请求API附带的参数</para>
    /// <para> pageindex      : 分页索引</para>
    /// <para> parsefn        : 填充表格的解析函数,参数为新增的列,列索引,列数据索引,数据内容对象</para>
    /// <para> token          : 请求的TOKEN,默认为当前用户TOKEN</para>
    /// <para> target         : 目标表格</para>
    /// </param>
    /* 缓存最后一次操作，用于删除数据后重新加载 */
    pageOptions.requestOptions = options;
    // 设置分页默认请求，limit：页面大小（即每页显示的记录数）
    var defaults = { "start": 1, "limit": bus_cfgs.options.page.size };
    var reqOptions = $.extend(defaults, options.args);
    if (options.pageindex) {
      reqOptions.start = options.pageindex;
    }
    pageOptions.paperOptions = reqOptions;
    var callback = {
      /*操作成功-填充列表数据*/
      "success": function (json) {
        displayTable(options.target);
      }
      /*清空表格数据*/
      , "clear": function () {
        $("tbody", options.target).empty();
      }
      /*数据为空-追加空数据行*/
      , "noneDate": function () {
        var tr = $("<tr />").appendTo(options.target);
        $("<td/>").text("没有数据")
          .attr("colspan", $("thead>tr>th", options.target).length)
          .appendTo(tr);
        _regist_table(options.target, { "pagecount": 1, "pageindex": 1 });
      }
    };
    app.ajax(options.api, reqOptions, callback);
  }
  //使用common_load_data前一次参数重新加载并处理数据
  var re_common_load_data = function (pageindex) {
    /// <summary>使用common_load_data前一次参数重新加载并处理数据.</summary>
    /// <param name="pageindex" type="int">请求新页面的索引</param>
    if ($("#table").length == 0) {
      return;
    }
    if (pageOptions.requestOptions) {
      if (pageindex) {
        pageOptions.requestOptions.pageindex = pageindex;
      }
      common_load_data(pageOptions.requestOptions);
    }
  }
  //根据缓存数据索引获取数据内容
  var getData = function (index) {
    /// <summary>根据缓存数据索引获取数据内容.</summary>
    /// <param name="index" type="int">缓存数据的索引.</param>
    if (pageOptions.buffer && pageOptions.buffer.data.length > 0) {
      return pageOptions.buffer.data[index];
    } else {
      return;
    }
  }

  var rander = function (target, columns) {
    target.addClass("datatable table table-striped table-bordered table-hover");
    target.wrapAll("<div class=\"table-scrollable\"></div>");
    //target.wrapAll("<div></div>");
    //var width = target.width();
    //target.parent().attr("data-width", width);
    //App.initSlimScroll(target.parent());

    var thead = $("<thead/>").appendTo(target);
    var tbody = $("<tbody/>").appendTo(target);

    var tr = $("<tr/>").appendTo(thead);
    $.each(columns, function (index, column) {
      $("<th/>").text(column).addClass("center").appendTo(tr);
    });
  }

  //根据options设置内容,创建一个新的功能按钮
  var createAction = function (options) {
    ///<summary>根据options设置内容,创建一个新的功能按钮.</summary>
    ///<param name="options" type="JSONObject">参数选项.
    ///<para>action           按钮动作关键字.</para>
    ///<para>style            按钮样式关键字.</para>
    ///<para>text             按钮文本关键字.</para>
    ///<para>api              请求服务的地址</para>
    ///<para>args             请求服务时附带的参数 JSON格式</para>
    ///<para>callback         请求服务成功时的回调函数字符串 functionname(args)</para>
    ///<para>error            请求服务返回时的附加错误码处理函数字符串 functionname(args) return boolean</para>
    ///<para>page             加载的页面</para>
    ///<para>confirmmsg       操作确认提示内容.</para>
    ///<para>func             按钮点击后执行的方法 functionstring.</para>
    ///</param>
    ///<return type="jqueryObject">功能按钮对象.</return>
    var action = $("<a />");
    action.addClass(bus_cfgs.options.styles.default);
    if (options.action) { action.addClass(options.action); }
    if (options.text) { action.html(bus_cfgs.options.texts[options.text]); }
    if (options.style) { action.addClass(bus_cfgs.options.styles[options.style]); }
    if (options.api) { action.attr("href", options.api); }
    else { action.attr("href", "javascript:;"); }
    if (options.args) { action.attr("data-args", options.args); }
    if (options.callback) { action.attr("data-callback", options.callback); }
    if (options.func) { action.attr("data-func", options.func); }
    if (options.error) { action.attr("data-error", options.error); }
    if (options.page) { action.attr("data-page", options.page); }
    if (options.confirmmsg) { action.attr("data-confirmmsg", options.confirmmsg); }
    return action;
  }
  app.cell = {
    "addAction": function (td, textKey, index, onClick) {
      var action = $("<a />").appendTo(td);
      action.html(bus_cfgs.options.texts[textKey]);
      action.on("click", onClick);
      action.attr("data-args", index);
      return action;
    }
  };

  app.row = {
    "addText": function (tr, text) { $(bus_cfgs.templates.cell).text(text).appendTo(tr); }
    , "addBase64Text": function (tr, text) { this.addText(tr, App.base64.decode(text)); }
    , "addDictText": function (tr, dict, text) { this.addText(tr, App.util.getDictText(dict, text)); }
    , "addCheckText": function (tr, args, text, group) {
      var ctrl = $("<input type='checkbox'/>");
      ctrl.data("args", args);
      var cell = this.createCell(tr);
      cell.append(ctrl);
    }
    , "addRadioText": function (tr, args, text, group) {
      var ctrl = $("<input type='radio'/>");
      ctrl.data("args", args);
      ctrl.attr("name", group);
      var cell = this.createCell(tr);
      cell.append(ctrl);
    }
    , "createCell": function (tr) { return $(bus_cfgs.templates.cell).appendTo(tr); }
  };
  app.table = {
    //公共数据处理:回调parsefn填充数据并且生成分页按钮
    "load": function (options) {
      common_load_data(options);
    }
    //根据缓存数据索引获取数据内容
    , "getdate": function (index) {
      return getData(index);
    }
    , "render": function (target, columns) { rander(target, columns); }
    , "export": function (type, target) {
      App.alert("导出" + type + ":尚未实现");
    }
    , "exportCSV": function (target) { this.export("csv", target); }
  };
})(App);
/* ========================================================================
 * App.form v1.0
 * 表单处理插件
 * ========================================================================
 * Copyright 2015-2025 WangXin nvlbs,Inc.
 * ======================================================================== */
(function (app) {
  var readStyle = function (keyword) {
    if (bus_cfgs.options.styles[keyword]) {
      return bus_cfgs.options.styles[keyword];
    } else {
      return bus_cfgs.options.styles.default;
    }
  }
  app.form = {
    "initDict": function (dict, target, hasAll, defaultvalue) {
      var firstValue;
      $.each(bus_cfgs.dict[dict], function (index, item) {
        if (!hasAll && index == "") { return; }
        if (!firstValue) { firstValue = index }
        target.append($("<option/>").val(index).text((item.text) ? item.text : item));
      });
      if (hasAll) {
        if (defaultvalue) {
          target.val(defaultvalue);
          target.select2("val", defaultvalue);
        } else {
          target.val("");
          target.select2("val", "");
        }
      } else {
        if (defaultvalue) {
          target.val(defaultvalue);
          target.select2("val", defaultvalue);
        } else if (firstValue) {
          target.val(firstValue);
          target.select2("val", firstValue);
        }
      }
    }
    //初始化页面元素
    , "init": function (parent) {
      // 批量设置按钮文字及图标
      $.each(bus_cfgs.options.texts, function (key, value) {
        $("#" + key, parent).each(function () {
          $(this).html(value).addClass(readStyle(key));
        });
      });
      // 查询按钮
      $("#doSearch", parent)
        .html(bus_cfgs.options.texts.btn_search)
        .addClass(readStyle("btn_search"));
      // 导出按钮
      $("#doExport", parent)
        .html(bus_cfgs.options.texts.btn_export)
        .addClass(readStyle("btn_export"));
      // 重置按钮
      $("#doReset", parent)
        .html(bus_cfgs.options.texts.btn_reset)
        .addClass(readStyle("btn_reset"));
      // 注册页面控件
      $("select", parent).select2(bus_cfgs.options.select2);
      $(":checkbox,:radio", parent).uniform();
      // 初始化日期时间控件
      $(".form_date,.form_datetime", parent).each(function (index, item) {
        var wrapper = $("<div></div>").addClass("input-group date");
        var span = $("<span></span>").addClass("input-group-btn");
        var button = $("<a></a>").addClass("btn btn-default date-set");
        button.append($("<i></i>").addClass("fa fa-calendar"));
        span.append(button);
        $(this).wrapAll(wrapper);
        $(this).parent().append(span);
        if ($(this).hasClass("form_datetime")) {
          $(this).parent().datetimepicker(bus_cfgs.options.datetimepicker);
        } else {
          $(this).parent().datetimepicker(bus_cfgs.options.datepicker);
        }
      });
      // 初始化工具栏菜单
      $(".portlet > .portlet-title > .tools", parent).each(function () {
        var fullscreen = $("<a></a>").appendTo($(this));
        fullscreen.attr("href", "javascript:");
        fullscreen.addClass("fullscreen");
        fullscreen.append($("<i></i>").addClass("icon-size-fullscreen"));
        fullscreen.on("click", function () {
          if ($("i", $(this)).hasClass("icon-size-fullscreen")) {
            $("i", $(this)).removeClass("icon-size-fullscreen").addClass("icon-size-actual");
          } else {
            $("i", $(this)).removeClass("icon-size-actual").addClass("icon-size-fullscreen");
          }
        });

        var collapse = $("<a></a>").appendTo($(this));
        collapse.attr("href", "javascript:");
        collapse.addClass("collapse");
        collapse.append($("<i></i>").addClass("fa fa-angle-up"));
        collapse.on("click", function () {
          if ($("i", $(this)).hasClass("fa fa-angle-down")) {
            $("i", $(this)).removeClass("fa fa-angle-down").addClass("fa fa-angle-up");
          } else {
            $("i", $(this)).removeClass("fa fa-angle-up").addClass("fa fa-angle-down");
          }
        });
      });
    }
  };
})(App);
/* ========================================================================
 * App.services v1.0
 * APP组件
 * ========================================================================
 * Copyright 2015-2025 WangXin nvlbs,Inc.
 * ======================================================================== */
(function (app) { app.services = {}; })(App);
/* ========================================================================
 * App.plugins v1.0
 * APP插件
 * ========================================================================
 * Copyright 2015-2025 WangXin nvlbs,Inc.
 * ======================================================================== */
(function (app) {
  app.plugins = {
    "statistics": {}      // 统计插件
    , "reports": {}       // 报表插件
  };
})(App);

/* ========================================================================
 * App.route v1.0
 * 页面导航组件
 * ========================================================================
 * Copyright 2016-2026 WangXin nvlbs,Inc.
 * 
 * ======================================================================== */
(function (app) {
  app.route = {
    "back": function () {
      /// <summary>返回前一页面.</summary>
      // auto_navigation( pageOptions.menus );
    }
    , "gotoLogin": function () {
      /// <summary>导航至登录界面.</summary>
      App.saveCookie("");
      App.autorun.stop();
      var _initialize = function (parent) {
        var parentView = $("#" + parent);
        $("button", parentView).on("click", function (e) {
          e.preventDefault();
          var username = $("#inputusername", parentView).val();
          var password = $("#inputpassword", parentView).val();
          if (!username || username == "") {
            App.alert("账号不能为空!");
            return;
          }
          if (!password || password == "") {
            App.alert("密码不能为空!");
            return;
          }
          var options = {
            "loginname": username//App.base64.encode(username)
            , "pwd": $.md5(App.base64.encode(password))
          };
          var callback = function (json) {
            App.saveCookie(json);
            App.route.gotoMain();
            App.dialog.close();
          };
          App.ajax(bus_cfgs.master.loginapi, options, callback);
        });
      }
      $('html').addClass('login');
      App.dialog.load(
        {
          "args": { "width": 400, "height": 350 }
          , "url": bus_cfgs.master.loginpage
          , "callback": _initialize
        });
    }
    , "gotoMain": function () {
      console.log("gotomain");
      /// <summary>导航至系统主界面.</summary>
      setTimeout(function () {
        App.plugins.siderbar.hide();
        App.plugins.siderbar.checklog.hide();
        App.plugins.menu.init();
        App.plugins.siderbar.init();
        App.autorun.start();
      }, 500);
    }
    , "changepwd": function () {
      /// <summary>导航至修改密码界面.</summary>
      var _initialize = function (parent) {
        var parentView = $("#" + parent)
        if (App.userinfo) {
          $("#username", parentView).val(App.userinfo.loginname);
        }
        // 处理确定按钮事件
        $("button", parentView).on("click", function (e) {
          e.preventDefault();
          var oldpwd = $("#oldpwd", parentView).val();
          var newpwd = $("#newpwd", parentView).val();
          var newpwd2 = $("#newpwd2", parentView).val();
          if (oldpwd == "") {
            App.alert("原始密码不能为空!");
            return;
          }
          if (newpwd == "") {
            App.alert("新密码不能为空!");
            return;
          }
          if (newpwd != newpwd2) {
            App.alert("两次密码输入不一致,请核实后重新输入!");
            return;
          }

          // var options = {
          //     "new": $.md5( App.base64.encode( newpwd ) )
          //     , "old": $.md5( App.base64.encode( oldpwd ) )
          // };
          // App.ajax( bus_cfgs.master.changepwdapi, options, function ( json ) {
          //     App.dialog.close(); // 关闭模式窗口
          //     App.route.gotoLogin();
          // } );
        });
      };
      $('html').addClass('login');
      App.dialog.load(
        {
          "args": { "width": 400, "height": 380 }
          , "url": "views/changepwd.html", "callback": _initialize
        });
    }
  };
})(App);

/* ========================================================================
 * App.autorun v1.0
 * 持续运行组件
 * ========================================================================
 * Copyright 2016-2026 WangXin nvlbs,Inc.
 * 
 * ======================================================================== */
(function (app) {
  var handers = [];
  var isRunning = false;
  var runHandler = function () {
    $.each(handers, function (index, item) {
      item.call();
    });
    if (isRunning) {
      setTimeout(runHandler, bus_cfgs.options.request.monitor);
    }
  }
  app.autorun = {
    "add": function (fn) { handers.push(fn); }
    , "stop": function () { isRunning = false; }
    , "start": function () {
      if (!isRunning) {
        isRunning = true;
        runHandler();
      }
    }
  }
})(App);