<?php
/**
 * Created by PhpStorm.
 * User: Puers
 * Date: 02/10/2017
 * Time: 22:07
 */

define('BASE_PATH',dirname(dirname(__FILE__)));
var_dump(BASE_PATH);
include ("db/autoload.php");

include (BASE_PATH."/vendor/autoload.php");

include ("lang/autoload.php");

include ("auth/autoload.php");

include ("websockets/Chat.php");

$db = new ActiveRecord();