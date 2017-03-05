/*
 * eden-aufw 首页方法集
 * createWindow、createTab
 * 需要jquery、dhtmlx框架
 */

if(!window.global)  var global = {};//全局对象
if(!base) var base = '/eden';
	
var _edenInfo={_selfId: "topFrame", parentWinId: 'none'}; //用于 createWindow方法

global.window_num = 0;//当前打开的窗口的数量
var edHeader,edMain, edFooter, edUser, edContacts , edTabContent , edTabs , edTabControl  ;
edHeader = $('#ed_header');
edMain = $('#ed_main');
edFooter = $('#ed_footer');
edUser = $('#ed_user');
edContacts = $('#ed_contacts');
edContactsTitle = $('#ed_contacts_title');
//edTabs = $('#ed_tabs');
edTabControl = $('#ed_tabs_control');
edTabContent = $('#ed_tab_content');

//totalCount 代分 totalCount1 在办 totalCount2 代办 totalCount3传阅
var circlrTip=[
	{
		"totalCount2":"oa_daiban_document",
        "totalCount":"oa_waiting_document",
        // "totalCount1":"oa_zaiban_document",
        "totalCount3":"oa_chuanyue_document",
		//收文
		"totalCount2_incoming":"oa_incoming_noDo",
		//发文
		"totalCount2_sending":"oa_sd_document_noDo",
		"totalCount4_copySend":"oa_document_copy_send"
	},
	{
		//"totalCount":"meetingManager_todo",
        // "totalCount1":"meetingManager_doing",
        "totalCount2":"meetingManager_todo",
        "totalCount4":"hall_regist"
	},
	{
		"totalCount2":"instruction_todo",
        // "totalCount1":"instruction_doing",
        "totalCount3":"instruction_pass",
		"totalCount6":"instruction_todo_0",
		"totalCount7":"instruction_todo_1",
		"totalCount8":"instruction_todo_2"
	},
    {
       // "totalCount":"oa_sptrain_message_2"
        "totalCount2":"oa_sptrain_message_1",
        // "totalCount1":"oa_sptrain_message_2",
        "totalCount3":"oa_sptrain_message_read"
    }
];
var circlrTipPolling;
/*
 * 首页布局
 */
function pageLayout() {
	var winWidth = $(window).width();
	var winHeight = $(window).height();
	var mainHeight = winHeight -$("#ed_header").height();
	var leftSwitch=$('.ed-left-switch').closest(".ed-left").height();
	$('.ed-content-pane').height(mainHeight);
	$('.ed-right-iframe').height(mainHeight);
	//$('.ed-left-switch').height(leftSwitch);
	$('#ed_contacts_switch').height(mainHeight);

	edTabContent.width(winWidth);
	edMain.height(mainHeight);
	edUser.height(mainHeight);
	edContacts.height(mainHeight);
}

/*
 * 左侧显示2、3级菜单后点击2级菜单展开3级
 */
function leftManu(){
  $(".ed-left-nav > li").click(function(ev) {
		var $this=$(this);
         var $noteTip=$this.find(".js-li-note-tip");
      if($noteTip.length){
          noteTipWaiting();
      }


		$this.addClass('on').children('ul').slideDown(1000);
		$this.siblings("li").removeClass('on').children('ul').slideUp(200);

	  //自动定位子节点的第一个
	  if($this.find("li").length){
		  $this.find("li").removeClass('on').eq(0).addClass("on");
	  }

  });
  $(".ed-left-nav > li > ul >li").click(function(event) {
	  event.stopPropagation();
		var $this=$(this);

		$this.siblings("li").removeClass('on');
		$this.addClass('on');


  });
}
/*
 隐藏ed-left的滚动条
 */
function hidescrollbar(){
	$(".ed-left").niceScroll({cursoropacitymax:0,cursorborder:"none" });
	$(".ed-left").getNiceScroll().hide();

}
/*
 * 左侧显示2、3级菜单，点击可隐藏显示左侧菜单
 */
