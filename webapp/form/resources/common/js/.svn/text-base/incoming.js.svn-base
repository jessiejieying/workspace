
var nodeName=$urlParam('nodeName');  //节点名称
var wfId = QueryURL.GetValue('wfId');

var mainDataset=window.data_dataset2;  //主数据集
var iniExchangeType=0; //转发文 或转督查标识
var localAdviceType="";  //当前意见类型
//元素设置页面  http://localhost:8080/eden.oa/form/fceform/common/djframe.htm?djsn=wd_dj_show_set&djtype=WF_DSN
//传阅时查看的页面路径
//var passSendUrl="/form/fceform/common/run.html?djsn=oa_incoming_message&djtype=eden&actionId=show";



//对办理单的阅者签字赋值，个人函数
function setSignValue(result)
{
	
	//已阅列表
	 var hasReaderList="";
	 var str="";
	 if(result)
	{
			
		 hasReaderList=result.hasReaderList;
		 for(var i=0;i<hasReaderList.length;i++)
		{
				
			 str+=hasReaderList[i].username+" ";
				 
		} 
		 $('#text46').val(str);
	}
	
}

function loadInAdvice()
{
	  var data=window.data_datasetGridAdvice;
	  var length=data.dataCount();
	  for(var i=0;i<length;i++){
	      
	     var val=data.item(data.idByIndex(i));
		var html=parseOpinion(val.ADVICE_CONTENT,val.CREATE_BY,val.CREATE_DTTM);
	     if(val.ADVICE_TYPE=='拟办'){
	            $('#draftSugId').append(html);
	    }else if(val.ADVICE_TYPE=='领导'){
	             $('#leadSugId').append(html);
	    }
	    
	  }

}


function parseOpinion (word,name,time){
    time=time.substr(0,4)+'年'+time.substr(5,2)+'月'+time.substr(8,2)+'日';
	var html='<li><div class="opinion_word">'+word+'</div><div class="opinion_time">'+time+'</div><div class="opinion_man">'+name+'</div></li>';
	return html;
}




/**
 * 添加阅者签字
 */
function addSign(v)
{
	
	
	var name=$('#text53').val();
	var returnSign="";
	

		 var signs=$('#text46').val();
		 if(signs)
	     {
			 var hasName=0;  //是否已经包含了
			 var valspl=signs.split(",");  //排重
			 for(var i=0;i<valspl.length;i++)
			{
				
				 if(name==valspl[i])
			     {
					 hasName=1; //有了该阅者 
					 
			     }
				 
			}
			 if(hasName==0) //加入阅者
		     {
				 signs+=","+name;
		     }
			 returnSign=signs;
			 
	     }else{  //前面没有阅者
	    	 
	    	 
	    	 returnSign=name;
	     }
	
	return returnSign;
}


// oa_incoming_message2  oa_incoming_message4
function choiceUsers(){
	
	var dsIndex=mainDataset.idByIndex(0);
	if(!dsIndex)
	{
		alert("请先保存！");
		return;
		
	}
	
	openNextSendPageByPre("choiceUsersCallBack(val, text)");
/*	createWindow({
		text    :'选择下一步执行人',
		url     :project + '/form/fceform/common/run.html?djsn=selUser&djtype=eden_form',
		id      :'commonSelUser',
		width   :'670',
		height  :'400',
		//parent_window:window,
		callBack:function (val, text) {

			
		}
	})
	*/
	
}

function choiceNoUser(){
	//索引
    indexIncomingDoc();
	//保存公文文件版本
    saveDocumentVersionFile();
    //保存批注
    saveSignInfo();
	$eform('提交业务和流程后关闭窗口');
	
}

function choiceUsersCallBack(val, text){
	var nText = text.toString();
	var nValue = val.toString();
	
	if(!nValue)
	{
		$.dialog.tips("未选择下一执行人！");
		return;
	}
	
	$('#executor').val(nValue);
	
	var dataItem=mainDataset.item(mainDataset.idByIndex(0)); 
    dataItem['is_sendout']=1;  //设定已发出去，不是草稿了

    choiceNoUser();
}


function setNull(){
	return '';
}


function oa_tempSave(){
	//$eform('只保存业务数据')
	oa_wf_tempSave("dataset2");
	
}




	/**
	 * 工作流暂存
	 */
