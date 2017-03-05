function showHidden(instType){
	if(!isNotBlank(instType)){
		return;
	}
	if(instType.indexOf("allIn") >= 0){
		$("#fromStartDateSpan").show(); 
		$("#fromStartDateDiv").show(); 
		$("#ldSpan").css("margin-left","33px");
	}else if(instType.indexOf("allYear") >= 0){
		$("#yearSpan").show(); 
		$("#yearDiv").show();
		$("#monthSpan").show(); 
		$("#monthDiv").show(); 
		$("#monthSpan").addClass("margin-left-out");
		$("#ldSpan").addClass("margin-left-out");
	}else if(instType.indexOf("allMoth") >= 0){
		$("#monthSpan").show(); 
		$("#monthDiv").show();
		$("#ldSpan").css("margin-left","32px");
	}else if(instType.indexOf("allLd") >= 0){
		$("#yearSpan").show(); 
		$("#yearDiv").show();
		$("#monthSpan_1").show(); 
		$("#monthDiv_1").show(); 
		/*$("#instructionLeaderSpan").show(); 
		$("#instructionLeaderDiv").show(); */
	}else if(instType.indexOf("allFB") >= 0){
		$("#feedBackStautsSpan").show(); 
		$("#feedBackStautsDiv").show(); 
	}else if(instType.indexOf("allDept") >= 0){
		//$("#fromDeptSpan").show(); 
		//$("#fromDeptDiv").show(); 
		$("#draftDeptSpan").show(); 
		$("#draftDeptDiv").show(); 
		$("#ldSpan").css("margin-left","32px");
	}else if(instType.indexOf("allDone") >= 0){
		$("#instructionStatusSpan").show(); 
		$("#instructionStatusDiv").show(); 
		$("#instructionLeader").css("margin-left","27px");
		$("#noSpan").addClass("margin-left-out");
	}else if(instType.indexOf("allNo") >= 0){
		$("#instructionNoSpan").show(); 
		$("#instructionNoDiv").show(); 
		$("#instructionLeader").css("margin-left","16px");
		$("#noSpan").addClass("margin-left-out");
	}
}

