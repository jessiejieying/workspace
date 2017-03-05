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

  /*	var page1=document.createElement("div");
   page1.id="page1";
   page1.innerHTML= document.innerHTML;
   document.body.appendChild(page1);
   */

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
  /* 	if(how == '打印预览...')
   document.getElementById("jatoolsPrinter").printPreview(myDoc );   // 打印预览
   else if(how == '打印...')
   document.getElementById("jatoolsPrinter").print(myDoc ,true);   // 打印前弹出打印设置对话框
   else
   document.getElementById("jatoolsPrinter").print(myDoc ,false);       // 不弹出对话框打印
   */
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

var jsBillInput;
// 打印公用js文件
$(window).load(function () {
  print_full_lodop();
})
