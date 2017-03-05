<%@ page contentType="text/html; charset=utf-8" %>
<%@ page import="java.io.*,java.text.*,java.util.*,java.sql.*,javax.servlet.*,javax.servlet.http.*,DBstep.iDBManager2000.*" %>
<%
  ResultSet result=null;
String basePath=request.getContextPath();
  String mDescript="";
  String mFileName="";

  String mHttpUrlName=request.getRequestURI();
  String mScriptName=request.getServletPath();
  String mServerName="fileServer.jsp";

  String mServerUrl="http://"+request.getServerName()+":"+request.getServerPort()+mHttpUrlName.substring(0,mHttpUrlName.lastIndexOf(mScriptName))+"/"+mServerName;

  String mRecordID=request.getParameter("RecordID");
  String mTemplateID = request.getParameter("templateId");
  String mFileType=request.getParameter("FileType");
  String parentId=request.getParameter("parentId");
  String treeId=request.getParameter("treeId");
  String mEditType="1,1";
  String mUserName="Administrator";
  
  String businessId=request.getParameter("businessId");
  mFileName = request.getParameter("fileName");


/*   //取得模式
  if (mEditType==null)
  {
    mEditType="2,1";		//2 起草
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


%>

<html>
<head>
<title>预览</title>
<link rel='stylesheet' type='text/css' href='../test.css'>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<script src = "<%=basePath %>/aufw/resources/common/js/jquery.js"></script>
<script language="javascript" for=WebOffice event="OnMenuClick(vIndex,vCaption)">
   if (vIndex==2){  //保存本地文件
      WebSaveLocal();
   }
   if (vIndex==3){  
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
</script>
<script language=javascript for=WebOffice event=OnToolsClick(vIndex,vCaption)>
	if (vIndex==34){
		WebOpenPrint();
  	}
</script>
<script language=javascript>

var nextShowType=0;

var isShowLeftMenu=0;  //左边菜单隐藏或显示

$(function(){
});


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


//作用：载入iWebOffice
function Load(){
  try{
  //以下属性必须设置，实始化iWebOffice
  webform.WebOffice.WebUrl="<%=mServerUrl%>";	//WebUrl:系统服务器路径，与服务器文件交互操作，如保存、打开文档，重要文件
  webform.WebOffice.RecordID="<%=mRecordID%>";	//RecordID:本文档记录编号
  webform.WebOffice.Template="<%=mTemplateID%>";	//Template:模板编号
  webform.WebOffice.FileName="<%=mFileName%>";	//FileName:文档名称
  webform.WebOffice.FileType=".doc";	//FileType:文档类型  .doc  .xls  .wps
  webform.WebOffice.EditType="<%=mEditType%>";	//EditType:编辑类型  方式一、方式二  <参考技术文档>
  webform.WebOffice.UserName="eden";	//UserName:操作用户名
  
  webform.WebOffice.ShowToolBar="1";		//ShowToolBar:是否显示工具栏:1显示,0不显示
  webform.WebOffice.ShowMenu="0";		//ShowMenu:1 显示菜单  0 隐藏菜单
  webform.WebOffice.AppendMenu("2","保存到本地");
  webform.WebOffice.AppendMenu("3","打印文档");
  webform.WebOffice.AppendMenu("10","痕迹记录");
/*   webform.WebOffice.AppendMenu("11","显示痕迹");
  webform.WebOffice.AppendMenu("12","隐藏痕迹"); */
  webform.WebOffice.VisibleTools("新建文件",false);
  webform.WebOffice.VisibleTools("打开文件",false);
  webform.WebOffice.VisibleTools("保存文件",false);
  webform.WebOffice.VisibleTools("文字批注",false);
  webform.WebOffice.VisibleTools("手写批注",false);
  webform.WebOffice.VisibleTools("文档清稿",false);
  webform.WebOffice.VisibleTools("重新批注",false);
  webform.WebOffice.VisibleTools("全屏",false);
  
  webform.WebOffice.AppendTools("34","打印文件",32);
  webform.WebOffice.AppendTools("13","-",0);

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


//作用：保存文档
function SaveDocumentSubmit(){
  webform.WebOffice.WebClearMessage();            //清空iWebOffice变量
  if (!webform.WebOffice.WebSave(true)){    //交互OfficeServer的OPTION="SAVEFILE"，参数true表示保存OFFICE文档
     StatusMsg(webform.WebOffice.Status);
     return false;
  }else{
	  try{
     	alert("保存成功！");
     	window.close();
	  } catch (e){}
     return true;
  }
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


/**
 *   文字批注  手写批注   文档核稿
 */
function changeShowType(input)
{
	webform.WebOffice.ShowType=nextShowType;
	if(nextShowType==1)
	{
		input.value="查看批示";
		nextShowType=0;
	}
	if(nextShowType==0)
	{
		input.value="返回文档";
		nextShowType=1;
	}
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
<body bgcolor="#ffffff" onload="Load()" onunload="UnLoad()" ondblclick="hideOrShowLeftMenu()"> 
<form id="webform" name="webform" method="post" action="TemplateSave.jsp" onsubmit="return SaveDocument();"> <!--保存iWebOffice后提交表单信息-->
<table border=0  cellspacing='0' cellpadding='0' width=100% height=100% align=center class=TBStyle>


<tr width="100" height="28"  >
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
        <td align="center" valign=top class="TDTitleStyle" width="100"  id="leftMenuTd"  style="display: none">

			 <input type=button class=SideButton value="另存为" onclick='WebSaveLocal()'>		
         	 <input type=button class=SideButton value="打印" onclick='WebOpenPrint()'>
         	 
      
         	 <input type=button class=SideButton value="查看批示" onclick='changeShowType(this)'>
         	 
 			<input type=button class=SideButton value="痕迹记录" onclick=' WebGetRevisions()'>

     
	    </td>
      </tr>

<%-- <tr>
  <td class="TDStyle"  height=90%>
        <table border=0 cellspacing='0' cellpadding='0' width='100%' height='100%' >
        <tr>
          <td bgcolor="menu">
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
