(function (app) {

  $('body').on('hide.bs.modal', '.modal', function () {
    app.anychat.logout();
    App.logger.info("退出聊天登录!");
  });
    app.anychat = {
        "show": function () {
            var _initialize = function (_parent) {
                VideoLogin();
            };
            App.dialog.load(
                {
                    "args": { "width": 800, "height": 600 }
                    , "url": "views/video.html", "callback": _initialize
                });
        }
        , "logout":function(){
            try{ VideoLogout(); }catch(e){ App.logger.debug(e.message);}
        }
        , "hide": function () {
            this.logout();
            App.dialog.close();
        }
    }
})(App);