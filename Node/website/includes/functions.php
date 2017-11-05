<?php
include_once 'psl-config.php';

function sec_session_start() {
  $session_name = "sec_session_id";
  $secure = SECURE;

  //Stops Javascript accessing session id
  $httponly = true;

  // Force session to use only cookies
  if(ini_set('session.use_only_cookies', 1) == FALSE) {
    header("Location: ../error.php?err=Could not initiate a secure session (ini_set)");
    exit();
  }

  // Get cookie params
  $cookieParams = session_get_cookie_params();
  session_set_cookie_params($cookieParams["lifetime"], $cookieParams["path"], $cookieParams["domain"], $secure, $httponly);
  session_name($session_name);
  session_start();
  session_regenerate_id();
}

function login($email, $password, $mysqli) {
  if ($stmt = $mysqli->prepare("SELECT id, username, password
    FROM members
    WHERE email = ?
    LIMIT 1")) {
      $stmt->bind_param('s', $email);
      $stmt->execute();
      $stmt->store_result();

      //get variables from result
      $stmt->bind_result($user_id, $username, $db_password);
      $stmt->fetch();

      if($stmt->num_rows == 1) {
        //Check for login attempts
        if(checkbrute($user_id, $mysqli) == true) {
          //Account locked
          //Send reset link
          return 2;
        } else {
          //Check if passwords match
          if(password_verify($password, $db_password)) {
            //Password is correct
            $user_browser = $_SERVER['HTTP_USER_AGENT'];

            if($user_browser == "") {
                return 5;
            }

            //XSS protection
            $user_id = preg_replace("/[^0-9]+/", "", $user_id);
            $_SESSION['user_id'] = $user_id;

            //XSS protection
            $username = preg_replace("/[^a-zA-Z0-9_\-]+/", "", $username);
            $_SESSION['username'] = $username;
            $_SESSION['login_string'] = hash('sha512', $db_password.$user_browser);

            //Login Success
            return 1;
          } else {
            //Incorrect password
            $now = time();
            $mysqli->query("INSERT INTO login_attempts (user_id, time) VALUES ('$user_id', '$now')");
            return 3;
          }
        }
      } else {
        //No user exists
        return 4;
      }
    }
}

function checkbrute($userid, $mysqli) {
  //Get timestamp
  $now = time();

  //All login attempts are counted from the last two hours
  $valid_attempts = $now - ( 2 * 60 * 60);

  if($stmt = $mysqli->prepare("SELECT time FROM login_attempts WHERE user_id = ? AND time > '$valid_attempts'")){
    $stmt->bind_param('i', $userid);


    //execute query
    $stmt->execute();
    $stmt->store_result();

    if($stmt->num_rows > 5) {
      return true;
    } else {
      return false;
    }
  }
}

function login_check($mysqli) {
  //Check if session variables are set
  if (isset($_SESSION['user_id'], $_SESSION['username'], $_SESSION['login_string'])) {
    $user_id = $_SESSION['user_id'];
    $username = $_SESSION['username'];
    $login_string = $_SESSION['login_string'];

    //Get user-agent string of user
    $user_browser = $_SESSION['HTTP_USER_AGENT'];

    if($stmt = $mysqli->prepare("SELECT password FROM members WHERE id = ? LIMIT 1")) {
      $stmt->bind_param('i', $user_id);
      $stmt->execute();
      $stmt->store_result();

      if($stmt->num_rows == 1) {
        //User exists
        $stmt->bind_result($password);
        $stmt->fetch();
        $login_check = hash('sha512', $password.$user_browser);

        return $password;

        if(hash_equals($login_check, $login_string)) {
          return 0;
        } else {
          return 1;
        }
      } else {
        return 2;
      }
    } else {
      return 3;
    }
  } else {
    return 4;
  }
}

function esc_url($url) {
  if('' == $url) {
    return $url;
  }

  $url = preg_replace('|[^a-z0-9-~+_.?#=!&;,/:%@$\|*\'()\\x80-\\xff]|i', '', $url);

  $strip = array("%0d", "%0a", "%0D", "%0A");
  $url = (string) $url;

  $count = 1;

  while($count) {
    $url = str_replace($strip, '', $url, $count);
  }

  $url = str_replace(';//', '://', $url);

  $url = htmlentities($url);

  $url = str_replace('&amp;', '&#038:', $url);
  $url = str_replace("'", '&#039;', $url);

  if($url[0] !== '/') {
    return '';
  } else {
    return $url;
  }
}
 ?>
