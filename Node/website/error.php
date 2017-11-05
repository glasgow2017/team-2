<?php
$error = filter_input(INPUT_GET, 'err', $filter = FILTER_SANITIZE_STRING);

if (! $error) {
    $error = 'Oops! An unknown error happened.';
}
?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>Secure Login: Error</title>
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
            <h1>There was a problem</h1>
            <p class="error"><?php echo $error; ?></p>
        </div>

        <div id="footer">
          <p>&copy 2017 D Benjamin Wang</p>
        </div>
    </body>
</html>
