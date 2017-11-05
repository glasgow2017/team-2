<?php
include_once 'includes/db_connect.php';
include_once 'includes/functions.php';

sec_session_start();
 ?>
<!DOCTYPE html>
<html>
  <head>
    <title>benjylxwang.xyz</title>
    <link rel="stylesheet" href="origami.css"/>
    <link rel="stylesheet" href="styles.css"/>
    <link href="https://fonts.googleapis.com/css?family=Oswald|Roboto" rel="stylesheet"/>
  </head>

  <body>
      <!--Standard Nav Bar-->
      <div id="nav">
        <a href="https://benjylxwang.xyz/" class="nav_item">Home</a>
        <a href="photography.php" class="nav_item">Photography</a>
        <a href="origami.php" class="nav_item current_page">Origami</a>
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
        <!-- View window for full screen -->
        <img id="view" name="view" src="img/1.jpg"/>

        <!-- Thumbnail view (default) -->
        <div id="thumbs">
        </div>
      </div>

      <div id="footer">
        <p>&copy 2017 D Benjamin Wang</p>
      </div>
  </body>
</html>
