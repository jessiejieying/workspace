<%@page contentType="text/html; charset=utf-8"%>
<%@page import="java.io.*"%>
<%@page import="java.text.*"%>
<%@page import="java.util.*"%>
<%@page import="java.sql.*"%>
<%@page import="oracle.sql.BLOB"%>
<%@page import="oracle.jdbc.*"%>
<%@page import="DBstep.iMsgServer2000.*"%>
<%@page import="DBstep.iDBManager2000.*"%>
<%!
  public class iWebRevision {
    private int mFileSize;
    private byte[] mFileBody;
    private String mFileName;
    private String mFieldName;
    private String mFileType;
    private String mRecordID;
    private String mDateTime;
    private String mOption;
    private String mMarkName;
    private String mPassword;
    private String mMarkList;
    private String mHostName;
    private String mMarkGuid;
    private String mFieldValue;
    private String mUserName;
    private String mFilePath;
    private DBstep.iMsgServer2000 MsgObj;
    private DBstep.iDBManager2000 DbaObj;

    //写入大字段信息
    private void PutAtBlob(BLOB vField, int vSize) throws IOException {
      try {
        OutputStream outstream = vField.getBinaryOutputStream();
        outstream.write(mFileBody, 0, vSize);
        outstream.flush();
        outstream.close();
      }
      catch (SQLException e) {
        System.out.println(e.toString());
      }
    }

    //读取大字段信息
    private void GetAtBlob(BLOB vField, int vSize) throws IOException {
      try {
        mFileBody = new byte[vSize];
        InputStream instream = vField.getBinaryStream();
        instream.read(mFileBody, 0, vSize);
        instream.close();
      }
      catch (SQLException e) {
        System.out.println(e.toString());
      }
    }

    //保存签章的版本信息
    private boolean SaveHistory() {
      boolean mResult = false;
      String Sql = "insert into Document_History (ID,RecordID,FieldName,MarkName,UserName,DateTime,HostName,MarkGuid) values (?,?,?,?,?,?,?,?) ";
      int iID;
      iID = DbaObj.GetMaxID("Document_History", "ID");
      if (DbaObj.OpenConnection()) {
        java.sql.PreparedStatement prestmt = null;
        try {
          prestmt = DbaObj.Conn.prepareStatement(Sql);
          prestmt.setInt(1, iID);
          prestmt.setString(2, mRecordID);
          prestmt.setString(3, mFieldName);
          prestmt.setString(4, mMarkName);
          prestmt.setString(5, mUserName);
          prestmt.setString(6, mDateTime);
          prestmt.setString(7, mHostName);
          prestmt.setString(8, mMarkGuid);
          DbaObj.Conn.setAutoCommit(true);
          prestmt.execute();
          DbaObj.Conn.commit();
          prestmt.close();
          DbaObj.Conn.close();
          mResult = true;
        }
        catch (SQLException e) {
          System.out.println(e.toString() + Sql);
          mResult = false;
        }
        DbaObj.CloseConnection();
      }
      return (mResult);
    }

    //列出所有版本信息
    private boolean ShowHistory() {
      mMarkName = "印章名称" + "\r\n";
      mUserName = "签名人" + "\r\n";
      mHostName = "客户端IP" + "\r\n";
      mDateTime = "签章时间" + "\r\n";
      mMarkGuid = "序列号" + "\r\n";
      String Sql = "SELECT MarkName,UserName,DateTime,HostName,MarkGuid FROM Document_History WHERE RecordID='" + mRecordID + "' and FieldName='" + mFieldName + "'";
      boolean mResult = false;
      if (DbaObj.OpenConnection()) {
        try {
          mResult = true;
          ResultSet result = DbaObj.ExecuteQuery(Sql);
          while (result.next()) {
            mMarkName += result.getString("MarkName") + "\r\n";
            mDateTime += result.getString("DateTime") + "\r\n";
            mUserName += result.getString("UserName") + "\r\n";
            mHostName += result.getString("HostName") + "\r\n";
            mMarkGuid += result.getString("MarkGuid") + "\r\n";
          }
          result.close();
        }
        catch (Exception e) {
          System.out.println(e.toString());
          mResult = false;
        }
        DbaObj.CloseConnection();
      }
      return (mResult);
    }

    //取得签名列表
    private boolean SignatureList() {
      String Sql = "SELECT MarkName FROM Signature";
      mMarkList = "";
      boolean mResult = false;
      if (DbaObj.OpenConnection()) {
        try {
          mResult = true;
          ResultSet result = DbaObj.ExecuteQuery(Sql);
          while (result.next()) {
            mMarkList += result.getString("MarkName") + "\r\n";
          }
          result.close();
        }
        catch (Exception e) {
          System.out.println(e.toString());
          mResult = false;
        }
        DbaObj.CloseConnection();
      }
      return (mResult);
    }

    //调入签名纪录
    private boolean SignatureImage(String vMarkName, String vPassWord) {
      String Sql = "SELECT MarkBody,MarkType,MarkSize FROM Signature WHERE MarkName='" + vMarkName + "' and PASSWORD='" + vPassWord + "'";
      boolean mResult = false;
      if (DbaObj.OpenConnection()) {
        try {
          ResultSet result = DbaObj.ExecuteQuery(Sql);
          if (result.next()) {
            mResult = true;
            mFileType = result.getString("MarkType");
            mFileSize = result.getInt("MarkSize");
            GetAtBlob(((OracleResultSet) result).getBLOB("MarkBody"), mFileSize);
            mFileSize = mFileBody.length;
          }
          result.close();
        }
        catch (Exception e) {
          System.out.println(e.toString());
          mResult = false;
        }
        DbaObj.CloseConnection();
      }
      return (mResult);
    }

    //保存签章数据信息
    private boolean SaveSignature() {
      boolean mResult = false;
      int iID;
      iID = DbaObj.GetMaxID("Document_Signature", "ID");
      if (DbaObj.OpenConnection()) {
        java.sql.PreparedStatement prestmt = null;
        try {
          mFileBody = mFieldValue.getBytes();
          mFileSize = mFileBody.length;
          String Sql = "insert into Document_Signature (ID,RecordID,FieldName,FileBody,FileSize,UserName,DateTime,HostName) values (?,?,?,EMPTY_BLOB(),?,?,?,?) ";
          DbaObj.Conn.setAutoCommit(false);
          prestmt = DbaObj.Conn.prepareStatement(Sql);
          prestmt.setInt(1, iID);
          prestmt.setString(2, mRecordID);
          prestmt.setString(3, mFieldName);
          prestmt.setInt(4, mFileSize);
          prestmt.setString(5, mUserName);
          prestmt.setString(6, mDateTime);
          prestmt.setString(7, mHostName);
          prestmt.execute();
          prestmt.close();
          Statement stmt = null;
          stmt = DbaObj.Conn.createStatement();
          OracleResultSet update = (OracleResultSet) stmt.executeQuery("select * from Document_Signature where ID=" + Integer.toString(iID));
          if (update.next()) {
            PutAtBlob(((oracle.jdbc.OracleResultSet) update).getBLOB("FileBody"), mFileSize);
          }
          update.close();
          stmt.close();
          DbaObj.Conn.commit();
          mFileBody = null;
          mResult = true;
        }
        catch (Exception e) {
          System.out.println(e.toString());
          mResult = false;
        }
        DbaObj.CloseConnection();
      }
      return (mResult);
    }

    //更新签章数据信息
    private boolean UpdateSignature() {
      boolean mResult = false;
      if (DbaObj.OpenConnection()) {
        java.sql.PreparedStatement prestmt = null;
        try {
          mFileBody = mFieldValue.getBytes();
          mFileSize = mFileBody.length;
          String Sql = "update Document_Signature Set UserName=?,DateTime=?,HostName=?,FileBody=EMPTY_BLOB(),FileSize=? where RecordID = '" + mRecordID + "' and FieldName='" + mFieldName + "'";
          DbaObj.Conn.setAutoCommit(false);
          prestmt = DbaObj.Conn.prepareStatement(Sql);
          prestmt.setString(1, mUserName);
          prestmt.setString(2, mDateTime);
          prestmt.setString(3, mHostName);
          prestmt.setInt(4, mFileSize);
          prestmt.execute();
          prestmt.close();
          Statement stmt = null;
          stmt = DbaObj.Conn.createStatement();
          OracleResultSet update = (OracleResultSet) stmt.executeQuery("select * from Document_Signature where RecordID = '" + mRecordID + "' and FieldName='" + mFieldName + "'");
          if (update.next()) {
            PutAtBlob(((oracle.jdbc.OracleResultSet) update).getBLOB("FileBody"), mFileSize);
          }
          update.close();
          stmt.close();
          DbaObj.Conn.commit();
          mFileBody = null;
          mResult = true;
        }
        catch (Exception e) {
          System.out.println(e.toString());
          mResult = false;
        }
        DbaObj.CloseConnection();
      }
      return (mResult);
    }

    //判断签章数据信息是否存在
    private boolean ShowSignatureIS() {
      boolean mResult = false;
      String Sql = "SELECT 1 FROM Document_Signature WHERE RecordID='" + mRecordID + "' and FieldName='" + mFieldName + "'";
      if (DbaObj.OpenConnection()) {
        try {
          ResultSet result = DbaObj.ExecuteQuery(Sql);
          if (result.next()) {
            mResult = true;
          }
          else {
            mResult = false;
          }
          result.close();
        }
        catch (Exception e) {
          System.out.println(e.toString());
          mResult = false;
        }
        DbaObj.CloseConnection();
      }
      return (mResult);
    }

    //调出签章数据信息
    private boolean LoadSignature() {
      boolean mResult = false;
      String Sql = "SELECT FileBody,FileSize FROM Document_Signature WHERE RecordID='" + mRecordID + "' and FieldName='" + mFieldName + "'";
      if (DbaObj.OpenConnection()) {
        try {
          ResultSet result = DbaObj.ExecuteQuery(Sql);
          if (result.next()) {
            mFileSize = result.getInt("FileSize");
            System.out.println(mFileSize);
            BLOB blob=((OracleResultSet) result).getBLOB("FileBody");
            System.out.println(blob.length());
            GetAtBlob(blob, mFileSize);
            mResult = true;
          }
          else {
            mResult = false;
          }
          result.close();
        }
        catch (Exception e) {
          System.out.println(e.toString());
          mResult = false;
        }
        DbaObj.CloseConnection();
      }
      return (mResult);
    }

    //取得客户端发来的数据包
    private byte[] ReadPackage(HttpServletRequest request) {
      byte mStream[] = null;
      int totalRead = 0;
      int readBytes = 0;
      int totalBytes = 0;
      try {
        totalBytes = request.getContentLength();
        mStream = new byte[totalBytes];
        while (totalRead < totalBytes) {
          request.getInputStream();
          readBytes = request.getInputStream().read(mStream, totalRead, totalBytes - totalRead);
          totalRead += readBytes;
          continue;
        }
      }
      catch (Exception e) {
        System.out.println(e.toString());
      }
      return (mStream);
    }

    //发送处理后的数据包
    private void SendPackage(HttpServletResponse response) {
      try {
        ServletOutputStream OutBinarry = response.getOutputStream();
        OutBinarry.write(MsgObj.MsgVariant());
        OutBinarry.flush();
        OutBinarry.close();
      }
      catch (Exception e) {
        System.out.println(e.toString());
      }
    }

    //具体处理客户端控件请求的函数
    public void ExecuteRun(HttpServletRequest request, HttpServletResponse response) {
      mOption = "";
      mRecordID = "";
      mFileBody = null;
      mFileName = "";
      mFileType = "";
      mFileSize = 0;
      mDateTime = "";
      mMarkName = "";
      mPassword = "";
      mMarkList = "";
      mMarkGuid = "";
      mUserName = "";
      mFieldName = "";
      mHostName = "";
      mFieldValue = "";
      mFilePath = request.getSession().getServletContext().getRealPath("");     //取得服务器路径
      DbaObj = new DBstep.iDBManager2000();
      MsgObj = new DBstep.iMsgServer2000();
      System.out.println("-----------------------------");
      System.out.println("ReadPackage");

      try {
        if (request.getMethod().equalsIgnoreCase("POST")) {
          MsgObj.MsgVariant(ReadPackage(request));
          if (MsgObj.GetMsgByName("DBSTEP").equalsIgnoreCase("DBSTEP")) {       //检测客户端传递的数据包格式
            mOption = MsgObj.GetMsgByName("OPTION");                            //取得操作类型
            System.out.println(mOption);
            System.out.println(MsgObj.GetMsgByName("RECORDID"));
            if (mOption.equalsIgnoreCase("SIGNATRUELIST")) {                    //下面的代码为创建印章列表
              MsgObj.MsgTextClear();                                            //清除SetMsgByName设置的值
              if (SignatureList()) {                                            //调入印章列表
                MsgObj.SetMsgByName("SIGNATRUELIST", mMarkList);                //设置印章列表字符串
                MsgObj.MsgError("");                                            //清除错误信息
              }
              else {
                MsgObj.MsgError("创建印章列表失败!");                           //设置错误信息
              }
            }
            else if (mOption.equalsIgnoreCase("SIGNATRUEIMAGE")) {              //下面的代码为调入印章图案
              mMarkName = MsgObj.GetMsgByName("IMAGENAME");                     //取得印章名称
              mUserName = MsgObj.GetMsgByName("USERNAME");                      //取得用户名
              mPassword = MsgObj.GetMsgByName("PASSWORD");                      //取得印章密码
              MsgObj.MsgTextClear();                                            //清除SetMsgByName设置的值
              if (SignatureImage(mMarkName, mPassword)) {                       //调入印章
                MsgObj.SetMsgByName("IMAGETYPE", mFileType);                    //设置图片类型
                MsgObj.MsgFileBody(mFileBody);                                  //将签章数据信息打包
                MsgObj.SetMsgByName("STATUS", "打开成功!");                     //设置状态信息
                MsgObj.MsgError("");                                            //清除错误信息
              }
              else {
                MsgObj.MsgError("签名或密码错误!");                             //设置错误信息
              }
            }
            else if (mOption.equalsIgnoreCase("SAVESIGNATURE")) {               //下面的代码为更新印章数据
              mRecordID = MsgObj.GetMsgByName("RECORDID");                      //取得文档编号
              mFieldName = MsgObj.GetMsgByName("FIELDNAME");                    //取得签章字段名称
              mFieldValue = MsgObj.GetMsgByName("FIELDVALUE");                  //取得签章数据内容
              mUserName = MsgObj.GetMsgByName("USERNAME");                      //取得用户名称
              mDateTime = MsgObj.GetMsgByName("DATETIME");                      //取得签章日期时间
              mHostName = request.getRemoteAddr();                              //取得客户端IP
              MsgObj.MsgTextClear();                                            //清除SetMsgByName设置的值
              //System.out.println(mFilePath+"/"+mRecordID+"_"+mFieldName+".gif");
              //MsgObj.MsgFileSave(mFilePath+"/"+mRecordID+"_"+mFieldName+".gif");    //在服务器保存输出成图片
              if (ShowSignatureIS()) {                                          //判断是否已经存在签章记录
                if (UpdateSignature()) {                                        //更新签章数据
                  MsgObj.SetMsgByName("STATUS", "更新成功!");                   //设置状态信息
                  MsgObj.MsgError("");                                          //清除错误信息
                }
                else {
                  MsgObj.MsgError("保存签章信息失败!");                         //设置错误信息
                }
              }
              else {
                if (SaveSignature()) {                                          //保存签章数据
                  MsgObj.SetMsgByName("STATUS", "保存成功!");                   //设置状态信息
                  MsgObj.MsgError("");                                          //清除错误信息
                }
                else {
                  MsgObj.MsgError("保存签章信息失败!");                         //设置错误信息
                }
              }
            }
            else if (mOption.equalsIgnoreCase("LOADSIGNATURE")) {               //下面的代码为调入签章数据
              mRecordID = MsgObj.GetMsgByName("RECORDID");                      //取得文档编号
              mFieldName = MsgObj.GetMsgByName("FIELDNAME");                    //取得签章字段名称
              mUserName = MsgObj.GetMsgByName("USERNAME");                      //取得用户名称
              MsgObj.MsgTextClear();                                            //清除SetMsgByName设置的值
              if (LoadSignature()) {                                            //调入签章数据信息
                mFieldValue = new String(mFileBody);                            //转化为字符串
                MsgObj.SetMsgByName("FIELDVALUE", mFieldValue);                 //设置签章数据
                MsgObj.SetMsgByName("STATUS", "调入成功!");                     //设置状态信息
                MsgObj.MsgError("");                                            //清除错误信息
              }
              else {
                MsgObj.MsgError("调入标签失败!");                               //设置错误信息
              }
            }
            else if (mOption.equalsIgnoreCase("SAVEHISTORY")) {                 //下面的代码为保存印章历史信息
              mRecordID = MsgObj.GetMsgByName("RECORDID");                      //取得文档编号
              mFieldName = MsgObj.GetMsgByName("FIELDNAME");                    //取得签章字段名称
              mMarkName = MsgObj.GetMsgByName("MARKNAME");                      //取得签章名称
              mUserName = MsgObj.GetMsgByName("USERNAME");                      //取得用户名称
              mDateTime = MsgObj.GetMsgByName("DATETIME");                      //取得签章日期时间
              mHostName = request.getRemoteAddr();                              //取得客户端IP
              mMarkGuid = MsgObj.GetMsgByName("MARKGUID");                      //取得序列号
              MsgObj.MsgTextClear();                                            //清除SetMsgByName设置的值
              if (SaveHistory()) {                                              //保存印章历史信息
                MsgObj.SetMsgByName("MARKNAME", mMarkName);                     //将签章名称列表打包
                MsgObj.SetMsgByName("USERNAME", mUserName);                     //将用户名列表打包
                MsgObj.SetMsgByName("DATETIME", mDateTime);                     //将签章日期列表打包
                MsgObj.SetMsgByName("HOSTNAME", mHostName);                     //将客户端IP列表打包
                MsgObj.SetMsgByName("MARKGUID", mMarkGuid);                     //将序列号列表打包
                MsgObj.SetMsgByName("STATUS", "保存印章日志成功!");             //设置状态信息
                MsgObj.MsgError("");                                            //清除错误信息
              }
              else {
                MsgObj.MsgError("保存印章日志失败!");                           //设置错误信息
              }
            }
            else if (mOption.equalsIgnoreCase("SHOWHISTORY")) {                 //下面的代码为打开签章历史信息
              mRecordID = MsgObj.GetMsgByName("RECORDID");                      //取得文档编号
              mFieldName = MsgObj.GetMsgByName("FIELDNAME");                    //取得签章字段名称
              mUserName = MsgObj.GetMsgByName("USERNAME");                      //取得用户名
              MsgObj.MsgTextClear();                                            //清除SetMsgByName设置的值
              if (ShowHistory()) {                                              //调入印章历史信息
                MsgObj.SetMsgByName("MARKNAME", mMarkName);                     //将签章名称列表打包
                MsgObj.SetMsgByName("USERNAME", mUserName);                     //将用户名列表打包
                MsgObj.SetMsgByName("DATETIME", mDateTime);                     //将签章日期列表打包
                MsgObj.SetMsgByName("HOSTNAME", mHostName);                     //将客户端IP列表打包
                MsgObj.SetMsgByName("MARKGUID", mMarkGuid);                     //将序列号列表打包
                MsgObj.SetMsgByName("STATUS", "调入印章日志成功");              //设置状态信息
                MsgObj.MsgError("");                                            //清除错误信息
              }
              else {
                MsgObj.SetMsgByName("STATUS", "调入印章日志失败");              //设置状态信息
                MsgObj.MsgError("调入印章日志失败");                            //设置错误信息
              }
            }

            else if (mOption.equalsIgnoreCase("SENDMESSAGE")) {
              String mCommand=MsgObj.GetMsgByName("COMMAND");
              String mInfo = MsgObj.GetMsgByName("TESTINFO");
              MsgObj.MsgTextClear();
              MsgObj.MsgFileClear();
              System.out.println(mCommand);
              if (mCommand.equalsIgnoreCase("SELFINFO")){
                mInfo = "服务器端收到客户端传来的信息：“" + mInfo + "”\r\n" ;
                //组合返回给客户端的信息
                mInfo = mInfo + "服务器端发回当前服务器时间：" + DbaObj.GetDateTime();
                MsgObj.SetMsgByName("RETURNINFO",mInfo);					//将返回的信息设置到信息包中
              }
              else{
                MsgObj.MsgError("客户端Web发送数据包命令没有合适的处理函数!["+mCommand+"]");
                MsgObj.MsgTextClear();
                MsgObj.MsgFileClear();
              }
            }

          }
          else {
            MsgObj.MsgError("客户端发送数据包错误!");
            MsgObj.MsgTextClear();
            MsgObj.MsgFileClear();
          }
        }
        else {
          MsgObj.MsgError("请使用Post方法");
          MsgObj.MsgTextClear();
          MsgObj.MsgFileClear();
        }
        System.out.println("SendPackage");
        SendPackage(response);
      }
      catch (Exception e) {
        System.out.println(e.toString());
      }
    }
  }
%>
<%
  System.out.println("oracle iwebserver");
  iWebRevision iWebServer = new iWebRevision();
  iWebServer.ExecuteRun(request, response);
  out.clear();                                                                    //用于解决JSP页面中“已经调用getOutputStream()”问题
  out=pageContext.pushBody();                                                     //用于解决JSP页面中“已经调用getOutputStream()”问题
%>
