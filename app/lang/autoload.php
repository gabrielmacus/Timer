<?php
/**
 * Created by PhpStorm.
 * User: Puers
 * Date: 02/10/2017
 * Time: 22:27
 */

$lang ="es";

$lang= json_decode(file_get_contents(BASE_PATH."/app/lang/{$lang}.json"),true);