/*	function oa_wf_tempSave(datasetName) {
		var wfId = QueryURL.GetValue('wfId');
		if (undToSp(wfId) == '') {
			alert("流程实例还未启动，不能做业务数据的暂存！");
			return;
		}
		var wfName = QueryURL.GetValue('wfName');
		var wfDesc = unescape(QueryURL.GetValue('wfDesc'));
		var wfVersion = QueryURL.GetValue('wfVersion');
		var actionId = QueryURL.GetValue('actionId');
		var dynamicInstanceId = QueryURL.GetValue('dynamicInstanceId');

		if (QueryURL.GetValue('show') == "true") {
			alert("执行过的动作，不能做暂存操作！");
			return;
		}
		if (QueryURL.GetValue('show') == "copy") {
			alert("抄送的任务信息，不能做暂存操作！");
			return;
		}
		isWorkflow = true;
		wfUserType = 'before_temp_check';
		var sKey = "wf_id=" + wfId + ";action_id=" + actionId;
		if (typeof(dynamicInstanceId) != "undefined" && dynamicInstanceId != null && dynamicInstanceId != "undefined" && dynamicInstanceId != "null")
			sKey += ";dynamic_instance_id=" + dynamicInstanceId;
		wfPubParam = sKey;
		doSubmitData(function () {
			
		
			refreshDsById(datasetName); //刷新dataset
		});
	}
	*/
	
	//当点grid某一行时，修改意见
	function changeAdvice()
	{
		
		//var gridOb =getGrid('grid1');
		
	   var gridId="grid1";
		changeOaAdvice(gridId);


	}

	function addAdvice()
	{
		// $("#grid_grid4");
		var gridOb =getGrid('grid1');
		
		var type=localAdviceType;
		addOaDocumentAdvice(gridOb, wfId,type,"datasetGridAdvice");


	}
	
	
	/**
	 * 传阅按钮
	 */
	function insideSendClick()
	{
		var dtype="outin";
		insideSend('readpassDiv','text17',dtype)
		
	}
	
	//提取流程号
	 function putDocumentNo(input)
	 {
		var groupId="oa_document_no_auto";
		var dash="incoming";
		var year=new Date().getFullYear();
		 autoDocumentNo(input,groupId,dash,year);
	 		
	 }
	 
	//提取收文编号
	 function putDocumentIncomingCode(input)
	 {
		var groupId="oa_document_no_auto";
		var dash="incoming_code";
		var year=1;
		 autoDocumentNo(input,groupId,dash,year);
	 		
	 }
	
	/**
	 * 收文转发文
	 * @param id
	 */
	function initToSendDocument()
    {
	
		$.getScript(project + '/oa/resource/js/task.js',function(){
			    iniExchangeType=1;
				var add="&businessId="+wfId;
		    	var wfName="formal";
		    	var win = {text:"选择流程双击启动", url:project +"/admin/documentwf/selectWf.action?key="+wfName+add,width:'270',height:'400', id:"selectWf",'parent_ifr':window}
		        window.top.createWindow(win);
		    	
	    });

    }
	
	/**
	 * 收文转督查
	 * @param id
	 */
	function initToSupervise()
    {
	
		$.getScript(project + '/oa/resource/js/task.js',function(){
			 	iniExchangeType=2;
				var add="&businessId="+wfId;
		    	var wfName="oa_doc_supervise_wf";
		    	var win = {text:"选择流程双击启动", url:project +"/admin/documentwf/selectWf.action?key="+wfName+add,width:'270',height:'400', id:"selectWf",'parent_ifr':window}
		        window.top.createWindow(win);
		    	
	    });

    }
	
	
	/**
	 * 启动流程
	 * @param wfName
	 * @param addPram
	 */
	 function initOaWf(wfName,addPram)
	 {
		 if(iniExchangeType==1) //转发文
		 {
			 var interceptCallback="senddocumentBindWf(surl,1)"; //拦截方法名
			    oaInitWorkflowInterceptCallback(wfName,"登记",1,addPram, interceptCallback);
		 }else if(iniExchangeType==2) //转督查
		 {
			 var interceptCallback="senddocumentBindWf(surl,2)"; //拦截方法名
			    oaInitWorkflowInterceptCallback(wfName,"督查登记",1,addPram, interceptCallback);
			 
		 }
		 
	 }
	 
	 /**
	  * 新页面里执行，收文转发文绑定
	  * @param surl
	  */
	 function senddocumentBindWf(surl,flag)
	 {
		 
		 var wfId = parser_request(surl, "wfId");
			var dtype = parser_request(surl, "dtype");
			var businessId = parser_request(surl, "businessId");
			var project = window.top.base;
			
			var  url=project +"/admin/documentExchanging/inComingToSendDocumentBind.action";
			 var wfDesc="登记";
			if(flag==2) //转督查督办
			{
				url=project +"/admin/documentExchanging/inComingToSuperviseBind.action";
				wfDesc="督查登记";
			}
			
			var data="newWfId="+wfId+"&dtype="+dtype+"&inComingWfId="+businessId;
			$.post(url,data,function(result){
				
				 if(result.msg=="success")
				 {
					
					var height = $(window.top).height();
					 
					 var height = $(window.top).height();
						window.top.createWindow({   id:'workFlow1',
							text                  :wfDesc,
							setModal              :true,
							url                   :surl,
							width                 :'800',
							height                :height-30,
							parent_ifr            :window,
							afterClose            :function () {
								if(window.top.getModuleFrame('start'))
									window.top.getModuleFrame('start').taskReload('flow_task');
							}
							}

						);	
						 window.top.closeWin("workFlow");
					 
				 }
				 
			});

	 }

	

	 /**
	  * 索引
	  */
	 function indexIncomingDoc()
	 {
	     var id=getMainDsId();
	 	
	 	var url=project+"/admin/incoming/indexDoc.action";

	 	  $.post(url, {"id":id},function(result){
	 	     	//alert(result)	  
	 	   });
	 		  


	 }
	 
	 
	//分发存档

	 function send(){
	 	createWindow({
	 		text    :'选择组织',
	 		url     :project + '/form/fceform/common/run.html?djsn=selOrg&djtype=eden_form',
	 		id      :'commonSelOrg',
	 		width   :'330',
	 		height  :'400',
	 		//parent_window:window,
	 		callBack:function (orgId,orgName) {

	 			if(!orgId)
	 			{
	 				$.dialog.tips("未选择组织！");
	 				return;
	 			}
	 			 
	 			outside(orgId);
	 			
	 			window.closeWin('commonSelOrg');  
	 			 
	 	     }
	 	});
	 	
	 }

	 function outside(orgId)
	 {
	 	var id=getMainDsId();
	 	var url=project+"/admin/incoming/outsideSend.action";
	     $.ajax({
	 		type       :"POST",
	 		url        :url,
	 		data       :"id="+ id+"&orgId="+orgId,
	 		success    :function (msg) {	
	 		
	 			$.dialog.tips(msg.message);
	 		},
	 		error      :function (msg) {
	 			$.dialog.tips('访问后台失败！')
	 		}
	     });	


	 }
