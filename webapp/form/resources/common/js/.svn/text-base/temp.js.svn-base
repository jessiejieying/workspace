//参数
var wfId = QueryURL.GetValue('wfId');

var billStoreChoice;
//获取地址栏参数列表
var globalParams = {
    "roleId": "",
    "actionId": $urlParam("actionId"),
    "dynamicInstanceId": $urlParam("dynamicInstanceId"),
    "wfid": $urlParam("wfId"),
    "wfName": $urlParam("wfName"),
    "djsn": $urlParam("djsn"),
    "wfs": $urlParam("wfs"),
    "nodeName": $urlParam("nodeName"),
    //步骤ID
    "stepId": $urlParam("stepId"),
    "mainUnit":'',
    "toExchangeHtml": '',
    "toExchangeHtmlUndistinguish": '',
    //选择登录的账号名
    "loginName": "",
    "loginChineseName": "",
    //当年用户所在处室
    "myOrgName": "",
    //联系人电话
    "cellphone": "",
    "draftText": 0,
    //用于文件编号的跟新
    "fileNumStart": "",
    "leaderInstructionNum":"",
    "sendSerialNumber":"",
    "billSelectId": "sel_dropdownlist29",
    "qrCode": {
        "name": "",
        "size": "",
        "tableKey": ""
    },
    "qrCodeOther": {
        "name": "",
        "size": "",
        "tableKey": ""
    },
    //发文成文日期，用于二维码
    "fileCreateDate": "",
    //顶部按钮权限控制

    "topBtn": {
        //厅内会议通知
        buttonOfficeSignUp: 0
    },
    //顶部正文按钮权限控制，移至历次版本
    topBtnText: {
        //正文
        text: 1,
        //编辑文档
        edit: 1,
        //查看
        look: 1,
        //批阅
        marking: 1,
        //下载
        download: 1,
        //鉴章
        seal: 1,
        //发文拟稿
        sendDraft: 0,
        qrCode: 1
    },
    unUpdate:0
}

var tempTools = {
    btnAuto: function () {

        //只有会议通知 才有厅内会议通知
        if (globalParams.wfName === "oa_meeting_notification_approval" && globalParams.djsn === "oa_meeting_info") {

            //  省政府党组会议、秘书长主任办公会、办公厅党组会议、处长主任例会 四类会议显示“厅内会议通知”。

            var $val = $("#" + globalParams.billSelectId).val();
            if ($val) {
                if ($val === "fd70cd3df5d14340b66fca211866e1e0" || $val === "2f24ab4100054bc99bedf69c799c5f0f" || $val === "d13e5b98a9b642acb3e27f9891778d84" || $val === "9bed18ea73f147b2b013232d44980e95") {

                    if (globalParams.topBtn.buttonOfficeSignUp) {
                        $("#buttonOfficeSignUp").show();
                    }
                    else {
                        $("#buttonOfficeSignUp").hide();
                    }
                }
                else {
                    $("#buttonOfficeSignUp").hide();
                }

            }

        }

        //清空顶部按钮高度为0的按钮
        $(".oa-only-bill-page-header").find(".navlist").each(function () {
            var $this = $(this);
            if ($this.height() < 1) {
                $this.hide();
            }
        });

        var pageHeader = $(".oa-only-bill-page-header");

        pageHeader.css({"marginLeft": (-pageHeader.width() / 2), "left": "50%"});
        pageHeader.css({"opacity": 1, "flter": "Alpha(Opacity=100)"});
        $(".oa-only-bill-page .tab-pane .tab_header").css({"opacity": 1, "flter": "Alpha(Opacity=100)"});

    }
}


//收文待分短信模板信息

var messageObj = {
    "commonTels": "",
    "commonMailContent": "",
    "commonTableKeyId": "",
    "commonTableName": ""
}

//表单设计器工具集
var pageTools = (function () {

    var obj = {}

    return obj
})();


//*********工作流节点与表单控件绑定控制 begin
//  <!--根据工作流节点控制控件方式-->
function contorlBehaviorFromWfNode() {
    //根据工作流节点控制控件方式
    putContorlBehaviorFromWfNode();
}

/**
 * 加载工作流节点控制控件数据,并修改
 * @params
 * is_active：0：不活动；1：活动
 * is_show：0：不显示：1：显示
 * @author hanxuetong
 * @since 2015-1-5
 */
function parseWfNodeContorl(sqltrans) {


    var xml = '<root><sql>' + sqltrans + '</sql><pageno>1</pageno><pagesize>-1</pagesize></root>';

    $.ajax({
        type: "POST",
        url: project + "/servlet/WebBill?key=fc_select",
        processData: false,
        data: xml,
        contentType: 'utf-8',
        success: function (msg) {
            if (msg.match('errInfo') != null) {

                layer.msg(msg);
            } else {
                var res = newXml(msg);
                var text = [];
                var value = [];
                $(res).find('record').each(function () {
                    var control_id = $(this).find("control_id").text();
                    var control_type = $(this).find("control_type").text();
                    var is_active = $(this).find("is_active").text();
                    var is_show = $(this).find("is_show").text();
                    var is_step = $(this).find("node_step_id").text();

                    var obj = $("#" + control_id);
                    if (obj) {
                        if ("dataset" == control_type)  //是dataset
                        {

                            var submitType = obj.attr('submittype');

                            if (is_active == '0') //不活动，相当于不给加载sql
                            {
                                obj.attr("sqltrans", "");
                            }

                            if (is_show == '0') //不显示,相当于不提交
                            {
                                obj.attr('submittype', 4);
                            }

                        } else if ("grid" == control_type) {
                            var gridids = $("#grid_" + control_id);
                            defaultShowActive(gridids, is_active, is_show, control_id);

                        }
                        else if ("upload" == control_type)  //上传
                        {
                            var upload = $("#" + control_id);

                            if (is_show == '0') //不显示,只读
                            {

                                upload.addClass('readonly');
                                $('#' + control_id + '_pick').unbind(); //解绑

                                $('#' + control_id + '_upload_list').find('.del_attach').unbind(); //解绑删除
                            }


                        }
                        else if ("tabItem" == control_type) {

                            var names = control_id.split("_");
                            if (names.length > 2) {
                                var itemNum = names[names.length - 1];
                                var tabIdName = control_id.substring(5, control_id.length - itemNum.length - 1);
                                var tabIds = $("#" + tabIdName);
                                if (tabIds) {
                                    if (is_show == '0') //不显示
                                    {
                                        var itemHead = tabIds.find("div[class='tab_header'] > ul > li").eq(itemNum);
                                        itemHead.hide();
                                        itemHead.css('display', 'none');
                                        var itemDiv = tabIds.children('div').eq(itemNum + 1);
                                        itemDiv.hide();
                                        itemDiv.css('display', 'none');
                                    }

                                }
                            }
                        }
                        else if ("dropdownlist" == control_type) {
                            if (obj) {
                                if (is_active == '0') //不活动
                                {
                                    $('#sel_' + control_id).prop('disabled', true);
                                    $('#sel_' + control_id).attr('disabled', 'disabled');

                                }

                                if (is_show == '0') //不显示
                                {
                                    $('#sel_' + control_id).hide();
                                }
                            }
                        } else {

                            defaultShowActive(obj, is_active, is_show, control_id);

                        }

                    }

                });


                var $wfs = $urlParam("wfs");
                operateBtnShow($wfs);


                tempTools.btnAuto();


                //批示办理单中显示批示反馈的数目,此处可以删除


                if (globalParams.djsn == "oa_leader_instruction_form") {

                    var feekUrl = project + "/admin/instruction/instCount.action?wfId=" + globalParams.wfid;

                    $.getJSON(feekUrl, function (data) {
                        if (data.totalCount4) {
                            var feedBack = "批示反馈<i class='note-tip'>" + data.totalCount4 + "</i>";
                            // $("#buttonFeedBack").html(feedBack);

                        }


                    });

                }


            }

        }
    });


}


/**
 * 根据工作流节点控制控件方式
 */
function putContorlBehaviorFromWfNode() {


    var actionId = $urlParam('actionId');  //动作id
    var traceId = $urlParam('traceId');      //步骤id

    var djsn = $urlParam('djsn');
    if (actionId || traceId) {
        var whereParam = " node_action_id='" + actionId + "' and djsn='" + djsn + "'";

        var sql = 'select node_step_id "node_step_id" ,node_action_id "node_action_id",control_id	"control_id",is_active "is_active",is_show "is_show",id "id",control_type "control_type",djsn "djsn" from wf_node_control_bind where id not in (select id from wf_node_control_bind where is_active=1 and is_show=1 and ' + whereParam + ") and " + whereParam;
        parseWfNodeContorl(sql);

    }


}

/**
 * 背景材料列表弹出层
 * @param obj

 */
function fileManageSeacrh() {
    var url = project + "/admin/commonDispatch/fileManageSearch.action";
    createWindow({
        text: '资源链接搜索',
        url: url,
        id: 'dhxPop',
        width: '900',
        height: '550',
        callBack: function (val, text) {
        }
    });
}

/**
 * 流程记录
 *
 */
function messageHistory(step) {
    var url = project + "/admin/commonDispatch/messageHistory.action?step=" + step;
    createWindow({
        text: '短信详情页面',
        url: url,
        id: 'dhxPop',
        width: '900',
        height: '550',

        callBack: function (val, text) {
        }
    });
}

/**
 * 发送集合了直接发送和弹出层发送
 */
function openNextSendPagePeo() {
    layer.msg("发送中...");


    var callback = function () {


        var father = window.top;

        var obj = {
            'wf_id': globalParams.wfid,
            'action_id': $urlParam("actionId"),
            'currStepId': globalParams.stepId,
            'dynamic_instance_id': $urlParam("dynamicInstanceId"),
            //'free_flow': free_flow,
            'flowXml': father.doSubmitDataOa(),
            'recordId': father.data_dataset2.item(father.data_dataset2.first()).id
        };

        //二维码是否显示

        var codeStatus = window.top.document.getElementById('filePageId').contentWindow.historyControlData[0].qrCode;

        if (codeStatus != "fn-hide") {


            if (parseInt(globalParams.qrCode.size) > 10) {
                $.post(project + '/admin/wfManage/choiceNextStep.action', obj, function (data) {
                    if (Boolean(data.datas)) {
                        if (data.message) {
                            layer.msg(data.message);
                        }
                        refreshIndex();
                        setTimeout(function () {
                            window.close();
                        }, 3000);
                    }
                    else {
                        openNextSendPage();
                    }

                });


            }
            else {

                var isEnd = layer.confirm('是否生成二维码？', {

                    btn: ['是', '否']
                }, function () {
                    layer.closeAll('dialog');
                    createQRCode();


                }, function () {

                    $.post(project + '/admin/wfManage/choiceNextStep.action', obj, function (data) {
                        if (Boolean(data.datas)) {
                            if (data.message) {
                                layer.msg(data.message);
                            }
                            refreshIndex();
                            setTimeout(function () {
                                window.close();
                            }, 3000);
                        }
                        else {
                            openNextSendPage();
                        }

                    });
                });

            }


        }
        else {
            $.post(project + '/admin/wfManage/choiceNextStep.action', obj, function (data) {
                if (Boolean(data.datas)) {
                    if (data.message) {
                        layer.msg(data.message);
                    }
                    refreshIndex();
                    setTimeout(function () {
                        window.close();
                    }, 3000);
                }
                else {
                    openNextSendPage();
                }

            });
        }


    }
    oa_wf_tempSave("dataset2", callback);
}


/**
 * 默认控制控件方式
 * 顶部按钮 grid,label,button,text,textarea
 * @param obj
 * @param is_active
 * @param is_show
 */
function defaultShowActive(obj, is_active, is_show, id) {


    if (obj) {
        if (is_active == '0') //不活动
        {
            //取消按钮的禁用功能
            // obj.attr("disabled", true);
        } else if (is_active == '1')   //活动
        {
            //取消按钮的禁用功能
            // obj.attr("disabled", false);
        }
        if (is_show == '0') //不显示
        {

            obj.hide();

        } else if (is_show == '1')   //显示
        {

            obj.show();

        }

        btnTextStatus(is_show, id);
    }
}

//设置顶部按钮状态
function btnTextStatus(is_show, id) {


    //正文
    if (id == "divListText") {

        globalParams.topBtnText.text = parseInt(is_show);
    }
    //编辑文档
    else if (id == "button39") {
        globalParams.topBtnText.edit = parseInt(is_show);

    }
    //查看
    else if (id == "button13") {
        globalParams.topBtnText.look = parseInt(is_show);

    }
    //批阅
    else if (id == "button21") {
        globalParams.topBtnText.marking = parseInt(is_show);

    }
    //下载
    else if (id == "button31") {

        globalParams.topBtnText.download = parseInt(is_show);
    }
    //鉴章
    else if (id == "buttonseal") {
        globalParams.topBtnText.seal = parseInt(is_show);
    }
    else if (id == "buttonCreateCode") {
        globalParams.topBtnText.qrCode = parseInt(is_show);
    }

    //起草正文
    else if (id == "buttonSendDraft") {

        globalParams.topBtnText.sendDraft = parseInt(is_show);
    }
    //厅内会议通知
    else if (id == "buttonOfficeSignUp") {
        globalParams.topBtn.buttonOfficeSignUp = parseInt(is_show);
    }

}

//*********工作流节点与表单控件绑定控制 end


var choiceUserType;  //进行转办、补办的全局参数


/**
 *  //对 $eform('提交业务和流程后关闭窗口') 进行重复提交控制
 *
 */

function wf_resub(btn) {
    var button = $(btn);
    button.attr("disabled", true).html("正在提交..");

    wftools_save(function () {

        window.setTimeout(function () {

            try {
                if (ParentIframe.SimpleSearch) {
                    ParentIframe.SimpleSearch();
                }
                window.top.closeWin('workFlow');
            } catch (e) {

            }
            button.attr("disabled", false).html("确定");

        }, 300);
    });

    window.setTimeout(function () {
        button.attr("disabled", false).html("确定"); //按钮可用
    }, 6000);


}


//获得跟时间关系的字符串
function getDateNums() {
    var date = new Date();
    var mon = date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var HH = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    var mm = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    var ss = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();

    var num = "" + date.getFullYear() + mon + day + HH + mm + ss;

    return num;

}

//获得跟时间关系的字符串，再加上随机数，用于默认编号
function getRandNums() {
    var randNum = parseInt(100 * Math.random());
    return getDateNums() + randNum;
}


// 对某个文本框设置，id为input框的id，pre是前缀
function setRandNums(id, preStr) {
    if (!$('#' + id).val()) {
        $('#' + id).val(preStr + getRandNums());

    }


}


//选择资产
function selectAssets(amountIndex) {

    var url = project + "/admin/assetsRegister/assetsSelect.action";
    createWindow({
        id: "assetsSelect",
        text: "资产选择",
        width: 500,
        height: 450,
        url: url,
        parent_ifr: window
    });
}


//虚拟ID
function setRelevanceid() {

    var relevance_id = $('#relevance_id').val();

    if (relevance_id) return;
    relevance_id = GetSessionOne('userid') + getDateNums();
    $('#relevance_id').val(relevance_id);
}


//关联后提交
function relevanceAssetAndSub(work_type, btn) {

    var sub_str = "";
    for (var index = 1; index < grid.getRowsNum(); index++) {

        var asset_num = grid.cellByIndex(index, 1).getValue();
        var asset_name = grid.cellByIndex(index, 2).getValue();
        var amount = grid.cellByIndex(index, 3).getValue();
        var aid = grid.getRowId(index);


        sub_str += asset_num + "@@" + asset_name + "@@" + amount + "###";
    }

    if (!sub_str) {

        layer.msg("请添加相应资产");
        return;
    }

    $.post(project + "/admin/assetsDetail/addAssetsDetail.action", {
        workType: work_type,
        assetsStr: sub_str,
        workId: wfId
    }, function (dataMap) {

        if (dataMap == 'sucess') {
            //提交申请单
            //$eform('提交数据')
            //$eform('提交业务和流程后关闭窗口')
            wf_resub(btn);

        } else {

            layer.msg("添加资产关联失败！");
        }
    });
}


//删除资产
function delAsset() {
    var row_id = grid.getCheckedRows(0);
    if (row_id === '') {

        layer.msg('请至少选择一条数据！');
        return;
    }

    var delRowId = "";
    row_id = row_id.split(',');

    for (i = 0; i < row_id.length; i++) {
        grid.deleteRow(row_id[i]);
    }

}


//当点grid某一行时，文本框处显示资产数量
function showRowAcount() {
    var id = grid.getSelectedRowId(); //获取grid1当前选中的一行
    if (id === null) { //如果grid1没有选中

    } else {

        var amount = grid.cellById(id, 3).getValue();
        $('#amount_text').val(amount);

    }


}


//当点grid某一行时，文本框处修改数量，对应的资产数量改变
function changeRowAcount(errmsg) {
    var amount = $('#amount_text').val();
    if (amount) {
        var id = grid.getSelectedRowId(); //获取grid1当前选中的一行
        if (id === null) { //如果grid1没有选中

        } else {
            var rowArr = id.split('$$$');
            var maxAmount = parseInt(rowArr[1]);

            if (isNaN(amount)) {
                alert("修改数量要为数字！");
                var old_amount = grid.cellById(id, 3).getValue();
                $('#amount_text').val(old_amount);
                return;
            }

            if (amount > maxAmount) {
                if (errmsg) {
                    alert(errmsg);
                } else {
                    alert("修改数量不能大于该资产原数量");
                }

                var old_amount = grid.cellById(id, 3).getValue();
                $('#amount_text').val(old_amount);
                return;
            }
            grid.cellById(id, 3).setValue(amount);
        }


    }
}


function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}


function closeOaWin() {
    window.setTimeout(function () {
        try {
            if (ParentIframe.SimpleSearch) {
                ParentIframe.SimpleSearch();
            }
            window.top.closeWin('workFlow');
        } catch (e) {

        }


    }, 300);

}


/**
 * 数据校验
 * @param objEvent     txtUserName.value 或是 事件对象
 */
function $validIntNum(eventObj) {

    var ret = true;
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

    if (strvalue) {
        ret = IsInt(strvalue);
    }


    if (ret == false) {
        var tipsMsg = ' <b>' + eventObj.label + '</b>要为数字';

        if (tipsMsg.length > 1) {

            layer.msg(tipsMsg);
        }

        try {
            $(eventObj).focus().select();
        } catch (e) {

        }
    }
    return ret;

}


//会议预定里表单加载赋值CheckBox
function loadLinkCheckBox() {
    var str = $('#useEquipmentId').val();
    if (str) {
        var list = str.split(",");
        for (var i = 0; i < list.length; i++) {
            if (list[i]) {
                var checkArr = list[i].split(":");
                ;
                var id = checkArr[0];

                var ischeck = checkArr[1];
                if (ischeck == '1') {
                    $("#" + id).attr("checked", true);

                } else {
                    $("#" + id).attr("checked", false);
                }

            }

        }
    }

}
//会议预定里表单加载赋值会议用品数量
function loadGoodsNums() {
    var str = $('#goodsNumsId').val();
    if (str) {
        var list = str.split(",");
        for (var i = 0; i < list.length; i++) {
            if (list[i]) {
                var checkArr = list[i].split(":");
                ;
                var id = checkArr[0];
                var val = checkArr[1];
                $("#" + id).val(val);

            }

        }
    }

}

