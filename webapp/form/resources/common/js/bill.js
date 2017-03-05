var jsBillInput;
//办理单公用的js文件
var billGlobal = {
    init: function () {
        this.sendDocumentFillAuto();
        this.userInfor();
        this.getFileNumber();
        this.isGoingAdvice();
        this.oaLeaderLimit();
        this.oaSptrainAudit();
        this.billInformation();
        this.initLeaderInstruction();
        this.secretLayer();
        this.meetingRemarkFill();
        this.clearAdvice();
        this.meetingDelTr();
        this.btnControl();
        this.remarkAdvice();
        this.syncFileNumGenerate();
        this.setInitFileNum();
        this.setAgreenBtnNo();
        this.getPgIncomingRemark();
    },
    //参数配置
    param: {},
    getPgIncomingRemark:function () {
       var billType=$(window.parent.document).find("#sel_dropdownlist29").find("option:selected").text();

        var url=window.top.project+"/admin/incomingAdviceConfig/manageMent.action?etc="+ new Date().getTime(),
            obj={
                "manageType":"需要办理",
                "deptId":"",
                "documentType":billType
            };

            if(billType=="国务院文"){
                if($("#FILE_UNIT").length&&$("#FILE_UNIT").val().length<1&&$("#text25").length&&$("#text25").val().length<1){
                    $.post(url,obj,function (data) {
                        $("#text25").val(data.data.remark.replace(/<br>/g, "\n"));

                    });	
                }


            }



    },
    //收文备注信息来自法制办，署名为最后一个，且备注意见只为一个
    remarkAdvice: function () {
        var $remakLenght = $(".js-remark-advice");
        var remarkContent = "";
        if ($remakLenght.length) {
            $remakLenght.each(function (index, val) {
                var $this = $(this);
                if ((index + 1) == $remakLenght.length) {
                    remarkContent = $this.find(".js-leader-advice-last").html();
                    if (index > 0) {
                        $this.remove();
                    }
                }

            });
            $remakLenght.eq(0).find(".js-leader-advice-last").html(remarkContent);
        }

        if(window.top.globalParams.djsn == "oa_pg_incoming_form"){
            if($("#td-advice-remark").length){
                if($("#td-advice-remark .js-remark-advice").length<1){
                    $("#td-advice-remark").hide();
                }

            }
        }

    },
    //设置秘书处拟办意见 同意按钮隐藏
    setAgreenBtnNo: function () {

        //收文流程，秘书处拟办意见，单独控制
        //收文流程：秘书处负责人审核环节外，其他同意按钮均无
        if (window.top.globalParams.djsn == "oa_pg_incoming_form") {
            //收文登记流程
            if (window.top.globalParams.nodeName != "secretariat_deputy_director") {
                if ($("#bill_secretary").find(".js-bill-agree").length) {
                    $("#bill_secretary").find(".js-bill-agree").hide();
                }
            }
        }

    },
    //收文流程邹虹和邹峰华 收回可见
    btnControl: function () {
        var $doing = window.top.$urlParam("wfs");
        parent.$("#takebackButton").hide();
        if (window.top.globalParams.djsn == "oa_pg_incoming_form" && $doing == "doing") {

            //当前用户处于其中的一个角色，则收回按钮可见
            var roleData = ["83f07e3140d24a83be3445e417f804fb", "b7fc1a313b664bd1b5f21764c597f0b5"];
            var roleIdGroup = window.top.globalParams.roleId;
            roleData.forEach(function (value) {
                if (roleIdGroup.indexOf(value) > (-1)) {
                    parent.$("#takebackButton").attr("style", "");
                }
            });
        }
    },
    //清除无用的意见
    clearAdvice: function () {
        var isGoing=true,
            //收文流程和发文流程保存
            unClearData=["oa_pg_incoming_form","oa_send_document"];
        for(var i=0,max=unClearData.length;i<max;i++){
            if(window.top.globalParams.djsn==unClearData[i]){
                isGoing=false;
                break;
            }
        }
        if(isGoing){
            $(".js-leader-advice-content").each(function () {
                var $this = $(this),
                    $advice = $this.find("span").text();
                if ($advice.length < 1) {
                    $this.hide();
                }
            });
        }
    },
    //会议意见删除
    meetingDelTr: function () {
        if (window.top.globalParams.djsn === "oa_meeting_info" && window.top.globalParams.wfName === "oa_meeting_program_approval") {

            if ($("#tr-gover-advice").length) {
                //代省长栏隐藏
                if (parent.$("#REQUIREMENT").val() == "1") {
                    $("#tr-gover-advice").hide();
                }

                if (window.top.globalParams.nodeName != "drag") {
                    $("#del-tr-ad").closest("div").remove();
                }

            }
        }
    },
    //会议方案和通知，备注内容自动填充, 申报单位自动填充(隐藏)
    meetingRemarkFill: function () {

        var getSelectTitle = parent.$("#sel_dropdownlist29").val();

        //会议方案
        if (window.top.globalParams.djsn === "oa_meeting_info" && window.top.globalParams.wfName === "oa_meeting_program_approval") {
            var remarkContent = "    1.汇报单位汇报人可带1名助手进入会场，其他参会单位请严格按照报名人员参会。\n    2.请汇报单位于xx月xx日中午12时前，将汇报材料电子稿送交省委印刷厂（电话：87052245），及时做好校对工作。\n    3.请个参会单位于xx月xx日中午12时，前通过省政府内网会议系统报名；主要负责人不能到会的请按规定报送书面请假单（传真：87056191）。因会议时间难以准确预计，请后一议题参会人员提前20分钟侯会。\n    4.会议材料将通过政务内网提前发布，请参会单位自行下载本单位参加议题的材料；请按保密规定妥善保管。\n    5.请厅有关处室负责人参加相关议题旁听。";
            // 省政府常务会议,其他会议（需省长签批）
            var remarkTitle = ["fcd1f52b12cd42c6902777b229a9b0e3", "3f06b6649b8c4112a8425fca96610564"];
            remarkTitle.forEach(function (value) {
                if (value === getSelectTitle) {
                    var $remark = $("#MEETING_REMARK");
                    if ($remark.length && $remark.val().length < 1) {

                        $remark.val(remarkContent);
                    }
                }
            });
        }

        //会议通知
        else if (window.top.globalParams.djsn === "oa_meeting_info" && window.top.globalParams.wfName === "oa_meeting_notification_approval") {
            var remarkContent = "    1.汇报单位汇报人可带1名助手进入会场，其他参会单位请严格按照报名人员参会。\n    2.请汇报单位于xx月xx日中午12时前，将汇报材料电子稿送交省委印刷厂（电话：87052245），及时做好校对工作。\n    3.请个参会单位于xx月xx日中午12时，前通过省政府内网会议系统报名；主要负责人不能到会的请按规定报送书面请假单（传真：87056191）。因会议时间难以准确预计，请后一议题参会人员提前20分钟侯会。\n    4.会议材料将通过政务内网提前发布，请参会单位自行下载本单位参加议题的材料；请按保密规定妥善保管。\n    5.请厅有关处室负责人参加相关议题旁听。";
            // 省政府常务会议
            var remarkTitle = ["c860a4f7d4f04d3d81f3fbcbf3a1b673"];
            remarkTitle.forEach(function (value) {
                if (value === getSelectTitle) {
                    var $remark = $("#MEETING_REMARK");
                    if ($remark.length && $remark.val().length < 1) {
                        $remark.val(remarkContent);
                    }
                }
            });

        }


        //申报单位自动填充
        if (window.top.globalParams.djsn === "oa_meeting_info") {
            if (window.top.globalParams.wfName === "oa_meeting_notification_approval" || window.top.globalParams.wfName === "oa_meeting_program_approval") {

                if (parent.$("#MAIN_ORG").val().length < 1) {

                    parent.$("#MAIN_ORG").val(sendOrgName);
                }

            }
        }

    },
    //领导批示序号
    leaderNum: function (isGet) {

        if (isGet) {
            var leaderNumberUrl = window.top.project + "/admin/documentLeaderNumber/createLeaderNumber.action?etc=" + new Date().getTime();
            var leaderData = {
                "swungDash": $("#instruction_leader").val()
            };

            $.ajax({
                url: leaderNumberUrl,
                type: 'post',
                data: leaderData,
                async: false,
                error: function () {
                    window.top.layer.msg("流水号生成失败");

                },
                success: function (result) {
                    if (result.resultFlag == "true") {

                        var totalMessage = (result.message);
                        $("#instruction_order").val(totalMessage);

                        parent.$("#instruction_order").val(totalMessage);
                    } else {

                    }
                }
            });
        }

    },
    //密级程度提示信息
    secretLayer: function () {
        var tip = '当前系统为非涉密系统，涉密文件请另行处理';
        $("#FILE_DEGREE,#SECRET_LEVEL,#secret_level").change(function () {
            var $this=$(this);
            var $val = $.trim($this.val());
            if ($val.length) {
                window.top.layer.msg(tip);
                $this.val("");
            }


        });
    },
    //领导批示
    initLeaderInstruction: function () {
        var $djsn = window.top.globalParams.djsn,
            $nodeName = window.top.globalParams.nodeName,
            $wfName = window.top.globalParams.wfName;

        if ($djsn === "oa_leader_instruction_form") {

            if ($nodeName === "reg" && $wfName === "oa_leader_instruction") {
                var url = window.top.project + "/admin/instruction/officeLeaderProBydraftBy.action?etc=" + new Date().getTime() + "&leaderType=0";
                $.getJSON(url, function (data) {
                    var result = data.data;
                    var html = [];
                    if (result.length > 0) {
                        result.forEach(function (value) {

                            $("#instruction_leader").val(value.name);
                            parent.$("#instruction_leader").val(value.name);
                        });


                    }

                    //领导批示批号
                    var isGet = true;
                    var leaderNumer = $("#instruction_order").val();

                    if (leaderNumer.length < 3) {

                        isGet = true;
                    }
                    else {
                        isGet = false;
                    }
                    billGlobal.leaderNum(isGet);


                });
            }


        }
    },
    //默认的15天时间，相隔的周末数量为6
    calWeekDay: function () {
        var limitDay = 15;
        var now = new Date();
        var limitDate = new Date(now.getTime() + 21 * 1000 * 60 * 60 * 24);
        var totoalDate = limitDate.getFullYear() + "-" + addZero(limitDate.getMonth() + 1) + "-" + addZero(limitDate.getDate());

        $("#need_feedback_time").val(totoalDate);
        parent.$("#need_feedback_time").val(totoalDate);


    },
    //发文拟稿的浙政发和浙政办发,主送和抄送自动填充
    // 全身性会议审批和备案 金额自动填充
    sendDocumentFillAuto: function () {
        var $djsn = window.top.globalParams.djsn;
        var $nodeName=window.top.globalParams.nodeName;
        var mainText = "",
            ccText = "";

        if ($djsn == "oa_send_document"&$nodeName=="firstBlood") {
            var url=window.top.project+"/admin/incomingAdviceConfig/manageMent.action?etc="+new Date().getTime();
            var obj={
                "manageType":"",
                "deptId":"",
                "documentType":$.trim(billFileType)
            }
            $.post(url,obj,function (data) {

                //主送
                if(data.data.sendMain){
                    $("#main_unit").val(data.data.sendMain);
                    parent.$("#main_unit").val(data.data.sendMain);
                }

                //抄送
                if(data.data.sendCopy){
                    $("#copy_unit").val(data.data.sendCopy);
                    parent.$("#copy_unit").val(data.data.sendCopy);
                }

                //纸质份数
                if(data.data.number){
                    $("#paper_number").val(data.data.number);
                    parent.$("#paper_number").val(data.data.number);

                }

                //分送
                if(data.data.sendFensong){
                    $("#distribute_send").val(data.data.sendFensong);
                    parent.$("#distribute_send").val(data.data.sendFensong);

                }

                //签发人
               if(data.data.signMan){
                   parent.$("#SIGN_MAN").val(data.data.signMan);
               }

            });


        }


        //全身性会议审批和备案 金额自动填充
        if ($djsn == "oa_meeting_info") {
            var wfName = window.top.globalParams.wfName;
            if (wfName === "oa_provincial_meeting_record" || wfName === "oa_provincial_meeting_approve") {

                var money = $("#MEETING_MONEY").val();
                if (money.length < 1) {
                    $("#MEETING_MONEY").val("按会议管理规定办理");
                }
            }

        }


        //全省性审批,备案
        if ($djsn == "oa_meeting_info") {
            if (window.top.globalParams.wfName == "oa_provincial_meeting_approve" || window.top.globalParams.wfName == "oa_provincial_meeting_record") {
                if (window.top.globalParams.nodeName != "reg_confirm") {
                    if ($(".js-bill-agree").length > 0) {
                        $(".js-bill-agree").remove();
                    }
                }


            }

        }

        //发文的行政规范性文件发文立项审批件和行政规范性文件发文立项审批单自动填充

        if ($djsn == "oa_send_document") {
            var fillData = ["8a1c61ededf1494788cd779a740bb528", "0e112e9a45ef4837bc1f6311ed41b1f3"];
            //  var $val = parent.$("#sel_dropdownlist29").val();
            var $val = parent.$("#billId").val();

            fillData.forEach(function (value) {

                if ($val == value) {


                    if (parent.$("#main_unit").val().length < 1) {
                        parent.$("#main_unit").val("autoFilled");

                    }

                    if (parent.$("#TITLE").val().length < 1) {

                        parent.$("#TITLE").val("行政规范性文件发文立项审批单");
                    }


                    //文号填充
                    if ($val == "0e112e9a45ef4837bc1f6311ed41b1f3") {


                        if (parent.$("#DOCUMENT_NO").val().length) {


                            var $text = parent.$("#DOCUMENT_NO").val().split("〔")[1];
                            var $nextNum = $text.split("〕")[1].split("号")[0];
                            if ($nextNum.length > 0) {
                                if (parseInt($nextNum) > 0) {

                                    $("#file_num_pre").val($text.split("〕")[0].split("20")[1]);
                                    $("#file_num_next").val($text.split("〕")[1].split("号")[0]);
                                }

                            }
                            else {

                              //  billGlobal.syncFileNum($("#file_num_pre"), 1);
                            }


                        }
                        else {


                          //  billGlobal.syncFileNum($("#file_num_pre"), 1);

                        }
                    }

                }
            });


            if (parent.$("#sel_dropdownlist29").val() == "8a1c61ededf1494788cd779a740bb528") {

                if ($("#TITLE").length) {
                    if ($("#TITLE").val().length < 1) {
                        $("#TITLE").val("行政规范性文件发文立项审批单");
                        parent.$("#TITLE").val("行政规范性文件发文立项审批单");

                    }
                }
            }

        }


    },
    //联系人电话，初始赋值
    userInfor: function () {
        var $userName = $(".js-bill-contacts");
        var $userPhone = $(".js-bill-phone");

        var billType = window.top.$urlParam("djsn");
        var fileType = parent.$("#sel_dropdownlist29").find("option:selected").text();
        //收文流程不需要自动填充
        if (billType != "oa_pg_incoming_form") {

            if ($userName.length > 0) {
                if ($userName.val().length < 1) {
                    $userName.val(userName);
                    var $nameId = $userName.attr("id");
                    parent.$("#" + $nameId).val(userName);
                }
            }
            if ($userPhone.length > 0) {
                if ($userPhone.val().length < 1) {

                    var phoneVal = usercellphoneNumber;

                    //发文浙政发 校对
                    if (billType == "oa_send_document" && fileType === "浙政发") {
                        phoneVal = sendProofreading;
                    }
                    $userPhone.val(phoneVal);
                    var $phoneId = $userName.attr("id");
                    parent.$("#" + $phoneId).val(phoneVal);
                }

            }
        }

        //发文主办处室
        if (billType == "oa_send_document") {

            if ($("#DRAFT_DEPT").length) {

                if ($("#DRAFT_DEPT").val().length < 1) {
                    $("#DRAFT_DEPT").val(sendOrgName);
                    parent.$("#DRAFT_DEPT").val(sendOrgName);
                }

            }

            //发文默认填充 主办处室拟稿人，包括行政性
            if (parent.$("#DRAFT_DEPT").val().length < 1) {
                parent.$("#DRAFT_DEPT").val(sendOrgName);
            }
            if (parent.$("#DRAFT_MAN").val().length < 1) {
                parent.$("#DRAFT_MAN").val(userName);
            }

        }

    },
    setInitFileNum: function () {


        var $nodeName = window.top.$urlParam("nodeName");

        var billType = window.top.$urlParam("djsn");

        //跟新文号，设置文号和编号的初始值
        if (billType == "oa_pg_incoming_form") {

            window.top.globalParams.fileNumStart = parent.$("#SERIAL_NUMBER").val();
        }

        else if (billType == "oa_send_document") {

            if ($nodeName == "createFileNo") {
                window.top.globalParams.fileNumStart = parent.$("#DOCUMENT_NO").val();
                window.top.globalParams.sendSerialNumber = parent.$("#serial_number").val();
            }
            //发文立项审批单跳号
            if (parent.$("#billId").val() == "0e112e9a45ef4837bc1f6311ed41b1f3") {
                window.top.globalParams.fileNumStart = parent.$("#DOCUMENT_NO").val();
            }
        }
        else if (billType == "oa_meeting_info") {

            window.top.globalParams.fileNumStart = parent.$("#DOC_NUM").val();
        }
        else if (billType == "oa_leader_instruction_form") {
            window.top.globalParams.fileNumStart = parent.$("#instruction_no").val();
            window.top.globalParams.leaderInstructionNum = parent.$("#instruction_order").val();

        }
    },
    getFileNumber: function () {


        var $nodeName = window.top.$urlParam("nodeName");

        var billType = window.top.$urlParam("djsn");
//发文的获取文号


        //跟新文号，设置文号和编号的初始值
        if (billType == "oa_pg_incoming_form") {

            window.top.globalParams.fileNumStart = parent.$("#SERIAL_NUMBER").val();
        }

        else if (billType == "oa_send_document") {

            if ($nodeName) {

            }
        }


        if (billType == "oa_send_document") {


            if($("#sendFileNum").length){
                //初始化 文号
                if($(".js-oa-bill-title-name").length){
                    $(".js-oa-bill-title-name").text(parent.$("#send_word").val());
                }
                if($(".js-file-number-has").length){
                    $(".js-file-number-has").text(parent.$("#DOCUMENT_NO").val());
                }
            }




            if ($nodeName == "createFileNo") {
                $(".file-number-no").show();
                $(".js-file-number-has").hide();



            }
            else {
                $(".js-normative-file-num").hide();
                if (fileNumber.length > 2) {
                    $(".js-file-number-has,.js-oa-bill-title-name-bot").show();
                    return;
                }


                // sendFileNum 此ID和发文中行政规范性文件发文立项审批做区分
                if ($("#sendFileNum").length) {

                    var $dash = parent.$("#sel_dropdownlist29").find("option:selected").text();
                    var text = "〔20 〕   号";
                    var strHtml = $dash + text;
                    $(".file-number-no").hide();
                    $(".js-file-number-has,.js-oa-bill-title-name-bot").show().html("<span>" + strHtml + "</span>");

                    parent.$("#DOCUMENT_NO").val(strHtml);
                }

            }

        }
    },
    isGoingAdvice: function () {
        var $area = window.top.$urlParam("area");
        if ($area == "msc") {
            $(".js-going-advice").addClass("going-advice-show");
            $(".going-advice").show();
        }
    },
    //计算领导批示默认反馈日期
    oaLeaderLimit: function () {
        var billType = window.top.$urlParam("djsn");
        var wfName = window.top.$urlParam("wfName");
        var nodeName = window.top.$urlParam("nodeName");

        //审批意见 同意按钮出现
        if (billType == "oa_leader_instruction_form" && nodeName == "secretariat_deputy_director") {

            $(".js-approval-advice .js-leader-document-agree,.js-approval-advice .js-leader-advice-edit,.js-approval-advice .js-leader-advice-del").show();

        }

        if (billType == "oa_leader_instruction_form" && wfName == "oa_leader_instruction") {
            // calWeekDay();
            if ($("#need_feedback_flag").val() != "0") {
                if ($("#need_feedback_time").val().length < 1) {
                    billGlobal.calWeekDay();
                }

            }

        }
    },
    //转向事务处理
    oaSptrainAudit: function () {
        var $djsn = window.top.$urlParam("djsn");
        if ($djsn == "oa_sptrain_audit") {

            //申请人
            var applyMan = window.top.globalParams.loginChineseName;
            var draftDept = sendOrgName;

            //电话号码
            if (usercellphoneNumber.length > 1) {
                applyMan += "(" + usercellphoneNumber + ")";
            }

            if ($("#applicant_man").val().length < 1) {
                $("#applicant_man").val(applyMan);
                parent.$("#applicant_man").val(applyMan);
            }

            if ($("#draft_dept").val().length < 1) {
                $("#draft_dept").val(draftDept);
                parent.$("#draft_dept").val(draftDept);
            }

        }
    },
    billInformation: function () {
        var date = new Date();
        var getTime;

        var fillYear = date.getFullYear();
        var fillMonth = commonApi.addZero(date.getMonth() + 1);
        var fillDay = commonApi.addZero(date.getDate());
        var $djsn = window.top.globalParams.djsn;
        //专项事务和发文需要日期自动填充
        if ($djsn == "oa_send_document" || $djsn == "oa_sptrain_audit") {

            if ($djsn == "oa_send_document") {
                getTime = parent.$("#SYTY_DATE").val();
            }
            else if ($djsn == "oa_sptrain_audit") {
                getTime = parent.$("#draft_date").val();
            }
            if (getTime.length > 1) {
                var dateTime = getTime.split("-");
                fillYear = dateTime[0];
                fillMonth = dateTime[1];
                fillDay = dateTime[2];
            }
        }

        $(".js-send-year").val(fillYear);
        $(".js-send-month").val(fillMonth);
        $(".js-send-day").val(fillDay);

    },
    //获取规范性文件编号
    getNormativeFileNum:function(){
       
            //发文规范性文件编号生产 ,浙政和浙政办
            if (window.top.globalParams.djsn === "oa_send_document") {
                // 编号为空时
                var url = window.top.project + "/admin/documentSerialNumber/createSerialNumber.action?etc=" + new Date().getTime();
                var $fileType = (parent.$("#send_word").val()).indexOf("办") > (-1) ? "浙政办" : "浙政";
                var data = {
                    "wfName": window.top.globalParams.wfName,
                    "fileType": $fileType
                }
                $.post(url, data, function (result) {
                    if (result.resultFlag == "true") {
                        $("#serial_number").val(result.message);
                        parent.$("#serial_number").val(result.message);
                    }
                });
            }
       

    },
    //同步文号
    /*
     * obj 当前对象
     * type 1:ajax请求,2:文号年份修改,文号编号修改
     * */
    syncFileNum: function (obj, type) {

        var fileUrl = billUrl + "/admin/documentFileNumber/createFileNumber.action";
        var $dash;


        if ($("#sendFileNum").length) {
           // $dash = parent.$("#sel_dropdownlist29").find("option:selected").text();
            $dash=parent.$("#send_word").val();
        }
        else {

            $dash = "发文立项审批";

        }
   
        var $this = obj;
        var $fileNumer = $this.closest(".file-number-no");
        var inputTime = $fileNumer.find("input").eq(0);
        var inputNumber = $fileNumer.find("input").eq(1);


        if (type == 1) {
            $.post(fileUrl, {"swungDash": $dash}, function (data) {
                if (data.resultFlag = "true") {
                    var message = data.message.split("@@");
                    inputTime.val(message[0]);
                    inputNumber.val((message[1]));
                    var text = "〔20" + message[0] + "〕" + (message[1]) + "号";

                    parent.$("#DOCUMENT_NO").val($dash + text);

                    $("#file_num_no_bot").html($dash + text);
                }
                else {
                    window.top.layer.msg("获取失败");
                }
            });
        }
        else if (type == 2) {
            var text = "〔20" + $("#file_num_pre").val() + "〕" + ($("#file_num_next").val() ) + "号";
            parent.$("#DOCUMENT_NO").val($dash + text);

            if ($("#file_num_no_bot").length) {
                $("#file_num_no_bot").html($dash + text);
            }

        }

        var radio = $(".icon-check-square").data("value");
        //领导批示是否需要反馈
        if (parseInt(radio) < 1 && (window.top.globalParams.djsn == "oa_leader_instruction_form")) {
            $("#need_feedback_time").val("");
        }
        else if (parseInt(radio) == 1 && (window.top.globalParams.djsn == "oa_leader_instruction_form")) {
            billGlobal.calWeekDay();
        }



    },
    //监听文号已产生
    syncFileNumGenerate: function () {
        if ($(".js-file-number-has").css("display") == "none") {
            var text = $.trim($(".js-file-number-has").text());
            var tY = text.split("〔20");
            var tN = tY[1].split("〕");
            var N = tN[1].split("号");
            $("#file_num_pre").val(tN[0]);
            $("#file_num_next").val(N[0]);
        }

        // if ($("#serial_number").length > 0) {
        //     $(".action-radio").removeClass("icon-check-square");
        //     $(".action-radio").eq(0).addClass("icon-check-square");
        // }
    }
}


