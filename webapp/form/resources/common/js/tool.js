/**
 * Author: 邹志强
 * Date: 2013-5-13 -上午10:53
 */

var needLoadDataList = [];      //页面中需要加载datastore中数据的控件列表      [控件ID,datasetID,字段名,是否需要加数据,控件类型]
var hasLoadedCtrlNum=0;
var datastoreList = [];         //页面中datastore的数量
var asyncList = [];             //页面中控件加了 进入时异步加载 选项时，一起加载
var attachTable = 'FC_ATTACH';    //附件保存的表名
var deleteAttachList = [];        //要删删除的附件
var authInfo = [];                //页面权限信息   对象属性：{"controltype":"","disabled":"","display":"","fieldname":"","id":"","readonly":""}
var gridInfo = [];                //全局变量 -- 存储grid的 ColumnIds      [['grid的id','绑定的dataset名',[grid每列的id,grid每列的id]]]
var fieldsTransInfo=[];   //存储数据集的字段转换信息   [[dataset的id,字段名,保存时的转换方法,读出时的转换方法]]
var fieldsValidInfo=[];   //存储数据集的字段验证信息   [[dataset的id,字段名,验证的方法]]
var fieldsDateTypeInfo=[];   //存储数据集字段类型是日期或时间信息     [[dataset的id,字段名,日期或时间类型]]  2015-8-10 add  
var fieldsIsNull=[];      //存储数据集的字段是否可以为空信息   [[dataset的id,字段名]]
var dsDefaultVal=[];     //存储数据集中  哪些字段有默认值  [[字段名,默认值,默认的方法]]
var dsFieldInfo=[];  //[ {dsId:xxx,fieldname:[bz,name],displaylabel:['备注','姓名']} ]
var wfHistoryListNodeInfo=[]; //流程历史记录中各节点的信息
var uploadDownloadPath="/form/form";
var staticValue={};
if (typeof Eapi === 'undefined') {
	var Eapi = {}; //IE get 页面时，会报错
	Eapi.SaveForm = {};
	Eapi.SaveForm.registerClass = function () {};
}
var _gridAddId=[];     //存储 grid新增的行的ID      [绑定的datastore的 id，id]
var _gridDelId=[];     //存储 grid删除的行的ID      [绑定的datastore的 id，id ,删除的Item]
/**
 * 得到浏览器地址栏中带的参数；
 * 用法：  QueryURL.GetValue('key');
 * @type {Object}
 */
QueryURL = {
	data    :{},
	Initial :function () {
		var aPairs, aTmp;
		var queryString = window.location.search;
		queryString = queryString.substr(1, queryString.length); //remove   "?"
		aPairs = queryString.split("&");
		for (var i = 0; i < aPairs.length; i++) {
			var pos= aPairs[i].indexOf('=');
			aTmp=['',''];
			//aTmp = aPairs[i].split("=");
			aTmp[0]=aPairs[i].substr(0,pos);
			aTmp[1]=aPairs[i].substr(pos+1);
			this.data[aTmp[0]] = aTmp[1];
		}
	},
	GetValue:function (key) {
		return this.data[key];
	}
};
QueryURL.Initial();

/**
 * 把 undefined 转换为 ''
 * @param str
 * @return {*}
 */
function undToSp(str) {
	if (str === 'undefined' || str === undefined || str === null) {
		str = '';
	}
	return str;
}
/**
 * 传入xml string字符串，返回XMLDocument对象
 * @param xmlStr
 * @return {*}
 */
function newXml(xmlStr) {
	xmlStr=undToSp(xmlStr);
	var xmlDoc = null;
	if(typeof DOMParser != "undefined"){
		xmlDoc = new DOMParser().parseFromString(xmlStr, "application/xml");
	}else {
		xmlDoc = new ActiveXObject("MSXML2.DOMDocument");
		xmlDoc.async = "false";
		xmlDoc.loadXML(xmlStr);
	}
	return xmlDoc;
}

/**
 * 处理控件上的事件
 * @param obj
 */
