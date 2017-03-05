/**
作者: Madiss
说明：通过同步顶级页面的css路径，用于列表页面切换主题
**/

function loadExtentFile(filePath, fileType){
    if(fileType == "js"){
        var oJs = document.createElement('script');        
        oJs.setAttribute("type","text/javascript");
        oJs.setAttribute("src", filePath);  //文件的地址
        document.getElementsByTagName("head")[0].appendChild(oJs);//绑定
    }else if(fileType == "css"){
        var oCss = document.createElement("link"); 
        oCss.setAttribute("rel", "stylesheet"); 
        oCss.setAttribute("type", "text/css");  
        oCss.setAttribute("href", filePath);
        document.getElementsByTagName("head")[0].appendChild(oCss);//绑定
    }else if(fileType == "less"){
    	var oLess = document.createElement("link"); 
        oLess.setAttribute("rel", "stylesheet/less"); 
        oLess.setAttribute("type", "text/css");  
        oLess.setAttribute("href", filePath);
        document.getElementsByTagName("head")[0].appendChild(oLess);//绑定
    }
}


function setSkinsCss(ids){
	var stylesWin = window.top;
	var openerWin = window.opener;
	if( openerWin != null)
		stylesWin = openerWin.top;
	
	ids = ids.split(",");
	for(i=0;i<ids.length;i++){
		var css = stylesWin.document.getElementById(ids[i]);
		var cssLink = css.getAttribute("href");
		loadExtentFile(cssLink,'css');
	}
}

//根据顶部窗口添加less要引入的less文件
function setSkinsLess(id){
	var stylesWin = window.top;
	var openerWin = window.opener;
	var lessLink;
	if( openerWin != null)
		stylesWin = openerWin.top;

	var less = stylesWin.document.getElementById(id);

	if(less){
		 lessLink = less.getAttribute("href");
	}
	else{
		 lessLink="";
	}
	
	document.write('<link rel="stylesheet" type="text/css" attr="skins" id="'+id+'" href="'+lessLink+'">');
	
	//loadExtentFile(lessLink,'less');
	
	var base = stylesWin.base ;
	//loadExtentFile( base+'/edenui/common/css/tool/less/less.min.js','js');

}

var hval, hva, hvss, hvl, hvcss, hvimg, hvjs;

function getskin(obj, skins) {
	var at = $(obj).attr('attr');
	if (at == 'skins') {
		hval = $(obj).attr('href');
		hva = hval.split('/');
		hvss = hval.split('skins');
		hvl = hva.length;

		var i = hva[hvl - 1].split('.')[1];
		if (i == "css") {
			hvcss = hva[hvl - 2] + "/" + hva[hvl - 1];
			$(obj).attr('href', hvss[0] + '/skins/m_' + skins + '/' + hvcss);
		} else if (i == "js") {
			hvjs = hva[hvl - 2] + "/" + hva[hvl - 1];
			$(obj).attr('src', hvss[0] + '/skins/m_' + skins + '/' + hvjs);
		} else {
			hvimg = hva[hvl - 2] + "/" + hva[hvl - 1];
			$(obj).attr('src', hvss[0] + '/skins/m_' + skins + '/' + hvimg);
		}
	}
}


function changeSkins(skins) {

	var skins = skins;


	var tbbg = $(window.top.document.body).attr('style');
	tbbg = tbbg.replace(/\/skins\/(\S+)\/bg/ig, "/skins/" + skins + "/bg");


	$(window.top.document.body).attr('style', tbbg);

	$(window.top.document).find('link').each(function (index) {
			getskin(this, skins);
		});
	$(window.top.document).find('img').each(function (index) {
			var at = $(this).attr('attr');
			if (at == 'skins') {
				hval = $(this).attr('src');
				hva = hval.split('/');
				hvss = hval.split('skins');
				hvl = hva.length;
				hvimg = hva[hvl - 2] + "/" + hva[hvl - 1];
				$(this).attr('src', hvss[0] + '/skins/m_' + skins + '/' + hvimg);
			}
		});
	$(window.top.document).find('script').each(function (index) {
			var at = $(this).attr('attr');
			if (at == 'skins') {
				hval = $(this).attr('src');
				hva = hval.split('/');
				hvss = hval.split('skins');
				hvl = hva.length;
				hvjs = hva[hvl - 2] + "/" + hva[hvl - 1];
				//alert(hvss[0]+'/skins/'+skins+'/'+hvjs);
				$(this).attr('src', hvss[0] + '/skins/m_' + skins + '/' + hvjs);
			}
		});
	$(window.top.document).find("iframe").each(function (index) {
		$(this).contents().find('link').each(function (index) {
				getskin(this, skins);
			})

		$(this).contents().find('img').each(function (index) {
				var at = $(this).attr('attr');
				if (at == 'skins') {
					hval = $(this).attr('src');
					hva = hval.split('/');
					hvss = hval.split('skins');
					hvl = hva.length;
					hvimg = hva[hvl - 3] + "/" + hva[hvl - 2] + "/" + hva[hvl - 1];
					$(this).attr('src', hvss[0] + '/skins/m_' + skins + '/' + hvimg);
				}
			});

		$(this).contents().find('script').each(function (index) {
				var at = $(this).attr('attr');
				if (at == 'skins') {
					hval = $(this).attr('src');
					hva = hval.split('/');
					hvss = hval.split('skins');
					hvl = hva.length;
					hvjs = hva[hvl - 2] + "/" + hva[hvl - 1];
					$(this).attr('src', hvss[0] + '/skins/m_' + skins + '/' + hvjs);
				}
			});

	})


	window.top.layout();

}

