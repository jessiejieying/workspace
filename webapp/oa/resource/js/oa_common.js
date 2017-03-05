//表格插件对象
var gridOne;
var link=[];
//处理表格内容对齐方式的调整
function changeTable(obj) {
	var ta = $(obj).closest("table");
	if ($(ta).attr("id") == "manage_grid") {
		$("td", obj).each(function(index, td) {
			var th = $("#manage_grid tr th").eq(index);
			if ($(th).attr("w_align")) {
				$(td).css({
					"padding-left" : "0px",
					"text-align" : $(th).attr("w_align")
				});
			}
		});
	}
}
//获取需要归档文档的id值，把id值放入到全局数组中
function archive() {
	var item = gridOne.getCheckedRowsRecords();
	var ids = [];
	$(item).each(function(index, value) {
		ids.push(value.id);
	});
	return JSON.stringify(ids);
}
//出入一个字段名称，根据字段名称获取值
function getFieldValue(fieldName){
	var item = gridOne.getCheckedRowsRecords();
	var ids = [];
	$(item).each(function(index, value) {
		ids.push(value[fieldName]);
	});
	return JSON.stringify(ids);
}
//刷新表格页面
function refreshTable(){
	//alert(gridOne);
	gridOne.refreshPage();
}
//判断值     （undefined   null  空值）等返回false
function  isBlank(val){
	if(val==null || val=="undefined"  || ""==val.replace(/\s+/g,"") || val=="null" || val=="[]"){
		return false;
	}
	return true;
}
//通过配置生成链接
function initLink() {
	if ($("#manage_grid")) {
		var ths = $("#manage_grid tr th");
		//初始化需要生成链接的字段
		link = [];
		ths.each(function(index, value) {
			var link_type=$(value).attr("w_type");
			if ( link_type && link_type=="method" ) {
				var execut=$(value).attr("w_method");
				if(!execut || execut.replace(/\s+/g,"")==""){
					execut=method;
				}
				link.push($(value).attr("w_index")+"|"+execut);
			}
		});
	}
}
//查看任务
function show(id) {
	var task_name = "";
	var item = getRecord(id);
	window.open(showURL + item.wfId);
}

//拼接查询的参数
function  getRequestParam(){
	var params="";
	if(isBlank($("#archiveStatus").val())){
		params=params+"&archiveType="+window.encodeURI($("#archiveStatus").val());
	}
	if(isBlank($("#subject").val())){
		params=params+"&subject="+window.encodeURI($("#subject").val());
	}
	if(isBlank($("#startDate").val())){
		params=params+"&startDate="+window.encodeURI($("#startDate").val());
	}
	if(isBlank($("#endDate").val())){
		params=params+"&endDate="+window.encodeURI($("#endDate").val());
	}
	if(isBlank($("#dept").val())){
		params=params+"&dept="+window.encodeURI($("#dept").val());
	}
	if(isBlank($("#fileType").val())){
		params=params+"&fileType="+window.encodeURI($("#fileType").val());
	}
	if(isBlank($("#billName").val())){
		params=params+"&billName="+window.encodeURI($("#billName").val());
	}
	if(isBlank($("#applicantMan").val())){
		params=params+"&applicantMan="+window.encodeURI($("#applicantMan").val());
	}
	if(isBlank($("#instructionLeader").val())){
		params=params+"&instructionLeader="+window.encodeURI($("#instructionLeader").val());
	}
	if(isBlank($("#draftDept").val())){
		params=params+"&draftDepts="+window.encodeURI($("#draftDept").val());
	}
	params=params+'&etc='+new Date().getTime();
	return params;
}
//获取请求的url
function requestUrl(){
	var symbol = "?";
    if(selectURL.indexOf("?")>0){
      symbol = "&";
     }
    var params=getRequestParam();
    params=params.substring(1,params.length);
    return selectURL+symbol+params
} 