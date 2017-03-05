<%@ page contentType="text/html; charset=utf-8" %>
<%@ page import="java.io.*,java.text.*,java.util.*,java.sql.*,javax.servlet.*,javax.servlet.http.*,DBstep.iDBManager2000.*" %>
<%
  ResultSet result=null;
  String basePath=request.getContextPath();
  String mDescript="";
  String mFileName="";

  String mHttpUrlName=request.getRequestURI();
  String mScriptName=request.getServletPath();
  String mServerName="OfficeServer.jsp";
  
  String baseUrl="http://"+request.getServerName()+":"+request.getServerPort()+mHttpUrlName.substring(0,mHttpUrlName.lastIndexOf(mScriptName))+"/";
  
  String mServerUrl=baseUrl+mServerName;

  String mRecordID=request.getParameter("RecordID");
  String mTemplateID = request.getParameter("templateId");
  String mFileType=request.getParameter("FileType");
  String parentId=request.getParameter("parentId");
  String treeId=request.getParameter("treeId");
  String mEditType="2,1";
  String mUserName = (String)request.getSession().getAttribute("account_name_key");
  String optype=request.getParameter("optype"); //   2: 盖章 
  String editType=request.getParameter("editType"); //   //第一位可以为0,1,2,3 其中:0不可编辑;1可以编辑,无痕迹;2可以编辑,有痕迹,不能修订;3可以编辑,有痕迹,能修订；
  //第二位可以为0,1 其中:0不可批注,1可以批注。可以参考
  String showType=request.getParameter("showType");
  if(editType!=null)
  {
	  mEditType=editType;
  }
  if(showType==null)
  {
	  showType="1";
  }
  //String mUserName= request.getParameter("UserName");
  if(mUserName==null)
  {
	  out.print("请登录！");
	  return;
  }
  
  String businessId=request.getParameter("businessId");
  mFileName = request.getParameter("fileName");
  String filldata=request.getParameter("filldata");

/*   //取得模式
  if (mEditType==null)
  {
    mEditType="1,1";		//2 起草
  } */
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

 if(treeId==null||treeId.equals(""))
 {
	 DBstep.iDBManager2000 DbaObj=new DBstep.iDBManager2000();
	  if (DbaObj.OpenConnection())
	  {
	   
	    String querySql = "Select FileName From document_file Where RecordId='"+ mRecordID + "'";
	    try
	    {
	     
	      result = DbaObj.ExecuteQuery(querySql);
	      if (result.next())
	      {
	    	  mFileName=result.getString("FileName");
	    	  
	    	  String[] fileSpilt=mFileName.split("_");
	    	  if(fileSpilt.length==3)
	    	  {
	    		  treeId=fileSpilt[1];
	    	  }
	    	  
	    	  
	      }
	      else
	      {
	    	  mFileName = "";
	      }
	      result.close();
	    }
	    catch(Exception e)
	    {
	      System.out.println(e.toString());
	    }
	    DbaObj.CloseConnection() ;
	  }
	 
	 
 }
 
  

%>

<html>
<head>
<title>WORD编辑</title>
<link rel='stylesheet' type='text/css' href='../test.css'>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<script src = "<%=basePath %>/aufw/resources/common/js/jquery.js"></script>

<script language="javascript" for=WebOffice event="OnMenuClick(vIndex,vCaption)">
	if (vIndex==3){  //打开本地文件
		WebOpenLocal();
	}
   if (vIndex==1){  //保存
	   SaveDocumentSubmit();
   }
   if (vIndex==4){  //保存本地文件
      WebSaveLocal();
   }
   if (vIndex==5){  
	   WebOpenPrint();
   }
   
   if (vIndex==10){
		  WebGetRevisions()    
	  } 
	  if (vIndex==11){
		  ShowRevision(true)  
	  } 
	  if (vIndex==12){
		  ShowRevision(false)     
	  }
	  if (vIndex==2){
		  //WebOpenSignature()  
		  CreateSignature(0)
	  } 
	  if (vIndex==14){
		  WebSaveVersion()   
	  }
	  if (vIndex==15){
		  WebOpenVersion()   
	  }
	  
	  if (vIndex==20){
		  
		  CreateSignature(1) 
	  }
	 
	  
</script>

<script language="javascript" for=WebOffice event="OnToolsClick(vIndex,vCaption)">

