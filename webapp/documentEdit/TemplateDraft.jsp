<%@page import="com.rj.eden.aufw.cache.AccountInfoCache"%>
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

  String mServerUrl="http://"+request.getServerName()+":"+request.getServerPort()+mHttpUrlName.substring(0,mHttpUrlName.lastIndexOf(mScriptName))+"/"+mServerName;
 
  String mRecordID=request.getParameter("RecordID");
  String mTemplateID = request.getParameter("templateId");
  String mFileType=request.getParameter("FileType"); 
  String parentId=request.getParameter("parentId");
  String treeId=request.getParameter("treeId");
  String mEditType="1,1";						//第一位可以为0,1,2,3 其中:0不可编辑;1可以编辑,无痕迹;2可以编辑,有痕迹,不能修订;3可以编辑,有痕迹,能修订；
	 											//第二位可以为0,1 其中:0不可批注,1可以批注。可以参考
  AccountInfoCache accountCache = AccountInfoCache.getInstance();
  String mUserName=accountCache.getAccountInfoView((String)request.getSession().getAttribute("userid")).getUserId();
  
  String businessId=request.getParameter("businessId");
  mFileName = request.getParameter("fileName");


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

%>

<html>
<head>
<title>文档起草</title>
<link rel='stylesheet' type='text/css' href='../test.css'>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<script src = "<%=basePath %>/aufw/resources/common/js/jquery.js"></script>

<script language="javascript" for=WebOffice event="OnMenuClick(vIndex,vCaption)">
   if (vIndex==1){  //保存
	   SaveDocumentSubmit();
   }
   if (vIndex==2){  //保存本地文件
      WebSaveLocal();
   }
   if (vIndex==4){  
	   WebOpenLocal();
   }
   if (vIndex==5){  
	   WebOpenPrint();
   }
  
</script>
<script language="javascript" for=WebOffice event="OnToolsClick(vIndex,vCaption)">

if (vIndex==31){
	SaveDocumentSubmit();
}

if (vIndex==32){
	WebSaveLocal();
}

if (vIndex==33){
	WebOpenLocal();
}

if (vIndex==34){
	WebOpenPrint();
}

</script>


<script language=javascript>


var isShowLeftMenu=0;  //左边菜单隐藏或显示



$(function(){


	finishFile();
});

function  StatusMsg(a)
{
	
}

//提取痕迹，自定义痕迹内容。
function newShowHistory(username){  
  try{
    //获得文档的VBA对象
    var mOfficeObj =webform.WebOffice.WebObject;
    //获得文档的痕迹总数
    var mRevisionsCount = mOfficeObj.Revisions.Count;
	  	mOfficeObj.Application.ActiveWindow.View.ShowBookmarks=false;
    if(mRevisionsCount>0){
	  delteHistroy("",true);
      //进行循环插入操作
      for(var i=1;i<=mRevisionsCount; i++){
        try{
          //获得第i个痕迹的尾部位置点
          var mPos = mOfficeObj.Revisions(i).Range.End;
			var mPosstar = mOfficeObj.Revisions(i).Range.Start;
          //获得第i个痕迹的编辑人
          var mAuthor = mOfficeObj.Revisions(i).Author;
          //获得第i个痕迹的编辑时间
          var modifydate =new Date(mOfficeObj.Revisions(i).Date) ;
          //格式化时间
          var modidate=modifydate.getFullYear()+"-"+modifydate.getMonth()+"-"+modifydate.getDate()+" "+modifydate.getHours()+":"+modifydate.getMinutes()+":"+modifydate.getSeconds();
          //组合要插入的内容
			 var mString="";
			if(mOfficeObj.Revisions(i).Type =="1"){
           mString = "『增加："+mAuthor+"||"+modidate+"』";
			 }else if(mOfficeObj.Revisions(i).Type =="2"){
				mString = "『删除 ："+mAuthor+"||"+modidate+"』";
			 }
			 ShowRevision(false);
          //选择到痕迹的尾部位置
			//mOfficeObj.Range(mPosstar,mPos).Select();
          mOfficeObj.Range(mPos,mPos).Select();
          mOfficeObj.Application.Selection.TypeText(" ");
			var Bname= "Mrevision_"+Trim(mAuthor,"g")+i; 
			if(username == "" || username==mAuthor){
			  if(!mOfficeObj.Bookmarks.Exists(Bname)){
				  mOfficeObj.Bookmarks.Add(Bname);   //添加书签，将痕迹内容插入到书签中
			    }
		      //插入组合的痕迹内容
			    webform.WebOffice.WebSetBookMarks(Bname,mString);
				 var selRange =mOfficeObj.Application.Selection.GoTo(-1,0,0,Bname);
				selRange.Font.ColorIndex =6;                       //设置文字颜色：红色
				selRange.Font.Name="仿宋";     //设置字体
				selRange.Font.Size=14;         //设置字体大小,4号
              selRange.HighlightColorIndex = 7;                 //设置文字高亮显示 7：黄色
		
			    }
								 ShowRevision(true);

        }
        catch(e){
          //这里异常可以不用处理，有问题跳过保证设置的连续性
			 alert(e.description);
        }
      }
    }  
  }
  catch(e){
    alert(e.description);                                   //显示出错误信息
  }
}