function leftSwitch(id,inframeId) {

	var leftMenuWidth = $('#'+id+'').parent().width();
	$('#'+id+'').click(function(){


		var $this=$(this),
				switchWidth=$this.width(),
				edLeft=$this.closest(".ed-left"),
		    edRight=$this.closest(".js-page-tab").find(".js-ed-right");

		if($this.hasClass('switch-2')){
			edLeft.width(leftMenuWidth);
			var patentNextW = edRight.width();
			edRight.width(patentNextW - leftMenuWidth + 10);
			$this.next(".js-ed-left-nav").show();
			pageLayout();
			$this.addClass('switch-1').removeClass('switch-2');
		}else{
			edLeft.width(switchWidth);
			var patentNextW = edRight.width();
			edRight.width(patentNextW + leftMenuWidth - 10);
			$this.next(".js-ed-left-nav").hide();
			pageLayout();
			$this.addClass('switch-2').removeClass('switch-1');
		}

		//inframe右侧 tablefixed改变宽度
    var fixedTable=$(window.frames[inframeId].document).find(".bsgrid-header");
		fixedTable.each(function(){
			var $this=$(this);
			var tableGird=$this.closest(".js-fixed-father").find(".bsgrid"),
					tableheaderFixed=$this;

			// var $width=parseInt($(tableGird).width() + 1);
			// //ie8
			// if(navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion .split(";")[1].replace(/[ ]/g,"")!="MSIE8.0"){
			// 	$width=parseInt($(tableGird).width())-1;
			// }
            //
			// $(tableheaderFixed).width($width);
			var $tableFather=$(tableGird).closest("div");

			$(tableheaderFixed).outerWidth($tableFather[0].scrollWidth);

		});

	})
}

/**
 * 创建新弹出窗
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
            //alert(index)
			var childWindow = $(layero).find('iframe')[0].contentWindow;
			childWindow.parentIfr = parentIfr;
			}


	});
	//是否全屏

	if (obj.afterLoad) {
		if(typeof obj.afterLoad=='function'){
			window[obj.id+'_afterLoad']=obj.afterLoad;
		}else{
			alert('callBack应为 function');
		}
	}

}
 
/*
 *关闭弹出窗口
 */
function closeWin(id) {
  dhxWins.window(id).close();
}


/**
 * 根据模块id 返回模块所在的iframe的 window对象
 * @param moduleId      模块id
 * @return {window}
 */
function getModuleFrame(moduleId){
  if($('#'+moduleId+'_iframe').length>0){
    return $('#'+moduleId+'_iframe')[0].contentWindow;
	}
}

/**
 *创建tab页面
 *@param {Object} id,text,titleLength,contentType,closeType,url
 *@return {*}
 */
