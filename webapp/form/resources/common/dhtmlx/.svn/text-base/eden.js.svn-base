/**
 * 此文件中方法需要引jQuery库
 */
var global = {};//全局对象
global.eDialog_num = 0;
var projectName=window.location.toString();
projectName=projectName.split('/');
projectName='/'+projectName[3];
dhtmlXTreeObject.prototype.getAttribute=function(id, attr){
	var respuesta=null;
	if(typeof attr === 'string'){
		var item = this._globalIdStorageFind(id);
		switch(attr){
			case 'text': respuesta=item.label; break;
			case 'id': respuesta=item.id; break;
			case 'checked': respuesta=item.checkstate; break;
			case 'im0': var images=item.images;
				respuesta=images[0];
				break;
			case 'im1': var images=item.images;
				respuesta=images[1];
				break;
			case 'im2': var images=item.images;
				respuesta=images[2];
				break;
			case 'open': respuesta=item.closeble;
				break;
			default: respuesta="属性没找到！";
		}
	}

	return respuesta;
};
dhtmlXTreeObject.prototype.selectItemByText = function (key) {
	if (!key) return;
	var this_tree = this;
	var itemIds = [];
//	var treeData = this.XMLLoader.xmlDoc.documentElement || this.XMLLoader.xmlDoc.responseText || this.XMLLoader.xmlDoc.responseXml;
	var treeData = this._p.d;
	try {
//		treeData = eval("(" + treeData + ")");
		function findText(obj) {
			var text = obj.text;
			if (text.match(key) != null) {
				itemIds.push(obj.id);
			}
			if (obj.item) {
				for (var i = 0; i < obj.item.length; i++) {
					findText(obj.item[i]);
				}
			}
		}

		var x = treeData.item.length;

		for (var i = 0; i < x; i++) {
			findText(treeData.item[i]);
		}


	} catch (e) {
		$(treeData).find('item').each(function () {
			var text = $(this).attr('text');
			if (text.match(key) != null) {
				itemIds.push($(this).attr('id'));
			}
		});
	}


	return itemIds;
}
function treeSearchBar(htmlObjectId, treeObject) {
	this.itemIds = [];
	this.nowSelectNum = 0;
	this.totalIdsNum = 0;
	this.hasSearched = false;
	this.treeObject = treeObject;
	this.treeSearchKeyObject = treeObject;
	this.num_span = '';
	var root = treeObject.rootId;
	var thisBar = this;
	var filePath = treeObject.XMLLoader.filePath;
	treeObject.setXMLAutoLoading(filePath);
	treeObject.setDataMode('json');
	var html = '<input id="' + htmlObjectId + '_key" class="tree_search_key" name="" type="text"><label for="' + htmlObjectId + '_key"><span id="' + htmlObjectId + '_num" class="tree_search_rs_num">关键字</span></label><span class="icon prev_icon" id="' + htmlObjectId + '_PrevNode" title="上一个"></span><span class="icon next_icon" id="' + htmlObjectId + '_NextNode" title="下一个"></span><span id="' + htmlObjectId + 'refresh_tree" onClick="" class="refresh_icon icon" title="刷新树"></span><span id="' + htmlObjectId + 'expand_tree" class="open_icon icon" title="展开"></span><span id="' + htmlObjectId + 'collapse_tree" class="close_icon icon" title="收起"></span>';
	$('#' + htmlObjectId).addClass('tree_search');
	$('#' + htmlObjectId).html(html);
	thisBar.num_span = $('#' + htmlObjectId + '_num');
	thisBar.treeSearchKeyObject = $('#' + htmlObjectId + '_key');
	window.setTimeout(function () {

		$('#' + htmlObjectId + '_key').keyup(function () {
			thisBar._searchItem($(this).val());
		});
		$('#' + htmlObjectId + '_key').blur(function () {
			thisBar._searchItem($(this).val());
		});
		$('#' + htmlObjectId + '_PrevNode').click(function () {
			thisBar.selectPrevItem();
		});
		$('#' + htmlObjectId + '_NextNode').click(function () {
			thisBar.selectNextItem();
		});
		$('#' + htmlObjectId + 'refresh_tree').click(function () {
			if(window.treeRefreshStatus==false){
				//$.dialog.tips('请勿连续刷新树！');
                layer.msg('请勿连续刷新树！');
			}else{
				treeObject.smartRefreshBranch(root);
			//	$.dialog.tips('刷新树信息中！');
                layer.msg('刷新树信息中');
			}
			clearTimeout(window.treeRefreshTime);
			window.treeRefreshStatus=false;
			window.treeRefreshTime=window.setTimeout(function(){
				window.treeRefreshStatus=true;
			},1000);

		});
		$('#' + htmlObjectId + 'expand_tree').click(function () {
			var id = treeObject.getSelectedItemId();
			if (!id) {
				id = root;
			}
			treeObject.openAllItems(id);
		});
		$('#' + htmlObjectId + 'collapse_tree').click(function () {
			var id = treeObject.getSelectedItemId();
			if (!id) {
				id = root;
			}
			treeObject.closeAllItems(id);
		});


	}, 100);

};
treeSearchBar.prototype._searchItem = function (key) {
	this.itemIds = this.treeObject.selectItemByText(key);
	if (this.itemIds) {
		this.totalIdsNum = this.itemIds.length;
	} else {
		this.totalIdsNum = 0;
	}
	if (this.totalIdsNum <= 0) {
		this.num_span.html('0/0');
		this.nowSelectNum = 0;
	} else {
		this.num_span.html('1/' + this.totalIdsNum);
		this.nowSelectNum = 1;
		this.treeObject.selectItem(this.itemIds[0]);
		this.treeObject.allTree.scrollTop=0;
		this.treeObject.focusItem(this.itemIds[0]);
	}
	this.hasSearched = true;
};
treeSearchBar.prototype.selectPrevItem = function () {
	if (!this.hasSearched) {
		this._searchItem(this.treeSearchKeyObject.val());
		return;
	}
	if (this.nowSelectNum < 1) {
		this.num_span.html('未找到');
		return;
	}
	if (this.nowSelectNum == 1) {
		this.treeObject.selectItem(this.itemIds[this.totalIdsNum - 1]);
		this.treeObject.focusItem(this.itemIds[this.totalIdsNum - 1]);
		this.nowSelectNum = this.totalIdsNum;
		this.num_span.html(this.totalIdsNum + '/' + this.totalIdsNum);
	} else {
		this.treeObject.selectItem(this.itemIds[this.nowSelectNum - 2]);
		this.treeObject.focusItem(this.itemIds[this.nowSelectNum - 2]);
		this.nowSelectNum -= 1;
		this.num_span.html(this.nowSelectNum + '/' + this.totalIdsNum);
	}
};
treeSearchBar.prototype.selectNextItem = function () {
	if (!this.hasSearched) {
		this._searchItem(this.treeSearchKeyObject.val());
		return;
	}

	if (this.nowSelectNum < 1) {
		this.num_span.html('未找到');
		return;
	}

	if (this.nowSelectNum < this.totalIdsNum) {
		this.treeObject.selectItem(this.itemIds[this.nowSelectNum]);
		this.treeObject.focusItem(this.itemIds[this.nowSelectNum]);
		this.nowSelectNum += 1;
		this.num_span.html(this.nowSelectNum + '/' + this.totalIdsNum);
	} else {
		this.treeObject.selectItem(this.itemIds[0]);
		this.treeObject.focusItem(this.itemIds[0]);
		this.nowSelectNum = 1;
		this.num_span.html('1/' + this.totalIdsNum);
	}
};
dhtmlXGridObject.prototype._fixHiddenRowsAll = function (pb, ind, prop, state, index) {
	index = index || "_cellIndex";
	var z = pb.rows.length;

	for (var i = 0; i < z; i++) {
		var x = pb.rows[i].childNodes;

		if (x.length != this._cCount) {
			for (var j = 0; j < x.length; j++)
				if (x[j][index] == ind) {
					x[j].style[prop] = state;
					break;
				}
		} else
			x[ind].style[prop] = state;
	}
}
/**
 *   @desc: hide column
 *   @param: ind - column index
 *   @param: state - hide/show
 *   @edition: Professional
 *   @type:  private
 */
