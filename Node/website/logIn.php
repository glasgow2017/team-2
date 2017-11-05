<?php
include_once 'includes/db_connect.php';
include_once 'includes/functions.php';

sec_session_start();

if (login_check($mysqli) == true) {
    $logged = 'in';
} else {
    $logged = 'out';
}
?>
<!DOCTYPE html>
<html>
  <head>
    <title>Log In</title>
    <link rel="stylesheet" href="logIn.css"/>
    <link rel="stylesheet" href="styles.css"/>
    <script type="text/JavaScript" src="scripts/sha512.js"></script>
    <script type="text/JavaScript" src="scripts/forms.js"></script>
  </head>
  <body>
    <?php
        if (isset($_GET['error'])) {
            echo '<p class="error">Error Logging In!</p>';
        }
    ?>

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
              <a href="logIn.php" class="nav_item_right current_page">Log In</a>
              <a href="register.php" class="nav_item_right">Register</a>
          <?php endif; ?>
        </div>

        <div id="main">
            <h1>Log in to access more content!</h1>

          <form action="includes/process_login.php" method="post" name="login_form" id="login_form">
            <p>Email: <input type="text" class="text" name="email" id="email"/></p>
            <p>Password: <input class="text" type="password"
                             name="password"
                             id="password"/></p>
            <input type="button"
                   value="Login"
                   onclick="formhash(this.form, this.form.password);" />
          </form>

          <?php
                  if (login_check($mysqli) == 0) {
                                  echo '<p>Currently logged ' . $logged . ' as ' . htmlentities($_SESSION['username']) . '.</p>';

                      echo '<p>Do you want to change user? <a href="includes/process_logout.php">Log out</a>.</p>';
                  } else {
                                  echo '<p>Currently logged ' . $logged . '.</p>';
                                  echo "<p>If you don't have a login, please <a href='register.php'>register</a></p>";
                  }
          ?>
        </div>


        <div id="footer">
          <p>&copy 2017 D Benjamin Wang</p>
        </div>
  </body>
</html>