function createTab(obj){
  if (!obj.id) obj.id = new Date().getTime();
  if (!obj.text) obj.text = "榕基软件";
  if (!obj.openType) obj.openType = 2 ;
  if (!obj.contentType) obj.contentType = 1;
  if (!obj.closeType) obj.closeType = 1;
  if (!obj.titleLength) obj.titleLength = 0;
  if (!obj.scrolling) obj.scrolling = 'auto';

  var id = obj.id;

	//移除标签内页
	$(".js-page-tab").remove();

	//取消原选中区域选中状态
		edTabContent.find('.active').eq(0).removeClass('active');
	//添加内容区
		edTabContent.append('<div class="tab-pane ed-content-pane active js-page-tab" id="content_'+obj.id+'"></div>');

		switch(obj.openType){
			case '11':{
				
				//如果open-type为11，载入左侧菜单，右侧iframe
				
				//组装tab页主体左右结构，菜单+iframe

				$('#content_'+obj.id).append('<div class="ed-left" id="left_'+ obj.id +'">'
						+'<div class="ed-left-switch switch-1" id="switch_'+obj.id+'"></div>'
						+'<div class="ed-left-nav-ul-box js-ed-left-nav-ul-box"><ul class="nav nav-list ed-left-nav js-ed-left-nav"></ul></div>'
						+'</div>'
						+'<div class="ed-right js-ed-right">'
//						+'<ul class="oa-bread clearfix js-oa-bread"><li><a href="javascript:void(0)" class="">当前位置：</a></li></ul>'
						+'<iframe allowtransparency="true" name="iframe_'+obj.id+'" id="iframe_'+obj.id+'"'
							+'class="ed-right-iframe" frameborder="0" src="'+obj.url+'"'
							+'width="100%" height="100%" scrolling="'+obj.scrolling+'">'
						+'</iframe>'
						+'</div>');
				
				var oUrl = obj.url;
				$('.ed-right').width($(window).width()-$('#left_'+ obj.id +'').width()-1);
				var menuList = $(obj.menuObj).children().children();
			
				var navHtml = "";
				menuList.each(function(index){
						var MLChildrenI = "";
						var MLChildrenHtml = "";
						var aHref = "";     //li a的链接
						var active = "";    //选中状态
						var aUrl = "";      //iframe默认链接
						var noteTip="";
						var $liId=$(this).attr('module-id');
						if($(this).children().eq(1)[0]){
							MLChildrenI = '<i class="icon-angle-double-right i-arrow-right"></i>'
							var MLChildren =  $(this).children().eq(1).children();
							var MLChildrenLi = "";
							var indexOn = index ;
							for(var i=0;i<MLChildren.length;i++){
								var liOn = "";
								if (indexOn==0 && i==0){
									liOn = 'class="on"'
								}						
							   
							   var $textTile=trimAll(MLChildren.eq(i).text());

                                var $target=parseInt($(this).attr('open-type'))===1?'_blank':'iframe_'+obj.id;
								MLChildrenLi = MLChildrenLi +
								  '<li title="'+($textTile)+'" id="'+MLChildren.eq(i).attr('module-id')+'" '+liOn+'>'+
								  '<a class="js-nav-level" href="'+MLChildren.eq(i).attr('module-url')+'"  target="'+$target+'">'+MLChildren.eq(i).text()+'<div class="main-note-tip js-li-note-tip" style="display: none"></div>'+'</a></li>'
								}
							//三级菜单
							MLChildrenHtml = '<ul class="nav nav-list">'+MLChildrenLi+'</ul>';
							}

						if(MLChildrenHtml==""){
							aHref = 'href="'+$(this).attr('module-url')+'"';
						    aUrl = $(this).attr('module-url');

						}else{
							aHref='href="'+ $(this).children().eq(1).children().eq(0).attr('module-url')+'"';
							aUrl = $(this).children().eq(1).children().eq(0).attr('module-url');
						}
						if(index == 0) {
							if(oUrl == ''){
								$('#iframe_'+obj.id+'').attr('src', aUrl);
							}
							active = ' class="on"';
						}									
						circlrTip.forEach(function(e){
							for(var m in e){
								if(e[m]==$liId){

									noteTip="<div class='main-note-tip js-li-note-tip'></div>";
									//break;
								}
							}
					});


                        var $target=parseInt($(this).attr('open-type'))===1?'_blank':'iframe_'+obj.id;


			    //组装左侧菜单(二级菜单)
              var $licontent=trimAll($(this).children().eq(0).text());
						$('#left_'+obj.id+'').find(".js-ed-left-nav").append('<li'+active+' id="'+$(this).attr('module-id')+'" title="'+$licontent+'"><a class="js-nav-level" '+aHref+' target="'+$target+'">'+MLChildrenI+$(this).children().eq(0).text()+noteTip+'</a>'+MLChildrenHtml+'</li>');

						}
				)
				leftManu();
				leftSwitch('switch_'+obj.id+'','iframe_'+obj.id);
				break;
			}
			case '12': {
				//如果open-type为2,打开一个iframe
				var content = obj.html;
				$('#content_'+obj.id).append(content);
				break;
			}
            //新的标签页打开
            case '1': {
                var surl=obj.url;
                window.open(surl);
                break;
            }
			default:{
				//打开一个iframe
				$('#content_'+obj.id).append('<iframe allowtransparency="true" name="iframe_'+obj.id+'" id="iframe_'+obj.id+'"'
						+'class="ed-right-iframe" frameborder="0" src="'+obj.url+'"'
							+'width="100%" height="100%" scrolling="'+obj.scrolling+'"></iframe>');

				if(obj.scrolling == 'perfect_scrollbar'){
					"use strict";
					$('#iframe_'+obj.id+'').load(function() {
					  var contentIframe = $(this).contents();
					  var documentIframe = contentIframe.get(0);
					  var contentIframeH = contentIframe.height();
					  var contentIframeW = contentIframe.width();

					  $('body', documentIframe).height(contentIframeH)
								.width(contentIframeW)
								.css('postion','relative')
								.perfectScrollbar();

					});
				}
			}
		}
		pageLayout();

}

