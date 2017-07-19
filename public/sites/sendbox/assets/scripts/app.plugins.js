/* ========================================================================
 * App.plugins.menu v1.0
 * 菜单相关插件
 * ========================================================================
 * Copyright 2015-2025 WangXin nvlbs,Inc.
 * ======================================================================== */
(function (app) {
  var buffer_route = [];
  var suidao_route = [];
  var _chk_index = 0;

  // 注册header->checkbox 点击事件，处理选中内容
  $(document).on('click', 'input[type="checkbox"]', function (e) {
    var checked = $(this)[0].checked;

    var menu = $('.open ');
    var id = $(this).parent().parent().data('id');;
    if (menu.hasClass('bridge')) {
      onBridgeMenuClick(id);
    } else if (menu.hasClass('channel')) {
      onSuiDaoMenuClick(id);
    }

    if (checked) {
      var checkeds = $('.open :checked');
      if (checkeds.length > 5) {
        $(this)[0].checked = false;
        App.alert({
          "title": "最多选5个",
          "callback": () => {
            setTimeout(() => {
              menu.addClass('open');
            }, 50);
          }
        });
      }
    }

  });

  // 初始化顶部横向菜单
  var initHorMenu = function () {
    var container = $("header>ul");
    $("header>ul").empty();
    $.each(cfgs.topmenu, function (index, item) {
      var parent = $("<li/>").appendTo(container);

      if (item.id) {
        parent.addClass(item.id);
      }
      var menu = $("<a/>");

      if (item.icon) {
        menu.append($("<i/>").addClass(item.icon));
        menu.append(" ");
      }
      if (item.text) {
        menu.append($("<span/>").html(item.text));
        menu.append(" ");
      }
      parent.append(menu);

      if (item.script) {
        menu.attr("data-action", item.script).addClass("dialog");
      } else if (item.refresh) {
        menu.attr("data-action", item.refresh)
          .addClass("refresh")
          .attr("href", "javascript:;")
          .attr("data-toggle", "dropdown");
      } else {
        menu.attr("href", "javascript:;").attr("data-toggle", "dropdown");
      }

      if (item.search || item.children) {
        var menuContainer = $("<ul/>").addClass("pull-left");
        menu.append($("<i/>").addClass("fa fa-angle-down"));

        if (item.search) {
          menuContainer.addClass("search");
          // var childmenu = $("<li/>").appendTo(menuContainer);
          var group = $("<div/>").addClass("input-group").appendTo(menuContainer);
          var text = $("<input/>").attr("type", "text").addClass("form-control")
            .attr("data-action", item.search)
            .attr("placeholder", "输入关键字查询...").appendTo(group);
          text.on("keyup", function () {
            var action = $(this).attr("data-action");
            var keyword = text.val();
            eval("App.plugins.menu." + action + "('" + keyword + "')");
          });
          var button = $("<a/>").attr("href", "javascript:;")
            .attr("data-action", item.search)
            .append($("<i/>").addClass("icon-magnifier"))
            .appendTo($("<span/>").addClass("input-group-btn").appendTo(group));
          button.on("click", function () {
            var action = $(this).attr("data-action");
            var keyword = text.val();
            eval("App.plugins.menu." + action + "('" + keyword + "')");
          });
        }

        if (item.children) {
          $.each(item.children, function (cindex, citem) {
            var childmenu = $("<li/>").appendTo(menuContainer);
            var childmenulink = $("<a/>").appendTo(childmenu);

            if (citem.children) {
              // childmenulink.attr("data-toggle", "dropdown");
              var level2menuContainer = $("<ul/>").appendTo(childmenu);
              $.each(citem.children, function (level2index, level2item) {
                var level2menu = $("<li/>").appendTo(level2menuContainer);
                var level2menulink = $("<a/>").appendTo(level2menu);
                if (level2item.script) {
                  level2menulink.attr("data-action", level2item.script).addClass("dialog");
                } else {
                  level2menulink.attr("href", "javascript:;");
                }
                if (level2item.icon) {
                  level2menulink.append($("<i/>").addClass(level2item.icon));
                  level2menulink.append(" ");
                }
                if (level2item.text) {
                  level2menulink.append(level2item.text);
                }
              });
              // level2menuContainer.addClass('sub-menu');
              childmenulink.attr("href", "javascript:;").addClass("sub-menu");
            } else if (citem.script) {
              childmenulink.attr("data-action", citem.script).addClass("dialog");
            } else {
              childmenulink.attr("href", "javascript:;");
            }

            if (citem.icon) {
              childmenulink.append($("<i/>").addClass(citem.icon));
              childmenulink.append(" ");
            }
            if (citem.theme) {
              childmenu.addClass(citem.theme);
              childmenulink.append($("<span/>").addClass("icon").append($("<i/>").addClass(item.icon)));
              childmenulink.append(" ");
            }
            if (citem.text) {
              childmenulink.append(citem.text);
            }
            if (citem.code) {
              childmenulink.append($("<span/>").addClass("tag").text(citem.code));
            }
            if (citem.tags) {
              $.each(citem.tags, function (tindex, titem) {
                createTag(titem).appendTo(childmenulink);
              });
            }
          });
        }
      }

      parent.append(menuContainer);
    });
  }

  var initform = function () {
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
    var stopClose = false;
    $(".sub-menu:parent").hover(
      function () {
        stopClose = false;
        $(this).parent().addClass("open");
      },
      function () {
        var that = $(this);
        setTimeout(function () {
          if (!stopClose) {
            that.parent().removeClass("open");
          }
        }, 200);
      }
    );
    $(".sub-menu").next().hover(
      function () {
        stopClose = true;
        $(this).parent().addClass("open");
      },
      function () {
        stopClose = false;
        $(this).parent().removeClass("open");
      }
    );
    // $(document).on('click', '.sub-menu', function (e) {
    //   e.stopPropagation();
    //   var a = $(this).parent().parent().prev();
    //   var li = a.parent();
    //   setTimeout(function () {
    //     a.attr('aria-expanded', true);
    //     li.addClass('open');
    //   }, 200);
    //   $(this).parent().addClass("open");
    // });

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
  }

  var appendHorMenu = function (id, items, fn) {
    var container = $("header>ul>." + id + ">ul");
    $("li", container).remove();
    $.each(items, function (cindex, citem) {
      _chk_index = _chk_index + 1;
      var childmenu = $("<li/>").appendTo(container);
      var childmenulink = $("<a/>").appendTo(childmenu);

      // if (fn) {
      //   childmenu.on("click", fn);
      // }

      if (citem.id) {
        childmenu.attr("data-id", citem.id)
      }
      if (citem.script) {
        childmenulink.attr("data-action", citem.script).addClass("dialog");
      } else {
        childmenulink.attr("href", "javascript:;");
      }

      if (citem.icon) {
        childmenulink.append($("<i/>").addClass(citem.icon));
        childmenulink.append(" ");
      }
      var chkbox = $('<input type="checkbox"/>').attr('id', "chk" + _chk_index);
      childmenulink.append(chkbox);

      if (citem.theme) {
        childmenu.addClass(citem.theme);
        var _chk_icon = $("<i/>").addClass(citem.icon);
        var _chk_icon_span = $("<span/>").addClass("icon").append(_chk_icon);
        childmenulink.append(_chk_icon_span);
        childmenulink.append(" ");
      }
      if (citem.text) {
        childmenulink.append($('<i class="fa fa-check-square-o"></i>'));
        childmenulink.append($('<i class="fa fa-square-o"></i>'));
        var label = $('<label/>')
          .append(citem.text)
          .attr("for", "chk" + _chk_index);
        childmenulink.append(label);
      }
      if (citem.code) {
        var _code = $("<span/>").addClass("tag").text(citem.code)
        childmenulink.append(_code);
      }
      if (citem.tags) {
        $.each(citem.tags, function (tindex, titem) {
          createTag(titem).appendTo(childmenulink);
        });
      }
    });
  }
  // 
  var filterRoute = function (keyword) {
    var items = [];

    $.each(buffer_route, function (index, item) {
      if ((item.text && item.text.indexOf(keyword) > -1) ||
        (item.code && item.code.indexOf(keyword) > -1)) {
        items.push(item);
      }
    });
    return items;
  }
  //
  var filterRoute_suidao = function (keyword) {
    var items = [];

    $.each(suidao_route, function (index, item) {
      if ((item.text && item.text.indexOf(keyword) > -1) ||
        (item.code && item.code.indexOf(keyword) > -1)) {
        items.push(item);
      }
    });
    return items;
  }

  var onSuiDaoMenuClick = function (id) {
    var route;
    App.plugins.siderbar.hide();
    $.each(suidao_route, function (index, item) {
      if (route == undefined && item.id == id) {
        route = item;
      }
    });
    App.map.clear();

    App.ajax(bus_cfgs.base.chunnelapi, {
      "linenum": route.id,
      "state": 5
    }, function (json) {
      $.each(json.data, function (index, item) {
        if (item.state == "5") {
          App.map.addPOI({
            "lon": item.lon,
            "lat": item.lat,
            "width": 32,
            "height": 32,
            "icon": "assets/img/c_" + item.state + ".png",
            "data": item,
            "type": "2",
            "state": item.state,
            "id": item.bridgenum,
            "click": App.plugins.menu.pointClick
            //   , "rightclick": App.plugins.menu.videoClick
          });
        } else {
          App.map.addPOI({
            "lon": item.lon,
            "lat": item.lat,
            "width": 32,
            "height": 32,
            "icon": "assets/img/c_" + item.state + ".png",
            "data": item,
            "type": "2",
            "state": item.state,
            "id": item.bridgenum,
            "click": App.plugins.menu.pointClick
          });
        }
      });
      App.map.refreshState();
      App.map.centerToPOIs();
    });
  }

  var onBridgeMenuClick = function (id) {
    var route;
    App.plugins.siderbar.hide();
    $.each(buffer_route, function (index, item) {
      if (route == undefined && item.id == id) {
        route = item;
      }
    });
    App.map.clear();

    App.ajax(bus_cfgs.base.bridgeapi, {
      "linenum": route.id,
      "state": 5
    }, function (json) {
      $.each(json.data, function (index, item) {
        if (item.state == "5") {
          App.map.addPOI({
            "lon": item.lon,
            "lat": item.lat,
            "width": 32,
            "height": 32,
            "icon": "assets/img/c_" + item.state + ".png",
            "data": item,
            "type": "1",
            "state": item.state,
            "id": item.bridgenum,
            "click": App.plugins.menu.pointClick
            //    , "rightclick": App.plugins.menu.videoClick
          });
        } else {
          App.map.addPOI({
            "lon": item.lon,
            "lat": item.lat,
            "width": 32,
            "height": 32,
            "icon": "assets/img/c_" + item.state + ".png",
            "data": item,
            "type": "1",
            "state": item.state,
            "id": item.bridgenum,
            "click": App.plugins.menu.pointClick
          });
        }
      });
      App.map.refreshState();
      App.map.centerToPOIs();
    });
  }

  var initData = function (callback) {
    buffer_route = [];
    suidao_route = [];
    App.ajax(bus_cfgs.base.routeapi, {}, function (json) {
      $.each(json.data, function (index, item) {
        buffer_route.push({
          "id": item.linenum,
          "text": App.base64.decode(item.linename),
          "code": item.linenum
        });
      });

      callback();
    });

    App.ajax(bus_cfgs.base.suidaorouteapi, {}, function (json) {
      $.each(json.data, function (index, item) {
        suidao_route.push({
          "id": item.linenum,
          "text": App.base64.decode(item.linename),
          "code": item.linenum
        });
      });

    });

  }

  var monitorhddata = function () {
    App.ajax(bus_cfgs.monitor.bhdataapi, {}, function (json) {
      if (json.ret != "0") {
        return
      }
      $(".switch.green>.switch-bg>span").html(json.data.nostart);
      $(".switch.yellow>.switch-bg>span").html(json.data.progressing);
      $(".switch.blue>.switch-bg>span").html(json.data.finished);
      $(".switch.red>.switch-bg>span").html(json.data.collectdelay);
      $(".switch.gray>.switch-bg>span").html(json.data.noset);

      //  $(".switch.green>.switch-bg>span").html(json.data.finished);
      //  $(".switch.blue>.switch-bg>span").html(json.data.noset);
      //  $(".switch.red>.switch-bg>span").html(json.data.collectdelay);
      //  $(".switch.gray>.switch-bg>span").html(json.data.nostart);
      //  $(".switch.yellow>.switch-bg>span").html(json.data.progressing);
    });
  }

  var monitorhdinfo = function () {
    App.ajax(bus_cfgs.monitor.bhinfoapi, {}, function (json) {
      var states = {};
      $.each(json.data, function (index, item) {
        states[item.bridgenum] = {
          "icon": "assets/img/c_" + item.state + ".png",
          "state": item.state
        };
      });
      App.map.resetState(states);
    });
  }

  var padlocat = function () {
    App.ajax(bus_cfgs.monitor.padLocatapi, {}, function (json) {
      var states = {};
      $.each(json.data, function (index, item) {
        App.map.addPOI_pad({
          "lon": item.lon,
          "lat": item.lat,
          "width": 32,
          "height": 32,
          "icon": "assets/img/pad_" + item.type + ".png",
          "data": item,
          "id": item.mac,
          "click": "",
          "rightclick": App.plugins.menu.videoClick
        });
      });
      // App.map.refreshState();
      App.map.centerToPOIs();
      // App.map.resetState(states);
    });
  }

  var monitorworker = function () {
    App.ajax(bus_cfgs.monitor.workerapi, {}, function (json) {
      if (json.ret != "0") {
        return
      }
      $.each(json.data, function (index, item) {
        var disease = {
          "level": item.dj,
          "title": App.base64.decode(item.teamname),
          "flag": (item.time).substr(0, 10),
          "content": App.base64.decode(item.name) +
            " 病害类型：" + App.base64.decode(item.bhtype) +
            " 病害等级：" + item.dj
        };
        App.plugins.siderbar.checklog.add(disease);
      });
    });
  }
  //var isinitialize = false;
  app.plugins.menu = {
    "init": function () {
      // console.log("init");
      initData(function () {
        // if (isinitialize) return;
        // isinitialize = true;
        initHorMenu();
        initform();
        monitorhddata();
        padlocat();
        // App.autorun.add(monitorhddata);
        // App.autorun.add(monitorhdinfo);
        //  App.autorun.add(monitorworker);
        App.autorun.add(padlocat);
        App.plugins.menu.searchBridgeByRoute("");
        App.plugins.menu.searchChannelByRoute("");
      });
    },
    "videoClick": function (id, type) {
      var timestamp = Date.parse(new Date());
      App.ajax(bus_cfgs.base.noticeapi, {
        "username": id,
        "timestamp": timestamp
      }, function (json) {
        if (json.ret != "0") {
          return
        }

      });
      App.anychat.show(id);
    },
    "pointClick": function (id, type) {
      window.type = type;
      App.plugins.siderbar.show();
      var queryDetailCallback = function (json) {
        App.plugins.siderbar.infoform.set({
          "name": App.base64.decode(json.data.name),
          "code": json.data.code,
          "route": App.base64.decode(json.data.pertainline),
          "len": json.data.length,
          "width": json.data.widehigh
        });

        App.plugins.siderbar.diseasefrom.clear();
        $.each(json.data.bhlist, function (index, item) {
          var disease = {
            "level": item.bhdj,
            "title": "病害日期：" + (item.jcsj).substr(0, 10),
            "content": "部件名称：" + App.base64.decode(item.bjm) + " 病害类型：" + App.base64.decode(item.bhlx) + " 病害等级：" + item.bhdj + "",
            "medias": []
          };
          $.each(item.bhzp.split(','), function (cin, cit) {
            if (window.type == 1 || window.type == '1') {
              disease.medias.push({
                "source": cfgs.imgserver + encodeURI(cit)
              });
            } else {
              disease.medias.push({
                "source": cfgs.imgserver2 + encodeURI(cit)
              });
            }
          });
          App.plugins.siderbar.diseasefrom.add(disease);
        });
      }
      App.ajax(bus_cfgs.base.infoapi, {
        "id": id,
        "type": type
      }, queryDetailCallback);
    },
    "getroutes": function () {
      return buffer_route;
    },
    "searchBridgeByRoute": function (keyword) {
      appendHorMenu("bridge", filterRoute(keyword), onBridgeMenuClick);
    },
    "searchChannelByRoute": function (keyword) {
      appendHorMenu("channel", filterRoute_suidao(keyword), onSuiDaoMenuClick);
    }
  };
})(App);
/* ========================================================================
 * App.plugins.siderbar v1.0
 * 侧边栏插件
 * ========================================================================
 * Copyright 2015-2025 WangXin nvlbs,Inc.
 * ======================================================================== */
