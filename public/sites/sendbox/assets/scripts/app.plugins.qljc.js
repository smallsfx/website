/* ========================================================================
 * App.plugins.qljc v1.0
 * 桥梁检测
 * ========================================================================
 * Copyright 2015-2025 WangXin nvlbs,Inc.
 * ======================================================================== */
(function (app) {
  var parentView; // 当前模式窗口
  var _initialize_design = function (parent) {
    if (!parentView) {
      parentView = $("#" + parent);
    }
    $("#bradgefile").on("change", () => {
      // 此处执行上传操作；
      $("#bradgetext").val($("#bradgefile").val());
    });
    $("#bradgebtn").on("click", function () {
      $("#bradgefile").click();
    });
  }

  var _initialize_search = function (parent) {
    if (!parentView) {
      parentView = $("#" + parent);
    }
  }

  app.plugins.qljc = {
    // 打开界面
    "search": () => {
      if ($('html').hasClass('task') == false) {
        $('html').addClass('task');
      }
      App.dialog.load({
        "args": {
          "width": 1100,
          "height": 630
        },
        "url": bus_cfgs.qljc.searchpage,
        "callback": _initialize_search
      });
    },
    "design": () => {
      if ($('html').hasClass('task') == false) {
        $('html').addClass('task');
      }
      App.dialog.load({
        "args": {
          "width": 800,
          "height": 630
        },
        "url": bus_cfgs.qljc.designpage,
        "callback": _initialize_design
      });
    }
  };

})(App);