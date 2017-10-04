<?php
include ("app/autoload.php");

?>
<!DOCTYPE html>
<html>
<!--
  * Please see the included README.md file for license terms and conditions.
  -->
<head>
    <title>TimerApp</title>
    <meta http-equiv="Content-type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">

     <script src="js/angular.min.js"></script>
    <script src="js/angular-route.min.js"></script>
    <script src="js/jquery-param.min.js"></script>
    <script src="js/angular-websocket.min.js"></script>
    <link href="css/icon.css"
          rel="stylesheet">
    <link href="css/font.css" rel="stylesheet">
    <link href="css/styles.css" rel="stylesheet">

</head>
<body data-ng-app="app" >

<?php
try
{

include ("app/auth/check-login.php");
?>
<script>
    wsUrl='ws://localhost:8080';
    var app = angular.module('app', ['ngRoute','ngWebSocket']);
</script>

<script src="js/controllers/timerController.js"></script>

<script>

    app.config(function($routeProvider) {
        $routeProvider

            .when("/", {
                templateUrl : "views/timerManager.html",
                controller:'timerController'
            })
            .when("/timer", {
                templateUrl : "views/timer.html",
                controller:'timerController'
            })
    });
</script>
<section  data-ng-style='containerStyle' class="animated main-container" data-ng-view>
</section>
    <?php
}
catch (Exception $e)
{

    header("Location: index.php");
    exit();

}
?>

</body>
</html>
