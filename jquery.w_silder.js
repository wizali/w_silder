/*
初始化使用var s = $().w_silder({
  width : int,    组件宽度
  height : int,   组件高度
  yearNum : int,     一共的年数
});
额外注册方法：s.viewPercent = function(p){} 后可以实时获取百分比
使用方法：s.getPercent() 可以获取当前百分比
*/
(function($) {
  $.fn.w_silder = function(o) {
    var that = this,
      setting = {
        yearNum: 0
      }, c, s, b, w, h, p_span, cleft, cright, i, scrollPercent;
    if (o) {
      $.extend(setting, o);
    }

    function pixelToNum(p) { //工具方法，把获取的像素值转换成数字
      return parseInt(p.toLowerCase().replace("px", ""), 10);
    }

    function initialize() { //初始化方法
      buildSilder();
      setEvents();
      return that;
    }

    function buildSilder() { //构造滑动条,更具年份的多少插入红色的条状标记     
      c = $("<div><div></div><div></div></div>")
        .attr("class", "w_container")
        .css({
          "width": setting.width,
          "height": that.css("height")
        })
        .appendTo(that);
      w = setting.hasOwnProperty("width") ? setting.width : pixelToNum(that.css("width"));
      h = setting.hasOwnProperty("height") ? setting.width : pixelToNum(that.css("height"));
      b = c.find("div").eq(0);
      s = c.find("div").eq(1);
      b.attr("class", "w_bar").css("margin-top", h / 2 - pixelToNum(b.css("height")) + "px");
      s.attr("class", "w_silder").css({
        "height": (h + 4) + "px",
        "top": "-2px"
      });
      cleft = c.offset().left;
      cright = cleft + pixelToNum(c.css("width"));

      if (setting.yearNum != 0) {
        var _w = pixelToNum(c.css("width")),
          distance = _w / (setting.yearNum - 1),
          n = setting.yearNum,
          _span = $("<span class='w_span'></span>");
        for (i = 0; i < n; i++) {
          var __span = _span.clone().css("height", "100%");
          c.append(__span);
          if (i > 0) {
            __span.css("left", i * distance - pixelToNum(__span.css("width")));
          }
        }
      }
      p_span = $("<span class='p_span'>0%</span>");
      s.append(p_span);
      var p_span_b = (Math.abs(pixelToNum(s.css("top"))) + (h + 2.5) + "px");
      var p_span_l = "-" + ((pixelToNum(p_span.css("width"))) / 2 - (pixelToNum(s.css("width"))) / 2) + "px";
      p_span.css({
        "bottom": p_span_b,
        "left": p_span_l
      });
    }

    function setEvents() { //添加事件监听
      s.bind('mousedown', start);
      c.bind('mouseup', drag);
    }

    function start(event) { //鼠标按下触发的事件
      $("body").addClass("noSelect");

      var oThumbDir = parseInt(s.css("left"), 10);
      var sl = event.pageX;
      var ss = oThumbDir;

      $(document).bind('mousemove', drag);
      $(document).bind('mouseup', end);
      s.bind('mouseup', end);
    }

    function drag(event) { //鼠标拖拽触发的事件，计算已经滚动的百分比
      var mleft = event.pageX; //当前鼠标与视窗左边的距离
      if (cleft <= mleft && cright >= mleft) {
        // s.css("left", (mleft-(parseInt(s.css("width").toLowerCase().replace("px",""),10)))+"px");
        s.css("left", (mleft - cleft) + "px");
        b.css("width", (mleft - cleft) + "px");
        p_span.html(that.getPercent());
      }
      if (that.viewPercent != null) {
        that.viewPercent(that.getPercent());
      }
    }

    function end() { //鼠标松开后解除事件绑定
      $("body").removeClass("noSelect");
      $(document).unbind('mousemove', drag);
      $(document).unbind('mouseup', end);
      s.unbind('mouseup', end);
      document.ontouchmove = document.ontouchend = null;
    }
    that.viewPercent = null;
    that.getPercent = function() {
      return (pixelToNum(b.css("width")) / w * 100).toString().substr(0, 4) + "%";
    }
    return initialize();
  }
})(jQuery);