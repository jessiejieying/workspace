
//var table_name='oa_send_document';
//var wfId=$urlParam('wfId');
var subtype=$urlParam('subtype');
var nodeName=$urlParam('nodeName');  //节点名称
var localUserId;   //当前用户id
var billName="sendbill"; //办理单页面名
var mainDataset;  //主数据集
//var localAdviceType="";  //当前意见类型
//元素设置页面  http://localhost:8080/eden.oa/form/fceform/common/djframe.htm?djsn=wd_dj_show_set&djtype=WF_DSN
//传阅时查看的页面路径
//var passSendUrl="/form/fceform/common/run.html?djsn=oa_send_document&djtype=eden_wf&actionId=show";



/*
//对Dataset3 转换设定状态
function subTransStatus(val)
{
	var status=val;
	switch (nodeName) {
	
		case 'draft':   //拟稿
		{		
			status=0;
		   break;
		}
		case 'syty':   //核稿
		{	
			//var status=$('#'+statusDataset3Id).val();
			status=statusTrans(status)
			
		   break;
		}
		case 'legal':   //法制办办理
		{		
			status=3;
		   break;
		}
		case 'secretariat_deal':   //秘书科办理
		{		
			status=4;
		   break;
		}
		case 'audit':   //审核
		{		
			status=5;
		   break;
		}
		case 'secretariat_send':   //秘书科送文
		{		
			status=6;
		   break;
		}
		case 'sign':   //签发
		{		
			status=7;
		   break;
		}
		case 'document_no':   //编号
		{		
			status=8;
		   break;
		}
		case 'check':   //校对
		{		
			status=9;
		   break;
		}
		case 'seal':   //盖章
		{		
			status=10;
		   break;
		}
		case 'send':   //分发存档
		{		
			status=11;
		   break;
		}
		default :
		{
			//alert("nodeName参数不正确");
		}

	}
	
   return status;
}
*/

//设定哪些字段的值要提交
function subDataset(datasetName)
{
	
	 var dataset=getDs(datasetName);;
	  var dataItem=dataset.item(dataset.idByIndex(0));

    switch (nodeName) {
    	
		
		case 'syty':   //核稿
		{	
			/*dataItem['SYTY_DATE']=GetTime() 
			dataItem['DEPT_SYTY_MAN']=getLocalUserId();*/
			$('#label25').text( getLocalUserName());
			$('#label26').text(GetTime())
		   break;
		}
		case 'legal':   //法制办办理
		{		
		   
		   break;
		}
		
		case 'audit':   //审核
		{		
			/*dataItem['AUDIT_MAN']=checkAndAddMan(dataItem['AUDIT_MAN'],getLocalUserId())
			dataItem['AUDIT_DATE']=GetTime()*/
			var users=checkAndAddMan(dataItem['AUDIT_MAN'],getLocalUserName());
			$('#label30').text(users);
			$('#label31').text(GetTime())
		   break;
		}
		
		case 'sign':   //签发
		{		
			/*dataItem['SIGN_MAN']=getLocalUserId();
			dataItem['SIGN_DATE']=GetTime()*/
			$('#label33').text(getLocalUserName());
			$('#label34').text(GetTime())
		   break;
		}
		case 'document_no':   //编号
		{		
		
		   break;
		}
		case 'check':   //校对
		{		
			/*dataItem['CHECK_MAN']=getLocalUserId();
			dataItem['CHECK_DATE']=GetTime()*/
			$('#label38').text(getLocalUserName());
			$('#label39').text(GetTime())
		   break;
		}
		
		case 'send':   //分发存档
		{		
		
		   break;
		}
		default :
		{
			//alert("nodeName参数不正确");
		}

	}	
     	
}


/**
 * 获得当前用户名
 */
function getLocalUserId()
{
  	if(localUserId)
  	{
  		localUserId=GetSessionOne('userid')
  		
  	}
  	
  	return localUserId;
}



//起草文档

function addDocument(){
	
	var swungdash=$('#sel_dropdownlist18').find("option:selected").text();;
	//swungdash=encodeURI(encodeURI(swungdash));
	operateDocByDatasetName("dataset1",1,swungdash)
}