//作用：显示或隐藏痕迹[隐藏痕迹时修改文档没有痕迹保留]  true表示隐藏痕迹  false表示显示痕迹
function ShowRevision(mValue){
if (mValue){
   webform.WebOffice.WebShow(true);
//StatusMsg("显示痕迹...");
}else{
   webform.WebOffice.WebShow(false);
  // StatusMsg("隐藏痕迹...");
}
}


/*
隐藏显示所有或个别自定义痕迹内容（所有的自定义痕迹都添加在包含“Mrevision_”书签名的书签中）
bookName参数:如果要隐藏或显示所有痕迹则设置为空，个别用户痕迹则设置用户名
bookVal参数:显示痕迹设置为false，隐藏痕迹为true。
*/
function delteHistroy(bookName,bookVal){
 ShowRevision(false);  //设置为无痕迹。
var mOfficeObj =webform.WebOffice.WebObject;   //office的api对象
var Bcount= mOfficeObj.Bookmarks.Count;        //获取书签个数
var i=1;
for( i=1;i<=Bcount;i++){
  //判断文档中的书签是否为当前条件书签,书签名必须包含Mrevision_，和bookName字符串
	if(mOfficeObj.Bookmarks.Item(i).Name.indexOf("Mrevision_")>=0){ 
	 var Bname = mOfficeObj.Bookmarks.Item(i).Name;	 
	  var mBookRange =mOfficeObj.Bookmarks.Item(i).Range;
	  mBookRange.Select();
	  mOfficeObj.Application.Selection.Delete(1,1);
	  
	  if(bookVal && mOfficeObj.Bookmarks.Item(i).Name.indexOf(bookName)>=0){  //隐藏书签	 
	   mBookRange.Text="";		  
	  }
	  else if(!bookVal && mOfficeObj.Bookmarks.Item(i).Name.indexOf(bookName)<0){ //如果是设置显示个别用户，隐藏其他用户痕迹则加此判断
	  mBookRange.Text="";
	  }
	   mOfficeObj.Bookmarks.Add("del"+i, mBookRange);	    
	}
}
 ShowRevision(true);  //设置为无痕迹。
}

