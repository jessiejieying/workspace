<%@ page contentType="text/html; charset=utf-8" %>
<%@ page import="java.io.*,java.text.*,java.util.*,java.sql.*,javax.servlet.*,javax.servlet.http.*,DBstep.iDBManager2000.*" %>
<%
  ResultSet result=null;

  String mDescript="";
  String mFileName="";

  String mHttpUrlName=request.getRequestURI();
  String mScriptName=request.getServletPath();
  String mServerName="OfficeServer.jsp";

  String mServerUrl="http://"+request.getServerName()+":"+request.getServerPort()+mHttpUrlName.substring(0,mHttpUrlName.lastIndexOf(mScriptName))+"/"+mServerName;

  String mRecordID=request.getParameter("RecordID");
  String mFileType=request.getParameter("FileType");
  String parentId=request.getParameter("parentId");
  String treeId=request.getParameter("treeId");
  String businessId=request.getParameter("businessId");
  String mEditType="1,1";
  String mUserName="Administrator";


  //取得模式
  if (mEditType==null)
  {
    mEditType="2,1";		//2 起草
  }
  //取得类型
  if ( mFileType==null)
  {
    mFileType=".doc";	// 默认为.doc文档
  }
  //取得用户名
  if (mUserName==null)
  {
    mUserName="金格科技";
  }

  //取得模板
  if ( mRecordID==null)
  {
    mRecordID="";	// 默认没有模板
  }

  //打开数据库
  DBstep.iDBManager2000 DbaObj=new DBstep.iDBManager2000();
  if (DbaObj.OpenConnection())
  {
    String mSql="Select * From Template_File Where RecordID='"+ mRecordID + "'";
    try
    {
      result=DbaObj.ExecuteQuery(mSql);
      if (result.next())
      {
        mRecordID=result.getString("RecordID");
        mFileName=result.getString("FileName");
        mFileType=result.getString("FileType");
        mDescript=result.getString("Descript");
      }
      else
      {
	//取得唯一值(mRecordID)
        java.util.Date dt=new java.util.Date();
        long lg=dt.getTime();
        Long ld=new Long(lg);
	//初始化值
        mRecordID=ld.toString();
        mFileName="公文模版";
        mFileType=mFileType;
        mDescript="";
      }
      result.close();
    }
    catch(Exception e)
    {
      System.out.println(e.toString());
    }
    DbaObj.CloseConnection() ;
  }

%>

<html>
<head>
<title>模板管理</title>
<link rel='stylesheet' type='text/css' href='../test.css'>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<script src = "../aufw/resources/common/js/jquery.js"></script>
<script language="javascript" for=WebOffice event="OnMenuClick(vIndex,vCaption)">


   if (vIndex == 1) {
		  WebOpenBookMarks();
	}
	   if (vIndex == 2) {
		   mySubmit();
	   }
	   if (vIndex==4){  //打开本地文件
	      WebOpenLocal();
	   }
	   if (vIndex==5){  
		  WebSaveLocal();     //保存本地文件
	   }
	   if (vIndex==6){  
		  WebOpenPrint();     //打印文档
	   }
	   
   
   
</script>

<script language=javascript>

//作用：显示操作状态
function StatusMsg(mString){
  StatusBar.innerText=mString;
}

//作用：载入iWebOffice
function Load(){
  try{

  //以下属性必须设置，实始化iWebOffice
  webform.WebOffice.WebUrl="<%=mServerUrl%>";	//WebUrl:系统服务器路径，与服务器文件交互操作，如保存、打开文档，重要文件
  webform.WebOffice.RecordID="<%=mRecordID%>";	//RecordID:本文档记录编号
  webform.WebOffice.Template="<%=mRecordID%>";	//Template:模板编号
  webform.WebOffice.FileName="<%=mFileName%>";	//FileName:文档名称
  webform.WebOffice.FileType="<%=mFileType%>";	//FileType:文档类型  .doc  .xls  .wps
  webform.WebOffice.EditType="<%=mEditType%>";	//EditType:编辑类型  方式一、方式二  <参考技术文档>
  webform.WebOffice.UserName="<%=mUserName%>";	//UserName:操作用户名

  //以下属性可以不要
  webform.WebOffice.ShowToolBar="1";		//ShowToolBar:是否显示工具栏:1显示,0不显示
  webform.WebOffice.ShowMenu="1";		//ShowMenu:1 显示菜单  0 隐藏菜单
  webform.WebOffice.AppendMenu("1","定义标签(&L)");
  webform.WebOffice.AppendMenu("2","保存模板(&S)");
  webform.WebOffice.AppendMenu("3","-");
  webform.WebOffice.AppendMenu("4","打开本地文件(&O)");
  webform.WebOffice.AppendMenu("5","另存为(&B)");
  webform.WebOffice.AppendMenu("6","打印(&P)");
  
  webform.WebOffice.VisibleTools("新建文件",false);
  webform.WebOffice.VisibleTools("打开文件",false);
  webform.WebOffice.VisibleTools("保存文件",false);
  webform.WebOffice.VisibleTools("文字批注",false);
  webform.WebOffice.VisibleTools("手写批注",false);
  webform.WebOffice.VisibleTools("文档清稿",false);
  webform.WebOffice.VisibleTools("重新批注",false);
  webform.WebOffice.VisibleTools("全屏",false);

  
  webform.WebOffice.DisableMenu("宏(&M);选项(&O)...");      //禁止菜单

  webform.WebOffice.WebOpen();			//打开该文档    交互OfficeServer的OPTION="LOADTEMPLATE"
  webform.WebOffice.ShowType=1;			//文档显示方式  1:表示文字批注  2:表示手写批注  0:表示文档核稿
  StatusMsg(webform.WebOffice.Status);
  }catch(e){}
}


