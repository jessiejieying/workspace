/**
 *   工作流节点与表单控件绑定控制配置时代码
 */

/**
 * 解析url参数
 * 
 */
function parser_request(url, parm) {
	var reg = new RegExp("(^|&)" + parm + "=([^&]*)(&|$)");
	var r = url.substr(url.indexOf("\?") + 1).match(reg);
	if (r != null)
		return unescape(r[2]);
	return null;
}

/**
 * 根据业务表单url，加载控件列表
 */
function loadControlGridDataByForm() {
	var formUrl = $id("txtView").value;
	var txtActionID = $id("txtActionID").value;
	var stepId = $id("txtID").value;
	if (formUrl && txtActionID) {
		var djtype = parser_request(formUrl, "djtype");
		var djsn = parser_request(formUrl, "djsn");
		if (djtype && djsn) //
		{
			loadControlGridData(djtype, djsn);
			return;
		}
	}
	alert("业务表单或动作id为空，不能显示");
}

/**
 * 读取表单各控件
 */
function loadControlGridData(djtype, djid) {
	var billpath = "";
	var oXml = SetDomFile("../.." + fcpubdata.userDir + "/xml/billtype.xml");
	var l = oXml.documentElement.childNodes.length - 1;

	for ( var i = 0; i < l; i++) {
		if (oXml.documentElement.childNodes(i).childNodes(2).text == djtype) {
			var sPartPath = oXml.documentElement.childNodes(i).childNodes(3).text;
			// billpath = fcpubdata.path+"/"+sPartPath ;
			billpath = "/" + sPartPath;
			break;
		}
	}
	if (billpath == null || billpath == "") {
		alert("未找到eform的表单分类 " + djtype + " 对应的文件目录，\r\t 请在eform的表单分类中设置 "
				+ djtype + " 对应的文件目录，再执行此向导！");
		return;
	}
	var pagepath = "../.." + billpath + djid + ".dj";
	putChildFrameDoc(pagepath);

}

/**
 * 显示表单控件信息列表
 */
function showFormInfoList() {
	var doc = getChildFrameDoc();
	var rootXml = doc.getElementById('SKbillsheet').getAttribute('contxml');
	parseDjHtmlId(rootXml, doc)
}

//保存
function saveControlData() {
	var oXml = dsControl.oDom;
	var len = oXml.documentElement.childNodes.length;
	for ( var i = 0; i < len; i++) {
		var len2 = oXml.documentElement.childNodes(i).childNodes.length;
		var type = "";
		for ( var j = 0; j < len2; j++) {
			type += " " + j + ":"
					+ oXml.documentElement.childNodes(i).childNodes(j).text;

		}
	}
}

/**
 * 解析
 */
function parseDjHtmlId(rootXml, doc) {
	var oldControlXml = dsControl.oDom;
	var oldControllen = oldControlXml.documentElement.childNodes.length - 1;
	//已经加载过
	if (oldControllen > 0) {		
		return;

	}

	var txtActionID = $id("txtActionID").value; //actionid
	var stepId = $id("txtID").value; //stepId
	var formUrl = $id("txtView").value;
	var djsn = parser_request(formUrl, "djsn"); //表单djsn

	var osqlXml = getSqlDatasetXML(txtActionID, stepId, djsn); //数据库里控件原来选择的记录xml
	var oXml = SetDom(rootXml);
	var len = oXml.documentElement.childNodes.length;
	//添加行
	for ( var i = 0; i < len; i++) {
		var tagName = oXml.documentElement.childNodes(i).nodeName;
		if (!isAppendRowByCType(tagName)) {
			continue;
		}
		var len2 = oXml.documentElement.childNodes(i).childNodes.length;
		for ( var j = 0; j < len2; j++) {
			var controlId = oXml.documentElement.childNodes(i).childNodes(j).text;

			if (tagName == "tab") {
				//处理tab子项
				putTabItemValue(txtActionID, stepId, djsn, osqlXml, tagName,
						doc, controlId)
			}
			checkAddRow(txtActionID, stepId, djsn, osqlXml, tagName, controlId,
					doc);
		}

	}

}

/**
 * 提取查找字符串后面的所有字符
 */
function cutStr(mainstr, startStr, endStr) {
	// alert(mainstr)
	var foundoffset = mainstr.indexOf(startStr);
	if (foundoffset == -1) {
		return null;
	}

	var startString = mainstr.substring(foundoffset + startStr.length,
			mainstr.length);
	if (!endStr) {
		return startString;
	}

	foundoffset = startString.indexOf(endStr);

	return startString.substring(0, foundoffset);
}

