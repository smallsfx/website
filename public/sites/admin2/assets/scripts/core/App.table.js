/* ========================================================================
 * App.table v1.0, App.cell v1.0, App.row v1.0
 * 表格处理插件
 * ========================================================================
 * Copyright 2016-2026 WangXin nvlbs,Inc.
 * 
 * ======================================================================== */
define(['jquery', 'cfgs', 'define'], function ($, cfgs, App) {
  /**
   * 根据缓存数据索引获取数据内容
   * @param {number} index 缓存数据的索引
   */
  var getData = (index) => {
    if (cfgs.pageOptions.buffer && cfgs.pageOptions.buffer.data.length > 0) {
      return cfgs.pageOptions.buffer.data[index];
    } else {
      return;
    }
  }

  var rander = (target, columns) => {
    target.addClass("datatable table table-striped table-bordered table-hover");
    var row = $("<div />").addClass("panel-footer bottom text-right").appendTo(target.parent().parent());
    $("<ul/>").addClass("pagination").appendTo(row);
    target.wrapAll("<div class=\"table-scrollable\"></div>");
    $("<span/>").addClass("pageinfo").appendTo(row);
    row.hide();
    var thead = $("<thead/>").appendTo(target);

    var tr = $("<tr/>").appendTo(thead);
    $.each(columns, function (index, column) {
      $("<th/>").text(column).addClass("center").appendTo(tr);
    });
  }
  
  /**
   * 初始化表格注册按钮事件.
   * @param {object} options 请求参数选项
   *  pagecount : 页面总数.
   *  pageindex : 当前页面索引.
   */
  var _regist_table = function (options) {
    var defaults = {
      "pagecount": "1",
      "pageindex": "1"
    };
    var options = $.extend(defaults, options);
    // 仅有1页时,删除分页内容
    if (options.pagecount == 1) {
      $(".pagination").parent().hide();
      return;
    } else {
      $(".pagination").parent().show();
    }
    $(".pagination").empty();
    $(".pageinfo").text("共" + cfgs.pageOptions.buffer.recordcount + "条记录,每页" + cfgs.pageOptions.buffer.pagesize + "条,共" + options.pagecount + "页");
    var paper_index = options.pageindex * 1;
    var paper_count = 5;
    var begin = paper_index - 2;
    var end = paper_index + 2;

    var li = $("<li />").appendTo($(".pagination"));
    $("<a href=\"#\"/>").text("首页").attr("data-index", 1).appendTo(li);
    if (paper_index == 1) {
      li.addClass("disabled");
    }
    li = $("<li />").appendTo($(".pagination"));
    $("<a href=\"#\"/>").text("上一页").attr("data-index", paper_index - 1).appendTo(li);
    if (paper_index == 1) {
      li.addClass("disabled");
    }
    if (begin < 1) {
      if (paper_count <= options.pagecount) {
        end = paper_count;
      } else {
        end = options.pagecount;
      }
      begin = 1;
    } else if (end >= options.pagecount) {
      end = options.pagecount;
      begin = end - paper_count + 1;
      if (begin < 1) {
        begin = 1;
      }
    }
    for (; begin <= end; begin++) {
      li = $("<li />").appendTo($(".pagination"));
      $("<a href=\"#\"/>").attr("data-index", begin).text(begin).appendTo(li);
      if (paper_index == begin) {
        li.addClass("active");
      }
    }
    li = $("<li />").appendTo($(".pagination"));
    $("<a href=\"#\"/>").text("下一页").attr("data-index", (paper_index + 1)).appendTo(li);
    if (paper_index == options.pagecount) {
      li.addClass("disabled");
    }
    li = $("<li />").appendTo($(".pagination"));
    $("<a href=\"#\"/>").text("末页").attr("data-index", options.pagecount).appendTo(li);
    if (paper_index == options.pagecount) {
      li.addClass("disabled");
    }
    // 注册内容中的点击事件
    $(".pagination>li>a").on("click", function () {
      if ($(this).parent().hasClass("active") || $(this).parent().hasClass("disabled")) {
        return;
      }
      var index = $(this).attr("data-index");
      current_pageindex = index;
      re_common_load_data(index);
    });
    // App.refreshScroll();
  };

  //将缓存中的数据填充至表格
  var displayTable = function () {
    /// <summary>将缓存中的数据填充至表格.</summary>
    var start_index = (cfgs.pageOptions.buffer.pageindex - 1) * cfgs.pageOptions.buffer.pagesize + 1;
    /* 生成页面数据起始索引 */
    var table = getTable();
    $("tbody", table).empty();
    if (cfgs.pageOptions.buffer.data.length > 0) {
      $.each(cfgs.pageOptions.buffer.data, function (index, item) {
        /* 填充数据*/
        cfgs.pageOptions.requestOptions.parsefn($("<tr />").appendTo(table), index, start_index + index, item);
      });
    }
    _regist_table({
      "pagecount": cfgs.pageOptions.buffer.pagecount,
      "pageindex": cfgs.pageOptions.buffer.pageindex
    });
  }
  //获取需要处理的表格对象(支持FBModal)
  var getTable = function () {
    /// <summary>获取需要处理的表格对象(支持FBModal).</summary>
    var table = $("#table");
    if ($("#fbmodal #table").length > 0) {
      table = $("#fbmodal #table");
    }
    return table;
  }
  /**
   * 公共数据处理:回调parsefn填充数据并且生成分页按钮
   * @param {object} options 请求参数选项.
   *  api       : 请求数据的地址
   *  args      : 请求API附带的参数
   *  pageindex : 分页索引
   *  parsefn   : 填充表格的解析函数,参数为新增的列,列索引,列数据索引,数据内容对象
   *  token     : 请求的TOKEN,默认为当前用户TOKEN
   */
  var common_load_data = function (options) {
    /* 缓存最后一次操作，用于删除数据后重新加载 */
    cfgs.pageOptions.requestOptions = options;
    var defaults = {
      "pagenumber": 1
    };
    var reqOptions = $.extend(defaults, options.args);
    if (options.pageindex) {
      reqOptions.pagenumber = options.pageindex;
    }
    var table = getTable();
    var callback = {
      /*操作成功-填充列表数据*/
      "success": function () { // 
        displayTable();
      },
      /*清空表格数据*/

      "clear": function () {
        $("tbody", table).empty();
      },
      /*数据为空-追加空数据行*/

      "noneDate": function () {
        var tr = $("<tr />").appendTo(table);
        $("<td/>").text("没有数据")
          .attr("colspan", $("thead>tr>th", table).length)
          //.attr("height", 40*5)
          .appendTo(tr);
        _regist_table({
          "pagecount": 1,
          "pageindex": 1
        });
      },

      "busy": function () {
        var tr = $("<tr />").appendTo(table);
        $("<td/>").text("正在检索数据,请稍候...")
          .attr("colspan", $("thead>tr>th", table).length)
          //.attr("height", 40*5)
          .appendTo(tr);
      }
    };
    App.ajax(options.api, reqOptions, callback);
  }
  /**
   * 使用common_load_data前一次参数重新加载并处理数据
   * @param {number} pageindex 请求新页面的索引
   */
  var re_common_load_data = function (pageindex) {
    if ($("#table").length == 0) {
      return;
    }
    if (cfgs.pageOptions.requestOptions) {
      if (pageindex) {
        cfgs.pageOptions.requestOptions.pageindex = pageindex;
      }
      common_load_data(cfgs.pageOptions.requestOptions);
    }
  }

  App.cell = {
    "addAction": function (td, textKey, index, onClick) {
      var action = $("<a />").appendTo(td);
      action.html(cfgs.options.texts[textKey]);
      action.on("click", onClick);
      action.attr("data-args", index);
      action.attr("href", "javascript:;");
      return action;
    }
  };

  App.row = {
    "addText": function (tr, text) {
      return $(cfgs.templates.cell).text(text).appendTo(tr);
    },
    "addDictText": function (tr, dict, text, mulit) {
      if (mulit) {
        let newtext = "";
        $.each(text.split(","), function (index, item) {
          if (index > 0) {
            newtext += ",";
          }
          newtext += App.plugins.dict.getText(dict, item);
        });
        return this.addText(tr, newtext);
      } else {
        return this.addText(tr, App.plugins.dict.getText(dict, text));
      }
    },
    "addUTCText": function (tr, text, format) {
      var newtext = "";
      if (format) {
        newtext = App.util.utcTostring(text, format)
      } else {
        newtext = App.util.utcTostring(text, cfgs.options.defaults.datetimeformat)
      }
      return $(cfgs.templates.cell).text(newtext).appendTo(tr);
    },
    "createCell": function (tr) {
      return $(cfgs.templates.cell).appendTo(tr);
    }
  };

  App.table = {
    //公共数据处理:回调parsefn填充数据并且生成分页按钮
    "load": function (options) {
      common_load_data(options);
    },
    "reload": function () {
      re_common_load_data();
    },
    //根据缓存数据索引获取数据内容
    "getdata": function (index) {
      return getData(index);
    },
    "render": function (target, columns) {
      rander(target, columns);
    },
    "export": function (type, target) {
      App.alertText("导出" + type + ":尚未实现" + target);
    },
    "exportCSV": function (target) {
      this.export("csv", target);
    }
  }

});