//// jatools

function doPrint(paper) {

    var page1 = document.getElementById("page1");
    if (!page1) {

        print();
        return;
    }

    var addOb = ' <OBJECT  ID="jatoolsPrinter" CLASSID="CLSID:B43D3361-D075-4BE2-87FE-057188254255" codebase="jatoolsPrinter.cab#version=8,6,0,0"></OBJECT>';

    var oDiv = document.createElement("div");
    oDiv.innerHTML = addOb;
    document.body.appendChild(oDiv);



    var myDoc = {
        settings: {
            paperName: paper, topMargin: 50, leftMargin: 10,
            bottomMargin: 30,
            rightMargin: 100
        },
        documents: document,
        copyrights: '杰创软件拥有版权  www.jatools.com'
    };
    document.getElementById("jatoolsPrinter").printPreview(myDoc);   // 打印预览
}

// lodop

function print_full_lodop() {

    var isprint = getQueryString("print");

    if (isprint) {

        LODOP = getLodop();
        LODOP.PRINT_INIT("打印控件功能演示_Lodop功能_全页");
        LODOP.SET_PRINT_PAGESIZE(0, 0, 0, "A4");
        LODOP.ADD_PRINT_HTM(0, 0, "100%", "100%", document.documentElement.innerHTML);
        LODOP.PREVIEW();
    }

};


var CreatedOKLodop7766 = null;

function getLodop(oOBJECT, oEMBED) {
    /**************************
     本函数根据浏览器类型决定采用哪个页面元素作为Lodop对象：
     IE系列、IE内核系列的浏览器采用oOBJECT，
     其它浏览器(Firefox系列、Chrome系列、Opera系列、Safari系列等)采用oEMBED,
     如果页面没有相关对象元素，则新建一个或使用上次那个,避免重复生成。
     64位浏览器指向64位的安装程序install_lodop64.exe。
     **************************/
    var strHtmInstall = "<br><font color='#FF00FF'>打印控件未安装!点击这里<a href='install_lodop32.exe' target='_self'>执行安装</a>,安装后请刷新页面或重新进入。</font>";
    var strHtmUpdate = "<br><font color='#FF00FF'>打印控件需要升级!点击这里<a href='install_lodop32.exe' target='_self'>执行升级</a>,升级后请重新进入。</font>";
    var strHtm64_Install = "<br><font color='#FF00FF'>打印控件未安装!点击这里<a href='install_lodop64.exe' target='_self'>执行安装</a>,安装后请刷新页面或重新进入。</font>";
    var strHtm64_Update = "<br><font color='#FF00FF'>打印控件需要升级!点击这里<a href='install_lodop64.exe' target='_self'>执行升级</a>,升级后请重新进入。</font>";
    var strHtmFireFox = "<br><br><font color='#FF00FF'>（注意：如曾安装过Lodop旧版附件npActiveXPLugin,请在【工具】->【附加组件】->【扩展】中先卸它）</font>";
    var strHtmChrome = "<br><br><font color='#FF00FF'>(如果此前正常，仅因浏览器升级或重安装而出问题，需重新执行以上安装）</font>";
    var LODOP;
    try {
        //=====判断浏览器类型:===============
        var isIE = (navigator.userAgent.indexOf('MSIE') >= 0) || (navigator.userAgent.indexOf('Trident') >= 0);
        var is64IE = isIE && (navigator.userAgent.indexOf('x64') >= 0);
        //=====如果页面有Lodop就直接使用，没有则新建:==========
        if (oOBJECT != undefined || oEMBED != undefined) {
            if (isIE)
                LODOP = oOBJECT;
            else
                LODOP = oEMBED;
        } else {
            if (CreatedOKLodop7766 == null) {
                LODOP = document.createElement("object");
                LODOP.setAttribute("width", 0);
                LODOP.setAttribute("height", 0);
                LODOP.setAttribute("style", "position:absolute;left:0px;top:-100px;width:0px;height:0px;");
                if (isIE) LODOP.setAttribute("classid", "clsid:2105C259-1E0C-4534-8141-A753534CB4CA");
                else LODOP.setAttribute("type", "application/x-print-lodop");
                document.documentElement.appendChild(LODOP);
                CreatedOKLodop7766 = LODOP;
            } else
                LODOP = CreatedOKLodop7766;
        }
        ;
        //=====判断Lodop插件是否安装过，没有安装或版本过低就提示下载安装:==========
        if ((LODOP == null) || (typeof(LODOP.VERSION) == "undefined")) {
            if (navigator.userAgent.indexOf('Chrome') >= 0)
                document.documentElement.innerHTML = strHtmChrome + document.documentElement.innerHTML;
            if (navigator.userAgent.indexOf('Firefox') >= 0)
                document.documentElement.innerHTML = strHtmFireFox + document.documentElement.innerHTML;
            if (is64IE) document.write(strHtm64_Install); else if (isIE)   document.write(strHtmInstall); else
                document.documentElement.innerHTML = strHtmInstall + document.documentElement.innerHTML;
            return LODOP;
        } else if (LODOP.VERSION < "6.1.9.8") {
            if (is64IE) document.write(strHtm64_Update); else if (isIE) document.write(strHtmUpdate); else
                document.documentElement.innerHTML = strHtmUpdate + document.documentElement.innerHTML;
            return LODOP;
        }
        ;
        //=====如下空白位置适合调用统一功能(如注册码、语言选择等):====


        //============================================================
        return LODOP;
    } catch (err) {
        if (is64IE)
            document.documentElement.innerHTML = "Error:" + strHtm64_Install + document.documentElement.innerHTML; else
            document.documentElement.innerHTML = "Error:" + strHtmInstall + document.documentElement.innerHTML;
        return LODOP;
    }
    ;
}