//查看文档
function viewDocument(){
	
	  operateDocByDatasetName("dataset1",2)
	
}

//修改文档
function updateDocument(){

	operateDocByDatasetName("dataset1",3)
}

//盖章
function sealDocument(){

	operateDocByDatasetName("dataset1",4)
}


/**
 * 显示附件
 */
function showAttach(){
    //$('#attachArea').slideDown();
	openAttachment()
}
/**
 * 附件关闭
 *  已失效
 *//*
function hideAttach(){
    $('#attachArea').slideUp();
}
*/
function finishFormDefault(){
   

  
}



//作废
function cancel(){
//$('#text31').val('0');
	$('#dataValidId').val('0');

	$eform('提交业务和流程后关闭窗口');
}
//保存
function save(){
//$eform('只保存业务数据');

	oa_wf_tempSave("dataset1");
}


/**
 * 直接提交
 */
function submitNoChoiceUser()
{
	//索引
	indexSendDoc();
	  //保存公文文件版本
    saveDocumentVersionFile();
	  //保存签批信息
	saveSignInfo()
	
	$eform('提交业务和流程后关闭窗口');
}


//拟稿提交
function submitDraft(){
	
	var dsIndex=mainDataset.idByIndex(0);
	if(!dsIndex)
	{
		alert("请先保存！");
		return;
		
	}
    $('#dataValidId').val('1');
    $('#statusId').val('1');    
    var dataItem=mainDataset.item(mainDataset.idByIndex(0)); 
    dataItem['is_sendout']=1;  //设定已发出去，不是草稿了
	
	openNextSendPageByPre("submitDraftCallback(val, text)");

}

/**
 * 拟稿回调
 * @param val
 * @param text
 */
function submitDraftCallback(val, text)
{
	nText = text.toString();
	nValue = val.toString();
	
	if(!nValue)
	{
		$.dialog.tips("未选择下一执行人！");
		return;
	}
	
    //$('#text34').val(nValue);
    $('#nextPersonId').val(nValue);
  
  //索引
	indexSendDoc();
  //保存公文文件版本
    saveDocumentVersionFile();
    
    $eform('提交业务和流程后关闭窗口');
}




function parseOpinion (word,name,time){
    time=time.substr(0,4)+'年'+time.substr(5,2)+'月'+time.substr(8,2)+'日';
	var html='<li><div class="opinion_word">'+word+'</div><div class="opinion_time">'+time+'</div><div class="opinion_man">'+name+'</div></li>';
	return html;
}


//秘书科办理的完成
function finishFormDeal(){

  finishFormDefault();
 
  afterLoadDeal();
}


function afterLoadDeal() {
	var DS2=getDs('DsMain');
	var Ds2ItemCount=DS2.dataCount();
	splitCount=Ds2ItemCount;
	//$('#txtCount').val(splitCount);
	//查找 动态分支节点中定义的 参数信息

	var sKey = "?operate=get_dynamic_node_param&wf_name=" + wfName + "&wf_version=" + wfVersion;
	sKey += "&dynamic_node_id=" + dynamicNodeId;
	sKey += "&dynamic_node_type=" + dynamicNodeType;
	$.ajax({
		type       :"POST",
		url        :project+"/servlet/WorkflowPortal"+sKey,
		processData:false,
		data       :'<root></root>',
		contentType:'utf-8',
		success    :function (msg) {
			var oDom=newXml(msg);
			var bResult = $(oDom).find('n').text();
			if (bResult == "false") {
				$.dialog.alert("获取动态节点参数列表发生错误：" + $(oDom).find('message').text(),5);
				return;
			}else{
				$(oDom).find('record').each(function(){
					oParam.push([$(this).find('td:eq(0)').text(),$(this).find('td:eq(1)').text()]);
				});
			}

		},
		error      :function (msg) {
			$.dialog.tips('访问后台失败！')
		}
	});
	var grid=getGrid('dssubGrid');
	var DS=getDs('dssub');
	var nValue='';
	var nText='';
	
	
}



function addAuMans(){
	
	openNextSendPageByPre("addAuMansCallBack(val, text)");

}