/**
 * 错情登记
 */
function oa_tempWrong() {
    var wfId = $urlParam('wfId');
    var url = project + "/admin/incoming/wrongRegManage.action?wf_id=" + wfId;

    var openUrl = project + "/admin/incoming/wrongRegManage.action?wf_id=" + wfId;//弹出窗口的url
    var iWidth = 900; //弹出窗口的宽度;
    var iHeight = 550; //弹出窗口的高度;
    var iTop = (window.screen.availHeight - 30 - iHeight) / 2; //获得窗口的垂直位置;
    var iLeft = (window.screen.availWidth - 10 - iWidth) / 2; //获得窗口的水平位置;
    window.open(openUrl, "new", "height=" + iHeight + ", width=" + iWidth + ", top=" + iTop + ", left=" + iLeft + ",toolbar=no, menubar=no, scrollbars=no, resizable=no,location=n o, status=no");

}

/**
 * 编号填充

 */

function numberBackSave() {


    var billPageId = $(window.frames["billPageId"].document);
    var $jsCc = billPageId.find(".js-oa-bill-choice-father");

    var $jsNumber = billPageId.find(".js-bill-load-only-number");


    //领导批示单独的编号生成
    var $jsLeaderNumer = billPageId.find(".js-bill-load-leader-number");


//保存主送，抄送

    if ($jsCc.length > 0) {

        $jsCc.each(function () {
            var $this = $(this);
            var $input = $this.find("input");
            var ccContent = $input.attr("id");
            $("#" + ccContent).val($input.val());
        });

    }


//存在编号
    if ($jsNumber.length > 0) {
        var $numberLength = $jsNumber.val().length;
        if ($numberLength < 4) {
            var numberUrl = project + "/admin/documentSerialNumber/createSerialNumber.action?etc=" + new Date().getTime();
            var data = "wfName=" + $urlParam('wfName') + "&fileType=" + $("#" + (globalParams.billSelectId)).find("option:selected").text();

            $.ajax({
                url: numberUrl,
                type: 'post',
                data: data,
                async: false,
                error: function () {
                    window.top.layer.msg("流水号生成失败");

                },
                success: function (result) {
                    if (result.resultFlag == "true") {
                        $jsNumber.val(result.message);
                        var numerId = $jsNumber.attr("id");
                        $("#" + numerId).val(result.message);

                    } else {


                    }
                }
            });
        }

    }

}


function oaTempSaveBefore() {

    var billPageId = $(window.frames["billPageId"].document);


    //遍历全部的输入框
    var $input = billPageId.find("input");


    $input.each(function () {
        var $this = $(this);
        var $id = $this.attr("id");


        //专项事务审批 期限保留时分秒    此处不需要转换
        if ($id == "deal_limit" && globalParams.djsn == "oa_sptrain_audit") {

        }
        //发文 期限保留时分秒    此处不需要转换
        else if ($id == "time_limit" && globalParams.djsn == "oa_send_document") {

        }
        else {


            if ($id) {


                $("#" + $id).val($this.val());
                var upper = $("#" + $id.toUpperCase());

                if (upper.length > 0) {

                    upper.val($this.val());

                }
            }
        }

    });

    var $textarea = billPageId.find("textarea");
    $textarea.each(function (index, el) {
        var $this = $(this);
        var $id = $this.attr("id");
        var strHTml = $(this).val();
        $("#" + $id).val(strHTml.replace(/\n/g, "<br>"));
    });

}


/**
 * 单独验证各个表单的方法
 */
function saveBeforeVerification() {

    var processName = $urlParam("djsn");

    var billPageId = $(window.frames["billPageId"].document);

    //发文时间和转向事务 获取时间
    //专向事务
    if (globalParams.djsn == "oa_sptrain_audit") {
        var $year = billPageId.find("#send_year").val(),
            $month = billPageId.find("#send_month").val(),
            $day = billPageId.find("#send_day").val();
        if ($year.length < 1 || $month.length < 1 || $day.length < 1) {
            layer.msg("请填写申请时间！");
            return true;
        }
        else {
            var dataHtl = $year + "-" + $month + "-" + $day;
            $("#draft_date").val(dataHtl);
        }
        
        var $titleTemp = billPageId.find("#title").val();
        if($titleTemp != null && $titleTemp.length > 1024){
        	layer.msg("事由字数过多！（不能超过1024个字）");
        	return true; 
        }
       
        
    }
    //发文
    if (globalParams.djsn == "oa_send_document") {

        if (billPageId.find("#send_year").length) {


            var $year = billPageId.find("#send_year").val(),
                $month = billPageId.find("#send_month").val(),
                $day = billPageId.find("#send_day").val();
            if ($year.length < 1 || $month.length < 1 || $day.length < 1) {
                layer.msg("请填写申请时间！");
                return true;
            }
            else {
                var dataHtl = $year + "-" + $month + "-" + $day;
                $("#SYTY_DATE").val(dataHtl);
            }
        }


    }


    //收文表单开始
    if (processName == "oa_pg_incoming_form") {

        var processType = $("#" + (globalParams.billSelectId)).find("option:selected").text();
        //办件
        if (processType == "办件" || processType == "阅件" || processType == "国务院文") {

            if (billPageId.find("#FILE_UNIT").val().length < 1) {

                layer.msg("来文单位不能为空!");
                return true;
            }

            if (billPageId.find("#FILE_TITLE").val().length < 1) {

                layer.msg("来文标题不能为空!");
                return true;
            }

        }

        else if (processType == "明传电报") {
            if (billPageId.find("#FILE_UNIT").val().length < 1) {

                layer.msg("来电单位不能为空!");
                return true;
            }
            if (billPageId.find("#FILE_TITLE").val().length < 1) {

                layer.msg("来文标题不能为空!");
                return true;
            }

        }

        else if (processType == "依公开申请") {

            if (billPageId.find("#FILE_TITLE").val().length < 1) {

                layer.msg("依申请内容不能为空!");
                return true;
            }

        }

    }



    //发文开始
    else if (processName == "oa_send_document") {
        if (billPageId.find("#IS_PUBLIC").length && billPageId.find("#PUBLIC_REASON")) {

            var isPublic = billPageId.find("#IS_PUBLIC").val(),
                publicParam = parseInt(isPublic) ? 0 : 1;
            var isPublicReason = billPageId.find("#PUBLIC_REASON").val(),
                reasonParam = isPublicReason.length ? 0 : 1;

            //公开为否的时候，理由为必填
            if (publicParam && reasonParam) {
                layer.msg("请填写不公开理由！");
                billPageId.find("#PUBLIC_REASON").focus();
                return true;
            }
        }
    }


    //领导批示

    else if (processName == "oa_leader_instruction_form") {

        var billUnit = billPageId.find("#from_dept").val(),
            iSbillUnit = billUnit.length ? 0 : 1;
        var toastTitle;

        if (globalParams.wfName == "oa_leader_instruction") {
            toastTitle = "来文单位不能为空";
        }
        else if (globalParams.wfName == "oa_leader_instruction_fb") {
            toastTitle = "反馈单位不能为空";
        }
        //领导批示
        if (iSbillUnit) {
            layer.msg(toastTitle);

            billPageId.find("#from_dept").focus();
            return true;
        }
    }

    //会议 全身性会议登记字段验证

    if (processName === "oa_meeting_info") {

        var meetingName,
            meetingTime,
            meetingLocation,
            toastTitle,
            isWrong = 0;
        if (billPageId.find("#SUBJECT").length) {
            meetingName = billPageId.find("#SUBJECT").val();
        }
        if (billPageId.find("#other").length) {
            meetingTime = billPageId.find("#other").val();
        }
        if (billPageId.find("#LOCATION").length) {
            meetingLocation = billPageId.find("#LOCATION").val();
        }


        //全身性会议审批和备案
        if (globalParams.wfName === "oa_provincial_meeting_approve" || globalParams.wfName === "oa_provincial_meeting_record") {
            isWrong = meetingName.length ? 0 : 1;
            toastTitle = "会议名称不能为空";
        }

        //会议方案和通知
        else if (globalParams.wfName === "oa_meeting_program_approval" || globalParams.wfName === "oa_meeting_notification_approval") {


            if (meetingLocation.length < 1) {
                isWrong = 1;
                toastTitle = "会议地点不能为空";
            }


            if (meetingTime.length < 1) {
                isWrong = 1;
                toastTitle = "会议时间年月不能为空";
            }

            if (billPageId.find("#SUBJECT").length) {
                if (meetingName.length < 1) {
                    isWrong = 1;
                    toastTitle = "会议名称不能为空";
                }
            }


        }


        if (isWrong) {
            layer.msg(toastTitle);
            return true;
        }


    }

    return false;

}


/**
 * 领导传阅抄送
 */

function readPassSaveLeader(){
	
	
    var $nodeName = $urlParam("nodeName");


    if (globalParams.djsn == "oa_pg_incoming_form") {
        var $copySend = $("#copy_send").val();
        var $copyUnit = $("#copy_unit").val();
        var $actorRead = $("#text21").val().split(",");
        var actorData = [];

        $actorRead.forEach(function (vaule, index) {
            if (index > 0) {
                actorData.push(vaule);
            }
        });

        if ($copySend.length > 0 || $copyUnit.length > 0) {


            var obj = {
                "userRead": $copySend.replace(/，/g, ",").replace(/、/g, ",").replace(/;/g, ",").replace(/；/g, ",").replace("同志", ""),
                "orgRead": $copyUnit,
                "actorRead": actorData.join(","),
                "documentReadPass.title": $("#FILE_TITLE").val(),
                "documentReadPass.showUrl": "/form/fceform/common/run.html?djsn=" + globalParams.djsn + "&djtype=eden&actionId=show&wfId=" + globalParams.wfid + "&pass=1&wfs=read&is_oa_bill=true",
                "documentReadPass.readers": "",
                "documentReadPass.dtype": "outin",
                "documentReadPass.wfId": globalParams.wfid

            }

           
            var url = project + "/admin/documentPassRead/autoPassRead.action";
            $.post(url, obj, function () {
            	
                showReadPassInfo("readpassDiv");
            });
        }

    }

    //领导批示

    else if (globalParams.djsn == "oa_leader_instruction_form") {


        var $copyUnit = $("#copy_object").val();
        var $copySend = $("#copy_send").val();
        if ($copyUnit.length > 0 || $copySend.length > 0) {

            var obj = {

                "userRead": $copySend.replace(/，/g, ",").replace(/、/g, ",").replace(/;/g, ",").replace(/；/g, ",").replace("同志", ""),
                "orgRead": $copyUnit,
                "actorRead": "",
                "documentReadPass.title": $("#from_title").val(),
                "documentReadPass.showUrl": "/form/fceform/common/run.html?djsn=" + globalParams.djsn + "&djtype=eden&actionId=show&wfId=" + globalParams.wfid + "&pass=1&wfs=read&is_oa_bill=true",
                "documentReadPass.readers": "",
                "documentReadPass.dtype": globalParams.djsn,
                "documentReadPass.wfId": globalParams.wfid

            }


            var url = project + "/admin/documentPassRead/autoPassRead.action";
            $.post(url, obj, function () {

                showReadPassInfo("readpassDiv");
            });
        }

    }
	
	
}

//收文第二步 抄送栏的单位和人
function readPassSave(status) {

    var $nodeName = $urlParam("nodeName");
    if (globalParams.djsn == "oa_pg_incoming_form" && $nodeName == "secretariat_deputy_director") {
        var $copySend = $("#copy_send").val();
        var $copyUnit = $("#copy_unit").val();
        var $actorRead = $("#text21").val().split(",");
        var actorData = [];

        $actorRead.forEach(function (vaule, index) {
            if (index > 0) {
                actorData.push(vaule);
            }
        });

        if ($copySend.length > 0 || $copyUnit.length > 0) {

            var obj = {
                "userRead": $copySend.replace(/，/g, ",").replace(/、/g, ",").replace(/;/g, ",").replace(/；/g, ",").replace("同志", ""),
                "orgRead": $copyUnit,
                "actorRead":status?"":actorData.join(","),
                "documentReadPass.title": $("#FILE_TITLE").val(),
                "documentReadPass.showUrl": "/form/fceform/common/run.html?djsn=" + globalParams.djsn + "&djtype=eden&actionId=show&wfId=" + globalParams.wfid + "&pass=1&wfs=read&is_oa_bill=true",
                "documentReadPass.readers": "",
                "documentReadPass.dtype": "outin",
                "documentReadPass.wfId": globalParams.wfid

            }



            var url = project + "/admin/documentPassRead/autoPassRead.action";




                $.ajax({
                    url : url,
                    type : 'post',
                    async: false,
                    data :obj,
                    success : function(data){
                        showReadPassInfo("readpassDiv");
                    },
                    fail:function(){

                    }
                });


        }

    }

    //领导批示

    else if (globalParams.djsn == "oa_leader_instruction_form" && $nodeName == "secretariat_deputy_director") {


        var $copyUnit = $("#copy_object").val();
        var $copySend = $("#copy_send").val();
        if ($copyUnit.length > 0 || $copySend.length > 0) {

            var obj = {

                "userRead": $copySend.replace(/，/g, ",").replace(/、/g, ",").replace(/;/g, ",").replace(/；/g, ",").replace("同志", ""),
                "orgRead": $copyUnit,
                "actorRead": "",
                "documentReadPass.title": $("#from_title").val(),
                "documentReadPass.showUrl": "/form/fceform/common/run.html?djsn=" + globalParams.djsn + "&djtype=eden&actionId=show&wfId=" + globalParams.wfid + "&pass=1&wfs=read&is_oa_bill=true",
                "documentReadPass.readers": "",
                "documentReadPass.dtype": globalParams.djsn,
                "documentReadPass.wfId": globalParams.wfid

            }


            var url = project + "/admin/documentPassRead/autoPassRead.action";


            $.ajax({
                url : url,
                type : 'post',
                async: false,
                data :obj,
                success : function(data){
                    showReadPassInfo("readpassDiv");
                },
                fail:function(){

                }
            });




        }

    }
}


function fileNumUpdate() {
	
	

    //收文,会议
    if (globalParams.djsn == "oa_pg_incoming_form"||globalParams.djsn=="oa_meeting_info"||globalParams.djsn=="oa_leader_instruction_form") {

        var $fileNum;
        if(globalParams.djsn == "oa_pg_incoming_form"){
            $fileNum=$("#SERIAL_NUMBER");
        }
        else if(globalParams.djsn == "oa_meeting_info"){
            $fileNum=$("#DOC_NUM");
        }
        else if(globalParams.djsn == "oa_leader_instruction_form"){
            $fileNum=$("#instruction_no");
        }

        if (globalParams.fileNumStart != $fileNum.val()) {

            var numberUrl = project + "/admin/documentSerialNumber/updateSerialNumber.action?etc=" + new Date().getTime();

            var $index = $fileNum.val().substr(4, $fileNum.val().length - 3);
            var data = "wfName=" + $urlParam('wfName') + "&fileType=" + $("#" + (globalParams.billSelectId)).find("option:selected").text() + "&index=" + $index;

            $.ajax({
                url: numberUrl,
                type: 'post',
                data: data,
                async: false,
                error: function () {


                },
                success: function (result) {
                    if (result.resultFlag == "true") {

                    }
                }
            });
        }


    }

    //发文文号

    else if (globalParams.djsn == "oa_send_document") {


        if (globalParams.unUpdate == "0") {
          
        if (globalParams.nodeName == "createFileNo" && globalParams.fileNumStart != $("#DOCUMENT_NO").val()) {


            var numberUrl = project + "/admin/documentFileNumber/updateFileNumber.action?etc=" + new Date().getTime();
            var $index = $("#DOCUMENT_NO").val().split("〕")[1].split("号")[0];
            var obj = {
                // "swungDash":$("#" + (globalParams.billSelectId)).find("option:selected").text(),
                "swungDash": $("#send_word").val(),
                "index": $index
            }

            $.post(numberUrl, obj, function (result) {

            });


        }


        //行政规范性

        if ($("#billId").val() == "0e112e9a45ef4837bc1f6311ed41b1f3" && globalParams.fileNumStart != $("#DOCUMENT_NO").val()) {


            var numberUrl = project + "/admin/documentFileNumber/updateFileNumber.action?etc=" + new Date().getTime();

            var $index = $("#DOCUMENT_NO").val().split("〕")[1].split("号")[0];
            var obj = {
                "swungDash": "行政规范性文件发文立项审批",
                "index": $index
            }

            $.post(numberUrl, obj, function (result) {

            });


        }

        //规范性文件编号


        if (globalParams.nodeName == "createFileNo" && globalParams.sendSerialNumber != $("#serial_number").val()) {

            var numberUrl = project + "/admin/documentSerialNumber/updateSerialNumber.action?etc=" + new Date().getTime();

            var $fileType = ($("#" + (globalParams.billSelectId)).find("option:selected").text()).indexOf("办") > (-1) ? "浙政办" : "浙政";
            var $index = $("#serial_number").val().split("-")[2]
            var data = "wfName=" + $urlParam('wfName') + "&fileType=" + $fileType + "&index=" + $index;

            $.ajax({
                url: numberUrl,
                type: 'post',
                data: data,
                async: false,
                error: function () {


                },
                success: function (result) {

                }
            });


        }

    }
    }


    //领导批示批示序号

     if (globalParams.djsn == "oa_leader_instruction_form") {

         var billPageId = $(window.frames["billPageId"].document);
         var $jsCc = billPageId.find("#instruction_leader");

        if (globalParams.leaderInstructionNum!= $("#instruction_order").val()) {


            var numberUrl = project + "/admin/documentLeaderNumber/updateLeaderNumber.action?etc=" + new Date().getTime();

            var $index = $("#instruction_order").val().split("第")[1].split("号")[0];
            var obj={
                "swungDash":$jsCc.val(),
                "index":$index
            }

            $.post(numberUrl,obj,function (result) {

            });


        }





    }

    

}

/**
 * 工作流暂存
 */