/**
 * 根据控件类型判断要不要加入
 */
function isAppendRowByCType(tagName) {
	var flag = false;
	switch (tagName) {
	case 'label':
	case 'text':
	case 'textarea':
	case 'editor':
	case 'img':
	case 'radio':
	case 'checkbox':
	case 'button':
	case 'tab':
		//case 'page':
	case 'tree':
	case 'checkboxlist':
	case 'listbox':
	case 'radiolist':
	case 'dropdownlist':
	case 'dataset':
	case 'grid':
	case 'upload':
	case 'div': {

		flag = true;
		break;
	}

	}

	return flag;

}

/**
 * 往valObj里设置
 */
function setCNElementInnerText(doc, id, valObj, cnType) {

	var chinaval = doc.getElementById(id).getAttribute('china');
	if (chinaval) //有值
	{
		valObj[0] = chinaval;

	} else {
		var textVal = doc.getElementById(id).innerText;
		if (textVal) {

			valObj[0] = textVal;
		}
	}

	// valObj[1]=cnType;  //暂时不用中文
}
/**
 * 往valObj里设置
 */
function getCNElementName(doc, id, valObj, cnType) {
	var val = doc.getElementById(id).getAttribute('china');
	if (val) {
		valObj[0] = val;
	} else {
		valObj[0] = id;
	}

	// valObj[1]=cnType;//暂时不用中文

}

/**
 * 
 *  获取表单页面中文说明和中文类型
 *  返回 [0] 中文说明,[1] 中文类型
 * 
 *
 **/
function getOrgCNNameAndType(tagName, doc, id) {
	var valObj = new Array();
	valObj[0] = id;
	valObj[1] = tagName;
	switch (tagName) {
	case 'button': {
		setCNElementInnerText(doc, id, valObj, "按钮")
		break;
	}
	case 'label': {
		setCNElementInnerText(doc, id, valObj, "标签")
		break;
	}
	case 'textarea': {
		getCNElementName(doc, id, valObj, "多行文本框")
		break;
	}
	case 'text': {
		getCNElementName(doc, id, valObj, "文本框")
		break;
	}
	case 'editor': {
		getCNElementName(doc, id, valObj, "编辑器")
		break;
	}
	case 'radio': {
		getCNElementName(doc, id, valObj, "单选按钮")
		break;
	}
	case 'checkbox': {
		getCNElementName(doc, id, valObj, "多项选择项")
		break;
	}
	case 'checkboxlist': {
		getCNElementName(doc, id, valObj, "多选列表")
		break;
	}
	case 'listbox': {
		getCNElementName(doc, id, valObj, "listbox列表")
		break;
	}
	case 'radiolist': {
		getCNElementName(doc, id, valObj, "单选列表")
		break;
	}
	case 'dropdownlist': {
		getCNElementName(doc, id, valObj, "下拉框")
		break;
	}

	case 'img': {
		valObj[0] = "图片" + id;
		//valObj[1]="img";   
		break;
	}

	case 'tabItem': {
		var tabItemName = doc.innerText;
		valObj[0] = tabItemName;
		valObj[1] = "tabItem";
		break;
	}
		//case 'page':
	case 'tree': {
		valObj[0] = "树" + id;
		//valObj[1]="树";   
		break;
	}

	case 'upload': {
		valObj[0] = "上传控件";
		//valObj[1]="上传控件";	   
		break;
	}

	}

	return valObj;

}

/**
 * checkbox的值把"是"变为1
 * 
 */
function checkboxIntValue(val) {
	if (val == "是" || val == 1) {
		return 1;

	} else {

		return 0;
	}

}

/**
 * 数据库查询
 */
function getSqlDatasetXML(actionid, stepId, djsn) {
	var addWhereparam = " and djsn='" + djsn + "'";
	var sSql = "select control_id,id,node_action_id,is_active,is_show from wf_node_control_bind where node_action_id='"
			+ actionid + "' " + addWhereparam;

	var xmlCon = SelectSql(sSql, 0, -1);
	return SetDom(xmlCon);
}

/**
 * 
 *  txtActionID: actionid,
 oXml: 数据库记录的xml
 control_type:控件类型
 control_id:控件id
 doc: 对应表单的document
 * 
 * 
 **/