function getLodopBefore(oOBJECT, oEMBED) {
    /**************************
     本函数根据浏览器类型决定采用哪个页面元素作为Lodop对象：
     IE系列、IE内核系列的浏览器采用oOBJECT，
     其它浏览器(Firefox系列、Chrome系列、Opera系列、Safari系列等)采用oEMBED,
     如果页面没有相关对象元素，则新建一个或使用上次那个,避免重复生成。
     64位浏览器指向64位的安装程序install_lodop64.exe。
     **************************/
    var strHtmInstall = "<br><font color='#FF00FF'>打印控件未安装!点击这里<a href='../../Lodop6.198.zip' target='_self'>执行安装</a>,安装后请刷新页面或重新进入。</font>";
    var strHtmUpdate = "<br><font color='#FF00FF'>打印控件需要升级!点击这里<a href='../../Lodop6.198.zip' target='_self'>执行升级</a>,升级后请重新进入。</font>";
    var strHtm64_Install = "<br><font color='#FF00FF'>打印控件未安装!点击这里<a href='../../Lodop6.198.zip' target='_self'>执行安装</a>,安装后请刷新页面或重新进入。</font>";
    var strHtm64_Update = "<br><font color='#FF00FF'>打印控件需要升级!点击这里<a href='../../Lodop6.198.zip' target='_self'>执行升级</a>,升级后请重新进入。</font>";
    var strHtmFireFox = "<br><br><font color='#FF00FF'>（注意：如曾安装过Lodop旧版附件npActiveXPLugin,请在【工具】->【附加组件】->【扩展】中先卸它）</font>";
    var strHtmChrome = "<br><br><font color='#FF00FF'>(如果此前正常，仅因浏览器升级或重安装而出问题，需重新执行以上安装）</font>";
    var LODOP;
    try {
        //=====判断浏览器类型:===============
        var isIE = (navigator.userAgent.indexOf('MSIE') >= 0) || (navigator.userAgent.indexOf('Trident') >= 0);
        var is64IE = isIE && (navigator.userAgent.indexOf('x64') >= 0);
        //=====如果页面有Lodop就直接使用，没有则新建:==========
        if (oOBJECT != undefined || oEMBED != undefined) {
            if (isIE)
                LODOP = oOBJECT;
            else
                LODOP = oEMBED;
        } else {
            if (CreatedOKLodop7766 == null) {
                LODOP = document.createElement("object");
                LODOP.setAttribute("width", 0);
                LODOP.setAttribute("height", 0);
                LODOP.setAttribute("style", "position:absolute;left:0px;top:-100px;width:0px;height:0px;");
                if (isIE) LODOP.setAttribute("classid", "clsid:2105C259-1E0C-4534-8141-A753534CB4CA");
                else LODOP.setAttribute("type", "application/x-print-lodop");
                document.documentElement.appendChild(LODOP);
                CreatedOKLodop7766 = LODOP;
            } else
                LODOP = CreatedOKLodop7766;
        }
        ;
        //=====判断Lodop插件是否安装过，没有安装或版本过低就提示下载安装:==========
        if ((LODOP == null) || (typeof(LODOP.VERSION) == "undefined")) {
            if (navigator.userAgent.indexOf('Chrome') >= 0)
                document.documentElement.innerHTML = strHtmChrome + document.documentElement.innerHTML;
            if (navigator.userAgent.indexOf('Firefox') >= 0)
                document.documentElement.innerHTML = strHtmFireFox + document.documentElement.innerHTML;
            if (is64IE) document.write(strHtm64_Install); else if (isIE)   document.write(strHtmInstall); else
                document.documentElement.innerHTML = strHtmInstall + document.documentElement.innerHTML;
            return LODOP;
        } else if (LODOP.VERSION < "6.1.9.6") {
            if (is64IE) document.write(strHtm64_Update); else if (isIE) document.write(strHtmUpdate); else
                document.documentElement.innerHTML = strHtmUpdate + document.documentElement.innerHTML;
            return LODOP;
        }
        ;
        //=====如下空白位置适合调用统一功能(如注册码、语言选择等):====
        LODOP.SET_LICENSES("", "394101451001069811011355115108", "", "");
        //============================================================
        return LODOP;
    } catch (err) {
        if (is64IE)
            document.documentElement.innerHTML = "Error:" + strHtm64_Install + document.documentElement.innerHTML; else
            document.documentElement.innerHTML = "Error:" + strHtmInstall + document.documentElement.innerHTML;
        return LODOP;
    }

}


