
//改变状态
function  changeEditType(area,type)
{
  var areaOb=document.getElementsByName(area)[0];
   areaOb.EditType=type;
   
}

//作用：显示Consult操作状态
function ConsultStatusMsg(mString){
  //iConsultStatusBar.innerText=" "+mString;
}

function  getSignatureHistory(area)
{
    var areaOb=document.getElementsByName(area)[0];
	areaOb.ShowSignature();
}


//作用：Consult控件进行全屏签批
function ConsultShowZoomInHandWrite(area){
	  var areaOb=document.getElementsByName(area)[0];
  if(!areaOb.ShowZoomInHandWrite()){       //全屏签批 
  //  ConsultStatusMsg("放弃全屏签批。");
  }
}




//作用：Consult控件中使用迷你盖章窗口盖章
function ConsultOpenMiniSignature(area){
  var areaOb=document.getElementsByName(area)[0];
  if(!areaOb.OpenMiniSignature()){
    //ConsultStatusMsg("放弃盖章。");
  }else{
   // ConsultStatusMsg("盖章成功。");
  }
}

//作用：将Consult控件中的本次签批信息清除
function ConsultClear(area){
	var areaOb=document.getElementsByName(area)[0];
  if (!(areaOb.Enabled)) {
    alert('该签章已被锁定，无权编辑！');
  } 
  else{
  	areaOb.Clear();
    //ConsultStatusMsg("已经取消了本次签批的内容。");
  }
}

//作用：将Consult控件中的签批信息清除
function ConsultClearAll(area){
	  var areaOb=document.getElementsByName(area)[0];
  if (!(areaOb.Enabled)) {
    alert('该签章已被锁定，无权编辑！');
  } 
  else{
  	areaOb.ClearAll();
    //ConsultStatusMsg("已经清除了所有签批的内容。");
  }
}


//得到当前批注中的文字批注内容
function WebGetText(area){
	  var areaOb=document.getElementsByName(area)[0];
  alert("当前文字批注内容为：“"+areaOb.OpinionText+"”\r\n\r\n注意：切换状态后文字批注内容将溶入图层变成图形内容，不再能获取。");
}

//删除当前用户的签批
function WebDelUserSignature(area){
	  var areaOb=document.getElementsByName(area)[0];
  try{
    var mResult = areaOb.DeleteUserSignature(areaOb.UserName);
    if(mResult){
      alert("删除用户“"+areaOb.UserName+"”的批注信息成功！");
    }else{
      alert("删除用户“"+areaOb.UserName+"”的批注信息失败！");
    }
  }
  catch(e){
    alert(e.description);                                   //显示出错误信息
  }
}

//作用：控制Consult控件弹出窗口打开哪些TAB
function ConsultInvisiblePages(area,mIndex){
	  var areaOb=document.getElementsByName(area)[0];
  var mShowPage = areaOb.ShowPage;

  if(mIndex==0){
  	areaOb.ShowPage = "0";
  	areaOb.InvisiblePages('1,2,');
  }
  else if(mIndex==1){
  	areaOb.ShowPage = "1";
  	areaOb.InvisiblePages('0,2,');
  }
  else if(mIndex==2){
  	areaOb.ShowPage = "2";
  	areaOb.InvisiblePages('0,1,');
  }
  var mMsg = areaOb.Status;
  if(mMsg==""){mMsg = "签章、签批成功。";}
 // ConsultStatusMsg(mMsg);
  areaOb.ShowPage = mShowPage;
}

//打开编辑
function openEditMenu(area)
{
	  document.getElementById("openMenuDiv"+area).style.display = "none";
	  document.getElementById("editMenuDiv"+area).style.display = "";
	  document.getElementById("drawAreasDiv"+area).className = "drawAreasDiv";
}

//关闭编辑
function closeEditMenu(area)
{
	  
	  document.getElementById("openMenuDiv"+area).style.display = "";
	  document.getElementById("editMenuDiv"+area).style.display = "none";
	  document.getElementById("drawAreasDiv"+area).className = "";
	  
}
//获得当前日期
function getNowDate()
{
	  var d = new Date();
	  var str = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
	  return str;
}

//署名
function writeUserName(area)
{
	  //DocForm.Consult.WriteName(DocForm.Consult.UserName+' '+getNowDate());
	  var areaOb=document.getElementsByName(area)[0];
	  areaOb.WriteName(areaOb.UserName+' '+getNowDate());
	  
}