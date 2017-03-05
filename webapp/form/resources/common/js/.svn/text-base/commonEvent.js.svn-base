/**
 * Author: 邹志强
 * Date: 2013-05-20 18:49:38
 */
var isWorkflow = false;
var wfUserType = '';
var wfPubParam = '';
var _saveValidResult = true;
/**
 *按钮的常用点击事件
 *@date 2013-05-17 17:27:13
 **/
function $eform(sKey) {

    switch (sKey) {
        case "提交数据" :
            return doSubmitData();
            break;
        case "提交数据成功后提示" :
            var sErr = doSubmitData(function () {

                layer.msg("提交数据成功!");
            });
            if (IsSpace(sErr) == false) $.dialog.tips(sErr);
            break;
        case "提交数据成功后退出" :
            var sErr = doSubmitData(function () {
                CloseBill();
            });
            if (IsSpace(sErr) == false) $.dialog.tips(sErr);
            break;
        case "提交数据成功后新增" :
            var sErr = doSubmitData(function () {
                layer.msg("提交数据成功!");
                if (oEbiao != null)  new Eapi.EformEbiao().run(oEbiao);
                oDsMain.Append();
            });
            if (IsSpace(sErr) == false) $.dialog.tips(sErr);
            break;

        case "提交数据成功后刷新上一窗口" :
            doSubmitData(function () {
                layer.msg("提交数据成功!");
                window.setTimeout(function () {
                    try {
                        if(ParentIframe.SimpleSearch){
                            ParentIframe.SimpleSearch();
                        }
                        window.top.closeWin('workFlow');
                    } catch (e) {

                    }
                }, 300);
            });
            break;

        case "关闭窗口" :
            CloseBill();
            break;

        case "只保存业务数据":
            wftools_tempSave();
            break;
        case "提交业务数据并执行流程":
            wftools_save();
            break;
        case "提交业务和流程后转下一步":
            wftools_save(1);
            break;
        case "提交业务和流程后关闭窗口":
            wftools_save(function () {
                window.setTimeout(function () {
                    try {
                        if(ParentIframe.SimpleSearch){
                            ParentIframe.SimpleSearch();
                        }
                        window.top.closeWin('workFlow');
                    } catch (e) {

                    }


                }, 300);
            });
            break;
        case "提交业务和流程后无":
            wftools_save(3);
            break;
        case "只执行流程的动作":
            wftools_flowSave();
            break;
        case "只执行流程的动作后转下一步":
            wftools_flowSave(1);
            break;
        case "只执行流程的动作后关闭窗口":
            wftools_flowSave(2);
            break;
        case "只执行流程的动作后无操作":
            wftools_flowSave(3);
            break;
        case "流程的轨迹图":
            wftools_trace();
            break;
        case "挂起流程实例":
            wftools_suspended();
            break;
        case "终止流程实例":
            wftools_killed();
            break;

    }
}


/**
 * 保存数据
 * @param {function=}callBack
 * 2016-1-13
 */

function doSubmitDataOa(callBack) {


    _saveValidResult = true;        //初始化 验证结果为true
    var xml = '';                  //提交的 xml
    //for (var dli = 0; dli < datastoreList.length; dli++) { //遍历页面绑定了dataset 字段的控件
    //var dataStore = datastoreList[dli];                             // datasetID
    var dataStore = "dataset2";
    var submitType = $('#' + dataStore).attr('submittype');

    //if (submitType == 4) continue;        //dataset 的提交类型为 不提交 就跳过；
    if (submitType == 1) {                //dataset 的提交类型为 智能提交变动过的记录；
        var res = _smartSubmitOa(dataStore);
        if (res == false) return;
        xml += res;
    } else if (submitType == 2) {                //dataset 的提交类型为 只提交当前的一条记录；
        var res = _onlyNowSubmit(dataStore);
        if (res == false) return;
        xml += res;
    }

    //}

    //xml += '</fields>';

    if (_saveValidResult == false) return false;
    return xml;
}


/**
 * 保存数据
 * @param {function=}callBack
 */
function doSubmitDataChoice(callback){


    _saveValidResult = true;        //初始化 验证结果为true
    var xml = '<root>';                  //提交的 xml

    if (isWorkflow != false) {
        xml = '<root userType="' + wfUserType + '" pubParam="' + wfPubParam + '" >';
    }


    for (var dli = 0; dli < datastoreList.length; dli++) { //遍历页面绑定了dataset 字段的控件
        var dataStore = datastoreList[dli];                             // datasetID

        var submitType = $('#' + dataStore).attr('submittype');

        if (submitType == 4) continue;        //dataset 的提交类型为 不提交 就跳过；
        if (submitType == 1) {                //dataset 的提交类型为 智能提交变动过的记录；
            var res = _smartSubmit(dataStore);
            if (res == false) return;
            xml += res;
        } else if (submitType == 2) {                //dataset 的提交类型为 只提交当前的一条记录；
            var res = _onlyNowSubmit(dataStore);
            if (res == false) return;
            xml += res;
        }

    }

    xml += '</root>';
    if (_saveValidResult == false) return false;
    try {

    } catch (e) {

    }
//	return;
    $.ajax({
        type       :"POST",
        url        :project + "/servlet/WebBill?key=doSubmitData",
        processData:false,
        data       :xml,
        async:true,
        contentType:'utf-8',
        success    :function (msg) {
            if (msg.match('errInfo') != null) {
                var list = art.dialog.list;
                for (var i in list) {
                    list[i].close();
                }
                layer.closeAll('loading');
                $("#buttonSave").prop("disabled",false);
                layer.msg(msg);
            } else {
                var fields = getPageSyncField();                 //得到 需要同步的数据
                for (var el in fields) {
                    var DS = window['data_' + fields[el][0]]      //datastore
                    var DS_id = window[fields[el][0] + '_now_id'];     //得到当前 datastore 中用在的ID
                    if (DS_id == undefined) {
                        DS_id = DS.first()
                    }
                    var item = DS.item(DS_id);
                    if (item != undefined) {
                        for (var j = 0; j < needLoadDataList.length; j++) {
                            var ctrl = needLoadDataList[j];               //[控件ID,datasetID,字段名,是否需要加数据,类型]
                            var value = getValue(ctrl[0], ctrl[4]);
                            var property = ctrl[2];
                            if (ctrl[1] == fields[el][0]) {            //如果绑定了这个dataset ，就更新数据
                                item[property] = value;
                            }
                        }
                        DS.update(DS_id, item);
                    }
                }

                _gridAddId.length = 0;                      //提交后清空item 添加 状态
                _gridDelId.length = 0;                      //提交后清空item 删除 状态
                if (callBack == undefined) {
                    var list = art.dialog.list;
                    for (var i in list) {
                        list[i].close();
                    }
                }

                if (typeof (callBack) == "function") {
                    callBack();
                }
            }

        },
        error      :function (msg) {
            $.dialog.tips('访问后台失败！')
        }
    });

    if (deleteAttachList.length > 0) {
        var attXml = '<root>';
        for (var i = 0; i < deleteAttachList.length; i++) {                //删除 附件
            var att = deleteAttachList[i][1];
            attXml += '<file>' + att + '</file>';
        }
        attXml += '</root>';
        $.ajax({
            type       :"POST",
            url        :project + "/servlet/WebBill?key=DelUploadFile",
            processData:false,
            data       :attXml,
            contentType:'utf-8',
            async:true,
            success    :function (msg) {
                if (msg.match('errInfo') != null) {
                    $.dialog.alert(msg);
                } else {

                }

            }
        });
    }


}

/**
 * 保存数据
 * @param {function=}callBack
 */


function doSubmitData(callBack) {



    _saveValidResult = true;        //初始化 验证结果为true
    var xml = '<root>';                  //提交的 xml

    if (isWorkflow != false) {
        xml = '<root userType="' + wfUserType + '" pubParam="' + wfPubParam + '" >';
    }


    for (var dli = 0; dli < datastoreList.length; dli++) { //遍历页面绑定了dataset 字段的控件
        var dataStore = datastoreList[dli];                             // datasetID

        var submitType = $('#' + dataStore).attr('submittype');



        if (submitType == 4) continue;        //dataset 的提交类型为 不提交 就跳过；
        if (submitType == 1) {                //dataset 的提交类型为 智能提交变动过的记录；
            var res = _smartSubmit(dataStore);
            if (res == false) return;
            xml += res;
        } else if (submitType == 2) {                //dataset 的提交类型为 只提交当前的一条记录；
            var res = _onlyNowSubmit(dataStore);
            if (res == false) return;
            xml += res;
        }

    }

    //增加下拉表单的提交类型


    xml += '</root>';
    if (_saveValidResult == false) return false;

    $.ajax({
        type       :"POST",
        url        :project + "/servlet/WebBill?key=doSubmitData",
        processData:false,
        data       :xml,
        contentType:'utf-8',
        success    :function (msg) {
            if (msg.match('errInfo') != null) {

                var list = art.dialog.list;
                for (var i in list) {
                    list[i].close();
                }
                layer.closeAll('loading');
                $("#buttonSave").prop("disabled",false);
                layer.msg(msg);
            } else {
                var fields = getPageSyncField();                 //得到 需要同步的数据
                for (var el in fields) {
                    var DS = window['data_' + fields[el][0]]      //datastore
                    var DS_id = window[fields[el][0] + '_now_id'];     //得到当前 datastore 中用在的ID
                    if (DS_id == undefined) {
                        DS_id = DS.first()
                    }
                    var item = DS.item(DS_id);
                    if (item != undefined) {
                        for (var j = 0; j < needLoadDataList.length; j++) {
                            var ctrl = needLoadDataList[j];               //[控件ID,datasetID,字段名,是否需要加数据,类型]
                            var value = getValue(ctrl[0], ctrl[4]);
                            var property = ctrl[2];
                            if (ctrl[1] == fields[el][0]) {            //如果绑定了这个dataset ，就更新数据
                                item[property] = value;
                            }
                        }
                        DS.update(DS_id, item);
                    }
                }
                _gridAddId.length = 0;                      //提交后清空item 添加 状态
                _gridDelId.length = 0;                      //提交后清空item 删除 状态
                if (callBack == undefined) {
                    var list = art.dialog.list;
                    for (var i in list) {
                        list[i].close();
                    }
                }
                if (typeof (callBack) == "function") {
                    callBack();
                }
            }
        },
        error:function (msg) {
            layer.msg('访问后台失败！');
        }
    });
    if (deleteAttachList.length > 0) {
        var attXml = '<root>';
        for (var i = 0; i < deleteAttachList.length; i++) {                //删除 附件
            var att = deleteAttachList[i][1];
            attXml += '<file>' + att + '</file>';
        }
        attXml += '</root>';
        $.ajax({
            type       :"POST",
            url        :project + "/servlet/WebBill?key=DelUploadFile",
            processData:false,
            data       :attXml,
            contentType:'utf-8',
            success    :function (msg) {
                if (msg.match('errInfo') != null) {
                    layer.msg(msg);
                } else {

                }

            }
        });
    }
}

