/* ========================================================================
 * App.map version 1.0
 * 百度地图操作插件
 * ========================================================================
 * Copyright 2015-2025 WangXin nvlbs,Inc.
 *
 * ======================================================================== */
( function ( app ) {
    // 地图初始化参数
    var options = {
        "map": {
            "zoomCity":"沈阳"
            ,"zoomLevel":15
        }
    };

    var map = null,overlays = [],workeroverlays=[];
    //全局变量是否调用过createMarkerClusterer
    var clusterFlag = false;

    var handleMapContent = function () {
        var viewport = App.ViewPort;
        $( "#Map" ).css( "height", viewport.height + "px" );
    }

    //根据经纬极值计算绽放级别。
    var getZoom = function(maxLng, minLng, maxLat, minLat) {
        var zoom = ["50","100","200","500","1000","2000","5000","10000","20000","25000","50000","100000","200000","500000","1000000","2000000"]//级别18到3。
        var pointA = new BMap.Point(maxLng,maxLat);  // 创建点坐标A
        var pointB = new BMap.Point(minLng,minLat);  // 创建点坐标B
        var distance = map.getDistance(pointA,pointB).toFixed(1);  //获取两点距离,保留小数点后两位
        for (var i = 0,zoomLen = zoom.length; i < zoomLen; i++) {
            if(zoom[i] - distance > 0){
                return 18-i+3;//之所以会多3，是因为地图范围常常是比例尺距离的10倍以上。所以级别会增加3。
            }
        };
    }

    //根据原始数据计算中心坐标和缩放级别，并为地图设置中心坐标和缩放级别。
    var setZoom = function (points){
        if(points.length>0){
            var maxLng = points[0].lng;
            var minLng = points[0].lng;
            var maxLat = points[0].lat;
            var minLat = points[0].lat;
            var res;
            for (var i = points.length - 1; i >= 0; i--) {
                res = points[i];
                if( !res.lng || !res.lat){continue;}
                if(res.lng > maxLng) maxLng =res.lng;
                if(res.lng < minLng) minLng =res.lng;
                if(res.lat > maxLat) maxLat =res.lat;
                if(res.lat < minLat) minLat =res.lat;
            };
            var cenLng =(parseFloat(maxLng)+parseFloat(minLng))/2;
            var cenLat = (parseFloat(maxLat)+parseFloat(minLat))/2;
            var zoom = getZoom(maxLng, minLng, maxLat, minLat);
            map.centerAndZoom(new BMap.Point(cenLng,cenLat), zoom);
        }else{
            //没有坐标，显示全中国
            map.centerAndZoom(new BMap.Point(103.388611,35.563611), 5);
        }
    }
    app.map = {
        "init": function ( target ) {
            App.addResizeHandler( handleMapContent );

            map = new BMap.Map( target );
            // map.setMapStyle({style:"midnight"});
            // map.addControl(new BMap.MapTypeControl());   //添加地图类型控件
            map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
            map.centerAndZoom(options.map.zoomCity,options.map.zoomLevel);
            //   $(".anchorBL").remove();
            //   $(".BMap_cpyCtrl").remove();
        }
        ,"addPOI_pad":function(options){
            var pt = new BMap.Point(options.lon, options.lat);
            var size = new BMap.Size(options.height,options.width)
            var icon = new BMap.Icon(options.icon, size);
            var marker = new BMap.Marker(pt,{icon:icon});
            map.addOverlay(marker);
            overlays.push({"overlay":marker,"data":options});

            var opts = {
                width : 30,     // 信息窗口宽度
                height: 75,     // 信息窗口高度
                enableMessage:false
            }
            var name = App.base64.decode(options.data.name);
            var loginName = App.base64.decode(options.data.loginName);
            var gydw = App.base64.decode(options.data.gydw);

            var sContent =
                "<p style='margin:0;line-height:1.5;font-size:13px;text-indent:0em'>管养单位："+gydw+"<br/>登录名称："+loginName+"<br/>用户信息："+name+"</p>" +
                "</div>";
            var infoWindow = new BMap.InfoWindow(sContent, opts);

            marker.addEventListener("click", function(){
                map.openInfoWindow(infoWindow,pt); //开启信息窗口
            });
            marker.addEventListener("rightclick", function(){
                if( options.rightclick){
                    options.rightclick(options.id,options.type);
                }
            });

        }
        ,"addPOI":function(options){
            var pt = new BMap.Point(options.lon, options.lat);
            var size = new BMap.Size(options.height,options.width)
            var icon = new BMap.Icon(options.icon, size);
            var marker = new BMap.Marker(pt,{icon:icon});
            // BMap.Convertor.translate();


            map.addOverlay(marker);
            /*if(options.type=="5"){
             var removeMarker = function(e,ee,marker){
             App.plugins.menu.videoClick(options.id,options.type);
             }
             //创建右键菜单
             var markerMenu=new BMap.ContextMenu();
             markerMenu.addItem(new BMap.MenuItem('开启视频',removeMarker.bind(marker)));
             marker.addContextMenu(markerMenu);
             }*/

            overlays.push({"overlay":marker,"data":options});
            marker.addEventListener("click", function(){
                var p = marker.getPosition();
                if( options.click){
                    options.click(options.id,options.type);
                }
            });
            marker.addEventListener("rightclick", function(){
                // var p = marker.getPosition();
                if( options.rightclick){
                    options.rightclick(options.id,options.type);
                }
            });



        }
        ,"clear":function(){
            map.clearOverlays();
            overlays = [];
        }
        ,"resetState":function(states){
            $.each(overlays,function(index,item){
                var state = states[item.data.id];
                if( state && item.state != state.state){
                    item.state = state.state;
                    item.icon = state.icon;
                    var size = new BMap.Size(options.height,options.width)
                    var icon = item.overlay.getIcon();
                    icon.setImageUrl(item.icon);
                    item.overlay.setIcon(icon);
                }
            });
            this.refreshState();
        }
        ,"centerToPOIs":function(){
            setTimeout(function() {
                var points=[];
                $.each(overlays,function(index,item){
                    points.push(item.overlay.getPosition());
                });
                setZoom(points);
            }, 500);
        }
        ,"refreshState":function(){
            var checkeds = [];
            $(".tag-container .checked").each(function(index,item){
                checkeds.push( $(this).attr("data-id") );
            });
            map.clearOverlays();
            $.each(overlays,function(index,item){
                if($.inArray(item.data.state, checkeds) != -1){
                    map.addOverlay(item.overlay);
                }
            });
        }
    };
} )( App );