(function () {
    var ie = !!(window.attachEvent && !window.opera);
    var wk = /webkit\/(\d+)/i.test(navigator.userAgent) && (RegExp.$1 < 525);
    var fn = [];
    var run = function () {
        for (var i = 0; i < fn.length; i++) fn[i]();
    };
    var d = document;
    d.ready = function (f) {
        if (!ie && !wk && d.addEventListener)
            return d.addEventListener('DOMContentLoaded', f, false);
        if (fn.push(f) > 1) return;
        if (ie)
            (function () {
                try {
                    d.documentElement.doScroll('left');
                    run();
                }
                catch (err) {
                    setTimeout(arguments.callee, 0);
                }
            })();
        else if (wk)
            var t = setInterval(function () {
                if (/^(loaded|complete)$/.test(d.readyState))
                    clearInterval(t), run();
            }, 0);
    };
})();


function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

//var jsBillInput;
//办理单公用的js文件
$(window).load(function () {

    print_full_lodop();

//
//
//    $("input").blur(function () {
//        var $this=$(this);
//        var id = $(this).attr("id");
//        parent.$("#" + id).val($(this).val());
//        //会议时间需要单独配置,other取，START_DATE保存
//        if(id=="other"){
//            var totalHtml=$(this).val().split("月")[0].split("年");
//            var totalHtmlSec=totalHtml[0]+"-"+totalHtml[1];
//            parent.$("#START_DATE").val(totalHtmlSec+"-01");
//        }
//        //办理期限
//        else if(id=="deal_limit"){
//            var parentId;
//            var djsn=window.top.globalParams.djsn;
//            //收文
//            if(djsn=="oa_pg_incoming_form"){
//                parentId="text32";
//            }
//            //发文
//            else if(djsn=="oa_send_document"){
//                parentId="SECRET_TIME";
//            }
//            //领导
//            else if(djsn=="oa_leader_instruction_form"){
//
//                parentId="need_feedback_time";
//            }
//            //自动计算办理期限时间
//
//          //  parent.$("#"+parentId).val(calNextWeekDay($this.val()));
//           // window.top.layer.msg(calNextWeekDay($this.val()));
//        }
//    });
//    $("textarea").blur(function () {
//
//        var id = $(this).attr("id");
//        var strHTml=$(this).val();
//
//
//       // parent.$("#" + id).val($(this).val());
//        parent.$("#" + id).val(strHTml.replace(/\n/g,"<br>"));
//    });
//    $("select").change(function () {
//        var id = $(this).attr("id");
//        parent.$("#" + id).val($(this).val());
//    });
//
//
//    //下拉选择初始赋值
//    var selectAll = $("select");
//    if (selectAll.length > 0) {
//        selectAll.each(function (index) {
//
//            var $this = $(this);
//            var id = $(this).attr("id");
//            parent.$("#" + id).val($(this).val());
//
//        });
//    }
//    sendDocumentFillAuto();
//    userInfor();
//    getFileNumber();
//    isGoingAdvice();
//   //计算领导批示默认反馈日期
//    oaLeaderLimit();
//
//    //专项事务
//    oaSptrainAudit();
//
//
//    //自动填充日期
//    var dateFill = $('.js-date-fill');
//
//    function autoFillDate(year, month, day) {
//        var myDate = new Date();
//        if (year) {
//            myDate.setFullYear(myDate.getFullYear() + parseInt(year));
//        }
//        if (month) {
//            myDate.setMonth(myDate.getMonth() + parseInt(month));
//        }
//        if (day) {
//            myDate.setDate(myDate.getDate() + parseInt(day));
//        }
//        var month = myDate.getMonth() + 1;
//        var day = myDate.getDate();
//        return myDate.getFullYear() + "-" + ((month + "").length == 1 ? "0" + month : month) + "-" + ((day + "").length == 1 ? "0" + day : day);
//    }
//
//    if (dateFill.length > 0) {
//        dateFill.each(function (i) {
//            var $this = $(this);
//            var id = $(this).attr("id");
//            $(this).val(autoFillDate());
//        });
//    }
//    //输入弹出层
//
//    billInformation();
//
//    $(document).on("click", ".js-choice-input", function () {
//        var $this = $(this),
//            title = $this.closest("tr").find("td").eq(0).text(),
//            $td = $this.closest("td"),
//            $goingAdvice = $this.find(".js-leader-advice");
//        var parent = window;
//
//
//        if ($td.hasClass("js-going-advice-td") && ($goingAdvice.length > 0)) {
//
//            window.top.layer.msg("拟办意见只能为一条");
//
//            return;
//        }
//
//        //已核
//        else if($td.hasClass("js-advice-only-one")&& ($goingAdvice.length > 0)){
//            window.top.layer.msg("已核意见只能为一条");
//            return;
//        }
//
//        window.top.inputAdvice(title, parent, $this, "", 1,0,"");
//
//    });
//
//    //编辑
//    $(document).on("click", ".js-leader-advice-edit", function (event) {
//        event.stopPropagation();
//        var $this = $(this),
//            title = $this.closest("tr").find("td").eq(0).text();
//        var obj = $this.closest('.js-leader-advice');
//        var parent = window;
//        var content = obj.find(".js-leader-advice-content span").html();
//
//        var isImg=$this.closest(".js-leader-advice-content").find("img").length;
//        var fileName=$this.closest(".js-leader-advice-content").find("span").text();
//
//        window.top.inputAdvice(title, parent, obj, content, 2,isImg,fileName);
//
//    });
//    //删除
//    $(document).on("click", ".js-leader-advice-del", function (event) {
//        event.stopPropagation();
//        var $this = $(this),
//            $advice = $this.closest(".js-leader-advice");
//        var $id = $advice.attr("id"),
//            $td=$this.closest("td");
//        var surl = billUrl + "/admin/documentData/delDocumentAdvice.action";
//        if ($id.length > 1) {
//            $.post(surl, {
//                'id': $id,
//                "accountName":(window.top.globalParams.loginName)
//            }, function (data) {
//                if (data.result == "success") {
//                    window.parent.layer.msg(data.message);
//                    $advice.remove();
//                    //发文已核状态
//                    if($td.hasClass("js-advice-only-one")){
//                        $td.find(".js-already-check").show();
//                    }
//                }
//                else {
//                    window.parent.layer.msg("删除失败");
//                }
//
//            });
//        } else {
//            $advice.remove();
//            window.parent.layer.msg("删除成功");
//        }
//
//        var $choiceInput = $this.closest(".js-choice-input");
//        var $jsLeader = $choiceInput.find(".js-leader-advice");
//        if ($jsLeader.length < 1) {
//            var delDOm = '<span class="td-choice-input-tip" style="color:#000;">点击输入</span>';
//
//            $choiceInput.append(delDOm);
//        }
//
//    });
//
//    //发文已核
//    $(document).on('click',".js-already-check",function(event){
//        event.stopPropagation();
//        var $this=$(this),
//            $td=$this.closest("td"),
//            $adviceType =$td.data("type"),
//            $adviceId = "advice" + new Date().getTime(),
//            $inputChoice =$td.find(".js-choice-input");
//
//        $td.find(".td-choice-input-tip").remove();
//
//        var contentData = [];
//        contentData.push({
//            "adviceType": $adviceType,
//            "adviceId": $adviceId,
//            "adviceContent":"已核"
//
//        });
//        var wfId = window.top.$urlParam("wfId");
//        var surl = window.top.project + "/admin/documentData/addDocumentAdvice.action";
//        $.post(surl, {
//            "wfId": wfId,
//            contentData: JSON.stringify(contentData),
//            "wfName":window.top.$urlParam("wfName"),
//            "commonAdvice.content":"已核",
//            "commonAdvice.wfName":window.top.$urlParam("wfName"),
//            "accountName":(window.top.globalParams.loginName)
//        }, function (data) {
//            var resultData=data.datas[0],
//                dataId=resultData.id,
//                dataName=resultData.userName;
//            $inputChoice.append("<div class='js-leader-advice' data-style='word' data-advice='"+$adviceId+"' id='"+dataId+"' data-user=''><p class='js-leader-advice-content' style=''><span>"+"已核"+"</span><i class='js-leader-advice-del icon-trash-o'></i><i class='icon-edit js-leader-advice-edit'></i></p><p class='js-leader-advice-last' >"+dataName+"&nbsp;"+commonApi.getCommonTime(resultData.createDttm)+"</p></div>");
//            window.top.layer.msg("已核");
//            $this.hide();
//        });
//    });
//
////秘书处同意
//    $(document).on("click", ".js-bill-agree", function (event) {
//        event.stopPropagation();
//        var $this = $(this),
//            $adviceType = $this.closest("td").data("type"),
//            $adviceId = "advice" + new Date().getTime(),
//            $inputChoice = $this.closest(".js-choice-input"),
//            $agreeType = $this.data("type"); //0 为同意，1为撤销
//
//        if ($agreeType == "0") {
//
//            var contentData = [];
//            contentData.push({
//                "adviceType": $adviceType,
//                "adviceId": $adviceId,
//                "adviceContent": ""
//            });
//            var wfId = window.top.$urlParam("wfId");
//            var surl = window.top.project + "/admin/documentData/addDocumentAdvice.action";
//            $.post(surl, {
//                "wfId": wfId,
//                contentData: JSON.stringify(contentData),
//                "commonAdvice.content":"",
//                "commonAdvice.wfName":window.top.$urlParam("wfName"),
//                "accountName":(window.top.globalParams.loginName)
//
//            }, function (result) {
//                var resultData = result.datas[0];
//                var adviceId = resultData.adviceId,
//                    createBy = resultData.createBy,
//                    id = resultData.id,
//                    userName = resultData.userName;
//                var $html = "<div class='js-leader-advice' data-advice='" + $adviceId + "' id='" + id + "'  data-user=''><p class='js-leader-advice-content' style='display:none;'><span></span><i class='js-leader-advice-del icon-trash-o'></i><i class='icon-edit js-leader-advice-edit'></i></p><p class='js-leader-advice-last' style='text-align:right;'>" + userName + "&nbsp;" + commonApi.getCommonTime(resultData.createDttm)+ "</p></div>";
//                $inputChoice.append($html);
//                $this.data("type","1");
//                $this.text("撤销");
//            });
//        }
//        //撤销
//        else{
//            var $lastAdvice=$inputChoice.find(".js-leader-advice").last();
//            var $id=$lastAdvice.attr("id");
//            var delSurl = billUrl + "/admin/documentData/delDocumentAdvice.action";
//            $.post(delSurl, {
//                'id': $id,
//                "commonAdvice.content":"",
//                "commonAdvice.wfName":window.top.$urlParam("wfName"),
//                "accountName":(window.top.globalParams.loginName)
//            }, function (data) {
//                if (data.result == "success") {
//                    window.parent.layer.msg("撤销成功");
//                    $lastAdvice.remove();
//                    $this.text("同意");
//                    $this.data("type","0");
//                }
//                else {
//                    window.parent.layer.msg("撤销失败");
//                }
//
//            });
//
//
//        }
//
//    });
//
//
////秘书处撤销
//    $(document).on("click", ".js-bill-cancel", function (event) {
//        event.stopPropagation();
//        var $this = $(this),
//            $advice = $this.closest(".js-leader-advice");
//        var $id = $advice.attr("id");
//        var surl = billUrl + "/admin/documentData/delDocumentAdvice.action";
//        if ($id.length > 1) {
//            $.post(surl, {
//                'id': $id,
//                "accountName":(window.top.globalParams.loginName)
//            }, function (data) {
//                if (data.result == "success") {
//                    window.parent.layer.msg("撤销成功");
//                    $advice.remove();
//                }
//                else {
//                    window.parent.layer.msg("撤销失败");
//                }
//
//            });
//        }
//
//    });
//
//    //获取文号
//
//    $(document).on("click", ".js-bill-load-file-number button", function () {
//        var $dash = parent.$("#sel_dropdownlist29").find("option:selected").text();
//        var fileUrl = billUrl + "/admin/documentFileNumber/createFileNumber.action";
//        var $this = $(this);
//        var $fileNumer = $this.closest(".file-number-no");
//        var inputTime = $fileNumer.find("input").eq(0);
//        var inputNumber = $fileNumer.find("input").eq(1);
//        $.post(fileUrl, {"swungDash": $dash}, function (data) {
//            if (data.resultFlag = "true") {
//                var message = data.message.split("@@");
//                inputTime.val(message[0]);
//                inputNumber.val(parseInt(message[1]));
//                var text="〔20"+message[0]+"〕"+message[1]+"号";
//
//                parent.$("#DOCUMENT_NO").val($dash+text);
//
//                $(".js-oa-bill-title-name-bot span").html(text);
//
//                $("#file_num_no_bot").html($dash+text);
//            }
//            else {
//                window.top.layer.msg("获取失败");
//            }
//
//        });
//
//    });
//
//
//    //选择弹出层
//    $(document).on("click", ".js-oa-bill-choice", function () {
//
//
//        jsBillInput = null;
//        var $this = $(this),
//            $type = $this.closest("td").data("type"),
//            $input = $this.closest(".js-oa-bill-choice-father").find(".td-text-area");
//        jsBillInput = $input;
//
//        //type类型为主办单位和领导
//        if ($type == "company" || $type == "leader") {
//
//            var $td = $this.closest("td");
//            var $choiceFather = $this.closest(".js-oa-bill-choice-father");
//            var $typeCc =($type=="company")?0:1;
//
//            // 0为编辑,1为增加
//            var typeStyle = ($(".js-going-advice-td").find(".js-leader-advice").length > 0) ? "0" : '1';
//
//            window.top.leaderCompany($typeCc, $input, typeStyle);
//
//        }
//
//
//        //抄送类型
//        else if ($type == "cc") {
//            var $dash = parent.$("#sel_dropdownlist29").find("option:selected").text();
//            var $td = $this.closest("td");
//            var $choiceFather = $this.closest(".js-oa-bill-choice-father");
//            var $typeCc = $td.find(".js-oa-bill-choice-father").index($choiceFather);
//            var isLeaderCc="";
//
//
//            if($typeCc==1&&$dash=="阅件"){
//                isLeaderCc="leader";
//            }
//            window.top.leaderCompanyCc($typeCc, $input,isLeaderCc);
//
//        }
//
//        //阅件抄送单位
//        else if($type == "read-cc"){
//            var $dash = parent.$("#sel_dropdownlist29").find("option:selected").text();
//            var $td = $this.closest("td");
//            var $choiceFather = $this.closest(".js-oa-bill-choice-father");
//
//            var $typeCc = 1;
//            var isLeaderCc="";
//
//            if($typeCc==1&&$dash=="阅件"){
//                isLeaderCc="leader";
//            }
//
//            window.top.leaderCompanyCc($typeCc, $input,isLeaderCc);
//        }
//
//
//        //主送类型
//        else if ($type == "mc") {
//            var $td = $this.closest("td");
//            var $choiceFather = $this.closest(".js-oa-bill-choice-father");
//            var $typeCc =1;
//            window.top.leaderCompanyCc($typeCc, $input);
//        }
//        else if($type == "leadercc"){
//            var $typeCc =1;
//            window.top.leaderCompanyCc($typeCc, $input);
//        }
//        else if($type == "meetingCompany"){
//            var $typeCc =1;
//            window.top.leaderCompanyCc($typeCc, $input);
//        }
//
//
//    });
//
//    //领导批示环节 处长同意
//    $(document).on("click",".js-leader-document-agree",function(event){
//
//        event.stopPropagation();
//        var $this=$(this),
//            $fatherInput=$this.closest(".js-choice-input"),
//            $jsLeaderAdvice=$fatherInput.find(".js-leader-advice").eq(0),
//            $time=$jsLeaderAdvice.data("time");
//
//        $this.prop("disabled",true);
//
//     var surl=window.top.project + "/admin/documentData/editDocumentAdvice.action?" + (new Date().getTime());
//        var content=$jsLeaderAdvice.find(".js-leader-advice-content").find("span").text();
//        $.post(surl, {
//            'id': $jsLeaderAdvice.attr("id"),
//            'adviceContent':content,
//            "wfName":window.top.$urlParam("wfName"),
//            "commonAdvice.content":content,
//            "commonAdvice.wfName":window.top.$urlParam("wfName"),
//            "accountName":(window.top.globalParams.loginName)
//
//        }, function (data) {
//            if (data.result == "success") {
//                window.parent.layer.msg(data.message);
//              //  obj.find('.js-leader-advice-content span').html($con);
//
//                $fatherInput.find('.js-leader-advice-last').html(window.top.globalParams.loginChineseName+"&nbsp;"+$time);
//                $this.hide();
//            }
//            else {
//                window.parent.layer.msg("修改失败");
//            }
//
//        });
//
//    });
//
//
////radio选择
//
//    $(document).on("click", ".js-bill-checkbox-box .js-radio-check", function () {
//        var $this = $(this);
//        var $val;
//        var $input = $this.closest(".js-bill-checkbox-box").find("input");
//        $this.siblings(".js-radio-check").find("i").removeClass("icon-check-square");
//        $this.find("i").addClass("icon-check-square");
//        $val = $this.find("i").data("value");
//
//        //领导批示是否需要反馈
//        if(parseInt($val)<1&&(window.top.globalParams.djsn=="oa_leader_instruction_form")){
//
//            $("#need_feedback_time").val("");
//
//
//        }
//        else if(parseInt($val)==1&&(window.top.globalParams.djsn=="oa_leader_instruction_form")){
//            calWeekDay();
//        }
//
//        $input.val($val);
//        //绑定定基本信息的数据集
//        var id = $input.attr("id");
//        parent.$("#" + id).val($val);
//    })

});