dhtmlXGridObject.prototype._hideShowColumn = function (ind, state) {
	var hind = ind;
	if ((this.hdr.rows[1]._childIndexes) && (this.hdr.rows[1]._childIndexes[ind] != ind))
		hind = this.hdr.rows[1]._childIndexes[ind];

	if (state == "none") {
		this.hdr.rows[0].cells[ind]._oldWidth = this.hdr.rows[0].cells[ind].style.width || (this.initCellWidth[ind] + "px");
		this.hdr.rows[0].cells[ind]._oldWidthP = this.cellWidthPC[ind];
		this.obj.rows[0].cells[ind].style.width = "0px";


		var t = {rows:[this.obj.rows[0]]}
		this.forEachRow(function (id) {
			if (this.rowsAr[id].tagName == "TR")
				t.rows.push(this.rowsAr[id])
		})
		this._fixHiddenRowsAll(t, ind, "display", "none");

		if (this._fixHiddenRowsAllTG)
			this._fixHiddenRowsAllTG(ind, "none");

		if ((_isOpera && _OperaRv < 9) || _isKHTML || (_isFF && !document.getElementsByClassName)) {
			this._fixHiddenRowsAll(this.hdr, ind, "display", "none", "_cellIndexS");

			if (this.ftr)
				this._fixHiddenRowsAll(this.ftr.childNodes[0], ind, "display", "none");
		}
		this._fixHiddenRowsAll(this.hdr, ind, "whiteSpace", "nowrap", "_cellIndexS");

		if (!this.cellWidthPX.length && !this.cellWidthPC.length)
			this.cellWidthPX = [].concat(this.initCellWidth);

		if (this.cellWidthPX[ind])
			this.cellWidthPX[ind] = 0;

		if (this.cellWidthPC[ind])
			this.cellWidthPC[ind] = 0;
	} else {
		if (this.hdr.rows[0].cells[ind]._oldWidth) {
			var zrow = this.hdr.rows[0].cells[ind];

			if (_isOpera || _isKHTML || (_isFF))
				this._fixHiddenRowsAll(this.hdr, ind, "display", "", "_cellIndexS");

			if (this.ftr)
				this._fixHiddenRowsAll(this.ftr.childNodes[0], ind, "display", "");


			var t = {rows:[this.obj.rows[0]]}
			this.forEachRow(function (id) {
				if (this.rowsAr[id].tagName == "TR")
					t.rows.push(this.rowsAr[id])
			})
			this._fixHiddenRowsAll(t, ind, "display", "");

			if (this._fixHiddenRowsAllTG)
				this._fixHiddenRowsAllTG(ind, "");

			this._fixHiddenRowsAll(this.hdr, ind, "whiteSpace", "normal", "_cellIndexS");

			if (zrow._oldWidthP)
				this.cellWidthPC[ind] = zrow._oldWidthP;

			if (zrow._oldWidth)
				this.cellWidthPX[ind] = parseInt(zrow._oldWidth);
		}
	}
	this.setSizes();

	if ((!_isIE) && (!_isFF)) {
		//dummy Opera/Safari fix
		this.obj.border = 1;
		this.obj.border = 0;
	}
}
dhtmlXGridObject.prototype.setColumnHidden = function (ind, state) {
	if (!this.hdr.rows.length) {
		if (!this._ivizcol)
			this._ivizcol = [];
		return this._ivizcol[ind] = state;
	}

	if ((this.fldSorted) && (this.fldSorted.cellIndex == ind) && (state))
		this.sortImg.style.display = "none";

	var f = convertStringToBoolean(state);

	if (f) {
		if (!this._hrrar)
			this._hrrar = new Array();

		else if (this._hrrar[ind])
			return;
		this._hrrar[ind] = "display:none;";
		this._hideShowColumn(ind, "none");
	} else {
		if ((!this._hrrar) || (!this._hrrar[ind]))
			return;
		this._hrrar[ind] = "";
		this._hideShowColumn(ind, "");
	}

	if ((this.fldSorted) && (this.fldSorted.cellIndex == ind) && (!state))
		this.sortImg.style.display = "inline";

	this.setSortImgPos();
	//this.callEvent("onColumnHidden",[ind,state])
}

