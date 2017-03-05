/*
This software is allowed to use under GPL or you need to obtain Commercial or Enterise License
to use it in non-GPL project. Please contact sales@dhtmlx.com for details
*/
(function(){function g(a){return a.replace(newline_regexp,"\n").replace(html_regexp,"")}function x(a,e){a=parseFloat(a);e=parseFloat(e);isNaN(e)||(a-=e);var c=s(a),a=a-c.width+c.cols*h;return isNaN(a)?"auto":100*a/h}function B(a,e,c){a=parseFloat(a);e=parseFloat(e);!isNaN(e)&&c&&(a-=e);var d=s(a),a=a-d.width+d.cols*h;return isNaN(a)?"auto":100*a/(h-(!isNaN(e)?e:0))}function s(a){for(var e=0,c=scheduler._els.dhx_cal_header[0].childNodes,d=c[1]?c[1].childNodes:c[0].childNodes,b=0;b<d.length;b++){var f=
d[b].style?d[b]:d[b].parentNode,g=parseFloat(f.style.width);if(a>g)a-=g+1,e+=g+1;else break}return{width:e,cols:b}}function y(a){a=parseFloat(a);return isNaN(a)?"auto":100*a/n}function k(a,e){return(window.getComputedStyle?window.getComputedStyle(a,null)[e]:a.currentStyle?a.currentStyle[e]:null)||""}function F(a,e){for(var c=parseInt(a.style.left,10),d=0;d<scheduler._cols.length;d++)if(c-=scheduler._cols[d],c<0)return d;return e}function G(a,e){for(var c=parseInt(a.style.top,10),d=0;d<scheduler._colsS.heights.length;d++)if(scheduler._colsS.heights[d]>
c)return d;return e}function H(a){return a?"<"+a+">":""}function q(a){return a?"</"+a+">":""}function t(a,e,c,d){var b="<"+a+" profile='"+e+"'";c&&(b+=" header='"+c+"'");d&&(b+=" footer='"+d+"'");b+=">";return b}function u(){var a="",e=scheduler._mode;scheduler.matrix&&scheduler.matrix[scheduler._mode]&&(e=scheduler.matrix[scheduler._mode].render=="cell"?"matrix":"timeline");a+="<scale mode='"+e+"' today='"+scheduler._els.dhx_cal_date[0].innerHTML+"'>";if(scheduler._mode=="week_agenda")for(var c=
scheduler._els.dhx_cal_data[0].getElementsByTagName("DIV"),d=0;d<c.length;d++)c[d].className=="dhx_wa_scale_bar"&&(a+="<column>"+g(c[d].innerHTML)+"</column>");else if(scheduler._mode=="agenda"||scheduler._mode=="map")c=scheduler._els.dhx_cal_header[0].childNodes[0].childNodes,a+="<column>"+g(c[0].innerHTML)+"</column><column>"+g(c[1].innerHTML)+"</column>";else if(scheduler._mode=="year"){c=scheduler._els.dhx_cal_data[0].childNodes;for(d=0;d<c.length;d++)a+="<month label='"+g(c[d].childNodes[0].innerHTML)+
"'>",a+=r(c[d].childNodes[1].childNodes),a+=v(c[d].childNodes[2]),a+="</month>"}else{a+="<x>";c=scheduler._els.dhx_cal_header[0].childNodes;a+=r(c);a+="</x>";var b=scheduler._els.dhx_cal_data[0];if(scheduler.matrix&&scheduler.matrix[scheduler._mode]){a+="<y>";for(d=0;d<b.firstChild.rows.length;d++){var f=b.firstChild.rows[d];a+="<row><![CDATA["+g(f.cells[0].innerHTML)+"]]\></row>"}a+="</y>";n=b.firstChild.rows[0].cells[0].offsetHeight}else if(b.firstChild.tagName=="TABLE")a+=v(b);else{for(b=b.childNodes[b.childNodes.length-
1];b.className.indexOf("dhx_scale_holder")==-1;)b=b.previousSibling;b=b.childNodes;a+="<y>";for(d=0;d<b.length;d++)a+="\n<row><![CDATA["+g(b[d].innerHTML)+"]]\></row>";a+="</y>";n=b[0].offsetHeight}}a+="</scale>";return a}function v(a){for(var e="",c=a.firstChild.rows,d=0;d<c.length;d++){for(var b=[],f=0;f<c[d].cells.length;f++)b.push(c[d].cells[f].firstChild.innerHTML);e+="\n<row height='"+a.firstChild.rows[d].cells[0].offsetHeight+"'><![CDATA["+g(b.join("|"))+"]]\></row>";n=a.firstChild.rows[0].cells[0].offsetHeight}return e}
function r(a){var e="";if(scheduler.matrix&&scheduler.matrix[scheduler._mode]){if(scheduler.matrix[scheduler._mode].second_scale)var c=a[1].childNodes;a=a[0].childNodes}for(var d=0;d<a.length;d++)e+="\n<column><![CDATA["+g(a[d].innerHTML)+"]]\></column>";h=a[0].offsetWidth;if(c)for(var b=0,f=a[0].offsetWidth,o=1,d=0;d<c.length;d++)e+="\n<column second_scale='"+o+"'><![CDATA["+g(c[d].innerHTML)+"]]\></column>",b+=c[d].offsetWidth,b>=f&&(f+=a[o]?a[o].offsetWidth:0,o++),h=c[0].offsetWidth;return e}function C(a){var e=
"",c=scheduler._rendered,d=scheduler.matrix&&scheduler.matrix[scheduler._mode];if(scheduler._mode=="agenda"||scheduler._mode=="map")for(var b=0;b<c.length;b++)e+="<event><head>"+g(c[b].childNodes[0].innerHTML)+"</head><body>"+g(c[b].childNodes[2].innerHTML)+"</body></event>";else if(scheduler._mode=="week_agenda")for(b=0;b<c.length;b++)e+="<event day='"+c[b].parentNode.getAttribute("day")+"'><body>"+g(c[b].innerHTML)+"</body></event>";else if(scheduler._mode=="year"){c=scheduler.get_visible_events();
for(b=0;b<c.length;b++){var f=c[b].start_date;if(f.valueOf()<scheduler._min_date.valueOf())f=scheduler._min_date;for(;f<c[b].end_date;){var o=f.getMonth()+12*(f.getFullYear()-scheduler._min_date.getFullYear())-scheduler.week_starts._month,p=scheduler.week_starts[o]+f.getDate()-1,j=a?k(scheduler._get_year_cell(f),"color"):"",i=a?k(scheduler._get_year_cell(f),"backgroundColor"):"";e+="<event day='"+p%7+"' week='"+Math.floor(p/7)+"' month='"+o+"' backgroundColor='"+i+"' color='"+j+"'></event>";f=scheduler.date.add(f,
1,"day");if(f.valueOf()>=scheduler._max_date.valueOf())break}}}else if(d&&d.render=="cell"){c=scheduler._els.dhx_cal_data[0].getElementsByTagName("TD");for(b=0;b<c.length;b++)j=a?k(c[b],"color"):"",i=a?k(c[b],"backgroundColor"):"",e+="\n<event><body backgroundColor='"+i+"' color='"+j+"'><![CDATA["+g(c[b].innerHTML)+"]]\></body></event>"}else for(b=0;b<c.length;b++){var l,h;if(scheduler.matrix&&scheduler.matrix[scheduler._mode])l=x(c[b].style.left),h=x(c[b].offsetWidth)-1;else{var D=scheduler.config.use_select_menu_space?
0:26;l=B(c[b].style.left,D,!0);h=B(c[b].style.width,D)-1}if(!isNaN(h*1)){var m=y(c[b].style.top),q=y(c[b].style.height),z=c[b].className.split(" ")[0].replace("dhx_cal_","");if(z!=="dhx_tooltip_line"){var A=scheduler.getEvent(c[b].getAttribute("event_id")),p=A._sday,w=A._sweek,s=A._length||0;if(scheduler._mode=="month")q=parseInt(c[b].offsetHeight,10),m=parseInt(c[b].style.top,10)-22,p=F(c[b],p),w=G(c[b],w);else if(scheduler.matrix&&scheduler.matrix[scheduler._mode]){var p=0,t=c[b].parentNode.parentNode.parentNode,
w=t.rowIndex,u=n;n=c[b].parentNode.offsetHeight;m=y(c[b].style.top);m-=m*0.2;n=u}else{if(c[b].parentNode==scheduler._els.dhx_cal_data[0])continue;var r=scheduler._els.dhx_cal_data[0].childNodes[0],v=parseFloat(r.className.indexOf("dhx_scale_holder")!=-1?r.style.left:0);l+=x(c[b].parentNode.style.left,v)}e+="\n<event week='"+w+"' day='"+p+"' type='"+z+"' x='"+l+"' y='"+m+"' width='"+h+"' height='"+q+"' len='"+s+"'>";z=="event"?(e+="<header><![CDATA["+g(c[b].childNodes[1].innerHTML)+"]]\></header>",
j=a?k(c[b].childNodes[2],"color"):"",i=a?k(c[b].childNodes[2],"backgroundColor"):"",e+="<body backgroundColor='"+i+"' color='"+j+"'><![CDATA["+g(c[b].childNodes[2].innerHTML)+"]]\></body>"):(j=a?k(c[b],"color"):"",i=a?k(c[b],"backgroundColor"):"",e+="<body backgroundColor='"+i+"' color='"+j+"'><![CDATA["+g(c[b].innerHTML)+"]]\></body>");e+="</event>"}}}return e}function E(a,e,c,d,b,f,g){var h=!1;b=="fullcolor"&&(h=!0,b="color");b=b||"color";html_regexp=RegExp("<[^>]*>","g");newline_regexp=RegExp("<br[^>]*>",
"g");var j=scheduler.uid(),i=document.createElement("div");i.style.display="none";document.body.appendChild(i);i.innerHTML='<form id="'+j+'" method="post" target="_blank" action="'+d+'" accept-charset="utf-8" enctype="application/x-www-form-urlencoded"><input type="hidden" name="mycoolxmlbody"/> </form>';var l="";if(a){for(var k=scheduler._date,n=scheduler._mode,l=t("pages",b,f,g),m=new Date(a);+m<+e;m=scheduler.date.add(m,1,c))scheduler.setCurrentView(m,c),l+=H("page")+u().replace("\u2013","-")+
C(h)+q("page");l+=q("pages");scheduler.setCurrentView(k,n)}else l=t("data",b,f,g)+u().replace("\u2013","-")+C(h)+q("data");document.getElementById(j).firstChild.value=encodeURIComponent(l);document.getElementById(j).submit();i.parentNode.removeChild(i)}var h,n;scheduler.toPDF=function(a,e,c,d){return E.apply(this,[null,null,null,a,e,c,d])};scheduler.toPDFRange=function(a,e,c,d,b,f,g){typeof a=="string"&&(a=scheduler.templates.api_date(a),e=scheduler.templates.api_date(e));return E.apply(this,arguments)}})();