if (vIndex==31){
	SaveDocumentSubmit();
}
if (vIndex==32){
	  CreateSignature(0)
}

</script>

<script language=javascript>

var basePath='<%=basePath %>';
var isSave=false;
var optype=<%=optype %>;
var isShowLeftMenu=0;  //左边菜单隐藏或显示

$(function(){
	
	
});


//作用：打开本地文件
function WebOpenLocal(){
  try{
    webform.WebOffice.WebOpenLocal();
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


//作用：打印文档
function WebOpenPrint(){
  try{
    webform.WebOffice.WebOpenPrint();
    StatusMsg(webform.WebOffice.Status);
  }catch(e){}
}

//作用：打开版本
function WebOpenVersion(){
  webform.WebOffice.WebOpenVersion();  	//交互OfficeServer  列出版本OPTION="LISTVERSION"     调出版本OPTION="LOADVERSION"   <参考技术文档>
  StatusMsg(webform.WebOffice.Status);
}

//作用：保存版本
function WebSaveVersion(){
  webform.WebOffice.WebSaveVersion();  	//交互OfficeServer的OPTION="SAVEVERSION"
  StatusMsg(webform.WebOffice.Status);

}

//作用：保存当前版本
function WebSaveVersionByFileID(){
  /* var mText=window.prompt("请输入版本说明:","版本号:V");
  if (mText==null){
     mText="已修改版本.";
  } */
  var mText="已修改版本";
  webform.WebOffice.WebSaveVersionByFileID(mText);  	//交互OfficeServer的OPTION="SAVEVERSION"  同时带FileID值   <参考技术文档>
  StatusMsg(webform.WebOffice.Status);
}


//作用：显示或隐藏痕迹[隐藏痕迹时修改文档没有痕迹保留]  true表示隐藏痕迹  false表示显示痕迹
function ShowRevision(mValue){
  if (mValue){
     webform.WebOffice.WebShow(true);
     StatusMsg("显示痕迹...");
  }else{
     webform.WebOffice.WebShow(false);
     StatusMsg("隐藏痕迹...");
  }
}

//作用：获取痕迹
function WebGetRevisions(){
  var Rev = webform.WebOffice.WebObject.Revisions;		//获取痕迹对象
  var Text="";

  for (i = 1;i <= Rev.Count;i++){
    Text=Text +"“"+ Rev.Item(i).Author+"”";
    if (Rev.Item(i).Type=="1"){
      Text=Text + '进行插入：'+Rev.Item(i).Range.Text+"\r\n";
    }else if (Rev.Item(i).Type=="2"){
      Text=Text + '进行删除：'+Rev.Item(i).Range.Text+"\r\n";
    }
	else {
      Text=Text + '进行其他操作，操作内容：“'+Rev.Item(i).Range.Text+ '”；操作：“'+Rev.Item(i).FormatDescription+"”。\r\n";
    }
  }
  alert("痕迹内容：\r\n\r\n"+Text);
}


function  StatusMsg(a){}

//作用：载入iWebOffice
function Load(){
  try{
  //以下属性必须设置，实始化iWebOffice
  webform.WebOffice.WebUrl="<%=mServerUrl%>";	//WebUrl:系统服务器路径，与服务器文件交互操作，如保存、打开文档，重要文件
  webform.WebOffice.RecordID="<%=mRecordID%>";	//RecordID:本文档记录编号
  webform.WebOffice.Template="<%=mTemplateID%>";	//Template:模板编号
  webform.WebOffice.FileName="<%=mFileName%>";	//FileName:文档名称
  webform.WebOffice.FileType="<%=mFileType%>";	//FileType:文档类型  .doc  .xls  .wps
  webform.WebOffice.EditType="<%=mEditType%>";	//EditType:编辑类型  方式一、方式二  <参考技术文档>
  webform.WebOffice.UserName="<%=mUserName%>";	//UserName:操作用户名
  
  webform.WebOffice.ShowToolBar="1";		//ShowToolBar:是否显示工具栏:1显示,0不显示
  
   
  webform.WebOffice.ShowMenu="1";		//ShowMenu:1 显示菜单  0 隐藏菜单
  webform.WebOffice.AppendMenu("1","保存");
  
  <%  if(optype!=null&&optype.equals("2"))
  {
	  %>
	  webform.WebOffice.AppendMenu("2","签名印章");
<%  }
	  %>

  
/*   webform.WebOffice.AppendMenu("20","手写批注"); */
  webform.WebOffice.AppendMenu("3","打开本地文件");
  
  webform.WebOffice.AppendMenu("4","保存到本地");
  webform.WebOffice.AppendMenu("5","打印文档");
  webform.WebOffice.AppendMenu("6","-");
  webform.WebOffice.AppendMenu("10","痕迹记录");
  webform.WebOffice.AppendMenu("11","显示痕迹");
  webform.WebOffice.AppendMenu("12","隐藏痕迹");
  webform.WebOffice.AppendMenu("13","-");
  webform.WebOffice.AppendMenu("14","保存版本");
  webform.WebOffice.AppendMenu("15","打开版本");
  
  webform.WebOffice.VisibleTools("新建文件",false);
  webform.WebOffice.VisibleTools("打开文件",false); 
  webform.WebOffice.VisibleTools("保存文件",false);
  webform.WebOffice.VisibleTools("文字批注",false);
  webform.WebOffice.VisibleTools("手写批注",false);
  webform.WebOffice.VisibleTools("文档清稿",false);
  webform.WebOffice.VisibleTools("重新批注",false);
/*   webform.WebOffice.VisibleTools("全屏",false); */
  
  webform.WebOffice.AppendTools("30","-",2);
  webform.WebOffice.AppendTools("31","保存文件",2);
  <%   if(optype!=null&&optype.equals("2"))
    {
	  %>
  webform.WebOffice.AppendTools("32","盖章",3);
  <%  }
	  %>
  
  webform.WebOffice.DisableMenu("宏(&M);选项(&O)...");      //禁止菜单

  webform.WebOffice.WebOpen();			//打开该文档    交互OfficeServer的OPTION="LOADTEMPLATE"
  webform.WebOffice.ShowType=<%=showType%>;			//文档显示方式  1:表示文字批注  2:表示手写批注  0:表示文档核稿
  StatusMsg(webform.WebOffice.Status);
  getData()
  }catch(e){}
}

var originalData={};
var changeData={}

function getData(){
	 
	var sendUrl="<%=basePath %>/admin/template/fillData.action?etc="+new Date().getTime();
	var val={};
	val["treeId"]="<%=treeId%>";	
	val["id"]="<%=businessId%>";

	jQuery.post(sendUrl, val, function(data){
		ShowRevision(false) 
		if(data&&data.content)
		{	
			var json=data.content.data;
			var id=data.content.id;
			for(var key in json){
		
				/* webform.WebOffice.WebObject.Application.Selection.GoTo(-1,0,0,key);
				webform.WebOffice.WebSetBookMarks(key,json[key]);
				webform.WebOffice.WebObject.Application.Selection.Bookmarks.item(key).Copy(key+"_"+id);
				webform.WebOffice.WebObject.Application.Selection.Bookmarks.item(key).Delete(); */
			/* 	webform.WebOffice.WebSetBookMarks(key+"_"+id,json[key]);
				originalData[key+"_"+id]=json[key]; */
				var key_=key+"_"+id;
				 try{
						webform.WebOffice.WebObject.Application.Selection.GoTo(-1,0,0,key_);
						webform.WebOffice.WebSetBookMarks(key_,json[key]);
					/* 	webform.WebOffice.WebObject.Application.Selection.Bookmarks.item(key_).Copy(key+"_"+id);
						webform.WebOffice.WebObject.Application.Selection.Bookmarks.item(key_).Delete(); */
						originalData[key+"_"+id]=json[key];
						
				 }catch(e){}
			}
			
			
		}
	
		ShowRevision(true)  //显示痕迹
	});  
}


//作用：退出iWebOffice
function UnLoad(){
	
	
/* 	if(!confirm("文档是否已保存了？选择是：退出；选择否：回到本页面"))
	{
			
			return;
	} */
	
	if(isSave)
	{
		
	}else{
		
		return "是否已经保存？";
		
	}
	
  
}

function closes()
{
	
	 var sendUrl="<%=baseUrl%>documentEdit/OfficeHand.jsp?t="+new Date().getTime();
	 var val="op=removeLock&mRecordID=<%=mRecordID%>";
/* 	jQuery.post(sendUrl, val, function(data){

		  try{
			  if (!webform.WebOffice.WebClose()){
				 
			     StatusMsg(webform.WebOffice.Status);
			  }else{
			     StatusMsg("关闭文档...");
			  }
			  }catch(e){}
			  
	});   */
	
	$.ajax({  
       type : "post",  
        url : sendUrl,  
        data : val,  
        async : false,  
        success : function(data){  


        }  
   }); 
	 
	 try{
		  if (!webform.WebOffice.WebClose()){
			 
		     StatusMsg(webform.WebOffice.Status);
		  }else{
		     StatusMsg("关闭文档...");
		  }
	}catch(e){}
	
}


//作用：签名印章
function WebOpenSignature(){
  try{
    webform.WebOffice.WebOpenSignature();  	//交互OfficeServer的 A签章列表OPTION="LOADMARKLIST"    B签章调出OPTION="LOADMARKIMAGE"    C确定签章OPTION="SAVESIGNATURE"    <参考技术文档>
    StatusMsg(webform.WebOffice.Status);
  }catch(e){alert(e.description);}
}

//转pdf
function WebSavePDF(){
	/* try{
	  webform.WebOffice.WebSavePDF();
	}catch(e){alert(e.description);}
	 */
	var url="<%=basePath %>/admin/documentData/putPdfDoc.action?etc="+new Date().getTime();
	var val='recordID=<%=mRecordID%>';
	jQuery.post(url, val, function(data){
		if(data.msg=='success')
		{
			closeDoc()
			return true;
		}else{
			 alert("保存失败")
			return false;
		}
		
	}); 
	
}

//作用：保存文档
function SaveDocumentSubmit(){
	
	//WebSaveVersionByFileID();//保存版本
	
	
	
	
  ShowRevision(false)
  webform.WebOffice.WebClearMessage();            //清空iWebOffice变量
  if (!webform.WebOffice.WebSave()){    //交互OfficeServer的OPTION="SAVEFILE"，参数true表示保存OFFICE文档
     StatusMsg(webform.WebOffice.Status);
     return false;
  }else{
	  <%   if(optype!=null&&optype.equals("2"))
	 	 {
		  %>
		   if(!WebSavePDF())
		   {
			  
			   return;
		   }else{
			
			  
		   }
		<%  }else{
			
		  %>
	
		  closeDoc();
		  <%
  		}
		  %>
		
     return true;
  }
}

function closeDoc()
{
	 try{
			isSave=true;
			 alert("保存成功！");
			 window.onbeforeunload=null;
	     	window.close();
	     	
		  } catch (e){
			  alert(e);
			  
	 }
	
}

//回写
function writebackAndSub(){
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
        //alert(data.message);	
        SaveDocumentSubmit()
	});
}


