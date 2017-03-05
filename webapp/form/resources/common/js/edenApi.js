/**
 * Author: 邹志强
 * Date: 2013-05-23 11:21:30
 * 本文件存放各控件相关的API方法
 */

var Tool = {};
Tool = {
    /**
     * Obj2str ： 转换 json对象为 字符类型
     * @param o {object}
     * @return {*}
     * @constructor
     */
    Obj2str: function (o) {
        if (o == undefined) {
            return "";
        }
        var r = [];
        if (typeof o == "string") return "\"" + o.replace(/(["\\])/g, "\\$1").replace(/(\n)/g, "\\n").replace(/(\r)/g, "\\r").replace(/(\t)/g, "\\t") + "\"";
        if (typeof o == "object") {
            if (!o.sort) {
                for (var i in o)
                    r.push("\"" + i + "\":" + Tool.Obj2str(o[i]));
                if (!!document.all && !/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(o.toString)) {
                    r.push("toString:" + o.toString.toString());
                }
                r = "{" + r.join() + "}"
            } else {
                for (var i = 0; i < o.length; i++)
                    r.push(Tool.Obj2str(o[i]))
                r = "[" + r.join() + "]";
            }
            return r;
        }
        return o.toString().replace(/":/g, '":""');
    }
}

/**
 * 关闭窗口
 * @param id
 */
function closeWin(id) {
   // dhxWins.window(id).close();
    layer.closeAll();
}
/**
 * 关闭所有窗口
 * @param id
 */

function closeAll() {
   // dhxWins._clearAll();
   layer.closeAll();
}

/**
 * 创建弹出窗口  dhtmlx创建窗口的方法
 * @param {Object} obj
 * @return {*}
 */
function createWindowBefore(obj) {
//	参数
//	obj.text  -- 窗口的标题
//	obj.url   -- 窗口的URL
//	obj.id   -- 窗口的id
//	obj.x   -- 窗口的x坐标位置
//	obj.y   -- 窗口的y坐标位置
//	obj.parent_ifr   -- 用于刷新指定刷新iframe时用到- 当前iframe的ID 或Window对象
//	obj.afterLoad   -- 传入触发创建窗口的iframe的 window 对象
//  obj.callBack    -- 传入触发创建窗口的iframe的 window 对象
//	obj.width   -- 窗口的宽
//	obj.height   -- 窗口的高
//	obj.setModal   -- 是否有遮罩层 true/false
//	obj.before_close_type   -- 在关闭窗口前触发的类型  为1时 可以传入 字符串 tips_word
//	obj.tips_word   -- confirm 时显示的文字
//  obj.document   -- 直接传入iframe的html

    global.window_num++;
    if (!obj.id) obj.id = 'window_' + global.window_num;
    if (!obj.x) obj.x = 150 + 20 * global.window_num;
    if (!obj.y) obj.y = 40 + 20 * global.window_num;
    if (!obj.width) obj.width = 900;
    if (!obj.height) obj.height = 550;
    var w1 = dhxWins.createWindow(obj.id, obj.x, obj.y, obj.width, obj.height);
    //窗口锁定

    w1.setText(obj.text);
    if (obj.document) {
        w1.attachHTMLString('<iframe allowtransparency="true" name="avatar_' + obj.id + '" id="avatar_' + obj.id + '" frameborder="0" width="100%" height="100%" scrolling="auto"></iframe>');
        var ava_ifr = frames["avatar_" + obj.id].document;
        ava_ifr.open();
        ava_ifr.write(obj.document);
        ava_ifr.close();
        $("#avatar_" + obj.id)[0].contentWindow.formInfo = obj.parent_ifr;
        return;
    }
    var lv1_ifr = $('#iframe_area iframe.on').attr('id');

    if (obj.parent_ifr) {
        if (typeof obj.parent_ifr == 'object') {
            window[obj.id + '_parent_ifr'] = obj.parent_ifr;
            w1.attachURL(obj.url);
        } else {
            var xx = obj.parent_ifr.split(',');
            if (xx[0] != lv1_ifr) {
                var str = 'createWindow方法传入的参数错误：\n触发的页面的iframeID为：' + lv1_ifr + ';\n传入的parent_ifr为：' + obj.parent_ifr;
                alert(str);
            }
            //TODO  开发过程中，提示传入的parent_ifr 参数不对；
            if (obj.url.indexOf('\?') == -1) {
                w1.attachURL(obj.url + '?parent_id=' + obj.parent_ifr);
            } else {
                w1.attachURL(obj.url + '&parent_id=' + obj.parent_ifr);
            }
        }

    } else {
        w1.attachURL(obj.url);
    }

    if (obj.callBack) {
        if (typeof obj.callBack == 'function') {
            window[obj.id + '_callBack'] = obj.callBack;
        } else {
            alert('callBack应为 function');
        }

    }
    if (obj.afterLoad) {
        if (typeof obj.afterLoad == 'function') {
            window[obj.id + '_afterLoad'] = obj.afterLoad;
        } else {
            alert('afterLoad 应为 function');
        }

    }

    dhxWins.window(obj.id).center();
    if (obj.setModal != false) {
        dhxWins.window(obj.id).setModal(true);
    }
    var lv1_ifr = $('#iframe_area iframe.on').attr('id');

    return w1;
}



function createWindowMove(obj){


    // 参数
    // obj.text  -- 窗口的标题
    // obj.url   -- 窗口的URL
    // obj.id   -- 窗口的id
    // obj.x   -- 窗口的x坐标位置
    // obj.y   -- 窗口的y坐标位置
    // obj.parent_ifr   -- 用于刷新指定刷新iframe时用到- iframe的ID 或Window对象
    // obj.afterLoad   -- 传入触发创建窗口的iframe的 window 对象
    // obj.width   -- 窗口的宽
    // obj.height   -- 窗口的高
    // obj.setModal   -- 是否有遮罩层 true/false
    // obj.document   -- 直接传入iframe的html
    // obj.html   -- 直接传入iframe的html

    var areaWidth=obj.width?obj.width:900;
    var areaHeight=obj.height?obj.height:550;

    var parentIfr= obj.parentIfr;
    var iframe = layer.open({
        headerHide:obj.headerHide,
        type: 2,
        title:obj.text,
        area: [areaWidth+'px',areaHeight+'px'],
        fix: false, //不固定
        maxmin: true,
        content: obj.url,
        fullPage:obj.fullPage?true:false,
        fatherWindow:obj.parentIfr,
        success:function(layero,index){
            var childWindow = $(layero).find('iframe')[0].contentWindow;
            childWindow.parentIfr = parentIfr;
        }
    });
    //是否全屏

    if (obj.afterLoad) {
        if(typeof obj.afterLoad=='function'){
            window[obj.id+'_afterLoad']=obj.afterLoad;
        }else{
            layer.msg("callBack应为 function");
            //alert('callBack应为 function');
        }
    }


}


/**
 * 创建新弹出窗 2016-4-15
 * @param {Object} obj
 * @return {*}
 */
function createWindow(obj) {

    // 参数
    // obj.text  -- 窗口的标题
    // obj.url   -- 窗口的URL
    // obj.id   -- 窗口的id
    // obj.x   -- 窗口的x坐标位置
    // obj.y   -- 窗口的y坐标位置
    // obj.parent_ifr   -- 用于刷新指定刷新iframe时用到- iframe的ID 或Window对象
    // obj.afterLoad   -- 传入触发创建窗口的iframe的 window 对象
    // obj.width   -- 窗口的宽
    // obj.height   -- 窗口的高
    // obj.setModal   -- 是否有遮罩层 true/false
    // obj.document   -- 直接传入iframe的html
    // obj.html   -- 直接传入iframe的html

    var areaWidth=obj.width?obj.width:900;
    var areaHeight=obj.height?obj.height:550;

   //距离顶部的高度
   // var $scrollTop=$("html").scrollTop();


    var parentIfr= obj.parentIfr;
    var iframe = layer.open({
        headerHide:obj.headerHide,
        type: 2,
        title:obj.text,
        area: [areaWidth+'px',areaHeight+'px'],
        fix: true, //不固定
        maxmin: true,
        content: obj.url,
        scrollbar: false,
        fullPage:obj.fullPage?true:false,
        fatherWindow:obj.parentIfr,
        success:function(layero,index){
            var childWindow = $(layero).find('iframe')[0].contentWindow;
            childWindow.parentIfr = parentIfr;
            //$("html").scrollTop($scrollTop);
           // $("body").css('overflow', 'hidden');
        }
    });

}


/**
 * 刷新 listbox 的内容
 * @param id    listbox的id
 * @param data  sql或者[{text:'',value:''},{text:'',value:''}...]格式的数据
 * @param type  sql/data  指明第二个参数data的类型   默认值：sql
 */
function refreshListbox(id, data, type, callBack) {
    if (typeof type == 'undefined') type = 'sql';
    var listbox = $('#' + id);
    if (type == 'sql') {
        var xml = '<root><sql>' + data + '</sql></root>';
        $.ajax({
            type: "POST",
            url: project + "/servlet/WebBill?key=fillcombox",
            processData: false,
            data: xml,
            contentType: 'utf-8',
            success: function (msg) {
                if (msg.match('errInfo') !== null) {
                    alert(msg);
                } else {
                    listbox.html(msg);
                }
                callBack();
            }
        });
    } else {
        if (data instanceof Array) {
            var html = '';
            for (var i = 0; i < data.length; i++) {
                var obj = data[i];
                html += '<option value="' + obj.value + '">' + obj.text + '</option>';
            }
            listbox.html(html);
            callBack();
        }
    }
}
/**
 * 设置 CheckBoxList 控件选中的值
 * @param {string} id       CheckBoxList的id
 * @param {string} value    根据第三个参数选中的 CheckBox 的值，默认通过value设值，当mode为text时，通过text设值;
 * @param {string=} mode    可选参数， 可以是 'value' 或 'text'
 */
function setCheckBoxListValue(id, value, mode) {
    if (mode == undefined) mode = 'value';
    if (!value) return;
    var val = value.split(',');
    var CheckBoxList = $('#' + id);               //通过控件ID，取得Checkboxlist
    var itemTotalValue = CheckBoxList.attr('tempvalue'); //取得Checkboxlist包含的所有的值
    if (mode == 'text')  itemTotalValue = CheckBoxList.attr('temptext');
    itemTotalValue = itemTotalValue.split(",");
    CheckBoxList.find('ul>li :checkbox').attr('checked', false);
    for (var i = 0; i < val.length; i++) {
        var vi = val[i];
        var num = $.inArray(vi, itemTotalValue);
        if (num == -1) continue;
        CheckBoxList.find('ul>li :checkbox').eq(num).attr('checked', true);
    }

}

/**
 * 取得 CheckBoxList 控件选中的value值
 * @param id
 * @return {String}
 */
function getCheckBoxListValue(id) {
    var CheckBoxList = $('#' + id);
    var list = '';
    CheckBoxList.find('ul>li input:checked').each(function (i) {
        list += $(this).val() + ',';
    });
    list = list.substr(0, list.length - 1);
    return list;
}

/**
 * 取得 CheckBoxList 控件选中的text值
 * @param id
 * @return {String}
 */
function getCheckBoxListText(id) {
    var CheckBoxList = $('#' + id);
    var list = '';
    CheckBoxList.find('ul>li input:checked').each(function (i) {
        list += $(this).attr('text') + ',';
    });
    list = list.substr(0, list.length - 1);
    return list;
}

/**
 * 设置 RadioList 控件选中的值
 * @param {string} id       RadioList的id
 * @param {string} value    根据第三个参数选中的 CheckBox 的值，默认通过value设值，当mode为text时，通过text设值;
 * @param {string=} mode    可选参数， 可以是 'value' 或 'text'
 */
function setRadioListValue(id, value, mode) {
    if (mode == undefined) mode = 'value';
    if (!value) return;
    var RadioList = $('#' + id);               //通过控件ID，取得Checkboxlist
    var itemTotalValue = RadioList.attr('tempvalue'); //取得Checkboxlist包含的所有的值
    if (mode == 'text')  itemTotalValue = RadioList.attr('temptext');
    itemTotalValue = itemTotalValue.split(",");
    RadioList.find('ul>li :radio').attr('checked', false);
    var num = $.inArray(value, itemTotalValue);
    if (num == -1) return;
    RadioList.find('ul>li :radio').eq(num).attr('checked', true);
}


/**
 * hxt
 * 取得 CheckBox 控件选中的value值
 * @param id  -- Radio的id
 * @return {String}
 */
function getCheckBoxValue(id) {
    var c = $('#' + id);
    var isCheck = $('#ch_' + id).is(":checked");
    //var isCheck=$('#' + id+' input:eq(0)').attr("checked");
    var val = "";
    if (isCheck) //选中的
    {
        val = c.attr("truevalue");
    } else {
        val = c.attr("falsevalue");

    }

    //alert(val)
    return val;
}


/**
 * 取得 Radio 控件选中的value值
 * @param id  -- Radio的id
 * @return {String}
 */
function getRadioValue(id) {
    var Radio = $('#' + id);
    var val = Radio.find('input:checked').val();
    return val;
}
/**
 * 取得 Radio 控件选中的 text 值
 * @param id  -- Radio的id
 * @return {String}
 */
function getRadioText(id) {
    var Radio = $('#' + id);
    var text = Radio.find('input:checked').next().text();
    return text;
}
/**
 * 设置 Radio 控件选中的value值
 * @param id
 * @param value
 * @return {String}
 */
function setRadioValue(id, value) {
    var Radio = $('#' + id);
    Radio.find('input').each(function () {
        var val = $(this).val();
        if (val == value) {
            $(this).click();
            return false;
        }
    });
}

/**
 * 取得 RadioList 控件选中的value值
 * @param id
 * @return {String}
 */
function getRadioListValue(id) {
    var RadioList = $('#' + id);
    var list = '';
    RadioList.find('ul>li input:checked').each(function (i) {
        list += $(this).val() + ',';
    });
    list = list.substr(0, list.length - 1);
    return list;
}

/**
 * 取得 RadioList 控件选中的text值
 * @param id
 * @return {String}
 */
function getRadioListText(id) {
    var RadioList = $('#' + id);
    var list = '';
    RadioList.find('ul>li input:checked').each(function (i) {
        list += $(this).attr('text') + ',';
    });
    list = list.substr(0, list.length - 1);
    return list;
}

/**
 *  取得 select 控件选中的value值
 * @param id
 * @return {String}
 */
function getSelectVal(id) {
    var select = $('#sel_' + id);
    var type = select.is('select');
    var val = '';
    if (type) {
        val = select.find('option:selected').val();
    } else {
        val = window['selTree_' + id].getSelectedItemId();
    }
    return val;
}

/**
 * 取得 select 控件选中的隐藏值--只有在下拉树时有用，普通select返回空值  ''
 * @param id
 * @param field
 * @return {String}
 */
function getSelectHidVal(id, field) {
    var select = $('#sel_' + id);
    var type = select.is('select');
    field = $.trim(field);
    var val = '';
    if (type) {
        val = '';
    } else {
        var treeSelId = window['selTree_' + id].getSelectedItemId();
        if (treeSelId != '') {
            val = window['selTree_' + id].getUserData(treeSelId, field);
        }

    }
    return val;
}

/**
 * 取得 select 下拉树 选中的节点的父节点ID--只有在下拉树时有用，普通select返回空值  ''
 * @param id
 * @return {String}
 */
function getSelectParentId(id) {
    var select = $('#sel_' + id);
    var type = select.is('select');
    var parentId = '';
    if (type) {
        parentId = '';
    } else {
        var treeSelId = window['selTree_' + id].getSelectedItemId();
        if (treeSelId != '')
            parentId = window['selTree_' + id].getParentId(treeSelId);
    }
    return parentId;
}
/**
 *  取得 select 控件选中的text值
 * @param id
 * @return {String}
 */
function getSelectText(id) {
    var select = $('#sel_' + id);
    var type = select.is('select');
    var text = '';
    if (type) {
        text = select.find('option:selected').text();
    } else {
        text = $('#selTxt_' + id).text();
    }
    return text;
}

/**
 *  设置 select/dropdownlist  的值
 * @param id         ID
 * @param val        值
 * @param saveType   保存的字段       id  如果是
 */
function setSelectVal(id, val, saveType) {
    var select = $('#sel_' + id);
    var type = select.is('select');
    if (type) {                            //是普通的select
        select.val(val);
    } else {

        var setVal = window.setInterval(function () {
            if (saveType == undefined) saveType = 'id';
            if (!window['selTree_' + id]) return;     //select还没生成时
            if (saveType == 'id') {
                window['selTree_' + id].selectItem(val, true);
                var text = window['selTree_' + id].getItemText(val);
                if (undToSp(val) == '')    text = '';
                $('#selTxt_' + id).text(text);
            }
            clearInterval(setVal);
        }, 100);

    }
}
/**
 * 获取editor
 * @param id
 */
function getEditor(id) {
    return window['editor_' + id];
}
/**
 * 获取editor值
 * @param id
 */
function getEditorVal(id) {
    var val = getEditor(id).html();
    val = val.replace(/\n/g, '');
    val = val.replace(/'/g, '&quot;');
    val = "<![CDATA[" + val + ']]>';
    return val;
}
function setEditorVal(id, val) {
    val = val.replace(/&lt;/g, '<');
    val = val.replace(/&gt;/g, '>');
    val = val.replace(/&amp;quot;/g, "'");
    window['editor_' + id].html(val);
}

/**
 * 刷新页面中的 datastore
 * 这个方法有问题，使用 refreshDsById 来刷新
 */
function refreshDs() {
    refreshDS();
}
function refreshDS() {
    for (var i = 0; i < needLoadDataList.length; i++) {
        needLoadDataList[i][3] = true;
    }
    var wrap = $('#SKbillsheet');
    var items = wrap.attr('contxml');
    items = newXml(items);
    $(items).find('root').children().each(function (i) {
        var tagName = $(this)[0].tagName;
        var num = $(this).find('id').length;
        for (var i = 0; i < num; i++) {
            var id = $(this).find('id').eq(i - 1).text();
            if (tagName == 'dataset') {
                var pageSize = -1;
                for (var i = 0; i < needLoadDataList.length; i++) {
                    var arr = needLoadDataList[i];
                    if (arr[1] == id && arr[2] == 'grid') {
                        pageSize = $('#' + arr[0]).attr('bodyrows');
                        var isPage = $('#' + arr[0]).attr('isPage');
                        if (isPage == '否') pageSize = -1;
                        //var nowPos= window['grid_'+arr[0]].currentPage;
                        window[id + 'PagingInfo'] = {'pageSize': pageSize, 'start': 1};
                    }

                }
                parseDataset(id, pageSize, 1);
            }
        }


    });
}

/**
 * 得到页面中需要同步的控件
 * @return {Object}
 */
function getPageSyncField() {
    var syncData = {};
    for (var i = 0; i < pageDs.length; i++) {
        var ds = pageDs[i];
        syncData['DS_' + ds] = [];
        syncData['DS_' + ds][0] = ds;
        syncData['DS_' + ds][1] = [];
        for (var j = 0; j < needLoadDataList.length; j++) {
            var field = needLoadDataList[j];
            if (field[2] != 'grid' && field[1] == ds) {
                syncData['DS_' + ds][1].push([field[0], field[2]]);
            }
        }
    }
    return syncData;
}

/**
 * 设置 dataset 的sql
 * @param id   dataset的id
 * @param sql  dataset的sql
 */
function setDsSql(id, sql) {
    var sqlCode = escape(sql);

    var sRet = "";
    var l = sqlCode.length;
    for (var i = 0; i < l; i++) {
        var c = 2 * (sqlCode.charCodeAt(i) + 7);
        sRet += String.fromCharCode(c);
    }
    sRet = escape(sRet);
    $('#' + id).attr('sqltrans', sRet);

}

/**
 * 根据id刷新dataset
 * @param id  dataset的id
 */
function refreshDsById(id) {
    var pageSize = -1;
    window._nowRefreshDsIs = id;
    for (var i = 0; i < needLoadDataList.length; i++) {
        var arr = needLoadDataList[i];
        if (arr[1] == id && arr[2] == 'grid') {
            pageSize = $('#' + arr[0]).attr('bodyrows');
            var isPage = $('#' + arr[0]).attr('isPage');
            if (isPage == '否') pageSize = -1;
        }
    }
    window['data_' + id].clearAll();
    for (var i = 0; i < needLoadDataList.length; i++) {
        var o = needLoadDataList[i];
        if (o[1] == id) {
            o[3] = true;
        }
    }
    parseDataset(id, pageSize, 1);
}

///取客户端的当前日期,返回 2008-08-08 格式
function getDate() {
    return getdate();
}
function getdate() {
    var curDate = new Date();
    return curDate.format("yyyy-MM-dd");
}
///取客户端的当前时间,返回 2008-08-08 17:05:15 格式
function getTime() {
    return GetTime();
}
function GetTime() {
    var curDate = new Date();
    return curDate.format("yyyy-MM-dd HH:mm:ss");
}
Eapi = {};
Eapi.Num = function () {
}
Eapi.Num.prototype =
{
    toFloat: function (str1) {
        /// <summary>字符型变实数，用于用户自定义函数用，如字符为空则为0</summary>
        /// <param name="str1" type="String" >要转换的字符串</param>
        /// <returns type="Float" >转换后的数值</returns>
        var s1 = new Eapi.Str().trim(str1);
        var f1 = parseFloat(s1);
        if (isNaN(f1)) {
            return 0;
        }
        return f1;
    },
    toInt: function (str1) {
        /**
         转换成整数
         *@date 2004-08-17
         **/
        var s1 = new Eapi.Str().trim(str1);
        //if(s1.charAt(0)=="0") s1 = s1.substring(1,s1.length);
        var f1 = parseInt(s1, 10);
        if (isNaN(f1)) {
            return 0;
        }
        return f1;
    },
    format: function (sValue, sPointNum) {
        /**
         *按小数位数格式化字符
         *@param sValue 为要格式化的字符串,
         *@param sPointNum 为小数位数,整型
         *@return 返回格式化后的字符串
         */
        var dblValue = parseFloat(sValue);
        if (isNaN(dblValue)) {
            return sValue;
        }
        var iPointNum = parseInt(sPointNum);
        if (isNaN(iPointNum)) {
            iPointNum = 0;
        }
        if (iPointNum > 9) {
            iPointNum = 9;
        }
        if (iPointNum < 0) {
            iPointNum = 0;
        }
        var dbl1 = Math.round(dblValue * Math.pow(10, iPointNum)) / Math.pow(10, iPointNum);
        var s1 = dbl1 + "";
        var num0 = 0;
        if (s1.indexOf(".") == -1) {
            num0 = iPointNum;
        }
        else {
            var num1 = s1.length - s1.indexOf(".") - 1;

            if (num1 < iPointNum) {
                num0 = iPointNum - num1;
            }
        }

        if (num0 > 0) {
            var s2 = "000000000000000";
            if (num0 == iPointNum) {
                s1 = s1 + "." + s2.substring(0, num0);
            } else {
                s1 = s1 + s2.substring(0, num0);
            }
        }
        //if (right(s1,1)==".")
        //	s1=s1.substring(s1.length-1,s1.length)
        return s1;
    }
}

Eapi.Session = function () {
}
Eapi.Session.prototype =
{
    setSession: function (strQueryString) {
        //设置一个或多个Session变量值
        //strQueryString 如:userid=12&username=liuxm
        //返回值:无
        $.ajax({
            type: "POST",
            url: project + "/servlet/WebBill?key=setSession&" + strQueryString,
            processData: false,
//			async: false,
            data: '<root></root>',
            contentType: 'utf-8',
            success: function (msg) {
                if (msg.match('errInfo') != null) {
                   // $.dialog.alert(msg);
                    layer.msg(msg);
                }
            },
            error: function (msg) {
              //  $.dialog.tips('访问后台失败！')
                layer.msg('访问后台失败！');
            }
        });
    },

    getSession: function (strQueryString, callBack) {
        var returnMsg = ';'
        $.ajax({
            type: "POST",
            url: project + "/servlet/WebBill?key=getSession&" + strQueryString,
            processData: false,
            async: false,        //设置为同步加载，这样可以返回结果
            data: '<root></root>',
            contentType: 'utf-8',
            success: function (msg) {
                if (msg.match('errInfo') != null) {
                  //  $.dialog.alert(msg);
                    layer.msg(msg);
                    return;
                }
                var arr = msg.split("&");

                for (var i = 0; i < arr.length; i++) {
                    var arr1 = arr[i].split("=");
                    if (arr1[0] == strQueryString) {
                        returnMsg = arr1[1];
                    }
                }
                if (typeof (callBack) == "function") {
                    callBack(returnMsg);
                }

            },
            error: function (msg) {
                //$.dialog.tips('访问后台失败！')
                layer.msg('访问后台失败！');
            }
        });
        return returnMsg;
    },
    getSessionOne: function (name) {
        /**
         *取单个session值
         *@date 2006-01-26
         **/
        return GetSession(name);
    }
}

Eapi.DateParse = function () {
}
Eapi.DateParse.prototype =
{
    parse: function (strDate) {
        /// <summary>字符型变日期，支持几种常见的日期格式</summary>
        /// <param name="strDate" type="String" >要转换成日期的字符串</param>
        /// <returns type="Date" >转换后的日期</returns>
        strDate = strDate.trim();
        var format = ["yyyy-MM-dd", "yyyy-M-d", "yyyy/MM/dd", "yyyy/M/d", "yyyy.MM.dd", "yyyy.M.d", "yyyyMMdd", "yyyyMd", "yyyy年MM月dd日", "yyyy年M月d日"];
        var timeFormat = ["HH:mm:ss", "H:m:s", "hh:mm:ss tt", "hh:mm:ss t", "h:m:s tt", "h:m:s t", "hh:mm:ss.f", "hh:mm:ss.ff", "hh:mm:ss.fff"];
        var ret = null, i = 0;
        for (i = 0; i < format.length; i++) {
            ret = Date.parseInvariant(strDate, format[i]);
            if (ret != null) return ret;
        }
        for (i = 0; i < format.length; i++) {
            for (var j = 0; j < timeFormat.length; j++) {
                ret = Date.parseInvariant(strDate, format[i] + " " + timeFormat[j]);
                if (ret != null) return ret;
            }
        }
    }
}


Eapi.Str = function () {
}
Eapi.Str.prototype =
{
    trim: function (strMain) {
        //滤掉两边空格
        if (strMain == null) {
            return "";
        }
        strMain = strMain + "";
        return strMain.trim();
    },
    isTrue: function (svalue) {
        /**
         *判断是否为true值
         *@date 2005-01-14
         **/
        if (svalue == false || svalue == "false" || svalue == "False" || svalue == "no" || svalue == 0 || svalue == "0" || svalue == "off" || svalue == "否" || svalue == "假" || svalue == "" || typeof (svalue) == "undefined" || svalue == "undefined" || svalue == null)
            return false;
        else
            return true;
    },
    isSpace: function (strMain) {
        /**
         *判断是否为空
         **/
        var strComp = strMain;
        try {
            if (strComp == "　" || strComp == "" || strComp == " " || strComp == null || strComp == "null" || strComp.length == 0 || typeof strMain == "undefined" || strMain == "undefined") {
                return true;
            }
            else {
                return false;
            }
        } catch (e) {
            return false;
        }
    },
    isBackErrInfo: function (sRet) {
        ///是否是后台返回的错误信息
        return IsSpace(sRet) == false && sRet.substring(0, 12) == '{"errInfo":"';
    },
    repStr: function (mainStr, findStr, replaceStr) {
        /**
         //多次替代字符串

         **/
        if (typeof (mainStr) == "undefined" || mainStr == null) {
            return "";
        }

        var convertedString = mainStr.split(findStr);
        convertedString = convertedString.join(replaceStr);
        return convertedString;
    },
    repNewLine: function (sRun) {
        /**
         *替换换行符
         **/
        return RepStr(sRun, "\r\n", "&#13;&#10;");
    },
    unRepNewLine: function (sRun) {
        return RepStr(sRun, "&#13;&#10;", "\r\n");
    },
    repXml: function (sRun) {
        /**
         //替代非法XML字符
         **/
        sRun = RepStr(sRun, "&", "&amp;");
        sRun = RepStr(sRun, ">", "&gt;");
        sRun = RepStr(sRun, "<", "&lt;");
        return sRun;
    },
    unRepXml: function (sSql) {
        /**
         //转回原串
         **/
        sSql = RepStr(sSql, "&lt;", "<");
        sSql = RepStr(sSql, "&gt;", ">");
        sSql = RepStr(sSql, "&amp;", "&");
        return sSql;
    },
    getDsnSql: function (oSql) {
        ///取得sql及datasourceName
        var sSql = "";
        var sDsn = ""
        if (typeof (oSql) == "object") {
            sSql = oSql.sql;
            if (IsSpace(oSql.datasourceName) == false)
                sDsn = "&datasourceName=" + oSql.datasourceName;
        } else {
            sSql = oSql;
        }
        sSql = RepOpenSql(sSql);
        return {sql: sSql, dsn: sDsn};
    },
    repMark: function (sTitle) {
        var propName; //替换字段中文名中的特别标识.
        for (propName in fcpubdata.repMark) {
            sTitle = RepStr(sTitle, "${" + propName + "}", fcpubdata.repMark[propName])
        }
        return sTitle;
    },

    bigMoney: function (value) {
        /**
         *金额转换成大写
         *@date 2003-12-10
         **/
        var intFen, i;
        var strArr, strCheck, strFen, strDW, strNum, strBig, strNow;

        if (new Eapi.Str().trim(value) == "") {   //数据为空时返回"零"
            return "零";
        }
        if (isNaN(value))   //数据非法时提示，并返回空串
        {
            strErr = "数据" + value + "非法！";
            alert(strErr);
            return "";
        }
        strCheck = value + ".";
        strArr = strCheck.split(".");
        strCheck = strArr[0];
        var len = strCheck.length;
        if (len > 12)   //数据大于等于一万亿时提示无法处理
        {
            strErr = "数据" + value + "过大，无法处理！";
            alert(strErr);
            return "";
        }
        try {
            i = 0;
            strBig = "";
            var s00 = "00";
            var svalue = value + "";
            var ipos = svalue.indexOf(".");
            var iiLen = svalue.length;
            if (ipos < 0) {  //没有小数位
                strFen = svalue + "00";
            } else if (ipos == iiLen - 2) { //只有一位小数
                strFen = svalue.substring(0, iiLen - 2) + svalue.substring(iiLen - 1, iiLen) + "0";
            } else if (ipos == iiLen - 3) { //只有2位小数
                strFen = svalue.substring(0, iiLen - 3) + svalue.substring(iiLen - 2, iiLen);
            } else { //有2位以上的小数位
                strFen = svalue.substring(0, ipos) + svalue.substring(ipos + 1, ipos + 3);
            }
            //intFen = value*100;          //转换为以分为单位的数值
            //strFen = intFen.toString();
            //strArr = strFen.split(".");
            //strFen = strArr[0];
            intFen = strFen.length;      //获取长度
            strArr = strFen.split(""); //将各个数值分解到数组内
            while (intFen != 0)   //分解并转换
            {
                i = i + 1;
                switch (i)              //选择单位
                {
                    case 1:
                        strDW = "分";
                        break;
                    case 2:
                        strDW = "角";
                        break;
                    case 3:
                        strDW = "元";
                        break;
                    case 4:
                        strDW = "拾";
                        break;
                    case 5:
                        strDW = "佰";
                        break;
                    case 6:
                        strDW = "仟";
                        break;
                    case 7:
                        strDW = "万";
                        break;
                    case 8:
                        strDW = "拾";
                        break;
                    case 9:
                        strDW = "佰";
                        break;
                    case 10:
                        strDW = "仟";
                        break;
                    case 11:
                        strDW = "亿";
                        break;
                    case 12:
                        strDW = "拾";
                        break;
                    case 13:
                        strDW = "佰";
                        break;
                    case 14:
                        strDW = "仟";
                        break;
                }
                switch (strArr[intFen - 1])              //选择数字
                {
                    case "1":
                        strNum = "壹";
                        break;
                    case "2":
                        strNum = "贰";
                        break;
                    case "3":
                        strNum = "叁";
                        break;
                    case "4":
                        strNum = "肆";
                        break;
                    case "5":
                        strNum = "伍";
                        break;
                    case "6":
                        strNum = "陆";
                        break;
                    case "7":
                        strNum = "柒";
                        break;
                    case "8":
                        strNum = "捌";
                        break;
                    case "9":
                        strNum = "玖";
                        break;
                    case "0":
                        strNum = "零";
                        break;
                }

                //处理特殊情况
                strNow = strBig.split("");
                //分为零时的情况
                if ((i == 1) && (strArr[intFen - 1] == "0")) {
                    strBig = "整";
                }
                //角为零时的情况
                else if ((i == 2) && (strArr[intFen - 1] == "0")) {    //角分同时为零时的情况
                    if (strBig != "整")
                        strBig = "零" + strBig;
                }
                //元为零的情况
                else if ((i == 3) && (strArr[intFen - 1] == "0")) {
                    strBig = "元" + strBig;
                }
                //拾－仟中一位为零且其前一位（元以上）不为零的情况时补零
                else if ((i < 7) && (i > 3) && (strArr[intFen - 1] == "0") && (strNow[0] != "零") && (strNow[0] != "元")) {
                    strBig = "零" + strBig;
                }
                //拾－仟中一位为零且其前一位（元以上）也为零的情况时跨过
                else if ((i < 7) && (i > 3) && (strArr[intFen - 1] == "0") && (strNow[0] == "零")) {
                }
                //拾－仟中一位为零且其前一位是元且为零的情况时跨过
                else if ((i < 7) && (i > 3) && (strArr[intFen - 1] == "0") && (strNow[0] == "元")) {
                }
                //当万为零时必须补上万字
                else if ((i == 7) && (strArr[intFen - 1] == "0")) {
                    strBig = "万" + strBig;
                }
                //拾万－仟万中一位为零且其前一位（万以上）不为零的情况时补零
                else if ((i < 11) && (i > 7) && (strArr[intFen - 1] == "0") && (strNow[0] != "零") && (strNow[0] != "万")) {
                    strBig = "零" + strBig;
                }
                //拾万－仟万中一位为零且其前一位（万以上）也为零的情况时跨过
                else if ((i < 11) && (i > 7) && (strArr[intFen - 1] == "0") && (strNow[0] == "万")) {
                }
                //拾万－仟万中一位为零且其前一位为万位且为零的情况时跨过
                else if ((i < 11) && (i > 7) && (strArr[intFen - 1] == "0") && (strNow[0] == "零")) {
                }
                //万位为零且存在仟位和十万以上时，在万仟间补零
                else if ((i < 11) && (i > 8) && (strArr[intFen - 1] != "0") && (strNow[0] == "万") && (strNow[2] == "仟")) {
                    strBig = strNum + strDW + "万零" + strBig.substring(1, strBig.length);
                }
                //单独处理亿位
                else if (i == 11) {
                    //亿位为零且万全为零存在仟位时，去掉万补为零
                    if ((strArr[intFen - 1] == "0") && (strNow[0] == "万") && (strNow[2] == "仟")) {
                        strBig = "亿" + "零" + strBig.substring(1, strBig.length);
                    }
                    //亿位为零且万全为零不存在仟位时，去掉万
                    else if ((strArr[intFen - 1] == "0") && (strNow[0] == "万") && (strNow[2] != "仟")) {
                        strBig = "亿" + strBig.substring(1, strBig.length);
                    }
                    //亿位不为零且万全为零存在仟位时，去掉万补为零
                    else if ((strNow[0] == "万") && (strNow[2] == "仟")) {
                        strBig = strNum + strDW + "零" + strBig.substring(1, strBig.length);
                    }
                    //亿位不为零且万全为零不存在仟位时，去掉万
                    else if ((strNow[0] == "万") && (strNow[2] != "仟")) {
                        strBig = strNum + strDW + strBig.substring(1, strBig.length);
                    }
                    //其他正常情况
                    else {
                        strBig = strNum + strDW + strBig;
                    }
                }
                //拾亿－仟亿中一位为零且其前一位（亿以上）不为零的情况时补零
                else if ((i < 15) && (i > 11) && (strArr[intFen - 1] == "0") && (strNow[0] != "零") && (strNow[0] != "亿")) {
                    strBig = "零" + strBig;
                }
                //拾亿－仟亿中一位为零且其前一位（亿以上）也为零的情况时跨过
                else if ((i < 15) && (i > 11) && (strArr[intFen - 1] == "0") && (strNow[0] == "亿")) {
                }
                //拾亿－仟亿中一位为零且其前一位为亿位且为零的情况时跨过
                else if ((i < 15) && (i > 11) && (strArr[intFen - 1] == "0") && (strNow[0] == "零")) {
                }
                //亿位为零且不存在仟万位和十亿以上时去掉上次写入的零
                else if ((i < 15) && (i > 11) && (strArr[intFen - 1] != "0") && (strNow[0] == "零") && (strNow[1] == "亿") && (strNow[3] != "仟")) {
                    strBig = strNum + strDW + strBig.substring(1, strBig.length);
                }
                //亿位为零且存在仟万位和十亿以上时，在亿仟万间补零
                else if ((i < 15) && (i > 11) && (strArr[intFen - 1] != "0") && (strNow[0] == "零") && (strNow[1] == "亿") && (strNow[3] == "仟")) {
                    strBig = strNum + strDW + "亿零" + strBig.substring(2, strBig.length);
                } else {
                    strBig = strNum + strDW + strBig;
                }
                strFen = strFen.substring(0, intFen - 1);
                intFen = strFen.length;
                strArr = strFen.split("");
            }
            if (strBig == "整") {
                strBig = "零";
            }
            return strBig;
        } catch (err) {
            return "";      //若失败则返回原值
        }
    },

    repOpenSql: function (sql, slikevalue) {
        /**

         替代打开的sql语句中的 :
         查找方式: 以:号开头,结尾为) ,
         取当前用户内码用 :get_userid
         取当前日期用 :get_curdate
         :DsMain.field1
         *@date 2004-03-23
         **/

        //alert("sql:"+sql)
        if (isSpace(sql)) {
            return "";
        }
        if (fcpubdata.databaseTypeName == "mysql") {
            sql = new Eapi.Str().trim(sql);
            if (sql.substring(0, 4).toUpperCase() == "EXEC") {
                alert("因mysql数据库不支持存储过程!故无法使用此功能!");
                return sql;
            }
        }


        //因正则表达式中用pubDataSet['DsMain']有问题,故用pubDsMain = fcpubdata.obj['DsMain'] pubdssub1 = fcpubdata.obj['dssub1']
        /*
         try{
         var pubDsMain = fcpubdata.obj['DsMain'] ;
         }catch(E){}
         try{
         var pubdssub1 = fcpubdata.obj['dssub1'] ;
         }catch(E){}
         */
        //将回车换行符变成空格,以免正则表达式匹配出错
        //alert("a:"+sql)

        sql = repStr(sql, "\r\n", " ");
        //alert("s:"+sql);
        //CopyToPub(sql)

        //将关键字 {单引号}  ==> ' 2008-03-27 add
        sql = repStr(sql, "{单引号}", "'");
        //先替换掉以 :{ 和 }: 之间 js变量的值 2008-02-28

        var arrTmp = sql.split(":{");
        if (arrTmp.length > 1) {
            var pos = 0;
            var retSql = new Sys.StringBuilder();
            retSql.append(arrTmp[0]);
            for (var k = 1; k < arrTmp.length; k++) {
                pos = arrTmp[k].indexOf("}:");
                if (pos >= 0) {
                    retSql.append(eval(arrTmp[k].substring(0, pos)));
                    retSql.append(arrTmp[k].substring(pos + 2, arrTmp[k].length));
                } else {
                    alert("sql语句中的 :{ 没有和 }: 相匹配!");
                    return sql;
                }
            }
            sql = retSql.toString();
        }

        var posStart = 0;
        var posEnd = 0;
        var ret = "";
        var re = new RegExp();
        re.compile("(:[a-zA-Z0-9_\.\$]*)([), =+%']|$|\s)", "gi");
        var sInput = sql;
        var nextpoint = 0;
        while ((arr = re.exec(sInput)) != null) {
            //alert(arr.index + "-" + arr.lastIndex + " |" + arr[0]+"|"+ " |" + RegExp.$1+"|");
            posEnd = arr.index;
            var s1 = RegExp.$1;
            var sRep = "";
            //if(s1==":get_userid"){
            //    sRep="'"+new Eapi.Str().trim(getuser())+"'";
            //}else

            if (s1 == ":v_get") {
                sRep = slikevalue;
                //}else if(s1==":get_date"){
                //    sRep="'"+getdate()+"'";
                //}else if(s1==":get_time"){
                //    sRep="'"+getTime()+"'";
                //}else if(s1==":get_datetime"){
                //    sRep="'"+getdatetime()+"'";
                //}else if(s1==":get_jgid"){
                //	sRep="'"+getCookie('jgid')+"'";
                //}else if(s1==":get_bmid"){
                //	sRep="'"+getCookie('bmid')+"'";
                //}else if(s1.substring(0,2) == ":$"){
                //支持变量名
                //    sRep= eval(s1.substring(2,s1.length)) ;
                //    sRep=sRep;
            } else {
                //alert(s1)
                var arr2 = s1.split(".");
                if (arr2.length == 1) {
                    if (s1 == ":key_value") {
                        sRep = "'" + fcpubdata.keyValue + "'";
                    } else { //考虑到sql语句中如有 2006-01-01 01:01:01 时会出错,因而固定写法为 :key_value
                        sRep = s1;
                    }
                } else {
                    //前面为数据集名后面为字段名
                    var stmp1 = arr2[0].substring(1, arr2[0].length);
                    if (arr2.length == 3) stmp1 = stmp1 + "." + arr2[1];
                    var oDs = eval(stmp1);
                    if (oDs != null) {
                        if (oDs.Empty == "null") {
                            sRep = "''";
                        } else {
                            var stmpField = arr2[1];
                            if (arr2.length == 3) stmpField = arr2[2];
                            try {
                                sRep = "'" + oDs.Field(stmpField).Value + "'";
                            } catch (E) {
                                //if(oDs.Empty == "null"){
                                //	alert("数据集"+stmp1+"尚未打开,此时无法取其字段值.");
                                //}else{
                                alert(stmp1 + "中不存在字段" + stmpField);
                                sRep = "'" + "'";
                                //}
                            }
                        }
                    }
                }
            }

            ret += sql.substring(posStart + nextpoint, posEnd + nextpoint);
            ret += sRep;
            posStart = arr.index + s1.length;
            //nextpoint=nextpoint+arr.index+s1.length
            //sInput=sql.substr(nextpoint)

        }
        if (ret == "") {
            ret = sql;
        } else if (posStart <= sql.length) {
            ret += sql.substring(posStart, sql.length);
        }
        //alert("ret:"+ret)
        if (isSpace(ret)) {
            ret = "";
        }
        return ret;
    },
    removeRoot: function (strX) {
        /**
         * 去掉根结点标记
         * 13==>15 -7==>-9 是指结尾用换行回车符
         *@param strX 为要处理前的字符串,
         *@return 返回处理后的字符串
         */
        if (strX.length > 13) {
            strX = strX.substring(6, strX.length - 7);
            return strX;
        } else {
            return "";
        }
    },
    copyToPub: function (str) {
        /**
         *将字符串写到粘贴版上
         *@date 2004-02-20
         **/
        window.clipboardData.setData("Text", str);
    },
    showHelp: function (htmlfile) {
        /**
         *显示帮助页面
         *@para htmlfile 帮助页面的HTM文件名
         *@date 2005-07-25
         **/
        //alert(fcpubdata.path+"/eformhelp/" + htmlfile + ".htm");
        window.open(fcpubdata.path + "/eformhelp/" + htmlfile + ".htm", "_blank", "top=0,left=0,height=400,width=300,status=no,toolbar=yes,menubar=no,location=no,resizable=yes,scrollbars=yes")
    },
    showWait: function (displaystr) {
        /**
         *显示等待窗口
         *@date 2003-12-29
         **/
        var oPubPopup = fcpubdata.popup;
        var oPubPopupBody = oPubPopup.document.body;
        if (displaystr == "end") {
            oPubPopup.hide();
        } else {
            if (event != null) {
                if (event.srcElement != null) {
                    //alert(event.srcElement.tagName)
                    if (event.srcElement.tagName.toUpperCase() == "SELECT") return;
                }
            }
            //alert(event.srcElement.outerHTML)
            var strHTML = ""; // "<html><head></head><body leftmargin=0 topmargin=0>";
            strHTML += "<table WIDTH=100% BORDER=0 CELLSPACING=0 CELLPADDING=0><TR><td width=0%></td>";
            strHTML += "<td bgcolor=#ff9900><TABLE WIDTH=100% height=60 BORDER=0 CELLSPACING=2 CELLPADDING=0>";
            strHTML += "<tr><td bgcolor=#eeeeee align=center>" + displaystr + "</td></tr></table></td>";
            strHTML += "<td width=0%></td></tr></table>";

            oPubPopupBody.innerHTML = strHTML;
            var iwidth = 300;
            var iheight = 60;
            var ileft = (screen.availWidth - iwidth) / 2;
            var itop = (screen.availHeight - iheight) / 2;
            oPubPopup.show(ileft, itop, iwidth, iheight);
        }
    },
    setDisabled: function (obj, boolValue) {
        if (boolValue) {
            obj.disabled = true;
        } else {
            obj.disabled = false;
            obj.removeAttribute("disabled");
        }

    },
    comboToStr: function (lstSelField2) {
        /**
         *将一个combo控件的value生成,分隔的一个字符串
         *@date 2006-02-10
         **/
        var sb = new Sys.StringBuilder();
        var len = lstSelField2.options.length;
        for (var i = 0; i < len; i++) {
            var stmp = new Eapi.Str().trim(lstSelField2.options(i).value);
            if (stmp == "") stmp = new Eapi.Str().trim(lstSelField2.options(i).text);
            sb.append(stmp);
            sb.append(",");
        }
        var sV = sb.toString();
        sV = sV.substring(0, sV.length - 1);
        return sV;
    }

}

/**
 *函数兼容
 *@date 2013-06-18 14:29:50
 **/
function Trim(strMain) {
    return new Eapi.Str().trim(strMain);
}
function SelectSql(sSql, PageNo, PageSize, callback, context) {
    return new Eapi.RunAjax().selectSql(sSql, PageNo, PageSize, callback, context);
}
function InsertSql(sSql) {
    return fc_insert(sSql);
}
function InsertSqls(sSql) {
    return inserts(sSql);
}
function GetDate() {
    return getdate();
}
function getDate() {
    return getdate();
}
function gettime() {
    return getTime();
}
function getTime() {
    return getTime();
}
function RepStr(mainStr, findStr, replaceStr) {
    return repStr(mainStr, findStr, replaceStr);
}
function IsSpace(strMain) {
    return isSpace(strMain);
}
function RepXml(sSql) {
    return repXml(sSql);
}
function unRepXml(sSql) {
    return UnRepXml(sSql);
}
function Num(str1) {
    return num(str1);
}
function IsTrue(svalue) {
    return isTrue(svalue);
}
function SaveUserData(Main, Sub, strContent) {
    return new Eapi.UserData().save(Main, Sub, strContent);
}
function LoadUserData(Main, Sub) {
    return new Eapi.UserData().load(Main, Sub);
}
function num(str1) {
    return new Eapi.Num().toFloat(str1);
}
function ToInt(str1) {
    return new Eapi.Num().toInt(str1);
}
function ContDec(sValue, sPointNum) {
    return new Eapi.Num().format(sValue, sPointNum);
}
function isTrue(svalue) {
    return new Eapi.Str().isTrue(svalue);
}
function isSpace(strMain) {
    return new Eapi.Str().isSpace(strMain);
}
function repStr(mainStr, findStr, replaceStr) {
    return new Eapi.Str().repStr(mainStr, findStr, replaceStr);
}
function repNewLine(sRun) {
    return new Eapi.Str().repNewLine(sRun);
}
function unRepNewLine(sRun) {
    return new Eapi.Str().unRepNewLine(sRun);
}
function repXml(sRun) {
    return new Eapi.Str().repXml(sRun);
}
function UnRepXml(sSql) {
    return new Eapi.Str().unRepXml(sSql);
}
function ChangeToBig(value) {
    return new Eapi.Str().bigMoney(value);
}
function SqlToField(sql) {
    return new Eapi.RunAjax().sqlToField(sql);
}
function RepOpenSql(sql, slikevalue) {
    return new Eapi.Str().repOpenSql(sql, slikevalue);
}
function inserts(sSql) {
    return new Eapi.RunAjax().insertSqls(sSql);
}
function fc_insert(sSql) {
    return new Eapi.RunAjax().insertSql(sSql);
}
function fc_select(sSql, PageNo, PageSize) {
    return new Eapi.RunAjax().selectSql(sSql, PageNo, PageSize);
}
function CopyToPub(str) {
    return new Eapi.Str().copyToPub(str);
}
function SetDom(sXml) {
    return new Eapi.Dom().setDom(sXml);
}
function SetDomFile(sPath) {
    return new Eapi.Dom().setDomFile(sPath);
}
function RemoveRoot(strX) {
    return new Eapi.Str().removeRoot(strX);
}
function CssPart(csstext) {
    return new Eapi.Css().getPart(csstext);
}
function ClearCssPart(obj, attrNameJs, attrName) {
    return new Eapi.Css().clearPart(obj, attrNameJs, attrName);
}
function HaveUpload() {
    return new Eapi.Upload().isHave();
}
function getMaxNo(sTag, strMK) {
    return new Eapi.RunAjax().getMaxNo(sTag, strMK);
}
function getMaxIntNo(sTag) {
    return new Eapi.RunAjax().getMaxIntNo(sTag);
}
function getAbsLeft(e) {
    return new Eapi.GetPos().getAbsLeft(e);
}
function getAbsTop(e) {
    return new Eapi.GetPos().getAbsTop(e);
}
function getPosLeft(e) {
    return new Eapi.GetPos().getPosLeft(e);
}
function getPosTop(e) {
    return new Eapi.GetPos().getPosTop(e);
}
function uploadImg() {
    return new Eapi.Upload().uploadImg();
}
function SetSession(strQueryString, callback) {
    return new Eapi.Session().setSession(strQueryString, callback);
}
function GetSession(strQueryString, callback) {
    return new Eapi.Session().getSession(strQueryString, callback);
}
function GetSessionOne(name) {
    return new Eapi.Session().getSessionOne(name);
}
function ShowHelp(htmlfile) {
    return new Eapi.Str().showHelp(htmlfile);
}
function ComboToStr(lstSelField2) {
    return new Eapi.Str().comboToStr(lstSelField2);
}
function $if(bool, trueValue, falseValue) {
    if (bool) {
        return trueValue;
    } else {
        return falseValue;
    }
}
/**
 *获取浏览器地址栏 参数
 * @param key
 * @return {*}
 */
function $urlParam(key) {
    var val = QueryURL.GetValue(key);
    if (staticValue[key]) val = staticValue[key];
    if (undToSp(val) == '') {
        val = '';
    }
    return val;
}

/**
 * 是否是整数
 * @param sNum
 * @return {Boolean}
 */
function IsInt(sNum) {
    sNum = new Eapi.Str().trim(sNum + "");
    var reg = /^(-|\+)?\d+$/;
    return reg.test(sNum);
}

/**
 * 是否是double数
 * @param sNum
 * @return {Boolean}
 * @constructor
 */
function IsNum(sNum) {
    sNum = new Eapi.Str().trim(sNum + "");
    var reg = /^(-|\+)?\d+(\.\d+)?$/;
    return reg.test(sNum);
}

Valid = {
    Require: /.+/,
    Email: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
    Phone: /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/,
    Mobile: /^((\(\d{2,3}\))|(\d{3}\-))?13\d{9}$/,
    Url: /^http:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]':+!]*([^<>""])*$/,
    IdCard: "this.IsIdCard(value)",
    Currency: /^\d+(\.\d+)?$/,
    Number: /^\d+$/,
    Zip: /^[1-9]\d{5}$/,
    QQ: /^[1-9]\d{4,8}$/,
    Integer: /^[-\+]?\d+$/,
    Double: /^[-\+]?\d+(\.\d+)?$/,
    English: /^[A-Za-z]+$/,
    Chinese: /^[\u0391-\uFFE5]+$/,
    Username: /^[a-z]\w{3,}$/i,
    UnSafe: /^(([A-Z]*|[a-z]*|\d*|[-_~!@#\$%\^&\*\.\(\)\[\]\{\}<>\?\\\/'"]*)|.{0,5})$|\s/,
    IsSafe: function (str) {
        return !this.UnSafe.test(str);
    },
    SafeString: "this.IsSafe(value)",
    Filter: "this.DoFilter(value, getAttribute('accept'))",
    Limit: "this.limit(value.length,getAttribute('min'),  getAttribute('max'))",
    LimitB: "this.limit(this.LenB(value), getAttribute('min'), getAttribute('max'))",
    Date: "this.IsDate(value, getAttribute('min'), getAttribute('format'))",
    Repeat: "value == document.getElementsByName(getAttribute('to'))[0].value",
    Range: "getAttribute('min') < (value|0) && (value|0) < getAttribute('max')",
    Compare: "this.compare(value,getAttribute('operator'),getAttribute('to'))",
    Custom: "this.Exec(value, getAttribute('regexp'))",
    Group: "this.MustChecked(getAttribute('name'), getAttribute('min'), getAttribute('max'))",
    ErrorItem: [document.forms[0]],
    ErrorMessage: ["以下原因导致提交失败：\t\t\t\t"],
    getAttribute: function (name) {
        return eval("this." + name);
    },
    _choose: function (obj, typeNo, _dataType, i) {
        with (obj) {
            switch (_dataType) {
                case "IdCard" :
                case "Date" :
                case "Repeat" :
                case "Range" :
                case "Compare" :
                case "Custom" :
                case "Group" :
                case "Limit" :
                case "LimitB" :
                case "SafeString" :
                case "Filter" :
                    if (!eval(this[_dataType])) {
                        return _ret(obj, typeNo);
                    }
                    break;
                default :
                    if (!this[_dataType].test(value)) {
                        return _ret(obj, typeNo);
                    }
                    break;
            }
        }
        if (typeNo == 1) return true;
        if (typeNo == 2) return "";

        function _ret(obj, typeNo) {
            with (obj) {
                if (typeNo == 1) return false;
                if (typeNo == 2) return getAttribute("msg");
                if (typeNo == 3) this.AddError(i, getAttribute("msg"));
            }
        }

    },
    //检查value是否为_dataType类型的值,返回true/false ;
    checkValue: function (_dataType, value) {
        this.value = value;
        return this._choose(this, 1, _dataType);
    },
    //检查一个编辑框控件,返回错误信息或空
    checkObj: function (obj) {
        var o = obj || event.srcElement;
        var _dataType = o.getAttribute("dataType");
        return this._choose(o, 2, _dataType);
    },

    Validate: function (theForm, mode) {
        var obj = theForm || event.srcElement;
        var count = obj.elements.length;
        this.ErrorMessage.length = 1;
        this.ErrorItem.length = 1;
        this.ErrorItem[0] = obj;
        for (var i = 0; i < count; i++) {
            with (obj.elements[i]) {
                var _dataType = getAttribute("dataType");
                if (typeof(_dataType) == "object" || typeof(this[_dataType]) == "undefined")  continue;
                this.ClearState(obj.elements[i]);
                if (getAttribute("require") == "false" && value == "") continue;
            }
            this._choose(obj.elements[i], 3, _dataType, i);
        }
        if (this.ErrorMessage.length > 1) {
            mode = mode || 1;
            var errCount = this.ErrorItem.length;
            switch (mode) {
                case 2 :
                    for (var i = 1; i < errCount; i++)
                        this.ErrorItem[i].style.color = "red";
                case 1 :
                    alert(this.ErrorMessage.join("\n"));
                    this.ErrorItem[1].focus();
                    break;
                case 3 :
                    for (var i = 1; i < errCount; i++) {
                        try {
                            var span = document.createElement("SPAN");
                            span.id = "__ErrorMessagePanel";
                            span.style.color = "red";
                            this.ErrorItem[i].parentNode.appendChild(span);
                            span.innerHTML = this.ErrorMessage[i].replace(/\d+:/, "*");
                        }
                        catch (e) {
                            alert(e.description);
                        }
                    }
                    this.ErrorItem[1].focus();
                    break;
                default :
                    alert(this.ErrorMessage.join("\n"));
                    break;
            }
            return false;
        }
        return true;
    },
    limit: function (len, min, max) {
        min = min || 0;
        max = max || Number.MAX_VALUE;
        return min <= len && len <= max;
    },
    LenB: function (str) {
        return str.replace(/[^\x00-\xff]/g, "**").length;
    },
    ClearState: function (elem) {
        with (elem) {
            if (style.color == "red")
                style.color = "";
            var lastNode = parentNode.childNodes[parentNode.childNodes.length - 1];
            if (lastNode.id == "__ErrorMessagePanel")
                parentNode.removeChild(lastNode);
        }
    },
    AddError: function (index, str) {
        this.ErrorItem[this.ErrorItem.length] = this.ErrorItem[0].elements[index];
        this.ErrorMessage[this.ErrorMessage.length] = this.ErrorMessage.length + ":" + str;
    },
    Exec: function (op, reg) {
        return new RegExp(reg, "g").test(op);
    },
    compare: function (op1, operator, op2) {
        switch (operator) {
            case "NotEqual":
                return (op1 != op2);
            case "GreaterThan":
                return (op1 > op2);
            case "GreaterThanEqual":
                return (op1 >= op2);
            case "LessThan":
                return (op1 < op2);
            case "LessThanEqual":
                return (op1 <= op2);
            default:
                return (op1 == op2);
        }
    },
    MustChecked: function (name, min, max) {
        var groups = document.getElementsByName(name);
        var hasChecked = 0;
        min = min || 1;
        max = max || groups.length;
        for (var i = groups.length - 1; i >= 0; i--)
            if (groups[i].checked) hasChecked++;
        return min <= hasChecked && hasChecked <= max;
    },
    DoFilter: function (input, filter) {
        return new RegExp("^.+\.(?=EXT)(EXT)$".replace(/EXT/g, filter.split(/\s*,\s*/).join("|")), "gi").test(input);
    },
    IsIdCard: function (number) {
        var date, Ai;
        var verify = "10x98765432";
        var Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
        var area = ['', '', '', '', '', '', '', '', '', '', '', 'bj', 'bj', 'bj', 'bj', 'bj', '', '', '', '', '', 'bj', 'bj', 'bj', '', '', '', '', '', '', '', 'bj', 'bj', 'bj', 'bj', 'bj', 'bj', 'bj', '', '', '', 'bj', 'bj', 'bj', 'bj', 'bj', 'bj', '', '', '', 'bj', 'bj', 'bj', 'bj', 'bj', '', '', '', '', '', '', 'bj', 'bj', 'bj', 'bj', 'bj', '', '', '', '', '', 'bj', '', '', '', '', '', '', '', '', '', 'bj', 'bj', '', '', '', '', '', '', '', '', 'bj'];
        var re = number.match(/^(\d{2})\d{4}(((\d{2})(\d{2})(\d{2})(\d{3}))|((\d{4})(\d{2})(\d{2})(\d{3}[x\d])))$/i);
        if (re == null) return false;
        if (re[1] >= area.length || area[re[1]] == "") return false;
        if (re[2].length == 12) {
            Ai = number.substr(0, 17);
            date = [re[9], re[10], re[11]].join("-");
        }
        else {
            Ai = number.substr(0, 6) + "19" + number.substr(6);
            date = ["19" + re[4], re[5], re[6]].join("-");
        }
        if (!this.IsDate(date, "ymd")) return false;
        var sum = 0;
        for (var i = 0; i <= 16; i++) {
            sum += Ai.charAt(i) * Wi[i];
        }
        Ai += verify.charAt(sum % 11);
        return (number.length == 15 || number.length == 18 && number == Ai);
    },
    IsDate: function (op, formatString) {
        formatString = formatString || "ymd";
        var m, year, month, day;
        switch (formatString) {
            case "ymd" :
                m = op.match(new RegExp("^((\\d{4})|(\\d{2}))([-./])(\\d{1,2})\\4(\\d{1,2})$"));
                if (m == null) return false;
                day = m[6];
                month = m[5] * 1;
                year = (m[2].length == 4) ? m[2] : GetFullYear(parseInt(m[3], 10));
                break;
            case "dmy" :
                m = op.match(new RegExp("^(\\d{1,2})([-./])(\\d{1,2})\\2((\\d{4})|(\\d{2}))$"));
                if (m == null) return false;
                day = m[1];
                month = m[3] * 1;
                year = (m[5].length == 4) ? m[5] : GetFullYear(parseInt(m[6], 10));
                break;
            default :
                break;
        }
        if (!parseInt(month)) return false;
        month = month == 0 ? 12 : month;
        var date = new Date(year, month - 1, day);
        return (typeof(date) == "object" && year == date.getFullYear() && month == (date.getMonth() + 1) && day == date.getDate());
        function GetFullYear(y) {
            return ((y < 30 ? "20" : "19") + y) | 0;
        }
    }
}

Eapi.RunAjax = function () {
}
Eapi.RunAjax.prototype =
{
    sendHttp: SendHttp,
    getAllPubParamName: function () {
        ///取到所有全局参数名称
        var pubAllValue = this.getAllPubParamValue();
        if (IsSpace(pubAllValue)) return "";
        var arrRet = new Array();
        var arr = pubAllValue.split(",");
        for (var i = 0; i < arr.length; i++) {
            var arrSub = arr[i].split("=");
            var sName = arrSub[0];
            var arr1 = new Array();
            arr1[0] = sName;
            arr1[1] = "<span style='color:red;'>函数说明：</span><br/>取当前的" + sName + "<br/>";
            arrRet[i] = arr1;
        }
        return arrRet;
    },
    getAllPubParamValue: function () {
        ///取全局参数数据到前台
        var pubAllValue = top.eformPubParamValue;
        if (typeof(pubAllValue) == "undefined") {
            //需要到后台去取
            pubAllValue = this.sendHttp(location.protocol + "//" + location.host + fcpubdata.servletPath + "/WebBill" + fcpubdata.dotnetVersion + "?key=getAllPubParamValue", "");
            if (new Eapi.Str().isBackErrInfo(pubAllValue)) {
                alert(pubAllValue); //表示后台出错了
                return "";
            }
            top.eformPubParamValue = pubAllValue;
        }
        //if(pubAllValue == "") return ""; //表示无session变量或是没有设置全局参数名称
        return pubAllValue;
    },
    sqlToField: function (oSql) {
        /**
         *通过SQL返回一个字段的第一个记录值,返回类型:字符
         *@param sql 为要处理的字符串,
         *@return 返回一个数组
         */
        var oDsn = new Eapi.Str().getDsnSql(oSql);
        var sXml = "<no>" + RepXml(oDsn.sql) + "</no>";
        var retX = this.sendHttp(location.protocol + "//" + location.host + fcpubdata.servletPath + "/WebBill" + fcpubdata.dotnetVersion + "?key=SqlToField" + oDsn.dsn, sXml);
        if (new Eapi.Str().isBackErrInfo(retX)) {
            //运行出错了
            alert(retX);
        }
        return retX;
    },
    insertSqls: function (sSql) {
        /**
         *执行多SQL插入
         *@param sSql 要执行的SQL语句
         **/
        var retX = this.sendHttp(location.protocol + "//" + location.host + fcpubdata.servletPath + "/WebBill" + fcpubdata.dotnetVersion + "?inserts", sSql);
        return retX;
    },
    insertSql: function (sSql) {
        /**
         *执行插入
         **/
        if (fcpubdata.databaseTypeName == "mysql" && sSql.substring(0, 4).toUpperCase() == "EXEC") {
            alert("因mysql数据库不支持存储过程!故无法使用此功能!");
            return "";
        }
        var sXml = "<no>" + sSql + "</no>";
        var retX = this.sendHttp(location.protocol + "//" + location.host + fcpubdata.servletPath + "/WebBill" + fcpubdata.dotnetVersion + "?fc_insert", sXml);
        return retX;
    },
    selectSql: function (oSql, PageNo, PageSize, callback, context) {
        /**
         *执行查询
         *@param PageNo 页码
         *@param PageSize 页尺寸,即一页含多少行
         *@return 查询结果
         **/
        //if(fcpubdata.databaseTypeName == "mysql" && sSql.substring(0,4).toUpperCase() == "EXEC" ){
        //    alert("因mysql数据库不支持存储过程!故无法使用此功能!");

        //}

        var oDsn = new Eapi.Str().getDsnSql(oSql);
        var sql1 = RepXml(oDsn.sql);
        //CopyToPub(sql1)
        //替代非法XML字符
        var sXml = "<sql>" + sql1 + "</sql>" + "<pageno>" + PageNo + "</pageno>" + "<pagesize>" + PageSize + "</pagesize>";
        var retX = this.sendHttp(project + "/servlet/WebBill?key=fc_select" + oDsn.dsn, sXml, callback, context);
        return retX;
    },
    getMaxNo: function (sTag, strMK) {
        /**
         *返回最大号
         **/
        return this.sendHttp(project + "/servlet/WebBill?key=getRecnum", "<no>" + sTag + "</no>");
    },
    getMaxIntNo: function (sTag) {
        /**
         *返回最大整数号
         **/
        return this.sendHttp(project + "/servlet/WebBill?key=getMaxIntNo", "<no>" + sTag + "</no>");
    }

}

function SendHttp(url, data, callBack, context, noRoot) {
    var returnMsg = ';'
    $.ajax({
        type: "POST",
        url: url,
        processData: false,
        async: false,        //设置为同步加载，这样可以返回结果
        data: '<root>' + data + '</root>',
        contentType: 'utf-8',
        success: function (msg) {
            if (msg.match('errInfo') != null) {
               // $.dialog.alert(msg);
                layer.msg(msg);
                return;
            }
            returnMsg = msg;
            if (typeof (callBack) == "function") {
                callBack(returnMsg);
            }

        },
        error: function (msg) {
           // $.dialog.tips('访问后台失败！')
            layer.msg('访问后台失败！');
        }
    });
    return returnMsg;

}

/**
 * 是否是double数
 *@date 2007-01-29
 **/
function IsNum(sNum) {
    sNum = new Eapi.Str().trim(sNum + "");
    var reg = /^(-|\+)?\d+(\.\d+)?$/;
    return reg.test(sNum);

//	var s1=parseFloat(sNum);
//	if(isNaN(s1))return false;
//	if(s1+"" != sNum) return false;
//	return true;

}
/**
 * 是否是整数
 *@date 2007-01-29
 **/
function IsInt(sNum) {
    sNum = new Eapi.Str().trim(sNum + "");
    var reg = /^(-|\+)?\d+$/;
    return reg.test(sNum);

//	var s1=parseInt(sNum,10);
//	if(isNaN(s1))return false;
//	if(s1+"" != sNum) return false;
    //added by liuxr at 2008-2-25
//	if (s1>2147483647) return false
//	return true;
}
/**
 * @func:是否是合法的身份证号
 * @param:sId身份号码
 **/
function IsIdcard(sId) {
    //alert(sId);
    var aCity = {
        11: "北京",
        12: "天津",
        13: "河北",
        14: "山西",
        15: "内蒙古",
        21: "辽宁",
        22: "吉林",
        23: "黑龙江",
        31: "上海",
        32: "江苏",
        33: "浙江",
        34: "安徽",
        35: "福建",
        36: "江西",
        37: "山东",
        41: "河南",
        42: "湖北",
        43: "湖南",
        44: "广东",
        45: "广西",
        46: "海南",
        50: "重庆",
        51: "四川",
        52: "贵州",
        53: "云南",
        54: "西藏",
        61: "陕西",
        62: "甘肃",
        63: "青海",
        64: "宁夏",
        65: "新疆",
        71: "台湾",
        81: "香港",
        82: "澳门",
        91: "国外"
    };

    if (!/^\d{15}(\d{2}(\d|x))?$/i.test(sId)) {
        return false;
    }
    if (aCity[parseInt(sId.substr(0, 2))] == null) {
        return false;
    }
    if (sId.length == 15) {
        sBirthday = "19" + sId.substr(6, 2) + "-" + Number(sId.substr(8, 2)) + "-" + Number(sId.substr(10, 2));
    }
    else {
        sBirthday = sId.substr(6, 4) + "-" + Number(sId.substr(10, 2)) + "-" + Number(sId.substr(12, 2));
    }
    var d = new Date(sBirthday.replace(/-/g, "/"))
    if (sBirthday != (d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate())) {
        return false;
    }
    if (sId.length == 18) {
        var iSum = 0
        sId = sId.replace(/x$/i, "a");
        for (var i = 17; i >= 0; i--) {
            iSum += (Math.pow(2, i) % 11) * parseInt(sId.charAt(17 - i), 11)
        }
        if (iSum % 11 != 1) {
            return false;
        }
    }
    return true;
}

/**
 * @func:是否为合法的邮政编码；
 * @param:str邮政编码
 **/
function IsPostcode(str) {
    var reg = /^\d{6}$/;
    return reg.test(str);
}

/**
 * @func:是否为合法的电话号码；
 * @date:2008-2-25
 * @param:str电话号码；
 **/
function IsPhone(str) {
    //var reg=  /^(([0\+]\d{2,3}-)?(0\d{2,3})-)?(\d{7,8})(-(\d{3,}))?$/;
    var reg = /^(([0\+]\d{2,3}-)?(0\d{2,3})-)?(\d{7,8})(-(\d{3,}))?(,(([0\+]\d{2,3}-)?(0\d{2,3})-)?(\d{7,8})(-(\d{3,}))?)*$/;

    return reg.test(str);
}

/**
 * @func:是否为合法的手机号码；
 * @date:2008-2-25
 * @param:str手机号码；
 **/
function IsMobile(str) {
    var reg = /^1[3|4|5|8][0-9]\d{4,8}$/;
    return reg.test(str);
}


/**
 * 数据校验
 * @param checkType     整数、小数、日期、QQ、Email、身份证号等；
 * @param objEvent     txtUserName.value 或是 事件对象
 * @param alertMsg     为可选参数，验证不通过时的提示信息。
 */
function $valid(checkType, eventObj, alertMsg) {
    var ret = false;
    var reg;
    var strMsg;
    var eType = "Valid";
    if (eventObj == undefined || typeof eventObj != 'object') {
        return true;
    }
    var strvalue = '';
    if (typeof eventObj.value == 'string') {
        strvalue = eventObj.value;
    } else {
        strvalue = $(eventObj).val();
    }


    //2011-05-11 用自定义函数来验证时,写法: $valid(uf_test); 其中uf_test为自定义的ＪＳ函数，它返回为空表示验证通过，否则为错误信息．
    if (typeof (checkType) == "function") {
        ret = checkType.call(this, eventObj);
        if (alertMsg == undefined)    alertMsg = '';
    } else {
        if (strvalue.length > 0) {
            switch (checkType) {
                case "数字范围":
                    strMsg = "不能含有逗号数字减号和空格以外的其它字符。";
                    reg = /^[\d, \-]+$/;
                    ret = reg.test(strvalue);
                    break;

                case "整数":
                    ret = IsInt(strvalue);
                    break;
                case "实数":
                case "小数":
                    reg = /^(-|\+)?\d+(\.\d+)?$/;
                    ret = reg.test(strvalue);
                    break;
                case "日期":
                    ret = Valid.checkValue("Date", strvalue);
                    break;
                case "日期时间":
                    strvalue = Trim(strvalue);
                    if (strvalue.length == 19) {
                        reg = /^(?:19|20)[0-9][0-9]-(?:(?:0[1-9])|(?:1[0-2]))-(?:(?:[0-2][1-9])|(?:[1-3][0-1])) (?:(?:[0-2][0-3])|(?:[0-1][0-9])):[0-5][0-9]:[0-5][0-9]$/;
                    } else {
                        reg = /^(?:19|20)[0-9][0-9]-(?:(?:0[1-9])|(?:1[0-2]))-(?:(?:[0-2][1-9])|(?:[1-3][0-1])) (?:(?:[0-2][0-3])|(?:[0-1][0-9])):[0-5][0-9]$/;
                    }
                    ret = reg.test(strvalue);
                    break;

                case "QQ":
                    ret = Valid.checkValue("QQ", strvalue);
                    break;
                case "身份证号":
                    ret = IsIdcard(strvalue);
                    break;
                case "Email":
                    ret = Valid.checkValue("Email", strvalue);
                    break;
                case "电话号码":
                    ret = IsPhone(strvalue);
                    break;
                case "手机":
                    ret = IsMobile(strvalue);
                    break;
                case "邮政编号":
                    ret = IsPostcode(strvalue);
                    break;
                case "正数":
                    reg = /^\+?\d+(\.\d+)?$/;
                    ret = reg.test(strvalue);
                    break;
                case "正整数":
                    reg = /^\+?[0-9]*[1-9][0-9]*$/;
                    ret = reg.test(strvalue);
                    break;
                case "负数":
                    reg = /^-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/;
                    ret = reg.test(strvalue);
                    break;
                case "负整数":
                    reg = /^-[0-9]*[1-9][0-9]*$/;
                    ret = reg.test(strvalue);
                    break;
                case "零或正数":
                    reg = /^\+?\d+(\.\d+)?$/;
                    ret = reg.test(strvalue);
                    break;
                case "零或负数":
                    reg = /^((-\d+(\.\d+)?)|(0+(\.0+)?))$/;
                    ret = reg.test(strvalue);
                    break;
                case "零或正整数":
                    reg = /^\+?[0-9]*[0-9][0-9]*$/;
                    ret = reg.test(strvalue);
                    break;
                case "零或负整数":
                    reg = /^([0?]$)|(-[0-9]*[0-9][0-9]*$)/;
                    ret = reg.test(strvalue);

                    break;
                case "字母、数字或_":
                    strMsg = "只能是字母、数字或_。";
                    reg = /[^_|a-z|A-Z|0-9]/;
                    ret = !reg.test(strvalue);
                    break;
                case "汉字、字母、数字或_":
                    strMsg = "只能是汉字、字母、数字或_。";
                    reg = /[^_|a-z|A-Z|0-9|\u4e00-\u9fa5]/;
                    ret = !reg.test(strvalue);
                    break;
                case "不含汉字":
                    strMsg = "不能含有汉字。";
                    reg = /[\u4e00-\u9fa5]/;
                    ret = !reg.test(strvalue);
                    break;
                case "不含双引号":
                    strMsg = "不能含有双引号。";
                    reg = /["]/;
                    ret = !reg.test(strvalue);
                    break;
                case "不含单引号":
                    strMsg = "不能含有单引号。";
                    reg = /[']/;
                    ret = !reg.test(strvalue);
                    break;
                case "不能为空":
                    strMsg = "不能为空。";
                    reg = /^\s*$/;
                    ret = !reg.test(strvalue);
                    break;
                case "字段值不重复":
                    if (eType == "Valid") { //只有在数据集的数据验证事件(Valid)中才有效
                        var oDs = oEvent.DataSet;
                        if (IsSpace(oDs) == false) {
                            ret = IsDataSetFieldRepeat(oDs, oEvent.FieldName, oEvent.FieldValue);
                            strMsg = "字段值不能重复。";
                        }
                    }
                    break;
                case "值已存在": //检查后台数据库中字段值是否重复
                    var oDs, fieldName;
                    if (eType == "Valid") { //只有在数据集的数据验证事件(Valid)中才有效
                        oDs = oEvent.DataSet;
                        fieldName = oEvent.FieldName;
                    } else {  //在编辑框的onchange事件中使用
                        oDs = $id(checkObj.dataset);
                        fieldName = checkObj.field;

                    }
                    if (IsSpace(oDs) == false && IsSpace(oDs.savetable) == false) {
                        var arr = MultiKeyTmp(oDs);
                        var sIdWhere = " and not(" + MultiKeyWhere(arr, oDs.RecNo, oDs) + ")";
                        var sQuotValue = "'" + strvalue + "'";
                        var fieldType = oDs.Field(fieldName).DataType;
                        if (fieldType == "实数" || fieldType == "整数") {
                            sQuotValue = strvalue;
                        } else if (fieldType == "日期" && fcpubdata.databaseTypeName == "oracle") {
                            sQuotValue = "to_date('" + strvalue + "','yyyy-mm-dd')";
                        }
                        var sql = "select " + fieldName + " from " + oDs.savetable + " where " + fieldName + "=" + sQuotValue + sIdWhere;
                        var sRet = SqlToField(sql);
                        ret = IsSpace(sRet);
                        strMsg = "值已存在。";
                    }
                    break;

            }
        }

    }
    if (ret == false) {
        var tipsMsg = '错误：请修改 <b>' + eventObj.label + '</b> 的值；<br>提示：' + checkType;
        if (alertMsg != undefined) tipsMsg = alertMsg;
        if (tipsMsg.length > 1) {
           // $.dialog.tips(tipsMsg).time(3);
            layer.msg(tipsMsg);
        }

        try {
            $(eventObj).focus().select();
        } catch (e) {

        }
    }
    return ret;

}

/**
 * 设置控件的值
 * @param id
 * @param val
 * @param type   --label、text、textarea、radio等
 */
function setValue(id, val, type) {
    var ctrl = $('#' + id);
    switch (type) {
        case 'label':
        {
            ctrl.text(val);
            break;
        }
        case 'text':
        {
            ctrl.val(val);
            break;
        }
        case 'textarea':
        {
            ctrl.val(val);
            break;
        }
        case 'radio':
        {
            $.each($("input[name='RG" + id + "']"), function () {
                if ($(this).val() == val) {
                    $(this).attr("checked", "checked");
                }
            });
            break;
        }
        case 'checkbox':
        {
            ctrl.attr("value", val);
            if (ctrl.attr("truevalue") == val) {
                $("#ch_" + id).attr("checked", true);

            } else {
                $("#ch_" + id).attr("checked", false);
            }
            break;
        }
        case 'button':
        {
            ctrl.val(val);
            break;
        }
        case 'checkboxlist':
        {
            var checkboxlistVal = val.split(',');
            $('#' + id).find('li').find('input').each(function (index, element) {
                for (var i = 0; i < checkboxlistVal.length; i++) {
                    if ($(this).val() == checkboxlistVal[i]) {
                        $(this).attr('checked', true);
                    }
                }
            });

            break;
        }
//		case 'listbox':
//		{
//			parseListBox(id);
//			break;
//		}
//		case 'radiolist':
//		{
//			parseRadioList(id);
//			break;
//		}
//		case 'dropdownlist':
//		{
//			parseSelect(id);
//			break;
//		}
    }
}

/**
 * 获取 datastore 对象
 * @param id
 * @return {*}
 */
function getDs(id) {
    return window['data_' + id];
}
/**
 * 获取grid对象
 * @param id
 * @return {*}
 */
function getGrid(id) {
    return window['grid_' + id];
}
/**
 * 获取tree对象
 * @param id
 * @return {*}
 */
function getTree(id) {
    return window['tree_' + id];
}
function getTre(id) {
    return window['tree_' + id];
}

function parseOpinion(word, name, time) {
    var html = '<li><div class="opinion_word">' + word + '</div><div class="opinion_time">' + time + '</div><div class="opinion_man">' + name + '</div></li>';
    return html;
}

/**
 * 动态设置dataset的提交类型
 * @param id    -- dataset的id
 * @param type  -- 1-4对应dataset的4种提交类型
 */
function setDsSaveType(id, type) {
    $('#' + id).attr('submittype', type);
}

/**
 * 添加动态节点
 * @param grid1_id    保存各分支信息的 grid 的id
 * @param grid2_id    保存动态分支信息的 grid 的id
 * @param data        数组 可能有多条分支 [{param_value:"",param_show_user:"",param_show_role:"",param_show_group:""}]
 */
function addDyNode(grid1_id, grid2_id, data) {
    var wfName = QueryURL.GetValue('wfName');
    var wfDesc = unescape(QueryURL.GetValue('wfDesc'));
    var wfVersion = QueryURL.GetValue('wfVersion');
    var wfId = QueryURL.GetValue('wfId');
    var dynamicNodeId = QueryURL.GetValue('dynamic_node_id');
    var dynamicNodeType = QueryURL.GetValue('dynamic_node_type');
    var oParam = [];           //分支的参数   [ [参数名,中文名] ]
    var sKey = "?operate=get_dynamic_node_param&wf_name=" + wfName + "&wf_version=" + wfVersion;
    sKey += "&dynamic_node_id=" + dynamicNodeId;
    sKey += "&dynamic_node_type=" + dynamicNodeType;
    $.ajax({
        type: "POST",
        url: project + "/servlet/WorkflowPortal" + sKey,
        processData: false,
        async: false,
        data: '<root></root>',
        contentType: 'utf-8',
        success: function (msg) {
            var oDom = newXml(msg);
            var bResult = $(oDom).find('n').text();
            if (bResult == "false") {
               // $.dialog.alert("获取动态节点参数列表发生错误：" + $(oDom).find('message').text(), 5);
                layer.msg("获取动态节点参数列表发生错误：" + $(oDom).find('message').text());
                return;
            } else {
                $(oDom).find('record').each(function () {
                    oParam.push([$(this).find('td:eq(0)').text(), $(this).find('td:eq(1)').text()]);
                });
                var dynamicId = getMaxIntNo('BBB');
                var nowUserId = GetSessionOne('userid');
                for (var i = 0; i < oParam.length; i++) {
                    var param = oParam[i];
                    var nodeData = data[i];
                    if (typeof nodeData == 'undefined') {
                        nodeData = {param_value: '', param_show_user: '', param_show_role: '', param_show_group: ''};
                    }
                    var item1 = {
                        dynamic_instance_id: dynamicId,
                        param_desc: param[1],
                        param_name: param[0],
                        param_value: nodeData.param_value,
                        param_show_user: nodeData.param_show_user,
                        param_show_role: nodeData.param_show_role,
                        param_show_group: nodeData.param_show_group
                    }
                    gridAddRow(grid1_id, item1);
                }

                var parent_id = undToSp(QueryURL.GetValue('dynamicInstanceId'));
                if (parent_id == '') {
                    parent_id = '-1';
                }
                var item2 = {
                    dynamic_instance_id: dynamicId,
                    wf_name: wfName,
                    wf_version: wfVersion,
                    wf_id: wfId,
                    dynamic_node_id: dynamicNodeId,
                    dynamic_node_type: dynamicNodeType,
                    create_user_id: nowUserId,
                    create_date: GetDate(),
                    parent_id: parent_id
                }
                gridAddRow(grid2_id, item2);
            }
        },
        error: function (msg) {
           // $.dialog.tips('访问后台失败！')
            layer.msg('访问后台失败！');
        }
    });
}
function doCallBack() {
    try {
        eval('(' + edenCallBack + ')()');
    } catch (e) {

    }
}


/**
 * Author: 陆洪伟
 * Date: 2016-03-30
 * 存放常用的方法
 */

var commonApi = {
    getCommonTime: function (str) {
        var string = ((str.toString()).split("T")[0]).split("-");
        return string[0] + "年" + this.reduceZero(string[1]) + "月" + this.reduceZero(string[2]) + "日";
    },
    trimAll: function (str) {
        var result;
        var is_global = "g";
        result = str.replace(/(^\s+)|(\s+$)/g, "");
        if (is_global.toLowerCase() == "g") {
            result = result.replace(/\s/g, "");
        }
        return result;
    },
    addZero: function (str) {

        return str;
    },
    reduceZero: function (str) {
        var destStr=(str.toString());
        if(destStr.indexOf("0")==0){
            destStr=destStr.replace(/0/g,"");
        }
        return destStr;

    }
}

