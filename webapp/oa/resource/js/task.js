
	// 实例链接 执行动作 （任务列表，实例列表中的 执行动作）
	function itsm_doAction_assets(wfId, wfName, wfDesc, wfVersion, Rid , cWinWidth,cWinHeight,djsn,djtype,relevance_id) {
		var Rid = Rid;
		var relevance_id = relevance_id;
		$.dialog.tips('获取流程最新信息中！', 2);
		var sKey = "/servlet/WorkflowPortal?operate=get_current_action_list&wf_id=" + wfId;            //2013年10月10日 09:20:28  改用新的operate值
		var project = window.top.base;
		var servletPath = project;
		project += '/form';

		$.ajax({
			type       :"POST",
			url        :servletPath + sKey,
			processData:false,
			data       :"<root></root>",
			contentType:'utf-8',
			success    :function (msg) {
				var oDom = newXml(msg);
				var bResult = $(oDom).find('n').text();
				if (bResult == 'false' || bResult == false) {
					var alertMsg = $(oDom).find('message').text();
					$.dialog.alert(alertMsg);
				} else {
					var surl;
					var height = $(window.top).height();

					var stage = $(oDom).find('stage').text();            // ="step" 到达了步骤了
					var num = $(oDom).find('num').text(); // 步骤的当前可执行的 action数量
					var wfId = $(oDom).find('wfId').text();// 流程实例id
					//alert(num);
					if (num == 1) {// 直接链接到action的view中
						var action = $(oDom).find("action");
						var actionId = undToSp(action.attr("id"));
						var actionName = undToSp(action.attr("name"));
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

							var surl = project + "/fceform/common/run.html?djsn="+djsn+"&djtype="+djtype;
							surl += "&domxml=" + sXml;
							surl += "&wfId=" + wfId;
							surl += "&relevance_id=" + relevance_id;
							surl += "&wfName=" + wfName;
							surl += "&wfDesc=" + escape(wfDesc);
							surl += "&wfVersion=" + wfVersion;

							window.top.createWindow({   id:'workFlow',
									text                  :wfDesc,
									setModal              :true,
									url                   :surl,
									width                 :cWinWidth,
									height                :cWinHeight,
									parent_ifr            :window,
									afterClose            :function () {
										if(window.top.getModuleFrame('start'))
										window.top.getModuleFrame('start').taskReload('flow_task');
									}
								}

							);
							return;
						} else {// 有view的直接进入view链接的表单页面，表单提交的时候，同时做流程doAction
							var surl = project + unescape(view);
							var asurl = surl.split('Add&djtype');
							if(asurl>0){
								surl = asurl[0]+'Add1&djtype' + asurl[1];
							}
							//alert(surl);
							surl = surl + "&wfName=" + wfName;
							surl = surl + "&wfDesc=" + escape(wfDesc);
							surl = surl + "&wfVersion=" + wfVersion;
							surl = surl + "&wfId=" + wfId;
							surl = surl + "&id=" + Rid;
							surl = surl + "&relevance_id=" + relevance_id;
							surl = surl + "&actionId=" + actionId;
							surl = surl + "&traceId=" + traceId;// 2011-9-17
							surl = surl + "&" + fieldkey + "=" + fieldkeyvalue;
							if (dynamicId != null)
								surl = surl + "&dynamicInstanceId=" + dynamicId; // 在wf_tools.htm页面会获取此参数

							window.top.createWindow({   id:'workFlow',
									text                  :wfDesc,
									setModal              :true,
									url                   :surl,
									width                 :cWinWidth,
									height                :cWinHeight,
									parent_ifr            :window,
									afterClose            :function () {
										if(window.top.getModuleFrame('start'))
											window.top.getModuleFrame('start').taskReload('flow_task');
									}
								}

							);
							return;
						}
					} else if(num == 0) {// 多个action，用户选择一个执行

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

						var surl = project + "/fceform/common/run.html?djsn="+djsn+"&djtype="+djtype;
						
						//var surl = project + "/fceform/common/run.html?djsn=wf_action_list&djtype=eden_form";
						
						surl += "&wfId=" + wfId;
						surl += "&relevance_id=" + relevance_id;
						surl += "&wfName=" + wfName;
						surl += "&wfDesc=" + escape(wfDesc);
						surl += "&wfVersion=" + wfVersion;

						//surl += "&domxml=" + sXml;
						window.top.createWindow({   id:'workFlow',
								text                  :wfDesc,
								setModal              :true,
								url                   :surl,
								width                 :cWinWidth,
								height                :cWinHeight,
								parent_ifr            :window,
								afterClose            :function () {
									if(window.top.getModuleFrame('start'))
										window.top.getModuleFrame('start').taskReload('flow_task');
								}
							}

						);
						return;
					}else {// 多个action，用户选择一个执行
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

						//var surl = project + "/fceform/common/run.html?djsn="+djsn+"&djtype="+djtype;
						
						var surl = project + "/fceform/common/run.html?djsn=wf_action_list&djtype=eden_form";
						
						surl += "&wfId=" + wfId;
						surl += "&relevance_id=" + relevance_id;
						surl += "&wfName=" + wfName;
						surl += "&wfDesc=" + escape(wfDesc);
						surl += "&wfVersion=" + wfVersion;

						surl += "&domxml=" + sXml;
						window.top.createWindow({   id:'workFlow',
								text                  :wfDesc,
								setModal              :true,
								url                   :surl,
								width                 :cWinWidth,
								height                :cWinHeight,
								parent_ifr            :window,
								afterClose            :function () {
									if(window.top.getModuleFrame('start'))
										window.top.getModuleFrame('start').taskReload('flow_task');
								}
							}

						);
						return;
					}
				}
			}
		})


	}

	/**
	 *  初始化工作流
	 * @param wfName
	 * @param wfDesc
	 * @param wfVersion
	 * @param addPram
	 * @param callback 关闭回调函数
	 */
	function oaInitWorkflowWithCallBack(wfName, wfDesc, wfVersion,addPram,callback) {
		oaInitWorkflow(wfName, wfDesc, wfVersion,addPram,null,callback)
		
	}
	
	/**
	 * 
	 * @param wfName
	 * @param wfDesc
	 * @param wfVersion
	 * @param addPram   表单url增加的参数
	 * @param interceptCallback  在取得wfId后拦截，执行拦截方法，不会打开所对应的表单
	 */
	function oaInitWorkflowInterceptCallback(wfName, wfDesc, wfVersion,addPram,interceptCallback) {
		oaInitWorkflow(wfName, wfDesc, wfVersion,addPram,null,null,interceptCallback)
		
	}
	
	
	/**
	 *  初始化工作流
	 * @param wfName
	 * @param wfDesc
	 * @param wfVersion
	 * @param addPram   表单url增加的参数
	 * @param beforeCloseFun 点击子页面右上角关闭按钮时触发的函数
	 * @param callback  页面提交后回调的函数
	 * @param interceptCallback   在取得wfId后拦截，执行拦截方法，不会打开所对应的表单
	 */
	function oaInitWorkflow(wfName, wfDesc, wfVersion,addPram,beforeCloseFun,callback,interceptCallback) {
		var width=1048;
		window.top.loadi = window.top.layer.load('初始化流程中……');
		var sKey = "/servlet/WorkflowPortal?operate=init_workflow&wf_name=" + wfName + "&wf_version=" + wfVersion;
		var project = window.top.base;
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
					$.dialog.alert(alertMsg);
				} else {
					var oDom = newXml(msg);
					var wfid;
					var sUrl = "";
					var height = $(window.top).height();
					var bResult = $(oDom).find('n').text();
					if (bResult == "false") {
						$.dialog.alert($(oDom).children().children().text());
						return;
					}
					//根据	<stage>init,step</stage>来判断调用那个页面
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

						window.top.createWindow({   id:'workFlow',
								text                  :wfDesc,
								setModal              :true,
								url                   :surl,
								width                 :width,
								height                :height - 30,
								parent_ifr            :window,
								afterClose            :function () {
									if(window.top.getModuleFrame('start'))
									{
										window.top.getModuleFrame('start').taskReload('flow_task');
									}
									
								}
							}

						);
						window.top.layer.close(window.top.loadi);
						//window.open(surl,"_target");
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
							wfDesc=actionName;
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

								window.top.createWindow({   id:'workFlow',
										text                  :wfDesc,
										setModal              :true,
										url                   :surl,
										width                 :width,
										height                :height - 30,
										parent_ifr            :window,
										afterClose            :function () {
											if(callback)
												eval(callback);
											if(window.top.getModuleFrame('start'))
											{
												window.top.getModuleFrame('start').taskReload('flow_task');
											}
											
										}
									}

								);
								window.top.layer.close(window.top.loadi);
								//window.open(surl,"_target");
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
								//window.open(project + surl);
								
								if(addPram)
								{
									surl = surl +addPram;
								}
								
								if(!interceptCallback)
								{
									if(!beforeCloseFun)  //是否关闭页面时提示
									{
										window.top.createWindow({   id:'workFlow',
												text                  :wfDesc,
												setModal              :true,
												url                   :surl,
												width                 :width,
												height                :height - 30,
												parent_ifr            :window,
												afterClose            :function () {
													if(callback)
														eval(callback);
													if(window.top.getModuleFrame('start'))
													{
														window.top.getModuleFrame('start').taskReload('flow_task');
													}
													
												}
											}

										);
										
									}else{
									
										window.top.createWindow({   id:'workFlow',
											text                  :wfDesc,
											setModal              :true,
											url                   :surl,
											width                 :width,
											height                :height - 30,
											parent_ifr            :window,
											beforeClose:beforeCloseFun,
											afterClose            :function () {
												if(window.top.getModuleFrame('start'))
												{
													window.top.getModuleFrame('start').taskReload('flow_task');
												}
												
											}
										});
										
									}
								}else{
									
									eval(interceptCallback)
								}
							
								window.top.layer.close(window.top.loadi);
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

							window.top.createWindow({   id:'workFlow',
									text                  :wfDesc,
									setModal              :true,
									url                   :surl,
									width                 :width,
									height                :height - 30,
									parent_ifr            :window,
									afterClose            :function () {
										if(window.top.getModuleFrame('start'))
											window.top.getModuleFrame('start').taskReload('flow_task');
									}
								}

							);
							window.top.layer.close(window.top.loadi);
							return;
						}
					}

				}

			}
		});

	}


	
	function parserRequest( parm) {
		var url= location.href;
		var reg = new RegExp("(^|&)" + parm + "=([^&]*)(&|$)");
		var r = url.substr(url.indexOf("\?") + 1).match(reg);
		if (r != null)
			return unescape(r[2]);
		return null;
	}

	
