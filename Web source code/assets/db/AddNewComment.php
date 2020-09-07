<?php
header ( "Content-type:text/html;charset=utf-8" );
include("con.php");
 //接收参数
$content = $_POST["content"];
$openid = $_POST["useropenid"];
$time = $_POST["time"];
$schoolname = $_POST["schoolname"];

echo "content=",$content,"\n";


$sql =  "insert into comments(identification,content,username,time,school,reply)  values('$openid','$content','用户','$time','$schoolname','');";

$result = mysqli_query($con, $sql);
if($result===false){
         echo "ERROR".mysqli_error($con);
         exit;
 }
//3获取结果
echo mysqli_insert_id($con);
//返回0代表成功
?>