//提交办理单的意见
function oaSubmitBillAdvice(){

    var contentData=[];
    //提交意见
    var filePageIdPage=$(window.frames["billPageId"].document),
        billAdvice=filePageIdPage.find(".js-leader-advice");

    billAdvice.each(function(){
        var $this=$(this),
            $adviceType=parseInt($this.closest("td").data("type")),
            $adviceContent=$this.find(".js-leader-advice-content span").text(),
            $adviceId=$this.data("advice"),
            $id=$.trim($this.attr("id"));

        if($id.length<1){
            contentData.push({
                "adviceType":$adviceType,
                "adviceId":$adviceId,
                "adviceContent":$adviceContent
            });
        }

    });

    var wfId=$urlParam("wfId");
    var surl=project+"/admin/documentData/addDocumentAdvice.action";
    $.post(surl,{
            "wfId":wfId,
            contentData:JSON.stringify(contentData)
        },
        function(result){
            if(result){

                var resultData=result.datas;

                for(var i= 0,max=resultData.length;i<max;i++){
                    var adviceId=resultData[i].adviceId,
                        createBy=resultData[i].createBy,
                        createDttm=resultData[i].createDttm.split("T")[0],
                        id=resultData[i].id,
                        userName=resultData[i].userName;

                    billAdvice.each(function(){
                        var $this=$(this),
                            dataAdvice=$this.data("advice");
                        if(adviceId==dataAdvice){
                            $this.attr("id",id);
                            $this.find(".js-leader-advice-last").html(userName+"&nbsp;"+createDttm).show();
                            return false;
                        }

                    });
                }
            }
        });

}

/**
 * 生成这个 datastore提交时的 xml     智能提交 变动过的记录
 * 提交方式只能选择此方法 cl 2015-6-12
 *
 * @param DsId      datastore的id
 * @return {*}
 * @private
 */
function _smartSubmit(DsId) {

    var xml = '<' + DsId + '>';
    var thisDsHtml = $('#' + DsId);
    var format = thisDsHtml.attr('format');


    var uploadList = [];
    var data_format = newXml(format);
    var thisDs = getDs(DsId);
    var dsNowId = '';
    var saveTable = thisDsHtml.attr('savetable');
    if(undToSp(saveTable)==''){
        alert(DsId+'未设置保存的表名！');
        return false;
    }
    var idtype = thisDsHtml.attr('idtype');
    var isInAddStatus = thisDsHtml.attr('isInAddStatus');//表单是否处于新增状态
    var keyHasVal = false;
    if (idtype == '4' || idtype == '5') {
        keyHasVal = true;
    }
    var idparam = undToSp(thisDsHtml.attr('idparam'));
    var hasAddedId = [];    //已经添加到 xml 中的ID
    var thisDsKey = [];                   //这个datastore的主键
    var relationType = '';                       //主  从  单
    var relationField = '';                       //如果是从表的话  绑定的字段
    var isSubDs = thisDsHtml.attr('issubds');       //是否主从表
    if (isSubDs == '是') {
        relationType = '从';
        relationField = thisDsHtml.attr('subdsfield');             //从表 dataset 字段

    } else {
        relationField = undToSp(thisDsHtml.attr('relationField'));
        if (relationField == '') {               //不是从表，但也不是主表
            relationType = '单';
            relationField = '';
        } else {
            relationType = '主';
            relationField = relationField;
        }
    }

    for (var i = 0; i < needLoadDataList.length; i++) {
        var o = needLoadDataList[i];     //[控件ID,datasetID,字段名,是否需要加数据,'类型']
        if (o[2] == 'grid' && o[1] == DsId) {
            dsNowId = window['grid_' + o[0]].getSelectedRowId();    //取选中的id
        } else if (o[2] == 'upload' && o[1] == DsId) {                             //是upload 上传控件时
            uploadList.push(o);
        }
    }
    if (dsNowId == null || dsNowId == '') {
        dsNowId = window['data_' + DsId].first();      // datastore 中的第一条的id
    }
    if (dsNowId == undefined && isInAddStatus != '否') {           // 这个datastore 目前没数据
        xml += '<tr rowstate="add">';
        $(data_format).find('field').each(function () {
            var fieldname = $(this).find('fieldname').text();
            var primarykey = $(this).find('primarykey').text();
            if (primarykey == '是') {
                thisDsKey.push(fieldname);
            }
            var fieldVal = '';
            fieldVal = getDefaultVal(fieldname);            //保存时先获取字段默认值
            for (var i = 0; i < needLoadDataList.length; i++) {
                var ctrl = needLoadDataList[i];     //[控件ID,datasetID,字段名,是否需要加数据,'类型']
                if (ctrl[1] == DsId && ctrl[2] == fieldname) {
                    fieldVal = getValue(ctrl[0], ctrl[4]);
                }
            }
            fieldVal = saveTrans(fieldVal, DsId, fieldname);
            xml += '<td>' + fieldVal + '</td>';
        })
        xml += '</tr>';
    } else {                           // 这个datastore 目前有数据
        $(data_format).find('field').each(function () {
            var fieldname = $(this).find('fieldname').text();
            var primarykey = $(this).find('primarykey').text();
            if (primarykey == '是') {
                thisDsKey.push(fieldname);
            }
        })

//		------------------   添加页面中 grid 新增的 item   ------------------
        if (_gridAddId.length > 0) {
            for (var addI = 0; addI < _gridAddId.length; addI++) {
                var thisAddId = _gridAddId[addI];
                if (jQuery.inArray(thisAddId[1] + '', hasAddedId) != '-1') continue      //已经添加过了
                if (thisAddId[0] != DsId) continue;                                //不是这个 datastore的

                nowItem = thisDs.item(thisAddId[1]);
                if (undToSp(nowItem) == '') continue;               //没找到这条数据
                hasAddedId.push(thisAddId[1] + '');
                xml += '<tr rowstate="add">';
                $(data_format).find('field').each(function () {
                    var fieldname = $(this).find('fieldname').text();
                    var primarykey = $(this).find('primarykey').text();

                    var fieldVal = '';
                    fieldVal = getDefaultVal(fieldname);            //保存时先获取字段默认值
                    if (undToSp(nowItem[fieldname]) != '') {
                        fieldVal = nowItem[fieldname];
                    }
                    for (var i = 0; i < needLoadDataList.length; i++) {
                        var ctrl = needLoadDataList[i];     //[控件ID,datasetID,字段名,是否需要加数据,'类型']
                        if (ctrl[1] == DsId && ctrl[2] == fieldname) {
                            fieldVal = getValue(ctrl[0], ctrl[4]);
                        }
                    }
                    fieldVal = saveTrans(fieldVal, DsId, fieldname);
                    if (primarykey == '是' && keyHasVal == false) fieldVal = '';           //如果是主键且idtype为1、6、8 ，那么新增时 应该为空
                    xml += '<td>' + fieldVal + '</td>';
                });
                xml += '</tr>';
            }


        }


//		------------------   添加页面中 grid 修改的 item   ------------------
        var dsChangedIds = [];
        var thisGrid = '';
        for (var i = 0; i < needLoadDataList.length; i++) {
            var ctrl = needLoadDataList[i];     //[控件ID,datasetID,字段名,是否需要加数据,'类型']
            if (ctrl[1] == DsId && ctrl[4] == 'grid') {
                thisGrid = getGrid(ctrl[0]);
                var temp = thisGrid.getChangedRows()
                if (temp.length > 0) dsChangedIds = temp.split(',');
            }
        }
        if (dsChangedIds.length > 0) {
            for (var addI = 0; addI < dsChangedIds.length; addI++) {
                var thisEditId = dsChangedIds[addI];
                if (jQuery.inArray(thisEditId + '', hasAddedId) != '-1') continue;      //已经添加过了
                nowItem = thisDs.item(thisEditId);
                if (undToSp(nowItem) == '') continue;                 //没找到这条数据
                xml += '<tr rowstate="edit">';
                hasAddedId.push(thisEditId + '');

                $(data_format).find('field').each(function () {
                    var fieldname = $(this).find('fieldname').text();
                    var fieldVal = '';
                    fieldVal = getDefaultVal(fieldname);            //保存时先获取字段默认值
                    if (undToSp(nowItem[fieldname]) != '') {
                        fieldVal = nowItem[fieldname];
                    }
                    for (var i = 0; i < needLoadDataList.length; i++) {
                        var ctrl = needLoadDataList[i];     //[控件ID,datasetID,字段名,是否需要加数据,'类型']
                        if (ctrl[1] == DsId && ctrl[2] == fieldname) {
                            fieldVal = getValue(ctrl[0], ctrl[4]);
                        }
                    }
                    fieldVal = saveTrans(fieldVal, DsId, fieldname);
                    xml += '<td>' + fieldVal + '</td>';
                });
                xml += '</tr>';
            }
            thisGrid.clearChangedState();            //提交后清空grid 修改状态
        }




//		------------------   添加当前显示的 这条 item   ------------------
        var nowItem = thisDs.item(dsNowId);
        if (nowItem && (jQuery.inArray(dsNowId + '', hasAddedId) == '-1' )) {           //如果还没添加过的话
            xml += '<tr rowstate="edit">';
            $(data_format).find('field').each(function () {
                var fieldname = $(this).find('fieldname').text();
                var primarykey = $(this).find('primarykey').text();
                var fieldVal = '';
                fieldVal = getDefaultVal(fieldname);            //保存时先获取字段默认值
                if (undToSp(nowItem[fieldname]) != '') {
                    fieldVal = nowItem[fieldname];
                }
                for (var i = 0; i < needLoadDataList.length; i++) {
                    var ctrl = needLoadDataList[i];     //[控件ID,datasetID,字段名,是否需要加数据,'类型']
                    if (ctrl[1] == DsId && ctrl[2] == fieldname) {
                        fieldVal = getValue(ctrl[0], ctrl[4]);
                    }
                }
                fieldVal = saveTrans(fieldVal, DsId, fieldname);
                xml += '<td>' + fieldVal + '</td>';
            });
            xml += '</tr>';
        }


    }


    xml += '<set><submitconfig><savetable>' + saveTable + '</savetable><key><idtype>' + idtype + '</idtype><idparam>' + idparam + '</idparam><retno></retno></key><relation><type>' + relationType + '</type><field>' + relationField + '</field></relation>';

    var addTemp = [];      //新增的附件
    var delTemp = [];      //删除的附件
    var xmlTemp = '';      //附件部分xml数据，如果长度大于0 ，则xml有  eventSaveRecordAfter 部分

    saveTable=parseSaveTable(saveTable); //hxt add

    if (uploadList.length > 0 || deleteAttachList.length > 0) {
        var nowItem = thisDs.item(dsNowId);
        var keyValue = '';
        if (undToSp(dsNowId) != '') {
            keyValue = nowItem[thisDsKey[0]];
        }
        if (uploadList.length > 0) {
            for (var j = 0; j < uploadList.length; j++) {
                var up = uploadList[j];                   //[控件ID,datasetID,'upload',是否需要加数据,'upload']
                var uploadDiv=$('#' + up[0]+'_pick');
                if(uploadDiv.length == 0) continue;
                var uploadObj =newUploader;//提交时获取对象文件
                if (uploadObj == undefined) continue;
                for (var k = 0; k < uploadObj.files.length; k++) {
                    var file = uploadObj.files[k];
                    if (file.status == 5) {
                        if($('.'+file.id).html()!=null){//通过新加的样式对比,删除bug修复
                            addTemp.push('{id:"' + file.id + '",name:"' + file.name + '",size:"' + file.size + '",remark:""}');
                        }
                    }
                }
                try {
                    var _eUploader =newUploader;
                    _eUploader.destroy();
                } catch (e) {
                }
            }

        }
        if (deleteAttachList.length > 0) {
            for (var i = 0; i < deleteAttachList.length; i++) {                //删除 附件
                var attId = deleteAttachList[i][0];
                var attSize = deleteAttachList[i][1];
                delTemp.push('{id:"' + attId + '",size:"' + attSize + '"}');
            }
        }

        if (addTemp.length + delTemp.length > 0) {               //根据 addTemp  delTemp 添加 附件信息
            xmlTemp += '<action userType="1"><file tableName="' + saveTable + '" tableKey="' + thisDsKey[0] + '" tableKeyId="' + keyValue + '">{';
            if (addTemp.length > 0) {
                xmlTemp += 'addFileList:[' + addTemp + ']';
            }
            if (addTemp.length > 0 && delTemp.length > 0) {
                xmlTemp += ',';
            }
            if (delTemp.length > 0) {
                xmlTemp += 'delFileList:[' + delTemp + ']';
            }
            xmlTemp += '}</file></action>';
        }
    }

    if (xmlTemp.length > 0 || _gridDelId.length > 0) {
        xml += '<eventSaveRecordAfter>' + xmlTemp;

        //		------------------   添加页面 中 grid 删除的 item   ------------------
        for (var i = 0; i < _gridDelId.length; i++) {
            var thisDelId = _gridDelId[i];
            if (thisDelId[0] != DsId) continue;
            if (jQuery.inArray(thisDelId[1] + '', _gridAddId) != '-1') continue;

            var thisItem = thisDelId[2];
            var delSql = '';
            for (var j = 0; j < thisDsKey.length; j++) {
                var key = thisDsKey[j];
                var keyVal = thisItem[key];
                delSql += (key + " ='" + keyVal + "' and ");
            }
            delSql = delSql.substr(0, delSql.length - 5);
            xml += "<delete tableName='" + saveTable + "' ><where>" + delSql + "</where></delete>";
        }
        xml += '</eventSaveRecordAfter>';
    }
    xml += '</submitconfig>';

    xml += format;

    xml += '</set>';

    xml += '</' + DsId + '>'


    return xml;
}