//异步交互请求参数封装
function requestStr(url,instType){
	if(!isNotBlank(url) || !isNotBlank(instType)){
		return url;
	}
    var requestStr = url;
	if(url.indexOf("?")<=-1 && url.indexOf("&")<=-1){
		requestStr = requestStr + "?";
	}else if(url.indexOf("?")>0){
		requestStr = requestStr + "&";
	}
    if(instType=="toDo" && isNotBlank(instructionType)){
    	if(isNotBlank(separateColumn) && separateColumn == "2" ){
    		requestStr=requestStr+"fromDept="+encodeURI(window.encodeURI($("#fromDept").val()))+"&";
    	}
    }
	if(instType.indexOf("allYear") >= 0 && isNotBlank($("#year").val())){
   		requestStr = requestStr + "year=" + window.encodeURI($("#year").val()) + "&";
    }
    if(instType.indexOf("allMoth") >= 0 && isNotBlank($("#month").val())){
   		requestStr = requestStr + "month=" + window.encodeURI($("#month").val()) + "&";
    }
    //if(instType.indexOf("allDept") >= 0 && isNotBlank($("#fromDept").val())){
   		//requestStr = requestStr + "fromDept=" + window.encodeURI($("#fromDept").val()) + "&";
    //}
    if(instType.indexOf("allDept") >= 0 && isNotBlank($("#draftDept").val())){
   		requestStr = requestStr + "draftDept=" + window.encodeURI($("#draftDept").val()) + "&";
    }
    if(instType.indexOf("allFB") >= 0 && isNotBlank($("#feedBackStauts").val())){
   		requestStr = requestStr + "feedBackStauts=" + window.encodeURI($("#feedBackStauts").val()) + "&";
    }
    if(instType.indexOf("allDone") >= 0){
    	if(isNotBlank($("#wfState").val())){
    		requestStr = requestStr + "wfState=" + window.encodeURI($("#wfState").val()) + "&";
    	}
    	if(isNotBlank($("#archiveType").val())){
    		requestStr = requestStr + "archiveType=" + window.encodeURI($("#archiveType").val()) + "&";
    	}
    }
    if(instType.indexOf("allNo") >= 0 && isNotBlank($("#instructionNo").val())){
   		requestStr = requestStr + "instructionNo=" + window.encodeURI($("#instructionNo").val()) + "&";
    }
    if(instType.indexOf("done") >= 0 && isNotBlank($("#isRecord").val())){
   		requestStr = requestStr + "isRecord=" + window.encodeURI($("#isRecord").val()) + "&";
    }
    if(instType.indexOf("done") >= 0 && isNotBlank($("#archiveType").val())){
   		requestStr = requestStr + "archiveType=" + window.encodeURI($("#archiveType").val()) + "&";
    }
    if("toDo|doing|copy|done|allLd".indexOf(instType) >= 0 && isNotBlank($("#instructionLeader").val())){
   		requestStr = requestStr + "instructionLeader=" + window.encodeURI($("#instructionLeader").val()) + "&";
    }
    if("toDo|doing|copy|done|allIn".indexOf(instType) >= 0  && isNotBlank($("#instructionContent").val())){
   		requestStr = requestStr + "instructionContent=" + window.encodeURI($("#instructionContent").val()) + "&";
    }
    if("toDo|doing|copy|done|allIn".indexOf(instType) >= 0  && isNotBlank($("#fromTitle").val())){
   		requestStr = requestStr + "fromTitle=" + window.encodeURI($("#fromTitle").val()) + "&";
    }
    if("toDo|doing|copy|done".indexOf(instType) >= 0  && isNotBlank($("#instructionOrder").val())){
   		requestStr = requestStr + "instructionOrder=" + encodeURI(window.encodeURI($("#instructionOrder").val())) + "&";
    }
    if("toDo|doing|copy|done|allIn".indexOf(instType) >= 0){
		var fromStartDate = window.encodeURI($("#fromStartDate").val());
		var fromEndDate = window.encodeURI($("#fromEndDate").val());
		if(!isNotBlank($("#fromStartDate").val())){
			fromStartDate = "0000-00-00 00:00:00";
		}
		if(!isNotBlank($("#fromEndDate").val())){
			fromEndDate = curDateTime() ;	
		}
		if(isNotBlank($("#fromStartDate").val()) || isNotBlank($("#fromEndDate").val())){
		    requestStr = requestStr + "fromStartDate=" + fromStartDate +"&"+ "fromEndDate=" + fromEndDate + "&";
		}else{
			requestStr = requestStr + "fromStartDate=null&fromEndDate=null&";
		}
    }

	if(requestStr.indexOf("?")<=-1 && requestStr.indexOf("&")<=-1){
		requestStr = requestStr + "?etc="+new Date().getTime();
	}else if(requestStr.indexOf("&")>0){
		requestStr = requestStr + "etc="+new Date().getTime();
	}
	return requestStr;
}

//查看详情
function execute(id){
	var item = getRecord(id);
	uf_doAction(item.wfId,item.wfName,item.task_name,item.version);
}

//获取id
function getRecord(selId) {
	var getIndex = -1,getId="#grid_"+selId;
    getIndex = $(getId).attr("index");
    if(getIndex == -1){
    	return null;
    }
	return gridOne.getRowRecord(gridOne.getRow(getIndex));
}

//排除 |null|"null"|""|" "|undefined|
function isNotBlank(obj){
	if(null == obj || "undefined" == obj.trim() || "null" == obj.trim() || "" ==obj.trim() || obj.trim().length <=0){
 		return false;
	}
	return true;
}


//标准当前时间格式 yyyy-MM-dd HH:MM:SS
function curDateTime(){
	var d = new Date(); 
	var year = d.getFullYear(); 
	var month = d.getMonth()+1; 
	var date = d.getDate(); 
    var hours = d.getHours(); 
	var minutes = d.getMinutes(); 
	var seconds = d.getSeconds(); 
	var ms = d.getMilliseconds(); 
	var curDateTime = year;
	if(month>9){
		curDateTime = curDateTime +"-"+month;
	}else{
		curDateTime = curDateTime +"-0"+month;
	}
	if(date>9){
		curDateTime = curDateTime +"-"+date;
	}else{
		curDateTime = curDateTime +"-0"+date;
	}
	curDateTime = curDateTime +" ";
    if(hours>9){
		curDateTime = curDateTime +""+hours;
	}else{
		curDateTime = curDateTime +"0"+hours;
	}
	if(minutes>9){
		curDateTime = curDateTime +":"+minutes;
	}else{
		curDateTime = curDateTime +":0"+minutes;
	}
	if(seconds>9){
		curDateTime = curDateTime +":"+seconds;
	}else{
		curDateTime = curDateTime +":0"+seconds;
	}
	return curDateTime; 
}