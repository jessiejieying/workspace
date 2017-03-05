/**
 * 
 * @authors mohanlan (mohanlan2014@sina.com)
 * @date    2014-09-01 13:49:20
 * @version 1.1
 */
var imgListObject = function(setting){
	this.defaultOpts = {
		containsSize:{width:1000,height:600}, //容器大小
		renderTo: $(document.body), 	//imgList的承载容器，默认为document.body
		enablePaging:false,			    //可否分页
		listTitle:"图片列表标题",		//图片列表标题
		enableShowDetails:false		//可否显示详情
	};
	this.dataForm;
	this.operation;
	this.opts = $.extend({},this.defaultOpts,setting);
	
}

function errorHandler(obj){
	obj.src="common/imgs/huiyishi.jpg";
}
imgListObject.prototype ={
	//初始化页面
	init:function(){
		var containsHtml = "<div class='container' style='width:"+this.opts.containsSize.width+"px;height:"+(this.opts.containsSize.height-100)+"px;'>";	
		containsHtml+="<div class='listTitle'>"+this.opts.listTitle+"</div>";	
		containsHtml+="<div class='imglist'><div class='showDiv'></div></div>"									
		containsHtml+="</div>"
		//console.log(this.opts.renderTo);
		$(containsHtml).appendTo(this.opts.renderTo);
	},
	setDataForm:function(dataForm){
		this.dataForm=dataForm;
		//console.log(this.dataForm);
	},
	//加载数据 & 数据显示格式
	loadJson:function(url){
		var thisOb=this;
		//console.log(this.dataForm);
		$.ajaxSettings.async = false;
		//console.log(data);
		$.getJSON(url,{},function(json){
			//alert('123');
			thisOb.jsonSuccessFunction(json);		//防止异步传输 无法return值问题
		});
	},
	//获取Json数据
	jsonSuccessFunction:function(json){

		var dataFormat=this.dataForm;

		for(var i in json.data){
			
			for(var j in dataFormat.details){
				var detailsInfo;
				var val=(json.data[i][dataFormat.details[j].value]==null?"":json.data[i][dataFormat.details[j].value]);
				if(dataFormat.details[j].type=="title"){
					detailsInfo="<span class='title'>"+val+"</span>";
				}else if(dataFormat.details[j].type=="line"){
					detailsInfo+="<i class='line'><span>"+dataFormat.details[j].name+":</span>"+val+"</i>";
				}else if(dataFormat.details[j].type=="textarea"){
					detailsInfo+="<p class='textarea'><span>"+dataFormat.details[j].name+":</span>"+val+"</p>";
				}
				
			}
			if(!isNaN(parseInt(i))){
					var ImgContent="<div class='img'><div class='imgContent'><div class='logo'><img src="+json.data[i][dataFormat.imgUrl]+" onerror='this.src=&quot;"+projectName+"/aufw/resources/userDefaultPhoto/default_l.png&quot;'><span></span></div><div class='imgRight'><div class='imgInfo'><span>【"+json.data[i][dataFormat.title]+"】</span><i>"+dataFormat.info1.name+":"+(json.data[i][dataFormat.info1.value]==null?"":json.data[i][dataFormat.info1.value])+"</i><i>"+dataFormat.info2.name+":"+(json.data[i][dataFormat.info2.value]==null?"":json.data[i][dataFormat.info2.value])+"</i><i>"+dataFormat.info3.name+":"+(json.data[i][dataFormat.info3.value]==null?"":json.data[i][dataFormat.info3.value])+"</i></div></div><div class='imgFunction' id="+json.data[i][dataFormat.id]+"></div></div><div class='imgDetail'><span class='span1'></span><span class='span2'></span><div class='detailsInfo' id='detailsInfo'>";
        	ImgContent=ImgContent+detailsInfo+"</div></div></div>";
        	$(ImgContent).appendTo($(".container .imglist")); 

        	if(this.opts.enableShowDetails==true){
        		this.showDetailsView();
        	}	
		}
			}
			
	},
	//设置详细内容显示格式
	showDetailsView:function(detailcontent){
		/*<div class='imgDetail'><p>这是这个会议室的详细描述信息！</p></div>*/
		this.matchDetailsClass(this);

	},
	//设置操作函数
	setFunction:function(operation){
		this.operation=operation;
		var operations=this.operation;
		var operationHtml="";
		for(var i in operations){
			operationHtml+="<a id="+i+" class="+i+" >"+operations[i]+"</a>";
		}
		$(operationHtml).appendTo($(".imgFunction"));
		this.matchFunctionClass();
	},
	
	//添加分页功能
	paging:function(){

	},
	
	//匹配函数的class
	matchFunctionClass:function(data){
		//alert("beginMatch");
		$(".img").hover(function() {
			//alert("hover");

			$(this).find($(".imgFunction")).css("display","block");
		}, function() {
			//console.log("unhover");
			$(this).find($(".imgFunction")).css("display","none");
		});
	},
	//详细信息的class
	matchDetailsClass:function(parentThis){
		var ob=$(".showDiv")
		$(".img").hover(function() {
			var content = $(this).find($(".imgDetail")).html();
			//console.log(content);
			ob.empty();
    		ob.append(content);
    		ob.addClass("showDivShow");
    		parentThis.setDetailsPosition($(this));
    		
		}, function() {
			ob.empty();
    		ob.removeClass("showDivShow");
		});

	},setDetailsPosition:function(ob){
		//alert("setPosition");
		var obShow=$(".showDiv");
			//console.log(obShow.width()+":"+obShow.height());
		var Container=$(".container");
		var obx1=ob.position().left;
		var oby1=ob.position().top;
		var xContent=Container.width();
		var yContent=Container.height();
		var obx2=xContent-obx1-206;
		var oby2=yContent-oby1-116;
		//console.log(obx1+"："+obx2+","+oby1+":"+oby2);
		var x=0;
		var y=0;
		var span1=$(".span1");
		var span2=$(".span2");
		if(obx1>obx2){
			x=obx1-250;
			obShow.css('border-right', 'none');	
		}else{
			x=obx1+200;
			obShow.css('border-left', 'none');	
		}
		if(oby1>oby2){
			y=oby1-obShow.height()+100;
			
		}else{
			y=oby1;
		}
		$(".showDiv").css({
			"margin-left": x+'px',
			"margin-top": y+'px'
		});
		//alert(x+":"+y);
		//if()
		//alert(xContent);

	},
	hideTitle:function(){
		//alert("beginHide");
		$(".listTitle").css('display', 'none');
	},
	//清除现有数据，保留基本框架
	cleanAll:function(){
		var mainContent=$(this.opts.renderTo).find('.imglist');
		mainContent.empty();
		mainContent.append("<div class='showDiv'></div>")
		//console.log();
	},
	reloadJson:function(url){
		this.cleanAll();
		this.loadJson(url);
		if(this.operation != null){
			this.setFunction(this.operation);
		}
	}
}



