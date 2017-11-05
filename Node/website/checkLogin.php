<?php
include_once 'includes/db_connect.php';
include_once 'includes/functions.php';

sec_session_start();


$lc_success = login_check($mysqli);
if ($lc_success == 0){
    echo "Login check successful";
} else if($lc_success == 1) {
    echo "hashes don't match";
} else if ($lc_success == 2) {
    echo "User does not exist";
} else if ($lc_success == 3) {
    echo "Prepare function failed";
} else if ($lc_success == 4) {
    echo "Session variables not set";
} else {
    echo $_SESSION['HTTP_USER_AGENT'];

}

?>
