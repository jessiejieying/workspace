var currentStepData=[];
//参数配置表
avalon.config({
    debug: false
});

var model = avalon.define({
    $id: "wrap",
    headList:[],
    dataList:[],
    listNode:[],
    sure:function(){
        layer.msg("此保存暂无效果");
    },
    tableContentDiv:{
        'margin-top':'48px',
        'height':'430px',
        'overflow':'scroll'
    },
    tableHeader:{
        "position":"fixed",
        "left":"10px",
        "top":"36px",
        'border':'2px solid #98cef4',
        'width':"1113px"
    },
    noRecord:"加载中...",
    inputChange:function(e){
        var checked = e.target.checked;
    },
    currentStep:function(obj){
        var avaTitle=obj.name;
        currentStepData.length=0;

        model.listNode.forEach(function(value){
            for(var i= 0,max=value.status.length;i<max;i++){
                if(value.status[i].stepId===obj.id){
                    currentStepData.push({
                        'nodename':value.status[i].nodeName,
                        'stepid':value.status[i].stepId,
                        'check':value.status[i].check,
                        'nodeid':value.status[i].nodeId
                    });
                    break;
                }
            }
        });

        var message = layer.open({
            type: 1,
            title: avaTitle,
            area: ["651px", "321px"],
            content: $("#exportFieldHtml").html(),
            success: function (layero, index) {
                $("#exportFieldHtmlIn").html(_.template($('#exportField').html()));

                //确定
                $("#sure_field_selection").click(function(){
                    page.loadStart();
                    var url=project+"/admin/documentBill/saveBillAuthBatch.action";
                    var billFieldData=[],
                        authData=[],
                        stepIdData;
                    $("#exportFieldHtmlIn .js-field-selection").each(function(){
                        var $this=$(this);
                        stepIdData=$this.data("stepid");
                        billFieldData.push($this.data("nodeid"));
                        authData.push($this.prop("checked"));
                    });
                    $.post(url,{
                        "wfName":page.pageParam.wfName,
                        "billId":page.pageParam.billId,
                        "stepId":stepIdData,
                        "billField":billFieldData.join(","),
                        "auth":authData.join(",")
                    },function(data){

                        //同步更新外层的checked状态
                        var postData=[];
                        authData.forEach(function(val,index){
                            postData.push({
                                'nodeid':billFieldData[index],
                                'checked':val
                            });
                        });

                        postData.forEach(function(value){

                            for(var i= 0,max=model.listNode.length;i<max;i++){
                                if(model.listNode[i].id===value.nodeid){

                                    model.listNode[i].status.forEach(function(val,indexIn){
                                        if(val.stepId==stepIdData){

                                            model.listNode[i].status[indexIn].check=value.checked;
                                        }
                                    });

                                    break;
                                }
                            }

                        });
                        page.loadEnd();
                        layer.closeAll("page");
                    });

                });
                //全部选中
                $("#checked_all").click(function(){
                    $("#exportFieldHtmlIn .js-field-selection").prop("checked",true);

                });
                //全部取消
                $("#cancel_all").click(function(){
                    $("#exportFieldHtmlIn .js-field-selection").prop("checked",false);
                });
            }
        })
    }
});

var page=(function(){

    var obj={
        init:function(){
            this.loadStart();
            this.loadData();
        },
        loadStart:function(){
            var index = layer.load(2,{
                // shade: [0.5, '#000']
                //scrollbar: false //0.1透明度的白色背景
            });
            setTimeout(function(){
                obj.loadEnd();
            },2000);
        },
        loadEnd:function(){
            layer.closeAll('loading');
        },
        pageParam:{
            "billId":$urlParam("billId"),
            "wfName":$urlParam("wfName")
        },
        loadData:function(){
            var nodeUrl=project+"/admin/wfManage/getWfSteps.action"+"?etc="+new Date().getTime()+"&wfName="+(obj.pageParam.wfName);
            var nodeNameUrl=project+"/admin/documentBill/getBillInfo.action"+"?etc="+new Date().getTime()+"&documentBill.id="+(obj.pageParam.billId);
            var headData=[],
                listNode=[];
            $.getJSON(nodeUrl,function(data){
                var result=data.datas;

                if(result.length>0){
                    result.forEach(function(value){
                        if(value.name!=="结束节点"){
                            headData.push({
                                "id":value.id,
                                "name":value.name
                            });
                        }
                    });
                }
                model.headList.clear;
                model.headList=headData;

                $.getJSON(nodeNameUrl,function(data){
                    var billContent=eval((data.datas.billContent));

                    if(billContent.length>0){
                        billContent.forEach(function(value,index){
                            listNode.push({
                                id:value.id,
                                title:value.title,
                                status:[]
                            });
                            headData.forEach(function(val){
                                listNode[(index)].status.push({
                                    check:false,
                                    nodeName:value.title,
                                    nodeId:value.id,
                                    stepId:val.id,
                                    stepName:val.name
                                })
                            });
                        });

                        var nodeStatusUrl=project+"/admin/documentBill/getBillAuthInfo.action?etc="+new Date().getTime();
                        $.getJSON(nodeStatusUrl,{
                            "wfName":obj.pageParam.wfName,
                            "billId":obj.pageParam.billId
                            }, function(result){

                            var resultDatas=[];
                            if(result.datas.length){
                                //过滤被选中的元素 返回resultDatas
                                resultDatas=result.datas.filter(function(filterValue){
                                    return filterValue.auth==="true";
                                });

                                resultDatas.forEach(function(value){

                                    listNode.forEach(function(val){
                                        if(val.id===value.bill_field){
                                            val.status.forEach(function(invalue){
                                                if(invalue.stepId===value.step_id){
                                                    invalue.check=true;
                                                }

                                            });


                                        }
                                    });

                                });
                            }

                            model.listNode.clear;
                            model.listNode=listNode;
                            page.loadEnd();
                            
                            var $width=parseInt($("#tableContent")[0].scrollWidth);
                            model.tableHeader.width=$width+"px";

                        });
                    }


                });
            });


        }
    }
    return obj;
})();

$(function() {

    page.init();

    $(document).on("change",".js-input",function(){
        var $this=$(this);
        page.loadStart();
        var url=project+"/admin/documentBill/saveBillAuth.action";
        $.post(url,{
            "wfName":page.pageParam.wfName,
            "billId":page.pageParam.billId,
            "stepId":$this.data("stepid"),
            "billField":$this.data("nodeid"),
            "auth":$this.prop("checked")
        },function(data){
            page.loadEnd();

        });
    })
});