function oa_wf_tempSave(datasetName, callBack) {

    fileNumUpdate();
    oaTempSaveBefore();
    numberBackSave();
//    saveBeforeVerification();

    //是否已通过 saveBeforeVerification的验证  true未通过,false已通过

    if (saveBeforeVerification()) {
        return;
    }


    var index = layer.load(2, {
        shade: [0.5, '#000']
        //scrollbar: false //0.1透明度的白色背景
    });


    var wfId = QueryURL.GetValue('wfId');
    if (undToSp(wfId) == '') {
        layer.msg("流程实例还未启动，不能做业务数据的暂存！");
        return;
    }
    var wfName = QueryURL.GetValue('wfName');
    var wfDesc = unescape(QueryURL.GetValue('wfDesc'));
    var wfVersion = QueryURL.GetValue('wfVersion');
    var actionId = QueryURL.GetValue('actionId');
    var dynamicInstanceId = QueryURL.GetValue('dynamicInstanceId');

    isWorkflow = true;
    wfUserType = 'before_temp_check';
    var sKey = "wf_id=" + wfId + ";action_id=" + actionId;
    if (typeof(dynamicInstanceId) != "undefined" && dynamicInstanceId != null && dynamicInstanceId != "undefined" && dynamicInstanceId != "null")
        sKey += ";dynamic_instance_id=" + dynamicInstanceId;
    wfPubParam = sKey;
    //隐藏办理单下拉框以及跟新到数据集
    // 法制办时，下拉存在
    if (globalParams.nodeName !== "office_audit") {
        $("#" + (globalParams.billSelectId)).hide();
    }

    //经办人处理环节
    if (globalParams.nodeName === "operator_deal") {
        //处室，联系人，电话
        $("#draft_dept").val(globalParams.myOrgName);
        $("#draft_man").val(globalParams.loginChineseName);
        $("#draft_phone").val(globalParams.cellphone);

    }


    var $typeText = $("#" + (globalParams.billSelectId)).find("option:selected").text();

    if ($typeText == "合法性审查" || $typeText == "送法制办") {

    }
    //
    //else if($typeText=="行政规范性文件发文立项审批单"||$typeText=="行政规范性文件发文立项审批件"){
    //    if(globalParams.nodeName!="fwlx"){
    //        $("#"+(globalParams.billSelectId)).show();
    //    }
    //
    //
    //}
    else {

        if ($("#billId").val().length < 1) {
            $("#billId").val($("#" + (globalParams.billSelectId)).val());
        }


    }


    //禁用保存按钮
    $("#buttonSave").prop("disabled", true);


    doSubmitData(function () {

        refreshDsById(datasetName); //刷新dataset

        refreshDsById("datasetBill");

        //等待数据集的刷新
        var interval = setInterval(function () {
            if (data_dataset2.first()) {
                loadEnd();
                $("#buttonSave").prop("disabled", false);

                //生成pdf文件
                var pafData = [{
                    'condition': 'office_audit',
                    'fileType': 'hfxsc'
                }, {
                    'condition': 'toPl',
                    'fileType': 'fzb'
                }];

                pafData.forEach(function (value) {
                    if (globalParams.djsn === "oa_pg_incoming_form" && globalParams.nodeName === value.condition) {

                        var $id = data_dataset2.item(data_dataset2.first()).id;

                        var bill = document.getElementById('billPageId');

                        var $billId = bill.contentWindow.billName;
                        var pdfUrl = project + "/admin/handleToWordPDF/buildWfAttachmentByPDF.action?id=" + $id + "&billId=" + $billId + "&moduleType=oa_incomming_info&fileType=" + value.fileType;

                        $.post(pdfUrl, function (data) {

                        });
                    }
                });


                if (typeof (callBack) == "function") {
                    callBack();

                } else {

                    layer.msg("保存成功!");
                }
                clearInterval(interval);
            }

        }, 10);


        //保存签批信息
        saveSignInfo();
        //  loadEnd();
    });

}


/**
 * 重新加载下拉控件 更换请求
 */
function loadSelectList(id, dropdownlistId, sqltrans, callback) {

    var url = project + "/admin/documentBill/getBillList.action?etc=" + new Date().getTime() + "&wf_id=" + globalParams.wfid;

    $.getJSON(url, function (response) {

        if (response.datas.length) {

            var showList = [];
            var valList = [];

            response.datas.forEach(function (value) {
                showList.push(value.bill_name);
                valList.push(value.id);
            });


            if (showList.length !== valList.length) {
                layer.msg('返回的数据，“显示”与“取值”数量不对应！');
            } else {

                if ($('#sel_' + id).length == 1) {        //已经存在select

                    if ($('#sel_' + id).val() == (-1)) {
                        $('#sel_' + id).html("");
                    }
                    var html = '';
                    for (var i = 0; i < showList.length; i++) {
                        var sl = showList[i];
                        var vl = valList[i];
                        if (vl == '')  vl = 'null';
                        html += '<option value="' + vl + '">' + sl + '</option>';
                    }
                    $('#sel_' + id).append(html);
                } else {                              // 新增select
                    var html = '<select style="position:' + position + '; width: ' + width + 'px;height: ' + height + 'px;left:' + left + 'px;top: ' + top + 'px;" name="sel_' + id + '" id="sel_' + id + '">';
                    for (var i = 0; i < showList.length; i++) {
                        var sl = showList[i];
                        var vl = valList[i];
                        html += '<option value="' + vl + '">' + sl + '</option>';
                    }
                    html += '</select>';
                    select.after(html);
                    if (enabled == 'true') $('#sel_' + id).prop('disabled', true);
                    if (visible == '否') $('#sel_' + id).hide();
                    $('#sel_' + id).change(function () {
                        eval(onchange);
                    })
                }
            }

            if (callback) {
                eval(callback);
            }
        }

    });
}


/**
 * 处于办结状态下的流程重启

 */

function processRestart(){

    var isEnd = layer.confirm('确认重启流程？', {
        btn: ['确定', '取消'] //按钮
    }, function () {
        layer.closeAll('dialog');
        var url=project+"/admin/flowManager/flowTaskAction!selectHistoryWfPage.action?op=do_revoke_finish&wfId="+(globalParams.wfid);
        createWindow({
            text: '重启流程',
            url: url,
            id: 'dhxPop',
            width: '650',
            height: '290',
            callBack: function (val, text) {
            }
        });

    }, function () {

    });
}

/**
 * 重新加载下拉控件
 * dropdownlistId: id值
 * sqltrans:
 * callback:回调
 */
function reloadDropdownlist(dropdownlistId, sqltrans, callback) {

    var id = dropdownlistId;
    var sendXml = '<root><percolnum>1</percolnum><sql>' + sqltrans + '</sql><strValue></strValue><perpagerownum>50</perpagerownum><showcheckbox>false</showcheckbox><blnempty>否</blnempty><addrow>否</addrow></root>';

    loadSelectList(id, dropdownlistId, sqltrans, callback);

}


var localOaUserId;   //当前用户id

//获得当前用户

function getOaLocalUserId() {
    if (!localOaUserId) {
        localOaUserId = GetSessionOne('userid')

    }

    return localOaUserId;
}


/*
 * 公文管理编辑意见
 */
function changeOaAdvice(gridId) {
    var gridOb = getGrid(gridId);

    var id = gridOb.getSelectedRowId(); //获取grid当前选中的一行


    if (id === null) { //如果grid1没有选中
        alert("请选中某一个意见");
    } else {


        var datasetId = $('#' + gridId).attr('dataset');
        var ds = getDs(datasetId);
        var daItem = ds.item(id);
        var adviceCreater = daItem.CREATE_BY;
        var userType = GetSessionOne('account_type_key');
        userType = parseInt(userType);
        if (getOaLocalUserId() != adviceCreater && userType <= 1) {

            layer.msg("不能修改别人的意见！");
            return;
        }

        createWindow({
            text: '意见编辑',
            url: project + '/form/fceform/common/runOther.html?djsn=oa_advice_edit&djtype=eden_wf&id=' + id,
            id: 'adviceEdit',
            width: '500',
            height: '400',
            parent_window: window,
            callBack: function (con, createBy, createDate, isdel) {

                location.reload();
                setTimeout(function () {
                    window.closeWin('adviceEdit');
                }, 300);

            }
        });


    }


}


/*
 * 公文管理添加意见
 * 
 * gridOb:意见列表的grid对象（无用）
 * wfId： 流程id
 * type: 意见类型
 * adviceDatasetName:意见dataset的id名，用于增加后刷新（无用）
 */
function addOaDocumentAdvice(gridOb, wfId, type, adviceDatasetName) {
    var param = "";

    if (type) {
        param = "&type=" + type;
    }

    var actionId = QueryURL.GetValue('actionId');

    param += "&actionId=" + actionId;
    var user = GetSessionOne('userid');
    createWindow({
        text: '意见添加',
        url: project + '/form/fceform/common/runOther.html?djsn=oa_advice_add&djtype=eden_wf&wfId=' + wfId + '&username=' + user + param,
        id: 'adviceAdd',
        width: '500',
        height: '400',
        parent_window: window,
        callBack: function (con, type, createBy, createDate) {


            location.reload();
            setTimeout(function () {
                window.closeWin('adviceAdd');
            }, 500);

        }
    });


}


/**
 * 传阅按钮
 * showReadPassDivIdName:显示传阅页面的div的id名，用于刷新执行后刷新传阅页面
 * titleIdName: title text的id名， text9
 * dtype: 文档类型
 *
 * 要有wfId全局变量
 */
function insideSend(showReadPassDivIdName, titleIdName, dtype) {


    var passUrl = project + "/admin/documentPassRead/passerUseExchangeChoice.action?wfId=" + (globalParams.wfid);

    createWindow({
        text: '增加传阅人',
        url: passUrl,
        id: 'dhxPop',
        width: '900',
        height: '550',
        callBack: function (val, text) {
        }
    });


}

//领导传阅
function leadershipCirculation(){
	
	
	
	
	
	  // layer.msg("传阅中...");


	    var callback = function () {

	    	
	    	readPassSaveLeader();
	        var passUrl=project + '/admin/commonDispatch/leadershipCirculation.action?wfId='+(globalParams.wfid)

	        createWindow({
	            text: '领导传阅',
	            url: passUrl,
	            id: 'dhxPop',
	            width: '900',
	            height: '550',
	            callBack: function (val, text) {
	            }
	        });



	    }
	    oa_wf_tempSave("dataset2", callback);
	
	

}

/**
 * 添加传阅人，
 * showReadPassDivIdName:显示传阅页面的div的id名，用于刷新执行后刷新传阅页面
 * 要有wfId全局变量
 */
function readPassAddPasser(showReadPassDivIdName) {

    var selectUrl = project + "/admin/documentData/getUserOrgInfo.action";
    $.post(selectUrl, "", function (result) {

        if (result.enterpriseOrg) {
            var url = project + "/form/fceform/common/runOther.html?djsn=selReadPasserUser&djtype=eden_form&isAddUser=1&wfId=" + wfId;
            url += "&notSelect=1&orgId=" + result.enterpriseOrg.orgId;
            createWindow({
                text: '添加传阅的人',
                url: url,
                id: 'insideSendUser',
                width: '670',
                height: '400',
                callBack: function () {
                    showReadPassInfo(showReadPassDivIdName); //刷新传阅页面
                    window.closeWin('insideSendUser');
                }
            });


        }

    });


}


/**
 * 取消传阅
 *
 * showReadPassDivIdName：显示传阅的div的id名，用于刷新执行后刷新传阅页面
 * 要有wfId全局变量
 */
function cancelInsideSend(showReadPassDivIdName) {

    var url = project + "/form/fceform/common/runOther.html?djsn=CancelPassRead&djtype=eden_wf&wfId=" + wfId;

    createWindow({
        text: '取消传阅',
        url: url,
        id: 'cancelInsideSend',
        width: '235',
        height: '200',
        callBack: function () {

            showReadPassInfo(showReadPassDivIdName); //刷新传阅页面
            window.closeWin('cancelInsideSend');
        }
    });

}


/**
 * 显示传阅页
 * @param showReadPassDivIdName 显示传阅记录的div的id名
 */
function showReadPassInfo(showReadPassDivIdName, callback) {
    var showReadPassDivOb = $("#" + showReadPassDivIdName);
    if (!showReadPassDivOb) {
        return;
    }
    $("#readpassDiv").html("");
    var noreaderArr;
    var url = project + "/admin/documentPassRead/showReadPassInfo.action";
    var data = "wfId=" + wfId;
    var tableHtml;
    var tableHtmlRead = '';
    var endPassTime = '';
    var createDttm = '';
    $.post(url, data, function (result) {
        //未阅的人
        var noreaders = "";
        //已阅列表
        var hasReaderList = "";
        //传阅信息
        var passRead = "";
        if (result) {
            noreaders = result.noReaders;
            hasReaderList = result.hasReaderList;
            passRead = result.passRead;

        }


        if (passRead) {

            if (passRead.createDttm) {
                createDttm = passRead.createDttm.replace("T", " ");
            }


            if (passRead.dataValid != 1) {
                var cancelDttm = "";
                if (passRead.cancelDttm) {
                    cancelDttm = passRead.cancelDttm.replace("T", " ");
                }


                endPassTime += "<tr class=''><td width='100'>传阅结束时间</td> <td>" + cancelDttm + "</td> </tr>"

            }


        }

        tableHtml = "<table id='oa_read_pass_grid' class='oa-read-pass-grid'><tr class=''><td width='100'>开始传阅时间</td> <td>" + createDttm + "</td> </tr>";
        tableHtml += endPassTime;


        if (noreaders) {
            noreaderArr = noreaders.split(",");

            for (var i = 0; i < noreaderArr.length; i++) {


            }
            tableHtml += "<tr class=''><td width='100'>未阅读记录</td><td>" + noreaderArr.join(" ") + "</td> </tr>";
        }
        else {
            tableHtml += "<tr class=''><td width='100'>未阅读记录</td><td>&nbsp;</td> </tr>";
        }


        if (hasReaderList) {
            if (hasReaderList.length > 0) {
                for (var i = 0; i < hasReaderList.length; i++) {
                    var updateTime = "";
                    if (hasReaderList[i].lastUpdateDttm) {
                        updateTime = hasReaderList[i].lastUpdateDttm.replace("T", " ");
                    }
                    tableHtmlRead += "<tr><td>" + (i + 1) + "</td><td>" + hasReaderList[i].cnUserName + "</td><td>" + updateTime + "</td></tr>";

                }
            }
            else {

                tableHtmlRead += "<tr><td  colspan='3' style='text-align:center!important;'>暂无已阅记录</td></tr>";
            }

        }
        else {

            tableHtmlRead += "<tr><td  colspan='3' style='text-align:center!important;'>暂无已阅记录</td></tr>";
        }
        var alreadRecord = "<table class='oa-read-pass-grid' style='margin-top:20px;'><tr><th width='100'>序号</th><th width='200'>已阅人</th><th>已阅时间</th></tr>";
        alreadRecord += tableHtmlRead;
        tableHtml += "</table>";
        alreadRecord += "</table>"
        showReadPassDivOb.append(tableHtml);
        showReadPassDivOb.append(alreadRecord);
        if (callback) {
            eval(callback);
        }

    });

}


//查看流程
function showWf() {

    var url = project + '/form/fceform/common/runOther.html?djsn=wf_history_list&djtype=eden_wf&wf_id=' + wfId;

    // window.open(url,"_blank");

    createWindow({
        text: '流程图',
        url: url,
        id: 'showWf',
        width: '1000',
        height: '600',
        parent_window: window

    });

}


/**
 * 对控件设置附件的信息
 * AttAmountId:要设附件数量的控件id名
 * AttFileNamesId:要设附件文件名的控件id名
 *
 */
function setAttachmentInfo(attAmountId, attFileNamesId) {
    var url = project + "/admin/documentData/getAttachmentData.action";
    var param = "wfId=" + wfId;


    $.ajax({
        type: "post",
        url: url,
        data: param,
        success: function (data) {

            var count = 0;
            var names = "";

            if (data) {
                var nameList = data.list;
                if (nameList) {
                    count = nameList.length;
                    for (var i = 0; i < nameList.length; i++) {
                        names += "," + nameList[i];

                    }
                    if (names) {
                        names = names.substring(1);
                    }
                }


            }
            if (attAmountId) {
                var attAmountOb = $('#' + attAmountId);
                if (attAmountOb.is('label')) {

                    attAmountOb.text(count);
                } else {
                    attAmountOb.val(count);
                }


            }
            if (attFileNamesId) {

                var attFileNamesOb = $('#' + attFileNamesId);
                if (attFileNamesOb.is('label')) {

                    attFileNamesOb.text(names);
                } else {
                    attFileNamesOb.val(names);
                }

            }


        }
    });

}







/**
 * 办结管理
 */

function openManagementEnd() {

    var wfid = $urlParam("wfId");
    var action = $urlParam("actionId");
    var url = project + "/admin/wfManage/closeWf.action?wf_id=" + wfid + "&action_id=" + action;

  var oaSptrainUrl=project+"/admin/incoming/judgeSeek.action?etc="+new Date().getTime()+"&wfId="+wfid;

    $.getJSON(oaSptrainUrl,function (data) {
        if(data.msg=="success"){
            var oaSptrainAuditUrl = project + "/admin/commonDispatch/printPlant.action?type=1";
            createWindow({
                text: '征求意见反馈',
                url: oaSptrainAuditUrl,
                id: 'dhxPop',
                width: '800',
                height: '500',
                callBack: function (val, text) {
                }
            });
        }

    });

    layer.confirm("是否归档", {
            btn: ['确定', '取消']
        }, function () {

            if ($("#archive_type").length > 0) {
                $("#archive_type").val(1);

                layer.closeAll('dialog');
            }

            var fileCallBack = function () {
                $.post(url, function (data) {
                    if(globalParams.djsn=="oa_send_document"&&globalParams.nodeName=="bms"){

                        var messageConfirm=layer.confirm('是否发送短信',{
                            btn: ['确定', '取消']
                        },function () {
                            var url=project+ "/admin/commonDispatch/endSendMessage.action";
                            createWindow({
                                text: '发送短信',
                                url: url,
                                id: 'dhxPop',
                                width: '800',
                                height: '450',
                                callBack: function (val, text) {
                                }
                            });

                        },function () {
                            refreshIndex();
                            setTimeout(function () {
                                window.close();
                            }, 1000);
                        });
                    	
                    }else{
                        layer.msg(data.datas);
                        if (data.datas = "办结成功") {
                            refreshIndex();
                        }
                        setTimeout(function () {

                            window.close();
                        }, 1000);
                    }

                });

            }

            oa_wf_tempSave("dataset2", fileCallBack);

        }, function () {

            if ($("#archive_type").length > 0) {
                $("#archive_type").val(0);
            }


            var endCallBack = function () {
                var isEnd = layer.confirm('是否办结？', {
                    btn: ['确定', '取消']
                }, function () {
                    $.post(url, function (data) {
                        if(globalParams.djsn=="oa_send_document"&&globalParams.nodeName=="bms"){

                            var messageConfirm=layer.confirm('是否发送短信',{
                                btn: ['确定', '取消'] //按钮
                            },function () {
                                var url=project+ "/admin/commonDispatch/endSendMessage.action";
                                createWindow({
                                    text: '发送短信',
                                    url: url,
                                    id: 'dhxPop',
                                    width: '800',
                                    height: '450',
                                    callBack: function (val, text) {
                                    }
                                });

                            },function () {
                                refreshIndex();
                                setTimeout(function () {
                                    window.close();
                                }, 1000);
                            });
                            
                        }else{
                            layer.msg(data.datas);
                            if (data.datas = "办结成功") {

                            }
                            refreshIndex();
                            setTimeout(function () {
                                window.close();
                            }, 1000);
                        }

                    });

                }, function () {

                });

            }

            oa_wf_tempSave("dataset2", endCallBack);

        }
    );



}

