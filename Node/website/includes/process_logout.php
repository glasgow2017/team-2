<?php
include_once 'function.php';
sec_session_start();

//Unset variables
$_SESSION = array();

$params = session_get_cookie_params();

//Delete cookie
setcookie(session_name(), '', time() - 42000, $params["path"], $params["domain"], $params["secure"], $params["httponly"]);

//Destory Session
session_destroy();
header("Location: ../index.html");
 ?>
