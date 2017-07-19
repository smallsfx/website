<%@ page import="java.util.ArrayList"%>
<%@ page import="java.util.Random"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
String api = request.getParameter("api");
int pagenumber = 1;
int dataSize = 35;
int pageSize = 5;
int pageCount = dataSize/pageSize;
if( pageCount * pageSize < dataSize){
  pageCount+=1;
}
if(request.getParameter("pagenumber")!=null){
  pagenumber = Integer.parseInt( request.getParameter("pagenumber") );
}/*
if( pageCount==pagenumber-1){
  pageSize = pageSize - dataSize*pageSize - pagenumber*pageSize;
}*/

// 输出客户端请求参数
//=====================================================================
System.out.println("request:{");
System.out.println("\r\nCLIENT ===> SERVER ["+api+"]");
System.out.println("\t"+basePath);
String ip = request.getHeader("X-Forwarded-For");  
if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {  
    ip = request.getHeader("Proxy-Client-IP");  
}  
if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {  
    ip = request.getHeader("WL-Proxy-Client-IP");  
}  
if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {  
    ip = request.getHeader("HTTP_CLIENT_IP");  
}  
if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {  
    ip = request.getHeader("HTTP_X_FORWARDED_FOR");  
}  
if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {  
    ip = request.getRemoteAddr();  
}
System.out.println("\tIP:"+ip);
System.out.println("\tUser-Agent:"+request.getHeader("User-Agent"));
System.out.println("}");
//=====================================================================

// 输出客户端接口参数
//=====================================================================
System.out.println("params:{");
java.util.Enumeration eNames = request.getParameterNames();
String key=null;
String value=null;
while(eNames.hasMoreElements()){
  key = (String)eNames.nextElement();
  value = request.getParameter(key);
  if( key.length() >7){
    System.out.println("\t" +key +"\t:" + value);
  }else{
    System.out.println("\t" +key +"\t\t:" + value);
  }
}
System.out.println("}");
//=====================================================================