//iSignature

//作用：检测客户端是否安装电子签章
function SignatureInstalled()
{
var b=webform.SignatureAPI.SignatureInstalled(); //检测电子签章是否安装在本机上。
if(b)
{
  alert("iSignature installed");
}
else
{
  alert("iSignature not installed");
}
}


//作用：设置活动文档对象
function SetActiveDocument(){
//alert(webform.WebOffice.WebObject.Name);

if (webform.WebOffice.FileType==".doc"){
  webform.SignatureAPI.ActiveDocument=webform.WebOffice.WebObject;   //设置WORD对象
}  
if (webform.WebOffice.FileType==".xls"){
 webform.SignatureAPI.ActiveDocument=webform.WebOffice.WebObject.Application.ActiveWorkbook.ActiveSheet;   //设置EXCEL对象
}

//alert(webform.SignatureAPI.ActiveDocument.Name);
}


/*
CreateSignature参数值列表
*/
var stSign = 0x00000001;     //电子签章
var stHand = 0x00000002;     //手写签名
var stGroup = 0x00000003;    //批量验证
var stBarCode = 0x00000005;  //二维条码
var Comments = 1;            //锁定批注
var FormFields = 2;          //锁定窗体
/*
SelectionState返回值列表
*/
var  ssFailed            = -1;        //未知状态
var  ssSucceeded         = 0x0000;     //成功
var  ssNoInstall         = 0x0001;     //电脑未正确安装电子签章软件！
var  ssNoActiveDocument  = 0x0002;     //不存在活动的文档或者未设置ActiveDocument！
var  ssDocumentLocked    = 0x0003;     //文档已经锁定
var  ssDocumentInObject  = 0x0004;     //光标置于对象之上，请处于编辑状态
var  ssDocumentInHFooter = 0x0005;     //光标在页眉面脚上，不能签章。
var  ssDocumentInTextbox = 0x0006;     //光标不能在文档框内签章
var  ssDocumentInEdit    = 0x0007;     //EXCEL不能在编译模式下进行签章。

