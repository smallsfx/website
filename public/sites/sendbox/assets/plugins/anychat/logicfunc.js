// AnyChat for Web SDK

/********************************************
 *				业务逻辑控制				*
 *******************************************/
var mDefaultServerAddr = "cloud.anychat.cn";		// 默认服务器地址
var mDefaultServerPort = 8906;					// 默认服务器端口号
var mSelfUserId = -1; 							// 本地用户ID
var mTargetUserId = -1;							// 目标用户ID（请求了对方的音视频）
var mRefreshVolumeTimer = -1; 					// 实时音量大小定时器
var mRefreshPluginTimer = -1;					// 检查插件是否安装完成定时器
var mDefaultAppID = "13fab0cd-f9ea-41f1-960a-5c6ef46a3918";
var mDefaultUser = "wangxin";// 默认用户名
var mDefaultPassword = "gv";// 默认用户密码
var mDefaultRoomID = "2";
// 日志记录类型，在日志信息栏内显示不同的颜色
var LOG_TYPE_NORMAL = 0;
var LOG_TYPE_API = 1;
var LOG_TYPE_EVENT = 2;
var LOG_TYPE_ERROR = 3;

// 通知类型，在文字消息栏内显示不同的颜色
var NOTIFY_TYPE_NORMAL = 0;
var NOTIFY_TYPE_SYSTEM = 1;
function VideoLogin() {
    setTimeout(function () {
        if (navigator.plugins && navigator.plugins.length) {
            window.navigator.plugins.refresh(false);
        }
        //检查是否安装了插件	
        var NEED_ANYCHAT_APILEVEL = "0"; 						// 定义业务层需要的AnyChat API Level
        var errorcode = BRAC_InitSDK(NEED_ANYCHAT_APILEVEL); 	// 初始化插件
        AddLog("BRAC_InitSDK(" + NEED_ANYCHAT_APILEVEL + ")=" + errorcode, LOG_TYPE_API);
        if (errorcode == GV_ERR_SUCCESS) {
            if (mRefreshPluginTimer != -1)
                clearInterval(mRefreshPluginTimer); 			// 清除插件安装检测定时器
            AddLog("AnyChat Plugin Version:" + BRAC_GetVersion(0), LOG_TYPE_NORMAL);
            AddLog("AnyChat SDK Version:" + BRAC_GetVersion(1), LOG_TYPE_NORMAL);
            AddLog("Build Time:" + BRAC_GetSDKOptionString(BRAC_SO_CORESDK_BUILDTIME), LOG_TYPE_NORMAL);
            GetID("prompt_div").style.display = "none"; 		// 隐藏插件安装提示界面
            BRAC_SetSDKOption(BRAC_SO_VIDEOBKIMAGE, "./images/anychatbk.jpg");
            // 初始化界面元素
            //下载插件界面关闭按钮
            GetID("prompt_div_headline2").onclick = function () {
                document.URL = location.href;
            }
            //BRAC_SetSDKOption(BRAC_SO_CORESDK_USEHWCODEC, 1);
            // 自动登录
            BRAC_SetSDKOption(BRAC_SO_CLOUD_APPGUID, mDefaultAppID);        // 设置应用ID
            var errorcode = BRAC_Connect(mDefaultServerAddr, mDefaultServerPort); //连接服务器
            if (errorcode == 2) {
                VideoLogin();
            } else {
                AddLog("BRAC_Connect(" + mDefaultServerAddr + "," + mDefaultServerPort + ")=" + errorcode, LOG_TYPE_API);
                //  BRAC_Logout();
                errorcode = BRAC_Login(mDefaultUser, mDefaultPassword, 0);
                // InitAdvanced();
                AddLog("BRAC_Login(" + mDefaultUser + ")=" + errorcode, LOG_TYPE_API);
            }
        } else { 						// 没有安装插件，或是插件版本太旧，显示插件下载界面
            GetID("prompt_div").style.display = "block";
            if (errorcode == GV_ERR_PLUGINNOINSTALL)
                GetID("prompt_div_line1").innerHTML = "首次进入需要安装插件，请点击下载按钮进行安装！";
            else if (errorcode == GV_ERR_PLUGINOLDVERSION)
                GetID("prompt_div_line1").innerHTML = "检测到当前插件的版本过低，请下载安装最新版本！";
            if (mRefreshPluginTimer == -1) {
                mRefreshPluginTimer = setInterval(function () { LogicInit(); }, 1000);
            }
        }
    }, 500);
}
// 退出房间,退出登录
function VideoLogout() {
    var errorcode = BRAC_LeaveRoom(-1);
    AddLog("BRAC_LeaveRoom(" + -1 + ")=" + errorcode, LOG_TYPE_API);
    if (mRefreshVolumeTimer != -1) {
        clearInterval(mRefreshVolumeTimer); // 清除实时音量显示计时器
    }
    mTargetUserId = -1;
    errorcode = BRAC_Logout();
    AddLog("BRAC_Logout()=" + errorcode, LOG_TYPE_API);
}

function ConfigAnyChatParameter() {

}
// 请求进入指定的房间
function EnterRoomRequest(roomid) {
    var errorcode = BRAC_EnterRoom(roomid, "", 0); //进入房间
    AddLog("BRAC_EnterRoom(" + roomid + ")=" + errorcode, LOG_TYPE_API);
}

function GetID(id) {
    if (document.getElementById) {
        return document.getElementById(id);
    } else if (window[id]) {
        return window[id];
    }
    return null;
}
// 打开指定用户的音视频
function RequestOtherUserVideo(userid) {
    // 判断是否需要关闭之前已请求的用户音视频数据
    if (mTargetUserId != -1) {
        reVideoDivSize();
        BRAC_UserCameraControl(mTargetUserId, 0);
        BRAC_UserSpeakControl(mTargetUserId, 0);
    }
    mTargetUserId = userid; 				//设置被点用户ID为全局变量
    BRAC_UserCameraControl(userid, 1); 		// 请求对方视频
    BRAC_UserSpeakControl(userid, 1); 		// 请求对方语音
    // 设置远程视频显示位置
    BRAC_SetVideoPos(userid, GetID("AnyChatRemoteVideoDiv"), "ANYCHAT_VIDEO_REMOTE");
}
//获取当前时间  (00:00:00)
function GetTheTime() {
    var TheTime = new Date();
    return TheTime.toLocaleTimeString();
}

// 添加日志并显示，根据不同的类型显示不同的颜色
function AddLog(message, type) {
    if (type == LOG_TYPE_API) {			// API调用日志，绿色
        App.logger.info(message);
    } else if (type == LOG_TYPE_EVENT) {	// 回调事件日志，黄色
        App.logger.info(message);
    } else if (type == LOG_TYPE_ERROR) {	// 出错日志，红色
        App.logger.warn(message);
    } else {							// 普通日志，灰色
        App.logger.info(message);
    }
}
//恢复显示视频div大小
function reVideoDivSize() {
    var divWidth = GetID("AnyChatRemoteVideoDiv").offsetWidth;
    var divHeight = GetID("AnyChatRemoteVideoDiv").offsetHeight;
    if (divWidth < divHeight) {
        GetID("AnyChatRemoteVideoDiv").style.width = (4.0 / 3 * divHeight) + "px";
        GetID("AnyChatRemoteVideoDiv").style.height = divHeight + "px";
    }
}