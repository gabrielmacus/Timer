<?php
/**
 * Created by PhpStorm.
 * User: Gabriel
 * Date: 03/10/2017
 * Time: 12:09 PM
 */


require dirname(dirname(__DIR__)) . '/app/autoload.php';

use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;

$port=8080;

$server = IoServer::factory(
    new HttpServer(
        new WsServer(
            new Chat()
        )
    ),
    $port
);

$server->run();