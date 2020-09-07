<?php
header ( "Content-type:text/html;charset=utf-8" );
include("con.php");
$schoolname = $_POST["schoolname"]; //接收参数

$sql =  "select * from comments where school = '$schoolname';";
$rs = mysqli_query($con, $sql);
$data = array();
if (mysqli_num_rows($rs) > 0) {
    while($row = mysqli_fetch_assoc($rs)) {
        $data[] = $row;
        }
        echo json_encode($data,JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);//将请求结果转换为json格式
}



?>