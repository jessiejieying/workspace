/**
 * 
 * @authors mohanlan (mohanlan2014@sina.com)
 * @date    2014-08-19 09:17:07
 * @version 1.0
 *面向对象的ImgList
 */

var imgListObject = function(setting){
	this.default = {
		containsSize:{width:1000,height:600}, //容器大小
		renderTo: $(document.body), 	//imgList的承载容器，默认为document.body
		enablePaging:false,			    //可否分页
		listTitle:"图片列表标题",		//图片列表标题
		enableShowDetails:false,		//可否显示详情
		url:"common/imgs/huiyishi.jpg",
		text:"common/imgs/huiyishi2.jpg"
	}
	this.opts = $.extend({},this.default,setting);
	
}
imgListObject.prototype ={
	//初始化页面
	init:function(){
		var containsHtml = "<div class='container' style='width:"+this.opts.containsSize.width+"px;height:"+this.opts.containsSize.height+"px;'>";	
		containsHtml+="<div class='listTitle'>"+this.opts.listTitle+"</div>";	
		containsHtml+="<div class='imglist'><div class='showDiv'></div></div>"									//
		containsHtml+="</div>"
		//console.log(this.opts.renderTo);
		$(containsHtml).appendTo(this.opts.renderTo);
	},
	//加载数据 & 数据显示格式
	loadJson:function(url,data){
		//var o="url";
		var ImgContent="<div class='img alpha'><div class='imgContent'><div class='logo'><img src="+this.opts["text"]+" onerror='alert(\'dd\')'><span></span></div><div class='imgRight'><div class='imgInfo'><span>【西湖厅】</span><i>A3308</i><i>可容纳人数：300</i><i>不可外租</i></div></div><div class='imgFunction'><a href=>删除</a><a href=>修改</a></div></div><div class='imgDetail'><p>这是这个会议室的详细描述信息！</p></div></div>"
        //console.log();
        $(ImgContent).appendTo($(".container .imglist"));
	},
	setDetailsView:function(){

	},
	setFunction:function(){

	}
	



}