/**
 * 显示代办的信息
 */

function noteTipWaiting(){

	var activeId=$("#top_nav .active").attr("module-id");
	var url;
    var totalObj;


    headerTipInfor();

    //公文
	if(activeId=="oa_document_manage"){
        totalObj=circlrTip[0];
		 url=base+"/admin/incoming/getIncomingSum.action?etc="+new Date().getTime()+"&wfType=noDo";
		 
	}
    //会议
	else if(activeId=="meetingManager"){
        totalObj=circlrTip[1];
		url=base+"/admin/meeting/countMeetingInfoNoDo.action?etc="+new Date().getTime();
	}
    //领导批示
	else if(activeId=="leader_instruction"){
        totalObj=circlrTip[2];

        url=base+"/admin/instruction/instCount.action?etc="+new Date().getTime();
	}
    //专项事务
    else if(activeId=="oa_sptrain_message"){
        totalObj=circlrTip[3];
        url=base+"/admin/sptrain/getIncomingSum.action?etc="+new Date().getTime();
    }
    else{
        return;
    }
		$.getJSON(url,function(data) {


                for(var i in data){
                    var $key= i,
                        $val=data[i];

                     var $id=totalObj[i];

                    $("#"+$id).find(".js-nav-level").find(".js-li-note-tip").eq(0).text(overTopNum($val)).show();
                    if($val<1){
                        $("#"+$id).find(".js-nav-level").find(".js-li-note-tip").eq(0).text($val).hide();
                    }

                }

			});

}

function overTopNum(string){
    if(parseInt(string)>999){
        return "99+";
    }
    return string;
}

//获取顶部顶部信息
function headerTipInfor(){


    var urlData=["/admin/incoming/getIncomingSum.action?etc="+new Date().getTime()+"&wfType=noDo","/admin/meeting/countMeetingInfoNoDo.action?etc="+new Date().getTime(),"/admin/instruction/instCount.action?etc="+new Date().getTime(),"/admin/sptrain/getIncomingSum.action?etc="+new Date().getTime()],
        idData=["oa_document_manage","meetingManager","leader_instruction","oa_sptrain_message"];

    urlData.forEach(function(value,index){

        $.getJSON(base+value,function(data){
            var totalNum=data.totalCount2;

            $(".js-top-li").each(function(){

                var $this=$(this),
                    moduleId=$this.attr("module-id");
                if(moduleId==idData[index]){
                    var $topLi=$this.find(".js-header-tip");
                    if($topLi.length){
                        $topLi.remove();
                    }
                    if(parseInt(totalNum)){
                        $this.append('<div class="main-header-note-tip js-header-tip">'+overTopNum(totalNum)+'</div>');
                    }
                }
            });

        })

    });
}

/**
 * 日程
 */