function Trim(str,is_global){
	var result;
	result = str.replace(/(^\s+)|(\s+$)/g,"");
	if(is_global.toLowerCase()=="g"){
		result = result.replace(/\s/g,"");
	 }
	return result;
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


//作用：打开版本
function WebOpenVersion(){
	webform.WebOffice.WebOpenVersion();  	//交互OfficeServer  列出版本OPTION="LISTVERSION"     调出版本OPTION="LOADVERSION"   <参考技术文档>
	StatusMsg(webform.WebOffice.Status);
}

//作用：打印文档
function WebOpenPrint(){
  try{
    webform.WebOffice.WebOpenPrint();
    StatusMsg(webform.WebOffice.Status);
  }catch(e){}
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
  webform.WebOffice.UserName="<%=mUserName %>";	//UserName:操作用户名
  
  webform.WebOffice.Language="CH";                        //Language:多语言支持显示选择   CH简体 TW繁体 EN英文
//   webform.WebOffice.ShowWindow = true;                  //控制显示打开或保存文档的进度窗口，默认不显示
  
  webform.WebOffice.ShowToolBar="1";		//ShowToolBar:是否显示工具栏:1显示,0不显示
  webform.WebOffice.ShowMenu="0";		//ShowMenu:1 显示菜单  0 隐藏菜单
  webform.WebOffice.AppendMenu("1","保存");
  webform.WebOffice.AppendMenu("2","另存为");
  webform.WebOffice.AppendMenu("3","-");
  webform.WebOffice.AppendMenu("4","打开本地文件");
  webform.WebOffice.AppendMenu("5","打印文档");
  webform.WebOffice.AppendMenu("13","-");
  webform.WebOffice.AppendMenu("14","保存版本");
  webform.WebOffice.AppendMenu("15","打开版本");
  webform.WebOffice.DisableMenu("宏(&M);选项(&O)...");      //禁止菜单

  
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
  webform.WebOffice.AppendTools("33","打开文件",1);
  webform.WebOffice.AppendTools("13","-",0);
  webform.WebOffice.AppendTools("32","另存文件",3);
  webform.WebOffice.AppendTools("13","-",0);
  webform.WebOffice.AppendTools("31","保存文件",2);
  webform.WebOffice.AppendTools("13","-",0);
//   webform.WebOffice.AppendTools("34","打印",2);
//   webform.WebOffice.AppendTools("35","打开版本",2);
  

 // webform.WebOffice.WebLoadTemplate();			//打开该文档    交互OfficeServer的OPTION="LOADTEMPLATE"
  webform.WebOffice.WebOpen();
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

String.prototype.endWith=function(str){  
    if(str==null||str==""||this.length==0||str.length>this.length)  
      return false;  
    if(this.substring(this.length-str.length)==str)  
      return true;  
    else  
      return false;  
    return true;  
}  

function finishFile(){
	webform.WebOffice.EditType="1,0";  //设置为无痕迹。
	var sendUrl="<%=basePath %>/admin/template/fillData.action?etc="+new Date().getTime();
	var val={};
	val["treeId"]="<%=treeId%>";	
	val["id"]="<%=businessId%>";

	jQuery.post(sendUrl, val, function(data){
		//对主送单位进行特殊处理，去除里面的句号
		for(var x in data.content.data){
			if(x == "OaDocumentMainSend"){
				data.content.data[x] = data.content.data[x].replace("。","");
			}
			if(x == "OaDocumentTitle"){
				var title = data.content.data[x];
				if(title.endWith("发文立项申报表")){
					title = title.substring(0, title.lastIndexOf("发文立项申报表"));
					data.content.data[x] = title;
				}
			}
		}
		
		downloadLocalFile(data.download);
		insertFile(data.content);	  	 
		//SaveDocument();
		
		
		//window.close();
		//$("#showMsg").css("display", "none");
		//$("#webform").css("display", "block");
		
		//webform.WebOffice.WebOpen();
		
		webform.WebOffice.EditType="<%=mEditType%>";  //还原痕迹设置
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

/*
//填充模版
function insertFile(json){
	fillData(json.data);
	var child=json.child;
	if(child!=null){
		for(var i=0;i<child.length;i++){		
			var list=child[i].list;
			for(var j=0;j<list.length;j++){
				mergerFile(child[i].other);
				insertFile(list[j]);
			}
			fillData(child[i].clear);
			webform.WebOffice.WebObject.Application.Selection.Delete();
		}
	}
}
*/

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
		 try{
			webform.WebOffice.WebObject.Application.Selection.GoTo(-1,0,0,key);
			webform.WebOffice.WebSetBookMarks(key,json[key]);
			webform.WebOffice.WebObject.Application.Selection.Bookmarks.item(key).Copy(key+"_"+id);
			webform.WebOffice.WebObject.Application.Selection.Bookmarks.item(key).Delete();
			originalData[key+"_"+id]=json[key];
			
		 }catch(e){}
		 
	}
}


//作用： 合并文档
function mergerFile(json)
{
	webform.WebOffice.WebObject.Application.Selection.GoTo(-1,0,0,json.relation);
	webform.WebOffice.WebObject.Application.Selection.InsertFile(json.documentId);
	webform.WebOffice.WebObject.Application.Selection.Delete();
}

//作用：保存文档
// function SaveDocument(){
  
//   webform.WebOffice.WebClearMessage();            //清空iWebOffice变量
//   if (!webform.WebOffice.WebSave(true)){    //交互OfficeServer的OPTION="SAVEFILE"，参数true表示保存OFFICE文档
//      StatusMsg(webform.WebOffice.Status);
//      return false;
//   }else{
// 	  try{
//      	StatusMsg(webform.WebOffice.Status);
// 	  } catch (e){}
//      return true;
//   }
// }

//作用：保存文档
function SaveDocumentSubmit(){
  webform.WebOffice.WebClearMessage();            //清空iWebOffice变量
  if (!webform.WebOffice.WebSave(true)){    //交互OfficeServer的OPTION="SAVEFILE"，参数true表示保存OFFICE文档
     StatusMsg(webform.WebOffice.Status);
     return false;
  }else{
	  try{
		  if (window.opener && !window.opener.closed){
		    	window.opener.saveDocumentVersionFile();
		    }
    window.opener.document.frames('filePageId').location.reload();
     	alert("保存成功！");

     	//window.close();
	  } catch (e){}
     return true;
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
       // alert(data.message);	
       SaveDocumentSubmit()
	});
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
<body bgcolor="#ffffff" onload="Load()" onunload="UnLoad()" ondblclick="hideOrShowLeftMenu()" > 
<!-- <h2 id="showMsg">正在生成WORD，需使用ie浏览器，并开启ActiveX控件！</h2> -->
<form id="webform"  name="webform" method="post" action="TemplateSave.jsp" onsubmit="return SaveDocument();"> <!--保存iWebOffice后提交表单信息-->
<table border=0  cellspacing='0' cellpadding='0' width=100% height=100% align=center class=TBStyle>

  <tr width="100" height="28">
<!--         <td align="center" class="TDTitleMiddleStyle" id="divMenuName" style="width:100x" > -->
<!--           <font color="#FF0000"><b>↓功能列表↓</b></font> -->
<!-- 	    </td> -->
        <td height="100%" colspan="2" rowspan="12" align="right" valign="top" class="TDStyle">
          <table border="0" cellspacing="0" cellpadding="0" width="100%" height="100%">
            <tr>
              <td bgcolor="menu" height="100%" valign="top">
              <jsp:include  page="objectVersion/iWebOffice2009.jsp"/>
                <!--调用iWebPicture，注意版本号，可用于升级-->
				<!--      <script src="../iWebPlugin.js"></script> -->
              </td>
            </tr>
          </table>
        </td>
      </tr>
      
<!--       <tr width="100"> -->
<!--         <td align="center" valign=top class="TDTitleStyle" width="100" id="leftMenuTd"  style="" > -->
<!-- 		     <input type=button class=SideButton value="保存" onclick='SaveDocumentSubmit()'> -->
<!-- 			 <input type=button class=SideButton value="另存为" onclick='WebSaveLocal()'>		 -->
<!--          	 <input type=button class=SideButton value="打开本地文件" onclick='WebOpenLocal()'> -->
<!--          	 <input type=button class=SideButton value="打印" onclick='WebOpenPrint()'> -->
<!--          	 <input type=button class=SideButton value="打开版本" onclick='WebOpenVersion()'> -->
<!-- 	    </td> -->
<!--       </tr> -->
</table>

</form>

</body>
</html>
