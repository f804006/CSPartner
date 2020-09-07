<?php
header ( "Content-type:text/html;charset=utf-8" );
include("con.php");
$openid = $_POST["useropenid"]; //接收参数


$sql =  "select * from user_info where openid = '$openid';";
$rs = mysqli_query($con, $sql);
$row = mysqli_fetch_assoc($rs);

class info{
    //public $avatarUrl;
    public $name;
    //public $college;
    //public $personal_id;
    //public $mailbox;
}
$obj = new info();

//$obj->avatarUrl = $row["avatarUrl"];
$obj->name = $row["username"];
//$obj->college = $row["college"];
//$obj->personal_id = $row["personal_id"];
//$obj->mailbox = $row["mailbox"];

echo json_encode($obj,JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);


?>