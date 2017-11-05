<?php
include_once 'includes/register.inc.php';
include_once 'includes/functions.php';
?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>Secure Login: Registration Form</title>
        <script type="text/JavaScript" src="scripts/sha512.js"></script>
        <script type="text/JavaScript" src="scripts/forms.js"></script>
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
              <a href="register.php" class="nav_item_right current_page">Register</a>
          <?php endif; ?>
        </div>

        <!-- Registration form to be output if the POST variables are not
        set or if the registration script caused an error. -->
        <h1 id="title">Register with us</h1>
        <?php
        if (!empty($error_msg)) {
            echo $error_msg;
        }
        ?>
        <ul>
            <li>Usernames may contain only digits, upper and lowercase letters and underscores</li>
            <li>Emails must have a valid email format</li>
            <li>Passwords must be at least 6 characters long</li>
            <li>Passwords must contain
                <ul>
                    <li>At least one uppercase letter (A..Z)</li>
                    <li>At least one lowercase letter (a..z)</li>
                    <li>At least one number (0..9)</li>
                </ul>
            </li>
            <li>Your password and confirmation must match exactly</li>
        </ul>
        <form action="<?php echo esc_url($_SERVER['REQUEST_URI']); ?>"
                method="post"
                name="registration_form">
            Username: <input type='text'
                name='username'
                id='username' /><br>
            Email: <input type="text" name="email" id="email" /><br>
            Password: <input type="password"
                             name="password"
                             id="password"/><br>
            Confirm password: <input type="password"
                                     name="confirmpwd"
                                     id="confirmpwd" /><br>
            <input type="button"
                   value="Register"
                   onclick="return regformhash(this.form,
                                   this.form.username,
                                   this.form.email,
                                   this.form.password,
                                   this.form.confirmpwd);" />
        </form>
        <p>Return to the <a href="logIn.php">login page</a>.</p>

        <div id="footer">
          <p>&copy 2017 D Benjamin Wang</p>
        </div>
    </body>
</html>