/**
 * 打开附件管理
 */
function openAttachment(isAttachmentRead) {

    //判断是否已经是发送状态了
    if (global.isSendOut) {
        var isRead = 0; //默认可以编辑附件
        if (isAttachmentRead) //如果存在isAttachmentRead，为1时，可以设为不能编辑附件
        {
            isRead = isAttachmentRead;
        }
        var actionId = $urlParam('actionId');  //是查看时不能编辑
        if (actionId && actionId == 'show') {
            isRead = 1;
        }


        var id = getMainDsId();
        if (!id) {
            return;
        }
        createWindow({
            text: '附件管理',
            url: project + '/form/fceform/common/runOther.html?isRead=' + isRead + '&djsn=oa_document_attachment&djtype=eden_wf&wfId=' + id,
            id: 'openAttachment',
            width: '660',
            height: '380',

            callBack: function (val) {

                window.closeWin('openAttachment');
                location.reload();
            }
        })

    } else {
        layer.msg("请进入下一环节");
    }
}

/**
 * 审批不通过
 */
function approvalNotPass() {

    createWindow({
        text: '审批不通过理由',
        url: project + '/admin/commonDispatch/approvalNotPass.action',
        id: 'approvalNotPass',
        width: '660',
        height: '380'
    })
}
/**
 * 送印刷厂
 */

function sendPrintCenter() {


    var callback=function () {
        var url = project + "/admin/commonDispatch/printPlant.action";
        createWindow({
            text: '送印刷厂',
            url: url,
            id: 'dhxPop',
            width: '800',
            height: '500',
            callBack: function (val, text) {
            }
        });
    }

    oa_wf_tempSave("dataset2", callback);

}


/**
 * 起草正文
 * id:主表的id值
 */
function draftDoc(id, swungdash) {


    var templateDataUrl = project + "/admin/commonTree/commonTreeAction!getTree.action?key=ew_template";
    var param = "";
    $.post(templateDataUrl, param, function (result) {
        var isfind = false;
        if (result.item && result.item.length > 0) {

            var item = result.item;
            var items = item[0].items;
            if (items && items.length > 0) {
                for (var i = 0; i < items.length; i++) {
                    var text = items[i].text;
                    var templateId = items[i].id;
                    var parentId = items[i].parentId;

                    if (text == swungdash) {

                        isfind = true;
                        openDraftDoc(parentId, id, templateId)
                    }
                }
            }

        }
        if (!isfind) {
            openSelectTemplate(id);
        }

    });


}


function openSelectTemplate(id) {
    var url = project + '/admin/template/selectTemplate.action?time=' + new Date().getTime() + '&id=' + id;
    /*if(swungdash)
     {
     url+='&swungdash='+swungdash;
     }*/
    createWindow({
        text: '选择模版',
        url: url,
        id: 'select_template',
        width: '200',
        height: '420',
        parent_window: window
    });

}

//打开word编辑界面
// templateId:，模板id，businessId：业务id
function openDraftDoc(parentId, businessId, templateId) {
    var id = templateId;
    var fileName = "doc_" + id + "_" + businessId + ".doc";
    var url = project + '/documentEdit/TemplateEdit.jsp?FileType=.doc&UserName=eden&parentId=' + parentId + '&treeId=' + id + '&templateId=' + id + '&RecordID=' + businessId + '&fileName=' + fileName + '&businessId=' + businessId;

    window.open(url, '文档编辑', '');
}

//打开word编辑界面
//templateId:，模板id，businessId：业务id
function openCreateDoc(parentId, businessId, templateId) {
    var id = templateId;
    var fileName = "doc_" + id + "_" + businessId + ".doc";
    var url = project + '/documentEdit/TemplateDraft.jsp?FileType=.doc&UserName=eden&parentId=' + parentId + '&treeId=' + id + '&templateId=' + id + '&RecordID=' + businessId + '&fileName=' + fileName + '&businessId=' + businessId;

    window.open(url, '文档起草', '');
}

/**
 * 查看正文
 * id:主表的id值
 */
function viewDoc(id) {

    if (!id) {
        layer.msg("id不存在！");
        return;
    }
    var username = GetSessionOne('userid');
    var url = project + '/documentEdit/previewWord.jsp?FileType=.doc&UserName=' + username + '&parentId=ew_template&treeId=&templateId=&businessId=' + id + '&RecordID=' + id + '&fileName=doc_' + id + '.doc';
    window.open(url, '文档查看', '');

}


function downloadDoc() {
    var dataItem = mainDataset.item(mainDataset.idByIndex(0));
    if (dataItem) {
        var id = dataItem.ID;
        if (!id) {
            id = dataItem.id;
        }
        var url = project + '/admin/documentData/getOfficeFile.action?recordID=' + id;
        location.href = url;
    } else {


        layer.msg("id不能为空，不能下载！");
    }

}

/**
 * 修改正文
 * id:主表的id值
 */
function updateDoc(id, optype) {

    if (!id) {

        layer.msg("id不存在！");
        return;
    }
    var username = GetSessionOne('userid');

    var checkUrl = project + "/admin/documentData/openCheckIsDocLock.action?t=" + new Date().getTime();
    var data = "recordID=" + id;
    $.post(checkUrl, data, function (result) {

        if (result.msg == "lock") {

            layer.msg("其他人正在编辑，文档已锁定，请过段时间再来编辑！只能进行查看！");

            window.setTimeout(function () {
                viewDoc(id);

            }, 2000);
        } else {
            var name = '文档编辑';
            var url = project + '/documentEdit/editWord.jsp?FileType=.doc&UserName=' + username + '&parentId=ew_template&treeId=&templateId=&businessId=' + id + '&RecordID=' + id + '&fileName=doc_' + id + '.doc';
            if (optype == 2) {
                url += "&optype=2";
                name = "盖章";
            }
            if (optype == 3) {
                url += "&editType=3,1&showType=2";
                name = "批示";
            }

            window.open(url, name, '');
        }


    });


}


/**
 * 操作正文,与上面传参不同
 * @param datasetId：dataset id名
 * @param op:  1:起草 2:查看 3:编辑
 * @param swungdash:机关代字只，起草时用到
 */
function operateDocByDatasetName(datasetId, op, swungdash) {


    var treeDataJson = [];

    function jsonTree(result) {
        for (var i = 0, max = result.length; i < max; i++) {
            treeDataJson.push({
                "id": result[i].id,
                "name": result[i].name,
                "text": result[i].text,
                "parentId": result[i].parentId,
                "primaryKey": result[i].parentId
            });
            var child = result[i].children;
            if (child) {
                jsonTree(result[i].children);
            }
        }
    }

    function getTreeData() {
        var key = "ew_template";
        var treeData = project + "/admin/commonTree/commonTreeAction!getTree.action?key=" + key + "&etc=" + new Date().getTime();
        $.post(treeData, function (data) {

            jsonTree(data);

            var typeText = $("#" + (globalParams.billSelectId)).find("option:selected").text();

            var istrue = true;

            treeDataJson.forEach(function (value) {

                if (typeText == (value.name)) {
                    var id = value.id;
                    var businessId = data_dataset2.first();
                    var fileName = "doc_" + id + "_" + businessId + ".doc";
                    var tempText = "TemplateEdit";
                    if (globalParams.draftText) {
                        tempText = "TemplateDraft";
                    }
                    window.open(project + '/documentEdit/' + tempText + '.jsp?FileType=.doc&UserName=eden&parentId=ew_template&treeId=' + id + '&templateId=' + id + '&RecordID=' + businessId + '&fileName=' + fileName + '&businessId=' + businessId);
                    globalParams.draftText = 0;
                    istrue = false;
                    return;
                }
            });

            if (istrue) {
                layer.msg("尚未匹配到类型");
            }


        });

    }


    var ds = getDs(datasetId);

    var dataItem = ds.item(ds.idByIndex(0));

    if (!dataItem) {

        layer.msg("请先保存");
        return;
    }

    var id = dataItem.ID;
    if (!id) {
        id = dataItem.id;
    }

    switch (op) {

        case 1:   //起草
        {

            getTreeData();

            break;
        }
        case 2:   //查看
        {
            viewDoc(id)
            break;
        }
        case 3:   //编辑
        {
            updateDoc(id);
            break;
        }
        case 4:   //盖章
        {
            updateDoc(id, 2);
            break;
        }
        case 5:   //审批
        {
            updateDoc(id, 3);
            break;
        }
        default : {

            layer.msg("操作正文参数不正确");
        }


    }


}

/**
 * 默认tab页显示哪一样，用于打开时先打开办理单
 * @param tabId tab的id名
 * @param index 从0开始
 */
function defaultTabSelect(tabId, index) {
    var tab = $('#' + tabId);
    if (tab) {
        tab.children('.tab_header').find('li').eq(index).click();
    }
}

/**
 * 回退功能
 */
function openBackPage() {

    var wfId = $urlParam('wfId');
    var instanceId = $urlParam('dynamicInstanceId');
    var actionId = $urlParam('actionId');
    var url = project + "/admin/flowManager/flowTaskAction!selectHistoryWfPage.action?op=do_goback&wfId=" + wfId + "&actionId=" + actionId + "&instanceId=" + instanceId;

    createWindow({
        text: '退回流程',
        url: url,
        id: 'selectHistoryWfPage',
        width: '650',
        height: '290',
        'parent_ifr': window,
        callBack: function (val, text) {
        }
    });


}


/**
 * 关闭当前页面
 */
function closeLocalWin() {

    try {
        if (ParentIframe.SimpleSearch) {
            ParentIframe.SimpleSearch();
        }
        window.top.closeWin('workFlow');
    } catch (e) {

    }

    window.close();

}


/**
 * 点击页面关闭按钮时提示
 * @returns {Boolean}
 */
function checkLeave() {

    if (mainDataset) {
        var dataItem = mainDataset.item(mainDataset.idByIndex(0));

        if (dataItem) {
            return true;
        }

        if (confirm("还未保存，确定离开当前页面吗？")) {

            return true;
        }
    } else {
        return true;
    }

    return false;

}

/**
 * 打开关联链接
 * @param link
 */
function openlink(link) {
    if (link.indexOf("http") != 0) {

        link = project + link;
    }
    var surl = link;
    var wfDesc = "相关链接查看";
    var height = $(window.top).height();
    window.top.createWindow({
            id: 'workFlowShow',
            text: wfDesc,
            setModal: true,
            url: surl,
            width: '800',
            height: height - 30,
            parent_ifr: window,
            afterClose: function () {
                if (window.top.getModuleFrame('start'))
                    window.top.getModuleFrame('start').taskReload('flow_task');

            }
        }
    );

}

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
 * 加载css
 * @param url
 */
function includeLinkStyle(url) {
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = url;

}

/**
 * 动态分支 sql里要用
 * @returns {String}
 */
function addParentCondition() {
    var str = "";

    if (parentId != '') {
        str = " and i.parent_id=" + parentId;
    }
    return str;
}


/**
 * 加载办理单便签页面
 */
function loadDroplistDataAndNotePage(notediv) {

    var $wfid = $urlParam('wfId');
    var getsrc = project + "/admin/noteManage/showNotesPage.action?wf_id=" + $wfid + "&action_id=" + $urlParam('actionId') + "&dynamic_instance_id=" + $urlParam('dynamicInstanceId');

    var sFrame = '<iframe charset="utf-8" id="notePageId" name="notePageId" src="'
        + getsrc
        + '" style="border:none"  width="100%" height="100%"  frameborder="0" scrolling="no" marginwidth="0" marginheight="0" ></iframe>';

    $("#notediv").html(sFrame);

}

/**
 * 加载办理单流程记录页面
 */
function loadRecordPage(notediv) {

    var $wfid = $urlParam('wfId');
    var getsrc = project + "/admin/wfManage/showFlowHistory.action?wfid=" + $wfid;

    var sFrame = '<iframe charset="utf-8" id="historyPageId" name="historyPageId" src="'
        + getsrc
        + '" style="border:none"  width="100%" height="100%"  frameborder="0" scrolling="no" marginwidth="0" marginheight="0" ></iframe>';

    $("#recorddiv").html(sFrame);

}


/**
 * 加载办理单附件页面
 */

function loadAttachmentPage(notediv) {

    var fileUrl = "fileManage";
    var $wfid = $urlParam('wfId');

    var $djsn = $urlParam("djsn");

    //历次版本只有发文和会议才有
    if ($djsn == "oa_send_document" || $djsn == "oa_meeting_info" || $djsn == "oa_sptrain_audit") {

        fileUrl = "fileManageHistory";
    }

    var getsrc = project + "/admin/wfUpload/" + fileUrl + ".action?wf_id=" + $wfid;

    var sFrame = '<iframe charset="utf-8" id="filePageId" name="filePageId" src="'
        + getsrc
        + '" style="border:none"  width="100%" height="100%"  frameborder="0" scrolling="no" marginwidth="0" marginheight="0" ></iframe>';

    $("#attachmentdiv").html(sFrame);

}


/**
 * 加载选择办理单下来控件和办理单页面
 */
function loadDroplistDataAndBillPage(billDropdownlistId, billdivId) {

    if (wfId) {

        var sqltrans = "select bill_name,id from oa_document_bill where wfname=(select name from wf_wfentry where id=" + wfId + ") order by bill_order";
        var callBackStr = "loadBillPage('" + billDropdownlistId + "','" + billdivId + "')";

        reloadDropdownlist(billDropdownlistId, sqltrans, callBackStr);
    }


}

//领导反馈-反馈信息tab
function loadFeedBack(feedbackid) {
    var id = feedbackid;
    var $wfid = $urlParam('wfId');
    var getsrc = project + "/admin/instructionFB/executeInst.action?iType=feedBackInfo&feedBack=true&wfId=" + $wfid + "&documentId=" + data_dataset2.first();
    var sFrame = '<iframe charset="utf-8" id="feedbackPageId" name="feedbackPageId" src="'
        + getsrc
        + '" style="border:none"  width="100%" height="100%"  frameborder="0" scrolling="no" marginwidth="0" marginheight="0" ></iframe>';
    $("#" + id).html(sFrame);
}


/**
 *
 * @param billDropdownlistId  选择办理单的页面
 * @param billdivId 办理单显示位置的div的id名
 */
function loadBillPage(billDropdownlistId, billdivId) {

    var dropdownlistOb = $("#sel_" + billDropdownlistId);
    var billName = dropdownlistOb.val();

    var billLoadType = $urlParam("djsn");
    if (billName == -1) {

        $("#sel_" + billDropdownlistId + " option:nth-child(2)").attr("selected", "selected");

    }
    var addPram = "";
    if ("undefined" != typeof signEditArea && signEditArea != '') {
        addPram += "&signEditArea=" + signEditArea;
    }

    //是否已经保存过;
    if ($("#billId").length > 0) {

        if ($("#billId").val().length > 1) {

            dropdownlistOb.hide();
            billName = parent.$("#billId").val();

            //选择默认的下拉菜单
            var selectOption = $("#sel_" + billDropdownlistId + " option");
            selectOption.each(function (index) {
                var $thisOption = $(this);

                if ($thisOption.val() == billName) {
                    $thisOption.attr("selected", "selected");
                }
            });


        }
        else {
            //发文去除行政性规范
            if (globalParams.djsn === "oa_send_document") {
                $("#sel_dropdownlist29 option").each(function () {
                    var $this = $(this),
                        $val = $this.attr("value");

                    // if ($val == "0e112e9a45ef4837bc1f6311ed41b1f3" || $val == "8a1c61ededf1494788cd779a740bb528") {
                    if ($val == "0e112e9a45ef4837bc1f6311ed41b1f3") {
                        $this.remove();
                    }

                });
            }
        }

    }


    //是否下拉菜单个数为1;
    if ($("#sel_" + billDropdownlistId + " option").length < 2) {
        dropdownlistOb.hide();
    }

//法制办 收文流程
    if (globalParams.djsn === "oa_pg_incoming_form") {
        //法制办环节
        legalSelect();

    }


    //发文流程存储发文代字
    if(billLoadType=="oa_send_document"){
        if($("#send_word").val().length<1){
            $("#send_word").val(dropdownlistOb.find("option:selected").text());
        }
    }

    if (billName && billName != -1) {

        var id = getMainDsId(1);

        //加载办理单
        var getsrc = project + "/admin/documentBill/openBill.action?wf_id=" + wfId + "&stepId=" + (globalParams.stepId) + "&officeId=" + id + "&billName=" + billName + addPram;

        var sFrame = '<iframe charset="utf-8" id="billPageId" name="billPageId" src="'
            + getsrc
            + '" style="border:none"  width="100%" height="100%"  frameborder="0" scrolling="no" marginwidth="0" marginheight="0" ></iframe>';

        $("#" + billdivId).html(sFrame);

    }

    // 会议管理 (oa_meeting_info)


    if (billLoadType == "oa_meeting_info") {


        var dropSelectText = dropdownlistOb.find("option:selected").text();
        $("#MEETIN_TYPE").val(dropSelectText);
    }





    //重新加载顶部按钮权限
    tempTools.btnAuto();

    dropdownlistOb.change(function (event) {

        var iframeSrc = project + "/admin/documentBill/openBill.action?wf_id=" + wfId + "&officeId=" + id + "&billName=" + (dropdownlistOb.val()) + addPram;
        $("#billPageId").attr("src", iframeSrc);
        if (dropdownlistOb.find("option:selected").text() == "合法性审查") {

        }


        else {
            $("#billId").val(dropdownlistOb.val());
            //单独为发文立项审批单 清空文号
            if($("#billId").val()=="8a1c61ededf1494788cd779a740bb528"){
                $("#DOCUMENT_NO").val("");
            }
        }


        if (billLoadType == "oa_meeting_info") {

            var dropSelectText = dropdownlistOb.find("option:selected").text();
            $("#MEETIN_TYPE").val(dropSelectText);

        }

        //发文流程存储发文代字
        if(billLoadType=="oa_send_document"){
          
                $("#send_word").val(dropdownlistOb.find("option:selected").text());
            

        }



        tempTools.btnAuto();

    });


//法制办
    function legalSelect() {
        if (globalParams.nodeName === "office_audit") {
            $("#" + (globalParams.billSelectId)).show();
        }

        dropdownlistOb.find("option").each(function () {

            var $this = $(this),
                $text = $this.text();

            //法制办
            if (globalParams.nodeName === "office_audit") {
                if ($text === "阅件" || $text === "国务院文" || $text === "明传电报" || $text === "依公开申请" || $text === "送法制办") {
                    $this.remove();
                }
                else if ($text == "合法性审查") {
                    billName = $this.val();
                    $this.prop("selected", true);
                }

            }
            //送法制办 ,处于此环节下，相当于权限控制
            else if (globalParams.nodeName === "toPl") {

                if ($text === "送法制办") {
                    billName = $this.val();
                    $this.prop("selected", true);
                }
                else {
                    $this.remove();
                }
                $("#" + (globalParams.billSelectId)).hide();

            }
            else {
                if ($text === "合法性审查") {
                    $this.remove();
                }
                else if ($text === "送法制办") {
                    $this.remove();
                }
            }
        });

    }

}