(function (app) {

  var siderbarisshow = true,
    logformisshow = true;

  var handleSiderContent = function () {
    var header_height = $("header").height();
    var footer_height = $("footer").height();
    var viewport = App.ViewPort;
    var height = viewport.height - header_height - footer_height - 20;
    $(".sider-container").css("top", (header_height + 10) + "px");
    $(".sider-container").css("height", height + "px");
    $(".log-container").css("bottom", (footer_height + 10) + "px");
    //$(".checklogform").css("height",form_height+"px");
    // 检修日志表达
    var container = $(".checklog-container");
    if (container.attr("data-initialized")) {
      container.removeAttr("data-initialized");
      container.removeAttr("style");
      container.slimScroll({
        wrapperClass: 'slimScrollDiv',
        destroy: true
      });
    }
    container.slimScroll({
      allowPageScroll: true,
      size: '7px',
      color: '#bbb',
      wrapperClass: 'slimScrollDiv',
      railColor: '#eaeaea',
      position: 'right',
      height: 140,
      alwaysVisible: false,
      railVisible: false,
      disableFadeOut: true
    });
    container.attr("data-initialized", "1");

    // 病害信息表单
    var form_height = height - 230 * 2 - 10
    $(".diseaseform").css("height", form_height + "px");
    container = $(".disease-container");
    if (container.attr("data-initialized")) {
      container.removeAttr("data-initialized");
      container.removeAttr("style");
      container.slimScroll({
        wrapperClass: 'slimScrollDiv',
        destroy: true
      });
    }
    container.slimScroll({
      allowPageScroll: true,
      size: '7px',
      color: '#bbb',
      wrapperClass: 'slimScrollDiv',
      railColor: '#eaeaea',
      position: 'right',
      height: form_height - 50,
      alwaysVisible: false,
      railVisible: false,
      disableFadeOut: true
    });
    container.attr("data-initialized", "1");
    //
    container = $(".history-container");
    if (container.attr("data-initialized")) {
      container.removeAttr("data-initialized");
      container.removeAttr("style");
      container.slimScroll({
        wrapperClass: 'slimScrollDiv',
        destroy: true
      });
    }
    container.slimScroll({
      allowPageScroll: true,
      size: '7px',
      color: '#bbb',
      wrapperClass: 'slimScrollDiv',
      railColor: '#eaeaea',
      position: 'right',
      height: 180,
      alwaysVisible: false,
      railVisible: false,
      disableFadeOut: true
    });
    container.attr("data-initialized", "1");
  }

  var append2list = function (container, options) {
    var itemContainer = $("<li/>").appendTo(container);
    var disease = $("<div/>").addClass("disease").appendTo(itemContainer);
    // 等级图标
    disease.append($("<span/>").addClass("disease-icon l" + options.level).html(options.level));
    // 标题
    disease.append($("<span/>").addClass("disease-date").html(options.title));
    // 标识
    if (options.flag) {
      disease.append($("<span/>").addClass("disease-flag").html(options.flag));
    }
    // 内容
    var body = $("<div/>").addClass("disease-body").appendTo(disease);
    body.append($("<span/>").html(options.content));

    if (options.medias) {
      var media = $("<div/>").addClass("media").appendTo(body);
      $.each(options.medias, function (index, item) {
        var a = $("<a/>").attr({
          "href": item.source,
          "target": "_blank"
        }).appendTo(media);
        $("<img/>").attr({
          "src": item.source,
          "width": "70",
          "height": "60"
        }).appendTo(a);
      });
    }
  }

  app.plugins.siderbar = {
    // 打开界面
    "init": function () {
      App.addResizeHandler(handleSiderContent);
      $(".switch.first").on("click", function () {
        if (logformisshow) {
          App.plugins.siderbar.checklog.hide();
          // App.aodianyun.hide();
        } else {
          App.plugins.siderbar.checklog.show();
          // App.aodianyun.show();
        }
      });
      $("#form_switch").on("click", function () {
        // if (siderbarisshow) {
        App.plugins.siderbar.hide();
        // } else {
        //   App.plugins.siderbar.show();
        // }
      });
    },
    "show": function () {
      if (siderbarisshow) {
        return;
      }
      $(".sider-container").show();
      $(".sider-container").removeClass("fadeOutRight");
      $(".sider-container").addClass("fadeInRight");
      siderbarisshow = true;
    },
    "hide": function () {
      if (siderbarisshow == false) {
        return;
      }
      $(".sider-container").removeClass("fadeInRight");
      $(".sider-container").addClass("fadeOutRight");
      siderbarisshow = false;
      setTimeout(function () {
        $(".sider-container").hide();
      }, 500);
    },
    "infoform": {
      "set": function (options) {
        var formvalue = $(".infoform .sider-form-body .label-value");
        if (options.name) {
          formvalue.eq(0).html(options.name);
        } else {
          formvalue.eq(0).html("");
        }
        if (options.code) {
          formvalue.eq(1).html(options.code);
        } else {
          formvalue.eq(1).html("");
        }
        var routeText = "";
        if (options.route) {
          routeText = options.route;
        }
        if (options.routecode) {
          routeText += "(" + options.routecode + ")";
        }
        formvalue.eq(2).html(routeText);

        if (options.len) {
          formvalue.eq(3).html(options.len + " 米");
        } else {
          formvalue.eq(3).html("");
        }
        if (options.width) {
          formvalue.eq(4).html(options.width);
        } else {
          formvalue.eq(4).html("");
        }
      }
    },
    "reportform": {
      "rander": function (datas) {
        var colors = ["#008000", "#0099CC", "#cc0000", "#999"];
        $(".history-container").empty();
        $.each(datas, function (index, item) {
          var li = $("<li/>").appendTo($(".history-container"));
          li.append($("<span/>").addClass("report-title").html(item.text));
          var chart_container = $("<span/>").addClass("report-body").appendTo(li);
          var categories = [],
            data = [];
          $.each(item.data, function (dindex, ditem) {
            categories.push(ditem[0]);
            data.push({
              "y": ditem[1],
              "color": colors[dindex]
            });
          });
          chart_container.highcharts({
            chart: {
              type: 'column',
              backgroundColor: "transparent",
              height: 45,
              width: 220,
              inverted: true
            },
            title: null,
            credits: {
              enabled: false
            },
            legend: {
              enabled: false
            },
            xAxis: {
              categories: categories,
              tickLength: 0,
              lineColor: "#fff",
              lineWidth: 1,
              labels: {
                style: {
                  "font-size": "10px",
                  "color": "#eee"
                }
              }
            },
            yAxis: {
              title: null,
              gridLineWidth: 0,
              labels: {
                enabled: false
              }
            },
            plotOptions: {
              column: {
                dataLabels: {
                  enabled: true,
                  inside: false,
                  style: {
                    "fontSize": "7px !important",
                    "textShadow": "none",
                    "fontWeight": "normal",
                    "color": "#fff"
                  }
                }
              }
            },
            tooltip: {
              formatter: function () {
                return this.x + ':<b>' + this.y + '个病害</b><br/>';
              }
            },
            series: [{
              name: ' ',
              data: data,
              color: 'white'
            }],
            exporting: {
              enabled: false
            }
          });
        });
      }
    },
    "diseasefrom": {
      "add": function (options) {
        var container = $(".disease-container");
        append2list(container, options);
        $(".diseaseform>.sider-form-title>span").eq(1).html("(" + $(".disease-container>li").length + ")");
      },
      "clear": function () {
        var container = $(".disease-container");
        container.empty();
        $(".diseaseform>.sider-form-title>span").eq(1).html("");
      }
    },
    "checklog": {
      "add": function (options) {
        var container = $(".checklog-container");
        append2list(container, options);
      },
      "clear": function () {
        var container = $(".checklog-container");
        container.empty();
      },
      "isshow": function () {
        return true
      },
      "show": function () {
        if (logformisshow) {
          return;
        }
        $(".switch.first").addClass("open");
        $(".log-container").show();
        $(".log-container").removeClass("fadeOutLeft");
        $(".log-container").addClass("fadeInLeft");
        logformisshow = true;
      },
      "hide": function () {
        if (logformisshow == false) {
          return;
        }
        $(".switch.first").removeClass("open");
        $(".log-container").removeClass("fadeInLeft");
        $(".log-container").addClass("fadeOutLeft");
        logformisshow = false;
        setTimeout(function () {
          $(".log-container").hide();
        }, 500);
      }
    }
  };
})(App);
/* ========================================================================
 * App.plugins.report v1.0
 * 病害报告插件
 * ========================================================================
 * Copyright 2015-2025 WangXin nvlbs,Inc.
 * ======================================================================== */
