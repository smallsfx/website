/* ========================================================================
* App.modules.map v1.0
* 0101.地图
* ========================================================================
* Copyright 2016-2026 WangXin nvlbs,Inc.
* ======================================================================== */
(function (app) {
  if (!app.modules.map) {
    app.modules.map = {};
  }


  app.modules.map.initamap = function () {

    var breadcrumbHeight = $(".content-header").outerHeight();
    var headerHeight = $("header").outerHeight();
    var windowHeight = $(window).outerHeight();
    var footerHeader = $("footer").outerHeight();
    var contentHeight = windowHeight - headerHeight - footerHeader;
    $("#out-content").next().hide();

    $("#out-content").append($("<div id='main-map'/>"));
    $("#main-map").height(contentHeight);

    AMapUI.loadUI(['control/BasicControl'], function (BasicControl) {
      var map;
      // AMap.plugin(['AMap.IndoorMap'], function () {
      //   //设定在没有矢量底图的时候也显示，默认情况下室内图仅在有矢量底图的时候显示

      //   var layerCtrl2 = new BasicControl.LayerSwitcher({
      //     // theme: 'dark',
      //     position: 'lb',
      //     //自定义基础图层
      //     baseLayers: [{
      //       id: 'tile',
      //       name: '栅格图层',
      //       layer: new AMap.TileLayer()
      //     }, {
      //       enable: true,
      //       id: 'satellite',
      //       name: '卫星图层',
      //       layer: new AMap.TileLayer.Satellite()
      //     }
      //     ],
      //     //自定义覆盖图层
      //     overlayLayers: [{
      //       enable: true,
      //       id: 'traffic',
      //       name: '交通路况',
      //       layer: new AMap.TileLayer.Traffic()
      //     }, {
      //       id: 'roadNet',
      //       name: '交通路网',
      //       layer: new AMap.TileLayer.RoadNet()
      //     }, {
      //       id: 'build',
      //       name: "3D建筑",
      //       layer: new AMap.Buildings()
      //     }, {
      //       id: 'indoor',
      //       name: '室内地图',
      //       layer: new AMap.IndoorMap({ alwaysShow: true })
      //     }]
      //   });
      var map = new AMap.Map('main-map', {
        resizeEnable: true,
        zoom: 18,
        center: [116.397428, 39.90923],
        //这里将layerCtrl中启用的图层传递给map
        // layers: layerCtrl2.getEnabledLayers()
        defaultLayer: new AMap.TileLayer.Satellite()
      });
      // map.defaultLayer
      // var layer = new AMap.TileLayer.Satellite({ map: map });
      // map.defaultLayer.on('complate', function () {
      //   console.log("layer - complated");
      // });
      var google = 'http://mt2.google.cn/vt/lyrs=s@727&hl=zh-CN&gl=cn';
      // indoorMap.showIndoorMap('B000A856LJ');
      // map.getLayers()[0].on('complate', function () {
      //   console.log("layer - complated");
      // });

      map.on("moveend", function () {
        var zoom = map.getZoom();
        if (zoom < 14) {
          return;
        }
        // console.log(zoom);
        $(".amap-satellite>img").each(function (index, item) {
          var src = item.src;

          if (src.indexOf('google') > -1) {

          } else {
            var i = src.indexOf('&x=');
            var args = src.substring(i);
            item.src = google + args;
          }
        });
      });

      map.setCity("铁岭");
      // map.addControl(layerCtrl2);

      // // 路况
      // var traffic = new BasicControl.Traffic({
      //   showButton: true,
      //   position: 'lt',
      //   theme: 'normal'
      // });
      // map.addControl(traffic);
      // 图层控制
      // map.plugin(["AMap.MapType"], function () {
      //   //地图类型切换
      //   var type = new AMap.MapType({
      //     defaultType: 0 //使用2D地图 
      //   });
      //   map.addControl(type);
      // });

      // //加载鹰眼
      // map.plugin(["AMap.OverView"], function () {
      //   view = new AMap.OverView();
      //   map.addControl(view);
      // });
      // 比例尺
      map.plugin(["AMap.Scale"], function () {
        var scale = new AMap.Scale();
        map.addControl(scale);
      });

      map.plugin(["AMap.ToolBar"], function () {
        //加载工具条 
        var tool = new AMap.ToolBar();
        map.addControl(tool);
      });

    });


    // });


  };
  app.modules.map.deinitamap = function () {
    $("#out-content").empty();
    // $("#out-content").attr("style","");
    $("#out-content").next().show();
  }
})(App);