/**
 * 编辑发文代字
 */

function editSendWord(){

    globalParams.unUpdate=1;
	var callback=function(){

		location.reload();
	}
	oa_wf_tempSave("dataset2", callback);

}







/**
 * 转审批件
 */
function turnExaminationApproval() {

    layer.confirm('是否转至行政规范性文件发文立项审批件', {
            btn: ['确定', '取消']
        }, function () {
            var billName = "0e112e9a45ef4837bc1f6311ed41b1f3",
                addPram = "",
                id = getMainDsId(1);

            var getsrc = project + "/admin/documentBill/openBill.action?wf_id=" + (globalParams.wfid) + "&stepId=" + (globalParams.stepId) + "&officeId=" + id + "&billName=" + billName + addPram;
            $("#billPageId").attr("src", getsrc);

            layer.closeAll();

            $("#billId,#" + (globalParams.billSelectId) + "").val(billName);


            $("#" + (globalParams.billSelectId) + " option").each(function () {
                var $thisOption = $(this);
                if ($thisOption.val() == billName) {
                    $thisOption.attr("selected", "selected");
                }
                else {

                    $thisOption.removeAttr("selected");
                }
            });

            var callback = function () {

                var $id = data_dataset2.item(data_dataset2.first()).id;

                var bill = document.getElementById('billPageId');

                var $billId = bill.contentWindow.billName;
                var pdfUrl = project + "/admin/handleToWordPDF/buildWfAttachmentByPDF.action?id=" + $id + "&billId=8a1c61ededf1494788cd779a740bb528&moduleType=oa_send_document_info&fileType=fwlx";

                $.post(pdfUrl, function (data) {

                    window.top.document.getElementById('filePageId').contentWindow.location.reload();

                });
            };
            oa_wf_tempSave("dataset2", callback);


        }, function () {

        }
    );


}

function sendDocumentDelivery() {
    layer.msg('发送成功');

}

/**
 * 发文送签
 */

function sendSigned() {
    var $id = data_dataset2.item(data_dataset2.first()).id;
    var url = project + "/admin/documentToExchange/sendDocumentToLineWell.action?id=" + $id;
    layer.msg("送签中...");
    $.post(url, function (data) {

        layer.msg(data.result);
    });
}

/**
 * 提取序列号
 * @param input  id值
 * @param groupId 数据字典的groupId
 * @param dash 字典项值
 * @param year 年份
 */
function autoDocumentNo(input, groupId, dash, year) {
    /*var groupId="oa_document_no_auto";
     var dash="supervise";
     var year=new Date().getFullYear();*/

    var url = project + "/admin/documentConfig/getDocAutoNo.action";
    var data = "groupId=" + groupId + "&wfId=" + wfId + "&dashValue=" + dash + "&year=" + year;
    $.post(url, data, function (result) {

        $(input).val(result);
    });


}


/**
 * 转办
 * @param id
 */
function turn() {


    choiceUserType = "turn";
    //selectWfUser();
    turnSelect();
}

/**
 * 补办
 */
function supply() {

    choiceUserType = "supply";
    selectWfUser();
}


/**
 * 转办时选择
 */
function selectWfUser() {
    window.top.createWindow({
        text: '选择用户',
        url: project + '/admin/user/commonChoiceUserWin.action?etc=' + new Date().getTime(),
        id: 'commonChoiceUserWin',
        width: '900',
        height: '520',
        parent_ifr: window
    });
}
/**
 * 收藏文件
 */
function collectionFile(obj) {
    var url = project + "/admin/commonDispatch/perFileCabinetPop.action";
    createWindow({
        text: '选择文件分组',
        url: url,
        id: 'commonChoiceUserWin',
        width: '650',
        height: '468',
        parentIfr: obj
    });
}

function commonChoiceUserCallback(userIdArr, userNameArr) {
    if (choiceUserType == "turn") {  //已经无效
        turnCallback(userIdArr, userNameArr);
    } else if (choiceUserType == "supply") {
        supplyCallback(userIdArr, userNameArr);
    }

}

/**
 * 转办时回调
 * @param userIdArr
 * @param userNameArr
 */
function turnCallback(userIdArr, userNameArr) {
    userNameArr = encodeURI(userNameArr);
    doWfChange("do_turn", "转办", false, 2, true, "&newUserId=" + userNameArr);


}


/**
 * 补办
 * @param userIdArr
 * @param userNameArr
 */
function supplyCallback(userIdArr, userNameArr) {
    userNameArr = encodeURI(userNameArr);
    doWfChange("do_supply", "补办", false, 3, true, "&newUserId=" + userNameArr);

}

//收回
function takeback() {
    //doWfChange("do_takeback", "收回", true, 3, false, "");

    var operate = "do_takeback",
        operateCn = "收回",
        isReConfirm = true,
        flowType = 3,
        hasTaskParam = false,
        addParam = "";


    var wfid = wfId;

    var wfInfoUrl = project + "/admin/flowManager/flowTaskAction!queryFlowTask.action?flowTask.wf_id=" + wfid + "&type=" + flowType + "&etc=" + new Date().getTime();
    $.post(wfInfoUrl, "", function (result) {


        if (result) {
            var data = result.data;
            if (data.length === 1) {
                var item = data[0];
                if (isReConfirm) {

                    layer.confirm("确定执行" + operateCn + "任务操作吗？", {
                        btn: ['确定']
                    }, function () {
                        doWfChangeIni(item, operate, operateCn, hasTaskParam, addParam)
                    });


                }
                else {
                    doWfChangeIni(item, operate, operateCn, hasTaskParam, addParam)
                }

                return;
            }
            else if (data.length > 1) {
                var option = [];

                data.forEach(function (value, index) {
                    option.push("<option value='" + index + "'>" + value.task_name + "</option>");
                });
                var html = "<div style='text-align: center;padding-top: 20px;'><select  id='backId' class='select' >" + option.join('') + "<select></div>";
                var $index = 0;
                layer.open({
                    type: 1,
                    title: "选择收回的流程",
                    closeBtn: 0,
                    area: ['300px', '300px'],
                    btn: ["确定", "取消"],
                    shadeClose: true,
                    skin: 'yourclass',
                    content: html,
                    yes: function () {

                        var item = data[parseInt($index)];
                        doWfChangeIni(item, operate, operateCn, hasTaskParam, addParam)

                    },
                    success: function () {
                        $("#backId").change(function () {
                            $index = $(this).val();
                        });
                    }
                });
            }
            else {
                layer.msg('对不起，无权操作！');
            }
        }
        else {
            layer.msg('对不起，无权操作！');
        }


    });


}

//撤回
function revoke() {

    doWfChange("do_revoke", "撤回", true, 3, false, "");

}


//催办
function remind() {

    var wfid = wfId;
    var wfInfoUrl = project + "/admin/flowManager/flowTaskAction!queryFlowTask.action?flowTask.wf_id=" + wfid + "&type=3&etc=" + new Date().getTime();
    $.post(wfInfoUrl, "", function (result) {

        if (result) {
            var data = result.data;
            if (data.length > 0) {
                var item = data[0];

                window.top.createWindow({
                    'text': '催办',
                    'id': 'remindNextNode',
                    'url': project + '/form/fceform/common/runOther.html?djsn=remindNextNode&djtype=eden_form&wfId=' + item.wf_id + "&stepId=" + item.step_id + "&traceId=" + item.trace_id + "&time=" + new Date().getTime(),
                    'width': '470',
                    'height': '350'
                });

            }
        }

        layer.msg('对不起，无权操作！');
    });
}

/**
 *
 * @param operate WorkflowPortal里operate参数
 * @param operateCn 操作中文名
 * @param isReConfirm 是否要提示确认
 * @param flowType flowTaskAction!queryFlowTask.action里的flowType方法，  2 待办  3 已办
 * @param hasTaskParam WorkflowPortal里增加task参数
 * @param addParam WorkflowPortal增加其他参数
 */
function doWfChange(operate, operateCn, isReConfirm, flowType, hasTaskParam, addParam) {

    var wfid = wfId;

    var wfInfoUrl = project + "/admin/flowManager/flowTaskAction!queryFlowTask.action?flowTask.wf_id=" + wfid + "&type=" + flowType + "&etc=" + new Date().getTime();
    $.post(wfInfoUrl, "", function (result) {


        if (result) {
            var data = result.data;
            if (data.length > 0) {
                var item = data[0];
                if (isReConfirm) {

                    layer.confirm("确定执行" + operateCn + "任务操作吗？", {
                        btn: ['确定']
                    }, function () {
                        doWfChangeIni(item, operate, operateCn, hasTaskParam, addParam)
                    });


                } else {
                    doWfChangeIni(item, operate, operateCn, hasTaskParam, addParam)
                }

                return;
            }
        }

        layer.msg('对不起，无权操作！');
    });


}


/**
 * 公文流转操作
 * @param item
 * @param operate
 * @param operateCn
 * @param hasTaskParam
 * @param addParam
 */
function doWfChangeIni(item, operate, operateCn, hasTaskParam, addParam) {
    wfid = wfId;
    var stepid = item.step_id;
    var actionid = item.action_id;
    var instanceid = item.dynamic_instance_id;

    var sKey = project + "/servlet/WorkflowPortal?operate=" + operate + "&wf_id=" + wfid + "&step_id=" + stepid + "&action_id=" + actionid;

    if (instanceid != null && instanceid != "" && instanceid != "undefined")
        sKey += "&dynamic_instance_id=" + instanceid;
    if (hasTaskParam) {
        var taskId = item.task_id;
        var taskUserId = item.task_user_id;
        sKey += "&task_id=" + taskId + "&task_user_id=" + taskUserId;
    }
    if (addParam)
        sKey += addParam;

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

                layer.msg(operateCn + "成功！");

                window.setTimeout(function () {
                    closeLocalWin();
                }, 300);
            }

        },
        error: function (msg) {

            layer.msg('访问后台失败！');
        }
    });

}


/**
 * 文档类型转换
 * @param 1,2
 * @param 批示反馈独有，增加ids

 *
 */
function oa_tempPgSend(style, idsother) {

    var wfid = $urlParam("wfId");
    var action = $urlParam("actionId");
    var $billName = $urlParam("djsn");
    var wf_name = "";

    var nextIUrl = "";
    var title;
    var otherUrl;
    var ids = "";
    var url = project + "/admin/wfManage/closeWf.action?wf_id=" + wfid + "&action_id=" + action;
    //收文
    if ($billName == "oa_pg_incoming_form") {
        if (style == "1") {
            title = "是否将办结此收文流程转办至新的发文流程";

            otherUrl = project + "/admin/sendDocument/incomingToSend.action?oldId=" + wfid;
        }
        else if (style == "2") {
            title = "是否将办结此收文流程转办至批示流程";

            otherUrl = project + "/admin/incoming/incomingToInstruction.action?oldId=" + wfid;
        }

        else if (style == "3") {

            title = "是否将办结此收文流程转办至发文立项流程";
            otherUrl = project + "/admin/sendDocument/incomingToSend.action?oldId=" + wfid + "&billId=8a1c61ededf1494788cd779a740bb528&type=fwlx";
        }


    }
    //会议通知
    else if ($billName == "oa_meeting_info") {
        if (style == "1") {
            title = "是否会议方案转至通知";

            otherUrl = project + "/admin/meeting/programToNotification.action?oldId=" + wfid;
        }
        else if (style == "2") {
            title = "是否会议方案转至发文";

            otherUrl = project + "/admin/meeting/meetingInfoToSendDocument.action?oldId=" + wfid;
        }


    }

//领导批示
    else if ($billName == "oa_leader_instruction_form") {
        if (style == "1") {

            title = "转反馈报送";
            otherUrl = project + "/admin/instructionTransition/instructionToFb.action?oldId=" + wfid;
            ids = idsother;
        }
        else if (style == "2") {
            title = "是否批示转至批示办理单";
            otherUrl = project + "/admin/instructionTransition/fbToInstruction.action?oldId=" + wfid;

        }
        else if (style == "3") {
            title = "是否批示反馈转至发文办理单";
            otherUrl = project + "/admin/instructionTransition/instructionFBToSendDocument.action?oldId=" + wfid;

        }

    }
    else {
        window.layer.msg("不能转换");
        return;
    }

    var isEnd = layer.confirm(title, {
        btn: ['确定', '取消'] //按钮
    }, function () {
        $.post(url, function (data) {

            layer.msg("转办成功");
            if (data.datas = "办结成功") {


                $.post(otherUrl, {"ids": ids}, function (data) {
                    wf_name = data.wfName;
                    var wfidIn = data.wfId;
                    uf_doAction_pg_send(wfidIn, wf_name, "", "1", null);
                });

            }

        });

    }, function () {

    });

}


/**
 * 收文正文批注
 */

function openSealPageComment() {
    var url = project + "/admin/incoming/postilPdf.action?wfId=" + (globalParams.wfid);
    createWindow({
        text: '正文批注',
        url: url,
        id: 'dhxPop',
        width: '900',
        height: '550',
        callBack: function (val, text) {
        }
    });

}


/**
 * 退文
 */


function openBackReturnPage() {
    var $billName = $urlParam("djsn");
    var url = "";

    var bill = document.getElementById('billPageId');

    var $billId = bill.contentWindow.billName;
    var isGoing = false;
    var getUrl = project + "/admin/waitDocument/decideIsBack.action?billName=" + $billName;

    if ($billName == "oa_meeting_info") {
        //获取业务数据ID
        var $id = data_dataset2.item(data_dataset2.first()).id;
        url = project + "/admin/backMeeting/addBackMeetingInfo.action?meetingInfo.id=" + $id;
        getUrl = getUrl + "&&wfId=" + $id;
    } else {
        getUrl = getUrl + "&&wfId=" + (globalParams.wfid);
        //$.getJSON(getUrl,{
        //    "billName":$billId,
        //    "wfId":(globalParams.wfid)
        //},function(data){
        //
        //    if(!parseInt(data.result)){
        //        layer.msg(data.message);
        //        isGoing=true;
        //    }
        //
        //});
        url = project + "/admin/waitDocument/addBackDocumentByWfIdWin.action?wfId=" + (globalParams.wfid);
    }
    $.ajax({
        type: 'get',
        async: false,
        url: getUrl,
        error: '',
        success: function (data) {
            if (!parseInt(data.result)) {
                layer.msg(data.message);
                isGoing = true;
            }
        }
    });

    if (isGoing) {
        return;
    }
    createWindow({
        text: '退文',
        url: url,
        id: 'dhxPop',
        width: '900',
        height: '550',
        callBack: function (val, text) {
        }
    });
}

/**
 * 建章
 */

var sealDownlUrl = "";
var sealPageParam;
function openSealPageIncomming() {

    var fileData = [];
    var pdfData = [];
    var fileManageUrl = project + "/admin/attachmentInfo/selectByTable.action";
    var sealTableKeyId = window.top.document.getElementById('filePageId').contentWindow.$tableKeyId;
    var objData = {
        "tableName": "oa_document_attachment",
        "tableKey": "id",
        "tableKeyId": sealTableKeyId
    }

    $.post(fileManageUrl, objData, function (data) {
        var isHasPdf = false;
        if (data.result == "success") {
            //过滤正文顶部的选择
            var resultMessage = data.message.filter(function (value) {
                return value.remark;
            });


            resultMessage.forEach(function (value) {
                if (value.name.indexOf("pdf") > (-1)) {
                    isHasPdf = true;
                    fileData.push("<div class='file-btn' data-id=" + value.id + " data-size=" + value.size + " data-name=" + value.name + " data-url=" + value.path + ">" + value.name + "</div>");
                    pdfData.push({
                        "id": value.id,
                        "name": value.name,
                        "url": value.path,
                        "size": value.size,
                        "path": value.path,
                        "createTime": value.createDttm2,
                        "time": new Date((value.createDttm2).replace(new RegExp("-", "gm"), "/")).getTime()
                    });

                }
            });
            var $content = "<div class='seal-file-choice js-seal-file-choice' >" + fileData.join("") + "</div>";


            if (pdfData.length > 0) {

                pdfData.sort(function (a, b) {
                    return (a.time) - (b.time)
                });


                //自动取正文的最后一个
                var value = pdfData[(pdfData.length - 1)];
                sealPageParam = {
                    "id": value.id,
                    "name": value.name,
                    "size": value.size,
                    "sealDownlUrl": value.path,
                    "tableKeyId": sealTableKeyId,
                    "tgwId": "",
                    "tgwSize": 0
                }

                for (var i = 0; i < data.message.length; i++) {

                    if (data.message[i].name.indexOf(value.name.replace(".pdf", ".tgw")) > (-1)) {
                        sealPageParam.tgwId = data.message[i].id;
                        sealPageParam.tgwSize = data.message[i].size;
                        break;

                    }
                }

                var surl = project + "/admin/commonDispatch/sealPage.action";

                window.open(surl);
            }

            else {
                layer.msg("尚未上传pdf附件");
            }

        }

        else {
            layer.msg("尚未上传pdf附件");
        }


    });

}