//作用：退出iWebOffice
function UnLoad(){
  try{
  if (!webform.WebOffice.WebClose()){
     StatusMsg(webform.WebOffice.Status);
  }else{
     StatusMsg("关闭文档...");
  }
  }catch(e){}
}


//作用：打开文档
function LoadDocument(){
  StatusMsg("正在打开文档...");
  if (!webform.WebOffice.WebLoadTemplate()){  //交互OfficeServer的OPTION="LOADTEMPLATE"
     StatusMsg(webform.WebOffice.Status);
  }else{
     StatusMsg(webform.WebOffice.Status);
  }
}


//作用：刷新文档
function WebReFresh(){
  webform.WebOffice.WebReFresh();
  StatusMsg("文档已刷新...");
}


//作用：保存文档
function SaveDocument(){
  webform.WebOffice.WebClearMessage();            //清空iWebOffice变量
  webform.WebOffice.FileName=$('#FileName').val();	
  if ("<%=mFileType%>"==".doc"){
    if (!webform.WebOffice.WebSaveBookMarks()){    //交互OfficeServer的OPTION="SAVEBOOKMARKS"
      StatusMsg(webform.WebOffice.Status);
      return false;
    }
  }
  //webform.WebOffice.WebSetMsgByName("MyDefine1","自定义变量值1");  //设置变量MyDefine1="自定义变量值1"，变量可以设置多个  在WebSaveTemplate()时，一起提交到OfficeServer中
  if (!webform.WebOffice.WebSaveTemplate(true)){    //交互OfficeServer的OPTION="SAVETEMPLATE"，参数true表示保存OFFICE文档
	  alert(webform.WebOffice.Status);
	  StatusMsg(webform.WebOffice.Status);
     return false;
  }else{
	 alert(webform.WebOffice.Status);
     StatusMsg(webform.WebOffice.Status);
     return true;
  }
}

//作用：填充模板
function LoadBookmarks(){
  StatusMsg("正在填充模扳...");
  if (!webform.WebOffice.WebLoadBookmarks()){    //交互OfficeServer的OPTION="LOADBOOKMARKS"
     StatusMsg(webform.WebOffice.Status);
  }else{
     StatusMsg(webform.WebOffice.Status);
  }
}

//作用：设置书签值  vbmName:标签名称，vbmValue:标签值   标签名称注意大小写
function SetBookmarks(vbmName,vbmValue){
  if (!webform.WebOffice.WebSetBookmarks(vbmName,vbmValue)){
     StatusMsg(webform.WebOffice.Status);
  }else{
     StatusMsg(webform.WebOffice.Status);
  }
}

//作用：根据标签名称获取标签值  vbmName:标签名称
function GetBookmarks(vbmName){
  var vbmValue;
  vbmValue=webform.WebOffice.WebGetBookmarks(vbmName);
  return vbmValue;
}

//作用：打印文档
function WebOpenPrint(){
  try{
    webform.WebOffice.WebOpenPrint();
    StatusMsg(webform.WebOffice.Status);
  }catch(e){}
}

//作用：页面设置
function WebOpenPageSetup(){
   try{
	if (webform.WebOffice.FileType==".doc"){
	  webform.WebOffice.WebObject.Application.Dialogs(178).Show();
	}
	if(webform.WebOffice.FileType==".xls"){
	  webform.WebOffice.WebObject.Application.Dialogs(7).Show();
	}
   }catch(e){

   }
}

