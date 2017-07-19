
var objectPlayer;

/* 以下为adplayer支持的事件 */
// objectPlayer.startPlay();//播放 */';
// objectPlayer.pausePlay();//暂停 */';
// objectPlayer.stopPlay();//停止 hls不支持*/';
// objectPlayer.closeConnect();//断开连接 */';
// objectPlayer.setMute(true);//静音或恢复音量，参数为true|false */';
// objectPlayer.setVolume(volume);//设置音量，参数为0-100数字 */';
// objectPlayer.setFullScreenMode(1);//设置全屏模式,1代表按比例撑满至全屏,2代表铺满全屏,3代表视频原始大小,默认值为1。手机不支持 */';默认值为1

var LSS_SITE = 'http://cdn.aodianyun.com';
var lssPlayerLoad = false;
var hlsPlayerLoad = false;
var AODIANPLAY_UUID_BASE = 0;
function aodianPlayer(conf) {
    var lssFunName, lssFunInterval, hlsFunName, hlsFunInterval, html5FunName, html5FunInterval;
    var conf = conf;
    if (!conf.container || conf.container == "") {

        if (typeof console == "undefined") { }
        else
            console.log("缺少必要的参数：container");
        return;
    }
    var Existcontainer = $(conf.container);
    if (!Existcontainer) {

        if (typeof console == "undefined") { }
        else
            console.log("container不存在");
        return;
    }
    ++AODIANPLAY_UUID_BASE;
    var html = "<div id='aodianplayer_uid_base" + AODIANPLAY_UUID_BASE + "'></div>";
    $('#' + conf.container).append(html);
    conf.mediaid = 'aodianplayer_uid_base' + AODIANPLAY_UUID_BASE;
    //判断手机还是pc
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
    var isPc = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            isPc = false;
            break;
        }
    }
    conf.isPc = isPc;
    if (conf.videoUrl && conf.videoUrl != '') {
        conf.hlsUrl = conf.videoUrl;
    }
    if (isPc) {
        if (conf.rtmpUrl && conf.rtmpUrl != '') {
            var mode = /^rtmp\:\/\/(.*)\/([a-z\_\-A-Z\-0-9]*)\/([a-z\_\-A-Z\-0-9]*)(\?k\=([a-z0-9]*)\&t\=\d{10,11})?$/;
            if (!mode.test(conf.rtmpUrl)) {

                if (typeof console == "undefined") { }
                else
                    console.log("rtmp地址格式错误");
                return;
            }
            var arr = conf.rtmpUrl.match(mode);
            conf.cname = arr[1];
            conf.app = arr[2];
            conf.key = '';
            conf.pk = arr[4] ? arr[4] : '';
            conf.stream = arr[3] + conf.pk;;
            conf.addr = 'rtmp://' + conf.cname + '/' + conf.app;
            var playername = 'lssplayer';
            lssFunName = playername + 'Run';
            var _this = this;
            lssFunInterval = setInterval(function () {
                if (lssPlayerLoad == true) {
                    if (lssFunName in window) {
                        lssplayerRun.call(_this, conf);
                        clearInterval(lssFunInterval);
                        return;
                    }
                    return;
                }
                var playerScript = LSS_SITE + '/lss/aodianplay/' + playername + '.js?11212';
                var layoutScript = document.createElement('script');
                layoutScript.type = 'text/javascript';
                layoutScript.charset = 'UTF-8';
                layoutScript.src = playerScript;
                document.getElementsByTagName("body")[0].appendChild(layoutScript);

                lssPlayerLoad = true;
                if (lssFunName && lssFunName in window) {
                    clearInterval(lssFunInterval);
                    lssplayerRun.call(_this, conf);
                }
            }, 100);
        }
        else if (conf.hlsUrl && conf.hlsUrl != '') {
            var playername = 'hlsplayer';
            hlsFunName = playername + 'Run';
            var _this = this;
            hlsFunInterval = setInterval(function () {
                if (hlsPlayerLoad == true) {
                    if (hlsFunName in window) {
                        hlsplayerRun.call(_this, conf);
                        clearInterval(hlsFunInterval);
                        return;
                    }
                    return;
                }
                var playerScript = LSS_SITE + '/lss/aodianplay/' + playername + '.js';
                var layoutScript = document.createElement('script');
                layoutScript.type = 'text/javascript';
                layoutScript.charset = 'UTF-8';
                layoutScript.src = playerScript;
                document.getElementsByTagName("body")[0].appendChild(layoutScript);

                hlsPlayerLoad = true;
                if (hlsFunName && hlsFunName in window) {
                    clearInterval(hlsFunInterval);
                    hlsplayerRun.call(_this, conf);
                }
            }, 100);
        }
    }
    else {
        if (conf.hlsUrl && conf.hlsUrl != '') {
            var playername = 'html5player';
            html5FunName = playername + 'Run';
            var _this = this;
            html5FunInterval = setInterval(function () {
                if (hlsPlayerLoad == true) {
                    if (html5FunName in window) {
                        html5playerRun.call(_this, conf);
                        clearInterval(html5FunInterval);
                        return;
                    }
                    return;
                }
                var playerScript = LSS_SITE + '/lss/aodianplay/' + playername + '.js';
                var layoutScript = document.createElement('script');
                layoutScript.type = 'text/javascript';
                layoutScript.charset = 'UTF-8';
                layoutScript.src = playerScript;
                document.getElementsByTagName("body")[0].appendChild(layoutScript);

                hlsPlayerLoad = true;
                if (html5FunName && html5FunName in window) {
                    clearInterval(html5FunInterval);
                    html5playerRun.call(_this, conf);
                }
            }, 100);
        }
        else {
            document.getElementById(conf.container).innerHTML += "hlsUrl地址未传递";
        }

    }
}

