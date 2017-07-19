define(['jquery', 'cfgs', 'block'], ($, cfgs, block) => {
  let module = {};
  let selected = undefined;
  let isFullScreen = false;
  let source_loaded = undefined;
  let loaded = undefined;

  document.addEventListener("fullscreenchange", function () {
    // (document.fullscreen) ? "" : "not ";
  }, false);
  document.addEventListener("mozfullscreenchange", function () {
    // (document.mozFullScreen) ? "" : "not ";
  }, false);
  document.addEventListener("webkitfullscreenchange", function () {
    // (document.webkitIsFullScreen) ? "" : "not ";
  }, false);
  document.addEventListener("msfullscreenchange", function () {
    // (fullscreenState.innerHTML = ()document.msFullscreenElement) ? "" : "not ";
  }, false);

  // var readStyle = function (keyword) {
  //   if (cfgs.options.styles[keyword]) {
  //     return cfgs.options.styles[keyword];
  //   } else {
  //     return cfgs.options.styles.btn_default;
  //   }
  // }

  /**
   * ajax方式加载页面内容.
   * @param {string} url 待加载内容的URL地址.
   * @param {string} callback 内容加载完成后的回调函数.
   */
  var _ajax_load_content = function (url, callback) {
    /** 页面加载完成时的回调函数 */
    var loadcallback = function () {

      if ($(".nui-content-view").hasClass("fadeOutRight")) {
        $(".nui-content-view").removeClass("fadeOutRight");
      }
      $(".nui-content-view").addClass("fadeInRight");
      if (callback) {
        callback.call();
      }
      setTimeout(function () {
        $(".nui-content-view").removeClass("fadeInRight");
      }, 500);
    }

    var options = {
      "url": url,
      "callback": loadcallback,
      "block": true
    };

    $(".nui-content-view").addClass("fadeOutRight");
    load_content(options);
  }

  /**
   * 加载页面内容.
   * @param {object} options 数据在列表中的索引
   * [可选结构]
   *  url:string,加载内容的地址.
   *  block:boolean,是否启用遮罩效果,默认为false.
   *  callback:function,加载页面内容成功后的回调函数.
   */
  var load_content = function (options) {
    if (!options) {
      console.error("调用load_content时,参数options不能为空!");
      return;
    }
    if (!options.url) {
      console.debug("请求地址不存在:%s", options.url);
      return;
    }
    console.info("准备加载:%s", options.url);
    if (options.block) {
      block.show("正在加载页面...");
    }

    if (source_loaded && source_loaded.destroy && typeof source_loaded.destroy === 'function') {
      source_loaded.destroy();
    }

    var loadCallback = function () {
      console.info("加载完成:%s", options.url);
      if (options.callback) {
        options.callback();
      }
      if (options.block) {
        block.close();
      }
      // view.contentChanged();
    }
    /* 加载页面内容 */
    $(".nui-content-view").load(options.url, loadCallback);

  }

  var fullScreen = () => {
    var docElm = document.documentElement;
    //W3C  
    if (docElm.requestFullscreen) {
      isFullScreen = true;
      docElm.requestFullscreen();
    }
    //FireFox  
    else if (docElm.mozRequestFullScreen) {
      isFullScreen = true;
      docElm.mozRequestFullScreen();
    }
    //Chrome等  
    else if (docElm.webkitRequestFullScreen) {
      isFullScreen = true;
      docElm.webkitRequestFullScreen();
    }
    //IE11
    else if (docElm.msRequestFullscreen) {
      isFullScreen = true;
      docElm.msRequestFullscreen();
    }
  }

  var exitFullScreen = () => {
    if (document.exitFullscreen) {
      isFullScreen = false;
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      isFullScreen = false;
      document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
      isFullScreen = false;
      document.webkitCancelFullScreen();
    } else if (document.msExitFullscreen) {
      isFullScreen = false;
      document.msExitFullscreen();
    }
  }

  var _init = () => {

    var menuContainer = $('.nui-navigator');

    $.each(cfgs.modules, (key, item) => {
      let li = $('<li/>').appendTo(menuContainer);
      let link = $('<a/>').appendTo(li);

      if (!selected) {
        selected = link;
      }

      if (item.module) {
        link.attr("data-module", item.module);
      }
      $('<i/>').addClass(item.icon).appendTo(link);
      $('<span/>').text(item.name).appendTo(link);
    });

    menuContainer.on('click', 'a', function () {
      let link = $(this);

      let moduleName = link.data("module");
      if (!moduleName) {
        return;
      }
      /** 处理mini-menu高亮状态 */
      $(".nui-navigator .nui-active").each(function () {
        $(this).removeClass("nui-active");
      });

      $(".nui-navigator>li>a>span").each(function () {
        link.parent().addClass("nui-active");
      });

      let breadcrumb = $(".nui-breadcrumb");
      $("li", breadcrumb).each((index, item) => {
        if (index == 0) {
          return;
        }
        item.remove();
      });

      breadcrumb.append(link.parent().clone());

      require([moduleName], (moduleObject) => {
        if (loaded) {
          source_loaded = loaded;
        }
        loaded = moduleObject;
        console.debug("module[%s] init", moduleName);
        moduleObject.init();
      });

    });

    selected.click();

    console.info("菜单初始化完成");
  };

  module.load = _ajax_load_content;
  module.isFullScreen = isFullScreen;
  module.toggleFullScreen = (isFullScreen == true ? exitFullScreen : fullScreen);
  module.exitFullScreen = exitFullScreen;
  module.fullScreen = fullScreen;
  module.init = _init;

  return module;
});