function addAuMansCallBack(val, text){
	
	nText = text.toString();
	nValue = val.toString();
	
	
	if(nValue!="")
	{
		
		uf_delete_row();
		var manArr=nValue.split(",");
		if(manArr.length>1) //多个人
		{
			var cnSpi=nText.split(",");
			for(var i=0;i<manArr.length;i++)
			{
				uf_add_row(cnSpi[i],manArr[i]);
			}
			
		}else{ //一个人
			
			uf_add_row(nText,nValue);
		}
		// window.closeWin('commonSelUser'); 
		//索引
		indexSendDoc();
		//保存公文文件版本
	    saveDocumentVersionFile();
	    
		$eform('提交业务和流程后关闭窗口');
	}else{
		
		alert("未选择人");
	}
	  
	
}


function uf_add_row(cnHanderMan,enHanderMan) {
	var DS=getDs('dssub');
	var dynamicId = getMaxIntNo('BBB');
	for (var i = 0; i < oParam.length; i++) {
		var param = oParam[i];       // [参数名,描述]
		var item={
			dynamic_instance_id:dynamicId,
			param_desc:param[1],
			param_name:param[0],
			param_show_user:cnHanderMan,
			param_value:enHanderMan
			
		};
		gridAddRow('dssubGrid',item);

	}
	var DS2=getDs('DsMain');
	var parent_id='';
	if (parentId!='') {
		parent_id = parentId;
	}else{
		parent_id='-1';
	}
	var item2={
		dynamic_instance_id:dynamicId,
		wf_name:wfName,
		wf_version:wfVersion,
		wf_id:wfId,
		dynamic_node_id:dynamicNodeId,
		dynamic_node_type:dynamicNodeType,
		create_user_id:GetSessionOne('userid'),
		create_date:GetDate(),
		parent_id:parent_id
	}
	gridAddRow('DsMainGrid',item2);
	splitCount++;
	//$('#txtCount').val(splitCount);
}


function uf_delete_row_ini(id) {
	
	

	var DS=getDs('dssub');
	var DS2=getDs('DsMain');
	var grid=getGrid('dssubGrid');
	//var nowId=grid.getSelectedRowId();
	var nowId=id;
	if(!nowId){
		return;
	}


	var nowItem=DS.item(nowId);
	var dynamicId=nowItem.dynamic_instance_id;
	var DsItemCount=DS.dataCount();
	var deleteIds=[];
	for (var i = 0; i < DsItemCount; i++) {
		var nowId=DS.idByIndex (i);
		var nowItem=DS.item(nowId);
		if(nowItem.dynamic_instance_id==dynamicId){
			deleteIds.push(nowId);
		}

	}
	for (var i = 0; i < deleteIds.length; i++) {
		var thisId = deleteIds[i];
		var delItem=DS.item(thisId);
		_gridDelId.push(['dssub',thisId,delItem]);
		DS.remove(thisId);
	}
	var Ds2ItemCount=DS2.dataCount();
	var deleteIds2=[];
	for (var i = 0; i < Ds2ItemCount; i++) {
		var nowId=DS2.idByIndex (i);
		var nowItem=DS2.item(nowId);
		if(nowItem.dynamic_instance_id==dynamicId){
			deleteIds2.push(nowId);
		}

	}
	for (var i = 0; i < deleteIds2.length; i++) {
		var thisId = deleteIds2[i];
		var delItem=DS2.item(thisId);
		_gridDelId.push(['DsMain',thisId,delItem]);
		DS2.remove(thisId);

	}


	splitCount-=1;
	//$('#txtCount').val(splitCount);
	
}

function uf_delete_row() {
	var grid=getGrid('dssubGrid');
	
	 var pRowId = grid.getAllRowIds(',').split(',');
	
	 if(pRowId)
	 {
		  for(i=0;i<pRowId.length;i++){ 
		    	 uf_delete_row_ini(pRowId[i])
		    }
		 
	 }

  
}



//提交
function submitDeal(){
	
	 addAuMans()
/*if($('#txtCount').val()==0){
   $.dialog.alert('至少选择增加一位审核人分支');
}else{
$eform('提交业务和流程后关闭窗口');
}*/


}