function openSealPage() {
    var fileData = [];
    var pdfData = [];
    var fileManageUrl = project + "/admin/attachmentInfo/selectByTable.action";
    var sealTableKeyId = window.top.document.getElementById('filePageId').contentWindow.$tableKeyId;
    var objData = {
        "tableName": "oa_document_attachment",
        "tableKey": "id",
        "tableKeyId": sealTableKeyId
    }

    $.post(fileManageUrl, objData, function (data) {
        var isHasPdf = false;
        if (data.result == "success") {
            //过滤正文顶部的选择
            var resultMessage = data.message.filter(function (value) {
                return value.remark;
            });


            resultMessage.forEach(function (value) {
                if (value.name.indexOf("pdf") > (-1)) {
                    isHasPdf = true;
                    fileData.push("<div class='file-btn' data-id=" + value.id + " data-size=" + value.size + " data-name=" + value.name + " data-url=" + value.path + ">" + value.name + "</div>");
                    pdfData.push({
                        "id": value.id,
                        "name": value.name,
                        "url": value.path,
                        "size": value.size,
                        "path": value.path,
                        "createTime": value.createDttm2,
                        "time": new Date((value.createDttm2).replace(new RegExp("-", "gm"), "/")).getTime()
                    });

                }
            });
            var $content = "<div class='seal-file-choice js-seal-file-choice' >" + fileData.join("") + "</div>";


            if (pdfData.length > 0) {

                pdfData.sort(function (a, b) {
                    return (a.time) - (b.time)
                });

                //自动取正文的最后一个
                var value = pdfData[(pdfData.length - 1)];
                sealPageParam = {
                    "id": value.id,
                    "name": value.name,
                    "size": value.size,
                    "sealDownlUrl": value.path,
                    "tableKeyId": sealTableKeyId,
                    "tgwId": "",
                    "tgwSize": 0
                }

                for (var i = 0; i < data.message.length; i++) {

                    if (data.message[i].name.indexOf(value.name.replace(".pdf", ".tgw")) > (-1)) {
                        sealPageParam.tgwId = data.message[i].id;
                        sealPageParam.tgwSize = data.message[i].size;
                        break;

                    }
                }

                var surl = project + "/admin/commonDispatch/sealPage.action";
                //收文的情况
                if (globalParams.djsn == "oa_pg_incoming_form") {
                    var $createNum = encodeURI(encodeURI($("#SERIAL_NUMBER").val()));
                    var billPageId = $(window.frames["billPageId"].document);
                    var $advice = "";
                    if (billPageId.find(".js-going-advice-td").find(".js-leader-advice").length > 0) {
                        $advice = billPageId.find(".js-going-advice-td").find(".js-leader-advice").last().find(".js-leader-advice-content").find("span").text();
                    }


                    var $suggest = encodeURI(encodeURI($advice));
                    surl = project + "/admin/incoming/postilPdf.action?wfId=" + (globalParams.wfid) + "&createNum=" + $createNum + "&suggest=" + $suggest;
                }
                window.open(surl);
            }

            else {
                layer.msg("尚未上传pdf附件");
            }

        }

        else {
            layer.msg("尚未上传pdf附件");
        }


    });

}


/**
 * 将下一步可选的环节放入drouplist
 * @param id
 * @param nodeName  已无效
 * @param groupId  已无效
 */
function putNextSelect(id, nodeName, groupId) {


    var wf_name = $urlParam('wfName');
    var action_id = $urlParam('actionId');
    if (action_id == "show") {
        return;
    }
    var dynamicInstanceId = $urlParam('dynamicInstanceId');

    var nextInfoPageUrl = project + "/servlet/WorkflowPortal?operate=get_next_steps&wf_id=" + wfId + "&wf_name=" + wf_name + "&wf_version=1&action_id=" + action_id + "&isAllStepFlag=1";
    if (dynamicInstanceId) {
        nextInfoPageUrl += "&dynamic_instance_id=" + dynamicInstanceId;
    }

    $.ajax({
        type: "POST",
        url: nextInfoPageUrl,
        processData: false,
        data: "<root></root>",
        contentType: 'utf-8',
        success: function (msg) {
            var oDom = newXml(msg);
            var bResult = $(oDom).find('n').text();
            if (bResult == 'false' || bResult == false) {


            } else {
                var html = '';
                $(oDom).find("step").each(function () {
                    var stepId = undToSp($(this).attr("stepId"));
                    var name = undToSp($(this).attr("name"));
                    html += '<option value="' + stepId + '">' + name + '</option>';
                })


                $('#sel_' + id).append(html);


            }

        },
        complete: function () {
            loadEnd();
        }
    })


}

/**
 * 提交时判断下一环节有没有选择
 * @param id  下拉框id
 */
function checkHasNextSelect(id) {

    var dsIndex = mainDataset.idByIndex(0);
    if (!dsIndex) {

        layer.msg("请先保存！");
        return false;

    }
    var droplen = $("#sel_" + id + " option").length;
    if (droplen > 2) {
        var submitType = $('#sel_' + id).val();
        if (submitType == "" || submitType == -2) {


            layer.msg('请选择下一环节！');
            return false;
        }


    }
    return true;
}


/**
 * 归档
 */
function putrecord() {

    var id = getMainDsId();
    $.post(project + "/admin/sendDocument/sendDocumentAction!updatePutRecord.action", {"ids": id}, function (result) {


        layer.msg(result.message);
    });

}


/**
 * 获取主键
 * @param isNoAlert: 1不用弹出
 * @returns
 */
function getMainDsId(isNoAlert) {
    var id = '';
    var dataItem = mainDataset.item(mainDataset.idByIndex(0));
    if (dataItem) {
        var id = dataItem.ID;
        if (!id) {
            id = dataItem.id;
        }
    }
    if (!id) {
        if (!isNoAlert) {
            layer.msg("还未保存！！");
        }

    }
    return id;
}

/**
 * 保存手写信息
 */
function saveSignInfo() {

    var billPage = document.getElementById('billPageId');
    if (billPage && billPage.contentWindow && billPage.contentWindow.signatureFlag) {
        billPage.contentWindow.SaveSignature();

    }
}

//得到选择用户页面的url
function getSelUserUrl() {
    var addPram = "";

    if ("undefined" != typeof selUserParam) {
        addPram += selUserParam;
    }
    try {
        if (typeof(eval(addSelUserParam)) == "function") {
            addPram = addSelUserParam()
        }
    } catch (e) {

    }

    var url = project + '/form/fceform/common/runOther.html?djsn=selUser&djtype=eden_form' + addPram;

    return url;
}


/**
 * 送处室办理

 */

function openSendOffice() {


    var callback = function () {


        var action_id = $urlParam('actionId');
        var dynamicInstanceId = $urlParam('dynamicInstanceId');
        var free_flow = $urlParam("free_flow");
        var wfId = $urlParam("wfId");


        var url = project + "/admin/wfManage/sendOffice.action?wf_id=" + wfId + "&wf_version=1&action_id=" + action_id;


        if (dynamicInstanceId) {
            url += "&dynamic_instance_id=" + dynamicInstanceId;
        }
        if (free_flow) {
            url += "&free_flow=" + free_flow;
        }

        //收文抄送传阅  只在发送环节触发
      //  readPassSave();

        createWindow({
            text: '处室办理',
            url: url,
            id: 'dhxPop',
            width: '900',
            height: '550',
            callBack: function (val, text) {

            }
        });

    }

    oa_wf_tempSave("dataset2", callback);


}


/**
 * 打开下一执行人发送页面
 * @param is
 * @param callback
 */
function openNextSendPage(callback) {


    var callback = function () {
        var action_id = $urlParam('actionId');
        var dynamicInstanceId = $urlParam('dynamicInstanceId');
        var free_flow = $urlParam("free_flow");
        var wfId = $urlParam("wfId");
        var url = project + "/admin/wfManage/choiceNextExecutor.action?wf_id=" + wfId + "&wf_version=1&action_id=" + action_id + "&currStepId=" + globalParams.stepId;
        if (dynamicInstanceId) {
            url += "&dynamic_instance_id=" + dynamicInstanceId;
        }
        if (free_flow) {
            url += "&free_flow=" + free_flow;
        }

        //收文抄送传阅  只在发送环节触发
        readPassSave('逗比，呵呵');


        createWindow({
            text: '发送下一环节人员',
            url: url,
            id: 'dhxPop',
            width: '900',
            height: '570',
            //  parent_ifr:window,
            callBack: function (val, text) {

            }
        });
    }

    return callback();


}

/**
 * 打开下一执行人选择页面
 * @param is
 * @param callback
 */
function openNextSendPageByPre(callback) {

    var flowAddParam = getMainDatasetFlowParam();
    var wf_name = $urlParam('wfName');   //这个不准的
    var action_id = $urlParam('actionId');
    var dynamicInstanceId = $urlParam('dynamicInstanceId');

    var nextInfoPageUrl = project + "/servlet/WorkflowPortal?operate=get_next_steps&wf_id=" + wfId + "&wf_name=" + wf_name + "&wf_version=1&action_id=" + action_id + flowAddParam;
    if (dynamicInstanceId) {
        nextInfoPageUrl += "&dynamic_instance_id=" + dynamicInstanceId;
    }

    $.ajax({
        type: "POST",
        url: nextInfoPageUrl,
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
                var step = $(oDom).find("step");
                var stepId = undToSp(step.attr("stepId"));
                var name = undToSp(step.attr("name"));
                if (stepId) {


                    var url = getSelUserUrl();
                    url += "&wf_id=" + wfId + "&step_id=" + stepId;
                    createWindow({
                        text: '下一步骤是 ' + name,
                        url: url,
                        id: 'commonSelUser',
                        width: '670',
                        height: '400',
                        callBack: function (val, text) {
                            if (callback) {

                                eval(callback);
                            }
                        }
                    });

                } else {

                    layer.confirm('当前为会签环节，将交给当前环节其他人处理！', {
                        btn: ['确定']
                    }, function () {
                        if (callback) {
                            var val = "1";
                            var text = "1";
                            eval(callback);
                        }
                    });

                }


            }

        }
    })


}
/**
 * 获取主数据集的 流程用 的字段和值
 */
function getMainDatasetFlowParam() {
    var addParams = "";
    for (var dli = 0; dli < datastoreList.length; dli++) {                   //遍历页面绑定了dataset 字段的控件
        var dataStore = datastoreList[dli];                             // datasetID
        var submitType = $('#' + dataStore).attr('submittype');
        if (submitType == 1) {                //dataset 的提交类型为 智能提交变动过的记录；
            var DsId = dataStore;
            var thisDsHtml = $('#' + DsId);
            var format = thisDsHtml.attr('format');
            var data_format = newXml(format);
            var thisDs = getDs(DsId);


            $(data_format).find('field').each(function () {
                var fieldname = $(this).find('fieldname').text();
                var procvalid = $(this).find('procvalid').text();
                if (procvalid == '是') {
                    var fieldVal = '';
                    fieldVal = getDefaultVal(fieldname);            //保存时先获取字段默认值

                    if (thisDs.dataCount > 0) {
                        var nowItem = thisDs.item(thisDs.idByIndex(0));
                        if (undToSp(nowItem[fieldname]) != '') {
                            fieldVal = nowItem[fieldname];
                        }
                    }

                    for (var i = 0; i < needLoadDataList.length; i++) {
                        var ctrl = needLoadDataList[i];     //[控件ID,datasetID,字段名,是否需要加数据,'类型']
                        if (ctrl[1] == DsId && ctrl[2] == fieldname) {

                            fieldVal = getValue(ctrl[0], ctrl[4]);
                        }
                    }

                    fieldVal = saveTrans(fieldVal, DsId, fieldname);

                    addParams += "&" + fieldname + "=" + fieldVal;
                }


            })


        }
    }


    return addParams;
}

//得到当前节点指定的用户页面的url
function getLocalSelUserUrl() {
    var addPram = "";

    try {
        if (typeof(eval(putLocalSelUserUrl)) == "function") {
            addPram = putLocalSelUserUrl()
        }
    } catch (e) {

    }
    var url = project + '/form/fceform/common/runOther.html?djsn=selUser&djtype=eden_form' + addPram;

    return url;
}


/**
 * 设置可以点击相关链接,需带
 */
function putCanClickLink(id) {
    var link = $('#' + id).text();
    if (link) {
        var htmlLink = "<a style='color:blue;font-size:12px' onclick='openlink(\"" + link + "\")'>" + link + "</a>";
        $('#' + id).html(htmlLink)
    }

}

/**
 * 双击
 * @param id
 */
function addTextDClickWin(id) {
    $('#' + id).dblclick(function () {

        //双击事件的执行代码
        var link = $(this).val();

        if (link) {
            openlink(link);
        }
    })


}


/**
 *  选择组织
 */
function selectInputOrgs(btn) {
    createWindow({
        text: '选择组织',
        url: project + '/form/fceform/common/runOther.html?djsn=selOrg&djtype=eden_form',
        id: 'commonSelOrg',
        width: '330',
        height: '400',

        callBack: function (orgId, orgName) {

            if (!orgId) {

                layer.msg("未选择组织！");
                return;
            }
            $(btn).val(orgName);
            window.closeWin('commonSelOrg');


        }
    });

}


// 选择执行人 转办时
function turnSelect() {

    var passUrl = project + "/admin/commonDispatch/complaintHtml.action?wfId=" + (globalParams.wfid);


    createWindow({
        text: '选择用户',
        url: passUrl,
        id: 'dhxPop',
        width: '900',
        height: '550',
        callBack: function (val, text) {
        }
    });


}

/**
 * 几秒后进行已阅，不需要阅的不会进行
 */
function clickPassReadSomeTime() {


    //打开页面默认为已阅

    if (globalParams.wfs == "read") {
        oaBillLooked();
    }

}


function getLocalUserName() {
    var userName = "";
    var url = project + "/admin/documentData/getLocalUser.action";

    $.ajax({
        type: "POST",
        url: url,
        async: false,
        data: "",
        contentType: 'utf-8',
        success: function (msg) {
            if (msg) {
                userName = msg.userView.userName;
            } else {


                layer.msg('获取信息失败！');
            }

        },
        error: function (msg) {

            layer.msg('访问后台失败！');
        }
    });
    return userName;
}

/**
 * 保存公文版本
 */
function saveDocumentVersionFile() {
    var actionId = $urlParam('actionId');
    var stepName = $urlParam('wfDesc');
    stepName = unescape(stepName)
    var recordID = getMainDsId();
    var $title;
    
    // 发文
    if(globalParams.djsn=="oa_send_document"){
    	$title=$("#TITLE").val();
    }
    // 专项事务
    else if (globalParams.djsn=="oa_sptrain_audit"){
    	$title=$("#title").val();
    }
    // 会议
    else if (globalParams.djsn=="oa_meeting_info"){
    	$title=$("#SUBJECT").val();
    }
    
    var url = project + "/admin/documentData/saveDocumentVersionFile.action";

    $.post(url, {"actionId": actionId, "stepName": stepName, "recordID": recordID,
    	     "wfId":(globalParams.wfid), "title":$title}, function (result) {

    });


}

/**
 * 资源链接的js start
 */

/**
 * 显示此公文的资源链接
 */
function addRelateLinkLi() {
    var docId = getMainDsId(1);
    var url = project + "/admin/documentRelateLink/selectRelateLink.action";
    $.post(url, {"docId": docId}, function (result) {

        if (result && result.data) {
            var html = "";
            var list = result.data;
            for (var i = 0; i < list.length; i++) {
                var link = list[i].link;
                var method = "";
                if (list[i].relateType != "file") {
                    method = 'openLink(\'' + link + '\')';
                } else {
                    method = 'openLink(\'' + link + '\',1)';
                }
                var li = '<li><a onclick="' + method + '" href="javascript:void(0)" >' + list[i].title + ' [来自:' + list[i].relateTypeCn + ']' + '</a></li>';
                html += li;
            }
            $('#relateLinkDiv').html(html)
        }
    });
}

/**
 * 将资料链接类型放入，如发文管理 收文管理
 */
function putRelateLinkTypes() {
    var url = project + "/admin/documentConfig/getDictListByGroupId.action";
    var dictGroupId = "doc_relate_link_search_type";
    $.post(url, {"dictGroupId": dictGroupId}, function (result) {

        if (result && result.data) {
            var html = "";
            var data = result.data;
            for (var i = 0; i < data.length; i++) {
                var li = '<OPTION value=' + data[i].dictValue + '>' + data[i].dictName + '</OPTION> ';
                html += li;

            }
            $('#searchRelateTypes').html(html);
        }
    });

}
/**
 *  搜索资源链接页面
 */
function searchRelateLink() {
    var relateSearchText = $('#relateSearchText').val();
    relateSearchText = encodeURI(relateSearchText);
    var searchRelateTypes = $('#searchRelateTypes').val();
    var docId = getMainDsId(1);
    var surl = project + "/admin/documentRelateLink/searchRelateDocPage.action?docId=" + docId + "&searchType=" + searchRelateTypes + "&relateSearchText=" + relateSearchText;

    window.top.createWindow({
            id: 'ralateLinkSearch',
            text: "资源链接搜索",
            setModal: true,
            url: surl,
            width: '800',
            height: '570',
            parent_ifr: window,
            afterClose: function () {

            }
        }
    );

}
/**
 * 打开资料链接编辑页面
 */
function openRelateLinkEditPage() {

    var docId = getMainDsId(1);
    var surl = project + "/admin/documentRelateLink/relateLinkEditPage.action?docId=" + docId;

    window.top.createWindow({
            id: 'relateLinkEditPage',
            text: "资源链接管理",
            setModal: true,
            url: surl,
            width: '800',
            height: '570',
            parent_ifr: window,
            afterClose: function () {

            }
        }
    );

}


function layout(flag) {
    if (flag) {
        $('.form-right-search').height($('.form-right').height() - $('.form-right-header').outerHeight(true) * 3 - 160 - 12);
    } else {
        $('.form-right-search').height($('.form-right').height() - $('.form-right-header').outerHeight(true) * 3 - 12);
    }

}
function slideList(obj, num) {
    if ($(obj).hasClass('open')) {
        $(obj).removeClass('open');
        $(obj).parent().next().slideDown('fast');
        if (num == 0) {
            layout(true);
        }
    } else {
        $(obj).addClass('open');
        $(obj).parent().next().slideUp('fast');
        if (num == 0) {
            layout(false);
        }
    }
}

function prevCl(obj) {
    $(obj).prev().click();
}

function putRelateSearchText(titleId) {
    $('#relateSearchText').click(function () {
        if (!$('#relateSearchText').val()) {
            var title = $('#' + titleId).val();
            $('#relateSearchText').val(title)
        }
    });


}

/**
 * 将附件名称赋给relateFile
 */
function setRelateAttachTitle() {
    var name = $('#relateFile').val();
    if (name) {
        var nameArr = name.split("\\");
        $('#relateFileName').val(nameArr[nameArr.length - 1]);
        $('#relateFile').val(nameArr[nameArr.length - 1]);
    }

}

/**
 * 添加文件的资源链接
 * @param filePath
 */
function addRelateLinkFile(filePath) {
    var surl = project + "/admin/documentRelateLink/addRelateLink.action";
    var docId = getMainDsId();
    var titles = $('#relateFileName').val();
    var relateDocIds = titles;
    var moduleTypes = "file";
    var moduleTypeCns = "附件";
    var links = filePath;

    $.post(surl, {
        "docId": docId,
        "relateDocIds": relateDocIds,
        "moduleTypes": moduleTypes,
        "links": links,
        "titles": titles,
        "moduleTypeCns": moduleTypeCns
    }, function (result) {
        if (result.result == "success") {
            addRelateLinkLi()
            $('#relateFileName').val("");
        }

        layer.msg(result.message);
    });

}

/**
 * 上传附件
 */
function ajaxFileUpload() {

    $.ajaxFileUpload
    (
        {
            url: project + '/servlet/uploadServlet', //用于文件上传的服务器端请求地址
            secureuri: false, //是否需要安全协议，一般设置为false
            fileElementId: 'relateFile', //文件上传域的ID
            dataType: 'json', //返回值类型 一般设置为json
            success: function (data, status)  //服务器成功响应处理函数
            {
                var text = data;
                if (text.indexOf("{") != 0)  //不是ie
                {
                    text = $(data).text();
                }
                var json = eval('(' + text + ')');
                ;
                if (json.url) {
                    addRelateLinkFile(json.url)
                }
            },
            error: function (data, status, e)//服务器响应失败处理函数
            {
                layer.msg(e);
            }
        }
    )

}


