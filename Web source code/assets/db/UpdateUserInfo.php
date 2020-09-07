<?php
header ( "Content-type:text/html;charset=utf-8" );
include("con.php");
// $college = $_REQUEST["college"]; //接收参数
// $number = $_REQUEST["number"];
// $mail = $_REQUEST["mail"];
// $user_name = $_REQUEST["user_name"];
// $avatarUrl = $_REQUEST["avatarUrl"];
// $openid = $_REQUEST["openid"];
$user_name = $_POST["username"];
$openid = $_POST["useropenid"];

$sql =  "update user_info set username='".$user_name."' WHERE openid = '$openid';";

$rs = mysqli_query($con, $sql);

if($rs===false){
    echo "ERROR".mysqli_error($con);
    exit;
}
$row = mysqli_affected_rows($con);
echo $row;//如果返回值大鱼0，成功；



?>