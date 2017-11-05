<?php
include_once 'db_connect.php';
include_once 'psl-config.php';
include_once 'functions.php';

sec_session_start();

if(isset($_POST['email'], $_POST['p'])){
    $email = $_POST['email'];
    $password = $_POST['p'];
    $login_success = login($email, $password, $mysqli);

    if ($login_success == 1) {
        //Login Success
        //header('Location: ../photography.php'); // REPLACE
        header('Location: ../photography.php'); //For checking function login_check()
    } else if ($login_success == 2) {
        //Account locked
        echo 'Account locked';
    } else if ($login_success == 3) {
        //Bad password
        echo 'Bad password';
    } else if ($login_success == 4) {
        //No user exists
        echo 'No such user exists. Please register.';
    } else if ($login_success == 5) {
        echo 'Browser string empty';
    } else {
        //Login Failed
        header('Location: ../error.php?error=1');
    }
} else {
  echo 'Invalid Request';
}

?>