/**
 * 资源链接的js end
 */

//打开链接
function openLink(link, isfile) {
    if (isfile)  //附件直接下载
    {
        location.href = link;
        return;

    }
    var base = project;
    if (link.indexOf("http") == -1) {
        link = base + link + "&etc=" + new Date().getTime();

    }
    var url = link;

    window.top.createWindow({
        'text': '查看',
        'id': 'search_info_page',
        'url': url,
        'width': '1150',
        'height': '490',
        parent_ifr: window
    });

}


//更多按钮
function showOrHideMoreSee() {
    var moreTrs = $('.more-see-tr');
    var isHide = false;
    if (moreTrs.eq(0).is(":hidden")) {
        isHide = true;
    }
    for (var i = 0; i < moreTrs.length; i++) {
        if (isHide) {
            moreTrs.eq(i).show();
        } else {
            moreTrs.eq(i).hide();
        }

    }

}

/**
 * 加载意见列表
 * @param adviceStr
 * @param datasetId
 */
function addAdviceListTr(adviceStr, datasetId, freshCallback) {
    freshCallback = escape(freshCallback);
    var adviceArr = adviceStr.split(",");
    var tableDiv = $('#laiWen1 table');
    for (var i = 0; i < adviceArr.length; i++) {
        var adviceI = adviceArr[i].split(":");
        var adviceType = adviceI[0];
        var adviceTypeCn = adviceI[1];
        var stHtml = '<tr id="adviceItem' + adviceType + '"><td bgcolor="#efefef"><div class="tdTitle">' + adviceTypeCn + '</div></td><td colspan="7" class="td-text-left" id="adviceItemTd' + adviceType + '"></td></tr>';
        tableDiv.append(stHtml)
    }


    var actionId = $urlParam('actionId');  //动作id
    var surl = project + "/admin/documentData/getDocumentAdviceByWfid.action";
    $.post(surl,
        {
            "wfId": wfId,
            "actionId": actionId
        },
        function (result) {
            if (result.list) {
                var list = result.list;

                for (var i = 0; i < list.length; i++) {
                    var daItem = list[i];
                    var adviceCreater = daItem.cnName;
                    var create_dttm = daItem.createDttm;
                    /*	if(create_dttm.length==21)
                     {
                     create_dttm=create_dttm.substring(0,19);
                     }*/
                    var content = daItem.adviceContent;
                    var adviceType = daItem.adviceType;

                    addAdviceDivItem(daItem.id, content, daItem.createBy, adviceCreater, create_dttm, adviceType, freshCallback);
                }

            }
            if (result.typeListLocalWf) {
                var typeListLocalWf = result.typeListLocalWf;
                if (typeListLocalWf.length > 0) {
                    var adviceType = typeListLocalWf[0].value;
                    putAdviceAddTr(adviceType, freshCallback);
                }

            }
        });

    /*	var ds=getDs(datasetId);
     var count = ds.dataCount();
     for (var i = 0; i < count; i++) {
     var id = ds.idByIndex(i);
     var daItem=ds.item(id);

     var adviceCreater=daItem.userName;
     var create_dttm=daItem.CREATE_DTTM;
     if(create_dttm.length==21)
     {
     create_dttm=create_dttm.substring(0,19);
     }
     var content=daItem.ADVICE_CONTENT;
     var adviceType=daItem.ADVICE_TYPE;
     var liHtml="<div ondblclick='appendList(this)' id="+daItem.id+"><span class='list-font'>"+content+"</span><span>"+adviceCreater+"</span><span>"+create_dttm+"</span></div>";
     var tdIdOb=$('#adviceItemTd'+adviceType);
     if(tdIdOb)
     {
     tdIdOb.append(liHtml);
     }


     }*/


}


function addAdviceDivItem(id, content, createBy, adviceCreater, create_dttm, adviceType, freshCallback) {
    create_dttm = create_dttm.replace("T", " ");
    var liHtml = "<div ondblclick='editAdviceList(this,\"" + freshCallback + "\")' createBy=" + createBy + " id=" + id + "><span class='list-font'>" + content + "</span><span>" + adviceCreater + "</span><span>" + create_dttm + "</span></div>";
    var tdIdOb = $('#adviceItemTd' + adviceType);
    if (tdIdOb) {
        tdIdOb.append(liHtml);
    }

}

function editAdviceList(obj, freshCallback) {
    var createBy = $(obj).attr('createBy');
    if (createBy != getOaLocalUserId()) {

        layer.msg("不能修改别人的意见！");
        return
    }

    $(obj).hide();
    var getCent = $(obj).children('span').eq(0).html();
    var createId = new Date().getTime();
    var getParentId = $(obj).attr('id');

    $(obj).after('<div class="advice-area" id=' + createId + '><textarea>' + getCent + '</textarea><a style="float:left;" href="javascript:void(0)" onclick=saveEditAdviceList(\'' + createId + '\',\'' + getParentId + '\',"' + freshCallback + '")>保存</a><a style="float:left;" href="javascript:void(0)" onclick=saveDelAdviceList(\'' + createId + '\',\'' + getParentId + '\',"' + freshCallback + '")>删除</a><a href="javascript:void(0)" onclick=removeEditAdvice(\'' + createId + '\')>取消</a></div>');
}

function putAdviceAddTr(adviceType, freshCallback) {
    var tableDiv = $('#laiWen1 table');
    var html = '<TR><TD bgColor=#efefef><DIV class=tdTitle>添加意见</DIV></TD><TD colSpan=7 class="td-text-left"><DIV class=advice-area><input type="hidden" id="addAdviceTypeId" value=' + adviceType + ' /><TEXTAREA></TEXTAREA><A style="FLOAT: left" onclick=addAdviceList(this,"' + freshCallback + '") href="javascript:void(0)">保存</A><A onclick=reloadAddAdvice(this) href="javascript:void(0)">重置</A><A onclick=addOaDocumentAdvice("","' + wfId + '","' + adviceType + '","") href="javascript:void(0)">高级意见</A></DIV></TD></TR>';
    tableDiv.append(html)
}

/**
 * 修改意见操作
 * @param obj
 * @param id
 */
function saveEditAdviceList(obj, id, freshCallback) {
    var con = $('#' + obj).find('textarea').val();
    var surl = project + "/admin/documentData/editDocumentAdvice.action";
    $.post(surl,
        {
            "id": id,
            "adviceContent": con
        },
        function (result) {

            if (result.result == "success") {
                $('#' + obj).prev().children('span').eq(0).html(con);
                $('#' + obj).prev().show();
                $('#' + obj).remove();
                if (freshCallback) {
                    freshCallback = unescape(freshCallback);
                    eval(freshCallback)
                }
            }

            layer.msg(result.message);
        });


}

/**
 * 删除意见操作
 * @param obj
 * @param id
 */
function saveDelAdviceList(obj, id, freshCallback) {


    layer.confirm('你确定要删除吗？', {
        btn: ['确定']
    }, function () {

        var surl = project + "/admin/documentData/delDocumentAdvice.action";
        $.post(surl,
            {
                "id": id
            },
            function (result) {

                if (result.result == "success") {

                    $('#' + obj).prev().remove();
                    $('#' + obj).remove();
                    if (freshCallback) {
                        freshCallback = unescape(freshCallback);
                        eval(freshCallback)
                    }
                }

                layer.msg(result.message);
            });

    });


}

function removeEditAdvice(obj) {
    $('#' + obj).prev().show();
    $('#' + obj).remove();
}

/**
 * 添加意见操作
 * @param obj
 */
function addAdviceList(obj, freshCallback) {
    var con = $(obj).parent().find('textarea').val();
    var addAdviceType = $('#addAdviceTypeId').val();

    var surl = project + "/admin/documentData/addDocumentAdvice.action";
    $.post(surl,
        {
            "wfId": wfId,
            "adviceType": addAdviceType,
            "adviceContent": con
        },
        function (result) {

            if (result.result == "success") {

                addAdviceDivItem(result.id, con, result.createBy, result.userName, result.createDttm, addAdviceType, freshCallback);
                reloadAddAdvice(obj);
                if (freshCallback) {
                    freshCallback = unescape(freshCallback);
                    eval(freshCallback);
                }
            }

            layer.msg(result.message);
        });

}

/**
 * 添加领导意见操作
 * @param obj
 */

function addOaAdviceList(obj, con) {

    var $father = $(obj).closest("td");
    var addAdviceType = $father.data("type");
    var wfId = $urlParam("wfId");
    var surl = project + "/admin/documentData/addDocumentAdvice.action";
    $.post(surl,
        {
            "wfId": wfId,
            "adviceType": addAdviceType,
            "adviceContent": con
        },
        function (result) {

        });

}


function reloadAddAdvice(obj) {
    $(obj).parent().find('textarea').val("").focus();
}


/**
 * 打印办理单
 */
function printBill() {

    var url;
    var $id = data_dataset2.item(data_dataset2.first()).id;

    var bill = document.getElementById('billPageId');

    var $billId = bill.contentWindow.billName;

    //收文
    if (globalParams.djsn == "oa_pg_incoming_form") {
        url = project + "/admin/handleToWordPDF/buildWordByHandle.action?moduleType=oa_incomming_info&id=" + $id + "&billId=" + $billId;
    }
    //发文
    else if (globalParams.djsn == "oa_send_document") {
        url = project + "/admin/handleToWordPDF/buildWordByHandle.action?moduleType=oa_send_document_info&id=" + $id + "&billId=" + $billId;

    }
    //会议
    else if (globalParams.djsn == "oa_meeting_info") {
        url = project + "/admin/handleToWordPDF/buildWordByHandle.action?moduleType=oa_meeting_info&id=" + $id + "&billId=" + $billId;

    }

    //批示
    else if (globalParams.djsn == "oa_leader_instruction_form") {
        url = project + "/admin/handleToWordPDF/buildWordByHandle.action?moduleType=oa_instruction_info&id=" + $id + "&billId=" + $billId;

    }

    //专项事务
    else if (globalParams.djsn == "oa_sptrain_audit") {
        url = project + "/admin/handleToWordPDF/buildWordByHandle.action?moduleType=oa_sptrain_info&id=" + $id + "&billId=" + $billId;

    }
    

    $.post(url, function (data) {
        if (data.flag == "1") {
            var surl = "http://" + window.location.host + project + "/documentEdit/previewFile.jsp?FileType=.doc&parentId=1&UserName=eden&fileName=" + (data.data.otherFileName) + "&t=" + (new Date()).getTime();
            window.open(surl);
        }
        else {
            layer.msg(data.message);
        }
    });

}


function newWinAddJs(newWindow) {

    var obd = newWindow.document.getElementsByTagName('div');

    var oHead = obd.item(0);
    var oScript = newWindow.document.createElement("script");
    oScript.type = "text/javascript";
    oScript.src = project + "/form/resources/common/js/print.js";
    oHead.appendChild(oScript);


}


/**
 * 意见输入弹出层
 * @param title
 * @param parent
 * @param obj
 * @param 填入时为空，编辑时为编辑的内容
 * @param 1为填入，2为编辑
 @param 0为其他，2为图片编辑编辑

 */
var inputAdviceObj;
function inputAdvice(title, parent, obj, content, style, isImg, fileName) {
    var url = project + "/admin/documentData/inputAdvice.action?wfName=" + globalParams.wfName;

    inputAdviceObj = {
        "adviceContent": obj,
        "content": content,
        "style": style,
        "isImg": isImg,
        "fileName": fileName
    }
    createWindow({
        text: title,
        url: url,
        id: 'dhxPop',
        width: '900',
        height: '550'
    });
    //解决弹出意见栏 办理单空白
    setTimeout(function () {
        oneClickLi();
    }, 1000);
}
function oneClickLi() {
    window.parent.$("#tab4 .tab_header ul li").eq(0).click();
}


/**
 * 会议厅内报名
 */
function oaBillPublic() {
    turnDocumentExange();
}

/**
 * 批示反馈
 */
function oaFeedBack() {

    if (data_dataset2.first()) {
        var wfid = $urlParam("wfId");
        var url = project + "/admin/instructionFB/executeInst.action?iType=feedBackInfo&feedBack=true&wfId=" + wfid + "&documentId=" + data_dataset2.first();

        createWindow({
            text: '批示反馈',
            url: url,
            id: 'dhxPop',
            width: '900',
            height: '550',
            callBack: function (val, text) {
            }
        });
    }
    else {
        layer.msg("请先保存");
    }


}


/**
 * 签收记录
 */
function oaReceiptRecord() {
    var url = project + "/admin/instructionFB/signSituation.action?documentId=" + data_dataset2.first();
    createWindow({
        text: '签收记录',
        url: url,
        id: 'dhxPop',
        width: '900',
        height: '550',
        callBack: function (val, text) {
        }
    });


}


/**
 * 抄送选择弹出层
 * @param type
 * @param input
 */

function leaderCompanyCc(type, input, isleader) {

    var url = project + "/admin/commonDispatch/leaderCompanyCc.action?type=" + (1 - type) + "&isleadercc=" + isleader;
    var title = parseInt(type) ? "单位" : "人员";
    billStoreChoice = input.text();
    createWindow({
        text: '选择' + title,
        url: url,
        id: 'dhxPop',
        width: '900',
        height: '550',
        callBack: function (val, text) {
        }
    });
    //解决弹出意见栏 办理单空白
    setTimeout(function () {
        $("#tab4 .tab_header ul li").eq(0).click();
    }, 1000);

}


/**
 * 主办单位和领导选择弹出层
 * @param type
 * @param input
 */

function leaderCompany(type, input, style) {

    var url = project + "/admin/commonDispatch/leaderCompany.action?type=" + type + "&style=" + style;
    var title = parseInt(type) ? "领导" : "主办单位";
    billStoreChoice = input.text();
    createWindow({
        text: '选择' + title,
        url: url,
        id: 'dhxPop',
        width: '900',
        height: '550',
        callBack: function (val, text) {
        }
    });
    //解决弹出意见栏 办理单空白
    setTimeout(function () {
        $("#tab4 .tab_header ul li").eq(0).click();
    }, 1000);
}

/**
 * 获取当前时间
 */
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
    return currentdate;
}

/**
 * 加载loading

 */
function loadStart() {

    var index = layer.load(2, {
        shade: [0.5, '#000']
        //scrollbar: false //0.1透明度的白色背景
    });
    setTimeout(function () {
        loadEnd();
    }, 2000);
}

/**
 * 关闭loading
 */
function loadEnd() {
    layer.closeAll('loading');

    var timenavlist;

    $(".navlist").hover(function () {
        var $this = $(this);

        timenavlist = setTimeout(function () {
            $this.addClass("navlist-on");
        }, 260);

    }, function () {

        var $this = $(this);
        clearTimeout(timenavlist);

        $this.removeClass("navlist-on");

    });
    $(".oa-page-header-btn").hover(function () {
        var $this = $(this);
        $this.addClass("oa-page-header-btn-bg");
    }, function () {
        var $this = $(this);
        $this.removeClass("oa-page-header-btn-bg");
    });

    $(".oa-page-header-btn-son").hover(function () {
        var $this = $(this);
        $this.addClass("oa-page-header-btn-son-hover");
    }, function () {
        var $this = $(this);
        $this.removeClass("oa-page-header-btn-son-hover");
    });


}

/**
 * 会议报名表
 * 查看报名，此功能已经整合到转公文交换界面
 */
function oaEntryForm() {
    var url = project + "/admin/meeting/meetingSignManage.action?meetingId=" + data_dataset2.first();
    createWindow({
        text: '会议报名表',
        url: url,
        id: 'dhxPop',
        width: '1024',
        height: '570',
        callBack: function (val, text) {
        }
    });

}


/**
 * 回执 （全省性会议 备案、审批）
 */
function oaBillPublicReceipt() {

    if (data_dataset2.first()) {
        globalParams.mainUnit=$("#MAIN_ORG").val();
        
        var url = project + "/admin/commonDispatch/documentExchange.action?advice=2&id="+(data_dataset2.item(data_dataset2.first()).id)+"&billId="+$("#billId").val();
        window.open(url);
        // createWindow({
        //     text: '回执',
        //     url: url,
        //     id: 'dhxPop',
        //     width: '900',
        //     height: '600',
        //     callBack: function (val, text) {
        //     }
        // });
    }
    else {
        layer.msg("请先保存");
    }


}



/**
 * 抄送文件
 */
function oaCcFile(){

    var url = project + "/admin/commonDispatch/oaCcFile.action";
    createWindow({
        text: '抄送文件',
        url: url,
        id: 'dhxPop',
        width: '900',
        height: '600',
        callBack: function (val, text) {
        }
    });
}


/**
 *厅内征求意见
 */
function seekOpinion(){

    var url = project + "/admin/commonDispatch/seekOpinion.action";
    createWindow({
        text: '厅内征求意见',
        url: url,
        id: 'dhxPop',
        width: '900',
        height: '600',
        callBack: function (val, text) {
        }
    });
}


/**
 * 会议厅内报名
 */
function officeSignUp() {
    var url = project + "/admin/commonDispatch/documentMeetingSignUp.action";
    createWindow({
        text: '厅内会议报名',
        url: url,
        id: 'dhxPop',
        width: '900',
        height: '600',
        callBack: function (val, text) {

        }
    });
}


/**
 * 会议和领导批示的取消
 */
function oaBillCancel() {

    var $type = $urlParam("djsn");
    var url;
    //会议
    if ($type == "oa_meeting_info") {
        url = project + "/admin/meetingToExchange/cancelpublishToExchangeMeeting.action?meetingInfo.id=" + data_dataset2.first();
    }
    //领导批示
    else if ($type == "oa_leader_instruction_form") {
        url = project + "/admin/instructionToExchange/cancelPublishInstructionById.action?instructionId=" + data_dataset2.first();
    }

    $.post(url, function (data) {
        layer.msg(data.result);
    });

}
/**
 * 会议反馈
 */
function oaMeetingFeedBack() {
    var url = project + "/admin/meetingToExchange/publishMeetingFeedBackToExchange.action?meetingInfo.id=" + data_dataset2.first();
    $.post(url, function (data) {
        layer.msg(data.result);
    });

}

/**
 * 关闭窗口
 */
function oaWindowClose() {
    // var isRefresh=false,
    //     // 首页。公文处理：待分，待办。 会议管理：待办，会议报名。领导批示：待办，专项事务：待办。
    //     resfreshData=["commonDispatch/oaIndex.action","waitDocument/waitDocument.action","incoming/incomingManage.action?wfType=noDo&fileType=0","incoming/incomingManage.action?wfType=noDo&fileType=1","meeting/meetingInfoManage.action?wfType=noDo","hallRegist/hallRegistManage.action","instruction/executeInst.action?iType=toDo","sptrain/sptrainManage.action?wfType=noDo"];
    //
    //
    // if (window.opener && !window.opener.closed){
    //
    //     var openerHref=window.opener.location.href;
    //
    //     for(var i=0;i<resfreshData.length;i++){
    //         if(openerHref.indexOf(resfreshData[i])>(-1)){
    //             isRefresh=true;
    //             break;
    //         }
    //     }
    //
    // }
    //
    //
    // if(isRefresh){
    //     refreshIndex();
    // }


    window.close();


}


