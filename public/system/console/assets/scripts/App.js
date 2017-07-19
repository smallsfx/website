define(['jquery', 'layout'], function ($, layout) {
  let app = {
    "userinfo": {},
    /** 当前登录用户的信息 */
    "plugins": {},

    /** 当前登录用户的信息 */
    "modules": {
      "actions": {}
    },
    onReady: () => {
      require(['logger'], () => {
        console.info("应用程序启动");
        let isScreen = false;
        $('#fullscreen').on('click', () => {
          isScreen = !isScreen;
          if (isScreen) {
            layout.fullScreen();
          } else {
            layout.exitFullScreen();
          }

          // <i class="fa fa-toggle-off"></i>
          //              <i class="fa fa-toggle-on"></i>
          // layout.toggleFullScreen();
        });

        layout.init();
      });
    }
  }
  return app;
});