/**    督办 js   */
var nodeName=$urlParam('nodeName');  //节点名称
var wfId = QueryURL.GetValue('wfId');
var mainDataset=window.data_dataset2;  //主数据集
var localAdviceType="";  //当前意见类型
/**
 * 
 *    节点有  
 *    督查登记 reg 
 	 办公室批办 office_approve
 	 承办部门办理   undertake
 	 返回办公室  return_office
    领导点评   comment
    归档   send
 * 
 */



/**
 * 直接提交
 */
function submitNoChoiceUser()
{
   	
	$eform('提交业务和流程后关闭窗口');
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
	$eform('提交业务和流程后关闭窗口');
	
}


function setNull(){
	return '';
}


function oa_tempSave(){

	//$eform('只保存业务数据')
	oa_wf_tempSave("dataset2");
	
}


	
	//当点grid某一行时，修改意见
	function changeAdvice()
	{
		
		//var gridOb =getGrid('grid1');
		
	   
		changeOaAdvice('grid1');


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
	
	/**
	 * 收文转发文
	 * @param id
	 */
	function initToSendDocument()
    {
	
		$.getScript(project + '/oa/resource/js/task.js',function(){
		
				var add="&businessId="+wfId;
		    	var wfName="oa_senddocument_wf";
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
		 var interceptCallback="senddocumentBindWf(surl)"; //拦截方法名
	    oaInitWorkflowInterceptCallback(wfName,"登记",1,addPram, interceptCallback);
	 }
	 
	 /**
	  * 新页面里执行，收文转发文绑定
	  * @param surl
	  */
	 function senddocumentBindWf(surl)
	 {
		 
		 var wfId = parser_request(surl, "wfId");
			var dtype = parser_request(surl, "dtype");
			var businessId = parser_request(surl, "businessId");
			var project = window.top.base;
			var  url=project +"/admin/documentExchanging/inComingToSendDocumentBind.action";
			var data="newWfId="+wfId+"&dtype="+dtype+"&inComingWfId="+businessId;
			$.post(url,data,function(result){
				
				 if(result.msg=="success")
				 {
					
					var height = $(window.top).height();
					 var wfDesc="登记";
					 var height = $(window.top).height();
						window.top.createWindow({   id:'workFlow1',
							text                  :wfDesc,
							setModal              :true,
							url                   :surl,
							width                 :'800',
							height                :height-30,
							parent_ifr            :window,
							afterClose            :function () {
								window.top.getModuleFrame('start').taskReload('flow_task');
							}
							}

						);	
						 window.top.closeWin("workFlow");
					 
				 }
				 
			});

	 }
	 
	 
	//提取编号
	 function putDocumentNo(input)
	 {
		var groupId="oa_document_no_auto";
		var dash="supervise";
		var year=new Date().getFullYear();
		 autoDocumentNo(input,groupId,dash,year);
	 		
	 }

function sendOut()
{
	
 alert("未与外部系统做对接！");
}