function mySchedule(obj){
	if(!obj.url) obj.url = base + '/admin/schedule/showSchedule.action';
	var myCalendar;
	var nowD = new Date();
			now = nowD.format('yyyy-MM-dd');
	var nowYear = nowD.format('yyyy');
	var nowMonth = nowD.format('MM');
	var nextMonth = parseInt(nowMonth) + 1;
	if(nextMonth<10) {
		nextMonth = '0' + nextMonth;
	}else if(nextMonth>12){
		nextMonth = '01';
	}

	myCalendar = new dhtmlXCalendarObject('calendarHere');
	myCalendar.hideTime();
	myCalendar.show();
	myCalendar.setDate(now);

	$.ajax({
		type: 'get',
		dataType: 'json',
		url: obj.url + '?timeshift=-480&from=' + nowYear +'-'+ nowMonth + '-01&to=' + nowYear +'-'+ nextMonth + '-01&ect='+new Date().getTime(),
		data: '',
		success: function(data) {
			var l = data.length;
			if(l>0) {
				for(i=0; i<l; i++) {
					var dataa = data[i];
					var endDate = dataa.end_date;
					endDate = endDate.substring(0, 10);
					myCalendar.setHolidays(endDate);
				}
				myCalendar.attachEvent('onClick', function(d){
					var day = myCalendar.getFormatedDate(null,d)
					$('#my_calendar').empty();
					$('#my_calendar').append('您'+ day + '的日程安排');
					$('#my_task').empty();
					for(i=0; i<l; i++) {
						var dataa = data[i];
						var endDate = dataa.end_date;
						var startDateList = dataa.start_date.substring(11, 16);
						var endDateList =  endDate.substring(11, 16)
						endDate = endDate.substring(0, 10);

						if(day == endDate){

							$('#my_task').append('<ul class="ed-calendar"><li><i class="icon-time"></i>'+startDateList+'-'+endDateList+'</li>'+
									'<li>标题：'+dataa.text+'</li>'+
									'<li>内容：'+dataa.details+'</li></ul>');
							$('#ed_calendar').modal('show');
						}
					}
				});
			}
		}
	});
}

/**
 *初始化首页portal门户界面
 **/