(function (app) {
  var parentView; // 当前模式窗口
  var _initialize = function (parent) {
    App.ajax(bus_cfgs.base.reportapi, {}, function (json) {
      var sj = [];
      var qlcount = [];
      var sdcount = [];
      var zCount = [];
      var mc = [];
      var tc = [];
      $.each(json.data.bh_data_list, function (index, item) {
        sj[index] = (item.sj).substring(2.6);
        qlcount[index] = item.qlCount;
        sdcount[index] = item.sdCount;
        zCount[index] = item.count;
        //  states[index]=1108;
      });
      $.each(json.data.bh_data_pm, function (index, item) {
        if (index > 9) {
          return false;
        }
        mc[index] = App.base64.decode(item.mc);
        tc[index] = item.tc;
      });

      var chart_height = 250;
      parentView = $("#" + parent);
      var type_colors = ["#008000", "#0099CC", "#cc0000", "#999"];
      var level_colors = ["#cc0000", "#ff3300", "#ff9900", "#ffad33", "#ffcc00"];
      // 隧道数据采集统计
      $('#char_sjcj', parentView).highcharts({
        chart: {
          height: chart_height
        },
        credits: {
          enabled: false
        },
        xAxis: {
          categories: sj
        },
        series: [{
          name: '桥梁',
          data: qlcount
        }, {
          name: '隧道',
          data: sdcount
        }, {
          name: '桥梁+隧道',
          data: zCount
        }],
        yAxis: {
          title: null,
          plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
          }]
        },
        colors: type_colors,
        title: null,
        tooltip: {
          valueSuffix: ''
        },
        legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'middle',
          borderWidth: 0,
          itemDistance: 50
        },
        exporting: {
          enabled: false
        }
      });
      // 病害等级统计
      var categories = ['五级病害', '四级病害', '三级病害', '二级病害', '一级病害'],
        data = [{
            y: json.data.dj5,
            color: level_colors[0]
          },
          {
            y: json.data.dj4,
            color: level_colors[1]
          },
          {
            y: json.data.dj3,
            color: level_colors[2]
          },
          {
            y: json.data.dj2,
            color: level_colors[3]
          },
          {
            y: json.data.dj1,
            color: level_colors[4]
          }
        ];

      $('#char_bhdj', parentView).highcharts({
        chart: {
          type: 'column',
          height: chart_height,
          inverted: true
        },
        credits: {
          enabled: false
        },
        title: null,
        xAxis: {
          categories: categories,
          tickLength: 0,
          lineWidth: 4
        },
        yAxis: {
          title: null,
          gridLineWidth: 0,
          labels: {
            enabled: false
          }
        },
        plotOptions: {
          column: {
            dataLabels: {
              enabled: true
            }
          }
        },
        tooltip: {
          formatter: function () {
            var point = this.point,
              s = this.x + ':<b>' + this.y + '% market share</b><br/>';
            return s;
          }
        },
        series: [{
          name: " ",
          data: data,
          color: 'white'
        }],
        exporting: {
          enabled: false
        }
      }); // return chart
      // 病害分布比例
      $('#char_fbbl').highcharts({
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          height: chart_height
        },
        credits: {
          enabled: false
        },
        colors: level_colors,
        title: null,
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}</b>'
        },
        plotOptions: {
          pie: {
            allowPointSelect: false,
            cursor: 'pointer',
            showInLegend: true,
            dataLabels: {
              enabled: false,
              color: '#000000',
              connectorColor: '#000000',
              format: '<b>{point.name}</b>: {point.percentage:.1f}'
            }
          }
        },
        legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'middle',
          borderWidth: 0
        },
        series: [{
          type: 'pie',
          name: ' ',
          data: [
            ['五级病害', json.data.dj5],
            ['四级病害', json.data.dj4],
            ['三级病害', json.data.dj3],
            ['二级病害', json.data.dj2],
            ['一级病害', json.data.dj1]
          ]
        }],
        exporting: {
          enabled: false
        }
      });
      // 工作进度情况
      $('#char_gzjd').highcharts({
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          height: chart_height
        },
        credits: {
          enabled: false
        },
        colors: type_colors,
        title: null,
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
          pie: {
            allowPointSelect: false,
            cursor: 'pointer',
            showInLegend: true,
            dataLabels: {
              enabled: false,
              color: '#000000',
              connectorColor: '#000000',
              format: '<b>{point.name}</b>: {point.percentage:.1f} %'
            }
          }
        },
        legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'middle',
          borderWidth: 0
        },
        series: [{
          type: 'pie',
          name: ' ',
          data: [
            ['已完成', json.data.finished],
            ['进行中', json.data.progressing],
            ['已延期', json.data.collectdelay],
            ['未开始', json.data.nostart],
            ['未设定', json.data.noset]
          ]
        }],
        exporting: {
          enabled: false
        }
      });
      // 病害数量排名
      var categories_slpm = mc,
        data_slpm = tc;

      $('#char_slpm', parentView).highcharts({
        chart: {
          type: 'column',
          height: chart_height
        },
        title: null,
        credits: {
          enabled: false
        },
        xAxis: {
          categories: categories_slpm,
          labels: {
            rotation: -45,
            align: 'right',
            style: {
              fontSize: '13px'
            }
          }
        },
        yAxis: {
          title: null
        },
        plotOptions: {
          column: {
            showInLegend: false,
            dataLabels: {
              enabled: true
            }
          }
        },
        series: [{
          name: ' ',
          data: data_slpm,
          color: type_colors[1]
        }],
        exporting: {
          enabled: false
        }
      });
    });
  }
  app.plugins.reports.binghai = {
    // 打开界面
    "show": function () {
      App.dialog.load({
        "args": {
          "width": 1400,
          "height": 830
        },
        "url": "views/bhbg.html",
        "callback": _initialize
      });
    }
  };
})(App);
/* ========================================================================
 * App.plugins.tasks v1.0
 * 计划任务插件
 * ========================================================================
 * Copyright 2015-2025 WangXin nvlbs,Inc.
 * ======================================================================== */