function statusTrans(orval){
	  //var data=window.data_dataset3.item(  window.data_dataset3.first() );
	var val=$('#sel_dropdownlist16').val();
	
	if(val==1){
	    return 2;
	  }else if (val==2){
	    return 3;
	  }
	
	return 3;
	
}




/*
//提交选择处理人后执行流程
function submitSelect(){
	
	
	var url=getSelUserUrl();
	
	createWindow({
					text    :'选择用户',
					url     :url,
					id      :'commonSelUser',
					width   :'670',
					height  :'400',
					//parent_window:window,
					callBack:function (val, text) {
							nText = text.toString();
							nValue = val.toString();
							if(!nValue)
							{
								$.dialog.tips("未选择下一执行人！");
								return;
							}
                            $('#nextPersonId').val(nValue);
                            
                            //保存签批信息
                    		saveSignInfo()
                            
                            $eform('提交业务和流程后关闭窗口');
	                                        
				        }
				});

}*/


//提交选择处理人后执行流程
function submitSelect(){
	
	
	openNextSendPageByPre("submitSelectCallBack(val, text)");

}

function submitSelectCallBack(val, text){
	
	nText = text.toString();
	nValue = val.toString();
	if(!nValue)
	{
		$.dialog.tips("未选择下一执行人！");
		return;
	}
    $('#nextPersonId').val(nValue);
    
    //索引
	indexSendDoc();
    //保存公文文件版本
    saveDocumentVersionFile();
    //保存签批信息
	saveSignInfo()
    $eform('提交业务和流程后关闭窗口');
                    
}
	



//审核 时  

function getAuditMan(){
	   var data=window.data_dataset1;
	   var val=data.item(data.idByIndex(0));
	   if(val.AUDIT_MAN!=null&&val.AUDIT_MAN!=''){
	       return val.AUDIT_MAN+','+getLocalUserId();
	   }
	   return getLocalUserId();
}




////秘书科送文：


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
	

	
	//$.dialog.tips("对不起，暂未进行对接！");
}

function outside(orgId)
{
	var id=getMainDsId();
	var url=project+"/admin/sendDocument/sendDocumentAction!outsideSend.action";
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


//选择发送的人
function selectSend(btn){
	createWindow({
					text    :'选择用户',
					url     :project + '/form/fceform/common/run.html?djsn=selUser&djtype=eden_form',
					id      :'commonSelUser',
					width   :'670',
					height  :'400',
					//parent_window:window,
					callBack:function (val, text) {
						nText = text.toString();
						nValue = val.toString();
						if(!nValue)
						{
							$.dialog.tips("未选择下一执行人！");
							return;
						}
						  $(btn).val(nText);
						   window.closeWin('commonSelUser');      
					
				        }
				});

}





//添加名称，如果存在了不添加，以逗号分隔
function checkAndAddMan(orgNames,addname)
{
	
	
	var name=addname;
	var returnName="";
	

		 var signs=orgNames;
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
			 returnName=signs;
			 
	     }else{  //前面没有阅者
	    	 
	    	 
	    	 returnName=name;
	     }
	
	return returnName;
}


//提交时设置是否提交意见
function setNotAddAdvice()
{
	
	
	var ids=$('#dataset4');
	ids.attr('submittype',4);
		

}


//当点grid某一行时，修改意见
function changeAdvice()
{
	// $("#grid_grid4");
	//var grid4 =getGrid('grid4');
	
	var gridId="grid4";
	changeOaAdvice(gridId);


}

function addAdvice()
{
	// $("#grid_grid4");
	var grid4 =getGrid('grid4');
	
	//var type=localAdviceType;
	addOaDocumentAdvice(grid4, wfId,"","dataset2");


}





//填充部门和电话
function fillUserInfo(userOb,depOb,phoneOb)
{
	
	//var user=userOb.text();
	var user=getLocalUserId();
	var data="criteriaAccountName="+window.encodeURI(user);

	var url = project+"/admin/user/queryUserInfo.action";
	$.post(url,data,function(result){
		//console.log(result);
		for(var i in result.data){
			//console.log(i);
			//console.log(result.data[i].depName);
			depOb.val(result.data[i].depName);
			phoneOb.val(result.data[i].cellphoneNumber);
		}
	});

}