function initPortal(obj){
  if(obj.url !== undefined){
    $('#ed_index_portal').empty();
	$('#content_todo').perfectScrollbar();
	$('#content_todo').css('position','relative');
	$.ajax({
		type: 'get',
		dataType: 'json',
		url: obj.url,
		data: '',
		error: function(XMLHttpRequest, textStatus, errorThrown){
			$('#ed_index_portal').append('好像出错咯')
		},
		success: function(data) {
			var portalLength = data.portal.length;
			var portal = data.portal;
			for(i=0; i<portalLength; i++){
				var portalId = portal[i].id;
				var portalName = portal[i].conf_name;
				var portalSeq = portal[i].conf_seq;
				var portalType = portal[i].conf_type;
				var portalUrl = portal[i].conf_tupe_value;
				var portalLayout = portal[i].conf_layout;
				var portalItem = portal[i].conf_type_item;
				var portalList;
				var portalWrap;

				//判断左右结构样式
				var portalClass = 'index-40-2';
				if(i%2 ==0) portalClass = 'index-60-1';

				//判断数据类型，根据不同类型定义列表外盒子样式
				if(portalType == 2){
					portalList = '<div class="index-list-iframe" id="'+portalId+'_iframe_wrap"></div>';
				}else if(portalType == 1){
					switch(portalLayout){
					    case '1': {
							portalList = '<ul class="index-list-text" id="'+portalId+'_list"></ul>';
							break;
						}
						case '2': {
							portalList = '<div class="index-list-links" id="shortcut">'+
					    		'<ul class="index-list-img" id="'+portalId+'_list"></ul></div>';
							break;
							}
						case '3': {
							portalList = '<div id="calendarHere" class="my-calendar"></div>';
							break;
							}
						default: {
							portalList = '<ul class="index-list-text" id="'+portalId+'_list"></ul>';
						}
					}
				}

				//组装每一个portal区块
				portalWrap = '<div class="ed-index-list-wrap '+portalClass+'" id="'+portalId+'_wrap" data-id="'+portalId +
				  '" data-typeitem="'+portalItem +
				  '" data-name="'+portalName +
				  '" data-seq="'+portalSeq +
				  '" data-type="'+portalType +
				  '" data-layout="'+portalLayout +
				  '" data-typevalue="'+portalUrl +
				  '"><div class="index-list"><h3 onmousedown="moveBlock(this)" class="move-block">'+
				  portalName +
				  '<span><a onmousedown="window.event? window.event.cancelBubble = true:e.stopPropagation();" class="btn btn-small" id="'+portalId+'_edit_btn" btn-id="'+portalId+'">编辑</a>'+
				  '<a onmousedown="window.event? window.event.cancelBubble = true:e.stopPropagation();" class="btn btn-small btn-warning" id="'+portalId+'_del_btn" btn-id="'+portalId+'">删除</a></span>'+
				  '</h3>'+portalList+'</div></div>';


				$('#ed_index_portal').append(portalWrap);

				$('#'+portalId+'_edit_btn').click(function(event){
					var portalId = $(this).attr('btn-id');
					  editSinglePortal({
							id: portalId
							});
					  }
					);

					$('#'+portalId+'_del_btn').click(function(event){
						var portalId = $(this).attr('btn-id');
					  delPortal({
							id: portalId
							});
					  }
					);



				if(portalType == 2){

				  $('#'+portalId+'_iframe_wrap').append('<iframe allowtransparency="true" frameborder="0" width="100%" height="100%" scrolling="auto" '+
					'id="'+portalId+'_iframe"'+
					'name="'+portalId+'_iframe"'+
					'src="'+portalUrl+'"'+
				    '></iframe>');

				  
				}else if(portalType == 1){
				
				//异步载入portal每一个列表数据
				$.ajax({
					type: 'get',
					dataType: 'json',
					url: base + portalUrl,
					portalId: portalId,
					portalLayout: portalLayout,
					portalItem: portalItem,
					error: function(XMLHttpRequest, textStatus, errorThrown) {
						if(this.portalLayout===3){
							mySchedule({url:'../../admin/schedule/showSchedule.action'});
							$('#calendarHere').prev().css('display','none');
						}
					},
					success: function(data) {
						switch(this.portalLayout){
							case '2': { //图标链接
								for(k=0;k<data.data.length;k++){
									$('#'+this.portalId+'_list').append('<li><a href="'+data.data[k].url+'">'+
											'<img src="'+data.data[k].imageSrc+'"><span>'+
											data.data[k].name+
											'</span></li>');
								}
								$('#shortcut').perfectScrollbar();
								break;
							}
							case '3': {  //我的日程
								mySchedule({url:'../../admin/schedule/showSchedule.action'});
								$('#calendarHere').prev().css('display','none');
								break;
								}
							default: {
								var l;
								(data.total_count == undefined) ? l=0 : l=data.total_count;
								if(l > 6){ l = 6 }
								switch(this.portalItem) {
								  case '1': {  //待办
									  if(l!=0){
									  for(k=0;k<l;k++){
											$('#'+this.portalId+'_list').append('<li><span>'+data.data[k].create_date1.split(" ")[0]+'</span>'+
													'<a onclick="uf_doAction('+data.data[k].wf_id+',\''+data.data[k].name+'\',\''+data.data[k].task_name+'\','+data.data[k].version+',\'putTaskList()\')">'+
													data.data[k].task_name+'</a></li>');
										}
									  }
									  break;
								  }
								  case '2': {  //已办
									  if(l!=0){
									  for(k=0;k<l;k++){
											$('#'+this.portalId+'_list').append('<li><span>'+data.data[k].create_date1.split(" ")[0]+'</span>'+
													'<a onclick="showWfHistory('+data.data[k].wf_id+')">'+
													data.data[k].task_name+'</a></li>');
										}
									  }
									  break;
								  }
								  default: {
									  for(k=0;k<6;k++){
											$('#'+this.portalId+'_list').append('<li><span>'+data.data[k].date+'</span>'+
													'<a href="+'+data.data[k].url+'+">'+data.data[k].title+'</a></li>');
										}
								  }
								}
							}
						}
					}
				});
				
				
				}
				
			}
		},
		complete: function() {
			if(obj.callback !== undefined) {
				setTimeout(function(){eval(obj.callback);},0);
			}
		}
	})
  }else{
	$('#ed_index_portal').append('出错咯');
  }
  
  
}