/**
 * 生成这个 datastore提交时的 xml     智能提交 变动过的记录
 * 提交方式只能选择此方法 cl 2016-1-13
 *
 * @param DsId      datastore的id
 * @return {*}
 * @private
 */
function _smartSubmitOa(DsId) {


    var xml = '<' + DsId + '>';
    var thisDsHtml = $('#' + DsId);
    var format = thisDsHtml.attr('format');

    var uploadList = [];
    var data_format = newXml(format);

    var thisDs = getDs(DsId);
    var dsNowId = '';
    var saveTable = thisDsHtml.attr('savetable');
    if(undToSp(saveTable)==''){
        alert(DsId+'未设置保存的表名！');
        return false;
    }

    var idtype = thisDsHtml.attr('idtype');
    var isInAddStatus = thisDsHtml.attr('isInAddStatus');//表单是否处于新增状态
    var keyHasVal = false;
    if (idtype == '4' || idtype == '5') {
        keyHasVal = true;
    }
    var idparam = undToSp(thisDsHtml.attr('idparam'));
    var hasAddedId = [];    //已经添加到 xml 中的ID
    var thisDsKey = [];                   //这个datastore的主键
    var relationType = '';                       //主  从  单
    var relationField = '';                       //如果是从表的话  绑定的字段
    var isSubDs = thisDsHtml.attr('issubds');       //是否主从表
    if (isSubDs == '是') {
        relationType = '从';
        relationField = thisDsHtml.attr('subdsfield');             //从表 dataset 字段

    } else {
        relationField = undToSp(thisDsHtml.attr('relationField'));
        if (relationField == '') {               //不是从表，但也不是主表
            relationType = '单';
            relationField = '';
        } else {
            relationType = '主';
            relationField = relationField;
        }
    }


    for (var i = 0; i < needLoadDataList.length; i++) {
        var o = needLoadDataList[i];     //[控件ID,datasetID,字段名,是否需要加数据,'类型']
        if (o[2] == 'grid' && o[1] == DsId) {
            dsNowId = window['grid_' + o[0]].getSelectedRowId();    //取选中的id
        } else if (o[2] == 'upload' && o[1] == DsId) {                             //是upload 上传控件时
            uploadList.push(o);
        }
    }
    if (dsNowId == null || dsNowId == '') {
        dsNowId = window['data_' + DsId].first();      // datastore 中的第一条的id
    }
    if (dsNowId == undefined && isInAddStatus != '否') {           // 这个datastore 目前没数据
        xml += '<tr rowstate="add">';
        $(data_format).find('field').each(function () {
            var fieldname = $(this).find('fieldname').text();
            var primarykey = $(this).find('primarykey').text();
            if (primarykey == '是') {
                thisDsKey.push(fieldname);
            }
            var fieldVal = '';
            fieldVal = getDefaultVal(fieldname);            //保存时先获取字段默认值
            for (var i = 0; i < needLoadDataList.length; i++) {
                var ctrl = needLoadDataList[i];     //[控件ID,datasetID,字段名,是否需要加数据,'类型']
                if (ctrl[1] == DsId && ctrl[2] == fieldname) {
                    fieldVal = getValue(ctrl[0], ctrl[4]);
                }
            }
            fieldVal = saveTrans(fieldVal, DsId, fieldname);
            xml += '<td>' + fieldVal + '</td>';
        })
        xml += '</tr>';
    } else {                           // 这个datastore 目前有数据
        $(data_format).find('field').each(function () {
            var fieldname = $(this).find('fieldname').text();
            var primarykey = $(this).find('primarykey').text();
            if (primarykey == '是') {
                thisDsKey.push(fieldname);
            }
        })

//		------------------   添加页面中 grid 新增的 item   ------------------
        if (_gridAddId.length > 0) {
            for (var addI = 0; addI < _gridAddId.length; addI++) {
                var thisAddId = _gridAddId[addI];
                if (jQuery.inArray(thisAddId[1] + '', hasAddedId) != '-1') continue      //已经添加过了
                if (thisAddId[0] != DsId) continue;                                //不是这个 datastore的

                nowItem = thisDs.item(thisAddId[1]);
                if (undToSp(nowItem) == '') continue;               //没找到这条数据
                hasAddedId.push(thisAddId[1] + '');
                xml += '<tr rowstate="add">';
                $(data_format).find('field').each(function () {
                    var fieldname = $(this).find('fieldname').text();
                    var primarykey = $(this).find('primarykey').text();

                    var fieldVal = '';
                    fieldVal = getDefaultVal(fieldname);            //保存时先获取字段默认值
                    if (undToSp(nowItem[fieldname]) != '') {
                        fieldVal = nowItem[fieldname];
                    }
                    for (var i = 0; i < needLoadDataList.length; i++) {
                        var ctrl = needLoadDataList[i];     //[控件ID,datasetID,字段名,是否需要加数据,'类型']
                        if (ctrl[1] == DsId && ctrl[2] == fieldname) {
                            fieldVal = getValue(ctrl[0], ctrl[4]);
                        }
                    }
                    fieldVal = saveTrans(fieldVal, DsId, fieldname);
                    if (primarykey == '是' && keyHasVal == false) fieldVal = '';           //如果是主键且idtype为1、6、8 ，那么新增时 应该为空
                    xml += '<td>' + fieldVal + '</td>';
                });
                xml += '</tr>';
            }


        }


//		------------------   添加页面中 grid 修改的 item   ------------------
        var dsChangedIds = [];
        var thisGrid = '';
        for (var i = 0; i < needLoadDataList.length; i++) {
            var ctrl = needLoadDataList[i];     //[控件ID,datasetID,字段名,是否需要加数据,'类型']
            if (ctrl[1] == DsId && ctrl[4] == 'grid') {
                thisGrid = getGrid(ctrl[0]);
                var temp = thisGrid.getChangedRows()
                if (temp.length > 0) dsChangedIds = temp.split(',');
            }
        }
        if (dsChangedIds.length > 0) {
            for (var addI = 0; addI < dsChangedIds.length; addI++) {
                var thisEditId = dsChangedIds[addI];
                if (jQuery.inArray(thisEditId + '', hasAddedId) != '-1') continue;      //已经添加过了
                nowItem = thisDs.item(thisEditId);
                if (undToSp(nowItem) == '') continue;                 //没找到这条数据
                xml += '<tr rowstate="edit">';
                hasAddedId.push(thisEditId + '');

                $(data_format).find('field').each(function () {
                    var fieldname = $(this).find('fieldname').text();
                    var fieldVal = '';
                    fieldVal = getDefaultVal(fieldname);            //保存时先获取字段默认值
                    if (undToSp(nowItem[fieldname]) != '') {
                        fieldVal = nowItem[fieldname];
                    }
                    for (var i = 0; i < needLoadDataList.length; i++) {
                        var ctrl = needLoadDataList[i];     //[控件ID,datasetID,字段名,是否需要加数据,'类型']
                        if (ctrl[1] == DsId && ctrl[2] == fieldname) {
                            fieldVal = getValue(ctrl[0], ctrl[4]);
                        }
                    }
                    fieldVal = saveTrans(fieldVal, DsId, fieldname);
                    xml += '<td>' + fieldVal + '</td>';
                });
                xml += '</tr>';
            }
            thisGrid.clearChangedState();            //提交后清空grid 修改状态
        }



//		------------------   添加当前显示的 这条 item   ------------------
        var nowItem = thisDs.item(dsNowId);
        if (nowItem && (jQuery.inArray(dsNowId + '', hasAddedId) == '-1' )) {           //如果还没添加过的话
            xml += '<tr rowstate="edit">';
            $(data_format).find('field').each(function () {
                var fieldname = $(this).find('fieldname').text();
                var primarykey = $(this).find('primarykey').text();
                var fieldVal = '';
                fieldVal = getDefaultVal(fieldname);            //保存时先获取字段默认值
                if (undToSp(nowItem[fieldname]) != '') {
                    fieldVal = nowItem[fieldname];
                }
                for (var i = 0; i < needLoadDataList.length; i++) {
                    var ctrl = needLoadDataList[i];     //[控件ID,datasetID,字段名,是否需要加数据,'类型']
                    if (ctrl[1] == DsId && ctrl[2] == fieldname) {
                        fieldVal = getValue(ctrl[0], ctrl[4]);
                    }
                }
                fieldVal = saveTrans(fieldVal, DsId, fieldname);
                xml += '<td>' + fieldVal + '</td>';
            });
            xml += '</tr>';
        }


    }


    xml += '<set><submitconfig><savetable>' + saveTable + '</savetable><key><idtype>' + idtype + '</idtype><idparam>' + idparam + '</idparam><retno></retno></key><relation><type>' + relationType + '</type><field>' + relationField + '</field></relation>';

    var addTemp = [];      //新增的附件
    var delTemp = [];      //删除的附件
    var xmlTemp = '';      //附件部分xml数据，如果长度大于0 ，则xml有  eventSaveRecordAfter 部分

    saveTable=parseSaveTable(saveTable); //hxt add


    if (uploadList.length > 0 || deleteAttachList.length > 0) {
        var nowItem = thisDs.item(dsNowId);
        var keyValue = '';
        if (undToSp(dsNowId) != '') {
            keyValue = nowItem[thisDsKey[0]];
        }
        if (uploadList.length > 0) {
            for (var j = 0; j < uploadList.length; j++) {
                var up = uploadList[j];                   //[控件ID,datasetID,'upload',是否需要加数据,'upload']
                var uploadDiv=$('#' + up[0]+'_pick');
                if(uploadDiv.length == 0) continue;
                var uploadObj =newUploader;//提交时获取对象文件
                if (uploadObj == undefined) continue;
                for (var k = 0; k < uploadObj.files.length; k++) {
                    var file = uploadObj.files[k];
                    if (file.status == 5) {
                        if($('.'+file.id).html()!=null){//通过新加的样式对比,删除bug修复
                            addTemp.push('{id:"' + file.id + '",name:"' + file.name + '",size:"' + file.size + '",remark:""}');
                        }
                    }
                }
                try {
                    var _eUploader =newUploader;
                    _eUploader.destroy();
                } catch (e) {
                }
            }

        }
        if (deleteAttachList.length > 0) {
            for (var i = 0; i < deleteAttachList.length; i++) {                //删除 附件
                var attId = deleteAttachList[i][0];
                var attSize = deleteAttachList[i][1];
                delTemp.push('{id:"' + attId + '",size:"' + attSize + '"}');
            }
        }

        if (addTemp.length + delTemp.length > 0) {               //根据 addTemp  delTemp 添加 附件信息
            xmlTemp += '<action userType="1"><file tableName="' + saveTable + '" tableKey="' + thisDsKey[0] + '" tableKeyId="' + keyValue + '">{';
            if (addTemp.length > 0) {
                xmlTemp += 'addFileList:[' + addTemp + ']';
            }
            if (addTemp.length > 0 && delTemp.length > 0) {
                xmlTemp += ',';
            }
            if (delTemp.length > 0) {
                xmlTemp += 'delFileList:[' + delTemp + ']';
            }
            xmlTemp += '}</file></action>';
        }
    }


    if (xmlTemp.length > 0 || _gridDelId.length > 0) {
        xml += '<eventSaveRecordAfter>' + xmlTemp;

        //		------------------   添加页面 中 grid 删除的 item   ------------------
        for (var i = 0; i < _gridDelId.length; i++) {
            var thisDelId = _gridDelId[i];
            if (thisDelId[0] != DsId) continue;
            if (jQuery.inArray(thisDelId[1] + '', _gridAddId) != '-1') continue;

            var thisItem = thisDelId[2];
            var delSql = '';
            for (var j = 0; j < thisDsKey.length; j++) {
                var key = thisDsKey[j];
                var keyVal = thisItem[key];
                delSql += (key + " ='" + keyVal + "' and ");
            }
            delSql = delSql.substr(0, delSql.length - 5);
            xml += "<delete tableName='" + saveTable + "' ><where>" + delSql + "</where></delete>";
        }


        xml += '</eventSaveRecordAfter>';
    }


    xml += '</submitconfig>';

    xml += format;

    xml += '</set>';

    xml += '</' + DsId + '>'


    var xmlVal=$($.parseXML(xml)).find("td");
    var xmldata=$($.parseXML(xml)).find("fields").eq(0).find("field");
    var formXml="<fields>";
    xmldata.each(function(index){
        var $this=$(this);
        if($this.find("procvalid").text()=="是"){
            formXml+="<field><fieldname>"+$this.find("fieldname").text()+"</fieldname><fieldvalue><![CDATA["+xmlVal.eq(index).text()+"]]></fieldvalue><datatype>"+$this.find("datatype").text()+"</datatype></field>";
        }


    });
    formXml+="</fields>";
    return formXml;
    //return xml;

}