//自动编号
function autoDocumentNoButton(inputId,groupId)
{
	
	//var reg="[文件字]〔[年度]〕[序号]号";
	var dash=$('#sel_dropdownlist18').find("option:selected").val();
	var year=new Date().getFullYear();

	
	var url = project+"/admin/documentConfig/getDocAutoNo.action";
	var data="groupId="+groupId+"&wfId="+wfId+"&dashValue="+dash+"&year="+year;
	$.post(url,data,function(result){

		$(inputId).val(result);
	});
		
	
}


//自动编号
function autoDocumentNo(input)
{
	if(!wfId)
	{
		alert("启动流程后才能编号");
	}
	//var reg="[文件字]〔[年度]〕[序号]号";
	var dash=$('#sel_dropdownlist18').find("option:selected").val();
	var noString=$(input).val();
/*	var year=new Date().getFullYear();
	var url = project+"/admin/documentConfig/getDocAutoNo.action";
	var data="groupId=oa_send_document_swung_dash&wfId="+wfId+"&dashValue="+dash+"&year="+year;
	$.post(url,data,function(result){

		$(input).val(result);
		
	});*/
	var url=project + '/form/fceform/common/run.html?djsn=oa_edit_document_no&djtype=eden_wf';
	url+="&wfId="+wfId+"&dash="+dash+"&groupId=oa_send_document_swung_dash"+"&noString="+ encodeURI(noString);
	createWindow({
		text    :'编号',
		url     :url,
		id      :'documentNo',
		width   :'445',
		height  :'300',
		//parent_window:window,
		callBack:function () {
		/*	nText = text.toString();
			nValue = val.toString();
			if(!nValue)
			{
				$.dialog.tips("未选择下一执行人！");
				return;
			}
			  $(btn).val(nText);
			   window.closeWin('commonSelUser');    */  
			 window.closeWin('documentNo');
				location.reload();
	      
			
			
	     }
	});
	
	
	
}

/**
 * 获取断号
 */
function putCutNo()
{
	var dash=$('#sel_dropdownlist18').find("option:selected").val();
	var year=new Date().getFullYear();
	
	var url = project+"/admin/documentConfig/getDocCutNo.action";
	var data="groupId=oa_send_document_swung_dash&wfId="+wfId+"&dashValue="+dash+"&year="+year;
	$.post(url,data,function(result){

		if(result.data)
		{
			var list=result.data;
			var html="<select>";
			for(var i=0;i<list.length;i++)
			{
				 html+="<option value='"+list.id+"'>"+list.recnum+"</option>";
			}
			
			
			html+="</select>";
			$('#div11').val(html);
		}
		
	});
	
	
}

/**
 * 传阅按钮
 */
function insideSendClick()
{
	var dataItem=mainDataset.item(mainDataset.idByIndex(0));
	var dtype=dataItem.dtype;
	if(!dtype)
	{
		alert("传阅时要有文件类型");
	}
	insideSend('readpassDiv','text9',dtype);
	
}

/**
 * 转收文 这个是去掉隐藏的
 */
function sendToIncoming()
{
	createWindow({
		text    :'选择组织',
		url     :project + '/form/fceform/common/run.html?djsn=selOrg&djtype=eden_form',
		id      :'commonSelOrg',
		width   :'330',
		height  :'400',
		//parent_window:window,
		callBack:function (orgId,orgName) {

			var url = project+"/admin/documentExchanging/sendDocumentToInComing.action";
			var data="wfId="+wfId+"&sendRand="+orgName+"&sendRandCode="+orgId;
			$.post(url,data,function(result){
				
				if(result.msg=="success")
				{
					$.dialog.alert("操作成功！",5);
				   window.closeWin('commonSelOrg');      
					
				}else{
					$.dialog.alert("操作失败！",5);
				}
				
			});  
		
	     }
	});

}


function checkDtypeNull(val)
{

	if(val==-1)
	{
		alert("请选择发文类型！")
		return false; 
	}
    return true;
}


/**
 * 索引
 */
function indexSendDoc()
{
    var id=getMainDsId();
	
	var url=project+"/admin/sendDocument/sendDocumentAction!indexDoc.action";

	  $.post(url, {"id":id},function(result){
	     	//alert(result)	  
	   });
		  


}