//
//function inputChange(){
//    var $html=(($("#other").val()).toString()).replace(/([^\u0000-\u00FF])/g,"");
//    parent.$("#START_DATE").val($html);
//}
//
//function billInformation() {
//    var date = new Date();
//    $(".js-send-year").val(date.getFullYear());
//    $(".js-send-month").val(commonApi.addZero(date.getMonth() + 1));
//    $(".js-send-day").val(commonApi.addZero(date.getDate()));
//
//}
////联系人电话，初始赋值
//function userInfor(){
//    var $userName = $(".js-bill-contacts");
//    var $userPhone = $(".js-bill-phone");
//
//    var billType = window.top.$urlParam("djsn");
//    //收文流程不需要自动填充
//    if (billType != "oa_pg_incoming_form") {
//
//        if ($userName.length > 0) {
//            if ($userName.val().length < 1) {
//                $userName.val(userName);
//                var $nameId = $userName.attr("id");
//                parent.$("#" + $nameId).val(userName);
//            }
//        }
//        if ($userPhone.length > 0) {
//            if ($userPhone.val().length < 1) {
//                $userPhone.val(usercellphoneNumber);
//                var $phoneId = $userName.attr("id");
//                parent.$("#" + $phoneId).val(usercellphoneNumber);
//            }
//
//        }
//    }
//
//
//    //发文主办处室
//    if(billType=="oa_send_document"){
//
//        if( $("#DRAFT_DEPT").val().length<1){
//            $("#DRAFT_DEPT").val(sendOrgName);
//            parent.$("#DRAFT_DEPT").val(sendOrgName);
//        }
//
//    }
//
//}
//
//function getFileNumber() {
//
//    var billType=window.top.$urlParam("djsn");
//
////发文的获取文号
//    if(billType=="oa_send_document"){
//        var $nodeName=window.top.$urlParam("nodeName");
//
//
//
//        if($nodeName=="createFileNo"){
//            $(".file-number-no").show();
//            $(".js-file-number-has").hide();
//        }
//        else{
//            if(fileNumber.length>2){
//                $(".js-file-number-has,.js-oa-bill-title-name-bot").show();
//                return;
//            }
//
//            var $dash = parent.$("#sel_dropdownlist29").find("option:selected").text();
//            var text="〔20〕号";
//            var strHtml=$dash+text;
//            $(".file-number-no").hide();
//            $(".js-file-number-has,.js-oa-bill-title-name-bot").show().html("<span>"+strHtml+"</span>");
//
//            parent.$("#DOCUMENT_NO").val(strHtml);
//
//        }
//
//    }
//}
//
//function isGoingAdvice() {
//
//    var $area = window.top.$urlParam("area");
//    if ($area == "msc") {
//        $(".js-going-advice").addClass("going-advice-show");
//        $(".going-advice").show();
//    }
//
//}
//
//
////发文拟稿的浙政发和浙政办发,主送和抄送自动填充
//function sendDocumentFillAuto(){
//        var $djsn=window.top.globalParams.djsn;
//    var mainText="",
//        ccText="";
//
//    if($djsn=="oa_send_document"){
//        var beforeMain=$("#main_unit").val();
//        var beforeCopy=$("#copy_unit").val();
//
//        if(billFileType=="浙政发"||billFileType=="浙政办发"){
//            mainText="各市、县（市、区）人民政府，省政府直属各单位。";
//            ccText="省委各部门，省人大常委会、省政协办公厅，省军区，省法院，省检察院。";
//            if(beforeMain.length<1){
//                $("#main_unit").val(mainText);
//            }
//            if(beforeCopy.length<1){
//                $("#copy_unit").val(ccText);
//            }
//
//        }
//
//    }
//}
//
//
//function addZero(str){
//  var $num=parseInt(str);
//    if($num<10){
//        $num="0"+$num;
//    }
//    return $num;
//}
//
//function oaLeaderLimit(){
//    var billType=window.top.$urlParam("djsn");
//    var wfName=window.top.$urlParam("wfName");
//    var nodeName=window.top.$urlParam("nodeName");
//
//    //审批意见 同意按钮出现
//    if(billType=="oa_leader_instruction_form"&&nodeName=="secretariat_deputy_director"){
//
//        $(".js-approval-advice .js-leader-document-agree,.js-approval-advice .js-leader-advice-edit,.js-approval-advice .js-leader-advice-del").show();
//
//    }
//
//    if(billType=="oa_leader_instruction_form"&&wfName=="oa_leader_instruction"){
//        calWeekDay();
//    }
//}
//
//function calWeekDay(){
//    //默认的15天时间，相隔的周末数量为6
//    var limitDay=15;
//    var now=new Date();
//    var limitDate=new Date(now.getTime()+21*1000*60*60*24);
//    var totoalDate=limitDate.getFullYear()+"-"+addZero(limitDate.getMonth()+1)+"-"+addZero(limitDate.getDate());
//
//    $("#need_feedback_time").val(totoalDate);
//    parent.$("#need_feedback_time").val(totoalDate);
//}
//
//
//
////转向事务处理
//
//
//function oaSptrainAudit(){
//
//    var $djsn=window.top.$urlParam("djsn");
//    if($djsn=="oa_sptrain_audit"){
//
//        //申请人
//        var applyMan=window.top.globalParams.loginChineseName;
//        var draftDept=sendOrgName;
//
//        //电话号码
//        if(usercellphoneNumber.length>1){
//            applyMan+="("+usercellphoneNumber+")";
//        }
//
//        if($("#applicant_man").val().length<1){
//            $("#applicant_man").val(applyMan);
//            parent.$("#applicant_man").val(applyMan);
//        }
//
//        if($("#draft_dept").val().length<1){
//            $("#draft_dept").val(draftDept);
//            parent.$("#draft_dept").val(draftDept);
//        }
//
//
//
//
//    }
//
//}