/**
 * 生成这个 datastore提交时的 xml    只提交当前这条记录
 * @param DsId      datastore的id
 * @return {*}
 * @private
 */
function _onlyNowSubmit(DsId) {
    var xml = '<' + DsId + '>';
    var thisDsHtml = $('#' + DsId);
    var format = thisDsHtml.attr('format');
    var uploadList = [];
    var data_format = newXml(format);
    var thisDs = getDs(DsId);
    var dsNowId = '';
    var saveTable = thisDsHtml.attr('savetable');
    var idtype = thisDsHtml.attr('idtype');
    var idparam = thisDsHtml.attr('idparam');
    var thisDsKey = [];                   //这个datastore的主键
    var relationType = '';                       //主  从  单
    var relationField = '';                       //如果是从表的话  绑定的字段
    var isSubDs = thisDsHtml.attr('issubds');       //是否主从表
    if (isSubDs == '是') {
        relationType = '从';
        relationField = thisDsHtml.attr('subdsfield');             //从表 dataset 字段
    } else {
        relationField = undToSp(thisDsHtml.attr('relationField'));
        if (relationField == '') {               //不是从表，但也不是主表
            relationType = '单';
            relationField = '';
        } else {
            relationType = '主';
            relationField = relationField;
        }
    }
    for (var i = 0; i < needLoadDataList.length; i++) {
        var o = needLoadDataList[i];     //[控件ID,datasetID,字段名,是否需要加数据,'类型']
        if (o[2] == 'grid' && o[1] == DsId) {
            dsNowId = window['grid_' + o[0]].getSelectedRowId();    //取选中的id
        } else if (o[2] == 'upload') {                             //是upload 上传控件时
            uploadList.push(o);
        }
    }
    if (dsNowId == null || dsNowId == '') {
        dsNowId = window['data_' + DsId].first();      // datastore 中的第一条的id
    }
    if (dsNowId == undefined) {           // 这个datastore 没加载到数据
        xml += '<tr rowstate="add">';
        $(data_format).find('field').each(function () {
            var fieldname = $(this).find('fieldname').text();
            var primarykey = $(this).find('primarykey').text();
            if (primarykey == '是') {
                thisDsKey.push(fieldname);
            }
            var fieldVal = '';
            fieldVal = getDefaultVal(fieldname);            //保存时先获取字段默认值
            for (var i = 0; i < needLoadDataList.length; i++) {
                var ctrl = needLoadDataList[i];     //[控件ID,datasetID,字段名,是否需要加数据,'类型']
                if (ctrl[1] == DsId && ctrl[2] == fieldname) {
                    fieldVal = getValue(ctrl[0], ctrl[4]);
                }
            }
            fieldVal = saveTrans(fieldVal, DsId, fieldname);
            xml += '<td>' + fieldVal + '</td>';
        })
        xml += '</tr>';
    } else {                           // 这个datastore 加载到数据了
        var nowItem = thisDs.item(dsNowId);
        xml += '<tr rowstate="edit">';
//		------------------   先添加当前显示的 这条 item   ------------------
        $(data_format).find('field').each(function () {
            var fieldname = $(this).find('fieldname').text();
            var primarykey = $(this).find('primarykey').text();
            if (primarykey == '是') {
                thisDsKey.push(fieldname);
            }
            var fieldVal = '';
            fieldVal = getDefaultVal(fieldname);            //保存时先获取字段默认值
            if (undToSp(nowItem[fieldname]) != '') {
                fieldVal = nowItem[fieldname];
            }
            for (var i = 0; i < needLoadDataList.length; i++) {
                var ctrl = needLoadDataList[i];     //[控件ID,datasetID,字段名,是否需要加数据,'类型']
                if (ctrl[1] == DsId && ctrl[2] == fieldname) {
                    fieldVal = getValue(ctrl[0], ctrl[4]);
                }
            }
            fieldVal = saveTrans(fieldVal, DsId, fieldname);
            xml += '<td>' + fieldVal + '</td>';
        });
        xml += '</tr>';

    }


    xml += '<set><submitconfig><savetable>' + saveTable + '</savetable><key><idtype>' + idtype + '</idtype><idparam>' + idparam + '</idparam><retno></retno></key><relation><type>' + relationType + '</type><field>' + relationField + '</field></relation>';


    var addTemp = [];      //新增的附件
    var delTemp = [];      //删除的附件
    var xmlTemp = '';      //附件部分xml数据，如果长度大于0 ，则xml有  eventSaveRecordAfter 部分

    saveTable=parseSaveTable(saveTable); //hxt add

    if (uploadList.length > 0 || deleteAttachList.length > 0) {
        var failUp = '';                        //附件没提交
        var nowItem = thisDs.item(dsNowId);
        var keyValue = '';
        if (undToSp(dsNowId) != '') {
            keyValue = nowItem[thisDsKey[0]];
        }

        if (uploadList.length > 0) {
            for (var j = 0; j < uploadList.length; j++) {
                var up = uploadList[j];                   //[控件ID,datasetID,'upload',是否需要加数据,'upload']
                var uploadObj =newUploader;
                if (uploadObj == undefined) continue;
                for (var k = 0; k < uploadObj.files.length; k++) {
                    var file = uploadObj.files[k];
                    if (file.percent == 100) {
                        addTemp.push('{id:"' + file.id + '",name:"' + file.name + '",size:"' + file.size + '",remark:""}');
                    } else {
                        failUp += file.name + ',';
                    }
                }
                try {
                    var _eUploader = newUploader;
                    _eUploader.destroy();
                } catch (e) {
                }
            }

        }
        if (deleteAttachList.length > 0) {
            for (var i = 0; i < deleteAttachList.length; i++) {                //删除 附件
                var attId = deleteAttachList[i][0];
                var attSize = deleteAttachList[i][1];
                delTemp.push('{id:"' + attId + '",size,"' + attSize + '"}');
            }
        }

        if (addTemp.length + delTemp.length > 0) {               //根据 addTemp  delTemp 添加 附件信息
            xmlTemp += '<action userType="1"><file tableName="' + saveTable + '" tableKey="' + thisDsKey[0] + '" tableKeyId="' + keyValue + '">{';
            if (addTemp.length > 0) {
                xmlTemp += 'addFileList:[' + addTemp + ']';
            }
            if (addTemp.length > 0 && delTemp.length > 0) {
                xmlTemp += ',';
            }
            if (delTemp.length > 0) {
                xmlTemp += 'delFileList:[' + delTemp + ']';
            }
            xmlTemp += '}</file></action>';
        }

        if (failUp.length > 2) {
            $.dialog.tips(failUp + '未上传！');
            return false;
        }
    }
    if (xmlTemp.length > 0 || _gridDelId.length > 0) {
        xml += '<eventSaveRecordAfter>' + xmlTemp;


        //		------------------   添加页面 中 grid 删除的 item   ------------------
        for (var i = 0; i < _gridDelId.length; i++) {
            var thisDelId = _gridDelId[i];
            var thisItem = thisDs.item(thisDelId);
            var delSql = '';
            for (var j = 0; j < thisDsKey.length; j++) {
                var key = thisDsKey[j];
                var keyVal = thisItem[key];
                for (var i = 0; i < needLoadDataList.length; i++) {
                    var ctrl = needLoadDataList[i];     //[控件ID,datasetID,字段名,是否需要加数据,'类型']
                    if (ctrl[1] == DsId && ctrl[2] == key) {
                        keyVal = getValue(ctrl[0], ctrl[4]);
                    }
                }
                delSql += key + " ='" + keyVal + "'and";
            }
            delSql = delSql.substr(0, delSql.length - 3);
            xml += "<delete tableName='" + saveTable + "' ><where>" + delSql + "</where></delete>";
        }

        xml += '</eventSaveRecordAfter>';
    }


    xml += '</submitconfig>';

    xml += format;

    xml += '</set>';

    xml += '</' + DsId + '>'

    return xml;
}