//作用：创建电子签章
function CreateSignature(id)
{
	
SetActiveDocument();     //设置活动文档
if(id==0){
  if(webform.SignatureAPI.SelectionState==ssSucceeded)         //当前光标状态
  {
	     webform.SignatureAPI.CreateSignature(stSign);	//建立电子签章
  }
}

if(id==1){
  if(webform.SignatureAPI.SelectionState==ssSucceeded)
  {
	    webform.SignatureAPI.CreateSignature(stHand);     //建立手写签名
  }
}

if (id==2){
	   webform.SignatureAPI.DoAction(3,"");   //建立批量验证
}

if (id==3){
	   webform.SignatureAPI.DoAction(4,"");   //建立参数设置
}

if (id==5){
  if(webform.SignatureAPI.SelectionState==ssSucceeded)
  {
	    webform.SignatureAPI.CreateSignature(stBarCode);  //建立二维条码
  }
}
}

//作用：初始签章数据
function InitSignatureItems()
{
SetActiveDocument();   //设置活动文档
webform.SignatureAPI.InitSignatureItems();  //当签章数据发生变化时，请重新执行该方法
}

//作用：获取签章数量
function GetSignatureCount()
{
alert(webform.SignatureAPI.SignatureCount);  //调用InitSignatureItems后有效，获取签章数量
}