(function (app) {
    var appid = "demo";
    var stream = "visdemo";
    var addr = "http://vis.aodianyun.com:5000";
    app.aodianyun = {
        "show": function () {
            var _initialize = function (_parent) {
                var objectPlayer = new aodianPlayer({
                    container: _parent + ' #' + 'play',//播放器容器ID，必要参数		
                    rtmpUrl: 'rtmp://24083.lssplay.aodianyun.com/abcdefg/stream',//控制台开通的APP rtmp地址，必要参数
                    hlsUrl: 'http://24083.hlsplay.aodianyun.com/abcdefg/stream.m3u8',//控制台开通的APP hls地址，必要参数
                    /* 以下为可选参数*/
                    width: '720',//视频宽度，可用数字、百分比
                    height: '480',//视频高度，可用数字、百分比等
                    autostart: true,//是否自动播放，默认为false
                    bufferlength: '1',//视频缓冲时间，默认为3秒
                    maxbufferlength: '2',//最大视频缓冲时间，默认为2秒
                    stretching: '2',//设置全屏模式,1代表按比例撑满至全屏,2代表铺满全屏,3代表视频原始大小,默认值为1
                    controlbardisplay: 'enable',//是否显示控制栏，值为：disable、enable默认为disable
                    isclickplay: false,//是否单击播放，默认为false
                    isfullscreen: false,//是否双击全屏，默认为false
                    lssCallBackFunction: function () {
                        var h = $(_parent + ' #' + 'play').children().attr('height');
                        $(_parent + ' #' + 'play').css('height', h);
                    }
                });
                $(_parent + " #btn_pause").on("click", function () {
                    objectPlayer.pausePlay();
                });
                $(_parent + " #btn_start").on("click", function () {
                    objectPlayer.startPlay();
                });
                $(_parent + " #btn_stop").on("click", function () {
                    objectPlayer.stopPlay();
                });
            };
            App.dialog.load(
                {
                    "args": { "width": 820, "height": 620 }
                    , "url": "views/stream.html", "callback": _initialize
                });
        }
        , "hide": function () {
            // StopPublish();
            App.dialog.close();

        }
    }
})(App);