/**
 * 生成这个 datastore提交时的 xml  ---  只提交当前的这条记录     --- 备用
 * @param id      datastore的id
 * @return {*}
 * @private
 */
function _onlyNowSubmit_old(id) {
    var xml = '';
    var dataStore = id;
    var thisDsFormat = $('#' + dataStore).attr('format');
    var hasAddField = [];
    var primaryKey = [];                  //判断页面是否存在主键
    var saveTable = '';                   //保存到哪张表
    var canSave = true;
    var testOb = {};                //todo 开发测试 提交的数据
    thisDsFormat = newXml(thisDsFormat);           //这个dataset的字段
    var submitKey = '';
    var thisDaKey = getPrimaryKey(dataStore);                     //得到页面的主键     //[ [主键名] , [主键值] ,[是否被绑定了]]
    var hasGrid = [];                                             //页面中有几个grid  [[控件ID,datasetID,字段名,是否需要加数据,'grid']]
    primaryKey = thisDaKey;
    xml += '<' + dataStore + '>';
    var submitData = [];              // 提交是  <tr rowstate="edit/add"> 中的数据
    var uploadList = [];

    for (var i = 0; i < needLoadDataList.length; i++) {            //生成需要保存的列表
        var obj = needLoadDataList[i];                //[控件ID,datasetID,字段名,是否需要加数据,'类型']
        if (obj[1] == dataStore) {
            if (obj[2] == 'grid') {                             //是grid时把这个gird的加载信息 加进去
                hasGrid.push(obj);
            } else if (obj[2] == 'upload') {                             //是upload 上传控件时
                uploadList.push(obj)
            } else {                                           //不是grid时，把控件的 '值' 和 'field' 加在 submitData中
                if (obj[4] == 'select') {
                    var controlValue = getValue(obj[0], 'select');
                    submitData.push([controlValue, obj[2]]);
                } else if (obj[4] == 'listBox') {
                    var controlValue = [];
                    $('#' + obj[0] + ' option').each(function () {
                        controlValue.push($(this).val());
                    })
                    submitData.push([controlValue.toString(), obj[2]]);
                } else if (obj[4] == 'radio') {
                    var controlValue = getValue(obj[0], 'radio');
                    submitData.push([controlValue, obj[2]]);
                } else {
                    var controlValue = $('#' + obj[0]).text();
                    if (controlValue == '') controlValue = $('#' + obj[0]).val();
                    submitData.push([controlValue, obj[2]]);

                }

            }
        }
    }
    xml += '<tr rowstate="add">'
    for (var k = 0; k < thisDaKey[0].length; k++) {             //添加数据集中 未绑定到页面中的主键
        var o = thisDaKey[2][k];             // 是否绑定
        var nowKey = thisDaKey[0][k];                    //key
        if (o == false) {
            hasAddField.push(nowKey);
            var count = window['data_' + dataStore].dataCount();
            if (count == 0) {
                xml += '<td></td>';
                testOb[nowKey] = ''       //todo  提交的数据
            } else if (count == 1) {
                var submitKeyId = '';
                submitKeyId = window['data_' + dataStore].first();      // datastore 中的第一条的id
                var item = window['data_' + dataStore].item(submitKeyId);  // datastore 中的第一条的data
                xml += '<td>' + item[nowKey] + '</td>';
                testOb[nowKey] = item[nowKey]       //todo  提交的数据
            } else if (count > 1) {                                         //如果datastore中的数据不止一条，找页面上的gird 选中的数据 id
                for (var j = 0; j < hasGrid.length; j++) {
                    var gridInfo = hasGrid[j];
                    var submitKeyId = '';
                    if (gridInfo[1] == dataStore) {
                        submitKeyId = window['grid_' + gridInfo[0]].getSelectedRowId();    //取选中的id
                    }
                    if (submitKeyId == null) {
                        submitKeyId = window['data_' + dataStore].first();      // datastore 中的第一条的id
                    }
                    var item = window['data_' + dataStore].item(submitKeyId);  // datastore 中的第一条的data


                    xml += '<td>' + item[nowKey] + '</td>';
                    testOb[nowKey] = item[nowKey]       //todo  提交的数据
                }
            }

        }

    }
    for (var j = 0; j < submitData.length; j++) {             //增加 <tr rowstate="add"> 的 td
        var o = submitData[j];
        hasAddField.push(o[1]);
        //保存时转换
        for (var transI = 0; transI < fieldsTransInfo.length; transI++) {
            var fieldTransI = fieldsTransInfo[transI];
            if (fieldTransI[0] == dataStore && fieldTransI[1] == o[1]) {
                var transFunc = unescape(fieldTransI[2]);
                try {
                    o[0] = eval(transFunc + "('" + o[0] + "')");
                } catch (e) {

                }

            }

        }

        xml += '<td>' + o[0] + '</td>';
        testOb[o[1]] = o[0]      //todo  提交的数据
    }
    $(thisDsFormat).find('field').each(function () {           //增加 既不是组件，也没有绑定页面中组件的字段，用于工作流中的wf_id
        var fieldname = $(this).find('fieldname').text();
        if ($.inArray(fieldname, hasAddField) == -1) {
            var keyVal = '';
            var defaultValue = undToSp($(this).find('defaultvalue').text());
            if (defaultValue != '') {             //如果有默认值
                try {
                    keyVal = eval(defaultValue);
                } catch (e) {
                    keyVal = defaultValue;
                }

            }

            var item;        //找到 dataset中的这条数据
            var submitKeyId;      //在dataset 中的 ID
            for (var i = 0; i < needLoadDataList.length; i++) {
                var o = needLoadDataList[i];     //[控件ID,datasetID,字段名,是否需要加数据,'类型']
                if (o[2] == 'grid' && o[1] == dataStore) {
                    submitKeyId = window['grid_' + o[0]].getSelectedRowId();    //取选中的id
                }
            }
            if (submitKeyId == null) {
                submitKeyId = window['data_' + dataStore].first();      // datastore 中的第一条的id
            }

            if (submitKeyId != undefined) {
                item = window['data_' + dataStore].item(submitKeyId);
                if (undToSp(item[fieldname]) != '') {
                    keyVal = item[fieldname];
                }

            }
            //保存时转换
            for (var transI = 0; transI < fieldsTransInfo.length; transI++) {
                var fieldTransI = fieldsTransInfo[transI];
                if (fieldTransI[0] == dataStore && fieldTransI[1] == fieldname) {
                    var transFunc = unescape(fieldTransI[2]);
                    try {
                        keyVal = eval(transFunc + "('" + keyVal + "')");
                    } catch (e) {

                    }

                }

            }
            xml += '<td>' + keyVal + '</td>';
            testOb[fieldname] = keyVal      //todo  提交的数据

        }
    })
    //console.log(dataStore+'  :');      //todo  提交的数据
    //console.log(testOb);               //todo  提交的数据
    saveTable = $('#' + dataStore).attr('savetable');
    var idtype = $('#' + dataStore).attr('idtype');
    var idparam = $('#' + dataStore).attr('idparam');
    xml += '</tr><set><submitconfig><savetable>' + saveTable + '</savetable><key><idtype>' + idtype + '</idtype><idparam>' + idparam + '</idparam><retno></retno></key><relation><type>单</type><field></field></relation>';
    var failUp = '';

    saveTable=parseSaveTable(saveTable); //hxt add

    if (uploadList.length > 0 || deleteAttachList.length > 0) {

        xml += '<eventSaveRecordAfter>';
        for (var i = 0; i < deleteAttachList.length; i++) {                //删除 附件
            var attId = deleteAttachList[i][0];
            var attSize = deleteAttachList[i][1];
            var table = deleteAttachList[i][2];
            xml += "<deleteAttach tableName='" + table + "' id='" + attId + "' size='" + attSize + "'></deleteAttach>";
        }

        for (var j = 0; j < uploadList.length; j++) {
            var up = uploadList[j];                   //[控件ID,datasetID,'upload',是否需要加数据,'upload']
            var savePath = $('#' + up[0]+'_pick').attr('setpath');
            var uploadObj = newUploader;
            for (var k = 0; k < uploadObj.files.length; k++) {
                var file = uploadObj.files[k];
                if (file.percent == 100) {
                    var fileType = file.target_name.split('.');
                    fileType = fileType[1];
                    xml += "<insertAttach tableName='" + attachTable + "' ><names>attachid,djbh,filename,extend,bz,djsn,filepos</names><values>'" + file.id + "',':get_keyfield','" + file.name + "','." + fileType + "','','" + saveTable + "','" + savePath + file.target_name + "'</values></insertAttach >";
                } else {
                    failUp += file.name + ',';
                }
            }
        }
        xml += '</eventSaveRecordAfter>';
    }
    if (failUp.length > 2) {
        alert(failUp + '未上传！')
    }
    xml += '</submitconfig><fields>';
    var data_format = $('#' + dataStore).attr('format');
    data_format = newXml(data_format);

    for (var k = 0; k < thisDaKey[0].length; k++) {                 //添加数据集中 未绑定到页面中的主键
        var o = thisDaKey[2][k];
        if (o == false) {
            $(data_format).find('field').each(function (fieldIndex) {
                var fieldname = $(this).find('fieldname').text();
                if (thisDaKey[0][k] == fieldname) {
                    xml += '<field>';
                    $(this).children().each(function () {
                        var tagName = $(this)[0].tagName;
                        var text = $(this).text();
                        xml += '<' + tagName + '>' + text + '</' + tagName + '>';
                    });
                    xml += '</field>';
                }
            });
        }

    }
    for (var k = 0; k < submitData.length; k++) {             //增加 fields 的 field
        var xx = submitData[k];
        $(data_format).find('field').each(function (fieldIndex) {
            var fieldname = $(this).find('fieldname').text();
            var isNull = $(this).find('isnull').text();
            var displaylabel = $(this).find('displaylabel').text();
            if (xx[1] == fieldname) {
                if (isNull == "是") {
                    if (undToSp(xx[0]) == "") {

                        layer.closeAll('loading');
                        $("#buttonSave").prop("disabled",false);
                        layer.msg(displaylabel + '不能为空');
                        canSave = false;
                        return false;
                    }
                }
                xml += '<field>';
                $(this).children().each(function () {
                    var tagName = $(this)[0].tagName;
                    var text = $(this).text();
                    xml += '<' + tagName + '>' + text + '</' + tagName + '>';
                });
                xml += '</field>';
            }
        });
        if (canSave == false) return;           //必填字段 验证不通过
    }

    $(thisDsFormat).find('field').each(function () {           //增加 既不是组件，也没有绑定页面中组件的字段，用于工作流中的wf_id
        var fieldname = $(this).find('fieldname').text();
        if ($.inArray(fieldname, hasAddField) == -1) {
            xml += '<field>';
            $(this).children().each(function () {
                var tagName = $(this)[0].tagName;
                var text = $(this).text();
                xml += '<' + tagName + '>' + text + '</' + tagName + '>';
            });
            xml += '</field>';
        }
    })

    xml += '</fields></set></' + dataStore + '>';
    if (saveTable == undefined) {
        $.dialog.tips('数据集中未设置保存表名！');
        return;
    } else if (primaryKey[0].length == 0) {
        $.dialog.tips('1数据集中未设置主键！');
        return;
    } else {
        for (var pr = 0; pr < primaryKey[0].length; pr++) {
            var pri = primaryKey[1][pr];
            if (pri.length > 1) {
                xml = xml.replace('<tr rowstate="add">', '<tr rowstate="edit">');
            }
        }

    }
    return xml;
}