(function (app) {
  var parentView; // 当前模式窗口
  var group_bridge = "";
  var treebuffer_bridge = "",
    treebuffer_chunnel = "";
  var treetype = 1;
  var treeoptons = {
    'plugins': ["wholerow", "checkbox", "types", "themes"],
    'core': {
      'check_callback': true,
      "themes": {
        "stripes": true
      }, // 条纹主题
      'data': []
    },
    "types": {
      "default": {
        "icon": "fa fa-folder icon-state-warning icon-lg"
      },
      "file": {
        "icon": "fa fa-file icon-state-warning icon-lg"
      }
    }
  };
  // 初始化树形结构数据
  var initTreeData = function (type, datas) {

    $("#treeBridge").jstree($.extend(treeoptons, group_bridge))
      .bind("loaded.jstree", function (e, data) {
        $("#treeBridge").jstree().uncheck_all();
        if (datas != undefined && datas.length > 0) {
          $("#treeBridge").jstree("check_node", datas);
        }
        // $("#treeBridge").jstree().open_all();
      });

    if (type == 1) {
      treebuffer_bridge = group_bridge;
    } else {
      treebuffer_chunnel = group_bridge;
    }
  }
  // 初始化树形结构
  var initTree = function (type, datas) {
    treetype = type;

    if (type == 1) {
      group_bridge = treebuffer_bridge;
    } else {
      group_bridge = treebuffer_chunnel;
    }

    if (group_bridge == "" || group_bridge.core.data.length == 0) {
      group_bridge = {
        "core": {
          "data": []
        }
      };
      App.ajax(bus_cfgs.task.treeapi, {
        "type": type
      }, function (tjson) {
        $.each(tjson.data, function (index, item) {
          group_bridge.core.data.push({
            "id": item.id,
            "parent": item.pid,
            "text": App.base64.decode(item.name)
          });
        });
        initTreeData(type, datas);
      });
    } else {
      try {
        $("#treeBridge").jstree().destroy();
      } catch (e) {};
      initTreeData(type, datas);
    }

  }

  var initEditView = function (id) {
    parentView.load(bus_cfgs.task.editpage, function () {
      var checkeds = [];
      treeoptons.core.data = [];
      App.initSlimScroll("#treeBridge");
      // 初始化日期时间控件
      $(".form_date,.form_datetime").each(function (index, item) {
        var wrapper = $("<div></div>").addClass("input-group date");
        var span = $("<span></span>").addClass("input-group-btn");
        var button = $("<a></a>").addClass("btn btn-default date-set");
        button.append($("<i></i>").addClass("fa fa-calendar"));
        span.append(button);
        $(this).wrapAll(wrapper);
        $(this).parent().append(span);
        $(this).parent().datetimepicker(bus_cfgs.options.datepicker);
      });
      $("button.yellow").on("click", function (e) {
        e.preventDefault();
        App.plugins.tasks.management();
      });
      $("button.blue").on("click", function (e) {
        e.preventDefault();

        var taskname = $("#taskname").val();
        if (taskname == "") {
          App.alert("请输入计划任务名称！");
          return;
        }
        var date = $("#date").val();
        if (date == "") {
          App.alert("请选择计划终止时间！");
          return;
        }
        var options = {
          "planname": App.base64.encode(taskname),
          "endtime": App.util.stringToUTC(date),
          "type": treetype
        };
        options.selectlist = "";
        $.each($('#treeBridge').jstree().get_checked(true), function (index, item) {
          if (item.children.length == 0) {
            if (index != 0) {
              options.selectlist += ","
            }
            options.selectlist += (item.original.id);
          }
        });

        var url = bus_cfgs.task.add;
        if (id) {
          options.planid = id;
          url = bus_cfgs.task.update;
        }

        App.ajax(url, options, function (json) {
          App.plugins.tasks.management();
        });
      });
      $("button.treetype").on("click", function (e) {
        e.preventDefault();
        if ($(this).hasClass("default")) {
          var type = $(this).attr("data-type");
          initTree(type);
          $("button.treetype.green").removeClass("green").addClass("default");
          $(this).removeClass("default").addClass("green");
        }
      });

      if (id) {
        App.ajax(bus_cfgs.task.detailapi, {
          "planid": id
        }, function (json) {

          $("#taskname").val(App.base64.decode(json.data.planname));
          $("#date").val(json.data.endtime);

          $.each(json.data.righttreelist, function (index, item) {
            checkeds.push(item.id);
          });
          initTree(json.data.type, checkeds);
        });
      } else {
        initTree(1);
      }

    });
  }

  var edit_click = function () {
    initEditView($(this).attr("data-args"));
  }

  var reomve_click = function () {
    var id = $(this).data("args");
    App.confirm("删除后记录不可恢复！！！", '确定删除记录?', 'warning', function (isok) {
      if (!isok) {
        return;
      }
      App.ajax(bus_cfgs.task.remove, {
        "id": id
      }, search);
    });
  }

  var search = function () {
    var callback = function (json) {
      var body = $("tbody", parentView);
      body.empty();
      if (json && json.ret != undefined && json.ret == "0") { //成功
        $.each(json.data, function (index, item) {
          var tr = $("<tr />").appendTo(body);
          App.row.addText(tr, index + 1); // 序号
          App.row.addBase64Text(tr, item.planname); // 计划任务名称
          var td = $("<td />").appendTo(tr);
          App.cell.addAction(td, "btn_edit", item.planid + "," + item.type, edit_click);
          App.cell.addAction(td, "btn_delete", item.planid + "," + item.type, reomve_click);
        });
      }
    };
    App.ajax(bus_cfgs.task.datas, {}, callback);
  }

  var _initialize = function (parent) {
    if (!parentView) {
      parentView = $("#" + parent);
    }
    $(".insert").on("click", function () {
      initEditView();
    });
    $(".refresh").on("click", function () {
      search();
    });
    search();
  }

  app.plugins.mapShow = {
    "initialMap": function () {
      App.map.clear();
      App.ajax(bus_cfgs.monitor.padLocatapi, {}, function (json) {
        var states = {};
        $.each(json.data, function (index, item) {
          App.map.addPOI_pad({
            "lon": item.lon,
            "lat": item.lat,
            "width": 32,
            "height": 32,
            "icon": "assets/img/pad_" + item.type + ".png",
            "data": item,
            "id": item.mac,
            "click": "",
            "rightclick": App.plugins.menu.videoClick
          });
        });
        App.map.centerToPOIs();
      });
    },
    "deleMap": function () {
      App.map.clear();
    }
  };


  app.plugins.tasks = {
    // 打开界面
    "management": function () {
      if ($('html').hasClass('task') == false) {
        $('html').addClass('task');
        App.dialog.load({
          "args": {
            "width": 800,
            "height": 630
          },
          "url": bus_cfgs.task.listpage,
          "callback": _initialize
        });
      } else {
        parentView.load(bus_cfgs.task.listpage, _initialize);
      }
    },
    "refreshMenu": function () {
      var taskclick = function (e) {
        App.map.clear();
        App.ajax(bus_cfgs.task.tasksearchapi, {
          "planid": $(this).attr("data-id")
        }, function (json) {
          $.each(json.data, function (index, item) {
            if (item.state == "5") {
              App.map.addPOI({
                "lon": item.lon,
                "lat": item.lat,
                "width": 32,
                "height": 32,
                "icon": "assets/img/c_" + item.state + ".png",
                "data": item,
                "type": item.type,
                "state": item.state,
                "id": item.bridgenum,
                "click": App.plugins.menu.pointClick
                //   , "rightclick": App.plugins.menu.videoClick
              });
            } else {
              App.map.addPOI({
                "lon": item.lon,
                "lat": item.lat,
                "width": 32,
                "height": 32,
                "icon": "assets/img/c_" + item.state + ".png",
                "data": item,
                "type": item.type,
                "state": item.state,
                "id": item.bridgenum,
                "click": App.plugins.menu.pointClick
              });
            }
          });
          App.map.refreshState();
          App.map.centerToPOIs();
        });
      }
      var callback = function (json) {
        $(".taskmenu>ul").remove();
        var menuContainer = $("<ul/>").addClass("pull-left").appendTo($(".taskmenu"));
        $.each(json.data, function (cindex, citem) {
          var childmenu = $("<li/>").appendTo(menuContainer);
          var childmenulink = $("<a/>")
            .appendTo(childmenu)
            .attr("href", "javascript:;")
            .attr("data-id", citem.planid + "," + citem.type)
            .on("click", taskclick)
            .append(App.base64.decode(citem.planname));
        });
      };
      App.ajax(bus_cfgs.task.datas, {}, callback);
    }
  };

})(App);