/**
 * 转公文交换
 */
function turnDocumentExange() {
    if (data_dataset2.first()) {
        var url = project + "/admin/sendRange/sendRangeWin.action?id="+(data_dataset2.item(data_dataset2.first()).id)+"&billId="+$("#billId").val();
        if (globalParams.djsn == "oa_send_document") {
            url=url+"&moduleT=oa_send_document_send";
        } else if (globalParams.djsn == "oa_leader_instruction_form") {
            url=url+"&moduleT=oa_leader_instruction";
        }
        window.open(url);
        // createWindow({
        //     text: '转公文交换',
        //     url: url,
        //     id: 'dhxPop',
        //     width: '900',
        //     height: '600',
        //     callBack: function (val, text) {
        //
        //     }
        // });

    }
    else {
        layer.msg("请先保存");
    }


}

/**
 * 已阅
 */
function oaBillLooked() {
    $.post(project + "/admin/documentPassRead/clickPassRead.action", {"wfId": wfId}, function (result) {
        showReadPassInfo("readpassDiv");
      //  refreshIndex();
      
        if (window.opener && !window.opener.closed) {
            var indexFather = window.opener;
            indexFather.top.noteTipWaiting();
        }

    });


}

/**
 * 流程作废

 */

function oaProcessVoid() {

    var url = project + "/admin/wfManage/deleteWf.action?wf_id=" + globalParams.wfid;

    var isEnd = layer.confirm('是否作废此流程？', {

        btn: ['确定', '取消']
    }, function () {


        $.post(url, function (data) {

            layer.msg(data.datas);
            refreshIndex();
            setTimeout(function () {
                window.close();
            }, 1500);
        });
    }, function () {

    });

}


/**
 *  发文 更多按钮的附加信息

 */

function oaAddInfor(){
    var url = project + "/admin/commonDispatch/oaAddInfor.action";
    createWindow({
        text: '附加信息登记',
        url: url,
        id: 'dhxPop',
        width: '800',
        height: '300',
        callBack: function (val, text) {

        }
    });
}

/**
 *  发文 更多按钮的加印单

 */

function printDocument(){
    var url = project + "/admin/commonDispatch/printDocument.action";
    createWindow({
        text: '加印信息登记',
        url: url,
        id: 'dhxPop',
        width: '800',
        height: '480',
        callBack: function (val, text) {

        }
    });
}



/**
 *  初始化表单设计器,afterLoad之后

 */

function billPageInit() {
    //加载办理下拉控件和办理单页面
    loadDroplistDataAndBillPage('dropdownlist29', 'billdiv');

    //默认显示 办理单页面

    //几秒后进行已阅
    clickPassReadSomeTime();
}


/**
 *  加载表单设计器之后，初始化其他
 */
function loadOtherInit() {
    // $(".tab_header li:eq(0)").click();
    //传阅页面，并设阅者签字的值
    showReadPassInfo("readpassDiv", "setSignValue(result)");
    //加载流程记录
    loadRecordPage('recorddiv');
    //加载附件页面
    loadAttachmentPage('attachmentdiv');
    //加载办理单便签页面
    loadDroplistDataAndNotePage('notediv');

    //相关链接可点击
    putCanClickLink('labelLink');
}


/**
 * 操作栏按钮隐藏

 */

function operateBtnShow(state) {
    var operateBtnData;
    var pageHeader = $(".oa-only-bill-page-header");
    var pageBill = $(".oa-only-bill-page");
    //办理单处理
    if (pageBill.length < 1) {
        return
    }
    //以下4种状态显示的按钮

    //代办  保存  关闭 发送 查看流程 传阅 退回
    //在办  关闭 查看流程 收回 撤回 催办 doing
    //完结  关闭 查看流程   finish
    //查看  关闭 查看流程 view
    //代办
    if (state == "") {
        operateBtnData = ["buttonSave", "buttonWindowClose", "buttonSend", "button25", "button26", "button30", "divListMore", "buttonPrint"];

        var closeBtnData = ["takebackButton", "backButton", "supplyButton", "remindButton"];


        operateBtnData.forEach(function (value) {

            if ($("#" + value).parent().attr("id") == "divListMore") {
                $("#" + value).attr("style", "");
            }

            else {
                $("#" + value).show();
            }
        });

        closeBtnData.forEach(function (value) {
            $("#" + value).hide();
        });
    }
    //在办
    else if (state == "doing") {

        operateBtnData = ["buttonWindowClose", "button25", "takebackButton", "backButton", "remindButton", "divListMore", "moreBtnLabel", "buttonPrint", "buttonTurnDocumentExange", "buttonSeekAdvice"];

        pageHeader.find("*").hide();
        operateBtnData.forEach(function (value) {
            if ($("#" + value).length) {
                if ($("#" + value).parent().attr("id") == "divListMore") {
                    $("#" + value).attr("style", "");
                }
                else {
                    $("#" + value).show();
                }
            }
        });
        $("#buttonPrint").addClass("oa-page-header-btn-start");
        globalParams.topBtnText.edit = 0;
        globalParams.topBtnText.marking = 0;
        globalParams.topBtnText.seal = 0;
    }
    //完结
    else if (state == "finish") {
        operateBtnData = ["buttonWindowClose", "button25", "divListMore", "moreBtnLabel","buttonPrint", "buttonTurnDocumentExange", "buttonSeekAdvice","buttonProcessRestart"];

        if(globalParams.djsn=="oa_meeting_info"&&globalParams.wfs=="finish"){

            operateBtnData.push("buttonReceipt");
            operateBtnData.push("buttonOfficeSignUp");
        }
        if(globalParams.djsn=="oa_leader_instruction_form"&&globalParams.wfs=="finish"){
            operateBtnData.push("buttonMeetingPublish");
        }

        pageHeader.find("*").hide();
        $("#buttonPrint").addClass("oa-page-header-btn-start");
        operateBtnData.forEach(function (value) {

            if ($("#" + value).length) {
                if ($("#" + value).parent().attr("id") == "divListMore") {
                    $("#" + value).attr("style", "");
                }
                else {

                    $("#" + value).show();
                }
            }
        });


        globalParams.topBtnText.edit = 0;
        globalParams.topBtnText.marking = 0;
        globalParams.topBtnText.seal = 0;
    }
    //查看
    else if (state == "view") {
        operateBtnData = ["buttonWindowClose", "button25", "divListMore", "moreBtnLabel", "buttonPrint", "buttonTurnDocumentExange", "buttonSeekAdvice"];

        //领导批示-所有批示查看中，增加批示下发
        if (window.opener && !window.opener.closed){
            var destUrl="instruction/executeAllInst.action?allType=";
            var openerHref=window.opener.location.href;
                if(openerHref.indexOf(destUrl)>(-1)){
                    operateBtnData.push("buttonMeetingPublish");
                }
        }


        pageHeader.find("*").hide();
        $("#buttonPrint").addClass("oa-page-header-btn-start");
        operateBtnData.forEach(function (value) {

            if ($("#" + value).length) {

                if ($("#" + value).parent().attr("id") == "divListMore") {
                    $("#" + value).attr("style", "");
                }
                else {
                    $("#" + value).show();
                }
            }

        });
        globalParams.topBtnText.edit = 0;
        globalParams.topBtnText.marking = 0;
        globalParams.topBtnText.seal = 0;
    }


    else if (state == "read") {

        operateBtnData = ["buttonWindowClose", "button25", "divListMore", "moreBtnLabel","buttonPrint", "buttonLooked", "buttonTurnDocumentExange", "buttonSeekAdvice","button26"];
        pageHeader.find("*").hide();
        $("#buttonPrint").addClass("oa-page-header-btn-start");
        operateBtnData.forEach(function (value) {

            if ($("#" + value).length) {
                if ($("#" + value).parent().attr("id") == "divListMore") {
                    $("#" + value).attr("style", "");
                }
                else {
                    $("#" + value).show();
                }
            }
        });
        globalParams.topBtnText.edit = 0;
        globalParams.topBtnText.marking = 0;
        globalParams.topBtnText.seal = 0;

    }
//领导批示征求意见按钮隐藏

    if (globalParams.djsn == "oa_leader_instruction_form") {
        //批示
        if (globalParams.wfName == "oa_leader_instruction") {
            $("#divSeekAdvice,#buttonDraftSignFeedBack").hide();

        }
        else if (globalParams.wfName == "oa_leader_instruction_fb") {
            $("#divMeetingNotice").hide();

        }
    }


    //会议栏
    if (globalParams.djsn == "oa_meeting_info") {

        //全省性会议只有回执
        if (globalParams.wfName == "oa_provincial_meeting") {
            $("#divMeetingNotice").hide();
        }

        //会议通知有 通知发布，通知取消，查看报名

        else if (globalParams.wfName == "oa_meeting_notification_approval") {
            $("#buttonReceipt").hide();
        }



        //会议方案都无


        else if (globalParams.wfName == "oa_meeting_program_approval") {
            $("#divMeetingNotice,#buttonReceipt").hide();
        }


    }


}


//刷新index页面功能 ,作废，关闭，发送的时候
function refreshIndex() {

    if (window.opener && !window.opener.closed) {
        var indexFather = window.opener;
        indexFather.top.noteTipWaiting();
        indexFather.location.reload();
    }

}

function getCodeTime() {

    //发文签收时间，厅级以上领导
    var sendLeaderData = ["governor", "vice-governor", "secretary-general", "director"];

    var getTimeList = [];

    var $leaderAdvice = $(window.frames["billPageId"].document).find(".js-leader-advice");
    if ($leaderAdvice.length) {
        $leaderAdvice.each(function () {
            var $this = $(this);
            var tdId = $this.closest("td").attr("id");

            if (sendLeaderData.indexOf(tdId) > (-1)) {

                var time = $this.find(".js-leader-advice-last").html();
                getTimeList.push(time.split("&nbsp;")[1].replace("年", "/").replace("月", "/").replace("日", "/") + " 00:00:00");
            }
        });

    }

    var timeList;
    if (getTimeList.length) {
        timeList = getTimeList.map(function (value) {
            return (new Date(value)).getTime();
        });


        timeList.sort(function (a, b) {
            return b - a;
        });
        var timeDate = new Date(timeList[0]);

        globalParams.fileCreateDate = timeDate.getFullYear() + "年" + (timeDate.getMonth() + 1) + "月" + timeDate.getDate() + "日";

    }

}

//生成二维码
function createQRCode() {

    getCodeTime();

    //只有发文和收文才会有二维码
    if (globalParams.djsn == "oa_pg_incoming_form") {

        if($("#SERIAL_NUMBER").val().length<2){

            layer.msg("请先生成收文编号！");
            return;
        }

    }else if(globalParams.djsn == "oa_send_document"){

        if($("#DOCUMENT_NO").val().length<2){

            layer.msg("请先生成发文文号！");
            return;
        }
    }
    else {
        return
    }

    var $tableKey = window.top.document.getElementById('filePageId').contentWindow.$tableKeyId;
    if ($tableKey.length < 1) {
        layer.msg("请在正文处,先上传一个附件");
        return
    }


    var url = project + "/admin/commonDispatch/qrCode.action";
    layer.open({
        type: 2,
        title: false,
        closeBtn: 0,
        shadeClose: true,
        area: ['0px', '0px'],
        skin: 'qrcodeClass',
        content: url,
        success: function (layero, index) {

            if ($(".layui-layer-shade").length) {
                $(".layui-layer-shade").hide();
            }

        }
    });
}

//意见征求
function billSeekAdvice() {

    if (data_dataset2.first()) {
        var url = project + "/admin/sendRange/sendRangeWin.action?id="+(data_dataset2.item(data_dataset2.first()).id)+"&billId="+$("#billId").val();
        window.open(url);
        // createWindow({
        //     text: '征求意见',
        //     url: url,
        //     id: 'dhxPop',
        //     width: '900',
        //     height: '600',
        //     callBack: function (val, text) {
        //     }
        // });
    }
    else {
        layer.msg("请先保存");
    }


}

//专项事务
function  sptrainBillSeekAdvicePg(){

    if (data_dataset2.first()) {
        var url = project + "/admin/commonDispatch/documentExchange.action?advice=1&moduleT=oa_draft_info&id="+(data_dataset2.item(data_dataset2.first()).id)+"&billId="+$("#billId").val();
        window.open(url);
        // createWindow({
        //     text: '征求意见',
        //     url: url,
        //     id: 'dhxPop',
        //     width: '900',
        //     height: '600',
        //     callBack: function (val, text) {
        //     }
        // });
    }
    else {
        layer.msg("请先保存");
    }
}



//收文的意见
function billSeekAdvicePg() {

    if (data_dataset2.first()) {
        var url = project + "/admin/commonDispatch/documentExchange.action?advice=1&moduleT=oa_draft_info&id="+(data_dataset2.item(data_dataset2.first()).id)+"&billId="+$("#billId").val();
        window.open(url);
   /*     createWindow({
            text: '征求意见',
            url: url,
            id: 'dhxPop',
            width: '900',
            height: '600',
            callBack: function (val, text) {
            }
        });*/
    }
    else {
        layer.msg("请先保存");
    }

}


//取消
function billCancelSeekAdvice() {
    var $id = data_dataset2.item(data_dataset2.first()).id;
    var isDjsn = (globalParams.djsn);
    if (globalParams.djsn == "oa_leader_instruction_form" && globalParams.wfName == "oa_leader_instruction_fb") {
        isDjsn = "oa_leader_instruction_fb";
    }
    var url = project + "/admin/draftToExchange/cancelPublishDraftById.action?id=" + $id + "&isDjsn=" + (isDjsn);

    $.post(url, function (data) {
        layer.msg(data.result);
    });
}

//收文取消
function billCancelSeekAdvicePg() {
    var $id = data_dataset2.item(data_dataset2.first()).id;
    var isDjsn = (globalParams.djsn);

    var url = project + "/admin/draftToExchange/cancelPublishDraftById.action?id=" + $id + "&isDjsn=" + (isDjsn);

    $.post(url, function (data) {
        layer.msg(data.result);
    });
}

//查看反馈
function draftSignFeedBack() {
    var $id = data_dataset2.item(data_dataset2.first()).id;
    var url = project + "/admin/draftSignFeedBack/viewDraftFeedBack.action?documentId=" + $id;
    createWindow({
        text: '查看反馈',
        url: url,
        id: 'dhxPop',
        width: '900',
        height: '550',
        callBack: function (val, text) {
        }
    });
}


/**
 * 导出word

 */

function oaBillLoadWord() {

    window.top.layer.msg("导出中...");
    var url;
    var $id = data_dataset2.item(data_dataset2.first()).id;

    var bill = document.getElementById('billPageId');

    var $billId = bill.contentWindow.billName;

    //收文
    if (globalParams.djsn == "oa_pg_incoming_form") {
        url = project + "/admin/handleToWordPDF/buildWordByHandle.action?moduleType=oa_incomming_info&id=" + $id + "&billId=" + $billId;
    }
    //发文
    else if (globalParams.djsn == "oa_send_document") {
        url = project + "/admin/handleToWordPDF/buildWordByHandle.action?moduleType=oa_send_document_info&id=" + $id + "&billId=" + $billId;

    }
    //会议
    else if (globalParams.djsn == "oa_meeting_info") {
        url = project + "/admin/handleToWordPDF/buildWordByHandle.action?moduleType=oa_meeting_info&id=" + $id + "&billId=" + $billId;

    }

    //批示
    else if (globalParams.djsn == "oa_leader_instruction_form") {
        url = project + "/admin/handleToWordPDF/buildWordByHandle.action?moduleType=oa_instruction_info&id=" + $id + "&billId=" + $billId;

    }
    //专项事务
    else if (globalParams.djsn == "oa_sptrain_audit") {
        url = project + "/admin/handleToWordPDF/buildWordByHandle.action?moduleType=oa_sptrain_info&id=" + $id + "&billId=" + $billId;
    }

    $.post(url, function (data) {
        var sul = "http://" + window.location.host + project + "/servlet/downloadServlet?path=";
        if (data.flag == "1") {

            sul += data.data.filePath;
            window.open(sul);
        }
        else {
            layer.msg(data.message);
        }
    });


}


function oaBillLoadPdf() {
    window.top.layer.msg("导出中...");
    var url;
    var $id = data_dataset2.item(data_dataset2.first()).id;

    var bill = document.getElementById('billPageId');

    var $billId = bill.contentWindow.billName;


    //收文
    if (globalParams.djsn == "oa_pg_incoming_form") {
        url = project + "/admin/handleToWordPDF/buildPDFByWord.action?moduleType=oa_incomming_info&id=" + $id + "&billId=" + $billId;
    }
    //发文
    else if (globalParams.djsn == "oa_send_document") {
        url = project + "/admin/handleToWordPDF/buildPDFByWord.action?moduleType=oa_send_document_info&id=" + $id + "&billId=" + $billId;

    }
    //会议
    else if (globalParams.djsn == "oa_meeting_info") {
        url = project + "/admin/handleToWordPDF/buildPDFByWord.action?moduleType=oa_meeting_info&id=" + $id + "&billId=" + $billId;

    }

    //批示
    else if (globalParams.djsn == "oa_leader_instruction_form") {
        url = project + "/admin/handleToWordPDF/buildPDFByWord.action?moduleType=oa_instruction_info&id=" + $id + "&billId=" + $billId;

    }
    //专项事务
    else if (globalParams.djsn == "oa_leader_instruction_form") {
        url = project + "/admin/handleToWordPDF/buildPDFByWord.action?moduleType=oa_sptrain_info&id=" + $id + "&billId=" + $billId;

    }

    $.post(url, function (data) {
        var sul = "http://" + window.location.host + project + "/servlet/downloadServlet?path=";
        if (data.flag == "1") {

            sul += data.data.filePath;
            window.open(sul);
        }
        else {
            layer.msg(data.message);
        }
    });
}



/**
 *填写“初核意见”后，自动更新附加信息中初核人
 * 填写“副秘书长副主任签批”、“主任签批”、“副省长签批”、“省长签批”最后一个填写意见的领导，自动更新附加信息中签发人
 * id为意见栏的td ID值
 */

function updateAddInfor(id){

    if(globalParams.djsn=="oa_send_document"){


    	var audiMan=["fir-examine"];

        for(var i=0,max=audiMan.length;i<max;i++){

            if(audiMan[i]==id){
                //初核人
                $("#AUDIT_MAN").val(globalParams.loginChineseName);
                break;
            }
        }

        var signMan=["governor","vice-governor","secretary-general","deputy-director"];
        for(var i=0,max=signMan.length;i<max;i++){
            if(signMan[i]==id){
                //签发人
                $("#SIGN_MAN").val(globalParams.loginChineseName);
                break;
            }
        }

    }

}


