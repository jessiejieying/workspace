<%@ page contentType="text/html; charset=utf-8" %>
<%@ page import="java.io.*,java.text.*,java.util.*,java.sql.*,javax.servlet.*,javax.servlet.http.*" %>

 <script type="text/javascript">

if ((navigator.userAgent.indexOf('MSIE') >= 0) && (navigator.userAgent.indexOf('Opera') < 0)){

	var str = '';
	str += '<div id="DivID">';
	str += '<object id="WebOffice" width="100%" height="100%" classid="clsid:8B23EA28-2009-402F-92C4-59BE0E063499" codebase="<%=request.getContextPath() %>/iWebOffice2009.cab#version=10.8.5.6">';
	str += '</object>';
	str += '</div>';
	document.write(str); 
	}else{
		
		var str='<object id="WebOffice"  width="100%" height="100%" progid="iWebOffice2009.HandWriteCtrl" type="application/iwebplugin" Copyright="金格科技iWebPlugin多浏览器插件[演示版];V5.0S0xGAAEAAAAAAAAAEAAAAGoBAABwAQAALAAAADZicNjUxIvdp2tQOtALFDP/H3lY+cT3AgMj0PqXB00VnzBtyS7pmQ2gFJigUCYLQvgSX2jn4F3hW7wkVH+0ljcMfPTh9Yva06lSjJeg/Be9+5kuc5xW2qswqgMehqVSItpvjEMZFBfJ6jGN/6gRGfs7e//HtnAEjgr3YrPo3oQhg3MpAdYhqUhbgeMwi1+vMBTXd/oFdmGlJBkevmPKRna8y63LiJqJwbjCJt+lLqhiwY8RZ4U9F0rk+Tibl9hbxpRpfvahde+sKeuAbbw2qmZ2vIZV2TuAPGjQUM/I7V+AswJ6kMCHiSUF2RZKvDY6tbUGdpkD8EhmRAdeVojx6wKPi+WJM6XmoxgIl2fmOc9a7S6GaHCjCWzzAP4x/a3VNDFMxEjRSI9A8Al8ZpjJQz4tlOm1qT4PooZL00Tn9wKV54+PdT/qMadETe4L5TG1vnfioZYhNKfptmWzcF/HA+gFvrW9qV8nmCDhgcp2dASfu1sSsHcmWor+ayokFY5cTA==" OnMenuClick="OnMenuClick" OnToolsClick="OnToolsClick"	 OnExecuteScripted="OnExecuteScripted"> </object> ';
		
		document.write(str); 
		
	}
	
	</script>
