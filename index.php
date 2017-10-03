<?php
include ("app/autoload.php");

?>
<!doctype html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link href="css/icon.css"
          rel="stylesheet">
    <link href="css/font.css" rel="stylesheet">
    <link href="css/styles.css" rel="stylesheet">
    <title><?php  echo $lang["login.title"];?></title>
</head>
<body>
<form action="app.php" method="post">
    <div class="block">
        <label><?php echo $lang["login.user"]?></label>
        <input name="user">
    </div>
    <div class="block">
        <label><?php echo $lang["login.pass"]?></label>
        <input name="password">
    </div>
    <div class="block">
        <button type="submit"><?php echo $lang["login.accept"]?></button>
    </div>
</form>
</body>
</html>