dhtmlXForm.prototype.items.eUpload = {
		render            :function (item, data) {
			// item - div of parent container
			// data - init json
			item._type = "eUpload";
			item._isUp=false;//是否在上传界面
			this._addFileList=[];
			this._delFileList=[];
			this._filePath="";
			this._url="/admin/attachmentInfo/selectByTable.action";
			item._value='';
			this.doAddLabel(item, data);
			this.doAdd_eUpload(item, data);
			return this;
		},
		// destructor, required (if you will use unload)
		destruct          :function (item) {
			item.innerHTML = "";
		},
		// enable item, mandatory
		enable            :function (item) {
			item.lastChild.style.color = "#555";
			item._is_enabled = true;
		},
		// disable item, mandatory
		disable           :function (item) {
			item.lastChild.style.color = "#b1b1b1";
			item._is_enabled = false;
		},
		// your custom functionality
		_custom_inner_func:function (item) {
			item.lastChild.onclick = function () {
				if (this.parentNode._is_enabled)
					alert("Hello!")
			}
		},
		// this methos will public
		setText            :function (item, text) {
			item.lastChild.innerHTML = text;
			item.callEvent("onTextChanged", [item._idd, text]);
		},
		// this methos will also public
		setBoldText        :function (item, text) {
			item.lastChild.innerHTML = "<b>" + text + "</b>";
			item.callEvent("onTextChanged", [item._idd, text, true]);
		},
		resetAttachList:function(item){
			var t=this;
			item._value='';
			item.childNodes[1].childNodes[0].value='';
			t._addFileList=[];
			t._delFileList=[];
			var attachWrap= $(item).find('#'+item._idd+'_upload_list');
			attachWrap.empty();
		},
		transValue:function(item){
			var t=this;
			var fileJson='{addFileList:[';
			for (var i = 0; i < t._addFileList.length; i++) {
				var file = t._addFileList[i];
				fileJson=fileJson+'{';
				fileJson=fileJson+'id:"'+file.id+'",';
				fileJson=fileJson+'name:"'+file.name+'",';
				fileJson=fileJson+'size:"'+file.size+'",';
				fileJson=fileJson+'remark:"'+""+'"';
				if(i==t._addFileList.length-1){
					fileJson=fileJson+'}';
				}else{
					fileJson=fileJson+'},';
				}
			}
			fileJson+='],delFileList:[';
			for (var i = 0; i < t._delFileList.length; i++) {
				var file = t._delFileList[i];
				fileJson=fileJson+'{';
				fileJson=fileJson+'id:"'+file.id+'",';
				fileJson=fileJson+'size:"'+file.size+'"';
				if(i==t._delFileList.length-1){
					fileJson=fileJson+'}';
				}else{
					fileJson=fileJson+'},';
				}
			}
			fileJson+=']}';
			item._value=fileJson;
			item.childNodes[1].childNodes[0].value=fileJson;
		},
		updateValue: function(item) {
			this.transValue(item);
			var value = item.childNodes[item._ll?1:0].childNodes[0].value;
			var t = this;
			if (item._value != value) {
				if (item.checkEvent("onBeforeChange")) if (item.callEvent("onBeforeChange",[item._idd, item._value, value]) !== true) {
					// restore
					if (item._df != null) t.setValue(item, item._value); else item.childNodes[item._ll?1:0].childNodes[0].value = item._value;
					return;
				}
				// accepted
				if (item._df != null) t.setValue(item, value); else item._value = value;
				item.callEvent("onChange",[item._idd, value]);
				return;
			}
			if (item._df != null) this.setValue(item, item._value);
		},

		setValue: function(item, value) {
			// str only
			item._value = (typeof(value) != "undefined" && value != null ? value : "");

			var v = (String(item._value)||"");
			var k = item.childNodes[item._ll?1:0].childNodes[0];


			if (k.value != v) {
				k.value = v;
				item.getForm()._ccReload(item._idd, v);
			}

			k = null;
		},

		getValue: function(item) {
			// update value if item have focus
			var f = item.getForm();
			if (f._formLS && f._formLS[item._idd] != null) this.updateValue(item);
			f = null;
			// str only
			return (typeof(item._value) != "undefined" && item._value != null ? item._value : "");
		},

		setReadonly: function(item, state) {
			item._ro = (state===true);
			if (item._ro) {
				item.childNodes[item._ll?1:0].childNodes[0].setAttribute("readOnly", "true");
			} else {
				item.childNodes[item._ll?1:0].childNodes[0].removeAttribute("readOnly");
			}
		},

		isReadonly: function(item) {
			if (!item._ro) item._ro = false;
			return item._ro;
		},

		getInput: function(item) {
			return item.childNodes[item._ll?1:0].childNodes[0];
		},
		doAddLabel: function(item, data) {
			var j = document.createElement("DIV");
			j.className = "dhxform_label "+data.labelAlign;
			j.innerHTML = "<label for='"+data.uid+"'>"+
				data.label+
				(data.info?"<span class='dhxform_info'>[?]</span>":"")+
				(item._required?"<span class='dhxform_item_required'>*</span>":"")+
				"</label>";
			//
			if (data.wrap == true) j.style.whiteSpace = "normal";

			if (typeof(data.tooltip) != "undefined") j.title = data.tooltip;
			item.appendChild(j);

			if (typeof(data.label) == "undefined" || data.label == null || data.label.length == 0) j.style.display = "none";

			if (!isNaN(data.labelWidth)) j.style.width = parseInt(data.labelWidth)+"px";
			if (!isNaN(data.labelHeight)) j.style.height = parseInt(data.labelHeight)+"px";

			if (!isNaN(data.labelLeft)) j.style.left = parseInt(data.labelLeft)+"px";
			if (!isNaN(data.labelTop)) j.style.top = parseInt(data.labelTop)+"px";

			if (data.info) {
				j.onclick = function(e) {
					e = e||event;
					var t = e.target||e.srcElement;
					if (typeof(t.className) != "undefined" && t.className == "dhxform_info") {
						this.parentNode.callEvent("onInfo",[this.parentNode._idd]);
						e.cancelBubble = true;
						e.returnValue = false;
						return false;
					}
				}
			}
		},
		addAttach:function(item,data,pos){
			var _this=this;
			var attachHtml=$('<span id="'+data.id+'"><a class="download_attach" href="'+_this._filePath+encodeURI(data.path)+'">'+data.name+'</a><a class="del_attach" title="删除附件"> </a></span>');
			$(attachHtml).find('.del_attach').click(function(){
				_this.delAttach(item,data);
			});
			$(attachHtml).find('.download_attach').click(function(e){
				var href=$(this).attr('href');
				if(href==_this._filePath){
					//$.dialog.tips("请先保存再下载！");
                    layer.msg('请先保存再下载！');
				}else{
					window.location.href=href;
				}
				e.returnValue=false;
				return false;
			});
			if(pos=='before'){
				$(item).find('#'+item._idd+'_upload_list').prepend(attachHtml);
			}else{
				$(item).find('#'+item._idd+'_upload_list').append(attachHtml);
			}

		},
		delAttach:function (item, data) {
			this._delFileList.push(data);
			this.transValue(item);
			$(item).find('#' + data.id).remove();
		},
		setAttachList:function(item,param){
			var _this=this;		
			jQuery.post(projectName+this._url, param, function(data){

	            if(data["result"]=="success"){  
	            	this._filePath=data["path"];
	            	_this.resetAttachList(item);
	        		
	        		for (var i = 0; i < data["message"].length; i++) {
	        			_this.addAttach(item,data["message"][i]);
	        		}
	            }else{
	            	//$.dialog.tips(data["message"]);
                    layer.msg(data["message"]);
	            }            		
	       	  
	         });		
		},
		doAdd_eUpload: function(item, data) {
			var _this=this;
			var p = document.createElement("DIV");
			p.className = "dhxform_control";

			if (item._ll) {
				item.appendChild(p);
			} else {
				item.insertBefore(p,item.firstChild);
			}
			var k = document.createElement("INPUT");
			k.type = "HIDDEN";
			k.name = data.name;
			k.value = (data.value||"");
			p.appendChild(k);
			var t = document.createElement('DIV');
			t.className = "dhxform_textarea eUploader";
			t._idd = item._idd;
			t.id = item._idd+'_wrap';
			t.type = 'eUpload';
			p.appendChild(t);
			t.innerHTML='<p><a id="'+item._idd+'_pick" class="eUpload_pick_btn" href="javascript:void(0)">[添加附件]</a></p><p class="eUpload_fileAdded" id="'+item._idd+'_upload_list"></p>';
			var upload_wrap_html='<div style="width: 600px; height: 224px; margin: 5px auto 10px; border: 1px solid #ccc;" id="uploader"></div><div class="bottom_btn_area"><input id="eUpload_add_btn" class="ef_button" type="button" value="清空">&nbsp;&nbsp;&nbsp;<input id="eUpload_save_btn" class="ef_button" type="button" value="确定"></div>';

			function create_eUploader(){
				var result=true;
				_eUploader=$("#uploader").pluploadQueue({
					runtimes     :'flash',
					url          :data.servlet,
					max_file_size:'10mb',
					unique_names :true,
					filters      :[
						{title : "图片", extensions : "jpg,gif,png"},
						{title : "压缩文件", extensions : "zip,rar"}
					],
					flash_swf_url:projectName+'/form/resources/common/plupload/plupload.flash.swf',
					init: {
						UploadComplete:function(up, files){
							if(!result){
								return;
							}
							for(var i=0,l=files.length;i<l;i++){
								var data={id:(new Date().getTime()+i),name:files[i].name, size:files[i].size,remark:'',path:''};
								_this._addFileList.push(data);
								_this.addAttach(item,data);
							}
							_this.updateValue(item);
							window.setTimeout(function(){
								_eUploadWin.window('_eUploadWin1').hide();
							},100);
						},
						Error:function(up, error){
							result=false;
							//$.dialog.tips("上传失败！");
                            layer.msg("上传失败！");
						}

					}
				});
			}

			$('#'+item._idd+'_pick').click(function(){
				if(typeof _eUploadWin != 'undefined'){
					_eUploadWin._nowUploaderName=item.name;
					_eUploadWin.window('_eUploadWin1').show();
					_eUploader=$("#uploader").pluploadQueue();
					_eUploader.destroy();
					create_eUploader();
					return;
				}
				_eUploadWin = new dhtmlXWindows();
				_eUploadWin._nowUploaderName=item.name;
				_eUploadWin.setImagePath(projectName+"/form/resources/common/dhtmlx/imgs/");
				_eUploadWin1 = _eUploadWin.createWindow("_eUploadWin1", 20, 30, 610, 315);
				_eUploadWin1.setText("添加附件");
				_eUploadWin1.attachHTMLString(upload_wrap_html);
				_eUploadWin.window('_eUploadWin1').center();

				_eUploadWin.attachEvent('onClose',function(win){
					_eUploadWin.window('_eUploadWin1').hide();
				})
				create_eUploader();
				$('#eUpload_save_btn').click(function(){    //确定按钮
					_eUploader=$("#uploader").pluploadQueue();
					console.log(_eUploader);
					_eUploadWin.window('_eUploadWin1').hide();
				});
				$('#eUpload_add_btn').click(function(){    //继续添加
					_eUploader=$("#uploader").pluploadQueue();
					_eUploader.destroy();
					create_eUploader();
				});
			});

			if (data.hidden == true) this.hide(item);
			if (data.disabled == true) this.userDisable(item);

			if (!isNaN(data.inputLeft)) p.style.left = parseInt(data.inputLeft) + "px";
			if (!isNaN(data.inputTop)) p.style.top = parseInt(data.inputTop) + "px";

			var u = "";

			if (!isNaN(data.inputWidth)) u += "width:" + parseInt(data.inputWidth) + "px;";
			if (!isNaN(data.inputHeight)){
				u += "height:" + parseInt(data.inputHeight) + "px;";
			} else{
				u += "height:24px;";
			}

			if (typeof(data.style) == "string") u += data.style;
			t.style.cssText = u;

		}

	};
	dhtmlXForm.prototype.addAttach = function (name, data) {
		// this will call "setBoldText" with text param
		this.doWithItem(name, "addAttach", data);
	};
	dhtmlXForm.prototype.delAttach = function (name, id) {
		// this will call "setBoldText" with text param
		this.doWithItem(name, "delAttach", id);
	};
	dhtmlXForm.prototype.setAttachList = function (name, data) {
		// this will call "setBoldText" with text param
		this.doWithItem(name, "setAttachList", data);
	};
	dhtmlXForm.prototype.resetAttachList = function (name, data) {
		// this will call "setBoldText" with text param
		this.doWithItem(name, "resetAttachList", data);
	};
	// support for set/get form data		// in our sample default set/get value used, but you can also use your custom methods
	dhtmlXForm.prototype.setFormData_eUpload = function (name, value) {
		return this.doWithItem(name, "setValue", value);
	};
	dhtmlXForm.prototype.getFormData_eUpload = function (name) {
		return this.doWithItem(name, "getValue");
	};

