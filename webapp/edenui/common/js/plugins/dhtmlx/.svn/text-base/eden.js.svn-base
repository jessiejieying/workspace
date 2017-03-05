/**
 * 此文件中方法需要引jQuery库
 */
if (!window.global)   global = {};//全局对象
global.eDialog_num = 0;
var projectName = window.top.base;
/**
 * Obj2str ： 转换 json对象为 字符类型
 */

var tool = {
    Obj2str: function (o) {
        if (o == undefined) {
            return "";
        }
        var r = [];
        if (typeof o == "string") return "\"" + o.replace(/(["\\])/g, "\\$1").replace(/(\n)/g, "\\n").replace(/(\r)/g, "\\r").replace(/(\t)/g, "\\t") + "\"";
        if (typeof o == "object") {
            if (!o.sort) {
                for (var i in o)
                    r.push("\"" + i + "\":" + tool.Obj2str(o[i]));
                if (!!document.all && !/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(o.toString)) {
                    r.push("toString:" + o.toString.toString());
                }
                r = "{" + r.join() + "}"
            } else {
                for (var i = 0; i < o.length; i++)
                    r.push(tool.Obj2str(o[i]))
                r = "[" + r.join() + "]";
            }
            return r;
        }
        return o.toString().replace(/":/g, '":""');
    }
}
if (typeof JSON == "undefined") {
    JSON = {};
    JSON.parse = function (str) {
        return eval('(' + str + ')');
    }
}
/**
 * 用于form的 template类型  返回 my97datepicker 类型的input
 * @param name
 * @param value
 * @return {String}
 */
function dateType(name, value) {
    return '<input class="dhxform_textarea" style=" width: 100%;" value="' + value + '" type="text" onClick="WdatePicker()"/>';
}

/**
 * 用于form的 template类型  返回 my97datepicker 类型的input yyyy-MM-dd HH:mm:ss
 * @param name
 * @param value
 * @return {String}
 */
function dateType1(name, value) {
    return '<input class="dhxform_textarea" style=" width: 100%;" value="' + value + '" type="text" onClick="WdatePicker({dateFmt:\'yyyy-MM-dd HH:mm:ss\'})"/>';
}

/**
 * 将后台返回的时间中的 'T' 替换成 ' '
 * @param time
 * @return {String}
 */
function parseTime(time) {
    time = time.replace('T', ' ');
    return time;
}


/**
 * 传入xml string字符串，返回XMLDocument对象
 * @param xmlStr    --   xml string字符串
 * @return {*}
 */
function newXml(xmlStr) {

    var testBower = /msie/.test(navigator.userAgent.toLowerCase());
    // 先前版本为   testBower=$.browser.msie; 不过需要jq低版本支持

    var xmlDoc = null;
    if (testBower) {
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM")
        xmlDoc.async = "false"
        xmlDoc.loadXML(xmlStr)
    } else {
        xmlDoc = new DOMParser().parseFromString(xmlStr, "text/xml");
    }
    return xmlDoc;
}

/**
 * 把 undefined 转换为 ''
 * @param str
 * @return {*}
 */
function undToSp(str) {
    if (str == 'undefined' || str == undefined || str == null)  str = '';
    return str;
}

/**
 * 初始化工作流
 * @param wfName
 * @param wfDesc
 * @param wfVersion
 */
function initWorkflow(wfName, wfDesc, wfVersion) {
    layer.msg('初始化流程中！');
    var sKey = "/servlet/WorkflowPortal?operate=init_workflow&wf_name=" + wfName + "&wf_version=" + wfVersion;
    var project = window.top.base;
    var servletPath = project;
    project += '/form';
    $.ajax({
        type: "POST",
        url: servletPath + sKey,
        processData: false,
        data: "<root></root>",
        contentType: 'utf-8',
        success: function (msg) {
            if (msg.match('errInfo') != null) {
                var oDom = newXml(msg);
                var alertMsg = $(oDom).find('message').text();
                layer.msg(alertMsg);
            } else {
                var oDom = newXml(msg);
                var wfid;
                var sUrl = "";
                var height = $(window.top).height();
                var bResult = $(oDom).find('n').text();
                if (bResult == "false") {
                    layer.msg($(oDom).children().children().text());
                    return;
                }
                //根据  <stage>init,step</stage>来判断调用那个页面
                //=init 有多个初始化action，列表让用户选择个执行，流程未初始化，没得到wfid(流程实例id)
                var stage = $(oDom).find('stage').text();
                if (stage == "init") {
                    var sXml = "<root>";
                    sXml += "<wfname>" + wfName + "</wfname>";
                    sXml += "<wfdesc>" + escape(wfDesc) + "</wfdesc>"
                    sXml += "<wfversion>" + wfVersion + "</wfversion>";

                    var oActionList = $(oDom).find('action');
                    var name, id;
                    for (var i = 0; i < oActionList.length; i++) {
                        var nowAction = $(oDom).find('action').eq(i);
                        name = escape(nowAction.attr("name"));
                        id = nowAction.attr("id");

                        sXml += "<action name ='" + name + "' id='" + id + "'/>";
                    }
                    sXml += "</root>";

                    var surl = project + "/fceform/common/djframe.htm?djsn=wf_action_list&djtype=WF";
                    surl += "&domxml=" + sXml;

                    surl += "&wfName=" + wfName;
                    surl += "&wfDesc=" + escape(wfDesc);
                    surl += "&wfVersion=" + wfVersion;

//          window.top.createWindow({   id:'workFlow',
//                text                  :wfDesc,
//                setModal              :true,
//                url                   :surl,
//                width                 :'800',
//                height                :height - 30,
//                parent_ifr            :window,
//                afterClose            :function () {
//                  if(window.top.getModuleFrame('start'))
//                  {
//                    window.top.getModuleFrame('start').taskReload('flow_task');
//                  }
//
//                }
//              }
//
//          );


                    window.open(surl);
                    return;
                }
                //=step 只有一个初始化的action,后台已经执行了此action，即流程已经初始化了，得到了wfid(流程实例id)
                if (stage == "step") {
                    var num = $(oDom).find('num').text(); //步骤的当前可执行的 action数量
                    var wfId = $(oDom).find('wfId').text();//流程实例id

                    if (num == 1) {//直接链接到action的view中
                        var action = $(oDom).find("action");
                        var actionId = undToSp(action.attr("id"));
                        var actionName = undToSp(action.attr("name"));
                        var view = undToSp(action.attr("view"));
                        var traceId = undToSp(action.attr("traceId"));//加当前步骤主键id 2011-9-17
                        var actionStepId = undToSp(action.attr("stepId"));
                        var fieldkey = undToSp(action.attr("field_key"));
                        var fieldkeyvalue = undToSp(action.attr("field_key_value"));
                        var dynamicId = undToSp(action.attr("dynamic_instance_id"));


                        if (view == "") {//没有view,则出现action选择页，点击action名字，执行doAction
                            var sXml = "<root>";
                            sXml += "<wfname>" + wfName + "</wfname>";
                            sXml += "<wfdesc>" + escape(wfDesc) + "</wfdesc>"
                            sXml += "<wfversion>" + wfVersion + "</wfversion>";
                            sXml += "<action name ='" + escape(actionName) + "' id='" + actionId + "'";
                            sXml += " field_key='" + fieldkey + "' ";
                            sXml += " field_key_value='" + fieldkeyvalue + "' ";
                            if (dynamicId != '')
                                sXml += " dynamic_instance_id='" + dynamicId + "' ";
                            sXml += " traceId='" + traceId + "' ";//2011-9-17

                            sXml += "/>";

                            sXml += "</root>";

                            var surl = project + "/fceform/common/djframe.htm?djsn=wf_action_list&djtype=WF";
                            surl += "&domxml=" + sXml;
                            surl += "&wfId=" + wfId;

                            surl += "&wfName=" + wfName;
                            surl += "&wfDesc=" + escape(wfDesc);
                            surl += "&wfVersion=" + wfVersion;
                            surl += "&stepId=" + actionStepId;

//              window.top.createWindow({   id:'workFlow',
//                    text                  :wfDesc,
//                    setModal              :true,
//                    url                   :surl,
//                    width                 :'800',
//                    height                :height - 30,
//                    parent_ifr            :window,
//                    afterClose            :function () {
//                      if(window.top.getModuleFrame('start'))
//                      {
//                        window.top.getModuleFrame('start').taskReload('flow_task');
//                      }
//                    }
//                  }
//
//              );

                            window.open(surl);
                            return;
                        } else {//有view的直接进入view链接的表单页面，表单提交的时候，同时做流程doAction
                            var surl = project + unescape(view);
                            surl = surl + "&wfName=" + wfName;
                            surl = surl + "&wfDesc=" + escape(wfDesc);
                            surl = surl + "&wfVersion=" + wfVersion;
                            surl = surl + "&wfId=" + wfId
                            surl = surl + "&actionId=" + actionId;
                            surl = surl + "&traceId=" + traceId;//2011-9-17
                            surl += "&stepId=" + actionStepId;
                            if (fieldkey != "")
                                surl = surl + "&" + fieldkey + "=" + fieldkeyvalue;
                            if (dynamicId != '')
                                surl = surl + "&dynamicInstanceId=" + dynamicId; //在wf_tools.htm页面会获取此参数 唯一一个dynamicInstanceId的参数，没带
                            //window.open(project + surl);
//              window.top.createWindow({   id:'workFlow',
//                    text                  :wfDesc,
//                    setModal              :true,
//                    url                   :surl,
//                    width                 :'800',
//                    height                :height - 30,
//                    parent_ifr            :window,
//                    afterClose            :function () {
//                      if(window.top.getModuleFrame('start'))
//                      {
//                        window.top.getModuleFrame('start').taskReload('flow_task');
//                      }
//                    }
//                  }
//
//              );

                            window.open(surl);
                            return;
                        }
                    } else {//多个action，用户选择一个执行
                        var sXml = "<root>";
                        sXml += "<wfname>" + wfName + "</wfname>";
                        sXml += "<wfdesc>" + escape(wfDesc) + "</wfdesc>"
                        sXml += "<wfversion>" + wfVersion + "</wfversion>";

                        var oActionList = $(oDom).find('action');
                        var name, id, view, traceId;
                        for (var i = 0; i < oActionList.length; i++) {
                            var nowAction = $(oDom).find('action').eq(i);
                            name = escape(nowAction.attr("name"));
                            id = nowAction.attr("id");
                            view = nowAction.attr("view");
                            traceId = nowAction.attr("traceId");//2011-9-17
                            var fieldkey = nowAction.attr("field_key");
                            var fieldkeyvalue = nowAction.attr("field_key_value");
                            var dynamicId = nowAction.attr("dynamic_instance_id");

                            sXml += "<action name ='" + name + "' id='" + id + "' view='" + view + "'";
                            sXml += " field_key='" + fieldkey + "' ";
                            sXml += " field_key_value='" + fieldkeyvalue + "' ";
                            if (dynamicId != null)
                                sXml += " dynamic_instance_id='" + dynamicId + "' ";
                            sXml += " traceId='" + traceId + "' ";//2011-9-17
                            sXml += "/>";

                        }
                        sXml += "</root>";

                        var surl = project + "/fceform/common/run.html?djsn=wf_action_list&djtype=eden_form";
                        surl += "&wfId=" + wfId;

                        surl += "&wfName=" + wfName;
                        surl += "&wfDesc=" + escape(wfDesc);
                        surl += "&wfVersion=" + wfVersion;

                        surl += "&domxml=" + sXml;

//            window.top.createWindow({   id:'workFlow',
//                  text                  :wfDesc,
//                  setModal              :true,
//                  url                   :surl,
//                  width                 :'800',
//                  height                :height - 30,
//                  parent_ifr            :window,
//                  afterClose            :function () {
//                    if(window.top.getModuleFrame('start'))
//                    {
//                      window.top.getModuleFrame('start').taskReload('flow_task');
//                    }
//                  }
//                }
//
//            );
                        window.open(surl);
                        return;
                    }
                }

            }

        }
    });

}


/**
 * 初始化工作流
 * @param wfName
 * @param wfDesc
 * @param wfVersion
 * @param fromId 老的流程ID
 * @param isOverAgoWF 是否结束老流程,如isOverAgoWF==true，则关闭老流程。
 * @param bus_type 业务类型,如bus_type==instruction(领导批示转批示反馈流程)。
 */
function initWorkflowNewBill(wfName, wfDesc, wfVersion, fromId, isOverAgoWF, bus_type) {
    layer.msg('初始化流程中！');
    var sKey = "/servlet/WorkflowPortal?operate=init_workflow&wf_name=" + wfName + "&wf_version=" + wfVersion;
    //var project = window.top.location.toString();
    //project = project.split('/');
    //project = '/' + project[3];
    var project = window.top.base;
    var servletPath = project;
    project += '/form';
    $.ajax({
        type: "POST",
        url: servletPath + sKey,
        processData: false,
        data: "<root></root>",
        contentType: 'utf-8',
        success: function (msg) {
            if (msg.match('errInfo') != null) {
                var oDom = newXml(msg);
                var alertMsg = $(oDom).find('message').text();
                layer.msg(alertMsg);
            } else {
                var oDom = newXml(msg);
                var wfid;
                var sUrl = "";
                var height = $(window.top).height();
                var bResult = $(oDom).find('n').text();
                if (bResult == "false") {
                    layer.msg($(oDom).children().children().text());
                    return;
                }
                //根据  <stage>init,step</stage>来判断调用那个页面
                //=init 有多个初始化action，列表让用户选择个执行，流程未初始化，没得到wfid(流程实例id)

                var stage = $(oDom).find('stage').text();
                if (stage == "init") {
                    var sXml = "<root>";
                    sXml += "<wfname>" + wfName + "</wfname>";
                    sXml += "<wfdesc>" + escape(wfDesc) + "</wfdesc>"
                    sXml += "<wfversion>" + wfVersion + "</wfversion>";

                    var oActionList = $(oDom).find('action');
                    var name, id;
                    for (var i = 0; i < oActionList.length; i++) {
                        var nowAction = $(oDom).find('action').eq(i);
                        name = escape(nowAction.attr("name"));
                        id = nowAction.attr("id");

                        sXml += "<action name ='" + name + "' id='" + id + "'/>";
                    }
                    sXml += "</root>";

                    var surl = project + "/fceform/common/djframe.htm?djsn=wf_action_list&djtype=WF";
                    surl += "&domxml=" + sXml;

                    surl += "&wfName=" + wfName;
                    surl += "&wfDesc=" + escape(wfDesc);
                    surl += "&wfVersion=" + wfVersion;


//          window.top.createWindow({   id:'workFlow',
//                text                  :wfDesc,
//                setModal              :true,
//                url                   :surl,
//                width                 :'800',
//                height                :height - 30,
//                parent_ifr            :window,
//                afterClose            :function () {
//                  if(window.top.getModuleFrame('start'))
//                  {
//                    window.top.getModuleFrame('start').taskReload('flow_task');
//                  }
//
//                }
//              }
//
//          );


                    window.open(surl);
                    return;
                }
                //=step 只有一个初始化的action,后台已经执行了此action，即流程已经初始化了，得到了wfid(流程实例id)
                if (stage == "step") {
                    var num = $(oDom).find('num').text(); //步骤的当前可执行的 action数量
                    var wfId = $(oDom).find('wfId').text();//流程实例id
                    if (bus_type == "instruction") {//赋值业务数据和附件数据
                        var url = servletPath + "/admin/instructionTransition/instructionTransition.action?from_wf_id=" + fromId + "&new_wf_id=" + wfId;
                        $.post(url, function (result) {
                        });
                    }
                    if (isOverAgoWF == "true") {//办结流程
                        var action = $(oDom).find("action");
                        var actionId = undToSp(action.attr("id"));
                        var url = servletPath + "/admin/wfManage/closeWf.action?wf_id=" + fromId + "&action_id=" + actionId;
                        $.post(url, function (result) {
                        });
                    }
                    if (num == 1) {//直接链接到action的view中
                        var action = $(oDom).find("action");
                        var actionId = undToSp(action.attr("id"));
                        var actionName = undToSp(action.attr("name"));
                        var view = undToSp(action.attr("view"));
                        var traceId = undToSp(action.attr("traceId"));//加当前步骤主键id 2011-9-17

                        var fieldkey = undToSp(action.attr("field_key"));
                        var fieldkeyvalue = undToSp(action.attr("field_key_value"));
                        var dynamicId = undToSp(action.attr("dynamic_instance_id"));


                        if (view == "") {//没有view,则出现action选择页，点击action名字，执行doAction
                            var sXml = "<root>";
                            sXml += "<wfname>" + wfName + "</wfname>";
                            sXml += "<wfdesc>" + escape(wfDesc) + "</wfdesc>"
                            sXml += "<wfversion>" + wfVersion + "</wfversion>";
                            sXml += "<action name ='" + escape(actionName) + "' id='" + actionId + "'";
                            sXml += " field_key='" + fieldkey + "' ";
                            sXml += " field_key_value='" + fieldkeyvalue + "' ";
                            if (dynamicId != '')
                                sXml += " dynamic_instance_id='" + dynamicId + "' ";
                            sXml += " traceId='" + traceId + "' ";//2011-9-17

                            sXml += "/>";

                            sXml += "</root>";

                            var surl = project + "/fceform/common/djframe.htm?djsn=wf_action_list&djtype=WF";
                            surl += "&domxml=" + sXml;
                            surl += "&wfId=" + wfId;

                            surl += "&wfName=" + wfName;
                            surl += "&wfDesc=" + escape(wfDesc);
                            surl += "&wfVersion=" + wfVersion;
                            surl += "&from_wf_id=" + fromId;

//              window.top.createWindow({   id:'workFlow',
//                    text                  :wfDesc,
//                    setModal              :true,
//                    url                   :surl,
//                    width                 :'800',
//                    height                :height - 30,
//                    parent_ifr            :window,
//                    afterClose            :function () {
//                      if(window.top.getModuleFrame('start'))
//                      {
//                        window.top.getModuleFrame('start').taskReload('flow_task');
//                      }
//                    }
//                  }
//
//              );

                            window.open(surl);
                            return;
                        } else {//有view的直接进入view链接的表单页面，表单提交的时候，同时做流程doAction
                            var surl = project + unescape(view);
                            surl = surl + "&wfName=" + wfName;
                            surl = surl + "&wfDesc=" + escape(wfDesc);
                            surl = surl + "&wfVersion=" + wfVersion;
                            surl = surl + "&wfId=" + wfId
                            surl = surl + "&actionId=" + actionId;
                            surl = surl + "&traceId=" + traceId;//2011-9-17
                            if (fieldkey != "")
                                surl = surl + "&" + fieldkey + "=" + fieldkeyvalue;
                            if (dynamicId != '')
                                surl = surl + "&dynamicInstanceId=" + dynamicId; //在wf_tools.htm页面会获取此参数 唯一一个dynamicInstanceId的参数，没带
                            surl += "&from_wf_id=" + fromId;

                            //window.open(project + surl);
//              window.top.createWindow({   id:'workFlow',
//                    text                  :wfDesc,
//                    setModal              :true,
//                    url                   :surl,
//                    width                 :'800',
//                    height                :height - 30,
//                    parent_ifr            :window,
//                    afterClose            :function () {
//                      if(window.top.getModuleFrame('start'))
//                      {
//                        window.top.getModuleFrame('start').taskReload('flow_task');
//                      }
//                    }
//                  }
//
//              );

                            window.open(surl);
                            return;
                        }
                    } else {//多个action，用户选择一个执行
                        var sXml = "<root>";
                        sXml += "<wfname>" + wfName + "</wfname>";
                        sXml += "<wfdesc>" + escape(wfDesc) + "</wfdesc>"
                        sXml += "<wfversion>" + wfVersion + "</wfversion>";

                        var oActionList = $(oDom).find('action');
                        var name, id, view, traceId;
                        for (var i = 0; i < oActionList.length; i++) {
                            var nowAction = $(oDom).find('action').eq(i);
                            name = escape(nowAction.attr("name"));
                            id = nowAction.attr("id");
                            view = nowAction.attr("view");
                            traceId = nowAction.attr("traceId");//2011-9-17
                            var fieldkey = nowAction.attr("field_key");
                            var fieldkeyvalue = nowAction.attr("field_key_value");
                            var dynamicId = nowAction.attr("dynamic_instance_id");

                            sXml += "<action name ='" + name + "' id='" + id + "' view='" + view + "'";
                            sXml += " field_key='" + fieldkey + "' ";
                            sXml += " field_key_value='" + fieldkeyvalue + "' ";
                            if (dynamicId != null)
                                sXml += " dynamic_instance_id='" + dynamicId + "' ";
                            sXml += " traceId='" + traceId + "' ";//2011-9-17
                            sXml += "/>";

                        }
                        sXml += "</root>";

                        var surl = project + "/fceform/common/run.html?djsn=wf_action_list&djtype=eden_form";
                        surl += "&wfId=" + wfId;

                        surl += "&wfName=" + wfName;
                        surl += "&wfDesc=" + escape(wfDesc);
                        surl += "&wfVersion=" + wfVersion;

                        surl += "&domxml=" + sXml;
                        surl += "&from_wf_id=" + fromId;


//            window.top.createWindow({   id:'workFlow',
//                  text                  :wfDesc,
//                  setModal              :true,
//                  url                   :surl,
//                  width                 :'800',
//                  height                :height - 30,
//                  parent_ifr            :window,
//                  afterClose            :function () {
//                    if(window.top.getModuleFrame('start'))
//                    {
//                      window.top.getModuleFrame('start').taskReload('flow_task');
//                    }
//                  }
//                }
//
//            );
                        window.open(surl);
                        return;
                    }
                }

            }

        }
    });

}
//实例链接 执行动作 （任务列表，实例列表中的 执行动作）
function uf_doAction_pg_send(wfId, wfName, wfDesc, wfVersion, callback) {

    layer.msg('获取流程最新信息中！');
    //window.top.loadi = window.top.layer.load('获取流程最新信息中……')
    var sKey = "/servlet/WorkflowPortal?operate=get_current_action_list&wf_id=" + wfId;            //2013年10月10日 09:20:28  改用新的operate值
    //var project = window.location.toString();
    //  project = project.split('/');
    //  project = '/' + project[3];
    var project = window.top.base;
    var servletPath = project;
    project += '/form';


    $.ajax({
        type: "POST",
        url: servletPath + sKey,
        processData: false,
        data: "<root></root>",
        contentType: 'utf-8',
        success: function (msg) {

            var oDom = newXml(msg);
            var bResult = $(oDom).find('n').text();
            if (bResult == 'false' || bResult == false) {
                var alertMsg = $(oDom).find('message').text();
                layer.msg(alertMsg);
            } else {
                var surl;
                var height = $(window.top).height();

                var stage = $(oDom).find('stage').text();            // ="step" 到达了步骤了
                var num = $(oDom).find('num').text(); // 步骤的当前可执行的 action数量
                var wfId = $(oDom).find('wfId').text();// 流程实例id

                if (num == 1) {// 直接链接到action的view中
                    var action = $(oDom).find("action");
                    var actionId = undToSp(action.attr("id"));
                    var actionName = undToSp(action.attr("name"));
                    var view = undToSp(action.attr("view"));
                    var traceId = undToSp(action.attr("traceId"));  //加当前步骤主键id 2011-9-17
                    var actionStepId = undToSp(action.attr("stepId"));
                    var fieldkey = undToSp(action.attr("field_key"));
                    var fieldkeyvalue = undToSp(action.attr("field_key_value"));
                    var dynamicId = undToSp(action.attr("dynamic_instance_id"));


                    if (view == "") {// 没有view,则出现action选择页，点击action名字，执行doAction
                        var sXml = "<root>";
                        sXml += "<wfname>" + wfName + "</wfname>";
                        sXml += "<wfdesc>" + escape(wfDesc) + "</wfdesc>";
                        sXml += "<wfversion>" + wfVersion + "</wfversion>";

                        sXml += "<action name ='" + escape(actionName) + "' id='" + actionId + "'";
                        sXml += " field_key='" + fieldkey + "' ";
                        sXml += " field_key_value='" + fieldkeyvalue + "' ";
                        if (dynamicId != "")
                            sXml += " dynamic_instance_id='" + dynamicId + "' ";
                        if (traceId != "")
                            sXml += " traceId='" + traceId + "' ";// 2011-9-17
                        sXml += "/>";

                        sXml += "</root>";

                        var surl = project + "/fceform/common/run.html?djsn=wf_action_list&djtype=eden_form";
                        surl += "&domxml=" + sXml;
                        surl += "&wfId=" + wfId;

                        surl += "&wfName=" + wfName;
                        surl += "&wfDesc=" + escape(wfDesc);
                        surl += "&wfVersion=" + wfVersion;
                        surl += "&stepId=" + actionStepId;

                        //window.top.createWindow({   id:'workFlow',
                        //    text                  :wfDesc,
                        //    setModal              :true,
                        //    url                   :surl,
                        //    width                 :'800',
                        //    height                :height - 30,
                        //    parent_ifr            :window,
                        //    afterClose            :function () {
                        //      if(callback)
                        //      {
                        //        eval(callback)
                        //      }
                        //      if(window.top.getModuleFrame('start'))
                        //      {
                        //        window.top.getModuleFrame('start').taskReload('flow_task');
                        //      }
                        //    }
                        //  }
                        //);

                        window.open(surl, "_blank");
                        //window.top.layer.close(window.top.loadi);
                        return;
                    } else {// 有view的直接进入view链接的表单页面，表单提交的时候，同时做流程doAction
                        var surl = project + unescape(view);
                        surl = surl + "&wfName=" + wfName;
                        surl = surl + "&wfDesc=" + escape(wfDesc);
                        surl = surl + "&wfVersion=" + wfVersion;
                        surl = surl + "&wfId=" + wfId
                        surl = surl + "&actionId=" + actionId;
                        surl = surl + "&traceId=" + traceId;// 2011-9-17
                        surl += "&stepId=" + actionStepId;
                        surl = surl + "&" + fieldkey + "=" + fieldkeyvalue;
                        if (dynamicId != null)
                            surl = surl + "&dynamicInstanceId=" + dynamicId; // 在wf_tools.htm页面会获取此参数
                        //
                        //window.top.createWindow({   id:'workFlow',
                        //    text                  :wfDesc,
                        //    setModal              :true,
                        //    url                   :surl,
                        //    width                 :'800',
                        //    height                :height - 30,
                        //    parent_ifr            :window,
                        //    afterClose            :function () {
                        //      if(callback)
                        //      {
                        //        eval(callback);
                        //      }
                        //      if(window.top.getModuleFrame('start'))
                        //      {
                        //        window.top.getModuleFrame('start').taskReload('flow_task');
                        //      }
                        //
                        //    }
                        //  }
                        //);

                        window.open(surl, "_blank");
                        //window.top.layer.close(window.top.loadi);
                        return;
                    }
                } else {// 多个action，用户选择一个执行
                    var sXml = "<root>";
                    sXml += "<wfname>" + wfName + "</wfname>";
                    sXml += "<wfdesc>" + escape(wfDesc) + "</wfdesc>";
                    sXml += "<wfversion>" + wfVersion + "</wfversion>";

                    var oActionList = $(oDom).find('action');
                    var name, id, view, traceId;
                    var dynamicId;
                    for (var i = 0; i < oActionList.length; i++) {
                        var nowAction = $(oDom).find('action').eq(i);
                        name = escape(nowAction.attr("name"));
                        id = nowAction.attr("id");
                        view = nowAction.attr("view");
                        traceId = nowAction.attr("traceId");//2011-9-17
                        dynamicId = nowAction.attr("dynamic_instance_id");

                        var fieldkey = undToSp(nowAction.attr("field_key"));
                        var fieldkeyvalue = undToSp(nowAction.attr("id_field_value"));

                        sXml += "<action name ='" + name + "' id='" + id + "' view='" + view + "'";
                        sXml += " field_key='" + fieldkey + "' ";
                        sXml += " field_key_value='" + fieldkeyvalue + "' ";
                        if (dynamicId != "")
                            sXml += " dynamic_instance_id='" + dynamicId + "' ";
                        if (traceId != "")
                            sXml += " traceId='" + traceId + "' ";
                        sXml += "/>";
                    }
                    sXml += "</root>";

                    var surl = project + "/fceform/common/run.html?djsn=wf_action_list&djtype=eden_form";
                    surl += "&wfId=" + wfId;

                    surl += "&wfName=" + wfName;
                    surl += "&wfDesc=" + escape(wfDesc);
                    surl += "&wfVersion=" + wfVersion;

                    surl += "&domxml=" + sXml;

                    //window.top.createWindow({   id:'workFlow',
                    //    text                  :wfDesc,
                    //    setModal              :true,
                    //    url                   :surl,
                    //    width                 :'680',
                    //    height                :'540',
                    //    parent_ifr            :window,
                    //    afterClose            :function () {
                    //      if(window.top.getModuleFrame('start'))
                    //      {
                    //        window.top.getModuleFrame('start').taskReload('flow_task');
                    //      }
                    //    }
                    //  }
                    //);
                    window.open(surl, "_blank");
                    //window.top.layer.close(window.top.loadi);
                    return;
                }
            }
        }
    })


}


// 实例链接 执行动作 （任务列表，实例列表中的 执行动作）
function uf_doAction(wfId, wfName, wfDesc, wfVersion, callback) {


    layer.msg('获取流程最新信息中！');
    //window.top.loadi = window.top.layer.load('获取流程最新信息中……')
    var sKey = "/servlet/WorkflowPortal?operate=get_current_action_list&wf_id=" + wfId;            //2013年10月10日 09:20:28  改用新的operate值
    var project = window.top.base;
    var servletPath = project;
    project += '/form';


    $.ajax({
        type: "POST",
        url: servletPath + sKey,
        processData: false,
        data: "<root></root>",
        contentType: 'utf-8',
        success: function (msg) {


            //测试代码
            // return;


            var oDom = newXml(msg);
            var bResult = $(oDom).find('n').text();
            if (bResult == 'false' || bResult == false) {
                var alertMsg = $(oDom).find('message').text();
                layer.msg(alertMsg);
            } else {
                var surl;
                var height = $(window.top).height();

                var stage = $(oDom).find('stage').text();            // ="step" 到达了步骤了
                var num = $(oDom).find('num').text(); // 步骤的当前可执行的 action数量
                var wfId = $(oDom).find('wfId').text();// 流程实例id

                if (num == 1) {// 直接链接到action的view中
                    var action = $(oDom).find("action");
                    var actionId = undToSp(action.attr("id"));
                    var actionName = undToSp(action.attr("name"));
                    var actionStepId = undToSp(action.attr("stepId"));
                    var view = undToSp(action.attr("view"));
                    var traceId = undToSp(action.attr("traceId"));  //加当前步骤主键id 2011-9-17
                    var fieldkey = undToSp(action.attr("field_key"));
                    var fieldkeyvalue = undToSp(action.attr("field_key_value"));
                    var dynamicId = undToSp(action.attr("dynamic_instance_id"));


                    if (view == "") {// 没有view,则出现action选择页，点击action名字，执行doAction
                        var sXml = "<root>";
                        sXml += "<wfname>" + wfName + "</wfname>";
                        sXml += "<wfdesc>" + escape(wfDesc) + "</wfdesc>";
                        sXml += "<wfversion>" + wfVersion + "</wfversion>";

                        sXml += "<action name ='" + escape(actionName) + "' id='" + actionId + "'";
                        sXml += " field_key='" + fieldkey + "' ";
                        sXml += " field_key_value='" + fieldkeyvalue + "' ";
                        if (dynamicId != "")
                            sXml += " dynamic_instance_id='" + dynamicId + "' ";
                        if (traceId != "")
                            sXml += " traceId='" + traceId + "' ";// 2011-9-17
                        sXml += "/>";

                        sXml += "</root>";

                        var surl = project + "/fceform/common/run.html?djsn=wf_action_list&djtype=eden_form";
                        surl += "&domxml=" + sXml;
                        surl += "&wfId=" + wfId;

                        surl += "&wfName=" + wfName;
                        surl += "&wfDesc=" + escape(wfDesc);
                        surl += "&wfVersion=" + wfVersion;
                        surl += "&stepId=" + actionStepId;
                        //window.top.createWindow({   id:'workFlow',
                        //    text                  :wfDesc,
                        //    setModal              :true,
                        //    url                   :surl,
                        //    width                 :'800',
                        //    height                :height - 30,
                        //    parent_ifr            :window,
                        //    afterClose            :function () {
                        //      if(callback)
                        //      {
                        //        eval(callback)
                        //      }
                        //      if(window.top.getModuleFrame('start'))
                        //      {
                        //        window.top.getModuleFrame('start').taskReload('flow_task');
                        //      }
                        //    }
                        //  }
                        //);

                        window.open(surl, "_blank");
                        //window.top.layer.close(window.top.loadi);
                        return;
                    } else {// 有view的直接进入view链接的表单页面，表单提交的时候，同时做流程doAction
                        var surl = project + unescape(view);
                        surl = surl + "&wfName=" + wfName;
                        surl = surl + "&wfDesc=" + escape(wfDesc);
                        surl = surl + "&wfVersion=" + wfVersion;
                        surl = surl + "&wfId=" + wfId
                        surl = surl + "&actionId=" + actionId;
                        surl = surl + "&traceId=" + traceId;// 2011-9-17
                        surl = surl + "&" + fieldkey + "=" + fieldkeyvalue;
                        surl = surl + "&stepId=" + actionStepId;

                        if (dynamicId != null)
                            surl = surl + "&dynamicInstanceId=" + dynamicId; // 在wf_tools.htm页面会获取此参数
                        //
                        //window.top.createWindow({   id:'workFlow',
                        //    text                  :wfDesc,
                        //    setModal              :true,
                        //    url                   :surl,
                        //    width                 :'800',
                        //    height                :height - 30,
                        //    parent_ifr            :window,
                        //    afterClose            :function () {
                        //      if(callback)
                        //      {
                        //        eval(callback);
                        //      }
                        //      if(window.top.getModuleFrame('start'))
                        //      {
                        //        window.top.getModuleFrame('start').taskReload('flow_task');
                        //      }
                        //
                        //    }
                        //  }
                        //);

                        window.open(surl, "_blank");
                        //window.top.layer.close(window.top.loadi);
                        return;
                    }
                } else {// 多个action，用户选择一个执行  此处未加step
                    var sXml = "<root>";
                    sXml += "<wfname>" + wfName + "</wfname>";
                    sXml += "<wfdesc>" + escape(wfDesc) + "</wfdesc>";
                    sXml += "<wfversion>" + wfVersion + "</wfversion>";

                    var oActionList = $(oDom).find('action');
                    var name, id, view, traceId;
                    var dynamicId;
                    for (var i = 0; i < oActionList.length; i++) {
                        var nowAction = $(oDom).find('action').eq(i);
                        name = escape(nowAction.attr("name"));
                        id = nowAction.attr("id");
                        view = nowAction.attr("view");
                        traceId = nowAction.attr("traceId");//2011-9-17
                        dynamicId = nowAction.attr("dynamic_instance_id");

                        var fieldkey = undToSp(nowAction.attr("field_key"));
                        var fieldkeyvalue = undToSp(nowAction.attr("id_field_value"));

                        sXml += "<action name ='" + name + "' id='" + id + "' view='" + view + "'";
                        sXml += " field_key='" + fieldkey + "' ";
                        sXml += " field_key_value='" + fieldkeyvalue + "' ";
                        if (dynamicId != "")
                            sXml += " dynamic_instance_id='" + dynamicId + "' ";
                        if (traceId != "")
                            sXml += " traceId='" + traceId + "' ";
                        sXml += "/>";
                    }
                    sXml += "</root>";

                    var surl = project + "/fceform/common/run.html?djsn=wf_action_list&djtype=eden_form";
                    surl += "&wfId=" + wfId;

                    surl += "&wfName=" + wfName;
                    surl += "&wfDesc=" + escape(wfDesc);
                    surl += "&wfVersion=" + wfVersion;

                    surl += "&domxml=" + sXml;
                    //window.top.createWindow({   id:'workFlow',
                    //    text                  :wfDesc,
                    //    setModal              :true,
                    //    url                   :surl,
                    //    width                 :'680',
                    //    height                :'540',
                    //    parent_ifr            :window,
                    //    afterClose            :function () {
                    //      if(window.top.getModuleFrame('start'))
                    //      {
                    //        window.top.getModuleFrame('start').taskReload('flow_task');
                    //      }
                    //    }
                    //  }
                    //);
                    window.open(surl, "_blank");
                    //window.top.layer.close(window.top.loadi);
                    return;
                }
            }
        }
    })


}

function showWfHistory(wfId) {
    var isIE = $.browser.msie;
    var project = window.top.base;
//  var url = location.protocol + "//" + location.host + project + "/form/fceform/common/djframe.htm?djsn=wf_history_list&djtype=WF&wf_id=" + wfId;
    var url = location.protocol + "//" + location.host + project + "/form/fceform/common/run.html?djsn=wf_history_list&djtype=eden_wf&wf_id=" + wfId;
//  if (isIE && parseInt($.browser.version,10)<9) {
//    //window.top.createTab({text:'查看流程图', url:url});
////    window.open (url,'wf_history_list','height=1600,width=1050,top=0,left=50,toolbar=no,menubar=no,location=no,resizable=yes, status=no');
//  } else {
//    url = location.protocol + "//" + location.host + project + "/form/fceform/common/run.html?djsn=wf_history_list&djtype=eden_wf&wf_id=" + wfId;
//    //$.dialog.alert('流程图只能在IE下打开，请使用IE打开如下链接！<br><a target="_blank" href="' + url + '">' + url + '</a>');
//  }
    window.top.createTab({text: '查看流程图', url: url});
}

function uf_doSignTask(taskid, taskname) {
    layer.confirm("确定签收任务“" + taskname + "”吗？", {
        btn: ['确定', '取消'] //按钮
    }, function () {
        //签收，生成workitem表记录
        var project = window.top.base;
        var sKey = project + "/servlet/WorkflowPortal?operate=set_task_workitem";
        sKey += "&task_id=" + taskid;
        $.ajax({
            type: "POST",
            url: sKey,
            processData: false,
            data: "<root></root>",
            contentType: 'utf-8',
            success: function (msg) {
                var result = newXml(msg);
                var bResult = $(result).find('n').text();
                if (bResult == "false") {
                    var falseInfo = $(result).find('message').text();
                    layer.msg(falseInfo);
                    // $.dialog.alert(falseInfo, 5);
                } else {
                    // $.dialog.tips("签收成功！", 3);
                    layer.msg("签收成功");
                    try {
                        if (SimpleSearch) {
                            SimpleSearch();
                        }
                    } catch (e) {
                    }
                }

            },
            error: function (msg) {
                // $.dialog.tips('访问后台失败！')
                layer.msg('访问后台失败！');
            }
        })
    }, function () {

    });
}
function uf_doRevoke(wfid, stepid, actionid, instanceid) {
    layer.confirm("确定执行撤回任务操作吗？", function () {
        var project = window.top.base;
        var sKey = project + "/servlet/WorkflowPortal?operate=do_revoke&wf_id=" + wfid + "&step_id=" + stepid;
        sKey += "&action_id=" + actionid;
        if (instanceid != null && instanceid != "" && instanceid != "undefined")
            sKey += "&dynamic_instance_id=" + instanceid;
        $.ajax({
            type: "POST",
            url: sKey,
            processData: false,
            data: "<root></root>",
            contentType: 'utf-8',
            success: function (msg) {
                var result = newXml(msg);
                var bResult = $(result).find('n').text();
                if (bResult == "false") {
                    var falseInfo = $(result).find('message').text();
                    layer.msg(falseInfo);
                } else {
                    layer.msg("撤回任务成功！");
                }

            },
            error: function (msg) {
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
function showWFLatest(wfName, wfId) {
    var sKey = "?operate=get_action_list&wf_id=" + wfId;
    $.ajax({
        type: "POST",
        url: projectName + "/servlet/WorkflowPortal" + sKey,
        processData: false,
        data: '<root></root>',
        contentType: 'utf-8',
        success: function (msg) {
            var oDom = newXml(msg);
            var bResult = $(oDom).find('n').eq(0).text();
            if (bResult == "false") {
                //  $.dialog.alert("获取流程信息发生错误：" + $(oDom).find('message').text(), 5);
                layer.msg("获取流程信息发生错误：" + $(oDom).find('message').text());
                return;
            } else {
                var WfDesc = $(oDom).find('action').attr('name');
                WfDesc = escape(WfDesc);
                var WfVersion = $(oDom).find('num').text();
                var billPath = $(oDom).find('action').attr('view');
                billPath = unescape(billPath);
                var actionId = $(oDom).find('action').attr('id');
                var traceId = $(oDom).find('action').attr('traceId');
                var url = projectName + '/form' + billPath + '&wfName=' + wfName + '&wfDesc=' + WfDesc + '&wfVersion=' + WfVersion + '&wfId=' + wfId + '&actionId=' + actionId + '&=&dynamicInstanceId=&traceId=' + traceId;
                try {
                    // window.top.createTab({text:unescape(WfDesc),url:url,id:'showWFLatest',openType:'1'});
                    window.top.createWindow({
                        id: 'showWFLatest',
                        text: unescape(WfDesc),
                        setModal: true,
                        url: url,
                        width: '780',
                        height: '540',
                        parent_ifr: window
                    });
                } catch (e) {
                    window.open(url, "showWFLatest");
                }

            }

        },
        error: function (msg) {
            // $.dialog.tips('访问后台失败！')
            layer.msg('访问后台失败！');
        }
    });

}


/**
 * 高级搜索栏打开隐藏
 * @param SB    高级搜索栏ID
 * @param SBHeight      高级搜索栏高度
 * @param SBButton    点击触发打开隐藏搜索栏按钮ID
 * @param SBToolBar      工具栏ID
 * @param SBgrid    列表ID
 */

function searchBarCommon(SB, SBHeight, SBButton, SBToolBar, SBgrid) {
    var SBHeight = SBHeight;
    $('#' + SBButton + '').toggle(function () {
        $('#' + SBgrid + '').css({
            height: $('#' + SBgrid + '').height() - SBHeight
        });
        if (grid) {
            grid.setSizes();
        }
        $('#' + SBToolBar + '').css({
            marginBottom: SBHeight + 'px'
        });
        $('#' + SB + '').slideToggle(10);

    }, function () {
        $('#' + SBgrid + '').css({
            height: $('#' + SBgrid + '').height() + SBHeight
        });
        if (grid) {
            grid.setSizes();
        }
        $('#' + SBToolBar + '').css({
            marginBottom: 0
        });
        $('#' + SB + '').slideToggle(10);

    });
}

/**
 * 页面上传控件
 * @param id     div的id
 * @param data
 * @constructor
 */
function EDEN_upload(id, data) {
    this._isUp = false;//是否在上传界面
    this._addFileList = [];
    this._delFileList = [];
    this._url = "/admin/attachmentInfo/selectByTable.action";
    this._value = '';
    this._readonly = data.readonly;
    this._div = $('#' + id);
    this._id = id;
    this._eUploadWin;
    this._filePath;
    this._eUploadWinObj;
    this._eUploader;
    this.render(id, data);
}
EDEN_upload.prototype.render = function (id, data) {
    var _this = this;
    var p = document.createElement("DIV");
    p.className = "dhxform_control";
    var k = document.createElement("INPUT");
    k.type = "HIDDEN";
    k.name = id;
    k.id = id + '_hidden'
    k.value = (data.value || "");
    p.appendChild(k);
    var t = document.createElement('DIV');
    t.className = "dhxform_textarea eUploader";
    t._idd = id;
    t.id = id + '_wrap';
    t.type = 'eUpload';
    p.appendChild(t);
    if (!data.max_file_size) data.max_file_size = '10mb';
    if (!data.filters) data.filters = [{title: "允许的文件", extensions: "*"}];
    t.innerHTML = '<p><a id="' + id + '_pick" class="eUpload_pick_btn" href="javascript:void(0)">[添加附件]</a></p><p class="eUpload_fileAdded" id="' + id + '_upload_list"></p>';
    var upload_wrap_html = '<div style="width: 600px; height: 224px; margin: 5px auto 10px; border: 1px solid #ccc;" id="' + id + '_uploader"></div><div class="bottom_btn_area"><input style="display:none;" id="' + id + 'eUpload_add_btn" class="save_btn" type="button" value="清空">&nbsp;&nbsp;&nbsp;<input id="' + id + 'eUpload_save_btn" style="display:none;"  class="save_btn" type="button" value="确定"></div>';
    this._div.html(p);
    function create_eUploader() {
        try {
            var _eUploader = $("#" + id + "_uploader").pluploadQueue();
            _eUploader.destroy();
        } catch (e) {
        }

        var result = true;
        this._eUploader = $("#" + id + "_uploader").pluploadQueue({
            runtimes: 'flash',
            url: data.servlet,
            max_file_size: data.max_file_size,
            unique_names: true,
            filters: data.filters,
            flash_swf_url: projectName + '/aufw/resources/common/js/plupload/plupload.flash.swf',
            init: {
                UploadComplete: function (up, files) {
                    if (!result) {
                        return;
                    }
                    for (var i = 0, l = files.length; i < l; i++) {
                        var data = {
                            id: (new Date().getTime() + i),
                            name: files[i].name,
                            size: files[i].size,
                            remark: '',
                            path: ''
                        };
                        _this._addFileList.push(data);
                        _this.addAttach(data);
                    }
                    _this.updateValue();
                    window.setTimeout(function () {
                        _this._isUp = false;
                        _this._eUploadWinObj.hide();
                    }, 100);
                },
                Error: function (up, error) {
                    result = false;
                    //$.dialog.tips("上传失败！请联系统管理员。",3);
                    layer.msg("上传失败！请联系统管理员。");
                }

            }
        });
    }

    if (this._readonly != true) {
        $('#' + id + '_pick').click(function () {
            if (_this._isUp) return;
            _this._isUp = true;
            var _eUploadWin = _this._eUploadWin;
            var _eUploadWinObj = _this._eUploadWinObj;
            if (typeof _eUploadWin != 'undefined') {
                _eUploadWin.window(id + '_eUploadWin').show();
                var _eUploader = $("#" + id + "_uploader").pluploadQueue();
                _eUploader.destroy();
                create_eUploader();
                return;
            }
            _eUploadWin = new dhtmlXWindows();
            _eUploadWin.setImagePath(projectName + "/aufw/resources/common/dhtmlx/imgs/");
            _eUploadWinObj = _eUploadWin.createWindow(id + "_eUploadWin", 20, 30, 610, 275);
            _eUploadWinObj.setText("添加附件");
            _eUploadWinObj.attachHTMLString(upload_wrap_html);
            _eUploadWinObj.center();

            _eUploadWin.attachEvent('onClose', function (win) {
                _eUploadWinObj.hide();
                _this._isUp = false;
            })
            _this._eUploadWin = _eUploadWin;
            _this._eUploadWinObj = _eUploadWinObj;
            create_eUploader();
            $('#' + id + 'eUpload_save_btn').click(function () {    //确定按钮
                var uploader = $("#" + id + "_uploader").pluploadQueue();
                if (uploader.files.length > 0) {
                    layer.confirm('文件未上传，是否上传文件？', {
                        btn: ['确定', '取消'] //按钮
                    }, function () {
                        uploader.start();
                    }, function () {
                        _eUploadWinObj.hide();
                        _this._isUp = false;
                    });
                } else {
                    _eUploadWinObj.hide();
                    _this._isUp = false;
                }

            });
            $('#' + id + 'eUpload_add_btn').click(function () {    //继续添加
                layer.confirm('是否清空文件？', {
                    btn: ['确定', '取消'] //按钮
                }, function () {

                    create_eUploader();
                    _this._isUp = false;
                }, function () {

                });

            });
        });
    }
    if (!isNaN(data.inputWidth)) {
        this._div.width(parseInt(data.inputWidth, 10));
    }
    if (!isNaN(data.inputHeight)) {
        this._div.height(parseInt(data.inputHeight, 10));
    } else {
        this._div.height('30');
    }

}
EDEN_upload.prototype.setAttachList = function (param, callBack) {
    var _this = this;
    jQuery.post(projectName + this._url, param, function (data) {
        if (data["result"] == "success") {
            _this._filePath = data["path"];
            _this.resetAttachList();
            for (var i = 0; i < data["message"].length; i++) {
                _this.addAttach(data["message"][i]);
            }
            if (callBack) {
                if (typeof callBack == 'function') {
                    callBack(data);
                }
            }
        } else {
            //  $.dialog.tips(data["message"]);
            layer.msg(data["message"]);
        }
    });
}
EDEN_upload.prototype.resetAttachList = function () {
    this._value = '';
    this._addFileList = [];
    this._delFileList = [];
    var attachWrap = this._div.find('#' + this._id + '_upload_list');
    attachWrap.empty();
}
EDEN_upload.prototype.transValue = function () {
    var fileJson = '{addFileList:[';
    for (var i = 0; i < this._addFileList.length; i++) {
        var file = this._addFileList[i];
        fileJson = fileJson + '{';
        fileJson = fileJson + 'id:"' + file.id + '",';
        fileJson = fileJson + 'name:"' + file.name + '",';
        fileJson = fileJson + 'size:"' + file.size + '",';
        fileJson = fileJson + 'remark:"' + "" + '"';
        if (i == this._addFileList.length - 1) {
            fileJson = fileJson + '}';
        } else {
            fileJson = fileJson + '},';
        }
    }
    fileJson += '],delFileList:[';
    for (var i = 0; i < this._delFileList.length; i++) {
        var file = this._delFileList[i];
        fileJson = fileJson + '{';
        fileJson = fileJson + 'id:"' + file.id + '",';
        fileJson = fileJson + 'size:"' + file.size + '"';
        if (i == this._delFileList.length - 1) {
            fileJson = fileJson + '}';
        } else {
            fileJson = fileJson + '},';
        }
    }
    fileJson += ']}';
    this._value = fileJson;
    $('#' + this._id + '_hidden').val(fileJson);
}
EDEN_upload.prototype.updateValue = function () {
    this.transValue();
    var value = $('#' + this._id + '_hidden').val();
    if (this._value != value) {
        $('#' + id + '_hidden').val(this._value)
    }
}
EDEN_upload.prototype.setValue = function (value) {
    this._value = (typeof(value) != "undefined" && value != null ? value : "");
    var v = (String(this._value) || "");
    $('#' + this._id + '_hidden').val(v);
}
EDEN_upload.prototype.getValue = function () {
    // update value if item have focus
    this.updateValue(this._id);
    return (typeof(this._value) != "undefined" && this._value != null ? this._value : "");
}
EDEN_upload.prototype.addAttach = function (data, pos) {
    var _this = this;
    var attachHtml = $('<span id="' + data.id + '"><a class="download_attach" href="' + _this._filePath + encodeURI(data.path) + '">' + data.name + '</a><a class="del_attach" title="删除附件"> </a></span>');
    $(attachHtml).find('.del_attach').click(function () {
        _this.delAttach(data);
    });
    $(attachHtml).find('.download_attach').click(function (e) {
        var href = $(this).attr('href');
        if (href == _this._filePath) {
            // $.dialog.tips("请先保存再下载！");
            layer.msg("请先保存再下载！");
        } else {
            window.location.href = href;
        }
        e.returnValue = false;
        return false;
    });
    if (pos == 'before') {
        this._div.find('#' + this._id + '_upload_list').prepend(attachHtml);
    } else {
        this._div.find('#' + this._id + '_upload_list').append(attachHtml);
    }

}
EDEN_upload.prototype.delAttach = function (data) {
    if (this._readonly) return false;
    this._delFileList.push(data);
    this.transValue();
    this._div.find('#' + data.id).remove();
}

function updateGrid() {
    var colNum = grid.getColumnsNum();
    for (var i = 0; i < colNum; i++) {
        grid.deleteColumn(0);
    }
    var config = [{header: '用户名', columnId: 'userName', width: '100', colType: 'ro'}, {
        header: '账户所属组织',
        columnId: 'depName',
        width: '*',
        colType: 'ro'
    }];
    for (var i = 0, len = config.length; i < len; i++) {
        var obj = config[i];
        grid.insertColumn(i, obj.header, obj.colType, obj.width);
        grid.setColumnId(i, obj.columnId);
    }

    data.clearAll();
    var parent_id = tree.getSelectedItemId();
    var orgCode;
    if (typeof parent_id != "undefined") {
        orgCode = tree.getUserData(parent_id, "orgCode");
    }
    {
        orgCode = '';
    }
    data.data.url = "${base}/admin/user/queryUserInfo.action?criteriaOrgCode=" + orgCode + "&etc=" + new Date().getTime();
    data.load("${base}/admin/user/queryUserInfo.action?criteriaOrgCode=" + orgCode + "&etc=" + new Date().getTime(), 'json');
}
/**
 * 在 gird 一列点击时，去更新 form 下面的 确定 按钮
 * @param config  -- 数据类型
 {
    "dataStore":data,  //dataStore 对象
    "grid":grid,       //grid 对象
    "rowId":id,        //点击的那一行的ID
    "forms":[form,form2]//要设置哪些form的按钮，也是form对象 -- 注意 这是个数组，因为可能会有多个form
 }
 */
function updateFormBtn(config) {
    var item = config.dataStore.item(config.rowId);
    var operate = item.operate;
    if (operate.match("class='e'")) {
        for (var i = 0, len = config.forms.length; i < len; i++) {
            var form = config.forms[i];
            form.enableItem('send');
        }
    } else {
        for (var i = 0, len = config.forms.length; i < len; i++) {
            var form = config.forms[i];
            form.disableItem('send');
        }
    }
}

/**
 * 高级搜索框的收起与展开
 {
    "triggerId,  //触发高级搜索的按钮ID
    "containerId,       //高级搜索的容器ID
 }
 */
function searchToggle(triggerId, containerId) {
    $('#' + triggerId).bind('click', function (event) {
        try {
            event.stopPropagation();
        } catch (event) {
            event.cancelBubble = true;
        }
        $('#' + containerId).slideToggle('fast');
    });

    $('#' + containerId).bind('click', function () {
        try {
            event.stopPropagation();
        } catch (event) {
            event.cancelBubble = true;
        }

    });

    $('body').bind('click', function () {
        $('#' + containerId).slideUp('fast');
    });

}

