/*
输出scheduler 的数据
This software is allowed to use under GPL or you need to obtain Commercial or Enterise License
to use it in non-GPL project. Please contact sales@dhtmlx.com for details
*/
scheduler.data_attributes=function(){var g=[],c=scheduler.templates.xml_format,b;for(b in this._events){var e=this._events[b],d;for(d in e)d.substr(0,1)!="_"&&g.push([d,d=="start_date"||d=="end_date"?c:null]);break}return g};
scheduler.toXML=function(g){var c=[],b=this.data_attributes(),e;for(e in this._events){var d=this._events[e];if(d.id.toString().indexOf("#")==-1){c.push("<event>");for(var a=0;a<b.length;a++)c.push("<"+b[a][0]+"><![CDATA["+(b[a][1]?b[a][1](d[b[a][0]]):d[b[a][0]])+"]]\></"+b[a][0]+">");c.push("</event>")}}return(g||"")+"<data>"+c.join("\n")+"</data>"};
scheduler.toJSON=function(){var g=[],c=this.data_attributes(),b;for(b in this._events){var e=this._events[b];if(e.id.toString().indexOf("#")==-1){for(var e=this._events[b],d=[],a=0;a<c.length;a++)d.push(' "'+c[a][0]+'": "'+((c[a][1]?c[a][1](e[c[a][0]]):e[c[a][0]])||"").toString().replace(/\n/g,"")+'" ');g.push("{"+d.join(",")+"}")}}return"["+g.join(",\n")+"]"};
scheduler.toICal=function(g){var c="BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//dhtmlXScheduler//NONSGML v2.2//EN\nDESCRIPTION:",b="END:VCALENDAR",e=scheduler.date.date_to_str("%Y%m%dT%H%i%s"),d=scheduler.date.date_to_str("%Y%m%d"),a=[],h;for(h in this._events){var f=this._events[h];f.id.toString().indexOf("#")==-1&&(a.push("BEGIN:VEVENT"),!f._timed||!f.start_date.getHours()&&!f.start_date.getMinutes()?a.push("DTSTART:"+d(f.start_date)):a.push("DTSTART:"+e(f.start_date)),!f._timed||!f.end_date.getHours()&&
!f.end_date.getMinutes()?a.push("DTEND:"+d(f.end_date)):a.push("DTEND:"+e(f.end_date)),a.push("SUMMARY:"+f.text),a.push("END:VEVENT"))}return c+(g||"")+"\n"+a.join("\n")+"\n"+b};

