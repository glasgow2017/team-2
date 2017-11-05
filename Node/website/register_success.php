<?php
include_once 'includes/db_connect.php';
include_once 'includes/functions.php';

sec_session_start();
 ?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>Secure Login: Registration Success</title>
        <link rel="stylesheet" href="styles.css" />
    </head>
    <body>
        <!--Standard Nav Bar-->
        <div id="nav">
          <a href="https://benjylxwang.xyz/" class="nav_item">Home</a>
          <a href="photography.php" class="nav_item">Photography</a>
          <a href="origami.php" class="nav_item">Origami</a>
          <?php if (login_check($mysqli) == 0): ?>
              <a href="journal.php" class="nav_item">Journal</a>
          <?php endif; ?>
          <?php if (login_check($mysqli) == 0): ?>
              <a href="logOut.php" class="nav_item_right">Log Out</a>
          <?php endif; ?>
          <?php if (login_check($mysqli) != 0): ?>
              <a href="logIn.php" class="nav_item_right">Log In</a>
              <a href="register.php" class="nav_item_right">Register</a>
          <?php endif; ?>
        </div>


        <div id="main">
          <h1>Registration successful!</h1>
          <p>You can now go back to the <a href="index.php">login page</a> and log in</p>
        </div>

        <div id="footer">
          <p>&copy 2017 D Benjamin Wang</p>
        </div>
    </body>
</html>
