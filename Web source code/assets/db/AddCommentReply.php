<?php
header ( "Content-type:text/html;charset=utf-8" );
include("con.php");
 //接收参数
$content = $_POST["content"];
$id = $_POST["id"];


echo "content=",$content,"\n";


$sql =  "update comments set reply='$content' where id='$id';";

$result = mysqli_query($con, $sql);
if($result===false){
         echo "ERROR".mysqli_error($con);
         exit;
 }

echo mysqli_affected_rows($con);

?>