/**
 * form 保存前转换 和 验证 函数
 * @param val     传入的值
 * @param dsId    dataset的id
 * @param field   字段名
 * @return {*}    返回的值
 * @update
 * 2014-11-27 cl 对返回的值转义特殊字符
 */
function saveTrans(val, dsId, field) {

    var returnVal = val;
    for (var transI = 0; transI < fieldsTransInfo.length; transI++) {
        var fieldTransI = fieldsTransInfo[transI];
        if (fieldTransI[0] == dsId && fieldTransI[1] == field) {
            var transFunc = unescape(fieldTransI[2]);
            try {
                returnVal = eval(transFunc + "('" + returnVal + "')");
            } catch (e) {

            }
        }

    }
    for (var i = 0; i < fieldsIsNull.length; i++) {
        var valid = fieldsIsNull[i];

        if (valid[0] == dsId && valid[1] == field) {
            var validResult = undToSp(returnVal);
            if (validResult == '') {
                _saveValidResult = false;
                layer.closeAll('loading');
                $("#buttonSave").prop("disabled",false);

                layer.msg(valid[2] + '不能为空！');
            }
        }
    }
    for (var i = 0; i < fieldsValidInfo.length; i++) {
        var valid = fieldsValidInfo[i];
        if (valid[0] == dsId && valid[1] == field) {
            var tempFunc = new Function('return ' + valid[3]);
            var validResult = tempFunc.call({'value':returnVal, 'dsId':dsId, 'field':field, 'label':valid[2]});
            if (validResult == false) {
                _saveValidResult = false;
            }
            layer.closeAll('loading');
            $("#buttonSave").prop("disabled",false);
        }
    }



//  2015-8-11 hxt  add  提交时将 yyyy-mm-dd hh:mm yyyy-mm-dd hh形式 补充
    returnVal=changeSubDateValue(returnVal, dsId, field);

    return escapeXml(returnVal);
}

/**
 * xml转义特殊字符
 * @param val
 * @returns
 * @author cl
 * @since 2014-11-27
 */