//作用：查询文档是否存在无效签章
function HasError()
{
  if (webform.SignatureAPI.HasErrorSignature()) 
  {
    alert("存在无效签章");
  }
  else
  {
    alert("不存在无效签章");
  }
}


//作用：向电子签章系统增加批注内容
function CreateComment()
{
var mResult = webform.SignatureAPI.CreateComment("已阅，请办理 \r\n    金格科技");
if (mResult){
  alert("增加批注文字内容成功");
  alert(webform.SignatureAPI.ReadComment());
}else{
  alert("增加批注文字内容失败，请先执行删除批注方法DeleteComment()");
}
}

//作用：删除批注内容
function DeleteComment()
{
webform.SignatureAPI.DeleteComment();
}

/**
 *   文字批注  手写批注   文档核稿
 */
function changeShowType(type)
{
	webform.WebOffice.ShowType=type;
}

function hideOrShowLeftMenu()
{
	if(isShowLeftMenu)
	{
		 document.getElementById('divMenuName').style.display = "none";
		 document.getElementById('leftMenuTd').style.display = "none";
		 isShowLeftMenu=0;
	}else{
		
		 document.getElementById('divMenuName').style.display = "";
		 document.getElementById('leftMenuTd').style.display = "";
		 isShowLeftMenu=1;
	}
	
	
}

</script>
</head>
<body bgcolor="#ffffff" onload="Load()" onbeforeunload="return UnLoad();" onunload="closes()" ondblclick="hideOrShowLeftMenu()" > 
<form id="webform" name="webform" method="post" action="TemplateSave.jsp" onsubmit="return SaveDocument();"> <!--保存iWebOffice后提交表单信息-->
<table border=0  cellspacing='0' cellpadding='0' width=100% height=100% align=center class=TBStyle>

