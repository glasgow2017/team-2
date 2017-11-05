<?php
include_once 'includes/db_connect.php';
include_once 'includes/functions.php';

sec_session_start();
 ?>
<!DOCTYPE html>
<html>
  <head>
    <title>benjylxwang.xyz</title>
    <link rel="stylesheet" href="addPost.css"/>
    <link rel="stylesheet" href="styles.css"/>
    <script src="scripts/journal.js"></script>
    <script src="scripts/addPost.js"></script>
    <link href="https://fonts.googleapis.com/css?family=Oswald|Roboto" rel="stylesheet"/>
  </head>

  <body>
      <!--Standard Nav Bar-->
      <div id="nav">
        <a href="https://benjylxwang.xyz/" class="nav_item">Home</a>
        <a href="photography.php" class="nav_item">Photography</a>
        <a href="origami.php" class="nav_item">Origami</a>
        <?php if (login_check($mysqli) == 0): ?>
            <a href="journal.php" class="nav_item current_page">Journal</a>
        <?php endif; ?>
        <?php if (login_check($mysqli) == 0): ?>
            <a href="logOut.php" class="nav_item_right">Log Out</a>
        <?php endif; ?>
        <?php if (login_check($mysqli) != 0): ?>
            <a href="logIn.php" class="nav_item_right">Log In</a>
            <a href="register.php" class="nav_item_right">Register</a>
        <?php endif; ?>
      </div>

      <?php if (login_check($mysqli) == 0) : ?>
      <div id="main">
        <form action="/includes/process_newPost.php" method="post" id="addNewPost"/>
            <input type="text" id="title" name="title" placeholder="Title of Your Post"/>
            <input type="button" id="submit" value="Submit" onclick="" />
            <textarea id="content" name="content" placeholder="Add some content here..."></textarea>
        </form>
      </div>
        <?php else : ?>
            <p id="error">
                <span class="error">You are not authorized to access this page.</span> Please <a href="logIn.php">login</a>.
            </p>
        <?php endif; ?>

      <div id="footer">
        <p>&copy 2017 D Benjamin Wang</p>
      </div>
  </body>
</html>
