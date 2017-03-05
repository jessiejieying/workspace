 <link REL="stylesheet" href="${base}/documentEdit/css/iWebRevisionCss.css" type="text/css">
 <script language="javascript" src="${base}/documentEdit/js/iWebRevisionEdit.js"></script>
 
 <script language="javascript">

//作用：调入签章数据信息
function LoadSignature(){
    var obs=document.getElementsByTagName("OBJECT");
    for(var i=0;i<obs.length;i++){
         var area=obs[i].getAttribute("name");
 		 var areaOb=document.getElementsByName(area)[0];
 		 var isEnabled= areaOb.Enabled;
 		 if(!isEnabled){
 		    document.getElementById("openMenuDiv"+area).style.display = "none";
 		 }
 		 if(areaOb){
	 		try {  
	      		 areaOb.SetFieldByName('Flag', '2');            //全屏签批后自动计算放置位置
  				 areaOb.LoadSignature();                        //调用“会签”签章数据信息 
	       	}catch(e)
	      	 {
	       
	     	 }  
  		
 		 }
 		
  		 
    }
                                        //js方式设置控件属性
 // DocForm.Consult.AppendMenu("1","自定义的右键菜单项");     //“会签”控件自定义右键菜单
//  DocForm.Consult.DisableMenu("签名盖章...,文字批注...,撤消签章...");     //“会签”控件禁止某些右键菜单
 
}

//作用：保存签章数据信息  
//保存流程：先保存签章数据信息，成功后再提交到DocumentSave，保存表单基本信息
function SaveSignature(){

 var obs=document.getElementsByTagName("OBJECT");
    for(var i=0;i<obs.length;i++)
    {
         var area=obs[i].getAttribute("name");
 		 var areaOb=document.getElementsByName(area)[0];
  		 if (areaOb.Modify){                    //判断签章数据信息是否有改动
		  if (!areaOb.SaveSignature()){        //保存签章数据信息
		    alert("保存会签签批内容失败！");
		    return false;
		  }
    	}

  		//alert("保存成功")
	}


	return true;
}

function checkShouldSave()
{
    var shouldSave=false;
     var obs=document.getElementsByTagName("OBJECT");
    for(var i=0;i<obs.length;i++)
    {
         var area=obs[i].getAttribute("name");
 		 var areaOb=document.getElementsByName(area)[0];
  		 if (areaOb.Modify){                    //判断签章数据信息是否有改动
		  shouldSave=true;
		  break;
    	}

  		
	}
	if(shouldSave)
	{
	   if(confirm("您进行了手写批示，是否已保存,进行退出？"))
	   {
	      return true;
	   }else{
	     return false;
	   }
	}
	
    return shouldSave;
}

var signatureFlag=1;
window.onload=LoadSignature;
  
</script>

 