/**
 * 用于form的 template类型  返回 my97datepicker 类型的input
 * @param name
 * @param value
 * @return {String}
 */
function dateType(name, value){
	return '<input class="dhxform_textarea" style=" width: 100%;" value="'+value+'" type="text" onClick="WdatePicker()"/>';
}

/**
 * 用于form的 template类型  返回 my97datepicker 类型的input yyyy-MM-dd HH:mm:ss
 * @param name
 * @param value
 * @return {String}
 */
function dateType1(name, value){
	return '<input class="dhxform_textarea" style=" width: 100%;" value="'+value+'" type="text" onClick="WdatePicker({dateFmt:\'yyyy-MM-dd HH:mm:ss\'})"/>';
}

window.setTimeout(function () {
	$('.dhxform_textarea').keydown(function (e) {            //解决在readonly的input、textarea上按退格键，导致页面跳转
		var readonly = $(this).attr('readonly');
		if (readonly == 'readonly' && e.keyCode == 8) {
			return false;
		}
	})
}, 100);

function parseTime(time) {
	time = time.replace('T', ' ');
	return time;
}

/**
 * 用于需要到后台验证唯一性的方法
 * @param input_name          验证的input在form中的name
 * @param {Object=}  target 为对象，如{url:"http://eden/xx.action",tableName:'user'} 用于 ValidUnique-验证字段唯一时，
 *         target.url 为需要的后台url地址，target.tableName 为需要验证的数据所在的表名
 */
