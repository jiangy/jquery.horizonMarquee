/**
 * jQuery.horizonMarquee
 * Copyright (c) 2013 Jiang Yong
 * Licensed under MIT (http://www.opensource.org/licenses/mit-license.php) license.
 *
 * @author Jiang Yong
 * @email jiangyong.hn(at)gmail.com
 * @url https://github.com/jiangy/jquery.horizonMarquee
 * @version 0.1.0
 * @date 2013.11.30
 *
 */
;(function($) {
	$.fn.horizonMarquee = function(configs) {
		return this.each(function() {
			var settings = {
				"pre" : ".hm-pre", // 默认前翻按钮对象
				"next" : ".hm-next", // 默认后翻按钮对象
				"list" : ".hm-list", // 默认滚动元素列表对象
				"text" : ".hm-text", // 与各滚动元素关联的文字标题列表
				"icon" : ".hm-icon", // 指示元素父元素
				"iconctl" : "mouseover", // 指示元素对鼠标的响应方式，mouseover——鼠标在元素上时或click——点击元素时切换到指示的滚动元素
				"step" : 1, // 自动滚动或点击pre、next按钮时滚动元素的数量
				"duration" : 1000, // 单次滚动持续时间
				"interval" : 2000, // 自动滚动间隔时间
				"autoplay" : true // 是否自动滚动
			};
			$.extend(settings, $.fn.horizonMarquee.defaults, configs);
			var pre = $(settings.pre, this);
			var next = $(settings.next, this);
			var list = $(settings.list, this);
			var text = $(settings.text + " > *", this);
			var icon = $(settings.icon + " > *", this);
			var num = list.children().length; // 元素的个数
			var width = settings.width ? settings.width : list.children().width(); // 单个元素宽度
			var cur = 0; // 当前展示的元素
			// 基本css设置
			list.css({"position" : "relative", "width" : num * width * 2 + "px"});
			list.parent().css({"position" : "relative", "overflow" : "hidden"});
			list.append(list.html());
			// 滚动到cur指示元素
			var move = function() {
				list.stop(true,false).animate({left: -cur * width + "px"}, settings.duration);
				if(text.length > cur % num)	$(text[cur%num]).show().siblings().hide();
				if(icon.length > cur % num)	$(icon[cur%num]).addClass("active").siblings().removeClass("active");
			};
			// 向左或向右一次滚动|offSet|个元素，负号向左滚，否则向右滚
			var change = function(offSet) {
				cur += offSet;
				if(cur < 0) {
					cur += num;
					list.css("left", -(cur - offSet) * width + "px");
				} else if(cur > num + offSet) {
					cur -= num;
					list.css("left", -(cur - offSet) * width + "px");
				}
				move();
			};
			// 指示元素事件
			icon.each(function(index) {
				$(this).on(settings.iconctl, function() {
					if(cur >= num)	list.css("left", -(cur % num) * width + "px");
					cur = index;
					move();
				});
			});
			// 前后翻事件
			pre.click(function() {change(-settings.step); return false;});
			next.click(function() {change(settings.step); return false;});
			// 自动滚动相关设置
			var auto = function() {change(settings.step); move();};
			var ctl;
			if(settings.autoplay) {
				ctl = setInterval(auto, settings.interval);
				$(this).hover(function() {clearInterval(ctl);}, function() {ctl = setInterval(auto, settings.interval);});
			}
		}); // return end
	}; // horizonMarquee end
})(jQuery);