function escapeXml(val){
    try{
        if(val.indexOf("<![CDATA[")==-1){
            val=val.replace(/&/g,'&amp;');
            val=val.replace(/</g,'&lt;');
            val=val.replace(/>/g,'&gt;');
            val=val.replace(/'/g,'&apos;');
            val=val.replace(/"/g,'&quot;');
        }
    }catch(e){
    }
    return val;
}
/**
 * xml反转特殊字符
 * @param val
 * @returns
 * @author cl
 * @since 2014-11-27
 */
function unescapeXml(val){
    try{
        if(val.indexOf("<![CDATA[")==-1){
            val=val.replace(/&amp;/g,'&');
            val=val.replace(/&lt;/g,'<');
            val=val.replace(/&gt;/g,'>');
            val=val.replace(/&apos;/g,"'");
            val=val.replace(/&quot;/g,'"');
        }
    }catch(e){
    }
    return val;
}


function IsSpace(strMain) {
    /**
     *判断是否为空
     **/
    var strComp = strMain;
    try {
        if (strComp == "　" || strComp == "" || strComp == " " || strComp == null || strComp == "null" || strComp.length == 0 || typeof strMain == "undefined" || strMain == "undefined") {
            return true;
        } else {
            return false;
        }
    } catch (e) {
        return false;
    }
}

/**
 *关闭当前表单
 *@date 2013年6月27日 14:12:53
 **/
function CloseBill() {


}

/**
 * 通过datastore的id取得它的主键、值
 * @param id
 */
function getPrimaryKey(id) {
    var primaryKey = [
        [],
        [],
        []
    ];       //[ [主键名] , [主键值] ,[是否被绑定了]]
    var data_format = $('#' + id).attr('format');
    data_format = newXml(data_format);

    $(data_format).find('primarykey').each(function (fieldIndex) {
        var text = $(this).text();
        if (text == '是') {
            var keyName = $(this).parent().find('fieldname').text();
            primaryKey[0].push(keyName);
        }
    });

    for (var j = 0; j < primaryKey[0].length; j++) {
        var key = primaryKey[0][j];
        var val = false;

        for (var i = 0; i < needLoadDataList.length; i++) {
            var DataList = needLoadDataList[i];
            if (DataList[2] == key) {
                if (DataList[4] == 'select') {
                    var controlValue = getValue(DataList[0], 'select');
                } else if (DataList[4] == 'listBox') {
                    var controlValue = [];
                    $('#' + DataList[0] + ' option').each(function () {
                        controlValue.push($(this).val());
                    })
                    controlValue = controlValue.toString();
                } else {
                    var controlValue = $('#' + DataList[0]).text();
                    if (controlValue == '') controlValue = $('#' + DataList[0]).val();

                }
                val = true;
                primaryKey[1].push(controlValue);
                primaryKey[2].push(true);
            }
        }

        if (val == false) {                     //如果页面中 没控件绑定 这个key
            var item;
            var submitKeyId;
            for (var i = 0; i < needLoadDataList.length; i++) {
                var o = needLoadDataList[i];     //[控件ID,datasetID,字段名,是否需要加数据,'类型']
                if (o[2] == 'grid' && o[1] == id) {
                    submitKeyId = window['grid_' + o[0]].getSelectedRowId();    //取选中的id
                }
            }
            if (submitKeyId == null) {
                submitKeyId = window['data_' + id].first();      // datastore 中的第一条的id
            }
            item = window['data_' + id].item(submitKeyId);
            if (item != undefined) {
                var keyVal = item[key];
            } else {
                var keyVal = '';
            }

            primaryKey[1].push(keyVal);
            primaryKey[2].push(false);

        }


    }
    return primaryKey;
}

function getPrimaryKeyVal(id) {
    return getPrimaryKey(id)[1][0];
}


/**
 * grid 新增一行
 * @param id   grid 的id
 * @param obj  新增的数据
 */
function gridAddRow(id, obj) {
    var DsId = $('#' + id).attr('dataset');
    var DS = getDs(DsId);
    var grid = getGrid(id);
    var nowId = new Date().getTime() + '';
    if (obj == undefined) obj = {};
    if (typeof obj != 'object') {
        alert('gridAddRow 方法传入的第二个参数必须为对象！');
        return;
    }
    obj.id = nowId;
    DS.add(obj);
    _gridAddId.push([DsId, nowId]);
    grid.selectRowById(nowId, true, true, true);
}

/**
 * 删除 grid 高亮的一行    -------- 注意 这个是前台的删除  不发送数据到后台
 * @param id   grid 的id
 */
function gridDelRow(id) {
    var DsId = $('#' + id).attr('dataset');
    var DS = getDs(DsId);
    var grid = getGrid(id);
    var id = grid.getSelectedRowId();
    var delItem = DS.item(id)
    _gridDelId.push([DsId, id, delItem]);
    DS.remove(id);
}

/**
 * 删除 grid 所有的数据    -------- 注意 这个是前台的删除  不发送数据到后台
 * @param id   grid 的id
 */
function gridDelAll(id) {
    var DsId = $('#' + id).attr('dataset');
    var DS = getDs(DsId);
    var grid = getGrid(id);
    var count = DS.dataCount();
    var itemIds = [];
    for (var i = 0; i < count; i++) {
        var id = DS.idByIndex(i);
        itemIds.push(id);
    }
    for (var i = 0; i < itemIds.length; i++) {
        var id = itemIds[i];
        var delItem = DS.item(id)
        _gridDelId.push([DsId, id, delItem]);
        DS.remove(id);
    }

}

/**
 * 删除 grid 高亮的一行    -------- 注意 这个马上  发送数据到后台   删除这一行
 * @constructor
 */
function DelGridRow() {

    for (var i = 0; i < needLoadDataList.length; i++) {
        var o = needLoadDataList[i];
        if (o[2] == 'grid') {
            var id = window['grid_' + o[0]].getSelectedRowId();
            if (id != null) {
                $.dialog.confirm('你确定要删除这条数据吗？', function () {
                    var key = getPrimaryKey(o[1]);
                    var tableName = $('#' + o[1]).attr('savetable');

                    var xml = "<root><delete tableName='" + tableName + "' ><where>";
                    for (var j = 0; j < key[0].length; j++) {
                        var name = key[0][j];
                        var val = window['data_' + o[1]].item(id)[name];
                        xml = xml + name + "='" + val + "' and ";
                    }
                    xml = xml.substr(0, xml.length - 5);
                    xml += "</where></delete></root>";
                    $.ajax({
                        type       :"POST",
                        url        :project + "/servlet/WebBill?key=doSaveData",
                        processData:false,
                        data       :xml,
                        contentType:'utf-8',
                        success    :function (msg) {
                            if (msg.match('errInfo') != null) {
                                $.dialog.tips(msg);
                            } else {
                                $.dialog.tips('删除成功！');
                                window['data_' + o[1]].remove(id);
                            }

                        },
                        error      :function (msg) {
                            $.dialog.tips('访问后台失败！')
                        }
                    });
                });
            } else {
                $.dialog.tips('至少选中一行！');
            }
        }
    }
}

/**
 * 删除 grid 中 checked的行
 * @constructor
 */
function DelGridMutRow() {
    for (var i = 0; i < needLoadDataList.length; i++) {
        var o = needLoadDataList[i];
        if (o[2] == 'grid') {
            var id = window['grid_' + o[0]].getCheckedRows(0);
            if (id.length > 0) {
                id = id.split(',');
                $.dialog.confirm('你确定要删除这些数据吗？', function () {
                    var key = getPrimaryKey(o[1]);
                    var tableName = $('#' + o[1]).attr('savetable');

                    saveTable=parseSaveTable(saveTable); //hxt add

                    var xml = "<root><delete tableName='" + tableName + "' ><where>";
                    for (var j = 0; j < id.length; j++) {
                        var nid = id[j];
                        xml += '(';
                        for (var k = 0; k < key[0].length; k++) {
                            var name = key[0][k];
                            var val = window['data_' + o[1]].item(nid)[name];
                            xml = xml + name + "='" + val + "' and ";
                        }
                        xml = xml.substr(0, xml.length - 5);
                        xml += ')or';
                    }
                    xml = xml.substr(0, xml.length - 2);

                    xml += "</where></delete></root>";
                    $.ajax({
                        type       :"POST",
                        url        :project + "/servlet/WebBill?key=doSaveData",
                        processData:false,
                        data       :xml,
                        contentType:'utf-8',
                        success    :function (msg) {
                            if (msg.match('errInfo') != null) {
                                $.dialog.tips(msg);
                            } else {

                                layer.msg('删除成功！');
                                window['data_' + o[1]].remove(id);
                            }

                        },
                        error      :function (msg) {
                            $.dialog.tips('访问后台失败！')
                        }
                    });
                });
            } else {
                layer.msg('至少选中一行！');

            }
        }
    }
}


function getDefaultVal(field) {
    var fieldVal = '';
    for (var i = 0; i < dsDefaultVal.length; i++) {
        var fieldObj = dsDefaultVal[i];     //[字段名,默认值,默认值的方法]
        if (fieldObj[0] == field) {
            var defaultvalue=fieldObj[2];
            try{
                defaultvalue=eval(defaultvalue);
            }catch (e){
                defaultvalue=defaultvalue;
            }
            fieldVal = defaultvalue;
        }

    }
    return fieldVal;
}

/**
 * 获取控件的值
 * @param id    -- 控件的id
 * @param type  -- 控件的类型
 * @return {String}
 */
function getValue(id, type) {
    var value = '';

    switch (type) {
        case 'select':
        {
            value = getSelSubmitData(id);
            break;
        }
        case 'label':
        {
            value = $('#' + id).text();
            break;
        }
        case 'radio':
        {
            value = getRadioValue(id);
            break;
        }
        case 'checkbox':
        {

            value = getCheckBoxValue(id);
            break;
        }
        case 'editor':
        {
            value = getEditorVal(id);
            break;
        }
        case 'checkBoxlist':
        {
            value = getCheckBoxListValue(id);
            break;
        }
        default :
        {
            value = $('#' + id).val();



        }
    }
//	var reg=new RegExp("\n","g");
//	value= value.replace(reg,"\r");
    return value;
}





function getSelSubmitData(sid) {
    var controlValue = '';
    var select = $('#sel_' + sid);
    var type = select.is('select');
    if (type) {
        controlValue = select.val();
        return controlValue;
    }
    var selSubType = undToSp($('#' + sid).attr('FieldNameList'));
    switch (selSubType) {
        case 'id':
        {
            controlValue = getSelectVal(sid);
            break;
        }
        case 'text':
        {
            controlValue = getSelectText(sid);
            break;
        }
        case 'fatherId':
        {
            controlValue = getSelectParentId(sid);
            break;
        }
        default:
        {
            controlValue = getSelectHidVal(sid, selSubType);
            break;
        }

    }
    return controlValue;
}
/**
 * 刷新 父页面
 */
function refreshUpGrid() {
    window.parent.refreshDS();
}



/**
 * 初始化工作流
 * @param wfName      -- 流程名称
 * @param wfVersion   -- 流程版本
 */
function startAndDoWf(wfName,  wfVersion,callBack) {
    if(validForm()==false) return;
    $.dialog.tips('初始化流程中！', 2);
    var sKey = "/servlet/WorkflowPortal?operate=init_workflow&wf_name=" + wfName + "&wf_version=" + wfVersion;
    var project = window.top.project;
   
    var servletPath = project;
    project += '/form';
    $.ajax({
        type       :"POST",
        url        :servletPath + sKey,
        processData:false,
        data       :"<root></root>",
        contentType:'utf-8',
        success    :function (msg) {
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
                //根据	<stage>init,step</stage>来判断调用那个页面
                //=init 有多个初始化action，列表让用户选择个执行，流程未初始化，没得到wfid(流程实例id)
                var stage = $(oDom).find('stage').text();
                if (stage == "init") {
                    return;
                }
                //=step 只有一个初始化的action,后台已经执行了此action，即流程已经初始化了，得到了wfid(流程实例id)
                if (stage == "step") {
                    var num = $(oDom).find('num').text(); //步骤的当前可执行的 action数量
                    var wfId = $(oDom).find('wfId').text();//流程实例id
                    var action = $(oDom).find("action");
                    var actionId = undToSp(action.attr("id"));
                    var actionName = undToSp(action.attr("name"));
                    var traceId = undToSp(action.attr("traceId"));
                    var dynamicInstanceId = undToSp(action.attr("dynamic_instance_id"));
                    staticValue.wfId=wfId;
                    staticValue.wfVersion=wfVersion;
                    staticValue.actionId=actionId;
                    staticValue.traceId=traceId;
                    var sKey = "wf_id=" + wfId + ";action_id=" + actionId;
                    sKey += ";save_type=1";// 增加提交类型控制提交完成后的显示
                    if (typeof(dynamicInstanceId) != "undefined" && dynamicInstanceId != null && dynamicInstanceId != "undefined" && dynamicInstanceId != "null")
                        sKey += ";dynamic_instance_id=" + dynamicInstanceId;
                    isWorkflow = true;
                    wfUserType = "workflow_do_action";
                    wfPubParam = sKey;
                    doSubmitData(function () {
                        if (typeof (callBack) == "function") {
                            callBack();
                        }
                        $.dialog.tips("提交数据成功!");
                        window.setTimeout(function(){
                            try{
                                if(ParentIframe.SimpleSearch){
                                    ParentIframe.SimpleSearch();
                                }
                                window.top.closeWin('workflow');
                            } catch(e){

                            }
                        },500);

                    });
                    return;

                }

            }

        }
    });
}
/**
 * 工作流暂存
 */
function wftools_tempSave() {
    var wfId = QueryURL.GetValue('wfId');
    if (undToSp(wfId) == '') {
        alert("流程实例还未启动，不能做业务数据的暂存！");
        return;
    }
    var wfName = QueryURL.GetValue('wfName');
    var wfDesc = unescape(QueryURL.GetValue('wfDesc'));
    var wfVersion = QueryURL.GetValue('wfVersion');
    var actionId = QueryURL.GetValue('actionId');
    var dynamicInstanceId = QueryURL.GetValue('dynamicInstanceId');

    if (QueryURL.GetValue('show') == "true") {
        alert("执行过的动作，不能做暂存操作！");
        return;
    }
    if (QueryURL.GetValue('show') == "copy") {
        alert("抄送的任务信息，不能做暂存操作！");
        return;
    }
    isWorkflow = true;
    wfUserType = 'before_temp_check';
    var sKey = "wf_id=" + wfId + ";action_id=" + actionId;
    if (typeof(dynamicInstanceId) != "undefined" && dynamicInstanceId != null && dynamicInstanceId != "undefined" && dynamicInstanceId != "null")
        sKey += ";dynamic_instance_id=" + dynamicInstanceId;
    wfPubParam = sKey;
    doSubmitData(function () {
        $.dialog.tips("提交数据成功!");
    });
}

/**
 * 工作流 提交业务数据并执行流程
 */
// *************************************************************
// 功能描述： 工作流工具条按钮对应的功能函数 执行
// 参数描述： 带流程的保存，保存业务记录，并执行流程的action
// 提交业务数据并执行流程 typeof(type)="undefined" 并列出有执行权限的下一步动作。
// 提交业务和流程后转下一步 type="1"
// 提交业务和流程后关闭窗口 type="2"
// 提交业务和流程后无 type="3"
function wftools_save(callBack) {
    var wfId = QueryURL.GetValue('wfId');
    if (undToSp(wfId) == '')
        wftools_save_nowfid(callBack); else
        wftools_save_wfid(callBack, wfId);
}


// 无wfId的保存，保存业务记录并执行初始化流程得到wfId,并执行流程的第一个步骤的指定动作(actionId)
// 在url中带有initActionId,wfName,wfVersion,escape(wfDesc),actionId,dynamicInstanceId
// 直接打开表单的形式，表单提交的时候启动流程
function wftools_save_nowfid(type) {
    var wfName = QueryURL.GetValue('wfName');
    var wfDesc = unescape(QueryURL.GetValue('wfDesc'));

    var wfVersion = QueryURL.GetValue('wfVersion');

    var actionId = QueryURL.GetValue('actionId');

    var dynamicInstanceId = QueryURL.GetValue('dynamicInstanceId');

    var initActionId = QueryURL.GetValue('initActionId');// 初始化动作id


    var sKey = "wf_name=" + wfName;
    sKey += ";wf_version=" + wfVersion;
    sKey += ";init_actionid=" + initActionId;
    sKey += ";action_id=" + actionId
    sKey += ";save_type=" + type;// 增加提交类型控制提交完成后的显示
    isWorkflow = true;
    wfUserType = "eform_inital_workflow";
    wfPubParam = sKey;
    doSubmitData(function () {
        $.dialog.tips("提交数据成功!", 2);
        if (typeof (type) == "function") {
            type();
        }
    });
}

// 有wfid的保存，保存业务记录并执行流程动作，在url中带有wfName,wfVersion,escape(wfDesc),actionId,dynamicInstanceId
function wftools_save_wfid(callBack, wfId) {
    var wfName = QueryURL.GetValue('wfName');
    var wfDesc = unescape(QueryURL.GetValue('wfDesc'));
    var wfVersion = QueryURL.GetValue('wfVersion');
    var actionId = QueryURL.GetValue('actionId');
    var dynamicInstanceId = QueryURL.GetValue('dynamicInstanceId');
    // 访问后端，执行doAction() 增加 提交当前表单并执行 actionId的 保存方法
    // 重做 保存函数 实现三个功能：保存当前的记录；将一些信息保存到ps变量里面；执行doAction方法；
    // 返回：下一步骤名，可执行的动作列表
    var sKey = "wf_id=" + wfId + ";action_id=" + actionId;
    sKey += ";save_type=1";// 增加提交类型控制提交完成后的显示
    if (typeof(dynamicInstanceId) != "undefined" && dynamicInstanceId != null && dynamicInstanceId != "undefined" && dynamicInstanceId != "null")
        sKey += ";dynamic_instance_id=" + dynamicInstanceId;
    // 准备自由流设置
    try {
        var selFree = $("#sel_wf_free_select");
        if (selFree.length == 1) {
            var freeStepId = selFree.val();
            if (undToSp(freeStepId) != '请选择自由流') {
                var freeShow = selFree.text();
                var freeType = freeShow.substring(0, 3);

                if (freeType == "回退到")
                    freeType = "last"; else
                    freeType = "next";

                if (freeType != null && freeStepId != null) {
                    sKey += ";free_type=" + freeType + ";free_stepid=" + freeStepId;
                }
            }
        }
    } catch (e) {
    }
    if (QueryURL.GetValue('show') == "true") {
        alert("执行过的动作，不能再执行了！");
        return;
    }
    if (QueryURL.GetValue('show') == "copy") {
        alert("抄送的任务信息，不能再执行了！");
        return;
    }
    isWorkflow = true;
    wfUserType = "workflow_do_action";
    wfPubParam = sKey;
    doSubmitData(function () {
        if (typeof (callBack) == "function") {
            callBack();
        }
        $.dialog.tips("提交数据成功!");
    });
}

/**
 * 显示 流程轨迹图
 */
function wftools_trace() {
    var wfId = QueryURL.GetValue('wfId');
    if (undToSp(wfId) == '') {
        layer.msg("流程实例还未启动，不能查看轨迹！");
        return;
    }
    showWfHistory(wfId);
    // 查看流程的历史步骤
}

/**
 * 验证这个表单
 */
function validForm(){
    _saveValidResult=true;
    var validResult='';
    for (var i = 0; i < datastoreList.length; i++) {
        if(_saveValidResult==false) return false;
        var dsIs = datastoreList[i];
        validResult=validDsById(dsIs);
    }
    if(_saveValidResult==false) return false;
    return true;
}
function validDsById(DsId){
    var thisDsHtml = $('#' + DsId);
    var format = thisDsHtml.attr('format');
    var data_format = newXml(format);
    $(data_format).find('field').each(function () {
        if(_saveValidResult==false) return false;
        var fieldname = $(this).find('fieldname').text();
        var fieldVal = '';
        fieldVal = getDefaultVal(fieldname);            //保存时先获取字段默认值
        for (var i = 0; i < needLoadDataList.length; i++) {
            var ctrl = needLoadDataList[i];     //[控件ID,datasetID,字段名,是否需要加数据,'类型']
            if (ctrl[1] == DsId && ctrl[2] == fieldname) {
                fieldVal = getValue(ctrl[0], ctrl[4]);
            }
        }
        fieldVal = saveTrans(fieldVal, DsId, fieldname);
    })
}