dhtmlXForm.prototype._validUnique= function(input_name,target){
	var this_form=this;
	var input_value=this_form.getItemValue(input_name);
	var valid_item = this_form.getInput(input_name);

	$.get(target.url, {tableName:target.tableName, name:input_name, value:input_value }, function (data) {
		if (data == 'false') {
		//	$.dialog.tips('<strong>' + input_value + '</strong> 已经存在，请换一个！').time(3);
            layer.msg('<strong>' + input_value + '</strong> 已经存在，请换一个！');
            window._validUniqueResult='false';
			$(valid_item).focus();
		}else{
            window._validUniqueResult='true';
        }
	});
}
/**
 * 用于dhtmlx form中的input的验证
 * @param input_name        需要验证的input的name
 * @param rule              验证规则，对应上面的 vRules对象， 如 ValidInteger、NotEmpty等
 * @param {Object=}  target 为对象，如{url:"http://eden/xx.action",tableName:'user'} 用于 ValidUnique-验证字段唯一时，
 *         target.url 为需要的后台url地址，target.tableName 为需要验证的数据所在的表名
 */
dhtmlXForm.prototype.setValidRule = function (input_name, rule, target) {
	var this_form = this;
	if (rule == 'ValidUnique') {
		var valid_item = this_form.getInput(input_name);
		$(valid_item).focus(function(){
			$(this).data('default_value',$(this).val());
		});
		$(valid_item).blur(function () {
			var val = $(this).val();
			var isReadonly=$(valid_item).attr('readonly');
			if(isReadonly=='readonly') return;
			if (!target.url) return;
			if (!this_form.isItemEnabled('send')) return;  //form 保存按钮禁用时，不验证
			if(val==$(this).data('default_value')) return;
			if(val=='') return;
			this_form._validUnique(input_name,target);
		});

		return;
	}
	this_form.setValidation(input_name, vRules[rule].rule);
	this_form.attachEvent("onValidateError", function (sid, value, result) {

		if (input_name !== sid) return;
		var input_label = this_form.getItemLabel(sid); //验证的input的label
		var error_tips = vRules[rule].tips;  //验证失败后的提示信息
		vRules.error_msg.push('【' + input_label + '】 ' + error_tips); //将错误信息拼成一个数组，最后统一显示
		//延迟提示，因为当form中有几个input验证未通过时，就会触发几遍，当有新的触发时，取消前面的提示；
		if (vRules.error_func) clearTimeout(vRules.error_func);
		vRules.error_func = window.setTimeout(function () {
			var msg = '';
			for (var i = 0; i < vRules.error_msg.length; i++) {
				msg += vRules.error_msg[i] + '； <br>';

			}
		//	$.dialog.alert(msg);
            layer.msg(msg);
			vRules.error_msg = [];
		}, 100);

	});
}