$(function () {
    billGlobal.init();
    $("input").blur(function () {
        var $this = $(this);
        var id = $(this).attr("id");
        parent.$("#" + id).val($(this).val());
        var djsn = window.top.globalParams.djsn;

        //发文字号
        if (id == "file_num_pre" || id == "file_num_next") {
            billGlobal.syncFileNum($this, 2);
        }

        //会议时间需要单独配置,other取，START_DATE保存
        if (id == "other") {
            var totalHtml = $(this).val().split("月")[0].split("年");
            var totalHtmlSec = totalHtml[0] + "-" + totalHtml[1];
            parent.$("#START_DATE").val(totalHtmlSec + "-01");
        }
        //办理期限
        else if (id == "deal_limit") {
            var parentId;

            //收文
            if (djsn == "oa_pg_incoming_form") {
                parentId = "text32";

            }
            //发文
            else if (djsn == "oa_send_document") {
                parentId = "SECRET_TIME";
            }
            //领导
            else if (djsn == "oa_leader_instruction_form") {
                parentId = "need_feedback_time";
            }
            //专项事务
            else if (djsn == "oa_sptrain_audit") {
                if ($(this).val().length > 1) {
                    parent.$("#" + id).val($(this).val() + " 00:00:00");
                }

            }

        }
        //行政规范性文件发文立项审批件 文件名称为文件标题
        else if (id == "ATTACHMENT_REMARK") {
            if (djsn == "oa_send_document" && parent.$("#sel_dropdownlist29").find("option:selected").text() == "行政规范性文件发文立项审批件") {
                parent.$("#TITLE").val($this.val());
            }
        }

        //发文办理期限
        if (id == "time_limit" && djsn == "oa_send_document") {
            if ($(this).val().length > 1) {
                parent.$("#" + id).val($(this).val() + " 00:00:00");
            }
        }
    });
    $("textarea").blur(function () {

        var id = $(this).attr("id");
        var strHTml = $(this).val();

        // parent.$("#" + id).val($(this).val());
        parent.$("#" + id).val(strHTml.replace(/\n/g, "<br>"));
    });
    $("select").change(function () {
        var id = $(this).attr("id");
        parent.$("#" + id).val($(this).val());
        if (id == "instruction_leader") {
            billGlobal.leaderNum(true);
        }
    });


    //下拉选择初始赋值
    var selectAll = $("select");
    if (selectAll.length > 0) {
        selectAll.each(function (index) {

            var $this = $(this);
            var id = $(this).attr("id");
            parent.$("#" + id).val($(this).val());

        });
    }

    //计算领导批示默认反馈日期

    //自动填充日期
    var dateFill = $('.js-date-fill');

    function autoFillDate(year, month, day) {
        var myDate = new Date();
        if (year) {
            myDate.setFullYear(myDate.getFullYear() + parseInt(year));
        }
        if (month) {
            myDate.setMonth(myDate.getMonth() + parseInt(month));
        }
        if (day) {
            myDate.setDate(myDate.getDate() + parseInt(day));
        }
        var month = myDate.getMonth() + 1;
        var day = myDate.getDate();
        return myDate.getFullYear() + "-" + ((month + "").length == 1 ? "0" + month : month) + "-" + ((day + "").length == 1 ? "0" + day : day);
    }

    if (dateFill.length > 0) {
        dateFill.each(function (i) {
            var $this = $(this);
            var id = $(this).attr("id");

            if ($this.val().length < 1) {
                $(this).val(autoFillDate());
                parent.$("#" + id).val(autoFillDate());
            }


        });
    }

    $(document).on("click",".js-leader-advice",function (event) {
        event.stopPropagation();
    });
    //输入弹出层

    $(document).on("click", ".js-choice-input", function () {
        var $this = $(this),
            title = $this.closest("tr").find("td").eq(0).text(),
            $td = $this.closest("td"),
            $goingAdvice = $this.find(".js-leader-advice");
        var parent = window;
        var isOnlyOne = true;

        //开放输入很多条已经的权限

        if ($td.attr("id") == "bill_secretary" && window.top.globalParams.djsn == "oa_pg_incoming_form") {
            isOnlyOne = false;
        }

        if (isOnlyOne) {

            if ($td.hasClass("js-going-advice-td") && ($goingAdvice.length > 0)) {

                var $msg = $this.data("msg") ? $this.data("msg") : "只能为一条意见";

                window.top.layer.msg($msg);

                return;
            }
        }

        //已核
        else if ($td.hasClass("js-advice-only-one") && ($goingAdvice.length > 0)) {
            window.top.layer.msg("此意见只能为一条");
            return;
        }

        window.top.inputAdvice(title, parent, $this, "", 1, 0, "");

    });

    //编辑
    $(document).on("click", ".js-leader-advice-edit", function (event) {
        event.stopPropagation();
        var $this = $(this),
            title = $this.closest("tr").find("td").eq(0).text();
        var obj = $this.closest('.js-leader-advice');
        var parent = window;
        var content = obj.find(".js-leader-advice-content span").html();

        var isImg = $this.closest(".js-leader-advice-content").find("img").length;
        var fileName = $this.closest(".js-leader-advice-content").find("span").text();

        window.top.inputAdvice(title, parent, obj, content, 2, isImg, fileName);

    });
    //删除
    $(document).on("click", ".js-leader-advice-del", function (event) {
        event.stopPropagation();
        var $this = $(this),
            $advice = $this.closest(".js-leader-advice");
        var $id = $advice.attr("id"),
            $td = $this.closest("td");
        var surl = billUrl + "/admin/documentData/delDocumentAdvice.action";
        window.top.layer.confirm('是否删除此意见', {
            btn: ['确定', '取消'] //按钮
        }, function () {

            if ($id.length > 1) {
                $.post(surl, {
                    'id': $id,
                    "accountName": (window.top.globalParams.loginName)
                }, function (data) {
                    if (data.result == "success") {
                        window.parent.layer.msg(data.message);
                        $advice.remove();
                        //发文已核状态
                        if ($td.hasClass("js-advice-only-one")) {
                            $td.find(".js-already-check").show();
                        }
                    }
                    else {
                        window.parent.layer.msg("删除失败");
                    }

                });
            } else {
                $advice.remove();
                window.parent.layer.msg("删除成功");
            }

            var $choiceInput = $this.closest(".js-choice-input");
            var $jsLeader = $choiceInput.find(".js-leader-advice");
            if ($jsLeader.length < 1) {
                var delDOm = '<span class="td-choice-input-tip" style="color:#000;">点击输入</span>';

                $choiceInput.append(delDOm);
            }


        }, function () {

        });


    });

    //代省长意见栏删除
    $("#del-tr-ad").click(function (event) {
        event.stopPropagation();
        window.top.layer.msg("代省长已删除");attr("id");
        $("#tr-gover-advice").hide();
        parent.$("#REQUIREMENT").val("1");
    });

    //发文已核
    $(document).on('click', ".js-already-check", function (event) {
        event.stopPropagation();
        var $this = $(this),
            $td = $this.closest("td"),
            $adviceType = $td.data("type"),
            $adviceId = "advice" + new Date().getTime(),
            $inputChoice = $td.find(".js-choice-input"),
            //  $tip=$(this).text();
            $tip = $this.data("tip"),
            $adviceIdLast=$td.attr("id");

        $td.find(".td-choice-input-tip").remove();

        var contentData = [];
        contentData.push({
            "adviceType": $adviceType,
            "adviceId": $adviceId,
            "adviceContent": $tip

        });
        var wfId = window.top.$urlParam("wfId");
        var surl = window.top.project + "/admin/documentData/addDocumentAdvice.action";
        $.post(surl, {
            "wfId": wfId,
            contentData: JSON.stringify(contentData),
            "wfName": window.top.$urlParam("wfName"),
            "commonAdvice.content": $tip,
            "commonAdvice.wfName": window.top.$urlParam("wfName"),
            "accountName": (window.top.globalParams.loginName)
        }, function (data) {
            var resultData = data.datas[0],
                dataId = resultData.id,
                dataName = resultData.userName;
            $inputChoice.append("<div class='js-leader-advice' data-style='word' data-advice='" + $adviceId + "' id='" + dataId + "' data-user=''><p class='js-leader-advice-content' style=''><span>" + $tip + "</span><i class='js-leader-advice-del icon-trash-o'></i><i class='icon-edit js-leader-advice-edit'></i></p><p class='js-leader-advice-last' >" + dataName + "&nbsp;" + commonApi.getCommonTime(resultData.createDttm) + "</p></div>");
            window.top.updateAddInfor($adviceIdLast);
            window.top.layer.msg($tip);
            $this.hide();
        });
    });

//秘书处同意
    $(document).on("click", ".js-bill-agree", function (event) {
        event.stopPropagation();
        var $this = $(this),
            $adviceType = $this.closest("td").data("type"),
            $adviceId = "advice" + new Date().getTime(),
            $inputChoice = $this.closest(".js-choice-input"),
            $agreeType = $this.data("type"); //0 为同意，1为撤销

        if ($agreeType == "0") {

            var contentData = [];
            contentData.push({
                "adviceType": $adviceType,
                "adviceId": $adviceId,
                "adviceContent": ""
            });
            var wfId = window.top.$urlParam("wfId");
            var surl = window.top.project + "/admin/documentData/addDocumentAdvice.action";
            $.post(surl, {
                "wfId": wfId,
                contentData: JSON.stringify(contentData),
                "commonAdvice.content": "",
                "commonAdvice.wfName": window.top.$urlParam("wfName"),
                "accountName": (window.top.globalParams.loginName)

            }, function (result) {


                var resultData = result.datas[0];
                var adviceId = resultData.adviceId,
                    createBy = resultData.createBy,
                    id = resultData.id,
                    userName = resultData.userName;


                if (window.top.globalParams.djsn == "oa_pg_incoming_form") {

                    var $leaderAdvice = $inputChoice.find(".js-leader-advice");
                    if ($leaderAdvice.length) {

                        $leaderAdvice.each(function (index) {
                            var $this = $(this);
                            if (index == ($leaderAdvice.length - 1)) {
                                var $name = $this.find(".js-leader-advice-last").html().split("&nbsp;")[0];

                                var $time = commonApi.getCommonTime(resultData.createDttm)

                                $this.find(".js-leader-advice-last").html($name + "&nbsp;" + $time);

                            }
                        });

                    }

                }

                var isHide="";
                if(window.top.globalParams.djsn=="oa_pg_incoming_form"||window.top.globalParams.djsn=="oa_send_document"){

                }else {
                    isHide="style='display:none;'";
                }

                var $html = "<div class='js-leader-advice' data-advice='" + $adviceId + "' id='" + id + "'  data-user=''><p class='js-leader-advice-content' "+isHide+"><span></span><i class='js-leader-advice-del icon-trash-o'></i><i class='icon-edit js-leader-advice-edit'></i></p><p class='js-leader-advice-last' style='text-align:right;'>" + userName + "&nbsp;" + commonApi.getCommonTime(resultData.createDttm) + "</p></div>";
                $inputChoice.append($html);
                $this.data("type", "1");
                $this.text("撤销");
            });
        }
        //撤销
        else {
            var $lastAdvice = $inputChoice.find(".js-leader-advice").last();
            var $id = $lastAdvice.attr("id");
            var delSurl = billUrl + "/admin/documentData/delDocumentAdvice.action";
            $.post(delSurl, {
                'id': $id,
                "commonAdvice.content": "",
                "commonAdvice.wfName": window.top.$urlParam("wfName"),
                "accountName": (window.top.globalParams.loginName)
            }, function (data) {
                if (data.result == "success") {
                    window.parent.layer.msg("撤销成功");
                    $lastAdvice.remove();
                    $this.text("同意");
                    $this.data("type", "0");
                }
                else {
                    window.parent.layer.msg("撤销失败");
                }

            });


        }

    });


//秘书处撤销
    $(document).on("click", ".js-bill-cancel", function (event) {
        event.stopPropagation();
        var $this = $(this),
            $advice = $this.closest(".js-leader-advice");
        var $id = $advice.attr("id");
        var surl = billUrl + "/admin/documentData/delDocumentAdvice.action";
        if ($id.length > 1) {
            $.post(surl, {
                'id': $id,
                "accountName": (window.top.globalParams.loginName)
            }, function (data) {
                if (data.result == "success") {
                    window.parent.layer.msg("撤销成功");
                    $advice.remove();
                }
                else {
                    window.parent.layer.msg("撤销失败");
                }

            });
        }

    });

    //获取文号

    $(document).on("click", ".js-bill-load-file-number .js-get-file-num", function () {

        var $this = $(this);
        billGlobal.syncFileNum($this, 1);
    });

    //获取规范性文件编号

     $(document).on("click", ".js-normative-file-num", function () {
        billGlobal.getNormativeFileNum();
       
    });

    $(document).on("click",".js-edit-name",function () {

        var $sendWord=parent.$("#send_word"),
            $sendWordPre=$sendWord.val(),
            $num=$(".js-oa-bill-title-name"),
            $fileNumBot=$("#file_num_no_bot"),
            $fileNumBotPre=$fileNumBot.text().split("〔")[1],
            $fileNum=parent.$("#DOCUMENT_NO");

        var html='<div  style="text-align: center;margin-top: 20px;"><select style="display: inline-block;width: 200px;" id="edit_name_select" ></select></div>';
        window.top.layer.open({
            content:html,
            btn:['确认','取消'],
            yes:function () {
                var value=parent.$("#edit_name_select option:selected").text(),
                    $billId=parent.$("#edit_name_select").val();
                var newUrl=window.top.project+"/admin/documentBill/updateWfBill.action?wfId="+window.top.globalParams.wfid+"&billId="+$billId;
                $.post(newUrl,function (data) {
                    parent.$("#billId").val($billId);
                    $sendWord.val(value);
                    $num.text(value);
                    $fileNumBot.text(value+"〔"+$fileNumBotPre);
                    $fileNum.val($fileNumBot.text());
                    window.top.layer.closeAll();
                    window.top.editSendWord();
                });
            },
            cancel:function () {

            },
            type:1,
            title:'发文代字',
            area:['300px','200px'],
            success:function () {
                var url=window.top.project+"/admin/documentBill/getBillList.action?etc="+new Date().getTime()+"&wf_id=" + window.top.globalParams.wfid;
                $.getJSON(url,function (data) {
                    var htmlData=[];
                    data.datas.forEach(function (value) {
                        if($sendWordPre==value.bill_name){
                            htmlData.push("<option selected='selected' value='"+value.id+"'>"+value.bill_name+"</option>");
                        }else {
                            htmlData.push("<option value='"+value.id+"'>"+value.bill_name+"</option>");
                        }

                    });
                    parent.$("#edit_name_select").html(htmlData.join(""));
                });
            }
        });


        // window.top.layer.prompt(
        //     {
        //         value:$sendWordPre,
        //         title:'发文代字'
        //     },
        //     function(value, index, elem){
        //
        //     $sendWord.val(value);
        //     $num.text(value);
        //     $fileNumBot.text(value+"〔"+$fileNumBotPre);
        //     $fileNum.val($fileNumBot.text());
        //     window.top.layer.close(index);
        // });

    })


    //选择弹出层
    $(document).on("click", ".js-oa-bill-choice", function () {

        jsBillInput = null;
        var $this = $(this),
            $type = $this.closest("td").data("type"),
            $input = $this.closest(".js-oa-bill-choice-father").find(".td-text-area");
        jsBillInput = $input;

        //type类型为主办单位和领导
        if ($type == "company" || $type == "leader") {

            var $td = $this.closest("td");
            var $choiceFather = $this.closest(".js-oa-bill-choice-father");
            var $typeCc = ($type == "company") ? 0 : 1;

            // 0为编辑,1为增加
            var typeStyle = ($(".js-going-advice-td").find(".js-leader-advice").length > 0) ? "0" : '1';

            window.top.leaderCompany($typeCc, $input, typeStyle);

        }


        //抄送类型
        else if ($type == "cc") {
            var $dash = parent.$("#sel_dropdownlist29").find("option:selected").text();
            var $td = $this.closest("td");
            var $choiceFather = $this.closest(".js-oa-bill-choice-father");
            var $typeCc = $td.find(".js-oa-bill-choice-father").index($choiceFather);
            var isLeaderCc = "";


            if ($typeCc == 1 && $dash == "阅件") {
                isLeaderCc = "leader";
            }
            window.top.leaderCompanyCc($typeCc, $input, isLeaderCc);

        }

        //阅件抄送单位
        else if ($type == "read-cc") {
            var $dash = parent.$("#sel_dropdownlist29").find("option:selected").text();
            var $td = $this.closest("td");
            var $choiceFather = $this.closest(".js-oa-bill-choice-father");

            var $typeCc = 1;
            var isLeaderCc = "";

            if ($typeCc == 1 && $dash == "阅件") {
                isLeaderCc = "leader";
            }

            window.top.leaderCompanyCc($typeCc, $input, isLeaderCc);
        }


        //主送类型
        else if ($type == "mc") {
            var $td = $this.closest("td");
            var $choiceFather = $this.closest(".js-oa-bill-choice-father");
            var $typeCc = 1;
            window.top.leaderCompanyCc($typeCc, $input);
        }
        else if ($type == "leadercc") {
            var $typeCc = 1;
            window.top.leaderCompanyCc($typeCc, $input);
        }
        else if ($type == "meetingCompany") {
            var $typeCc = 1;
            window.top.leaderCompanyCc($typeCc, $input);
        }


    });

    //领导批示环节 处长同意
    $(document).on("click", ".js-leader-document-agree", function (event) {

        event.stopPropagation();
        var $this = $(this),
            $fatherInput = $this.closest(".js-choice-input"),
            $jsLeaderAdvice = $fatherInput.find(".js-leader-advice").eq(0),
            $time = $jsLeaderAdvice.data("time");

        $this.prop("disabled", true);

        var surl = window.top.project + "/admin/documentData/editDocumentAdvice.action?" + (new Date().getTime());
        var content = $jsLeaderAdvice.find(".js-leader-advice-content").find("span").text();
        $.post(surl, {
            'id': $jsLeaderAdvice.attr("id"),
            'adviceContent': content,
            "wfName": window.top.$urlParam("wfName"),
            "commonAdvice.content": content,
            "commonAdvice.wfName": window.top.$urlParam("wfName"),
            "accountName": (window.top.globalParams.loginName)

        }, function (data) {
            if (data.result == "success") {
                window.parent.layer.msg(data.message);

                $fatherInput.find('.js-leader-advice-last').html(window.top.globalParams.loginChineseName + "&nbsp;" + $time);
                $this.hide();
            }
            else {
                window.parent.layer.msg("修改失败");
            }

        });

    });


//radio选择

    $(document).on("click", ".js-bill-checkbox-box .js-radio-check", function () {
        var $this = $(this);
        var $val;
        var $input = $this.closest(".js-bill-checkbox-box").find("input");
        $this.siblings(".js-radio-check").find("i").removeClass("icon-check-square");
        $this.find("i").addClass("icon-check-square");
        $val = $this.find("i").data("value");
        $input.val($val);
        parent.$("#" + $input.attr("id")).val($val);


    })

});


function inputChange() {
    var $html = (($("#other").val()).toString()).replace(/([^\u0000-\u00FF])/g, "");
    parent.$("#START_DATE").val($html);
}


function addZero(str) {
    var $num = parseInt(str);
    if ($num < 10) {
        $num = "0" + $num;
    }
    return $num;
}