//作用：标签管理
function WebOpenBookMarks(){
  try{
    webform.WebOffice.WebOpenBookmarks();    //交互OfficeServer的OPTION="LISTBOOKMARKS"
    StatusMsg(webform.WebOffice.Status);
  }catch(e){}
}

//作用：存为本地文件
function WebSaveLocal(){
  try{
    webform.WebOffice.WebSaveLocal();
    StatusMsg(webform.WebOffice.Status);
  }catch(e){}
}

//作用：打开本地文件
function WebOpenLocal(){
  try{
    webform.WebOffice.WebOpenLocal();
    StatusMsg(webform.WebOffice.Status);
  }catch(e){}
}



function finishFile(){
	var sendUrl="../admin/template/fillData.action?etc="+new Date().getTime();
	var val={};
	val["treeId"]="<%=treeId%>";	
	val["id"]="<%=businessId%>";

	jQuery.post(sendUrl, val, function(data){
		downloadLocalFile(data.download);
		insertFile(data.content);	  	  	
	});  
}
//下载模版到本地
function downloadLocalFile(json){
	for(var key in json){
		webform.WebOffice.WebGetFile(json[key],key);
	}
}

//填充模版
function insertFile(json){
	setBookMarks(json.data,json.id);
	var child=json.child;
	if(child!=null){
		for(var i=0;i<child.length;i++){		
			var list=child[i].list;
			for(var j=0;j<list.length;j++){
				mergerFile(child[i].other);
				insertFile(list[j]);
			}
			clearRelationBookMark(child[i].clear);
			webform.WebOffice.WebObject.Application.Selection.Delete();
		}
	}
}
//填充数据
function fillData(json)
{
	for(var key in json){
		webform.WebOffice.WebObject.Application.Selection.GoTo(-1,0,0,key);
		webform.WebOffice.WebObject.Application.Selection.Range.Text= json[key];
	}
}

//清除关联标签
function clearRelationBookMark(json){
	for(var key in json){
		webform.WebOffice.WebObject.Application.Selection.GoTo(-1,0,0,key);
		webform.WebOffice.WebObject.Application.Selection.Range.Text= json[key];
	}
}
var originalData={};
var changeData={}
//填充书签值
function setBookMarks(json,id){
	for(var key in json){
		webform.WebOffice.WebObject.Application.Selection.GoTo(-1,0,0,key);
		webform.WebOffice.WebSetBookMarks(key,json[key]);
		webform.WebOffice.WebObject.Application.Selection.Bookmarks.item(key).Copy(key+"_"+id);
		webform.WebOffice.WebObject.Application.Selection.Bookmarks.item(key).Delete();
		originalData[key+"_"+id]=json[key];
	}
}
//作用： 合并文档
function mergerFile(json)
{
	webform.WebOffice.WebObject.Application.Selection.GoTo(-1,0,0,json.relation);
	webform.WebOffice.WebObject.Application.Selection.InsertFile(json.documentId);
	webform.WebOffice.WebObject.Application.Selection.Delete();
}
//提交
function mySubmit(){
	var sendUrl="";
	var parentId="<%=parentId%>";
	var treeId="<%=treeId%>";
 	var val={};
	val["commonTree.name"]=$('#FileName').val();
	val["commonTree.remark"]="";
	if(treeId !=null&&treeId!=""&&treeId!="null"){
		sendUrl = "../admin/commonTree/commonTreeAction!update.action?etc=" + new Date().getTime();
		val["commonTree.id"]=treeId;	
		val["commonTree.parentId"]=parentId;	
	}else{
		sendUrl = "../admin/commonTree/commonTreeAction!insert.action?etc=" + new Date().getTime();
		val["commonTree.parentId"]=parentId;	
		val["commonTree.id"]="<%=mRecordID%>";
	}
  
	jQuery.post(sendUrl, val, function(data){
        if(data["result"]=="success"){  
        	SaveDocument();     //保存正文到服务器上
            webform.submit();   //然后退出 
            alert("保存成功");
        }            		 	  	
	});  
}
//回写
function writeback(){
	for(var key in originalData){
		var changeValue = webform.WebOffice.WebGetBookMarks(key);
		if(changeValue != originalData[key]){
			changeData[key] = changeValue;
		}	
	}
	var sendUrl = "../admin/template/templateAction!writeback.action";
	jQuery.post(sendUrl, changeData, function(data){
		if(data.result == "success"){
			for(var key in changeValue){
				originalData[key]=changeData[key];
			}
		}
        alert(data.message);	 	  	
	});
}


//标签管理

function openBookMarksManager()
{
	var url="../BookMark/BookMarkList.jsp";
	window.open(url);
	
	}
	
function openSignatureManager()
{
	var url="../Signature/SignatureList.jsp";
	window.open(url);
	
	}