function parseEvent(obj) {
	var eventType = ['onclick', 'ondblclick', 'onchange', 'onfocus', 'onblur', 'onkeydown'];
	for (var i = 0; i < eventType.length; i++) {
		var type = eventType[i];
		var func = obj.attr(type);
		if (func) {
			if (func.match(/bill_on\w+?\("/g)) {
				func = func.replace(/bill_on\w+?\("/g, '');
				func = func.substring(0, func.length - 2);
				var event = eventType[i].substr(2);
				obj.attr(type, '');
				obj.removeAttr(type);
				obj.data(event, func);
				obj.bind(event, function (e) {
					eval($(this).data(e.type));
				});
			}
		}
	}
}

/**
 * 提取出字符中的saveTable  hxt add
 * @param saveTable
 * @returns
 */
function parseSaveTable(s) {

	var stable=decodeSql(s);
	var reg=/\<fcsavetable[^>]*\>([^<]*)\<\/fcsavetable\>/;
	var tableParam = stable.match(reg);
	
	if(tableParam)
	{
		return tableParam[1];
	}
	
	return s;
}

/**
 * sql解码
 * @param s1
 * @return {String}
 */
function decodeSql(s1) {
	var s = $.trim(s1);
	s = unescape(s);
	if(s.indexOf("<fcsql")==-1) //没有转换过
	{
	    var sRet = "";
		var l = s.length;
		for (var i = 0; i < l; i++) {
			var c = (s.charCodeAt(i) / 2) - 7;
			sRet += String.fromCharCode(c);
		}
		sRet = unescape(sRet);
		return sRet;
	}
	return s;
}

/**
 * 处理sql中带有 :{***("***")}: 的字段
 * @param sqlText
 * @return {String}
 */
function parseSql(sqlText) {
	var sql = decodeSql(sqlText);
	sql=sql.replace(/[\n\r]/g,' ');
	var regs = /:\{([^\{:,]+?)\}:/g;
	var regLeftRight = /[:\{\}]/g;
	var sqlParam = sql.match(regs);
	if (sqlParam !== null) {
		sql = sql.replace(regs, function () {
			return eval(arguments[1]);
		});
	}
//	sql=unescape(sql)
	return sql;
}

/**
 * 处理 Label 控件中的属性
 * @param id
 */
function parseLabel(id) {
	var label = $('#' + id);
	var dataset = label.attr('dataset');
	var field = label.attr('field');
	var isTag=label.attr('inputTag');
	if(isTag==="是"){
		var labelText=label.text();
		label.html(labelText+'<strong style="color: #f00; padding-left: 3px;">*</strong>');
	}
	parseEvent(label);
	if (dataset) {
		needLoadDataList.push([id, dataset, field, true, 'label']);     //[控件ID,datasetID,字段名,是否需要加数据]
	}
}

/**
 * 处理 text 控件中的属性
 * @param id
 */
function parseText(id) {
	var text = $('#' + id);
	var dataset = text.attr('dataset');
	var field = text.attr('field');
	var height = text.height();
	var width = text.width();
	text.height(height - 4);
	text.width(width - 5);
	parseEvent(text);
	if (dataset) {
		needLoadDataList.push([id, dataset, field, true, 'text']);     //[控件ID,datasetID,字段名,是否需要加数据]
	}
}

/**
 * 处理 Textarea 控件中的属性
 * @param id
 */
function parseTextarea(id) {
	var textarea = $('#' + id);
	var dataset = textarea.attr('dataset');
	var field = textarea.attr('field');
	parseEvent(textarea);
	if (dataset) {
		needLoadDataList.push([id, dataset, field, true, 'textarea']);     //[控件ID,datasetID,字段名,是否需要加数据]
	}
}

/**
 * 处理img控件中的属性
 * @param id
 */
function parseImg(id) {
	var img = $('#' + id);
	parseEvent(img);
}

/**
 * 处理Radio控件中的属性
 * @param id
 */
function parseRadio(id) {
	var radio = $('#' + id);
	var dataset = radio.attr('dataset');
	var field = radio.attr('field');
	var legend=radio.find('legend').text();
	if(undToSp(legend)==''){
		radio.attr('legend','&nbsp;');
		radio.find('legend').html('&nbsp;');
	}
	var inputs = radio.find('input').length;
	for (var i = 0; i < inputs; i++) {                //给span加上label
		var span = radio.find('span').eq(i);
		radio.find('input').eq(i).attr('onclick', '');
		var text = span.html();
		span.html('<label for="RG' + id + (i + 1) + '">' + text + '</label>');
	}
	if (dataset) {
		needLoadDataList.push([id, dataset, field, true, 'radio']);     //[控件ID,datasetID,字段名,是否需要加数据]
	}
}

/**
 * 处理Checkbox控件中的属性
 * @param id
 */
function parseCheckbox(id) {
	var checkbox = $('#' + id);
	var dataset = checkbox.attr('dataset');
	var field = checkbox.attr('field');
	var span = checkbox.find('span').eq(0);
	checkbox.find('input').attr('id', 'ch_' + id);
	span.html('<label for="ch_' + id + '">' + span.html() + '</label>');
	if (dataset) {
		needLoadDataList.push([id, dataset, field, true, 'checkbox']);     //[控件ID,datasetID,字段名,是否需要加数据]
	}
}

/**
 * 处理 ListBox 控件中的属性
 * @param id
 */
function parseListBox(id) {
	var listBox = $('#' + id);
	var dataset = undToSp(listBox.attr('dataset'));
	var field = undToSp(listBox.attr('field'));
	var sqltrans = undToSp(listBox.attr('sqltrans'));
	var async = listBox[0].getAttribute('async');
	//sqltrans = decodeSql(sqltrans);
	sqltrans = parseSql(sqltrans);  //hxt add 
	
	if (dataset) {
		needLoadDataList.push([id, dataset, field, true, 'listBox']);     //[控件ID,datasetID,字段名,是否需要加数据]
	}
	if (async === '是') {
		asyncList.push([id, 'listBox', sqltrans]);                //[控件ID,类型,sql]
		return;
	}
	if (sqltrans.length > 2) {
		var xml = '<root><sql>' + sqltrans + '</sql></root>';
		$.ajax({
			type       :"POST",
			url        :project+"/servlet/WebBill?key=fillcombox",
			processData:false,
			data       :xml,
			contentType:'utf-8',
			success    :function (msg) {
				if (msg.match('errInfo') !== null) {
                    layer.msg(msg);
				} else {
					listBox.append(msg);
				}
			}
		});
	}
}

/**
 * 处理CheckboxList控件中的属性
 * @param id
 */
function parseCheckboxList(id) {
	var checkboxList = $('#' + id);
	var dataset = checkboxList.attr('dataset');
	var sqltrans = checkboxList.attr('sqltrans');
	//sqltrans = decodeSql(sqltrans);
	sqltrans = parseSql(sqltrans);  //hxt add
	
	var field = checkboxList.attr('field');
	var rows = checkboxList.attr('rows');        //列数
	if (!rows) rows = 1;
	var tempvalue = checkboxList.attr('tempvalue');
	var temptext = checkboxList.attr('temptext');
	var async = checkboxList[0].getAttribute('async');

	checkboxList.addClass('checkboxList');
	checkboxList.empty().append('<ul class="checkboxListUl"></ul>');
	tempvalue = tempvalue.replace(/\r\n/g, ',');
	temptext = temptext.replace(/\r\n/g, ',');
	checkboxList.attr({'tempvalue':tempvalue, 'temptext':temptext});
	tempvalue = tempvalue.split(',');
	temptext = temptext.split(',');

	if (tempvalue != '') {
		//标准格式
		_parseCheckboxList(id, temptext, tempvalue);
	}

	if (async == '是') {
		asyncList.push([id, 'checkboxList', sqltrans]);                //[控件ID,类型,sql]
		return;
	}
	
	
	if (dataset) {
			needLoadDataList.push([id, dataset, field, true, 'checkBoxlist']);     //[控件ID,datasetID,字段名,是否需要加数据]
	}
		
	if (sqltrans != '') {
		//包含sql
		var xml = '<root><sql>' + sqltrans + '</sql><pageno>1</pageno><pagesize>-1</pagesize></root>';
		$.ajax({
			type       :"POST",
			url        :project+"/servlet/WebBill?key=fc_select",
			processData:false,
			data       :xml,
			contentType:'utf-8',
			success    :function (msg) {
				if (msg.match('errInfo') != null) {
                    layer.msg(msg);
				} else {
					var res = newXml(msg);
					var tempvalue = '';
					var temptext = '';
					var text = [];
					var value = [];
					$(res).find('record').each(function () {
						var tValue = $(this).children().eq(0).text();
						var tText = $(this).children().eq(1).text();
						tempvalue += ',' + tValue;
						temptext += ',' + tText;
						text.push(tText);
						value.push(tValue);
					});
					checkboxList.attr({'tempvalue':tempvalue, 'temptext':temptext});       //更新控件上的属性，赋值、取值时会用到
					_parseCheckboxList(id, text, value);
				}
			}
		});
	}

}

/**
 * 添加 CheckboxList 的 text和value
 * @param id
 * @param text
 * @param value
 * @private
 */
function _parseCheckboxList(id, text, value) {
	var obj = $('#' + id);
	var rows = obj.attr('rows');        //列数
	if (!rows) rows = 1;
	if (text.length != value.length) {
        layer.msg('显示 与 取值 数量未一一对应！')
	} else {
		var lis = '';
		var liWidth = (90 / rows) + '%';
		var startNum = obj.find('ul>li').length;
		for (var i = 0; i < text.length; i++) {
			var textI = text[i];
			var valueI = value[i];
			var nowNum = startNum + i;
			lis += '<li style="width:' + liWidth + '"><label><input type="checkbox" name="' + id + nowNum + '" id="' + id + nowNum + '" value="' + valueI + '" text="' + textI + '">' + textI + '</label></li>';
		}
		obj.children('ul').append(lis);
	}
}

/**
 * 处理 RadioList 控件中的属性
 * @param id
 */
function parseRadioList(id) {
	var radioList = $('#' + id);
	var dataset = radioList.attr('dataset');
	var sqltrans = radioList.attr('sqltrans');
	//sqltrans = decodeSql(sqltrans);
	sqltrans = parseSql(sqltrans);
	
	var field = radioList.attr('field');
	var rows = radioList.attr('rows');        //列数
	if (!rows) rows = 1;
	var tempvalue = radioList.attr('tempvalue');
	var temptext = radioList.attr('temptext');
	var async = radioList[0].getAttribute('async');
	radioList.addClass('radioList')
	radioList.empty().append('<ul class="radioListUl"></ul>');

	tempvalue = tempvalue.replace(/\r\n/g, ',');
	temptext = temptext.replace(/\r\n/g, ',');
	radioList.attr({'tempvalue':tempvalue, 'temptext':temptext});
	tempvalue = tempvalue.split(',');
	temptext = temptext.split(',');


	if (tempvalue != '') {
		//标准格式
		_parseRadioList(id, temptext, tempvalue);
	}
	if (async == '是') {
		asyncList.push([id, 'radioList', sqltrans]);                //[控件ID,类型,sql]
		return;
	}
	if (sqltrans != '') {
		//包含sql
		var xml = '<root><sql>' + sqltrans + '</sql><pageno>1</pageno><pagesize>-1</pagesize></root>';
		$.ajax({
			type       :"POST",
			url        :project+"/servlet/WebBill?key=fc_select",
			processData:false,
			data       :xml,
			contentType:'utf-8',
			success    :function (msg) {
				if (msg.match('errInfo') != null) {
                    layer.msg(msg);
				} else {
					var res = newXml(msg);
					var tempvalue = '';
					var temptext = '';
					var text = [];
					var value = [];
					$(res).find('record').each(function () {
						var tValue = $(this).children().eq(0).text();
						var tText = $(this).children().eq(1).text();
						tempvalue += ',' + tValue;
						temptext += ',' + tText;
						text.push(tText);
						value.push(tValue);
					});
					radioList.attr({'tempvalue':tempvalue, 'temptext':temptext});       //更新控件上的属性，赋值、取值时会用到
					_parseRadioList(id, text, value);
				}
			}
		});
	}
}

/**
 *  添加 RadioList 的 text和value
 * @param id
 * @param text
 * @param value
 * @private
 */
function _parseRadioList(id, text, value) {
	var radioList = $('#' + id);
	var rows = radioList.attr('rows');        //列数
	if (!rows) rows = 1;
	if (text.length != value.length) {
        layer.msg('显示 与 取值 数量未一一对应！')
	} else {
		var lis = '';
		var liWidth = (90 / rows) + '%';
		var startNum = radioList.find('ul>li').length;
		for (var i = 0; i < text.length; i++) {
			var textI = text[i];
			var valueI = value[i];
			var nowNum = startNum + i;
			lis += '<li style="width:' + liWidth + '"><label><input type="radio" name="' + id + '" id="' + id + nowNum + '" value="' + valueI + '" text="' + textI + '">' + textI + '</label></li>';
		}
		radioList.children('ul').append(lis);

	}
}

/**
 * 处理Button控件中的属性
 * @param id
 */
function parseButton(id) {
	var button = $('#' + id);
	var field = button.attr('field');
	parseEvent(button);
}

/**
 * 处理 dropDownList/select 控件中的属性
 * @param id
 */
function parseSelect(id) {
	
	var select = $('#' + id);
	
	if (id == 'wf_free_select') {      //如果是 工作流 自由流 的选中栏
		var wfId = QueryURL.GetValue('wfId');
		var wfName = QueryURL.GetValue('wfName');
		var wfVersion = QueryURL.GetValue('wfVersion');
		var position = undToSp(select.attr('position'));
		var top = select.attr('top');
		var left = select.attr('left');
		var width = select.attr('width');
		var height = select.attr('height');
		
		$.ajax({
			type       :"POST",
			url        :project+"/servlet/WorkflowPortal?operate=get_wffree_list&wf_id=" + wfId + "&wf_name=" + wfName + "&wf_version=" + wfVersion,
			processData:false,
			//async      :false,
			data       :"<root></root>",
			contentType:'utf-8',
			success    :function (response) {
				
				var res = newXml(response);
				if (response.match('<n>false</n>')) {
					$(res).find('message').each(function () {
						var s = $(this).text();
                        layer.msg(s)
					});
				}
				var showList = [];
				var valList = [];
				$(res).find('next').each(function () {
					var s = $(this).attr('name');
					var v = $(this).attr('id');
					showList.push('跳转到：' + s);
					valList.push(v);
				});
				$(res).find('last').each(function () {
					var s = $(this).attr('name');
					var v = $(this).attr('id');
					showList.push('回退到到：' + s);
					valList.push(v);
				});
				var html = '<select style="position:' + position + '; width: ' + width + 'px;height: ' + height + 'px;left:' + left + 'px;top: ' + top + 'px;" name="sel_' + id + '" id="sel_' + id + '">';
				html += '<option>请选择自由流</option>';
				for (var i = 0; i < showList.length; i++) {
					var sl = showList[i];
					var vl = valList[i];
					html += '<option value="' + vl + '">' + sl + '</option>';
				}
				html += '</select>';
				select.after(html);
			
			}
		})
		return;
	}
	var staticVal = undToSp(select.attr('xml'));             //标准格式 显示 和  取值      静态数据
	var dataset = undToSp(select.attr('dataset'));
	var field = select.attr('field');
	var top = select.attr('top');
	var left = select.attr('left');
	var width = select.attr('width');
	var height = select.attr('height');
	var sqltrans = undToSp(select.attr('sqltrans'));
	var isShowTree = undToSp(select.attr('isShowTree'));
	var position = undToSp(select.attr('position'));
	var enabled= undToSp(select.attr('enabled'));
	var visible=undToSp(select.attr('visible'));
	var onchange = undToSp(select.attr('onchange'));                    //select change 事件
	onchange = onchange.replace(/bill_on\w+?\("/g, '');
	onchange = onchange.replace(/\\42/g, "'");
	onchange = onchange.replace(/this/g, "$('#" + id + "')[0]");         //支持 this 关键字
	onchange = onchange.substring(0, onchange.length - 2);
	//sqltrans = decodeSql(sqltrans);
	sqltrans = parseSql(sqltrans);  //hxt add 
	if (dataset) {
		needLoadDataList.push([id, dataset, field, true, 'select']);     //[控件ID,datasetID,字段名,是否需要加数据]
	}
	if (isShowTree == 1) {
		var parameter = '<root><root key="sqltotreedataJson" ><sql>' + sqltrans + '</sql></root></root>';
		var rootNodeId=undToSp(select.attr('rootNodeId'));
		if(rootNodeId==''){
            layer.msg('下拉树的根节点ID未指定！')
		}
		var treeHtml = '<div id="esBG_' + id + '" class="e_select_bg"></div><div id="sel_' + id + '" style="position: ' + position + '; width: ' + width + 'px;height: ' + height + 'px;left:' + left + 'px;top: ' + top + 'px;" class="e_select">' +
			'<div id="selTxt_' + id + '" style="height: ' + height + 'px; line-height: ' + height + 'px;width: ' + (parseInt(width) - 30) + 'px;" class="fn-left select_txt"></div>' +
			'<div id="sel_btn_' + id + '" class="fn-right select_bg"></div>' +
			'<div style="width: ' + width + 'px; height: 200px;top:' + height + 'px;" id="selTree_' + id + '" class="tree_wrap">' +
			'</div></div>';             //tree style 的select
		select.after(treeHtml);
		
		
		
		if(enabled=='true') $('#sel_btn_' + id).prop('disabled',true);
		if(visible=='否') $('#sel_' + id).hide();
		$('#sel_btn_' + id).click(function () {         //下拉按钮 事件
			var isDisable=$(this).prop('disabled');
			if(isDisable) return;
			$('#selTree_' + id).toggle();
			$('#esBG_' + id).toggle();
		});
		$('#esBG_' + id).click(function () {           //遮罩点击 隐藏下拉框
			$(this).hide();
			$('#selTree_' + id).hide();
		})
		window['selTree_' + id] = new dhtmlXTreeObject('selTree_' + id, "100%", "100%", rootNodeId);
		window['selTree_' + id].setImagePath(dhtmlxBase + "/imgs/csh_dhx_terrace/");
//		window['selTree_' + id].attachEvent('onDblClick', function (sid) {
//			var val = window['selTree_' + id].getItemText(sid);
//			$('#selTxt_' + id).text(val);
//			$('#selTree_' + id).hide();
//			$('#esBG_' + id).hide();
//		});
		window['selTree_' + id].attachEvent('onClick', function (sid) {
			var val = window['selTree_' + id].getItemText(sid);
			$('#selTree_' + id).hide();
			$('#esBG_' + id).hide();
			$('#selTxt_' + id).text(val);
			eval(onchange)
		});
		$.ajax({
			type       :"POST",
			url        :project+"/servlet/WebBill?key=loadingBatchAction",
			processData:false,
			data       :parameter,
			contentType:'utf-8',
			success    :function (msg) {
				msg = msg.replace(/<root>/g, '');
				msg = msg.replace(/<\/root>/g, '');
				try{
					var json = eval('(' + msg + ')');
					window['selTree_' + id].loadJSONObject(json, function () {
						var rootId = window['selTree_' + id].getSubItems(rootNodeId);
						rootId=rootId.split(',');
						window['selTree_' + id].openItem(rootId[0]);
					});
				}catch (e){
					msg='控件SQL语句错误！<br>控件id：'+id+'；<br>错误信息：'+msg;
					layer.msg(msg);
					
				}


			}
		});
		return;
	}
	if (staticVal.length > 1) {                            //有静态数据时
		var showList = [];
		var valList = [];
		staticVal = '<table>' + staticVal + '</table>'
		$(staticVal).find('tr').each(function () {
			showList.push($(this).children('td').eq(0).text());
			valList.push($(this).children('td').eq(1).text());
		})
		if (showList.length !== valList.length) {
			
			layer.msg('“显示”与“取值”数量不对应！');
		} else {
			var html = '<select style="position:' + position + '; width: ' + width + 'px;height: ' + height + 'px;left:' + left + 'px;top: ' + top + 'px;" name="sel_' + id + '" id="sel_' + id + '">';
			
			for (var i = 0; i < showList.length; i++) {
				var sl = showList[i];
				var vl = valList[i];
				
				//办理单下拉选择，去除默认的去除选择办理单选项			
				if(vl!=(-1)){				
					html += '<option value="' + vl + '">' + sl + '</option>';
				}
				
						
			}
			html += '</select>';
			select.after(html);
		}
	}

	if (sqltrans.length > 1) {                           //有sql时

		//asyncList.push([id, 'select', sqltrans]);                //[控件ID,类型,sql]
		//return;
		var sendXml = '<root><percolnum>1</percolnum><sql>' + sqltrans + '</sql><strValue></strValue><perpagerownum>50</perpagerownum><showcheckbox>false</showcheckbox><blnempty>否</blnempty><addrow>否</addrow></root>';
		
		$.ajax({
			type       :"POST",
			url        :project+"/servlet/WebBill?key=sqltoxml",
			processData:false,
			//async      :false,
			data       :sendXml,
			contentType:'utf-8',
			success    :function (response) {
				if (response.match('errInfo') != null) {
                    layer.msg(response);
				} else {
					var res = newXml(response);
					var showList = [];
					var valList = [];
					$(res).find('tr').each(function () {
						var s = $.trim($(this).children('td').eq(0).text());
						var v = $.trim($(this).children('td').eq(1).text());
						showList.push(s);
						valList.push(v);
					});

					if (showList.length !== valList.length) {
                        layer.msg('返回的数据，“显示”与“取值”数量不对应！');
					} else {
						if ($('#sel_' + id).length == 1) {        //已经存在select
							var html = '';
							for (var i = 0; i < showList.length; i++) {
								var sl = showList[i];
								var vl = valList[i];
								if (vl == '')  vl = 'null';
								html += '<option value="' + vl + '">' + sl + '</option>';
							}
							$('#sel_' + id).append(html);
						} else {                              // 新增select
							var html = '<select style="position:'+position+'; width: ' + width + 'px;height: ' + height + 'px;left:' + left + 'px;top: ' + top + 'px;" name="sel_' + id + '" id="sel_' + id + '">';
							for (var i = 0; i < showList.length; i++) {
								var sl = showList[i];
								var vl = valList[i];
								html += '<option value="' + vl + '">' + sl + '</option>';
							}
							html += '</select>';
							select.after(html);
							if(enabled=='true') $('#sel_' + id).prop('disabled',true);
							if(visible=='否') $('#sel_' + id).hide();
							$('#sel_' + id).change(function () {
								eval(onchange);
							})
						}
					}
				}


			}
		})
	}
	if(enabled=='true') $('#sel_' + id).prop('disabled',true);
	if(visible=='否') $('#sel_' + id).hide();
	$('#sel_' + id).change(function () {
		eval(onchange);
	})

	
	
}

/**
 * 处理 Tab 控件中的属性
 * @param id
 */
function parseTab(id) {

    var classShow="adviceSHow";

    var djsn=$urlParam("djsn");
    var wfName=$urlParam("wfName");
    if(djsn=="oa_pg_incoming_form"){
        classShow="adviceSHow";
    }
    if(djsn=="oa_leader_instruction_form"&&wfName=="oa_leader_instruction_fb"){
        classShow="adviceSHow";
    }


	var tab = $('#' + id);

	var tab_height=tab.height();
	var tab_width=tab.width();
	tab.children('.tab-page').width(tab_width-2).height(tab_height-27);
	var header_text = [];
	tab.children('.tab-page').children('.tab').each(function () {
	
		var text = $(this).text();
		header_text.push(text);
	})
	var header = '<div class="tab_header"><ul>';
	for (var i = 0; i < header_text.length; i++) {
		
		var text = header_text[i];		
		
	
	 if(text=="便签"){

         //收文流程不使用便签

         if(djsn!="oa_pg_incoming_form"){

			header += '<li class="oa-form-note-header"  index="' + i + '">' + text + '<i class="js-notes-tab-numbers" style="display:none;">&nbsp;</i></li>';

         }

		}
	
		else if(text=="基本信息"||text=="意见"){
			header += '<li style="display:none;"  index="' + i + '">' + text + '</li>';
		}
		else{
			header += '<li index="' + i + '">' + text + '</li>';
		}
		
		
	}

	header += '</ul></div>';



	tab.prepend(header);


	tab.children('.tab_header').find('li').click(function () {
		var $this = $(this);
		var index = $this.attr('index'),
            $status=$this.data("status");



		$this.addClass('on').siblings('li').removeClass('on');



		//$this.addClass('on');
		tab.children('.on').removeClass('on');
		tab.find('.tab-page').eq(index).addClass('on');


		if($this.text()=="正文"){
			 
				 window.top.document.getElementById('filePageId').contentWindow.location.reload();
				 
			
		}

        ////正文
        //if(index=="1"&&$status=="0"){
        //
        //     //  loadAttachmentPage('attachmentdiv');
        //       $this.data("status",1);
        //}
        ////流程记录
        //else if(index=="2"&&$status=="0"){
        //  //  loadRecordPage('recorddiv');
        //    $this.data("status",1);
        //}
        ////便签
        //else if(index=="4"&&$status=="0"){
        //
        //  //  loadDroplistDataAndNotePage('notediv');
        //
        //    $this.data("status",1);
        //
        //}

	});


	tab.children('.tab_header').find('li').eq(0).click();



//	parseEvent(tab);
}

/**
 * 处理 Page 控件中的属性
 * @param id
 */
function parsePage(id) {
	var page = $('#' + id);
	var header_text = [];
	page.find('.tab').each(function () {
		var text = $(this).text();
		header_text.push(text);
	})
	var header = '<div class="tab_header"><ul>';
	for (var i = 0; i < header_text.length; i++) {
		var text = header_text[i];
		if (i == 0) {
			header += '<li class="on" index="' + i + '">' + text + '</li>';
		} else {
			header += '<li index="' + i + '">' + text + '</li>';
		}
	}
	header += '</ul></div>';
	page.prepend(header);
	page.children('.tab_header').find('li').click(function () {
		var $this = $(this);
		var index = $this.attr('index');
		var iframeArea = page.find('.tab-page').eq(index);
		var src = iframeArea.find('iframe').attr('srcbak');
		$this.siblings('li').removeClass('on');
		$this.addClass('on');
		page.children('.on').removeClass('on');
		iframeArea.addClass('on');
		if(!iframeArea.find('iframe').attr('src'))
			iframeArea.find('iframe').attr('src', src);
	});
	page.find('.tab-page').eq(0).addClass('on');
//	parseEvent(page);
}

/**
 * 处理 upload 控件中的属性
 * @param id
 */
function parseUpload(id) {
	
	
	var upload = $('#' + id);
	var dataset = upload.attr('dataset');
	var setpath = upload.attr('setpath');
	var extfiles = upload.attr('extfiles');
	if(undToSp(extfiles)==''){extfiles='*'}
	var isReadOnly=upload.attr('isReadOnly');
	var btnClass=''; 
	extfiles = extfiles.replace('|', ',');
	if (dataset) {
		needLoadDataList.push([id, dataset, 'upload', true, 'upload']);
	}
	var html='<p><a id="'+id+'_pick" class="eUpload_pick_btn" href="javascript:void(0)">[添加附件]</a></p><p class="eUpload_fileAdded" id="'+id+'_upload_list"></p>';
	

	upload.append(html);
	
	upload.css("overflow", 'hidden');
	if(isReadOnly=='是'){
		upload.addClass('readonly');
		return;
	}
	$.getScript(project + "/form/resources/common/plupload/plupload.full.js", function () {		
			newUploader = new plupload.Uploader({ //实例化一个plupload上传对象
			runtimes : 'html5,silverlight,flash,html4',
			browse_button : id+'_pick',
			url : project+"/servlet/uploadServlet",
			max_file_size:setpath,
			unique_names :true,
			filters:[
				{title : "允许上传的文件", extensions : extfiles}
			],
			flash_swf_url : projectName+'/form/resources/common/plupload/plupload.flash.swf'
			});
			newUploader.init(); //初始化
			newUploader.bind('FilesAdded',function(uploader,files){//绑定文件添加进队列事件
					newUploader.start(); //开始上传
					for (var i = 0, l = files.length; i < l; i++) {
						//console.log(_eUploader.getFile(files[i].id));
						var newId=files[i].id;
						var data = {id:(new Date().getTime() + i), name:files[i].name,size:files[i].size, remark:'', path:''};
						addAttach(id,data,newId,uploader);
						$('.'+newId).find('.progress').css('z-index',function(){
							return 10;
						});
					}
			});
			
			newUploader.bind('UploadProgress',function(uploader,file){//绑定文件上传进度事件
				$('.'+file.id).find('.progress').find('.percent-bg').css('width',function(){
					return file.percent+"%";	
				}).html(file.percent+"%");
			});
			
			newUploader.bind('UploadComplete',function(uploader,files){//附件上传完毕后
				$('#'+id+'_upload_list').find('.progress').remove();
			});
			
			newUploader.bind('Error', function(up, err) {//上传失败
				$('.'+err.file.id).remove();
                layer.msg(""+err.file.name+"上传失败，请重新上传", 3);
				up.refresh();
			});

	});

}


/**
 * 添加附件
 * @param id     upload控件的id
 * @param data   Object {id: "***", name: "***.jpg", size: *** , remark: "", path: ""}
 * @param type   "temp"为还未保存的附件
 */

function addAttachTable(id,data,newId,obj){
	var upload=$('#'+id);
	var attachHtml=$('<span class='+newId+' id="'+data.id+'" dsId="'+data.dsId+'" table="'+data.table+'" attach_size="'+data.size+'"><a class="download_attach" href="'+encodeURI(data.path)+'">'+data.name+'</a><a class="del_attach" title="删除附件">删除</a>'+
	'<a class="attach-more" href="javascript:void(0)">更多</a><div class="upload-opert-list"><ul><li><a href="javascript:void(0)">下载</a></li><li><a href="javascript:void(0)">预览</a></li></ul></div>'+
	'<div class="progress"><div class="percent-bg"></div></div></span>');
	if(upload.hasClass('readonly')== false){
		$(attachHtml).find('.del_attach').click(function(){
			var href=$(this).prev('a').attr('href');//找寻前一个的a
			if(href==""){
				delAttach(id,data,'temp');
			}else{
				delAttach(id,data,'');
			}
		});
	}

	$(attachHtml).find('.attach-more').bind('click',function(event){
		var href=$(this).prev('a').prev('a').attr('href');
		if(href==""){
		
			layer.msg("请先保存！");
			return;
		}
		$('.eUpload_fileAdded .upload-opert-list').hide();
		event.stopPropagation();
		event.cancelBubble = true;
		$(this).next('.upload-opert-list').toggle()
	});

	$('body').bind('click',function(){
		$(attachHtml).find('.upload-opert-list').hide();
	});

	$(attachHtml).find(".upload-opert-list ul li a").bind('click',function(){
		var text = $(this).html();
		if(text == "下载") {
			$(attachHtml).find('.download_attach').click();
		}else if( text == "预览"){
			var url = projectName + "/admin/attachmentInfo/preview.action?id=" + data.id + "&etc=" + new Date().getTime();
			try{
				window.top.createWindow(
						{   id      :'attachmentPreview',
							text    :"预览",
							url     :url,
							width   :'680',
							height  :'580'
						}
				);
			}catch (e){
				window.open(url);
			}
		}

	});

	$(attachHtml).find('.download_attach').click(function(e){
		var href=$(this).attr('href');
		if(href==""){
		
			layer.msg("请先保存再下载！");
		}else{
			window.location.href=href;
		}
		e.returnValue=false;
		return false;
	});
	upload.find('#'+id+'_upload_list').append(attachHtml);

	var getParentWidth = $('#'+id+'_upload_list').parent().width();//父框的总大小
	var getLength = $('.eUpload_fileAdded').children('span').length;//附件的个数
	if(getLength!=0){
		var listWidth = $('.eUpload_fileAdded').children('span').eq(0).outerWidth(true);
		var getWrap = Math.floor(getParentWidth/listWidth);//总共可以放几个
		if(getLength%getWrap==0){//说明要放最后一个了
			if(getParentWidth-getWrap*listWidth < 46){
				$(attachHtml).find('.upload-opert-list').css('right','0');
			}
		}
	}

	if($(attachHtml).prevAll().length==0){
		$(attachHtml).css('z-index','999');
	}else{
		$(attachHtml).css('z-index',$(attachHtml).prev().css('z-index')-1);
	}
}

function addAttach(id,data,newId,obj){
	var upload=$('#'+id);	
	var attachHtml=$('<span class='+newId+' id="'+data.id+'" dsId="'+data.dsId+'" table="'+data.table+'" attach_size="'+data.size+'"><a class="download_attach" href="'+encodeURI(data.path)+'">'+data.name+'</a><a class="del_attach" title="删除附件">删除</a>'+
	'<a class="attach-more" href="javascript:void(0)">更多</a><div class="upload-opert-list"><ul><li><a href="javascript:void(0)">下载</a></li><li><a href="javascript:void(0)">预览</a></li></ul></div>'+
	'<div class="progress"><div class="percent-bg"></div></div></span>');
	if(upload.hasClass('readonly')== false){
		$(attachHtml).find('.del_attach').click(function(){
			var href=$(this).prev('a').attr('href');//找寻前一个的a
			if(href==""){
				delAttach(id,data,'temp');
			}else{
				delAttach(id,data,'');
			}
		});
	}

	$(attachHtml).find('.attach-more').bind('click',function(event){
		var href=$(this).prev('a').prev('a').attr('href');
		if(href==""){
			
			layer.msg("请先保存！");
			return;
		}
		$('.eUpload_fileAdded .upload-opert-list').hide();
			event.stopPropagation();
			event.cancelBubble = true;	
		$(this).next('.upload-opert-list').toggle()
	});
	
	$('body').bind('click',function(){
		$(attachHtml).find('.upload-opert-list').hide();
	});

	$(attachHtml).find(".upload-opert-list ul li a").bind('click',function(){
		var text = $(this).html();
		if(text == "下载") {
			$(attachHtml).find('.download_attach').click();
		}else if( text == "预览"){
			var url = projectName + "/admin/attachmentInfo/preview.action?id=" + data.id + "&etc=" + new Date().getTime();
			try{
				window.top.createWindow(
					{   id      :'attachmentPreview',
						text    :"预览",
						url     :url,
						width   :'680',
						height  :'580'
					}
				);
			}catch (e){
				window.open(url);
			}
		}
		
	});
	
	$(attachHtml).find('.download_attach').click(function(e){
		var href=$(this).attr('href');
		if(href==""){	
			layer.msg("请先保存再下载！");
		}else{
			window.location.href=href;
		}
		e.returnValue=false;
		return false;
	});
	upload.find('#'+id+'_upload_list').append(attachHtml);
	
	var getParentWidth = $('#'+id+'_upload_list').parent().width();//父框的总大小
	var getLength = $('.eUpload_fileAdded').children('span').length;//附件的个数
	if(getLength!=0){
		var listWidth = $('.eUpload_fileAdded').children('span').eq(0).outerWidth(true);
		var getWrap = Math.floor(getParentWidth/listWidth);//总共可以放几个		
		if(getLength%getWrap==0){//说明要放最后一个了
			if(getParentWidth-getWrap*listWidth < 46){				
				$(attachHtml).find('.upload-opert-list').css('right','0');	
			}
		}
	}
	
	if($(attachHtml).prevAll().length==0){
		$(attachHtml).css('z-index','999');
	}else{
		$(attachHtml).css('z-index',$(attachHtml).prev().css('z-index')-1);
	}
}
/**
 * 删除附件
 * @param id     upload控件的id
 * @param data   Object {id: "***", name: "***.jpg", size: *** , remark: "", path: ""}
 * @param type   "temp"为还未保存的附件
 */
function delAttach(id,data,type){
	if(type !="temp"){
		deleteAttachList.push([data.id, data.size,data.table,data.dsId]);
	}
	$('#'+data.id).remove();
}
/**
 * 处理 grid 控件中的属性
 * @param id
 */
function parseGrid(id) {
	var grid = $('#' + id);
	grid.empty();
	var dataset = grid.attr('dataset');
	var format = grid.attr('format');
	var width = grid.attr('width');
	var height = grid.attr('height');
	var top = grid.attr('top');
	var left = grid.attr('left');
	var Header = '';                                  //每列的标题
	var ColumnIds = '';                              //每列的id
	var InitWidths = undToSp(grid.attr('colWidth'));             //每列的宽度
	var noInitWidths=false;
	if(InitWidths=='')  noInitWidths=true;
	var ColTypes = undToSp(grid.attr('colType'));                //每列的数据类型
	var noColType=false;
	if(ColTypes=='')  noColType=true;
	var showCheckbox = grid.attr('showCheckbox');         //是否显示选择框
	var visible = grid.attr('visible');         //是否可见
	var colSort = grid.attr('colSort');         //是否显示选择框
	var isPage = grid.attr('isPage');            //是否分页
	var rowsPerPage = grid.attr('bodyrows');       //每页的行数

	if (showCheckbox == '是') {
		Header = ' ,' + Header;
		ColumnIds = 'check,' + ColumnIds;
		InitWidths = '30,' + InitWidths;
		ColTypes = 'ch,' + ColTypes;
		colSort = 'str,' + colSort;
	}
	var isHidden='';
	if(visible=='否') isHidden='display:none;';
	var gridWrapHtml = '<div id="gridWrap_' + id + '" style="position: absolute;'+isHidden+' left: ' + left + 'px;width:' + width + 'px; top: ' + top + 'px; height:' + height + 'px;">' +
		'<div id="grid_' + id + '" style="width:100%;height: ' + (height) + 'px"></div>' +
		'</div>';
	if (isPage == '是') {
		gridWrapHtml = '<div id="gridWrap_' + id + '" style="position: absolute; left: ' + left + 'px;width:' + width + 'px; top: ' + top + 'px; height:' + height + 'px;">' +
			'<div id="grid_' + id + '" style="width:100%;height: ' + (height - 30) + 'px"></div>' +
			'<div id="gridPage_' + id + '" class="grid_page" style="width:100%;height:18px; padding-top:10px;"></div>' +
			'</div>';
	}

	grid.after(gridWrapHtml);

	var formatXml = newXml(format);
	var tempIds = [];
	$(formatXml).find('col').each(function (i) {
		Header += $(this).find('cname').text() + ',';
		ColumnIds += $(this).find('fname').text() + ',';
		tempIds.push($(this).find('fname').text());
		if(noColType ==true){
			ColTypes+='ro,';
		}

	});
	if(noColType ==true){
		ColTypes = ColTypes.substr(0, ColTypes.length - 1);
	}

	gridInfo.push([id, dataset, tempIds]);
	Header = Header.substr(0, Header.length - 1);
	ColumnIds = ColumnIds.substr(0, ColumnIds.length - 1);

	window['grid_' + id] = new dhtmlXGridObject('grid_' + id);
	window['grid_' + id].setImagePath(dhtmlxBase + "/imgs/");
	window['grid_' + id].setHeader(Header);
	window['grid_' + id].setColumnIds(ColumnIds);
	if(noInitWidths == false){
		var colNum=ColumnIds.split(',').length;
		var widthNum=InitWidths.split(',').length;
		if(colNum!=widthNum){
			layer.msg(id+'的 ->列属性 -> 每列宽度 设置不对；\n宽度应该使用","分开，数量与字段值保持一致！');
			return;
		}
		window['grid_' + id].setInitWidths(InitWidths);
	}
	window['grid_' + id].setColTypes(ColTypes);
	window['grid_' + id].setColSorting(colSort);
	window['grid_' + id].setEditable(true);
//	window['grid_' + id].enableAutoWidth(true);


	window['grid_' + id].init();
	if (isPage == '是') {
		if (rowsPerPage < 1) rowsPerPage = 99999;
		window['grid_' + id].enablePaging(true, rowsPerPage, 99999, 'gridPage_' + id, true);
		window['grid_' + id].setPagingSkin("toolbar");

		window['grid_' + id].attachEvent("onPageChanged", function (ind, fInd, lInd) {
			if (lInd == 0) return;
			if (typeof window['data_' + dataset].idByIndex(lInd - 1) == 'undefined') {
				loadDataForDatastore(dataset, rowsPerPage, ind);
			}
		});
	}

	window['grid_' + id].attachEvent("onRowSelect", function (id) {
		var fields = getPageSyncField();
		var item = window['data_' + dataset].item(id);
		window[dataset + '_now_id'] = id;
		for (var i = 0; i < fields['DS_' + dataset][1].length; i++) {
			var arr = fields['DS_' + dataset][1][i];
			var type = $('#' + arr[0]).attr('controltype');
			if (type == 'text' || type == 'textarea') {
				$('#' + arr[0]).val(item[arr[1]]);
			} else if (type == 'label') {
				$('#' + arr[0]).html(item[arr[1]]);
			} else if (type == 'dropdownlist') {
				setSelectVal(arr[0], item[arr[1]], 'id');
			}
		}
	});

//	window['grid_'+id].attachEvent("onRowDblClicked", function(rId,cInd){
//		alert(rId+' '+cInd)
//	});



	if (dataset) {
		needLoadDataList.push([id, dataset, 'grid', true, 'grid']);     //[控件ID,datasetID,字段名,是否需要加数据]
	}

}
/**
 * 生成editor
 * @param id  --  div的id
 */
function parseEditor(id){
	var editor = $('#' + id);
	var dataset = editor.attr('dataset');
	var field = editor.attr('field');
	var isReadOnly=editor.attr('readOnly');
	editor.append('<textarea id="t_'+id+'" style="width:100%;height:100%;"></textarea>');
	$.getScript(project + "/form/resources/common/kindeditor-4.1.9/kindeditor-min.js", function() {
		KindEditor.basePath = project + "/form/resources/common/kindeditor-4.1.9/";
		window["editor_"+id]=KindEditor.create('#t_'+id,{
			resizeType : 1,
			allowPreviewEmoticons : false,
			allowImageUpload : false,
			items : [
				'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold', 'italic', 'underline',
				'removeformat', '|', 'justifyleft', 'justifycenter', 'justifyright', 'insertorderedlist',
				'insertunorderedlist', '|', 'emoticons', 'image', 'link']
		});
		if (dataset) {
			needLoadDataList.push([id, dataset, field, true, 'editor']);     //[控件ID,datasetID,字段名,是否需要加数据]
		}
	});
}
/**
 * 把datastore中的数据填到绑定的控件中
 * @param id
 */
function addDataFromDataset(id) {
	
	if (window['data_' + id]) {
		for (var i = 0; i < needLoadDataList.length; i++) {
			var o = needLoadDataList[i];        // [控件ID,datasetID,字段名,是否需要加数据,控件类型]
		
			if (o[1] != id) continue;  //针对多个 dataset
			
			if (!o[3]) continue;     //如果已经加过数据了
			var sid = o[0];         //控件的id
			var store = o[1];      //控件绑定的dataset的id
			var field = o[2];      //控件绑定dataset中的字段名
			var type = o[4];      //控件的类型
		
			if (field == 'grid') {
				if(window._nowRefreshDsIs != store) {
					window['grid_' + sid].sync(window['data_' + store]);
				}
				
				o[3] = false;
				
				hasLoadedCtrlNum++;
								
				continue;		
				
			} else if (type == 'upload') {
				
				var key = getPrimaryKey(id)[0];
				var keyValue = window['data_' + id].item(window['data_' + id].first());
				if (keyValue) keyValue = keyValue[key];
				
				if(undToSp(keyValue)=='')  {
					keyValue=QueryURL.GetValue(key);
				}
				hasLoadedCtrlNum++;
				if(undToSp(keyValue)=='')  {
					$('#plupload1').show();
					continue
				}
				var saveTable = $('#' + id).attr('savetable');
				
				saveTable=parseSaveTable(saveTable); //hxt add 
				var tableKey='';
				var tableKeyId='';
				try{
					tableKey=getPrimaryKey(store)[0];
					var tempDs=getDs(store);
					var tempId=tempDs.first();
					tableKeyId=tempDs.item(tempId)[tableKey];
				}catch (e){}
				$.ajax({
					type       :"POST",
					url        :attachServlet,
//					processData:false,
					async      :false,
					data       :{"tableName":saveTable,"tableKey":tableKey+'',"tableKeyId":tableKeyId},
					dataType:'json',
					success    :function (msg) {
						
				
						if(msg.result=='success'){
							var ftpPath=msg.path;
							for (var j = 0; j < msg.message.length; j++) {
								var attach = msg.message[j];
								
								addAttach(sid, {
									id : attach.id,
									name : attach.name,
									size : attach.size,
									remark : attach.remark,
									table:saveTable,
									dsId:store,
									path : ftpPath + attach.path
								})
							}
						}else{
                            layer.msg(msg.message);
							
						}

					}
				});

				continue;
			}



			var item = window['data_' + id].first();                 //得到datastore中第一条数据的ID.

			o[3] = false;          //表示已经添加了数据
			hasLoadedCtrlNum++;
			if (item == undefined)  continue;
			item = window['data_' + id].item(item);                 //通过 id 取得数据.
			var control = $('#' + sid);
			var control_type = control.attr('controltype');
			var addData=  item[field];
			addData=addDataTrans(addData,id,field);
			if (control_type == 'text' | control_type == 'textarea' | control_type == 'button') {
				control.val(addData);
			} else if (control_type == 'checkbox') {
				setValue(sid,addData,'checkbox');
			}else if (control_type == 'checkboxlist') {
				setValue(sid,addData,'checkboxlist');
			} else if (control_type == 'radio') {
				setValue(sid,addData,'radio')

			} else if (control_type == 'dropdownlist') {
				var selSubType = undToSp($('#' + sid).attr('FieldNameList'));          //select 保存的字段
				setSelectVal(sid, addData, selSubType);
			} else if (control_type == 'editor') {
				setEditorVal(sid,addData);
			} else {
				control.text(addData);
			}


		}
	}

}
/**
 * 读出时转换处理方法
 * @param val     从数据库中读出的值
 * @param dsId    datastore的id
 * @param field   datastore的field值
 * @return {*}    处理过的值
 * @update
 * 2014-11-27 cl 对返回的值反转特殊字符
 */
function addDataTrans(val,dsId,field){
	
	var returnVal=val;
	for (var transI = 0; transI < fieldsTransInfo.length; transI++) {
		var fieldTransI = fieldsTransInfo[transI];
		if(fieldTransI[0]==dsId && fieldTransI[1]==field) {
			var transFunc= unescape(fieldTransI[3]);
			try{
				returnVal=eval(transFunc+"('"+returnVal+"')");
			}catch (e){

			}

		}

	}
	
	returnVal=changeSelectDateValue(val,dsId,field);
	return unescapeXml(returnVal);

}

//2015-8-6 hxt 查询时将 yyyy-mm-dd hh:mm:ss.0 更改
function changeSelectDateValue(val,dsId,field){
	
	if(val&&val.length==21)  
	{
	
		for (var i = 0; i < fieldsDateTypeInfo.length; i++) 
		{
			var typeInfo = fieldsDateTypeInfo[i];
			if(typeInfo[0]==dsId && typeInfo[1]==field) 
			{
				if(typeInfo[2]=="日期")
				{
					val=val.substring(0,10);
				
				}else if(typeInfo[2]=="时间")
				{
					val=val.substring(0,19);
				}
				break;
			}
			
		}
	  
	}
	return val;
	
}

//  2015-8-11 hxt  add  提交时将 yyyy-mm-dd hh:mm yyyy-mm-dd hh形式 补充
function changeSubDateValue(val, dsId, field)
{

	if(val&&(val.length==16||val.length==13)) 
	{
		for (var i = 0; i < fieldsDateTypeInfo.length; i++) 
		{
			var typeInfo = fieldsDateTypeInfo[i];
			if(typeInfo[0]==dsId && typeInfo[1]==field) 
			{
				if(typeInfo[2]=="时间")
				{
					if(val.length==16)
					{
						val=val+":00";
					}else if(val.length==13)
					{
						val=val+":00:00";
					}
					
				}
				break;
			}
			
		}
	}
	return val;
}


/**
 *  * 处理Dataset控件中的属性
 * @param id        dataset的ID
 * @param pageSize   每页的行数
 * @param start      第几页
 */
function parseDataset(id, pageSize, start) {
    
	var dataset = $('#' + id);
	var s = jQuery.inArray(id, datastoreList);
	var DsStructure=dataset.attr('format');
	var temp=newXml(DsStructure);
	var fieldTrans=dataset.attr('fieldtrans');  //字段保存时转换，读出时转换；
	var isSubDs=dataset.attr('issubds');       //是否 是从表
	if(isSubDs=='是'){
		var masterds=dataset.attr('masterds');                 //主表 dataset id
		var masterdsfield=dataset.attr('masterdsfield');       //主表 dataset 字段
		var subdsfield=dataset.attr('subdsfield');             //从表 dataset 字段
		$('#'+masterds).attr('relationField',masterdsfield);
	}
	fieldTrans=newXml(fieldTrans);
	var onValid=dataset.attr('onValid');      //这个dataset各字段的验证信息

	$(fieldTrans).find('field').each(function(){    // [[dataset的id,字段名,保存时的转换方法,读出时的转换方法]]
		var fieldname=$(this).find('name').text();
		var trans= $(this).find('trans').text();      //保存前转换
		var rtrans =$(this).find('rtrans').text();    //读出前转换
		var reg=/%28.*%29/g;
		trans=trans.replace(reg,'');
		rtrans=rtrans.replace(reg,'');
		fieldsTransInfo.push([id,fieldname,trans,rtrans]);
	});
	var fieldInfoTemp=[];           //临时存储各字段的name   给dsFieldInfo用
	var fieldLabelTemp=[];          //临时存储各字段的label  给dsFieldInfo用
	$(temp).find('field').each(function(){
		var fieldname=$(this).find('fieldname').text();
		var displaylabel=$(this).find('displaylabel').text();
		var defaultvalue= $(this).find('defaultvalue').text();
		var defaultvalueFuc=defaultvalue;
		var isnull= $(this).find('isnull').text();
		fieldInfoTemp.push(fieldname);
		fieldLabelTemp.push(displaylabel);
		if(isnull=='是'){
			fieldsIsNull.push([id,fieldname,displaylabel]);
		}
		
		//将日期或时间字段信息加入 fieldsDateTypeInfo
		var datatype= $(this).find('datatype').text(); //数据类型
		if(datatype=="日期"||datatype=="时间")
		{
			fieldsDateTypeInfo.push([id,fieldname,datatype]);
		}
		
		if(defaultvalue =='') return;
		try{
			defaultvalue=eval(defaultvalue);
		}catch (e){
			defaultvalue=defaultvalue;
		}
				
		dsDefaultVal.push([fieldname,defaultvalue,defaultvalueFuc]);
		for (var ctrlNum = 0; ctrlNum < needLoadDataList.length; ctrlNum++) {
			var ctrl = needLoadDataList[ctrlNum];               //[控件ID,datasetID,字段名,是否需要加数据,'类型']
			if(ctrl[1]==id && ctrl[2]==fieldname){
				setValue(ctrl[0],defaultvalue,ctrl[4]);
			}
		}
	});
	dsFieldInfo.push({dsId:id,fieldname:fieldInfoTemp,displaylabel:fieldLabelTemp})     //[ {dsId:xxx,fieldname:[bz,name],displaylabel:['备注','姓名']} ]
	if (s == -1) {
		if(isSubDs=='是'){
			datastoreList.push(id);
		}else{
			datastoreList.unshift(id);
		}

	}
	if( typeof window['data_' + id] == 'undefined'){
		window['data_' + id] = new dhtmlXDataStore({
			datatype:"json"
		});
	} else{
		window['data_' + id].clearAll()
	}


	loadDataForDatastore(id, pageSize, start);

	setTimeout(function(){                        //在表单提交时才用到，延迟执行
		parseDsValid.call(id,onValid);       //把 dataset的 id 传过去
	},10)
}

/**
 ** 为 Dataset 加载数据
 * @param id        dataset的ID
 * @param pageSize   每页的行数
 * @param start      第几页
 */
function loadDataForDatastore(id, pageSize, start) {
	var dataset = $('#' + id);
	var sql = dataset.attr('sqltrans');
	var format = dataset.attr('format');

	sql = parseSql(sql);
	if (sql == ''){
		for (var ctrlI = 0; ctrlI < needLoadDataList.length; ctrlI++) {
			var o=needLoadDataList[ctrlI];
			var sid = o[0];         //控件的id
			var store = o[1];      //控件绑定的dataset的id
			var field = o[2];      //控件绑定dataset中的字段名
			var type = o[4];      //控件的类型
			if(store==id){
				if (type == 'upload') {
					$('#plupload1').show();
					o[3] = false;
					hasLoadedCtrlNum++;
					continue;
				} else if (type == 'grid') {
					window['grid_' + sid].sync(window['data_' + store]);
					o[3] = false;
					hasLoadedCtrlNum++;
					continue;
				}
				o[3]==false;
				hasLoadedCtrlNum++;
			}
		}
		return;
	}
	format = newXml(format);
	var parameter = '<root><sql>' + sql + '</sql><pageNo>' + start + '</pageNo><pageSize>' + pageSize + '</pageSize> <fields>';
	$(format).find('field').each(function (i) {
		parameter += '<field><name>' + $(this).find('fieldname').text() + '</name></field>'
	});
	parameter += '</fields></root>';

	$.ajax({
		type       :"POST",
		url        :project+"/servlet/WebBill?key=dataset_fields2",

		processData:false,
		//async      :false, //同步加载数据。发送请求时锁住浏览器。 在所有数据加载好后才触发 验证权限
		data       :parameter,
		contentType:'utf-8',
		success    :function (msg) {
			if(msg == 'null' || msg == null) {
				msg="{'data':[] ,'total_count' : 0 ,'pos' : 0}";
			}
			if (msg.match('errInfo') != null) {

                layer.msg(msg);
			}else{

				window['data_' + id].parse(msg);
				addDataFromDataset(id);
			}
		}
	});
	  
}



/**
 * 处理 tree 控件
 * @param id
 */
function parseTree(id) {
	var tree = $('#' + id);
	var xml = tree.attr('xml');
	var rootText = '根节点';
	var rootNodeId = undToSp(tree.attr('roottext'));    //树 根节点 id
	if(rootNodeId=='') rootNodeId='rootNode';
	var filePath = tree.attr('xmlpath');
	var sql = tree.attr('sql2');
	var clickEvent = tree.attr('clicknode');
	var check = tree.attr('ischecked');
	if (clickEvent == 'undefined' || clickEvent == undefined)  clickEvent = '';
	if (sql == 'undefined' || sql == undefined)  sql = '';
	if (filePath == 'undefined' || filePath == undefined)  filePath = '';
	clickEvent = unescape(clickEvent);
	window['tree_' + id] = new dhtmlXTreeObject(id, "100%", "100%", rootNodeId);
	window['tree_' + id].setImagePath(dhtmlxBase + "/imgs/csh_dhx_terrace/");
	if (check == "是") {
		window['tree_' + id].enableCheckBoxes(1);
		window['tree_' + id].enableThreeStateCheckboxes(true);
	}
	if (clickEvent.length > 1) {
		window['tree_' + id].attachEvent('onClick', function (id) {
			try{
				var func = eval(clickEvent);
				func.call(func,id);
			}catch (e){

			}

		});
	}
//	   ---------------------sql 语句模式-----------------------------
	if (sql.length > 1) {
		sql = parseSql(sql);
		var parameter = '<root><root key="sqltotreedataJson" ><sql>' + sql + '</sql></root></root>';
		$.ajax({
			type       :"POST",
			url        :project+"/servlet/WebBill?key=loadingBatchAction",
			processData:false,
			//async      :false,
			data       :parameter,
			contentType:'utf-8',
			success    :function (msg) {
				try{
					msg = msg.replace(/<root>/g, '');
					msg = msg.replace(/<\/root>/g, '');
					var json = eval('(' + msg + ')');
					window['tree_' + id].loadJSONObject(json, function () {
						var rootId = window['tree_' + id].getSubItems(rootNodeId);
						rootId=rootId.split(',');
						window['tree_' + id].openItem(rootId[0]);
					});
				}catch (e){
                    layer.msg("加载树数据出错\n错误信息："+msg);
				}
			}
		});
		return;
	}

//	   ---------------------json 文件模式-----------------------------
	if (filePath.length > 1) {

		window['tree_' + id].loadJSON(filePath, function () {
			var rootId = window['tree_' + id].getSubItems(rootNodeId);
			rootId=rootId.split(',');
			window['tree_' + id].openItem(rootId[0]);
		});
		return;
	}
//	   -------------------自定义模式-------------------------------
	if (rootText == undefined) rootText = '';
	xml = parseTreeXml(xml, rootText,rootNodeId);
	window['tree_' + id].loadXMLString(xml, function () {
		var rootId = window['tree_' + id].getSubItems(rootNodeId);
		rootId=rootId.split(',');
		window['tree_' + id].openItem(rootId[0]);
	});
//	window['tree_' + id].attachEvent('onClick',function(sid){
//		alert(window['tree_' + id].getUserData(sid,'code'))
//	})
}

/**
 * 处理自定义模式的 tree 的xml文本
 * @param xml
 * @param rootText
 * @param rootNodeId
 * @return {String}
 */
function parseTreeXml(xml, rootText,rootNodeId) {
	xml = unescape(xml);

	xml = xml.replace(/TreeNode/g, 'item');
	xml = xml.replace(/title/g, 'tooltip');
//	alert(xml.match(/code="[.]*?[^">]*"\/>/))
	xml = xml.replace(/code="([.]*?[^">]*)"\/>/g, '><userdata name="hideVal">$1<\/userdata><\/item>');  //替换节点隐藏值为 userdata
	xml = xml.replace(/code="([.]*?[^">]*)">/g, '><userdata name="hideVal">$1<\/userdata>');      //替换节点隐藏值为 userdata
	xml = xml.replace(/text=".*?"/, 'text="' + rootText + '"');       //修改根节点文本
	xml = xml.replace(/tooltip=".*?"/, 'tooltip="' + rootText + '"');       //修改根节点文本
	xml = '<tree id="'+rootNodeId+'"> ' + xml + '</tree>';
	return xml;
}

/**
 * 处理页面 权限 信息
 * @param xml
 */
function parseAuthXml(xml) {
	$.ajax({
		type       :"POST",
		url        :project+"/servlet/WebBill?key=formRoleCheck",
		processData:false,
		data       :'<root>' + xml + '</root>',
		contentType:'utf-8',
		success    :function (msg) {
			if (msg.length < 1) {
				$('#page_parsing').remove();
				return;
			}
			var authInfo = eval('(' + msg + ')');
			var obj = {controltype:"", disabled:"", display:"", fieldname:"", id:"", readonly:""};
			for (var i = 0; i < authInfo.length; i++) {
				obj = authInfo[i];     //对象属性：{"controltype":"button","disabled":"","display":"","fieldname":"","id":"button77","readonly":"true"}
				var ctrl = $('#' + obj.id);    //需要处理的 控件
				var type1 = 'checkboxlist,radiolist,checkbox';
				if (obj.controltype == 'dataset') {
					if (obj.display == 'true') {
						for (var j = 0; j < gridInfo.length; j++) {       //针对页面有多个grid存在时
							var grid = gridInfo[j];
							if (grid[1] == obj.id) {             //如果grid绑定的dataset是这个dataset
								var colIndex = $.inArray(obj.fieldname, grid[2]);
								if (colIndex == -1) continue;          //如果没找到 这个 fieldname
								var showCheckbox = $('#' + grid[0]).attr('showCheckbox');
								if (showCheckbox == '是')   colIndex += 1;
								window['grid_' + grid[0]].setColumnHidden(colIndex, true);
								window['grid_' + grid[0]].setColWidth(colIndex - 1, "*");
							}
						}
					}
					if (obj.disabled == 'true') {
						for (var j = 0; j < gridInfo.length; j++) {       //针对页面有多个grid存在时
							var grid = gridInfo[j];
							if (grid[1] == obj.id) {             //如果grid绑定的dataset是这个dataset
								var colIndex = $.inArray(obj.fieldname, grid[2]);
								if (colIndex == -1) continue;          //如果没找到 这个 fieldname
								var showCheckbox = $('#' + grid[0]).attr('showCheckbox');
								if (showCheckbox == '是')   colIndex += 1;
								window['grid_' + grid[0]].setColumnExcellType(colIndex, 'ro');
							}
						}
					}
					if (obj.readonly == 'true') {
						for (var j = 0; j < gridInfo.length; j++) {       //针对页面有多个grid存在时
							var grid = gridInfo[j];
							if (grid[1] == obj.id) {             //如果grid绑定的dataset是这个dataset
								var colIndex = $.inArray(obj.fieldname, grid[2]);
								if (colIndex == -1) continue;          //如果没找到 这个 fieldname
								var showCheckbox = $('#' + grid[0]).attr('showCheckbox');
								if (showCheckbox == '是')   colIndex += 1;
								window['grid_' + grid[0]].setColumnExcellType(colIndex, 'ro');
							}
						}
					}


				} else if (type1.match(eval("/" + obj.controltype + "/")) != null) {

					if (obj.display == 'true') {
						ctrl.hide();
					}
					if (obj.disabled == 'true') {
						ctrl.find('input').prop('disabled', true);
					}
					if (obj.readonly == 'true') {
						ctrl.find('input').attr('readonly', true);
					}
				} else if (obj.controltype == 'dropdownlist') {
					ctrl = $('#' + obj.id);    //需要处理的 控件
					var isShowTree = ctrl.attr('isShowTree');
					var trueCtrl = $('#sel_' + obj.id);
					if (isShowTree == '1') {
						if (obj.display == 'true') {
							trueCtrl.hide();
						}
						if (obj.disabled == 'true') {
							trueCtrl.addClass('disabled');
						}
					} else {
						if (obj.display == 'true') {
							trueCtrl.hide();
						}
						if (obj.disabled == 'true') {
							trueCtrl.prop('disabled', true);
						}
						if (obj.readonly == 'true') {
							trueCtrl.attr('readonly', true);
						}
					}

				} else {

					if (obj.display == 'true') {
						ctrl.hide();
					}
					if (obj.disabled == 'true') {
						ctrl.prop('disabled', true);
					}
					if (obj.readonly == 'true') {
						ctrl.attr('readonly', true);
					}
				}
			}

		}
	});
}

/**
 * 显示流程的历史步骤
 * @param wfId    流程的id
 */
function showWfHistory(wfId){
	var isIE=$.browser.msie;
	var url=projectName+"/form/fceform/common/djframe.htm?djsn=wf_history_list&djtype=WF&wf_id="+wfId;
	if(isIE){
		window.top.createTab({text:'查看流程图',url:url});
//		window.open (url,'wf_history_list','height=1600,width=1050,top=0,left=50,toolbar=no,menubar=no,location=no,resizable=yes, status=no');
	}else{
		layer.msg('流程图只能在IE下打开，请使用IE打开如下链接！<br><a target="_blank" href="'+url+'">'+url+'</a>');
	}
}
/**
 * 执行流程的签收任务
 * @param taskid       任务id
 * @param taskname     任务名称
 */
function uf_doSignTask(taskid,taskname){
    var tip=layer.confirm("确定签收任务“" + taskname + "”吗？", {
        btn: ['确定','取消'] //按钮
    },function () {
		//签收，生成workitem表记录
		//var project=window.location.toString();
		//project=project.split('/');
		//project='/'+project[3];

		var sKey =project+ "/servlet/WorkflowPortal?operate=set_task_workitem";
		sKey += "&task_id=" + taskid;
		$.ajax({
			type       :"POST",
			url        :sKey,
			processData:false,
			data       :"<root></root>",
			contentType:'utf-8',
			success    :function (msg) {
				var result=newXml(msg);
				var bResult=$(result).find('n').text();
				if (bResult=="false") {
					var falseInfo=$(result).find('message').text();
					layer.msg(falseInfo,5);
				} else{
                    layer.msg("签收成功！",3);
				}

			},
			error:function (msg) {
                layer.msg('访问后台失败！')
			}
		})
	});
}
/**
 * 执行撤回任务操作
 * @param wfid           流程的id
 * @param stepid         步骤的id
 * @param actionid       动作的id
 * @param instanceid     实例的id
 */
function uf_doRevoke(wfid,stepid,actionid,instanceid){
    var tip=layer.confirm("确定执行撤回任务操作吗？",{
        btn: ['确定','取消'] //按钮
    }, function () {
		var project=window.location.toString();
		project=window.top.project;
		var sKey =project+ "/servlet/WorkflowPortal?operate=do_revoke&wf_id=" + wfid +"&step_id=" + stepid;
		sKey +="&action_id=" + actionid;
		if (instanceid!=null && instanceid!="" && instanceid!="undefined")
			sKey +="&dynamic_instance_id=" + instanceid;
		$.ajax({
			type       :"POST",
			url        :sKey,
			processData:false,
			data       :"<root></root>",
			contentType:'utf-8',
			success    :function (msg) {
				var result=newXml(msg);
				var bResult=$(result).find('n').text();
				if (bResult=="false") {
					var falseInfo=$(result).find('message').text();
                    layer.msg(falseInfo,5);
				} else{
                    layer.msg("撤回任务成功！",3);
				}

			},
			error:function (msg) {
                layer.msg('访问后台失败！')
			}
		})
	});
}
/**
 * 显示这个流程最后保存的信息
 * @param wfName    流程name
 * @param wfId      流程id
 */
function showWFLatest(wfName,wfId){
	var sKey = "?operate=get_action_list&wf_id=" + wfId;
	$.ajax({
		type       :"POST",
		url        :projectName+"/servlet/WorkflowPortal"+sKey,
		processData:false,
		data       :'<root></root>',
		contentType:'utf-8',
		success    :function (msg) {
			var oDom=newXml(msg);
			var bResult = $(oDom).find('n').eq(0).text();
			if (bResult == "false") {
                layer.msg("获取流程信息发生错误：" + $(oDom).find('message').text(),5);
				return;
			}else{
				var WfDesc = $(oDom).find('action').attr('name');
				WfDesc=escape(WfDesc);
				var WfVersion =  $(oDom).find('num').text();
				var billPath = $(oDom).find('action').attr('view');
				billPath=unescape(billPath);
				var actionId=   $(oDom).find('action').attr('id');
				var traceId =$(oDom).find('action').attr('traceId');
				var url=projectName+'/form'+ billPath+'&wfName='+wfName+'&wfDesc='+WfDesc+'&wfVersion='+WfVersion+'&wfId='+wfId+'&actionId='+ actionId+'&=&dynamicInstanceId=&traceId='+traceId;
				try{
				   window.top.createTab({text:unescape(WfDesc),url:url,id:'showWFLatest',openType:'1'});

				}catch (e){
					window.open(url,"showWFLatest");
				}

			}

		},
		error      :function (msg) {
            layer.msg('访问后台失败！')
		}
	});

}

/**
 * 处理dataset的字段的验证函数
 * @param func        //验证函数内容  -- string
 * @param dsFieldXml  //这个dataset的字段xml   --xml
 */
function parseDsValid(func,dsFieldXml){
	var dsId=this;        //通过call 调用，因为生成的xml 中 取不到 dataset的id
	eval(func);
	function bill_ondatasetvalid(xml){
		var sXml=newXml(xml);
		$(sXml).find('dsid').children().each(function(){
			var validRule=undToSp($(this).text());
			if(validRule!=''){
				var label='';
				for (var i = 0; i < dsFieldInfo.length; i++) {
					var info = dsFieldInfo[i];      //[ {dsId:xxx,fieldname:[bz,name],displaylabel:['备注','姓名']} ]
					if(info.dsId==dsId){
						for (var j = 0; j < info.fieldname.length; j++) {
							var field = info.fieldname[j];
							if(field==this.tagName){
								label= info.displaylabel[j];
								fieldsValidInfo.push([dsId+'',this.tagName,label,validRule]);
								return;
							}
						}
					}
				}

			}
		});
	}
}


/**
 * 获取组成箭头的三条线段的路径
 * @param obj1        开始的节点的ID
 * @param obj2        结束的节点的ID
 * @return {Object}   路径的开始、结束路径及角度
 */
function getStartEndHtml(obj1, obj2) {
	var bb1 = $('#'+obj1), bb2 = $('#'+obj2);
	var b1 = {left:bb1.position().left,top:bb1.position().top};
	var b2 = {left:bb2.position().left,top:bb2.position().top};
	var p = [
		{ x:b1.left + 61 / 2, y:b1.top },
		{ x:b1.left + 61, y:b1.top + 65 / 2 },
		{ x:b1.left + 61 / 2, y:b1.top + 65 },
		{ x:b1.left , y:b1.top + 65 / 2 },

		{ x:b2.left + 61 / 2, y:b2.top },
		{ x:b2.left + 61, y:b2.top + 65 / 2 },
		{ x:b2.left + 61 / 2, y:b2.top + 65 },
		{ x:b2.left, y:b2.top + 65 / 2 }

	];
	var result = {start:{x:'',y:''},end:{x:'',y:''},angle:''};
	for (var i = 0; i < 4; i++) {
		for (var j = 4; j < 8; j++) {
			var dx = Math.abs(p[i].x - p[j].x), dy = Math.abs(p[i].y - p[j].y);           //偏移值
			if(dx<33 && b1.top>b2.top && i==0 && j==6  ){              //在一列   上    ↑
				result.start.x = p[i].x;
				result.start.y = p[i].y;
				result.end.x = p[i].x;
				result.end.y = p[j].y;
				result.angle=90;
				return result;
			}else if(dx<33 && b1.top<b2.top  && i==2 && j==4 ){              //在一列  下    ↓
				result.start.x = p[i].x;
				result.start.y = p[i].y;
				result.end.x = p[i].x;
				result.end.y = p[j].y;
				result.angle=270;
				return result;
			}else if( dy<33 && b1.left>b2.left  && i==3 && j==5 ){      // 在一排  左     ←_←
				result.start.x = p[i].x;
				result.start.y = p[i].y-5;
				result.end.x = p[j].x;
				result.end.y = p[i].y-5;
				result.angle=0;
				return result;
			}else if( dy<33 && b1.left<b2.left && i==1 && j==7 ){      // 在一排 右      →_→
				result.start.x = p[i].x;
				result.start.y = p[i].y-5;
				result.end.x = p[j].x;
				result.end.y = p[i].y-5;
				result.angle=180;
				return result;
			}else if( dx>=33 && dy>=33 ){
				if(b1.left<b2.left && b1.top<b2.top &&  (i==2 && j==7 ) ){        //右下
					result.start.x = p[i].x;
					result.start.y = p[i].y;
					result.end.x = p[j].x;
					result.end.y = p[j].y;
					result.angle=180;
					return result;
				} else if(b1.left<b2.left && b1.top>b2.top &&  (i==0 && j==7 ) ){        //右上
					result.start.x = p[i].x;
					result.start.y = p[i].y;
					result.end.x = p[j].x;
					result.end.y = p[j].y;
					result.angle=180;
					return result;
				} else if(b1.left>b2.left && b1.top>b2.top &&  (i==0 && j==5 ) ){        //左上
					result.start.x = p[i].x;
					result.start.y = p[i].y;
					result.end.x = p[j].x;
					result.end.y = p[j].y;
					result.angle=0;
					return result;
				}  else if(b1.left>b2.left && b1.top<b2.top &&  (i==2 && j==5 ) ){        //左下
					result.start.x = p[i].x;
					result.start.y = p[i].y;
					result.end.x = p[j].x;
					result.end.y = p[j].y;
					result.angle=0;
					return result;
				}
			}
		}
	}

	return result;
}
/**
 * 根据开始、结束位置及角度生成path
 * @param x1     开始点的x值
 * @param y1     开始点的y值
 * @param x2     结束点的x值
 * @param y2     结束点的y值
 * @param offsetX  线的X轴偏移值
 * @param offsetY  线的Y轴偏移值
 * @param angle    箭头的方向   ↑:90° →:180° ↓:270° ←:0°
 * @param size     箭头的线的长度
 * @return {Array} 路径的path值   [[线的path],[箭头的path]]
 */
function getArr(x1, y1, x2, y2,offsetX,offsetY, angle,size) {
	x1=x1+offsetX;
	y1=y1+offsetY;
	x2=x2+offsetX;
	y2=y2+offsetY;
	var a45 = Raphael.rad(angle - 45);//角度转换成弧度
	var a45m = Raphael.rad(angle + 45);
	var x2a = x2 + Math.cos(a45) * size;
	var y2a = y2 + Math.sin(a45) * size;
	var x2b = x2 + Math.cos(a45m) * size;
	var y2b = y2 + Math.sin(a45m) * size;
	var result = [["M", x1, y1, "L", x1, y2, "L", x2, y2],["M", x2, y2 , "L", x2a, y2a, "M", x2, y2, "L", x2b, y2b]];
	return result;
}
/**
 * 在页面div中装入流程实例轨迹图
 * @param wfId    指定流程实例id
 * @param FlowArea   页面的指定div的id
 * @param ds        步骤列表的数据集的id，当不传入值时（null），则不列出步骤列表
 */
function LoadWorkflowTrace(wfId, FlowArea, ds) {
	var sKey = "?operate=get_history_list&wf_id=" + wfId;
	$.ajax({
		type       :"POST",
		url        :project + "/servlet/WorkflowPortal" + sKey,
		processData:false,
		data       :'<root></root>',
		contentType:'utf-8',
		success    :function (msg) {
			var gridInfo;
			var oDom = newXml(msg);
			var bResult = $(oDom).find('n').eq(0).text();
			if (bResult == "false") {
                layer.msg("获取流程信息发生错误：" + $(oDom).find('message').text(), 5);
				return;
			} else {
				gridInfo = $(oDom).find('root > text').text();       //添加 grid 中的数据
				gridInfo = newXml('<root>' + gridInfo + '</root>');
				$(gridInfo).find('tr').each(function () {
					var trData = [];
					$(this).find('td').each(function () {
						trData.push($(this).text());
					});
					var flowNodeInfo= {
						'stepType'           :trData[0],
						'step'               :trData[1],
						'stepid'             :trData[2],
						'action'             :trData[3],
						'actionid'           :trData[4],
						'dynamic_instance_id':trData[5],
						'status'             :trData[6],
						'caller'             :trData[7],
						'remark'             :trData[8],
						'startDate'          :trData[9],
						'finishDate'         :trData[10],
						'previous'           :trData[11],
						'traceId'            :trData[12],
						'subwfId'            :trData[13]
					};
					wfHistoryListNodeInfo.push(flowNodeInfo);
					getDs(ds).add(flowNodeInfo);
				});
				var flowWrap = $('#' + FlowArea);
				flowWrap.addClass('flow_history')
				var paper;
				var lines = [];       //存储需要连的线  [ [fromId,toId,X轴偏移值,y轴偏移值] ]
				$(oDom).find('root > position > node').each(function () {
					var nodeType = $(this).find('nodetype').text();
					var outerhtml = $(this).find('outerhtml').text();
					outerhtml = outerhtml.replace('Z-INDEX: 799; BORDER-BOTTOM: #000000 0px solid; POSITION: absolute; TEXT-ALIGN: center; BORDER-LEFT: #000000 0px solid;','POSITION: absolute;');
					outerhtml = outerhtml.replace('VISIBILITY: visible; BORDER-TOP: #000000 0px solid; ','');
					outerhtml = outerhtml.replace(' BORDER-RIGHT: #000000 0px solid;','');
					var line;
					if (nodeType == 'Result') {
						outerhtml = outerhtml.replace('<?xml:namespace prefix = v ns = "urn:schemas-microsoft-com:vml" />', '');
						outerhtml = outerhtml.replace('<?xml:namespace prefix = "v" ns = "urn:schemas-microsoft-com:vml" />', '');
						outerhtml = outerhtml.replace(/id=(\S+)/g, 'id="$1"');
						outerhtml = outerhtml.replace(/v:/g, '');
						line = newXml(outerhtml);
						var polyLine = $(line).find('polyline').eq(0);
						var style = polyLine.attr('style');
						var top = style.match(/TOP:\s(-*\d+)px/);
						var left = style.match(/LEFT:\s(-*\d+)px/);
						if (top != null) {
							top = parseInt(top[1]);
						} else {
							top = 0;
						}
						if (left != null) {
							left = parseInt(left[1]);
						} else {
							left = 0;
						}
						lines.push([polyLine.attr('FromNode'), polyLine.attr('ToNode'), left, top]);
					}else if(nodeType == 'StartNode'){
						flowWrap.append(outerhtml);
						var nodeId=$(this).find('id').text();
						$('#'+nodeId).append( '<IMG class="sHistoryIcon" src="../../fceform/images/wf_little_ok.gif">');
					} else {

						outerhtml=$(outerhtml);
						outerhtml.dblclick(function(){
							Flow_ShowActiveNodeDetail(nodeType,outerhtml[0]);
						})
						flowWrap.append(outerhtml);
					}
				});
				paper = Raphael(FlowArea, $('#' + FlowArea).width() - 10, $('#' + FlowArea)[0].scrollHeight - 10);
				for (var i = 0; i < lines.length; i++) {
					var ids = lines[i];
					paper.drawArr({'obj1':ids[0], 'obj2':ids[1], 'offsetX':ids[2], 'offsetY':ids[3]});
				}
				LoadFlowLittleIcon(gridInfo);
			}

		},
		error:function (msg) {
            layer.msg('访问后台失败！');

		}
	});

}
/**
 * 流程历史记录中节点双击显示表单
 * @param nodeType   节点类型
 * @param node   双击的div type:html object
 */
function Flow_ShowActiveNodeDetail(nodeType,node){
	
	var nodeInfo;
	var sUrl='';
	for (var i = 0; i < wfHistoryListNodeInfo.length; i++) {
		var nowNode = wfHistoryListNodeInfo[i];
		if(node.id==nowNode.stepid){
			nodeInfo=nowNode;
			break;
		}
	}
	switch (nodeType)
	{
		case "StartNode":
		//	$.artDialog.tips('无关联的表单！',2);
            layer.msg('无关联的表单！');
			break;
		case "EndNode":
			//$.artDialog.tips('无关联的表单！',2);
            layer.msg('无关联的表单！');
			break;
		case "StepNode":
			sUrl =  projectName +"/fceform/common/djframe.htm?djsn=wf_steptask_list&djtype=WF";
			sUrl +="&wf_id=" + wfId;
			sUrl +="&step_id=" + node.id;
			window.open(sUrl);
			break;
		case "JoinNode":
		//	$.artDialog.tips('无关联的表单！',2);
            layer.msg('无关联的表单！');
			//strNodeName = "协同节点";
			break;
		case "SplitNode":
		//	$.artDialog.tips('无关联的表单！',2);
            layer.msg('无关联的表单！');
			//strNodeName = "分支节点";
			break;
		case "ActionNode":
			if(typeof nodeInfo == 'undefined'){
			//	$.artDialog.tips('无关联的表单！',2);
                layer.msg('无关联的表单！');
				break;
			}
			var stepId = nodeInfo.stepid;
			var dynamicId = nodeInfo.dynamic_instance_id;
			var traceId = nodeInfo.traceId;
			var stepType = nodeInfo.stepType;//当前步骤，历史步骤
			openHistoryAction(stepId,node.id,dynamicId,traceId,stepType);
			break;
		case "SubflowNode":
			//2012-1-6
			var subwfId = nodeInfo.sub_wfid;
			if (!IsSpace(subwfId) && subwfId!="-1")//2012-1-6
				show_subtrace(subwfId);
			else
			//	$.artDialog.tips('无关联的表单！',2);
            layer.msg('无关联的表单！');
			//strNodeName = "子流程节点";
			break;
		case "CompNode":
			//strNodeName = "步动节点";
			if(typeof nodeInfo == 'undefined'){
				//$.artDialog.tips('无关联的表单！',2);
                layer.msg('无关联的表单！');
				break;
			}
			var dynamicId = nodeInfo.dynamic_instance_id;
			var traceId = nodeInfo.traceId;
			var stepType = nodeInfo.stepType;//当前步骤，历史步骤
			var actionId=nodeInfo.actionid
			openHistoryActionFullPage(node.id,actionId,dynamicId,traceId,stepType);
			break;
	}

}

/**
 * 显示流程执行过的某一步的表单
 * @param stepId     步骤id
 * @param actionId   动作id
 * @param dynamicId  分支id
 * @param traceId    轨迹id
 * @param stepType   步骤类型
 */
function openHistoryAction(stepId, actionId, dynamicId, traceId, stepType) {
	if (stepType == "当前步骤") stepType = "1";
	if (stepType == "历史步骤") stepType = "2";
	var sKey = "?operate=get_history_view";
	sKey += "&wf_id=" + wfId;           //wfId等为 流程历史记录 这个表单的全局变量
	sKey += "&step_id=" + stepId;
	sKey += "&action_id=" + actionId;
	sKey += "&step_type=" + stepType;
	sKey += "&trace_id=" + traceId;
	if (dynamicId != null && dynamicId != "null" && typeof(dynamicId) != "undefined" && dynamicId != "undefined")
		sKey += "&dynamic_instance_id=" + dynamicId;
	$.ajax({
		type       :"POST",
		url        :projectName + "/servlet/WorkflowPortal" + sKey,
		processData:false,
		data       :'<root></root>',
		contentType:'utf-8',
		success    :function (msg) {
			var oDom = newXml(msg);
			var bResult = $(oDom).find('n').eq(0).text();
			if (bResult == "false") {
                layer.msg("获取流程信息发生错误：" + $(oDom).find('message').text(), 5);
				return;
			} else {
				var info=$(oDom).find('n').eq(1);
				var view = info.find('view').text();
				var idField = info.find('bs_id_field').text();
				var idFieldValue = info.find('id_value').text();
				if (view == "") {
					//$.artDialog.tips('无关联的表单！',2);
                    layer.msg('无关联的表单！');
					return;
				}
				//从后台获取actionId
				if (actionId == "-1") actionId = info.find('action_id').text();

				var sUrl = projectName+'/form/'+unescape(view);
				sUrl = sUrl + "&wfName=" + WfName;
				sUrl = sUrl + "&wfDesc=" + escape(WfDesc);
				if (stepType == "2")
					sUrl = sUrl + "&show=true";
				sUrl = sUrl + "&wfVersion=" + WfVersion;
				sUrl = sUrl + "&wfId=" + wfId
				sUrl = sUrl + "&actionId=" + actionId;
				sUrl = sUrl + "&" + idField + "=" + idFieldValue;

				if (dynamicId != null && dynamicId != "null" && typeof(dynamicId) != "undefined" && dynamicId != "undefined")
					sUrl = sUrl + "&dynamicInstanceId=" + dynamicId;
				if (traceId != null && traceId != "null" && typeof(traceId) != "undefined" && traceId != "undefined")
					sUrl = sUrl + "&traceId=" + traceId;
				try{
					
					window.top.createWindow(
						{   id      :'showWfHistoryOneStep',
							text    :WfDesc,
							url     :sUrl,
							width   :'820',
							height  :'520'
						}
					);

				}catch (e){
					window.open(sUrl);
				}

			}

		},
		error      :function (msg) {
            layer.msg('访问后台失败！');

		}
	});

}

/**
 * 显示流程执行过的某一步的表单全屏
 * @param stepId     步骤id
 * @param actionId   动作id
 * @param dynamicId  分支id
 * @param traceId    轨迹id
 * @param stepType   步骤类型
 */
function openHistoryActionFullPage(stepId, actionId, dynamicId, traceId, stepType) {
	if (stepType == "当前步骤") stepType = "1";
	if (stepType == "历史步骤") stepType = "2";
	var sKey = "?operate=get_history_view";
	sKey += "&wf_id=" + wfId;           //wfId等为 流程历史记录 这个表单的全局变量
	sKey += "&step_id=" + stepId;
	sKey += "&action_id=" + actionId;
	sKey += "&step_type=" + stepType;
	sKey += "&trace_id=" + traceId;
	if (dynamicId != null && dynamicId != "null" && typeof(dynamicId) != "undefined" && dynamicId != "undefined")
		sKey += "&dynamic_instance_id=" + dynamicId;
	$.ajax({
		type       :"POST",
		url        :projectName + "/servlet/WorkflowPortal" + sKey,
		processData:false,
		data       :'<root></root>',
		contentType:'utf-8',
		success    :function (msg) {
			var oDom = newXml(msg);
			var bResult = $(oDom).find('n').eq(0).text();
			if (bResult == "false") {
                layer.msg("获取流程信息发生错误：" + $(oDom).find('message').text(), 5);
				return;
			} else {
				var info=$(oDom).find('n').eq(1);
				var view = info.find('view').text();
				var idField = info.find('bs_id_field').text();
				var idFieldValue = info.find('id_value').text();
				if (view == "") {
					//$.artDialog.tips('无关联的表单！',2);
                    layer.msg('无关联的表单！');
					return;
				}
				//从后台获取actionId
				if (actionId == "-1") actionId = info.find('action_id').text();

				var sUrl = projectName+'/form/'+unescape(view);
				sUrl = sUrl + "&wfName=" + WfName;
				sUrl = sUrl + "&wfDesc=" + escape(WfDesc);
				if (stepType == "2")
					sUrl = sUrl + "&show=true";
				sUrl = sUrl + "&wfVersion=" + WfVersion;
				sUrl = sUrl + "&wfId=" + wfId
				sUrl = sUrl + "&actionId=" + actionId;
				sUrl = sUrl + "&" + idField + "=" + idFieldValue;

				if (dynamicId != null && dynamicId != "null" && typeof(dynamicId) != "undefined" && dynamicId != "undefined")
					sUrl = sUrl + "&dynamicInstanceId=" + dynamicId;
				if (traceId != null && traceId != "null" && typeof(traceId) != "undefined" && traceId != "undefined")
					sUrl = sUrl + "&traceId=" + traceId;
				try{
					
//					window.top.createWindow(
//						{   id      :'showWfHistoryOneStep',
//							text    :WfDesc,
//							url     :sUrl,
//							width   :'820',
//							height  :'520'
//						}
//					);

					window.open(url);
					
				}catch (e){
					window.open(sUrl);
				}

			}

		},
		error      :function (msg) {

            layer.msg('访问后台失败！')
		}
	});

}



/**
 * 处理显示流程历史记录中各节点当前的执行状态 - 已经完成/正在进行
 * @param oXml     流程的节点信息 object document
 */
function LoadFlowLittleIcon(oXml) {
	var sCurrentIcon = '<img class="sCurrentIcon" src="../../fceform/images/wf_little_run.gif">';
	var sHistoryIcon = '<img class="sHistoryIcon" src="../../fceform/images/wf_little_ok.gif">';
	$(oXml).find('tr').each(function () {
		var stepType = $(this).children().eq(0).text(); // 步骤类型当前步骤或历史步骤
		var stepId = $(this).children().eq(2).text();    //步骤id
		var actionId = $(this).children().eq(4).text();  //动作id
		if (stepId != "-1") {
			var oDiv = $('#' + stepId);
			if (stepType == "当前步骤") {
				oDiv.append(sCurrentIcon);
			}
			else {
				oDiv.append(sHistoryIcon);
			}
		}
		if (actionId != "-1") {
			var oDiv = $('#' + actionId);
			if (oDiv) {
				if (stepType == "当前步骤") {
					oDiv.append(sCurrentIcon);
				} else {
					oDiv.append(sHistoryIcon);
				}
			}
		}
	});
}