/**
 * 全选
 */
	function selectAllCheck()
	{
		var ids = grid.getAllRowIds();
    	//console.log(ids);
    	var idsArr = ids.split(',');
    	//alert(idsArr.length);
    	var nowPage = grid.currentPage;
    	var pageItemsLength = grid.rowsBufferOutSize;
    	var allItemsLength = grid.rowsBuffer.length;
    	
    	var forBigen = pageItemsLength*(nowPage-1);
    	var forOver = pageItemsLength*(nowPage);
    	if (forOver>allItemsLength){
    		forOver = allItemsLength
    	}
    	for(i=forBigen;i<forOver;i++){
    		var forId = idsArr[i];
    		var check = grid.cellById(forId, 0).getValue();
    		//console.log(check);
    		if (check == 1) {
        		check = 0;
        	} else {
        		check = 1;
        	}
    		grid.cellById(forId, 0).setValue(check);
    	}

		
		
	}

	
	// 实例链接 执行动作 ,如果不能执行，则显示
	function uf_doAction_show(wfId, wfName, wfDesc, wfVersion,callback,addParam) {
		var width=1048;
		//$.dialog.tips('获取流程最新信息中！', 2);
		window.top.loadi = window.top.layer.load('获取流程最新信息中……')
		var sKey = "/servlet/WorkflowPortal?operate=get_current_action_list&wf_id=" + wfId;            //2013年10月10日 09:20:28  改用新的operate值
		var project = window.top.base;
		var servletPath = project;
		project += '/form';

		if(!wfDesc)
		{
			wfDesc="办理";
		}
		$.ajax({
			type       :"POST",
			url        :servletPath + sKey,
			processData:false,
			data       :"<root></root>",
			contentType:'utf-8',
			success    :function (msg) {
				var oDom = newXml(msg);
				var bResult = $(oDom).find('n').text();
				if (bResult == 'false' || bResult == false) {
					var alertMsg = $(oDom).find('message').text();
					$.dialog.alert(alertMsg);
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
						var fieldkey = undToSp(action.attr("field_key"));
						var fieldkeyvalue = undToSp(action.attr("field_key_value"));
						var dynamicId = undToSp(action.attr("dynamic_instance_id"));
						wfDesc=actionName;

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

							//var surl =showUrl;
							
							openShowPage(wfId,wfDesc,height,addParam);
							
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
							if (dynamicId != null)
								surl = surl + "&dynamicInstanceId=" + dynamicId; // 在wf_tools.htm页面会获取此参数

							window.top.createWindow({   id:'workFlow',
									text                  :wfDesc,
									setModal              :true,
									url                   :surl,
									width                 :width,
									height                :height - 30,
									parent_ifr            :window,
									afterClose            :function () {
										if(callback)
										{
											eval(callback)
										}
										if(window.top.getModuleFrame('start'))
										{
											window.top.getModuleFrame('start').taskReload('flow_task');
										}
									
							
									}
								}

							);
							window.top.layer.close(window.top.loadi);
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

						//var surl =showUrl;
						
						openShowPage(wfId,wfDesc,height,addParam)
						return;
					}
				}
			}
		})


	}
	
	
	function openShowPage(wfId,wfDesc,height,addParam)
	{
		var width=1048;
		wfDesc="查看";
		var project = window.top.base;
		var getShowUrlAction=project+"/admin/documentwf/getShowUrlByWfid.action?wfId="+wfId;
	  	$.post(getShowUrlAction,"",function(result){
	          if(result)
			  {
			     var showPassSendUrl=result.showUrl;
				 if(showPassSendUrl)
				 {
					 var surl=project+showPassSendUrl;
					 if(addParam)
					{
						 surl+=addParam;
					}
					 window.top.createWindow({   id:'workFlow',
							text                  :wfDesc,
							setModal              :true,
							url                   :surl,
							width                 :width,
							height                :height - 30,
							parent_ifr            :window,
							afterClose            :function () {
								if(window.top.getModuleFrame('start'))
								{
									window.top.getModuleFrame('start').taskReload('flow_task');
								}
							}
						}

					);
					
					window.top.layer.close(window.top.loadi);
					 
					 
				 }else{
				   $.dialog.tips("打开失败!");
				 }
				 
				 
			  }
		});
		
		
	}
	
	