/**
 * 修改首页portal
 * */
function editPortal(obj){
	createTab({
		id: 'todo'
	})
  if(!$('#portal_edit_toolbar')[0]){
	  
	$('#ed_index_portal').css('padding-top','40px')
		.prepend('<div class="portal-edit-toolbar" id="portal_edit_toolbar">'+
				'<a class="btn btn-info" id="portal_cancel_btn">关闭设置</a>'+
				'<a class="btn" id="portal_add_btn">新增板块</a>'+
				'</div>');
	$('.index-list').addClass('index-list-edit');
	
	$('#portal_cancel_btn').click(function(){
	  $('#portal_edit_toolbar').remove();
	  $('#ed_index_portal').css('padding-top','0');
	  $('.index-list').removeClass('index-list-edit');
	  if($('#calendarHere')[0]){
			$('#calendarHere').prev().css('display','none')
			  .end().css('display','');
		}
	});
	
	$('#portal_del_btn').click(delPortal);
	
	$('#portal_add_btn').click(function() {
	  window.top.createWindow({
	    id: 'new_portal',
	    text: '新增板块',
	    url: base + "/admin/homeConf/homeConfPage.action"
	  })
	})
	
	if($('#calendarHere')[0]){
		$('#calendarHere').prev().css('display','')
			.end().css('display','none');
	}
  }

}

/**
 * 修改单条portal
 * */
function editSinglePortal(obj){
     window.top.createWindow({
	    id: 'new_portal',
	    text: '新增板块',
	    url: base + "/admin/homeConf/homeConfPage.action?homeConf.id="+obj.id
	  })
}


/**
 * 删除portal
 * */
function delPortal(obj){
	$.dialog.confirm('你确定要删除这个板块吗？', function () {
		$.ajax({
	        type: "POST",
	        async: false,
	        url: base + "/admin/homeConf/deleteHomeConf.action",
	        data: "idArr="+obj.id,
	        success: function(msg){
				
				initPortal({
					  url: base+'/admin/homeConf/queryHomeConf.action',
					  callback: 'editPortal()'
				});
				$.dialog.tips('删除成功');
	        }
	    });
    });

	
}