String output="{";
if(api.equals("login")){
  String loginname = request.getParameter("loginname");
  String password = request.getParameter("pwd");
  boolean isAdmin = loginname.equals("admin");
  if( !isAdmin ) {
    output += ("\"ret\":\"1001\"");
  } else if (password.equals("87d9bb400c0634691f0e3baaf1e2fd0d") == false){
    output += ("\"ret\":\"1002\"");
  } else {
    output += ("\"ret\":\"0\"");
    output += (",\"data\":{");
    output += ("\"token\":\""+java.util.UUID.randomUUID().toString()+"\"");
    output += "}";
  }  
} else if( api.equals("bhdatacountmonitor") ){
  output += ("\"ret\":\"0\"");
  output += (",\"data\":{");
  output += ("\"finished\":\""+new Random().nextInt(50)+"\"");
  output += (",\"noset\":\""+new Random().nextInt(50)+"\"");
  output += (",\"collectdelay\":\""+new Random().nextInt(50)+"\"");
  output += (",\"nostart\":\""+new Random().nextInt(50)+"\"");
  output += "}";
} else if( api.equals("changepwd") ){
  output += ("\"ret\":\"1001\"");
  output += "}";
} else if( api.equals("detailtask") ){
  output += ("\"ret\":\"0\"");
  output += (",\"data\":{");
  output += ("\"planid\":\""+java.util.UUID.randomUUID().toString()+"\"");
  output += (",\"planname\":\"QkFTRTY05Yqg5a+G\"");
  output += (",\"endtime\":\"1464525929\"");
  output += (",\"type\":\"1\"");
  output += (",\"righttreelist\":[");
  for( int i=0; i<5; i++){
    if( i!=0){ output += (",");}
    output += ("{");
    output += ("\"id\":\"10"+i+"\"");
    output += (",\"name\":\"QkFTRTY05Yqg5a+G\"");
    output += ("}");
  }
  output += ("]}");
} else if( api.equals("planTree") ) {
  String str = "6Zqn6YGT5ZCN56ew";
  if( request.getParameter("type").equals("1") ){
    str = "5qGl5qKB5ZCN56ew";
  }
  output += ("\"ret\":\"0\"");
  output += (",\"data\":[");
  for( int i=0; i<20; i++){
    if( i!=0){ output += (",");}
    output += ("{");
    output += ("\"id\":\""+i+"\"");
    output += (",\"pid\":\"#\"");
    output += (",\"name\":\"QkFTRTY05Yqg5a+G\"");
    output += ("}");
    for( int j=0; j<5; j++){
      output += (",");
      output += ("{");
      output += ("\"id\":\""+(i+"0"+j)+"\"");
      output += (",\"pid\":\""+i+"\"");
      output += (",\"name\":\""+str+"\"");
      output += ("}");
    }
  }
  output += ("]");

} else if( api.equals("infodetail") ) {
  output += ("\"ret\":\"0\"");
  output += (",\"data\":{");
  output += ("\"name\":\"QkFTRTY05Yqg5a+G\"");
  output += (",\"code\":\"G"+new Random().nextInt(50000)+"\"");
  output += (",\"pertainline\":\"QkFTRTY05Yqg5a+G\"");
  output += (",\"length\":\""+new Random().nextInt(500)+"\"");
  output += (",\"widehigh\":\""+new Random().nextInt(500)+"*"+new Random().nextInt(500)+"\"");
  output += (",\"bhlist\":[");
  for( int i=0; i<5; i++){
    if( i!=0){ output += (",");}
    output += ("{");
    output += ("\"bjm\":\"QkFTRTY05Yqg5a+G\"");
    output += (",\"bhwz\":\"QkFTRTY05Yqg5a+G\"");
    output += (",\"bhdj\":\""+(i%5+1)+"\"");
    output += (",\"jcsj\":\"1464525929\"");
    output += (",\"bhzp\":\"https://www.baidu.com/img/bd_logo1.png\"");
    output += "}";
  }
  output += "]";
  output += "}";
} else {
  output += "\"ret\":\"0\"";
  if(api.indexOf("ist")!=-1 || api.indexOf("query")!=-1){
    output += (",\"data\":[");
  }
  if( api.equals("tasklist") ){
    for( int i=0; i<pageSize; i++){
      if( i!=0){ output += (",");}
      output += ("{");
      output += ("\"planid\":\""+java.util.UUID.randomUUID().toString()+"\"");
      output += (",\"planname\":\"QkFTRTY05Yqg5a+G\"");
      output += (",\"endtime\":\"1464525929\"");
      output += ("}");
    }
  } else if( api.equals("tasklistnopage") ) {
    for( int i=0;i<10;i++){
      if( i!=0){ output += (",");}
      output += ("{");
      output += ("\"planid\":\""+java.util.UUID.randomUUID().toString()+"\"");
      output += (",\"planname\":\"QkFTRTY05Yqg5a+G\"");
      output += ("}");
    }
  } else if( api.equals("linelist") ) {
    for( int i=0;i<pageSize;i++){
      if( i!=0){ output += (",");}
      output += ("{");
      output += ("\"linenum\":\"G0"+(i+1)+"\"");
      output += (",\"linename\":\"QkFTRTY05Yqg5a+G\"");
      output += ("}");
    }
  } else if( api.equals("bridgelist") ) {
    for( int i=0;i<10;i++){
      if( i!=0){ output += (",");}
      output += ("{");
      output += ("\"bridgenum\":\"B0"+(i+1)+"\"");
      output += (",\"bridgename\":\"QkFTRTY05Yqg5a+G\"");
      output += (",\"state\":\""+(i%5+1)+"\"");
      output += (",\"lon\":\"123.41"+i+"459\"");
      output += (",\"lat\":\"41.82"+i+"452\"");
      output += ("}");
    }
  }
  if(api.indexOf("ist")!=-1 || api.indexOf("query")!=-1){
    output += ("]");
  }
}

output += "}";
out.println(output);
System.out.println("SERVER ===> CLIENT ["+api+"]\r\n\t"+output);
%>