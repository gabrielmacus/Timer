<?php
/**
 * Created by PhpStorm.
 * User: Puers
 * Date: 02/10/2017
 * Time: 22:07
 */

define('BASE_PATH',dirname(__DIR__));

include ("db/autoload.php");

include ("lang/autoload.php");

include ("auth/autoload.php");

$db = new ActiveRecord();