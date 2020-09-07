<?php
header ( "Content-type:text/html;charset=utf-8" );
include("con.php");
 //接收参数

$openid = $_POST["useropenid"];

$pool='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';//定义一个验证码池，验证码由其中几个字符组成
$word_length=6;//验证码长度
$code = '';//验证码
    for ($i = 0, $mt_rand_max = strlen($pool) - 1; $i < $word_length; $i++)
    {
        $code .= $pool[mt_rand(0, $mt_rand_max)];
    }

// $code = '新用户' + $code;
$sql =  "insert into user_info(openid,username)  values('$openid','$code');";

$result = mysqli_query($con, $sql);
if($result===false){
         echo "ERROR".mysqli_error($con);
         exit;
 }
//3获取结果
echo mysqli_insert_id($con);
//返回0代表成功
?>