function checkAddRow(txtActionID, stepId, djsn, oXml, control_type, control_id,
		doc) {

	dsControl.Append();
	dsControl.Field("is_active").Value = 1;
	dsControl.Field("is_show").Value = 1;

	// var oXml=getSqlDatasetXML()
	var oList = oXml.getElementsByTagName("record");
	var len = oList.length;

	for ( var i = 0; i < len; i++) {
		var record = oList.item(i);
		var oControlId = record.childNodes(0).text;
		if (control_id == oControlId) //控件id数据库里已有
		{
			dsControl.Field("id").Value = record.childNodes(1).text;
			// dsControl.Field("node_action_id").Value=record.childNodes(2).text;

			dsControl.Field("is_active").Value = record.childNodes(3).text;
			dsControl.Field("is_show").Value = record.childNodes(4).text;

			break;
		}

	}
	var valArr = getOrgCNNameAndType(control_type, doc, control_id);
	dsControl.Field("node_action_id").Value = txtActionID;
	dsControl.Field("node_step_id").Value = stepId;
	dsControl.Field("djsn").Value = djsn;
	dsControl.Field("cn_name").Value = valArr[0];
	dsControl.Field("control_type").Value = valArr[1];
	dsControl.Field("control_id").Value = control_id;
	dsControl.fset_cont();

}

/**
 * 处理tab的子项
 * @param txtActionID
 * @param stepId
 * @param djsn
 * @param oXml
 * @param control_type
 * @param doc
 * @param control_id
 */
function putTabItemValue(txtActionID, stepId, djsn, oXml, control_type, doc,
		control_id) {
	var tabDoc = doc.getElementById(control_id);
	var tabRows = getElementsByClassNameAndTag(tabDoc, "tr", "tab-row");
	if (tabRows.length > 0) {
		var tabRow = tabRows[0];
		var tds = tabRow.getElementsByTagName("td");
		for ( var i = 0; i < tds.length; i++) {
			//var tabItemName=tds[i].innerText;
			//alert(tabItemName)
			checkAddRow(txtActionID, stepId, djsn, oXml, "tabItem", "item_"
					+ control_id + "_" + i, tds[i])

		}

	}

}

/**
 * 获取class元素
 * @param doc
 * @param tagName
 * @param className
 * @returns {Array}
 */
function getElementsByClassNameAndTag(doc, tagName, className) {
	var classElements = [], allElements = doc.getElementsByTagName(tagName);
	for ( var i = 0; i < allElements.length; i++) {
		if (allElements[i].className == className) {
			classElements[classElements.length] = allElements[i];
		}
	}
	return classElements;
}

/**
 * 
 * 取得子页面表单document
 * 
 */
function getChildFrameDoc() {

	//var doc=window.top.document.getElementById('topic').contentWindow.document.getElementById('topic').contentWindow.document.getElementById('divfrom').getElementsByTagName('iframe')[0].contentWindow.document;
	var doc = window.top.document.getElementById('topic').contentWindow.document
			.getElementById('divfrom').getElementsByTagName('iframe')[0].contentWindow.document;

	return doc;
}

/**
 * 
 * 进行子页面表单加载
 * 
 */
function putChildFrameDoc(getsrc) {

	//getsrc="/form/fceform/meeting/meetingReserveAdd.dj";
	var sFrame = '<iframe charset="utf-8" id="getChildFormId" name="getChildFormId" src="'
			+ getsrc
			+ '" style="" border=0  bordercolor=LightGrey marginwidth=1 noresize></iframe>';
	$id("divfrom").innerHTML = sFrame;
	var ifs = window.top.document.getElementById('topic').contentWindow.document
			.getElementById('divfrom').getElementsByTagName('iframe')[0];
	ifs.onreadystatechange = function() {
		if (ifs.readyState == "complete") {

			showFormInfoList()

		}
	};
}

function getDocElement() {

	var doc = window.top.document.getElementById('topic').contentWindow.document
			.getElementById('topic').contentWindow.document.getElementById(
			'divfrom').getElementsByTagName('iframe')[0].contentWindow.document;

	var lab = doc.getElementById('label1').innerText;

	var inn = doc.getElementById('text1').getAttribute('china');
	var bu = doc.getElementById('button1').innerText;
	alert(bu)

}

function getFrameWin(wins) {
	var f = wins;
	var win = f.contentWindow || f.contentDocument;

	return win;
}

function getFrameDoc(wins) {
	var win = getFrameWin(wins);
	return win.contentDocument || win.document;
}
