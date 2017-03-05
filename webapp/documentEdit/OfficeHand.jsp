<%@page import="com.rj.eden.oa.util.doclock.DocLockProvider"%>
<%@page contentType="text/html; charset=utf-8"%>
<%


String op=request.getParameter("op");
if(op!=null&&op.equals("removeLock")) 
{
	  System.out.println("removeLock");
	  String mRecordID=request.getParameter("mRecordID");
  	DocLockProvider docLockProvider=new DocLockProvider();
  	docLockProvider.removeDocLock(mRecordID);
	
}

%>
