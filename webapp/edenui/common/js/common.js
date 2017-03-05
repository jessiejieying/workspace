
function xdive_arrays(aArr, bArr) { //第一個a數組減去第二個b數組,得到的数组是a数组消除ab数组的交集
	if (bArr.length == 0) {
		return aArr
	}
	var diff = [];

	for (var i = 0; i < aArr.length; i++) {
		if ($.inArray(aArr[i], bArr) == -1) {
			diff.push(aArr[i]);
		}
	}
	return diff;
}

//创建一个函数以取得两个数组的交集
function insec_arrays(xArr, yArr) {
	var byxArr = new Array//交集
	var byyArr = new Array
	for (var i = 0; i < xArr.length; i++) {
		byyArr.push(yArr[$.inArray(xArr[i], yArr)])//x的序列，不是y的序列  抽取x，对比y【y不动】
	}
	byxArr = $.grep(byyArr, function (val, key) {
		return val != null
	})
	return byxArr
}


//拖动左侧蓝线之后
function gridLayout(){

	//将表头和表体的宽度设置成一样
	$(".bsgrid-header").each(function(){
		var $this=$(this);
		var tableGird=$this.closest(".js-fixed-father").find(".bsgrid"),
				tableheaderFixed=$this;
		var $width=parseInt($(tableGird).width() + 1);
		//ie8
		if(navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion .split(";")[1].replace(/[ ]/g,"")!="MSIE8.0"){
			$width=parseInt($(tableGird).width())-1;
		}
		$(tableheaderFixed).width($width);

	});

}

function gridBotLayout(){
	var nextGrid=$(window).height()-$(".grid-table-top").eq(0).height();
	$(".grid-table-top").eq(1).height(nextGrid);

	$(".grid-table-top").each(function(){
		var $this=$(this),
				jsGridFather=$this.height()-$this.find(".js-tool-bar").height()-40;
		$this.find(".js-grid-father").height(jsGridFather);

	});
}




//布局
function layOut(tableId,grid_table,gird_table_bottom){

	//设置页面左右布局,第二个参数为右上，第3个参数为右下
	var windowHeight=$(window).height(),
			girdHeight=(gird_table_bottom)?(windowHeight/2):(windowHeight);
	
		//console.log("windowHeight:"+windowHeight);
		//windowHeight=windowHeight-24;
		//24为面包屑的高度;
		///console.log("windowHeight:"+windowHeight);
	$(tableId).height(windowHeight);
	var scrollHeight=windowHeight-$(".js-line-top").height();
	var gridRedu=$(".js-tool-bar").height()+12;
	$(".tree-father").height(scrollHeight);

	$(".grid-table-top").each(function(){
		var $this=$(this);
		$this.height(girdHeight).find(".grid-father").height(girdHeight-gridRedu);

	});

}

//gird table 高度设置

function girdTable(obj){
	var $this=$(obj);
	var gridTop=$this.closest(".grid-table-top"),
			fatherToolbar=$this.closest(".js-tool-bar"),
			levelSearh=fatherToolbar.find(".level-searh"),
			gridFather=gridTop.find(".grid-father"),
			gridFatherHeight=gridFather.height(),
			levelSearhHeight=levelSearh.eq(0).height();
	//打开
	if(levelSearh.is(":hidden")){
		gridFather.height(gridFatherHeight-levelSearhHeight*(levelSearh.length));
	}
	//关闭
	else{
		gridFather.height(gridFatherHeight+levelSearhHeight*(levelSearh.length));
	}
	fatherToolbar.find(".level-searh").slideToggle();

}

function getRecord(selId) {
	var getIndex = -1,getId="#grid_"+selId;
	getIndex = $(getId).attr("index");
	if(getIndex == -1){
		return null;
	}
	return gridOne.getRowRecord(gridOne.getRow(getIndex));
}