function moveBlock(obj){
	var thisObj=$(obj);
	var getlastId="";
	var portal = thisObj.parent().parent();
	var getId = thisObj.parent().parent().attr('id');//获取被移动的框体的ID
		
	var portalItem = portal.attr('data-typeitem');
    var portalId = portal.attr('data-id');
    var portalName = portal.attr('data-name');
    var portalSeq = portal.attr('data-seq');
    var portalType = portal.attr('data-type');
    var portalLayout = portal.attr('data-layout');
    var portalTypeValue = portal.attr('data-typevalue');
	
	$('#'+getId).parent().parent().append("<div id="+
			getId+"_block"+" class='move_border'></div>");//增加一个隐显框体
	$('#'+getId+'_block').width(thisObj.width());
	$('#'+getId+'_block').height($('#'+getId).height());
	
	var pointX = e.pageX;
	var pointY = e.pageY-$('#portal_edit_toolbar').outerHeight(true);
	$('#'+getId+'_block').css('left',function(e){
		return pointX+'px';
	});	
	$('#'+getId+'_block').css('top',function(e){
		return pointY+'px';
	});
		
	var isIE = getOs();
	var bigBlock="";
	if(isIE!="IE"){
		bigBlock=window;
		
	}else{
		bigBlock='body';
	}
	
	$(bigBlock).bind('mousemove',function(e){
		$('body').addClass("no_select");//防止在移动时复制
		document.body.onselectstart = document.body.ondrag = function(){//防止在移动时复制
		    return false;
		}
		pointX = e.pageX;
		pointY =e.pageY-$('#portal_edit_toolbar').outerHeight(true)-20;
		$('#'+getId+'_block').css('left',function(e){
			return pointX+'px';
		});
		
		$('#'+getId+'_block').css('top',function(e){
			return pointY+'px';
		});							
		
	});
	
	$(bigBlock).bind('mouseup',function(){
		moveBlockEnd(getId);			
	});
	
	$('#'+getId).parent().find('.ed-index-list-wrap').find('.move-block').each(function(){
		$(this).bind('mouseover',function(){
			$(this).addClass('red-border');
		});
		
		$(this).bind('mouseout',function(){
			$(this).removeClass('red-border');
		});
		
		$(this).bind('mouseup',function(){
			window.event? window.event.cancelBubble = true:e.stopPropagation();
			$('#'+getId+'_block').remove();
			getlastId=$(this).parent().parent().attr('id');	
			
			
			if(getId==getlastId){
				moveBlockEnd(getId);
			}else{
				alert(getId+","+getlastId);//执行成功，返回ID  getId：移动目标        getlastId：要被调换位置的框体ID
				/*$.ajax({
			        type: 'POST',
			        async: false,
			        url: base + '/admin/homeConf/insertHomeConf.action',
			        data: 'homeConf.confTypeItem='+portalItem+
			              '&homeConf.id='+portalId+
			              '&homeConf.confName='+portalName+
			              '&homeConf.confSeq=1'+
			              '&homeConf.confType='+portalType+
			              '&homeConf.confLayout='+portalLayout+
			              '&homeConf.confTypeValue='+portalTypeValue,
			        success: function(msg){
			            window.top.$.dialog.tips(msg.message);
			        }
			    });*/
				moveBlockEnd(getId);
			}
			
		});
	});
		
}

function moveBlockEnd(getId){
	$('body').removeClass("no_select");//完成后去掉防止复制的样式和方法
	document.body.onselectstart = document.body.ondrag = function(){//防止在移动时复制
	    return true;
	}
	$('#'+getId+'_block').remove();
	var isIE = getOs();
	var bigBlock="";
	if(isIE!="IE"){
		bigBlock=window;
		
	}else{
		bigBlock='body';
	}
	$(bigBlock).unbind('mousemove')
	$(bigBlock).unbind('mouseup');
	$('#'+getId).parent().find('.ed-index-list-wrap').find('.move-block').each(function(){
		$(this).removeClass('red-border');
		$(this).unbind('mouseover');
		$(this).unbind('mouseout');		
		$(this).unbind('mouseup');
	});
	
}


function getOs() { //判断浏览器方法
    var OsObject = ""; 
   if(isIE = navigator.userAgent.indexOf("MSIE")!=-1) { 
        return "IE"; 
   } 
   if(isFirefox=navigator.userAgent.indexOf("Firefox")!=-1){ 
        return "Firefox"; 
   } 
   if(isChrome=navigator.userAgent.indexOf("Chrome")!=-1){ 
        return "Chrome"; 
   } 
   if(isSafari=navigator.userAgent.indexOf("Safari")!=-1) { 
        return "Safari"; 
   }  
   if(isOpera=navigator.userAgent.indexOf("Opera")!=-1){ 
        return "Opera"; 
   } 
} 

	function trimAll(str)
    {
        var result;
        var is_global="g";
        result = str.replace(/(^\s+)|(\s+$)/g,"");
        if(is_global.toLowerCase()=="g")
        {
            result = result.replace(/\s/g,"");
         }
        return result;
}