<script src="<%=basePath %>/iSignatureAPI.js"></script>   
  <tr width="100" height="28" >
        <td align="center" class="TDTitleMiddleStyle" id="divMenuName" style="display: none">
          <font color="#FF0000"><b>↓功能列表↓</b></font>
	    </td>
        <td height="100%" colspan="2" rowspan="12" align="right" valign="top" class="TDStyle" hegith="90%">
          <table border="0" cellspacing="0" cellpadding="0" width="100%" height="100%">
            <tr>
              <td bgcolor="menu" height="98%" valign="top">
              
              
             
              <jsp:include  page="objectVersion/iWebOffice2009.jsp"/>
                <!--调用iWebPicture，注意版本号，可用于升级-->
			<!--      <script src="../iWebPlugin.js"></script> -->
			    
              </td>
            </tr>
          </table>
        </td>
      </tr>
      
      <tr width="100" >
        <td align="center" valign=top class="TDTitleStyle" width="100" id="leftMenuTd"  style="display: none">

		     <input type=button class=SideButton value="保存" onclick='SaveDocumentSubmit()'>  
			 <input type=button class=SideButton value="另存为" onclick='WebSaveLocal()'>		
         	 <input type=button class=SideButton value="打开本地文件" onclick='WebOpenLocal()'>
         	 <input type=button class=SideButton value="打印" onclick='WebOpenPrint()'>



 <input type=button class=SideButton value="文字模式" onclick='changeShowType(1)'>
 
 <%
 if("3,1".equals(mEditType))
 {
 %>
  <input type=button class=SideButton value="手写批注" onclick='changeShowType(2)'>
   <%
 }
 %>
  <input type=button class=SideButton value="文档核稿" onclick='changeShowType(0)'>

  <input type=button class=SideButton value="痕迹记录" onclick=' WebGetRevisions()'>
  <input type=button class=SideButton value="显示痕迹" onclick='ShowRevision(true)'>
  <input type=button class=SideButton value="隐藏痕迹" onclick='ShowRevision(false)'>
  <input type=button class=SideButton value="保存版本" onclick='WebSaveVersion()'>
  <input type=button class=SideButton value="打开版本" onclick='WebOpenVersion()'>
     
   <!--   <input type=button class=SideButton value="转pdf" onclick='WebSavePDF()'> -->
     
	    </td>
      </tr>

<%-- 
<tr>

	  <script src="<%=basePath %>/iSignatureAPI.js"></script>    
<!--   <td align=right valign=top  class="TDTitleStyle" width=64 height=90% >
  
                 <font color="#FF0000"><b> ↓功能列表↓</b></font>
                 
                 <div style="height:10px"></div>
                  <input type=button value="  保存  " onclick="SaveDocumentSubmit()">
                 <input type=button value="痕迹记录"  onclick="WebGetRevisions()">
                  <input type=button value="显示痕迹"  onclick="ShowRevision(true)">
                  <input type=button value="隐藏痕迹"  onclick="ShowRevision(false)">
                      <input type=button  value="保存版本"   onclick="WebSaveVersion()">
             <input type=button  value="打开版本"   onclick="WebOpenVersion()">
             
                <input type=button value="签名印章" onclick="WebOpenSignature()">
                
                   <input type=button value="文档核稿"  onclick="webform.WebOffice.ShowType=0;">
          
                         <input type=button value="全屏显示" onClick="webform.WebOffice.VisibleTools('全屏',true)"> 
                
  </td> -->

  <td class="TDStyle"  height=90%>
        <table border=0 cellspacing='0' cellpadding='0' width='100%' height='100%' >
        <tr>
          <td bgcolor="menu">
          
          <script type="text/javascript">
          
          function addOnjectJs()
          {
        	  if ((navigator.userAgent.indexOf('MSIE') >= 0) 
        			    && (navigator.userAgent.indexOf('Opera') < 0)){
        			    alert('你是使用IE')
        		}else{
        			alert("谷歌")
        		}
        	  
        	  
        	  
          }
          addOnjectJs()
          </script>
          
           <jsp:include  page="objectVersion/iWebOffice2009.jsp"/>
          
          <!--    <object id="WebOffice"  width="100%" height="100%" progid="iWebOffice2009.HandWriteCtrl" type="application/iwebplugin" Copyright="金格科技[演示专用];V4.46YeR5qC856eR5oqAW+a8lOekuuS4k+eUqF07MjAxNTs3Ozg7OTsxMDsxMTsxMjtFWD1ERU1PXzc7S0o9MzAsMzI7VlA9RmFsc2U7VUM9RmFsc2U7VTg9RmFsc2U7Uk09RmFsc2U7TVQ9RmFsc2U7QVM9RmFsc2U7Sk09RmFsc2U7RkM9Nzs=" OnMenuClick="OnMenuClick" OnToolsClick="OnToolsClick"	 OnExecuteScripted="OnExecuteScripted">
	 </object>  -->
            <!--调用iWebOffice，注意版本号，可用于升级-->
            <script src="<%=basePath %>/iWebOffice2009.js"></script>
          </td>
        </tr>
        

        </table>
  </td>
</tr> --%>



</table>

</form>


</body>
</html>
