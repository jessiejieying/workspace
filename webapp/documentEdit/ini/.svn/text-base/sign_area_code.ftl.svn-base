<div  style="width: ${signEditWidth};height:${signEditHeight};">
		<div id="editMenuDiv${signEditAreaName}" class="editMenuDiv" style="">
		<a class="LinkButton" onClick="changeEditType('${signEditAreaName}',1)">[文字签批]</a>
	    <a class="LinkButton" onClick="changeEditType('${signEditAreaName}',0)">[手写签批]</a>
	    <a class="LinkButton" onClick="ConsultShowZoomInHandWrite('${signEditAreaName}')">[全屏签批]</a>
	    <a class="LinkButton" onClick="ConsultOpenMiniSignature('${signEditAreaName}')">[迷你盖章]</a>
	    <a class="LinkButton" onClick="ConsultClear('${signEditAreaName}');">[取消修改]</a>
	    <a class="LinkButton" onClick="ConsultClearAll('${signEditAreaName}')">[清空全部]</a>
	    <a class="LinkButton" onClick="getSignatureHistory('${signEditAreaName}');">[签章记录]</a>
	    <a class="LinkButton" onClick="writeUserName('${signEditAreaName}')">[自动署名]</a>
	    <a class="LinkButton" onClick="WebGetText('${signEditAreaName}')">[文字批注内容]</a>
	    <a class="LinkButton" onClick="WebDelUserSignature('${signEditAreaName}')">[删除批注]</a>
	    <a class="LinkButton" onClick="ConsultInvisiblePages('${signEditAreaName}',0)">[电子签章窗口]</a>
	    <a class="LinkButton" onClick="ConsultInvisiblePages('${signEditAreaName}',1)">[手写签名窗口]</a>
	    <a class="LinkButton" onClick="ConsultInvisiblePages('${signEditAreaName}',2)">[文字签批窗口]</a>
	    <a class="LinkButton" onClick="SaveSignature()">[保存]</a>
	    <a class="LinkButton" onClick="closeEditMenu('${signEditAreaName}')">[关闭]</a>
  </div>
  <div id="openMenuDiv${signEditAreaName}" class="openMenuDiv" >
     	<a class="LinkButton" onClick="openEditMenu('${signEditAreaName}')">[打开编辑按钮]</a>
  </div>
  <div id="drawAreasDiv${signEditAreaName}"  >
		 <OBJECT name="${signEditAreaName}" classid="clsid:2294689C-9EDF-40BC-86AE-0438112CA439" codebase="../../iWebRevision.cab#version=6,0,0,0" style="width: ${signEditWidth};height:${signEditHeight};">
          <param name="WebUrl" value="${signEditServerUrl}">    <!-- WebUrl:系统服务器路径，与服务器交互操作，如打开签章信息 -->
          <param name="RecordID" value="${signEditRecordID}">    <!-- RecordID:本文档记录编号 -->
          <param name="FieldName" value="${signEditAreaName}">         <!-- FieldName:签章窗体可以根据实际情况再增加，只需要修改控件属性 FieldName 的值就可以 -->
          <param name="UserName" value="${signEditUserName}">    <!-- UserName:签名用户名称 -->
          <param name="Enabled" value="${isSignEditEnabled}">  <!-- Enabled:是否允许修改，0:不允许 1:允许  默认值:1  -->
          <param name="PenColor" value="${signEditColor}">     <!-- PenColor:笔的颜色，采用网页色彩值  默认值:#000000  -->
          <param name="BorderStyle" value="0">    <!-- BorderStyle:边框，0:无边框 1:有边框  默认值:1  -->
          <param name="EditType" value="0">    <!-- EditType:默认签章类型，0:签名 1:文字  默认值:0  -->
          <param name="ShowPage" value="0">    <!-- ShowPage:设置默认显示页面，0:电子印章,1:网页签批,2:文字批注  默认值:0  -->
          <param name="InputText" value="">    <!-- InputText:设置署名信息，  为空字符串则默认信息[用户名+时间]内容  -->
          <param name="PenWidth" value="2">     <!-- PenWidth:笔的宽度，值:1 2 3 4 5   默认值:2  -->
          <param name="FontSize" value="11">    <!-- FontSize:文字大小，默认值:11 -->
          <param name="SignatureType" value="0">    <!-- SignatureType:签章来源类型，0表示从服务器数据库中读取签章，1表示从硬件密钥盘中读取签章，2表示从本地读取签章，并与ImageName(本地签章路径)属性相结合使用  默认值:0 -->
          <param name="InputList" value="同意\r\n不同意\r\n请上级批示\r\n已阅" >    <!-- InputList:设置文字批注信息列表  -->
        </OBJECT>
	</div>    
  </div> 