</script>
</head>
<body bgcolor="#ffffff" onload="Load()" onunload="UnLoad()"> <!--引导和退出iWebOffice-->

<form name="webform" method="post" action="TemplateSave.jsp" > <!--保存iWebOffice后提交表单信息-->
<input type="hidden" name="RecordID" value="<%=mRecordID%>">

<table border=0  cellspacing='0' cellpadding='0' width=100% height=100% align=center class=TBStyle>
<tr>
  <td align="right" class="TDTitleStyle" width=64>模版名</td>
  <td class="TDStyle"><input id="FileName" type="text" name="FileName" value="<%=mFileName%>" class="IptStyle" ></td>
</tr>

<tr>
  <td align=right class="TDTitleStyle" width=64>父模版关联标签</td>
  <td class="TDStyle">
  <!-- 
  <input id="Descript" type="text" name="Descript" value="<%=mDescript%>" class="IptStyle" >
   -->
   <select id="Descript" name="Descript" style="width:200px;" >
     <option value="" ></option>

   </select>
  </td>
</tr>

  <tr width="100" height="28">
        <td align="center" class="TDTitleMiddleStyle">
          <font color="#FF0000"><b>↓功能列表↓</b></font>
	    </td>
        <td height="100%" colspan="2" rowspan="12" align="right" valign="top" class="TDStyle" hegith="90%">
          <table border="0" cellspacing="0" cellpadding="0" width="100%" height="100%">
            <tr>
              <td bgcolor="menu" height="98%" valign="top">
              
                <!--调用iWebPicture，注意版本号，可用于升级-->
			    <!--  <script src="../iWebOffice2009.js"></script> -->
			<!--        <object id="WebOffice"  width="100%" height="100%" progid="iWebOffice2009.HandWriteCtrl" type="application/iwebplugin" Copyright="金格科技[演示专用];V4.46YeR5qC856eR5oqAW+a8lOekuuS4k+eUqF07MjAxNTs3Ozg7OTsxMDsxMTsxMjtFWD1ERU1PXzc7S0o9MzAsMzI7VlA9RmFsc2U7VUM9RmFsc2U7VTg9RmFsc2U7Uk09RmFsc2U7TVQ9RmFsc2U7QVM9RmFsc2U7Sk09RmFsc2U7RkM9Nzs=" OnMenuClick="OnMenuClick" OnToolsClick="OnToolsClick"	 OnExecuteScripted="OnExecuteScripted">
	 </object>  -->
	 
	    <jsp:include  page="/documentEdit/objectVersion/iWebOffice2009.jsp"/>
			    
              </td>
            </tr>
          </table>
        </td>
      </tr>
      
      <tr width="100">
        <td align="center" valign=top class="TDTitleStyle" width="100" >
            <input class=SideButton type=button value="定义标签"  onclick="WebOpenBookMarks()">
		     <input type=button class=SideButton value="保存模版" onclick=' mySubmit()'>  
		 
			 <input type=button class=SideButton value="打开本地文件" onclick=' WebOpenLocal()'>		
         	 <input type=button class=SideButton value="另存为" onclick='WebSaveLocal()'>
         	 <input type=button class=SideButton value="打印" onclick='WebOpenPrint()'>

     
	    </td>
      </tr>
      


 <tr width="100">
        <td align="center" class="TDTitleMiddleStyle" height="28">
          <font color="#FF0000"><b>↓其他管理↓</b></font>
	    </td>
      </tr>

   
      <tr width="100">
        <td align="center" valign=top class="TDTitleStyle" width="100" height="90%">
		   	
                  <input class=SideButton type=button value="标签管理"  onclick="openBookMarksManager()">
               <!--      <input class=SideButton type=button value="盖章管理"  onclick="openSignatureManager()"> -->
	    </td>
      </tr>


<!--   <td align=right valign=top  class="TDTitleStyle" width=64>内容</td> -->
 
<!-- <tr>  <td align=right valign=top  class="TDTitleStyle" width=64 height=90% >
                 <input class=SideButton type=button value="定义标签"  onclick="WebOpenBookMarks()">
                  <input class=SideButton type=button value="标签管理"  onclick="openBookMarksManager()">
                    <input class=SideButton type=button value="盖章管理"  onclick="openSignatureManager()">
  </td>
  



  <td class="TDStyle"  height=90%>
        <table border=0 cellspacing='0' cellpadding='0' width='100%' height='100%' >
        <tr>
          <td bgcolor="menu">
            调用iWebOffice，注意版本号，可用于升级
            <script src="../iWebOffice2009.js"></script>
          </td>
        </tr>
        </table>
  </td>
  </tr>
   -->
  

</table>
</form>
</body>
</html>