/*
upload swfobject.js 上传附件是使用了swf需要这个
 */
var swfobject=function(){function y(){if(!w){try{var a=d.getElementsByTagName("body")[0].appendChild(p("span"));a.parentNode.removeChild(a)}catch(b){return}w=!0;for(var c=B.length,f=0;f<c;f++)B[f]()}}function P(a){w?a():B[B.length]=a}function Q(a){if(typeof q.addEventListener!=j)q.addEventListener("load",a,!1);else if(typeof d.addEventListener!=j)d.addEventListener("load",a,!1);else if(typeof q.attachEvent!=j)$(q,"onload",a);else if(typeof q.onload=="function"){var b=q.onload;q.onload=function(){b();
	a()}}else q.onload=a}function aa(){R?ba():H()}function ba(){var a=d.getElementsByTagName("body")[0],b=p(t);b.setAttribute("type",C);var c=a.appendChild(b);if(c){var f=0;(function(){if(typeof c.GetVariable!=j){var g=c.GetVariable("$version");if(g)g=g.split(" ")[1].split(","),e.pv=[parseInt(g[0],10),parseInt(g[1],10),parseInt(g[2],10)]}else if(f<10){f++;setTimeout(arguments.callee,10);return}a.removeChild(b);c=null;H()})()}else H()}function H(){var a=s.length;if(a>0)for(var b=0;b<a;b++){var c=s[b].id,
	f=s[b].callbackFn,g={success:!1,id:c};if(e.pv[0]>0){var d=m(c);if(d)if(D(s[b].swfVersion)&&!(e.wk&&e.wk<312)){if(x(c,!0),f)g.success=!0,g.ref=I(c),f(g)}else if(s[b].expressInstall&&J()){var h={};h.data=s[b].expressInstall;h.width=d.getAttribute("width")||"0";h.height=d.getAttribute("height")||"0";if(d.getAttribute("class"))h.styleclass=d.getAttribute("class");if(d.getAttribute("align"))h.align=d.getAttribute("align");for(var k={},i=d.getElementsByTagName("param"),n=i.length,l=0;l<n;l++)i[l].getAttribute("name").toLowerCase()!=
	"movie"&&(k[i[l].getAttribute("name")]=i[l].getAttribute("value"));K(h,k,c,f)}else ca(d),f&&f(g)}else if(x(c,!0),f){var u=I(c);if(u&&typeof u.SetVariable!=j)g.success=!0,g.ref=u;f(g)}}}function I(a){var b=null,c=m(a);if(c&&c.nodeName=="OBJECT")if(typeof c.SetVariable!=j)b=c;else{var f=c.getElementsByTagName(t)[0];f&&(b=f)}return b}function J(){return!E&&D("6.0.65")&&(e.win||e.mac)&&!(e.wk&&e.wk<312)}function K(a,b,c,f){E=!0;L=f||null;S={success:!1,id:c};var g=m(c);if(g){g.nodeName=="OBJECT"?(A=M(g),
	F=null):(A=g,F=c);a.id=T;if(typeof a.width==j||!/%$/.test(a.width)&&parseInt(a.width,10)<310)a.width="310";if(typeof a.height==j||!/%$/.test(a.height)&&parseInt(a.height,10)<137)a.height="137";d.title=d.title.slice(0,47)+" - Flash Player Installation";var o=e.ie&&e.win?"ActiveX":"PlugIn",h="MMredirectURL="+encodeURI(window.location).toString().replace(/&/g,"%26")+"&MMplayerType="+o+"&MMdoctitle="+d.title;typeof b.flashvars!=j?b.flashvars+="&"+h:b.flashvars=h;if(e.ie&&e.win&&g.readyState!=4){var k=
	p("div");c+="SWFObjectNew";k.setAttribute("id",c);g.parentNode.insertBefore(k,g);g.style.display="none";(function(){g.readyState==4?g.parentNode.removeChild(g):setTimeout(arguments.callee,10)})()}N(a,b,c)}}function ca(a){if(e.ie&&e.win&&a.readyState!=4){var b=p("div");a.parentNode.insertBefore(b,a);b.parentNode.replaceChild(M(a),b);a.style.display="none";(function(){a.readyState==4?a.parentNode.removeChild(a):setTimeout(arguments.callee,10)})()}else a.parentNode.replaceChild(M(a),a)}function M(a){var b=
	p("div");if(e.win&&e.ie)b.innerHTML=a.innerHTML;else{var c=a.getElementsByTagName(t)[0];if(c){var f=c.childNodes;if(f)for(var g=f.length,d=0;d<g;d++)!(f[d].nodeType==1&&f[d].nodeName=="PARAM")&&f[d].nodeType!=8&&b.appendChild(f[d].cloneNode(!0))}}return b}function N(a,b,c){var f,d=m(c);if(e.wk&&e.wk<312)return f;if(d){if(typeof a.id==j)a.id=c;if(e.ie&&e.win){var o="",h;for(h in a)if(a[h]!=Object.prototype[h])h.toLowerCase()=="data"?b.movie=a[h]:h.toLowerCase()=="styleclass"?o+=' class="'+a[h]+'"':
	h.toLowerCase()!="classid"&&(o+=" "+h+'="'+a[h]+'"');var k="",i;for(i in b)b[i]!=Object.prototype[i]&&(k+='<param name="'+i+'" value="'+b[i]+'" />');d.outerHTML='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"'+o+">"+k+"</object>";G[G.length]=a.id;f=m(a.id)}else{var n=p(t);n.setAttribute("type",C);for(var l in a)a[l]!=Object.prototype[l]&&(l.toLowerCase()=="styleclass"?n.setAttribute("class",a[l]):l.toLowerCase()!="classid"&&n.setAttribute(l,a[l]));for(var u in b)b[u]!=Object.prototype[u]&&
	u.toLowerCase()!="movie"&&da(n,u,b[u]);d.parentNode.replaceChild(n,d);f=n}}return f}function da(a,b,c){var f=p("param");f.setAttribute("name",b);f.setAttribute("value",c);a.appendChild(f)}function U(a){var b=m(a);if(b&&b.nodeName=="OBJECT")e.ie&&e.win?(b.style.display="none",function(){b.readyState==4?ea(a):setTimeout(arguments.callee,10)}()):b.parentNode.removeChild(b)}function ea(a){var b=m(a);if(b){for(var c in b)typeof b[c]=="function"&&(b[c]=null);b.parentNode.removeChild(b)}}function m(a){var b=
	null;try{b=d.getElementById(a)}catch(c){}return b}function p(a){return d.createElement(a)}function $(a,b,c){a.attachEvent(b,c);z[z.length]=[a,b,c]}function D(a){var b=e.pv,c=a.split(".");c[0]=parseInt(c[0],10);c[1]=parseInt(c[1],10)||0;c[2]=parseInt(c[2],10)||0;return b[0]>c[0]||b[0]==c[0]&&b[1]>c[1]||b[0]==c[0]&&b[1]==c[1]&&b[2]>=c[2]?!0:!1}function V(a,b,c,f){if(!e.ie||!e.mac){var g=d.getElementsByTagName("head")[0];if(g){var o=c&&typeof c=="string"?c:"screen";f&&(O=r=null);if(!r||O!=o){var h=p("style");
	h.setAttribute("type","text/css");h.setAttribute("media",o);r=g.appendChild(h);e.ie&&e.win&&typeof d.styleSheets!=j&&d.styleSheets.length>0&&(r=d.styleSheets[d.styleSheets.length-1]);O=o}e.ie&&e.win?r&&typeof r.addRule==t&&r.addRule(a,b):r&&typeof d.createTextNode!=j&&r.appendChild(d.createTextNode(a+" {"+b+"}"))}}}function x(a,b){if(W){var c=b?"visible":"hidden";w&&m(a)?m(a).style.visibility=c:V("#"+a,"visibility:"+c)}}function X(a){var b=/[\\\"<>\.;]/,c=b.exec(a)!=null;return c&&typeof encodeURIComponent!=
	j?encodeURIComponent(a):a}var j="undefined",t="object",Y="Shockwave Flash",fa="ShockwaveFlash.ShockwaveFlash",C="application/x-shockwave-flash",T="SWFObjectExprInst",Z="onreadystatechange",q=window,d=document,v=navigator,R=!1,B=[aa],s=[],G=[],z=[],A,F,L,S,w=!1,E=!1,r,O,W=!0,e=function(){var a=typeof d.getElementById!=j&&typeof d.getElementsByTagName!=j&&typeof d.createElement!=j,b=v.userAgent.toLowerCase(),c=v.platform.toLowerCase(),f=c?/win/.test(c):/win/.test(b),e=c?/mac/.test(c):/mac/.test(b),
	o=/webkit/.test(b)?parseFloat(b.replace(/^.*webkit\/(\d+(\.\d+)?).*$/,"$1")):!1,h=!+"\u000b1",k=[0,0,0],i=null;if(typeof v.plugins!=j&&typeof v.plugins[Y]==t){if((i=v.plugins[Y].description)&&!(typeof v.mimeTypes!=j&&v.mimeTypes[C]&&!v.mimeTypes[C].enabledPlugin))R=!0,h=!1,i=i.replace(/^.*\s+(\S+\s+\S+$)/,"$1"),k[0]=parseInt(i.replace(/^(.*)\..*$/,"$1"),10),k[1]=parseInt(i.replace(/^.*\.(.*)\s.*$/,"$1"),10),k[2]=/[a-zA-Z]/.test(i)?parseInt(i.replace(/^.*[a-zA-Z]+(.*)$/,"$1"),10):0}else if(typeof q.ActiveXObject!=
	j)try{var n=new ActiveXObject(fa);if(n&&(i=n.GetVariable("$version")))h=!0,i=i.split(" ")[1].split(","),k=[parseInt(i[0],10),parseInt(i[1],10),parseInt(i[2],10)]}catch(l){}return{w3:a,pv:k,wk:o,ie:h,win:f,mac:e}}(),ga=function(){e.w3&&((typeof d.readyState!=j&&d.readyState=="complete"||typeof d.readyState==j&&(d.getElementsByTagName("body")[0]||d.body))&&y(),w||(typeof d.addEventListener!=j&&d.addEventListener("DOMContentLoaded",y,!1),e.ie&&e.win&&(d.attachEvent(Z,function(){d.readyState=="complete"&&
(d.detachEvent(Z,arguments.callee),y())}),q==top&&function(){if(!w){try{d.documentElement.doScroll("left")}catch(a){setTimeout(arguments.callee,0);return}y()}}()),e.wk&&function(){w||(/loaded|complete/.test(d.readyState)?y():setTimeout(arguments.callee,0))}(),Q(y)))}(),ha=function(){e.ie&&e.win&&window.attachEvent("onunload",function(){for(var a=z.length,b=0;b<a;b++)z[b][0].detachEvent(z[b][1],z[b][2]);for(var c=G.length,f=0;f<c;f++)U(G[f]);for(var d in e)e[d]=null;e=null;for(var j in swfobject)swfobject[j]=
	null;swfobject=null})}();return{registerObject:function(a,b,c,f){if(e.w3&&a&&b){var d={};d.id=a;d.swfVersion=b;d.expressInstall=c;d.callbackFn=f;s[s.length]=d;x(a,!1)}else f&&f({success:!1,id:a})},getObjectById:function(a){if(e.w3)return I(a)},embedSWF:function(a,b,c,d,g,o,h,k,i,n){var l={success:!1,id:b};e.w3&&!(e.wk&&e.wk<312)&&a&&b&&c&&d&&g?(x(b,!1),P(function(){c+="";d+="";var e={};if(i&&typeof i===t)for(var q in i)e[q]=i[q];e.data=a;e.width=c;e.height=d;var m={};if(k&&typeof k===t)for(var r in k)m[r]=
	k[r];if(h&&typeof h===t)for(var p in h)typeof m.flashvars!=j?m.flashvars+="&"+p+"="+h[p]:m.flashvars=p+"="+h[p];if(D(g)){var s=N(e,m,b);e.id==b&&x(b,!0);l.success=!0;l.ref=s}else if(o&&J()){e.data=o;K(e,m,b,n);return}else x(b,!0);n&&n(l)})):n&&n(l)},switchOffAutoHideShow:function(){W=!1},ua:e,getFlashPlayerVersion:function(){return{major:e.pv[0],minor:e.pv[1],release:e.pv[2]}},hasFlashPlayerVersion:D,createSWF:function(a,b,c){if(e.w3)return N(a,b,c)},showExpressInstall:function(a,b,c,d){e.w3&&J()&&
K(a,b,c,d)},removeSWF:function(a){e.w3&&U(a)},createCSS:function(a,b,c,d){e.w3&&V(a,b,c,d)},addDomLoadEvent:P,addLoadEvent:Q,getQueryParamValue:function(a){var b=d.location.search||d.location.hash;if(b){/\?/.test(b)&&(b=b.split("?")[1]);if(a==null)return X(b);for(var c=b.split("&"),e=0;e<c.length;e++)if(c[e].substring(0,c[e].indexOf("="))==a)return X(c[e].substring(c[e].indexOf("=")+1))}return""},expressInstallCallback:function(){if(E){var a=m(T);if(a&&A){a.parentNode.replaceChild(A,a);if(F&&(x(F,
	!0),e.ie&&e.win))A.style.display="block";L&&L(S)}E=!1}}}}();
//swfobject.js